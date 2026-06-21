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
│   ├── SPIKE-RESULT.md     earlier feasibility spike (Google Cloud Shell)
│   ├── run-log.txt         final proof run log (Windows laptop)
│   └── hardware-windows.txt final proof environment hardware/software spec
├── TEST-EVIDENCE.md         what's proven, on which environment
├── LIMITATIONS.md           hardware/GPU/dataset disclosures — read this
└── SUBMISSION.md            hackathon submission framing
```

## What is proven, and on what hardware

This is a personal-laptop, consumer-hardware proof of `@qvac/sdk`
local inference — not a cloud-only demo.

**Final proof environment: personal Windows laptop.**

- Manufacturer/model: HP ProBook 455 15.6 inch G9 Notebook PC
- OS: Microsoft Windows 11 Pro 10.0.26200
- CPU: AMD Ryzen 7 5825U with Radeon Graphics
- RAM: 15.3 GB
- Node.js: v24.16.0 / npm: 11.13.0

On this machine: `data/sample-feedback.csv` (15 rows) was parsed,
`LLAMA_3_2_1B_INST_Q4_0` was downloaded and stored locally under
`.qvac/models`, loaded, and run through `@qvac/sdk`'s local
`completion()` API. No external AI API was used. Completion succeeded
and the report was written to `output/edgevoc-report.md`, containing
all four required sections: Themes, Pain Points, Risk Signals, and
Executive Brief.

A **Windows CRLF compatibility fix** was applied in `src/edgevoc.js`
to support this environment.

Google Cloud Shell was used earlier in this project only as a
feasibility spike (confirming the `@qvac/sdk` install → model download
→ load → streamed completion lifecycle works at all) — it is not the
final proof environment. See `evidence/SPIKE-RESULT.md` for that
earlier spike, and `evidence/run-log.txt` plus
`evidence/hardware-windows.txt` for the final Windows laptop proof.

See `TEST-EVIDENCE.md` and `LIMITATIONS.md` for full detail, including
the citation-coverage limitation in the current report.

## No-cloud-AI statement

This tool never sends your feedback data to any third-party AI API.
All inference is local, via `@qvac/sdk`. The only network call this
tool can trigger is the SDK's own one-time model download — not a
per-request inference call.

## License

MIT — see `LICENSE`.
