/**
 * Company case studies. These are qualitative overviews based on the companies'
 * own public descriptions of their businesses (annual reports / 10-K filings).
 * Deliberately NO financial figures are quoted, because they change every year
 * and must come from the primary source; learners are guided to look them up.
 * Hypothetical calculations are labelled as such.
 */
export interface CaseStudy {
  id: string
  company: string
  ticker: string
  market: 'UK' | 'US'
  exchange: string
  sector: string
  summary: string
  businessModel: string
  revenueSources: string[]
  competitivePosition: string
  risks: string[]
  valuationNotes: string
  exercise: { prompt: string; hypothetical: [string, string][]; answer: string }
  findIt: string[]
  sources: { label: string; url: string }[]
}

export const CASE_STUDIES_WRITTEN = 'October 2026'

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'apple',
    company: 'Apple Inc.',
    ticker: 'AAPL',
    market: 'US',
    exchange: 'Nasdaq',
    sector: 'Consumer technology',
    summary: 'A hardware company that has built a large, recurring services business on top of its installed base of devices.',
    businessModel: 'Apple designs devices — iPhone, Mac, iPad, wearables and accessories — and sells them directly and through carriers and retailers. It also earns revenue from services used on those devices, such as the App Store, cloud storage, subscriptions, payments, AppleCare and advertising.',
    revenueSources: ['iPhone (historically its largest product category)', 'Mac and iPad', 'Wearables, home and accessories', 'Services such as the App Store, subscriptions, iCloud and AppleCare'],
    competitivePosition: 'Strong brand, an integrated hardware–software ecosystem and high switching costs for users invested in multiple Apple devices and services.',
    risks: ['Dependence on a small number of flagship products', 'Regulatory scrutiny of app-store practices in several jurisdictions', 'Supply chains concentrated in particular countries', 'Intense competition in smartphones and services'],
    valuationNotes: 'Investors often weigh steady, high-margin services revenue more heavily than cyclical hardware sales. Large share buybacks reduce the share count, which affects EPS growth — compare EPS growth with net income growth.',
    exercise: {
      prompt: 'Hypothetical: a device maker reports revenue of $400bn and operating income of $120bn. What is its operating margin?',
      hypothetical: [['Revenue', '$400bn'], ['Operating income', '$120bn']],
      answer: 'Operating margin = $120bn ÷ $400bn = 30%. (Invented figures for practice — look up Apple’s actual numbers in its latest 10-K.)',
    },
    findIt: ['Open Apple’s latest Form 10-K on SEC EDGAR.', 'Find “Net sales by category” and note the share from Services.', 'Calculate the gross margin for Products and for Services separately, if disclosed.'],
    sources: [
      { label: 'Apple Investor Relations', url: 'https://investor.apple.com/' },
      { label: 'SEC EDGAR filings for Apple (CIK 0000320193)', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193&type=10-K' },
    ],
  },
  {
    id: 'microsoft',
    company: 'Microsoft Corporation',
    ticker: 'MSFT',
    market: 'US',
    exchange: 'Nasdaq',
    sector: 'Software and cloud computing',
    summary: 'A software company whose growth increasingly comes from cloud services sold on subscription.',
    businessModel: 'Microsoft sells software and cloud services to businesses and consumers — productivity software (Microsoft 365), its Azure cloud platform, Windows, LinkedIn, gaming (Xbox) and search advertising. Much of its revenue is recurring through subscriptions and usage-based cloud contracts.',
    revenueSources: ['Cloud infrastructure and services (Azure)', 'Productivity software and business applications', 'Windows, devices and gaming', 'LinkedIn and search advertising'],
    competitivePosition: 'Very high switching costs for organisations built around its software, scale advantages in cloud infrastructure, and broad distribution through existing enterprise relationships.',
    risks: ['Competition in cloud computing from other large providers', 'Heavy capital expenditure on data centres', 'Cybersecurity and reliability incidents', 'Regulatory and antitrust scrutiny'],
    valuationNotes: 'Recurring revenue and high margins can justify higher multiples than hardware businesses — but rising capital spending on data centres means free cash flow should be checked alongside profit.',
    exercise: {
      prompt: 'Hypothetical: a software company has operating cash flow of $120bn and capital expenditure of $50bn. What is its free cash flow?',
      hypothetical: [['Operating cash flow', '$120bn'], ['Capital expenditure', '$50bn']],
      answer: 'FCF = $120bn − $50bn = $70bn. (Invented figures — use Microsoft’s cash flow statement for real numbers.)',
    },
    findIt: ['Open Microsoft’s latest 10-K (its fiscal year ends on 30 June).', 'Find revenue by segment and the growth rate of the cloud business.', 'Compare capital expenditure in the cash flow statement with operating cash flow.'],
    sources: [
      { label: 'Microsoft Investor Relations', url: 'https://www.microsoft.com/en-us/investor' },
      { label: 'SEC EDGAR filings for Microsoft (CIK 0000789019)', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789019&type=10-K' },
    ],
  },
  {
    id: 'coca-cola',
    company: 'The Coca-Cola Company',
    ticker: 'KO',
    market: 'US',
    exchange: 'New York Stock Exchange',
    sector: 'Beverages',
    summary: 'A brand owner whose main business is selling concentrate to independent bottlers, rather than bottling drinks itself.',
    businessModel: 'Coca-Cola owns beverage brands and mostly sells concentrates and syrups to bottling partners, which manufacture, package and distribute finished drinks in their territories. This “asset-light” model leaves the capital-heavy bottling to partners.',
    revenueSources: ['Concentrate and syrup sales to bottling partners', 'Finished beverages in markets where it operates bottling itself', 'A broad portfolio of sparkling and still drink brands'],
    competitivePosition: 'Globally recognised brands, a vast distribution network built with bottlers, and marketing scale.',
    risks: ['Changing consumer preferences, including concerns about sugar', 'Taxes on sugary drinks in some countries', 'Currency movements, since much revenue is earned outside the US', 'Reliance on bottling partners'],
    valuationNotes: 'Known for a long record of annual dividend increases (check its investor materials for the current count). That history is not a guarantee — use payout ratios and free cash flow cover to judge sustainability.',
    exercise: {
      prompt: 'Hypothetical: a drinks company has EPS of $2.50 and pays dividends of $1.90 per share. What is the payout ratio?',
      hypothetical: [['EPS', '$2.50'], ['Dividend per share', '$1.90']],
      answer: 'Payout ratio = $1.90 ÷ $2.50 = 76%. (Invented figures.)',
    },
    findIt: ['Find the dividends paid and free cash flow in the latest 10-K.', 'Calculate how many times free cash flow covers the dividend.', 'Note the share of revenue from outside the US and the currency risk discussion.'],
    sources: [
      { label: 'Coca-Cola Investors', url: 'https://investors.coca-colacompany.com/' },
      { label: 'SEC EDGAR filings for The Coca-Cola Company (CIK 0000021344)', url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000021344&type=10-K' },
    ],
  },
  {
    id: 'tesco',
    company: 'Tesco PLC',
    ticker: 'TSCO',
    market: 'UK',
    exchange: 'London Stock Exchange (FTSE 100)',
    sector: 'Grocery retail',
    summary: 'The UK’s largest supermarket group, operating on high volumes and thin margins.',
    businessModel: 'Tesco sells groceries and general merchandise through large stores, convenience stores and online. It also runs a wholesale business supplying independent retailers and operates in the Republic of Ireland and Central Europe. Its Clubcard loyalty scheme provides data and customer engagement.',
    revenueSources: ['UK grocery and general merchandise sales (in store and online)', 'Wholesale to independent retailers and caterers', 'Operations in the Republic of Ireland and Central Europe'],
    competitivePosition: 'Scale in buying, logistics and property; a large store network; and loyalty-scheme data. Competition from discounters keeps prices — and margins — under pressure.',
    risks: ['Price competition from discount supermarkets', 'Food and energy cost inflation squeezing margins', 'Changing shopping habits', 'Low margins mean small cost changes have a large effect on profit'],
    valuationNotes: 'Grocers typically run low operating margins, so compare margins with other supermarkets rather than with technology companies. Dividends and buybacks depend on steady free cash flow.',
    exercise: {
      prompt: 'Hypothetical: a supermarket has sales of £60bn and operating profit of £2.4bn. What is its operating margin?',
      hypothetical: [['Sales', '£60bn'], ['Operating profit', '£2.4bn']],
      answer: 'Operating margin = £2.4bn ÷ £60bn = 4%. Low by the standards of other industries, but typical of grocery retail. (Invented figures.)',
    },
    findIt: ['Open Tesco’s latest Annual Report and Financial Statements (its financial year ends in late February).', 'Find statutory and adjusted operating profit and read the reconciliation.', 'Calculate the operating margin and compare it with another UK grocer.'],
    sources: [
      { label: 'Tesco PLC Investors', url: 'https://www.tescoplc.com/investors/' },
      { label: 'Companies House: Tesco PLC', url: 'https://find-and-update.company-information.service.gov.uk/company/00445790' },
    ],
  },
  {
    id: 'unilever',
    company: 'Unilever PLC',
    ticker: 'ULVR',
    market: 'UK',
    exchange: 'London Stock Exchange (FTSE 100)',
    sector: 'Consumer goods',
    summary: 'A global owner of household, personal-care and food brands sold in many countries.',
    businessModel: 'Unilever makes and markets branded consumer products — personal care, beauty, home care and foods — sold through supermarkets, convenience stores and online retailers worldwide. It relies on brand strength and distribution scale to support pricing.',
    revenueSources: ['Beauty and personal care brands', 'Home care products', 'Food brands', 'Sales across developed and emerging markets'],
    competitivePosition: 'Well-known brands, global distribution and marketing scale; competition from other multinationals and retailers’ own-label products.',
    risks: ['Input-cost inflation (commodities, packaging)', 'Currency movements across many markets', 'Competition from cheaper own-label products', 'Changes to its portfolio of businesses over time'],
    valuationNotes: 'Often valued on earnings and dividend yield as a mature, relatively defensive business. Watch organic growth — sales growth excluding acquisitions, disposals and currency effects — which the company reports.',
    exercise: {
      prompt: 'Hypothetical: reported sales growth is 2%, of which currency effects were −3% and acquisitions/disposals 0%. Roughly what was underlying (organic) growth?',
      hypothetical: [['Reported growth', '+2%'], ['Currency effect', '−3%'], ['Acquisitions/disposals', '0%']],
      answer: 'Roughly +5%: the business grew about 5% before a 3% currency drag (simplified additive approach). (Invented figures.)',
    },
    findIt: ['Open Unilever’s latest Annual Report and Accounts.', 'Find underlying sales growth split into price and volume.', 'Compare reported and underlying growth to see the currency effect.'],
    sources: [
      { label: 'Unilever Investor Relations', url: 'https://www.unilever.com/investors/' },
      { label: 'Companies House: Unilever PLC', url: 'https://find-and-update.company-information.service.gov.uk/company/00041424' },
    ],
  },
]

export const getCaseStudy = (id: string) => CASE_STUDIES.find((c) => c.id === id)
