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

## What is proven vs. not (see LIMITATIONS.md and TEST-EVIDENCE.md for full detail)

- **Proven**: the submitted build is the **original, unmodified
  implementation** of `src/edgevoc.js`, executed end-to-end on Google
  Cloud Shell — 15 input rows parsed, model loaded in 7,245 ms,
  completion generated in 31,651 ms (~42s total), CPU-only inference
  (no usable GPU), no external AI API called, report written to
  `output/edgevoc-report.md`, full log in `evidence/run-log.txt`.
- **Audited**: the generated report referenced "GDPR," which was
  verified as explicitly present in the source data (row [10]) — not
  invented.
- **Patches attempted and rolled back**: two follow-up patches were
  tried to make per-bullet row-ID citation and strict fact-grounding
  structural rather than incidental. Both caused the prompt to exceed
  the Llama 3.2 1B context window. Both were rolled back; the
  submitted build does **not** include them.
- **Honest citation coverage of the actual final report**: Risk
  Signals bullets carry row-ID citations; Themes and Pain Points
  bullets do not consistently. This reflects a real limitation of the
  1B model's unconstrained formatting behavior, not an unresolved bug
  in this rollback.
- **Not yet proven**: consumer-hardware execution specifically (all
  confirmed runs are Google Cloud Shell). Automated citation
  enforcement is future work, not part of this submission. See
  `TEST-EVIDENCE.md` and `LIMITATIONS.md` for full detail.

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
1B model's context window; both were rolled back, and the submitted
build is the original implementation that produced the proven
end-to-end run. Anything not backed by a log is flagged as such in
`TEST-EVIDENCE.md` rather than asserted as working.
