# SUBMISSION — EdgeVoC: Private Offline Feedback Analyst

## Hackathon

QVAC Hackathon I — Unleash Edge AI (Tether), June 1–21, 2026.

## One-line pitch

A single CLI command that turns sensitive customer feedback into a
themes/pain-points/risk/executive-brief report, entirely on-device,
using `@qvac/sdk` — the feedback text never leaves the machine it runs
on.

## What this is

`EdgeVoC` is a narrow, local-first command-line tool. It reads a CSV
of customer feedback (support tickets, app reviews, survey responses)
and produces a structured Markdown analysis using a local LLM loaded
and run entirely through `@qvac/sdk`. No cloud AI API is called at any
point.

## Why this fits the QVAC brief

- **Privacy**: feedback often contains sensitive complaints (billing
  disputes, GDPR questions, security concerns). Running analysis
  on-device means this text is never transmitted to a third-party AI
  vendor.
- **Cost**: no per-token cloud inference billing — the only cost is
  the one-time local model download.
- **Resilience**: works fully offline once the model is cached
  locally (per QVAC SDK's documented offline support).
- **Narrow scope, real evidence**: this is intentionally not a
  general-purpose chatbot or wrapper. It does one job — feedback
  triage — and every claim about it is backed by a logged run.

## Final proof environment: personal Windows laptop

- Manufacturer/model: HP ProBook 455 15.6 inch G9 Notebook PC
- OS: Microsoft Windows 11 Pro 10.0.26200
- CPU: AMD Ryzen 7 5825U with Radeon Graphics
- RAM: 15.3 GB
- Node.js: v24.16.0 / npm: 11.13.0

On this machine: 15 feedback rows parsed, `LLAMA_3_2_1B_INST_Q4_0`
downloaded and stored locally under `.qvac/models`, loaded, and run
through `@qvac/sdk`'s local `completion()` API. No external AI API was
used. Completion succeeded and `output/edgevoc-report.md` was written
successfully, containing all four required sections: Themes, Pain
Points, Risk Signals, and Executive Brief. A Windows CRLF
compatibility fix was applied in `src/edgevoc.js` to support this
environment. Hardware/software spec: `evidence/hardware-windows.txt`.
Full run log: `evidence/run-log.txt`.

**Google Cloud Shell was used only as an earlier feasibility spike**
(`evidence/SPIKE-RESULT.md`) — before this final consumer-hardware
proof, to confirm the `@qvac/sdk` lifecycle worked at all. It is not
the environment this submission's consumer-hardware claim rests on.

## What is proven (see LIMITATIONS.md and TEST-EVIDENCE.md for full detail)

- **Proven on consumer hardware**: the full `src/edgevoc.js` pipeline,
  end-to-end, on the Windows laptop described above.
- **Audited**: the generated report referenced "GDPR," which was
  verified as explicitly present in the source data (row [10]) — not
  invented.
- **Patches attempted and rolled back**: two follow-up patches were
  tried to make per-bullet row-ID citation and strict fact-grounding
  structural rather than incidental. Both caused the prompt to exceed
  the Llama 3.2 1B context window. Both were rolled back; the
  submitted build does not include them.
- **Honest citation coverage of the actual final report**: Risk
  Signals bullets carry row-ID citations; Themes and Pain Points
  bullets do not consistently. This reflects a real limitation of the
  1B model's unconstrained formatting behavior.
- **No GPU acceleration is claimed** for either the Cloud Shell spike
  or the final Windows laptop proof — both ran CPU-only.
- **Strict automated citation enforcement remains a limitation and
  future improvement**, not part of this submission.

## How to run it

```bash
git clone <repo-url>
cd edgevoc
npm install
node src/edgevoc.js data/sample-feedback.csv
cat output/edgevoc-report.md
```

## Tech stack

- `@qvac/sdk` (local inference only)
- Model: `LLAMA_3_2_1B_INST_Q4_0`
- Node.js (≥ v22.17, per QVAC SDK requirement)
- No frontend, no server, no cloud services

## Open-source license

MIT (see `LICENSE`).

## Honesty note

This submission was built under time pressure (FAST_BUILD_MODE,
deadline 2026-06-21 23:59 UTC). Scope was deliberately kept to a
single CLI capability so that every claim made here could be backed by
an actual executed log rather than an assumption. During audit, two
grounding/citation prompt patches were attempted and both exceeded the
1B model's context window; both were rolled back. The submitted build
is the original implementation (plus a Windows CRLF compatibility
fix), proven end-to-end on a personal Windows laptop. Anything not
backed by a log is flagged as such in `TEST-EVIDENCE.md` rather than
asserted as working.
