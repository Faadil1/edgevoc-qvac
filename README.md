# EdgeVoC — Private Offline Feedback Analyst

A single-command CLI that analyzes sensitive customer feedback
(support tickets, app reviews, survey responses) entirely **on-device**
using [`@qvac/sdk`](https://docs.qvac.tether.io/) — no cloud AI API is
ever called.

Built for **QVAC Hackathon I — Unleash Edge AI** (Tether), June 2026.

## What it does

Reads a CSV of customer feedback and produces a Markdown report with:

- **Themes**
- **Pain Points**
- **Risk Signals** (billing, data loss, compliance/GDPR, churn risk)
- **Executive Brief**

All analysis happens locally via a small LLM (`LLAMA_3_2_1B_INST_Q4_0`)
loaded and run through `@qvac/sdk`. The feedback text never leaves the
machine running the tool.

## Requirements

- Node.js **≥ v22.17** (required by `@qvac/sdk`)
- ~1 GB free disk for the one-time local model download
- See [QVAC SDK system requirements](https://docs.qvac.tether.io/system-requirements/)
  for GPU/platform compatibility. **CPU-only inference also works** —
  see `LIMITATIONS.md`.

## Install & run

```bash
git clone <repo-url>
cd edgevoc
npm install
node src/edgevoc.js data/sample-feedback.csv
```

The report is written to `output/edgevoc-report.md` and also streamed
to stdout as it's generated.

To regenerate the evidence log used in this submission:

```bash
node src/edgevoc.js data/sample-feedback.csv > evidence/run-log.txt 2>&1
```

## Project structure

```
edgevoc/
├── README.md              ← you are here
├── LICENSE                 MIT
├── package.json
├── src/edgevoc.js           the entire tool — one file, one command
├── data/sample-feedback.csv synthetic sample input (no real PII)
├── output/edgevoc-report.md generated report (created when you run the tool)
├── evidence/
│   ├── SPIKE-RESULT.md     proof the @qvac/sdk lifecycle works (Cloud Shell run)
│   └── run-log.txt         exact stdout/stderr of the full pipeline run
├── TEST-EVIDENCE.md         what's proven, what's not, how to verify
├── LIMITATIONS.md           hardware/GPU/dataset disclosures — read this
└── SUBMISSION.md            hackathon submission framing
```

## What is and isn't proven right now

This README will not claim more than has been demonstrated. The final
build is the **original proven implementation** — the version that
produced a complete, successful end-to-end run. Two grounding/citation
prompt patches were attempted during audit and both caused the prompt
to exceed the Llama 3.2 1B context window; they were rolled back and
are not part of this submission.

See:

- `evidence/SPIKE-RESULT.md` — confirms the `@qvac/sdk` install → model
  download → load → streamed completion lifecycle works (Google Cloud
  Shell, CPU-only).
- `TEST-EVIDENCE.md` — the real, final pipeline result (15 rows,
  PROVEN) and exactly what is and isn't covered by it.
- `LIMITATIONS.md` — explicit disclosure on hardware, GPU, dataset,
  and known formatting/citation limitations of the 1B model.

In the current report, **Risk Signals bullets carry row-ID citations;
Themes and Pain Points bullets do not consistently**. This is a known
limitation of unconstrained 1B-model output, not a bug introduced by
this rollback — see `LIMITATIONS.md`.

## No-cloud-AI statement

This tool never sends your feedback data to any third-party AI API.
All inference is local, via `@qvac/sdk`. The only network call this
tool can trigger is the SDK's own one-time model download — not a
per-request inference call.

## License

MIT — see `LICENSE`.
