# Third-party notices

The HTTP, RPC, input, account-validation and Jupiter build helpers are adapted from APILabPH's MIT-licensed pumpfun-trade-api-public (451f280). They do not provide Pump trading in this service.

Protocol layouts are derived from the pinned official SDKs in package-lock.json; regenerate and review them when upgrading. SDKs, Solana libraries and their dependency licenses remain with their respective authors. The local bigint-buffer adapter replaces a vulnerable native addon; it is original MIT-licensed APILabPH code.

Raydium SDK is GPL-3.0. This repository is distributed under GPL-3.0; the original APILabPH helper license is preserved in LICENSE-APILABPH-MIT. The pinned SDK is used to derive protocol offsets in the generation tool.
