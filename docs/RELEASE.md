# Release verification

## Customer RPC deployment — October 13, 2026

Deployed source `82116edb331d218fedf2f3eb1ce70789912a94dc`, Worker version `99b9eb11-69ad-427e-b634-002d00a8f434`. [Hosted readback](evidence/customer-rpc-hosted.json) passed 10 checks: root HTML matched the reviewed source, health/capabilities reported customer mode, OpenAPI targeted localhost, and former chain POST routes returned 410 CUSTOMER_RPC_REQUIRED. The documentation host does not prepare trades. Follow [customer RPC setup](CUSTOMER-RPC.md).

Local checks passed; see [review](REVIEW.md). No chain requests, signatures, broadcasts, contract deployment or funded trades were performed for this release. Existing settlement/funded-test requirements remain. Older release records below describe the previous hosted architecture.


0.1.0-beta, October 13, 2026.

Passed: 14 automated tests covering four stage/direction combinations plus adversarial route and fee checks; syntax/OpenAPI check; Worker bundle dry run; npm audit (zero vulnerabilities). SDK generation is offline and SDK code is not bundled into the Worker.

[Read-only mainnet evidence](evidence/read-only-mainnet.json) contains 3 successful real-protocol simulations. It records exactly which stages and directions were observed. Wallet addresses used for these simulations were public holders, not accounts controlled by us. No transaction was signed or submitted. Shared public RPC limits prevented complete discovery of fresh curve sell samples.

Deployment: public GitHub repository and https://raydium-launchlab-trade.apilabph.workers.dev are live. Documentation, health and capabilities returned HTTP 200. Hosted mainnet buy construction returned HTTP 200 with a passed unsigned simulation at slot 456179947, 83991 compute units. Single observed round-trip: 814 ms; this is not an SLA. Worker upload 7546adb7-deaf-40ea-8937-c2fca73218ad; a subsequent secret-only deployment installed the existing Helius endpoint. Both new Solana services share that Helius project's quota.

The default public RPC returned rate-limit errors from Cloudflare, although it worked locally. Production now uses SOLANA_RPC_URL as a protected Worker secret. Its credential and local source file are not in GitHub. No paid upgrade was made. See [hosted evidence](evidence/hosted-mainnet.json).

Limits: no funded trade tests or independent security audit. Local build measurements are isolated samples, not a latency SLA or confirmation benchmark. Fresh tokens can be absent from Jupiter, and historical migration configurations outside the supported set are rejected.

Clean-install correction: the local bigint adapter is now a direct dependency with a root-relative npm override. Node 22/24 [CI passed](https://github.com/apilabph/raydium-launchlab-buy-sell-api/actions/runs/38307553528). Latest Worker deployment after this packaging fix: a3012937-d999-490c-9b63-a82ec3c39969. Runtime bundle size is unchanged.

Final hosted readback after the packaging correction passed an unsigned buy simulation: [evidence](evidence/hosted-packaging-release.json).

## Developer website — local review, October 13, 2026

Added a separate, responsive developer website under website/. It is committed for local review, with no deployment or custom domain change. See [website guide](WEBSITE.md) for local startup, screenshots, tests and the production integration still needed. Existing on-chain readiness and funded-test limitations remain in force.

## Follow-up review deployment - October 13, 2026

Deployed the reviewed backend fixes as Worker version 02438171-47c1-46e2-9ecb-633e8a413346. Existing runtime configuration was preserved. See [review findings](REVIEW.md#follow-up-review---october-13-2026) and [post-deployment readback](evidence/review-readback-20261013.json).

The updated pool-position guard passed hosted unsigned buy simulations for launchlab at slot 456447810 and raydium-cpmm at slot 456447812. These were public-holder simulations with no signatures or broadcast. They do not establish funded trading or every stage/direction in this new readback.

The redesigned website remains local-only. No domains, RPC subscriptions, wallet funding, swaps, bridges, contract deployments or live trades were purchased or executed. Funded tests and the remaining setup prerequisites still apply.
