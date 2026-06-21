#!/usr/bin/env node
/**
 * EdgeVoC — Private Offline Feedback Analyst
 *
 * Single-command CLI that reads a local CSV of customer feedback and
 * produces a Markdown report (themes, pain points, risk signals,
 * executive brief) using ONLY local inference via @qvac/sdk.
 *
 * No cloud AI calls are made at any point in this script. The only
 * network activity possible is the QVAC SDK's own model
 * download/registry step, which is a one-time local-model fetch, not
 * an inference API call.
 *
 * Usage:
 *   node src/edgevoc.js data/sample-feedback.csv
 *
 * Output:
 *   output/edgevoc-report.md
 */

import fs from "node:fs";
import path from "node:path";
import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel,
} from "@qvac/sdk";

const INPUT_PATH = process.argv[2] || "data/sample-feedback.csv";
const OUTPUT_DIR = "output";
const OUTPUT_PATH = path.join(OUTPUT_DIR, "edgevoc-report.md");

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf8").trim();
  const lines = raw.split(/\r?\n/);
  const header = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    // Minimal CSV split tolerant of quoted commas-free fields in this dataset.
    const match = line.trim().match(/^(\d+),([^,]+),"(.+)"$/);
    if (!match) return null;
    const [, id, source, text] = match;
    return { id, source, text };
  }).filter(Boolean);
  if (rows.length === 0) {
    throw new Error("No valid rows parsed from input CSV.");
  }
  return { header, rows };
}

function buildPrompt(rows) {
  const feedbackBlock = rows
    .map((r) => `[${r.id}] (${r.source}) ${r.text}`)
    .join("\n");

  return [
    {
      role: "system",
      content:
        "You are an offline feedback analyst. You only see the feedback " +
        "provided in the user message. Respond in exactly this Markdown " +
        "structure with these four headings, nothing else:\n" +
        "## Themes\n## Pain Points\n## Risk Signals\n## Executive Brief\n" +
        "Under each heading use short bullet points. Under Risk Signals, " +
        "flag anything related to billing errors, data loss, compliance " +
        "(e.g. GDPR), or churn risk. Keep the Executive Brief to 3-5 " +
        "sentences. Be concrete and reference feedback IDs in brackets " +
        "like [3] where relevant. Do not invent feedback not present " +
        "in the input.",
    },
    {
      role: "user",
      content: `Analyze this customer feedback batch:\n\n${feedbackBlock}`,
    },
  ];
}

async function main() {
  const startedAt = new Date().toISOString();
  console.log(`[edgevoc] start: ${startedAt}`);
  console.log(`[edgevoc] input: ${INPUT_PATH}`);

  let parsed;
  try {
    parsed = readCsv(INPUT_PATH);
  } catch (err) {
    console.error(`[edgevoc] FATAL: could not read input CSV — ${err.message}`);
    process.exit(1);
  }
  console.log(`[edgevoc] parsed ${parsed.rows.length} feedback rows`);

  let modelId;
  try {
    console.log("[edgevoc] loading local model via @qvac/sdk ...");
    modelId = await loadModel({
      modelSrc: LLAMA_3_2_1B_INST_Q4_0,
      onProgress: (p) => console.log("[edgevoc:model]", p),
    });
    console.log(`[edgevoc] model loaded. modelId=${modelId}`);
  } catch (err) {
    console.error(
      "[edgevoc] FATAL: local model failed to load via @qvac/sdk.\n" +
        "This usually means either (a) the model has not finished " +
        "downloading/caching locally yet, or (b) no compatible " +
        "inference backend (CPU/GPU) was found on this device.\n" +
        `Underlying error: ${err.message || err}`
    );
    process.exit(1);
  }

  let reportBody;
  try {
    const history = buildPrompt(parsed.rows);
    console.log("[edgevoc] running local completion (this is on-device, not a cloud API call) ...");
    const result = completion({ modelId, history, stream: true });

    let buffer = "";
    for await (const token of result.tokenStream) {
      process.stdout.write(token);
      buffer += token;
    }
    console.log("\n[edgevoc] completion finished.");
    reportBody = buffer.trim();
  } catch (err) {
    console.error(`[edgevoc] FATAL: inference failed — ${err.message || err}`);
    try {
      await unloadModel({ modelId });
    } catch (_) {
      /* best-effort cleanup */
    }
    process.exit(1);
  }

  try {
    await unloadModel({ modelId });
    console.log("[edgevoc] model unloaded.");
  } catch (err) {
    console.warn(`[edgevoc] WARNING: model unload failed (non-fatal) — ${err.message || err}`);
  }

  const finishedAt = new Date().toISOString();
  const fullReport = [
    "# EdgeVoC Feedback Analysis Report",
    "",
    `Generated: ${finishedAt}`,
    `Input: \`${INPUT_PATH}\` (${parsed.rows.length} feedback rows)`,
    "Inference: 100% local via `@qvac/sdk`, model `LLAMA_3_2_1B_INST_Q4_0`. No cloud AI API was called to produce this report.",
    "",
    "---",
    "",
    reportBody,
    "",
    "---",
    "",
    "_This report was generated entirely on-device. See `evidence/SPIKE-RESULT.md`, `evidence/run-log.txt`, and `LIMITATIONS.md` for hardware/runtime disclosure._",
  ].join("\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, fullReport, "utf8");
  console.log(`[edgevoc] report written to ${OUTPUT_PATH}`);
  console.log(`[edgevoc] start: ${startedAt} | end: ${finishedAt}`);
}

main().catch((err) => {
  console.error("[edgevoc] FATAL: unhandled error —", err);
  process.exit(1);
});
