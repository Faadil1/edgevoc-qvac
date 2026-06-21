# TEST EVIDENCE

## Final technical state

The submitted build is the original implementation of `src/edgevoc.js`
(with a Windows CRLF compatibility fix applied for the final proof
environment below). Two grounding/citation prompt patches were
attempted during audit and both caused the prompt to exceed the Llama
3.2 1B context window; both were rolled back and are not part of this
submission.

## Final proof environment

Personal Windows laptop:

- Manufacturer/model: HP ProBook 455 15.6 inch G9 Notebook PC
- OS: Microsoft Windows 11 Pro 10.0.26200
- CPU: AMD Ryzen 7 5825U with Radeon Graphics
- RAM: 15.3 GB
- Node.js: v24.16.0 / npm: 11.13.0

Full hardware/software details: `evidence/hardware-windows.txt`.
Full run log: `evidence/run-log.txt`.

Google Cloud Shell was used **only as an earlier feasibility spike**
(see `evidence/SPIKE-RESULT.md`) to confirm the `@qvac/sdk` install →
model download → load → streamed completion lifecycle worked at all,
before moving to consumer hardware. It is not the final proof
environment for this submission.

## What has been proven

| Check | Environment | Result | Evidence |
|---|---|---|---|
| `@qvac/sdk` lifecycle (install/download/load/completion) — earlier feasibility spike | Google Cloud Shell | PASS | `evidence/SPIKE-RESULT.md` |
| `@qvac/sdk` installs | Windows laptop (HP ProBook 455 G9) | PASS | `evidence/run-log.txt` |
| Node.js ≥ v22.17 | Windows laptop (v24.16.0) | PASS | `evidence/hardware-windows.txt` |
| Model download (`LLAMA_3_2_1B_INST_Q4_0`), stored under `.qvac/models` | Windows laptop | PASS | `evidence/run-log.txt` |
| Model load via `@qvac/sdk` | Windows laptop | PASS | `evidence/run-log.txt` |
| Completion via `@qvac/sdk` | Windows laptop | PASS | `evidence/run-log.txt` |
| **EdgeVoC full pipeline** (`src/edgevoc.js`, end-to-end on `data/sample-feedback.csv`, 15 rows) | Windows laptop (consumer hardware) | **PASS — PROVEN** | `evidence/run-log.txt` |
| Report contains all four required sections (Themes, Pain Points, Risk Signals, Executive Brief) | Windows laptop | PASS | `output/edgevoc-report.md` |

## Audit finding and resolution

During audit, the generated report's mention of "GDPR" was checked
against `data/sample-feedback.csv`. **Finding: supported.** Row [10]
explicitly states: "Asked twice about GDPR data deletion." This was
not a hallucination.

Two follow-up patches were attempted to make per-bullet row-ID
citation and strict fact-grounding structural rather than incidental.
**Both patches caused completion to exceed the Llama 3.2 1B context
window**, and both were rolled back. The submitted build is the
original prompt, which does not enforce universal per-bullet
citation.

**Honest characterization of the current report's citation coverage:**
Risk Signals bullets in the actual generated report carry row-ID
citations. Themes and Pain Points bullets do **not** consistently
carry citations. This is a disclosed limitation of the submitted
build, not a claim that citation coverage is complete everywhere.

## What this means going forward

- **Strict automated citation enforcement** (verifying every bullet
  against its cited row ID in code, and rejecting/regenerating output
  that fails) **remains a limitation and future improvement** — it is
  not implemented in this submission.
- The 1B model may not always follow strict formatting or citation
  constraints reliably, especially under added grounding instructions
  that increase prompt/output length. This is documented in
  `LIMITATIONS.md`.
- No GPU acceleration is claimed anywhere — all confirmed runs (Cloud
  Shell spike and final Windows laptop proof) used CPU-only inference.

## Reproduction command (for judges)

```bash
git clone <repo-url>
cd edgevoc
npm install
node src/edgevoc.js data/sample-feedback.csv
cat output/edgevoc-report.md
```
