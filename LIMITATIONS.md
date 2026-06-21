# LIMITATIONS

This document exists so that no claim in this submission is taken on
faith. Anything not explicitly proven here should be treated as
unproven.

## Hardware / environment disclosure

- **Final proof environment: a personal Windows laptop** — HP ProBook
  455 15.6 inch G9 Notebook PC, Microsoft Windows 11 Pro 10.0.26200,
  AMD Ryzen 7 5825U with Radeon Graphics, 15.3 GB RAM, Node.js
  v24.16.0, npm 11.13.0. This is consumer hardware. Full spec:
  `evidence/hardware-windows.txt`.
- On this machine, the full `src/edgevoc.js` pipeline parsed 15 input
  rows, downloaded and stored `LLAMA_3_2_1B_INST_Q4_0` locally under
  `.qvac/models`, loaded it, ran completion through `@qvac/sdk`, and
  wrote `output/edgevoc-report.md` containing all four required
  sections (Themes, Pain Points, Risk Signals, Executive Brief). Full
  log: `evidence/run-log.txt`.
- **Google Cloud Shell was used only as an earlier feasibility spike**
  (see `evidence/SPIKE-RESULT.md`), to confirm before moving to
  consumer hardware that the `@qvac/sdk` install → model download →
  load → streamed completion lifecycle worked at all. It is not the
  environment this submission's consumer-hardware claim is based on.
- A Windows CRLF compatibility fix was applied in `src/edgevoc.js` to
  support this final proof environment.

## GPU / acceleration disclosure

- **No claim of GPU acceleration is made anywhere in this project.**
  All confirmed inference — both the earlier Google Cloud Shell spike
  and the final Windows laptop proof run — used CPU-only inference. No
  GPU/Vulkan/Metal/CUDA acceleration is asserted for either
  environment.
- If a future run does use GPU acceleration via one of the QVAC SDK's
  supported backends, this file must be updated with that specific
  evidence before any such claim is made publicly.

## No-cloud-AI-inference statement

- `src/edgevoc.js` performs all text analysis through `@qvac/sdk`'s
  local `loadModel()` / `completion()` / `unloadModel()` functions
  only.
- No call to any cloud LLM API (OpenAI, Anthropic, Google, etc.) is
  present anywhere in this codebase. The only network activity this
  tool can ever trigger is the QVAC SDK's own one-time local model
  download/registry step — not a per-request inference API call. On
  the final Windows laptop run, no external AI API was used.
- This statement applies to the code as written. It is the
  responsibility of anyone modifying this code to preserve this
  property and update this document if it changes.

## Dataset disclosure

- `data/sample-feedback.csv` is a synthetic, fabricated dataset
  written for this project. It does not contain real customer data,
  real company names, or any personally identifiable information.

## Known functional limitations

- The CSV parser in `src/edgevoc.js` is intentionally minimal (regex-based,
  expects exactly one quoted text field per row) and is not a general-purpose
  CSV parser. It is sufficient for the bundled sample dataset but will need
  hardening (e.g. a real CSV library) before being trusted on arbitrary
  real-world exports.
- Model output is not deterministic by default at the SDK level; the
  same input may produce slightly different phrasing across runs even
  with the same model and prompt.
- The submitted build is the **original, unmodified prompt** (plus the
  Windows CRLF compatibility fix) — not a grounding/citation-patched
  version. Two patches requiring per-bullet row-ID citation and strict
  fact-only grounding on every bullet were attempted during audit.
  Both caused completion to **exceed the Llama 3.2 1B context
  window**, and both were rolled back. This is a disclosed
  model/context-window constraint, not a silent omission.
- **The 1B model may not always follow strict formatting or citation
  constraints reliably.** In the final generated report, Risk Signals
  bullets carry row-ID citations; Themes and Pain Points bullets do
  not consistently. No claim is made that citation coverage is
  complete across all sections.
- `src/edgevoc.js` does not parse or validate the model's output
  structure or citations in code — there is no automated check that
  every bullet cites a real, supporting row ID, or that the four
  required headings are present. A human should spot-check
  `output/edgevoc-report.md` against `data/sample-feedback.csv` before
  relying on any specific run.
- **Strict automated citation enforcement (verifying every bullet
  against its cited row ID, and rejecting/regenerating output that
  fails) remains a limitation and future improvement** — it is not
  implemented in this submission.
- No automated test suite exists yet for this project. Confidence is
  based on the earlier feasibility spike documented in
  `evidence/SPIKE-RESULT.md` and the final Windows laptop proof run
  documented in `evidence/run-log.txt` and
  `evidence/hardware-windows.txt`.
