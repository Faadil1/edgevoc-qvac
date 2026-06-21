# SPIKE RESULT — QVAC SDK Feasibility

**Date recorded:** 2026-06-20/21 (FAST_BUILD_MODE window, QVAC Hackathon I)
**Environment:** Google Cloud Shell (authoritative environment for this spike — NOT consumer hardware; see LIMITATIONS.md)

## Versions

- Node.js: v24.16.0 (≥ v22.17 required by `@qvac/sdk` — PASS)
- npm: 11.17.0

## Steps executed

1. `@qvac/sdk` install — **PASS**
2. Model: `LLAMA_3_2_1B_INST_Q4_0`
3. Model download — **PASS**, 773 MB / 773 MB
4. Checksum validation — **PASS**
5. Model load (`loadModel`) — **PASS**
6. Completion request, streamed token output — **PASS**

## Result

```
SPIKE_RESULT: PROVEN
```

## Disclosed limitations of this specific run

- **GPU: unavailable.** llama.cpp backend logged a warning that no usable GPU was found; inference ran **CPU-only**.
- **Cloud Shell is not consumer hardware.** This satisfies the SDK/runtime feasibility gate (Node version, install, model fetch, local inference loop all work end-to-end with zero cloud AI calls) but does **not** by itself prove the "consumer hardware" claim required by the hackathon brief.
- Final submission README and LIMITATIONS.md must explicitly disclose this distinction and recommend local-laptop reproduction as the authoritative consumer-hardware proof.

## Why this matters for EdgeVoC

This spike confirms the load → infer → stream → unload lifecycle that `src/edgevoc.js` depends on works correctly against the real `@qvac/sdk` package and a real local model, with no cloud inference path involved at any point.
