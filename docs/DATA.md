# Data

## What’s bundled
`src/data/datasets.ts` contains only **synthetic** (seeded random walks) and **illustrative** (formula-generated) series. Each dataset records: id, title, kind, description, x-axis meaning, unit, currency, frequency, provenance and limitations — and every chart displays a badge stating its kind.

| Dataset | Kind |
|---|---|
| `illus-compounding` | illustrative (2000 × 1.07^t) |
| `synthetic-index` | synthetic random walk with injected falls |
| `synthetic-two-stocks` | synthetic, low vs high volatility |
| `illus-yield-curves` | illustrative hand-specified shapes |
| `illus-inflation-erosion` | illustrative (1000 ÷ (1+i)^t) |
| `synthetic-ohlc` | synthetic daily candles |

The portfolio tool’s volatilities, correlations and regional splits are **teaching assumptions** shown in full on the page (`src/tools/portfolioData.ts`).

## Why no real market history yet
Index levels and share prices are generally licensed by exchanges and index providers; redistributing them in a public app needs permission. No licensed source was available while building this release, and the build environment could not reach public statistics APIs. Rather than invent or approximate real prices, Veleta labels its data as synthetic.

## Adding real data
Suitable candidates with permissive reuse terms include UK ONS series (Open Government Licence) and US BLS/BEA series (US government works, public domain). To add one:

1. Add a `LineDataset` with `kind: 'historical'`, the exact source URL and series ID in `provenance`, the retrieval date, and any revisions/caveats in `limitations`.
2. Store values exactly as published (no smoothing); note seasonal adjustment and base year.
3. Never make current-price claims from bundled history.
