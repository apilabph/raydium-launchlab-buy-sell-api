export const config = {
  slug: "raydium-launchlab-buy-sell-api",
  short: "Raydium LaunchLab",
  name: "Raydium LaunchLab Buy and Sell API",
  host: "raydium-launchlab-trade",
  network: "Solana mainnet",
  native: "SOL",
  evm: false,
  accent: "#96c8ff",
  port: 8812,
  fee: "BDhPeRcrHLcAd7ExE1H89WbANEfYEC3q53i2zTYYGYo",
  hero: "LaunchLab trades.<br>Stage checked.<br><span>Locally signed.</span>",
  lead: "Build a buy or sell for a supported LaunchLab token. The API checks its curve or canonical CPMM pool before returning an unsigned transaction.",
  status:
    "Unsigned builds are available in beta. Read-only mainnet simulations passed; funded buys and sells have not been tested.",
  statusLabel: "Build beta",
  stage: "LaunchLab → CPMM",
  coverage: [
    "SOL-paired Raydium LaunchLab bonding curves.",
    "Canonical CPMM graduation pools, including verified historical configuration handling.",
    "The original curve is derived from the token mint.",
  ],
  limits: [
    "Legacy Raydium AMM migration routes.",
    "Non-SOL pairs and unsupported Token-2022 extensions.",
    "Pending migrations, ambiguous pools and unverified fallback routes.",
  ],
  evidence:
    "Recorded mainnet simulations cover a curve buy and graduated buy/sell. Fresh curve sell verification remains pending. No funded trades have been executed.",
  special:
    "Use the token mint. The API derives the original LaunchLab curve and validates the canonical graduated destination.",
  api: "https://raydium-launchlab-trade.apilabph.workers.dev",
  github: "https://github.com/apilabph/raydium-launchlab-buy-sell-api",
};
