/**
 * Sample building blocks for the portfolio diversification tool.
 * EVERY number here is an illustrative TEACHING ASSUMPTION chosen to be in a
 * plausible range — not measured data, not a forecast, and not a description
 * of any real fund. The UI shows these assumptions in full.
 */
export type AssetClass = 'Shares' | 'Bonds' | 'Cash' | 'Property' | 'Commodities'

export interface BuildingBlock {
  id: string
  name: string
  assetClass: AssetClass
  /** Illustrative regional mix, summing to 100. */
  regions: Record<string, number>
  /** Assumed annual volatility (standard deviation), e.g. 0.16 = 16%. */
  vol: number
  /** Group used for the illustrative correlation assumption. */
  group: 'dev-equity' | 'em-equity' | 'single-stock' | 'gov-bond' | 'corp-bond' | 'cash' | 'property' | 'gold'
}

export const BLOCKS: BuildingBlock[] = [
  { id: 'global-eq', name: 'Global shares tracker', assetClass: 'Shares', regions: { 'North America': 65, Europe: 15, 'United Kingdom': 4, Japan: 6, 'Asia-Pacific & other': 10 }, vol: 0.16, group: 'dev-equity' },
  { id: 'uk-eq', name: 'UK shares tracker', assetClass: 'Shares', regions: { 'United Kingdom': 100 }, vol: 0.15, group: 'dev-equity' },
  { id: 'us-eq', name: 'US large-company tracker', assetClass: 'Shares', regions: { 'North America': 100 }, vol: 0.16, group: 'dev-equity' },
  { id: 'em-eq', name: 'Emerging markets tracker', assetClass: 'Shares', regions: { 'Emerging markets': 100 }, vol: 0.22, group: 'em-equity' },
  { id: 'single', name: 'One technology company', assetClass: 'Shares', regions: { 'North America': 100 }, vol: 0.35, group: 'single-stock' },
  { id: 'gov-bond', name: 'Government bonds (currency-hedged)', assetClass: 'Bonds', regions: { 'North America': 40, Europe: 30, 'United Kingdom': 10, Japan: 15, 'Asia-Pacific & other': 5 }, vol: 0.06, group: 'gov-bond' },
  { id: 'corp-bond', name: 'Corporate bonds', assetClass: 'Bonds', regions: { 'North America': 55, Europe: 30, 'United Kingdom': 10, 'Asia-Pacific & other': 5 }, vol: 0.08, group: 'corp-bond' },
  { id: 'cash', name: 'Cash savings', assetClass: 'Cash', regions: { 'Home country': 100 }, vol: 0.005, group: 'cash' },
  { id: 'property', name: 'Listed property fund', assetClass: 'Property', regions: { 'North America': 50, Europe: 25, 'United Kingdom': 10, 'Asia-Pacific & other': 15 }, vol: 0.18, group: 'property' },
  { id: 'gold', name: 'Gold', assetClass: 'Commodities', regions: { Global: 100 }, vol: 0.15, group: 'gold' },
]

const G = ['dev-equity', 'em-equity', 'single-stock', 'gov-bond', 'corp-bond', 'cash', 'property', 'gold'] as const
/** Illustrative correlation assumptions between groups (symmetric). */
const C: number[][] = [
  /* dev-eq */ [0.9, 0.75, 0.6, 0.0, 0.45, 0.0, 0.7, 0.1],
  /* em-eq  */ [0.75, 0.9, 0.5, 0.0, 0.45, 0.0, 0.6, 0.2],
  /* single */ [0.6, 0.5, 1.0, 0.0, 0.3, 0.0, 0.4, 0.05],
  /* gov    */ [0.0, 0.0, 0.0, 0.9, 0.6, 0.1, 0.2, 0.25],
  /* corp   */ [0.45, 0.45, 0.3, 0.6, 0.9, 0.1, 0.45, 0.2],
  /* cash   */ [0.0, 0.0, 0.0, 0.1, 0.1, 1.0, 0.0, 0.0],
  /* prop   */ [0.7, 0.6, 0.4, 0.2, 0.45, 0.0, 0.9, 0.1],
  /* gold   */ [0.1, 0.2, 0.05, 0.25, 0.2, 0.0, 0.1, 1.0],
]

export function correlationFor(a: BuildingBlock, b: BuildingBlock): number {
  if (a.id === b.id) return 1
  return C[G.indexOf(a.group)][G.indexOf(b.group)]
}

export const PRESETS: { id: string; name: string; weights: Record<string, number> }[] = [
  { id: 'all-in-one', name: 'All in one company', weights: { single: 100 } },
  { id: 'home-bias', name: 'UK-only shares', weights: { 'uk-eq': 100 } },
  { id: 'global', name: 'Global shares', weights: { 'global-eq': 100 } },
  { id: 'sixty-forty', name: '60/40 shares and bonds', weights: { 'global-eq': 60, 'gov-bond': 40 } },
  { id: 'cautious', name: 'Cautious mix', weights: { 'global-eq': 30, 'gov-bond': 40, 'corp-bond': 15, cash: 15 } },
  { id: 'spread', name: 'Broad mix', weights: { 'global-eq': 45, 'em-eq': 10, 'gov-bond': 25, property: 10, gold: 5, cash: 5 } },
]
