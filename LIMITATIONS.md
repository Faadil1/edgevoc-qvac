# LIMITATIONS

This document exists so that no claim in this submission is taken on
faith. Anything not explicitly proven here should be treated as
unproven.

## Hardware / environment disclosure

- Both the QVAC SDK feasibility spike **and** the full `src/edgevoc.js`
  pipeline run (15 input rows, model load 7,245 ms, completion 31,651
  ms, ~42s total) were executed in **Google Cloud Shell**, not on
  consumer hardware (laptop/phone/SBC).
- Cloud Shell is a cloud-hosted development environment. It was used
  here purely as a **verification environment for the SDK lifecycle
  and the full tool pipeline** (does the install work, does the model
  download, does local inference run, does the CLI produce a correct
  report end-to-end) — not as a stand-in for the "runs on consumer
  hardware" claim the QVAC Hackathon brief asks for.
- **No claim is made that this project has been proven to run on
  consumer hardware** unless this file has been updated with a
  specific consumer-hardware run log (machine spec + `evidence/run-log.txt`
  generated on that machine). Until that update happens, treat the
  consumer-hardware claim as **not yet demonstrated**.

## GPU / acceleration disclosure

- During both the spike and the full pipeline run, the underlying
  `llama.cpp` backend reported **no usable GPU found**. All confirmed
  inference in this project (model load: 7,245 ms; completion: 31,651
  ms) ran **CPU-only**.
- **No claim of GPU acceleration is made anywhere in this project.**
  If a future run on different hardware does use GPU acceleration via
  Vulkan/Metal/CUDA (per the QVAC SDK's supported backends), this file
  must be updated with that specific evidence before any such claim is
  made publicly.

## No-cloud-AI-inference statement

- `src/edgevoc.js` performs all text analysis through `@qvac/sdk`'s
  local `loadModel()` / `completion()` / `unloadModel()` functions
  only.
- No call to any cloud LLM API (OpenAI, Anthropic, Google, etc.) is
  present anywhere in this codebase. The only network activity this
  tool can ever trigger is the QVAC SDK's own one-time local model
  download/registry step — not a per-request inference API call.
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
- The submitted build is the **original, unmodified prompt** — not the
  grounding/citation-patched version. Two patches requiring per-bullet
  row-ID citation and strict fact-only grounding on every bullet were
  attempted during audit. Both caused completion to **exceed the
  Llama 3.2 1B context window**, and both were rolled back. This is a
  disclosed model/context-window constraint, not a silent omission.
- **The 1B model may not always follow strict formatting or citation
  constraints reliably.** In the actual generated report from the
  final proven run, Risk Signals bullets carry row-ID citations;
  Themes and Pain Points bullets do not consistently. No claim is made
  that citation coverage is complete across all sections.
- `src/edgevoc.js` does not parse or validate the model's output
  structure or citations in code — there is no automated check that
  every bullet cites a real, supporting row ID, or that the four
  required headings are present. A human should spot-check
  `output/edgevoc-report.md` against `data/sample-feedback.csv` before
  relying on any specific run.
- **Automated citation enforcement (verifying every bullet against its
  cited row ID, and rejecting/regenerating output that fails) is
  future work** and is not implemented in this submission.
- No automated test suite exists yet for this project. Confidence is
  based on the manual spike run documented in `evidence/SPIKE-RESULT.md`
  and the full-pipeline run documented in `evidence/run-log.txt`.
