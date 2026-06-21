# TEST EVIDENCE

## Final technical state

The submitted build is the **original, unmodified implementation** of
`src/edgevoc.js` — the version that produced a complete, successful
end-to-end run. Two grounding/citation prompt patches were attempted
during audit (requiring per-bullet row-ID citation and strict fact
grounding on every Theme/Pain Point/Risk Signal bullet). Both patches
caused the prompt to exceed the Llama 3.2 1B context window during
execution. Both were rolled back. They are not part of this
submission and are retained outside this repository for reference
only — they must not be presented as the final run.

## What has been proven

| Check | Environment | Result | Evidence |
|---|---|---|---|
| `@qvac/sdk` installs | Google Cloud Shell | PASS | `evidence/SPIKE-RESULT.md` |
| Node.js ≥ v22.17 | Google Cloud Shell (v24.16.0) | PASS | `evidence/SPIKE-RESULT.md` |
| Model download (`LLAMA_3_2_1B_INST_Q4_0`, 773 MB) | Google Cloud Shell | PASS | `evidence/SPIKE-RESULT.md` |
| Checksum validation | Google Cloud Shell | PASS | `evidence/SPIKE-RESULT.md` |
| `loadModel()` | Google Cloud Shell | PASS | `evidence/SPIKE-RESULT.md` |
| Streamed `completion()` | Google Cloud Shell | PASS | `evidence/SPIKE-RESULT.md` |
| **EdgeVoC full pipeline** (original `src/edgevoc.js`, end-to-end on `data/sample-feedback.csv`) | Google Cloud Shell | **PASS — PROVEN** | `evidence/run-log.txt` |

### Full pipeline run details (final, proven build)

- Input rows parsed: 15
- Model: `LLAMA_3_2_1B_INST_Q4_0`, cached model validated and loaded: PASS
- Model load duration: 7,245 ms
- Completion duration: 31,651 ms
- Total execution: ~42 seconds
- CPU-only inference (no usable GPU)
- No external AI API called
- Report generated: `output/edgevoc-report.md`
- Log captured: `evidence/run-log.txt`

## Audit finding and resolution

During audit, the generated report's mention of "GDPR" was checked
against `data/sample-feedback.csv`. **Finding: supported.** Row [10]
explicitly states: "Asked twice about GDPR data deletion." This was
not a hallucination.

Two follow-up patches were attempted to make citation/grounding a
structural guarantee rather than incidental, requiring a row-ID
citation on every Theme/Pain Point/Risk Signal bullet plus strict
fact-only constraints. **Both patches caused completion to exceed the
Llama 3.2 1B context window**, and both were rolled back. The
submitted build is the original prompt, which does not enforce
universal per-bullet citation.

**Honest characterization of the current report's citation coverage:**
Risk Signals bullets in the actual generated report carry row-ID
citations. Themes and Pain Points bullets do **not** consistently
carry citations. This is a real, disclosed limitation of the final
submitted build — not a claim that citation coverage is complete
everywhere.

## What this means going forward

- Automated, structurally-enforced citation checking (verifying every
  bullet cites a real, supporting row ID) is **future work**, not part
  of this submission.
- The 1B model may not always follow strict formatting or citation
  constraints reliably, especially under added grounding instructions
  that increase prompt/output length. This is a known limitation of
  small on-device models, documented in `LIMITATIONS.md`.

## Reproduction command (for judges)

```bash
git clone <repo-url>
cd edgevoc
npm install
node src/edgevoc.js data/sample-feedback.csv
cat output/edgevoc-report.md
```
