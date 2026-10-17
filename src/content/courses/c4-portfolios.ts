import { analogy, course, diagram, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, recap, text, tf, tfQ, ukus, warn } from '../builders'

const whatAreFunds = lesson(
  {
    title: 'What is a fund?',
    description: 'Pooling money to buy many investments at once.',
    objectives: ['Explain how a fund pools money', 'Name common fund structures in the UK and US', 'Describe the benefits and costs of funds'],
    tags: ['funds-basics'],
  },
  [
    text(
      'Strength in numbers',
      'A **fund** pools money from many investors and invests it in a portfolio of assets. Each investor owns units or shares of the fund, so they own a proportional slice of everything it holds.\n\nWith a small amount you can own a piece of hundreds or thousands of companies — instant diversification.',
    ),
    analogy('A shared fruit bowl', 'Instead of buying one apple, you chip in with thousands of people to buy a bowl containing every fruit in the market. Your contribution buys you a tiny slice of the whole bowl.'),
    ukus('Fund names', '**UK:** unit trusts and OEICs (open-ended investment companies), investment trusts (companies listed on the stock exchange), and ETFs.\n\n**US:** mutual funds, closed-end funds and ETFs.\n\nThe structures differ in how they are bought and priced, but the pooling idea is the same.'),
    mcq('q1', 'You invest £100 in a fund holding 500 companies. What do you own?', ['£100 of one company chosen at random', 'A proportional slice of all 500 holdings via the fund', 'Shares in the fund manager', 'A loan to the fund'], 1, 'Fund units represent a proportional claim on the whole portfolio.'),
    key('What you pay', 'Funds charge an annual fee, expressed as a percentage of your investment: the **ongoing charges figure (OCF)** in the UK or **expense ratio** in the US. It is deducted from the fund’s assets automatically, so you never see a bill — but it reduces your returns.'),
    num('q2', 'You hold £8,000 in a fund with an ongoing charge of 0.25% a year. Roughly how much does that cost per year?', 20, '£8,000 × 0.25% = £20 a year.', { prefix: '£', tolerance: 0.01, working: '£8,000 × 0.0025 = £20' }),
    multi('q3', 'Which are genuine advantages of funds? Select all that apply.', ['Diversification with small amounts', 'Professional or rules-based management', 'Guaranteed returns', 'Convenience: one purchase, many holdings'], [0, 1, 3], 'Funds do not guarantee returns: their value rises and falls with their holdings.', { final: true }),
    recap('A fund pools investors’ money into a shared portfolio.', 'UK: unit trusts, OEICs, investment trusts, ETFs. US: mutual funds, closed-end funds, ETFs.', 'Annual charges (OCF / expense ratio) quietly reduce returns.'),
  ],
)

const activePassive = lesson(
  {
    title: 'Active versus passive investing',
    description: 'Trying to beat the market versus aiming to match it.',
    objectives: ['Distinguish active and passive funds', 'Explain why low-cost passive funds are popular', 'Recognise the arguments for active management'],
    tags: ['active-passive'],
    sources: [{ label: 'S&P Dow Jones Indices — SPIVA scorecards comparing active funds with benchmarks', url: 'https://www.spglobal.com/spdji/en/research-insights/spiva/' }],
  },
  [
    text(
      'Two philosophies',
      'An **active** fund has managers who choose investments, aiming to beat a benchmark index. A **passive** fund (an index fund or tracker) simply aims to match an index by holding its constituents.\n\nActive funds usually charge more, because research and trading cost money.',
    ),
    key('The arithmetic of active management', 'Before costs, the average actively managed pound roughly earns the market return, because together active investors largely *are* the market. After higher fees, the average active pound tends to lag. Research such as S&P’s SPIVA scorecards has repeatedly found that a majority of active funds underperform their benchmark over long periods — although some do outperform, and results vary by market and period.'),
    mcq('q1', 'Why do passive funds often outperform the average active fund after costs?', ['They pick better companies', 'They have lower costs while earning roughly the market return', 'They are guaranteed by the government', 'They avoid falling markets'], 1, 'Lower costs are the main structural advantage. Passive funds fall with the market too.'),
    tf('q2', 'A passive fund tracking the FTSE 100 will fall when the FTSE 100 falls.', true, 'True. Passive funds aim to match their index — downs as well as ups.'),
    example('The case for active', 'Supporters argue skilled managers can avoid overpriced areas, invest in less efficient markets (like small companies) or follow strategies an index cannot. The challenge is identifying skilled managers *in advance*.'),
    match('q3', 'Match each feature to the fund type.', [['Aims to beat a benchmark', 'Active fund'], ['Holds the index’s constituents', 'Passive fund'], ['Typically lower fees', 'Passive fund'], ['Manager’s stock selection drives results', 'Active fund']], 'Active: selection, higher cost. Passive: rules-based, lower cost.', { final: true }),
    recap('Active funds try to beat an index; passive funds try to match it.', 'Costs are the main reason most active funds lag after fees.', 'Some active managers outperform, but they are hard to identify in advance.'),
  ],
)

const etfsIndexFunds = lesson(
  {
    title: 'ETFs, index funds and tracking',
    description: 'How trackers work, and how to judge how well they track.',
    objectives: ['Explain how ETFs differ from traditional funds', 'Define tracking difference and tracking error', 'Compare trackers on cost and accuracy'],
    tags: ['etfs'],
    difficulty: 2,
  },
  [
    text(
      'Exchange-traded funds',
      'An **ETF** is a fund whose shares trade on a stock exchange throughout the day, like a company share. A traditional index fund (unit trust, OEIC or mutual fund) is usually bought directly from the fund company at one price per day.\n\nBoth can track the same index; the difference is mostly how you buy and sell them.',
    ),
    key('How trackers track', '**Physical** replication: the fund buys the index’s holdings (all of them, or a representative sample).\n\n**Synthetic** replication: the fund uses a contract (a swap) with a bank that pays the index return — which adds counterparty risk.'),
    mcq('q1', 'Which is a key practical difference between an ETF and a traditional index fund?', ['ETFs cannot track indices', 'ETFs trade on an exchange throughout the day', 'Index funds have no fees', 'ETFs are only available in the US'], 1, 'ETFs trade intraday on exchanges at market prices, with a bid–ask spread.'),
    key('Tracking difference and tracking error', '**Tracking difference** is the gap between the fund’s return and the index’s return over a period — mostly due to fees and trading costs.\n\n**Tracking error** measures how *consistently* the fund follows the index: the volatility of that gap. Low and stable is best.'),
    num('q2', 'An index returns 9.0% in a year and a fund tracking it returns 8.8%. What is the tracking difference in percentage points?', -0.2, '8.8% − 9.0% = −0.2 percentage points, likely mostly the fund’s fees.', { suffix: 'pp', tolerance: 0.01 }),
    numbers('Comparing two hypothetical global trackers', [['Fund A ongoing charge', '0.12%'], ['Fund B ongoing charge', '0.40%'], ['Fund A average tracking difference', '−0.15%'], ['Fund B average tracking difference', '−0.45%']], 'Hypothetical figures for illustration.'),
    mcq('q3', 'Based on the table, which fund has tracked its index more closely?', ['Fund A', 'Fund B', 'They are identical', 'It cannot be judged from tracking difference'], 0, 'Fund A’s smaller negative tracking difference means its returns were closer to the index.', { final: true }),
    recap('ETFs trade on exchanges intraday; traditional index funds usually price once a day.', 'Trackers replicate physically or synthetically.', 'Tracking difference = fund return − index return; lower costs usually mean closer tracking.'),
  ],
)

const assetAllocation = lesson(
  {
    title: 'Asset allocation',
    description: 'The biggest decision in your portfolio.',
    objectives: ['Define asset allocation', 'Calculate a portfolio’s weighted expected return', 'Relate allocation to risk tolerance and horizon'],
    tags: ['asset-allocation'],
    difficulty: 2,
  },
  [
    text(
      'Deciding the mix',
      '**Asset allocation** is how you split your money between asset classes — for example 80% shares and 20% bonds. It is the main driver of how much your portfolio is likely to swing and, over long periods, much of its return.\n\nPicking individual investments matters less than getting the overall mix right for your goals.',
    ),
    diagram({ type: 'donut', centre: '60/40', slices: [{ label: 'Global shares', value: 60, tone: 'violet' }, { label: 'Bonds', value: 40, tone: 'mint' }] }, 'A classic “60/40” mix. Not a recommendation — just a common reference point.'),
    key('Weighted expected return', 'A portfolio’s expected return is the weighted average of its parts:\n\nE(R) = w₁ × R₁ + w₂ × R₂ + …\n\nIf shares are assumed to return 7% and bonds 3%, a 60/40 mix has an assumed return of 0.6 × 7% + 0.4 × 3% = **5.4%**. These are assumptions, not forecasts.'),
    num('q1', 'A portfolio is 80% shares assumed to return 7% and 20% bonds assumed to return 3%. What is the assumed portfolio return?', 6.2, '0.8 × 7% + 0.2 × 3% = 5.6% + 0.6% = 6.2%.', { suffix: '%', tolerance: 0.01 }),
    mcq('q2', 'Which investor would typically hold a higher proportion of shares?', ['Someone retiring next year who needs stable income', 'A 22-year-old investing for 40 years who can tolerate swings', 'Someone saving for a house deposit in 12 months', 'Someone who would panic-sell after a 10% fall'], 1, 'Long horizons and higher tolerance for swings suit a higher share allocation. Behaviour matters: an allocation you abandon in a crash does not help you.'),
    tf('q3', 'The “right” asset allocation is the same for everyone.', false, 'False. It depends on goals, time horizon, need for income, and ability to stomach losses.', { final: true }),
    recap('Asset allocation is the split between asset classes.', 'Expected portfolio return = weighted average of assumed returns.', 'Allocation should fit your horizon and risk tolerance.'),
  ],
)

const geoSector = lesson(
  {
    title: 'Geography, sectors and concentration',
    description: 'Hidden bets inside “diversified” portfolios.',
    objectives: ['Explain geographic and sector diversification', 'Identify concentration risk', 'Analyse a portfolio’s exposures'],
    tags: ['concentration'],
    difficulty: 2,
  },
  [
    text(
      'Spreading across the world',
      'Companies in one country share economic, political and currency risks. Investing across regions — UK, US, Europe, Japan, emerging markets — spreads those risks.\n\n**Home bias** is the tendency to invest mostly in your own country, which can leave you concentrated in one economy.',
    ),
    key('Sectors', 'A **sector** groups companies by industry: technology, healthcare, financials, energy, consumer goods and so on. Sectors respond differently to events — rising oil prices may help energy companies while hurting airlines.'),
    diagram({ type: 'donut', centre: 'Fund X', slices: [{ label: 'Technology', value: 45, tone: 'violet' }, { label: 'Healthcare', value: 15, tone: 'mint' }, { label: 'Financials', value: 15, tone: 'sky' }, { label: 'Consumer', value: 15, tone: 'sun' }, { label: 'Other', value: 10, tone: 'grey' }] }, 'A hypothetical fund’s sector breakdown.'),
    mcq('q1', 'In the chart of Fund X, what is the main concentration risk?', ['Too little technology', 'Nearly half the fund depends on one sector', 'Healthcare is too large', 'It holds too many sectors'], 1, '45% in technology means a sector-wide setback would hit the fund hard.'),
    warn('Index concentration', 'Market-cap-weighted indices can become concentrated: when a few giant companies dominate, an index fund holds a lot of them. The fund is still diversified across hundreds of companies, but its results depend heavily on a handful.'),
    num('q2', 'You hold £6,000 in a US fund, £3,000 in a UK fund and £1,000 in an emerging markets fund. What percentage is in the US fund?', 60, '£6,000 ÷ £10,000 = 60%.', { suffix: '%', tolerance: 0.05 }),
    multi('q3', 'Which actions reduce concentration risk? Select all that apply.', ['Adding funds covering other regions', 'Putting everything into your employer’s shares', 'Adding sectors not already held', 'Capping any single holding at a modest percentage'], [0, 2, 3], 'Holding your employer’s shares concentrates risk: your job and savings would depend on the same company.', { final: true }),
    recap('Diversify across regions and sectors, not just companies.', 'Home bias and sector tilts create hidden concentration.', 'Even index funds can be concentrated in their largest holdings.'),
  ],
)

const correlation = lesson(
  {
    title: 'Correlation: why mixing assets works',
    description: 'Assets that don’t move together smooth the ride.',
    objectives: ['Define correlation', 'Explain how low correlation reduces portfolio volatility', 'Recognise that correlations change'],
    tags: ['correlation'],
    difficulty: 3,
    minutes: 6,
  },
  [
    text(
      'Moving together, or not',
      '**Correlation** measures how closely two assets move together, from **+1** (always move in the same direction in lockstep) through **0** (no relationship) to **−1** (always move in opposite directions).\n\nDiversification works best when you combine assets that are *not* perfectly correlated.',
    ),
    match('q1', 'Match each correlation value with its description.', [['+1', 'Move in perfect lockstep'], ['0', 'No consistent relationship'], ['−1', 'Move perfectly opposite']], 'Real-world asset correlations usually lie somewhere in between.'),
    numbers('Two assets, each with 20% volatility, held 50/50', [['Correlation +1', 'Portfolio volatility 20%'], ['Correlation +0.5', 'Portfolio volatility ≈ 17.3%'], ['Correlation 0', 'Portfolio volatility ≈ 14.1%']], 'Calculated with the standard two-asset portfolio variance formula. Expected return is unchanged in each case; only the swings shrink.'),
    mcq('q2', 'Two assets each have 20% volatility. When does a 50/50 mix have the lowest volatility?', ['When correlation is +1', 'When correlation is +0.5', 'When correlation is 0', 'Correlation makes no difference'], 2, 'Lower correlation means their ups and downs partly offset, so the mix swings less.'),
    warn('Correlations are not fixed', 'In crises, many risky assets tend to fall together — correlations rise just when you want them low. Government bonds have often (not always) helped during share market falls; in 2022 both shares and bonds fell as interest rates rose sharply.'),
    tf('q3', 'Adding an asset with low correlation to your existing holdings can reduce overall portfolio volatility even if that asset is volatile on its own.', true, 'True. What matters is how it moves *relative to* the rest of the portfolio.', { final: true }),
    recap('Correlation ranges from −1 to +1.', 'Lower correlation between holdings reduces portfolio volatility.', 'Correlations change, often rising in crises.'),
  ],
)

const currencyRisk = lesson(
  {
    title: 'Currency risk and hedging',
    description: 'What exchange rates do to an international portfolio.',
    objectives: ['Explain currency risk in funds', 'Describe currency hedging', 'Weigh pros and cons of hedging'],
    tags: ['currency-risk'],
    difficulty: 2,
  },
  [
    text(
      'Two sources of return',
      'A UK investor in a global share fund owns assets priced in dollars, euros, yen and more. Their return in pounds depends on both the assets’ local returns and exchange-rate moves. That is **currency risk**.',
    ),
    num('q1', 'Your global fund’s holdings rise 8% in local currencies, but foreign currencies fall 3% against the pound. Approximately what is your return in pounds?', 4.76, '1.08 × 0.97 − 1 = 0.0476 ≈ 4.8%.', { suffix: '%', tolerance: 0.1, working: '1.08 × 0.97 = 1.0476' }),
    key('Hedging', 'A **currency-hedged** fund uses contracts to largely remove exchange-rate effects, so your return is closer to the local-currency return. Hedging has costs and removes currency *gains* as well as losses.'),
    mcq('q2', 'When is currency hedging more commonly used?', ['For global bond funds, where currency swings can dwarf bond returns', 'Never — it is illegal', 'Only for UK shares held by UK investors', 'Only for cash'], 0, 'Bond returns are usually smaller and steadier than share returns, so currency swings can dominate them. Many bond investors hedge for that reason; for shares, opinions differ.'),
    tf('q3', 'A currency-hedged fund can never lose money.', false, 'False. Hedging removes most currency effects, not the risk of the underlying assets falling.', { final: true }),
    recap('International investments carry currency risk.', 'Return in your currency ≈ (1 + local return) × (1 + currency move) − 1.', 'Hedging reduces currency swings but has costs and removes currency gains too.'),
  ],
)

const rebalancing = lesson(
  {
    title: 'Rebalancing',
    description: 'Keeping your mix on target as markets move.',
    objectives: ['Explain portfolio drift', 'Calculate a rebalancing trade', 'Compare rebalancing approaches'],
    tags: ['rebalancing'],
    difficulty: 2,
  },
  [
    text(
      'Drift happens',
      'Markets move your allocation for you. If shares rise faster than bonds, a 60/40 portfolio drifts towards 70/30 — riskier than you chose.\n\n**Rebalancing** means trading back to your target: selling some of what has grown and buying what has lagged.',
    ),
    example('A worked rebalance', 'You start with £10,000: £6,000 shares, £4,000 bonds (60/40). Shares rise 20% to £7,200; bonds are flat at £4,000. Total: £11,200. Shares are now 64%.\n\nTarget shares: 60% × £11,200 = £6,720. Sell £480 of shares and buy £480 of bonds.'),
    num('q1', 'In the example, what percentage of the portfolio is in shares before rebalancing (to one decimal place)?', 64.3, '£7,200 ÷ £11,200 = 64.3%.', { suffix: '%', tolerance: 0.1 }),
    num('q2', 'Start: £5,000 shares and £5,000 bonds (50/50). Shares fall to £4,000; bonds stay £5,000. How much should you move into shares to get back to 50/50?', 500, 'Total £9,000; target £4,500 each. Sell £500 of bonds, buy £500 of shares.', { prefix: '£', tolerance: 0.01, working: '£9,000 × 50% = £4,500; £4,500 − £4,000 = £500' }),
    key('When to rebalance', '**Calendar**: on a schedule, e.g. once a year.\n**Threshold**: when an asset drifts beyond a band, e.g. ±5 percentage points.\nNew contributions can also be directed to the underweight asset, avoiding sales. Consider trading costs and taxes outside tax-sheltered accounts.'),
    tf('q3', 'Rebalancing tends to mean selling assets that have risen and buying those that have fallen.', true, 'True. It enforces a disciplined “trim winners, top up laggards” approach — which can feel uncomfortable.', { final: true }),
    recap('Allocations drift as assets move at different speeds.', 'Rebalancing restores your target risk level.', 'Use a calendar, a threshold, or new contributions; watch costs and taxes.'),
  ],
)

const volatilityHorizon = lesson(
  {
    title: 'Portfolio volatility and time horizons',
    description: 'How your mix and your timeframe shape the range of outcomes.',
    objectives: ['Interpret portfolio volatility', 'Explain the link between allocation and drawdowns', 'Match risk to time horizon'],
    tags: ['portfolio-volatility'],
    difficulty: 2,
  },
  [
    text(
      'A range, not a number',
      'Your portfolio’s future is a *range* of possible outcomes. Volatility describes how wide that range is in any one year. More shares usually means a wider range: higher expected returns, but deeper possible falls.',
    ),
    key('Drawdowns', 'A **drawdown** is the fall from a portfolio’s peak to its subsequent low. The question is not just “what return might I get?” but “could I hold on through a 30% or 40% fall without selling?”'),
    num('q1', 'Your portfolio peaks at £12,000 and later falls to £9,000. What is the drawdown?', 25, '(£12,000 − £9,000) ÷ £12,000 = 25%.', { suffix: '%', tolerance: 0.05 }),
    mcq('q2', 'Which portfolio would you generally expect to have the largest swings?', ['100% cash', '20% shares / 80% bonds', '60% shares / 40% bonds', '100% shares'], 3, 'Shares are usually the most volatile of these assets, so an all-share portfolio swings the most.'),
    tf('q3', 'Matching risk to your time horizon means you can avoid all losses.', false, 'False. It makes it more likely you can wait for recovery rather than sell in a slump. Losses are still possible.', { final: true }),
    recap('Volatility describes the width of possible outcomes.', 'A drawdown is the peak-to-trough fall.', 'Choose a risk level you can stick with through bad years.'),
  ],
)

const diversificationLimits = lesson(
  {
    title: 'The limits of diversification',
    description: 'What spreading your money can — and can’t — protect you from.',
    objectives: ['Recognise risks diversification cannot remove', 'Avoid “diworsification”', 'Summarise a sensible portfolio checklist'],
    tags: ['diversification-limits'],
    difficulty: 2,
  },
  [
    text(
      'No free lunch, just a cheaper one',
      'Diversification is often called the only free lunch in investing: it reduces risk without necessarily reducing expected return. But it has limits.\n\n- It cannot remove **market risk** — broad falls hit diversified portfolios too.\n- In crises, **correlations can rise**, reducing the benefit.\n- Owning many funds that hold the same things is **not** diversification.',
    ),
    example('Overlap', 'Holding five different “global” trackers may feel diversified, but they likely own largely the same large companies. You pay five sets of fees for roughly one portfolio.'),
    mcq('q1', 'Which portfolio is genuinely more diversified?', ['Three US large-company trackers from different providers', 'One global share tracker plus a global bond fund', 'Five technology funds', 'Shares in two banks'], 1, 'Different asset classes and regions provide real diversification; similar funds largely overlap.'),
    tf('q2', 'Holding more funds always means more diversification.', false, 'False. Overlapping funds add complexity and fees without adding much diversification — sometimes called “diworsification”.'),
    order('q3', 'Arrange these portfolio-building steps in a sensible order.', ['Build an emergency fund', 'Set goals and time horizons', 'Choose an asset allocation', 'Select low-cost funds to implement it', 'Rebalance periodically'], 'Foundations first, then the plan, then implementation and maintenance.', { final: true }),
    recap('Diversification reduces specific risk, not market risk.', 'Correlations can rise in crises.', 'Overlapping funds are not true diversification.'),
  ],
)

export const c4 = course({
  id: 'c4',
  slug: 'etfs-and-portfolios',
  title: 'ETFs, Index Funds and Portfolio Construction',
  tagline: 'Build a diversified portfolio that fits you.',
  description: 'Understand funds, active versus passive investing, ETFs and trackers, then learn asset allocation, diversification, correlation, currency risk and rebalancing.',
  colour: 'sun',
  icon: 'pie',
  outcomes: [
    'Explain how funds, ETFs and index trackers work and what they cost',
    'Compare active and passive approaches using evidence',
    'Construct an asset allocation and calculate weighted expected returns',
    'Assess concentration, correlation and currency risk, and rebalance a portfolio',
  ],
  units: [
    {
      title: 'Funds and trackers',
      description: 'Pooled investing, active versus passive, ETFs.',
      lessons: [whatAreFunds, activePassive, etfsIndexFunds],
      checkpoint: {
        concept: 'funds-basics',
        questions: [
          mcqQ('c1', 'A fund…', ['pools money from many investors into one portfolio', 'is a type of bank account', 'guarantees returns', 'can only hold one company'], 0, 'Pooling is the defining feature.', { concept: 'funds-basics' }),
          numQ('c2', 'How much does a 0.15% annual charge cost on £12,000?', 18, '£12,000 × 0.0015 = £18.', { prefix: '£', tolerance: 0.01, concept: 'funds-basics' }),
          tfQ('c3', 'Passive funds aim to beat their index.', false, 'They aim to match it.', { concept: 'active-passive' }),
          mcqQ('c4', 'The main structural advantage of passive funds is…', ['lower costs', 'guaranteed outperformance', 'no exposure to falls', 'higher dividends'], 0, 'Lower costs.', { concept: 'active-passive' }),
          numQ('c5', 'An index returns 6.5%; the tracker returns 6.3%. What is the tracking difference in percentage points?', -0.2, '6.3 − 6.5 = −0.2pp.', { suffix: 'pp', tolerance: 0.01, concept: 'etfs' }),
          mcqQ('c6', 'Synthetic ETFs track an index using…', ['a swap contract with a counterparty', 'buying every share in the index', 'cash only', 'property'], 0, 'Synthetic replication uses swaps.', { concept: 'etfs' }),
        ],
      },
    },
    {
      title: 'Building a portfolio',
      description: 'Allocation, concentration, correlation and currency.',
      lessons: [assetAllocation, geoSector, correlation, currencyRisk],
      checkpoint: {
        concept: 'asset-allocation',
        questions: [
          numQ('c1', '70% shares at an assumed 8% and 30% bonds at an assumed 4%. What is the assumed portfolio return?', 6.8, '0.7 × 8 + 0.3 × 4 = 6.8%.', { suffix: '%', tolerance: 0.01, concept: 'asset-allocation' }),
          tfQ('c2', 'Asset allocation is a major driver of a portfolio’s risk.', true, 'The mix of asset classes sets the likely range of swings.', { concept: 'asset-allocation' }),
          mcqQ('c3', 'Home bias means…', ['investing mostly in your own country', 'preferring property', 'avoiding all foreign currencies by law', 'buying only bonds'], 0, 'A tendency to overweight domestic assets.', { concept: 'concentration' }),
          mcqQ('c4', 'A correlation of −1 means two assets…', ['move in lockstep', 'have no relationship', 'move perfectly opposite', 'cannot be held together'], 2, 'Perfect negative correlation.', { concept: 'correlation' }),
          numQ('c5', 'Assets rise 5% locally; currencies rise 4% against your home currency. Return in your currency?', 9.2, '1.05 × 1.04 − 1 = 9.2%.', { suffix: '%', tolerance: 0.05, concept: 'currency-risk' }),
          tfQ('c6', 'Currency hedging removes currency gains as well as losses.', true, 'Hedging neutralises both directions.', { concept: 'currency-risk' }),
        ],
      },
    },
    {
      title: 'Managing a portfolio',
      description: 'Rebalancing, volatility and diversification’s limits.',
      lessons: [rebalancing, volatilityHorizon, diversificationLimits],
      checkpoint: {
        concept: 'rebalancing',
        questions: [
          numQ('c1', 'Target 60/40. You have £9,000 shares and £3,000 bonds. How much of the shares should you sell to rebalance?', 1800, 'Total £12,000; target shares £7,200; sell £1,800.', { prefix: '£', tolerance: 0.01, concept: 'rebalancing' }),
          mcqQ('c2', 'Threshold rebalancing means trading when…', ['a set date arrives', 'an asset drifts beyond a band', 'the news is bad', 'never'], 1, 'Trades are triggered by drift beyond a tolerance band.', { concept: 'rebalancing' }),
          numQ('c3', 'A portfolio falls from $20,000 to $14,000 at its low. What is the drawdown?', 30, '$6,000 ÷ $20,000 = 30%.', { suffix: '%', tolerance: 0.05, concept: 'portfolio-volatility' }),
          tfQ('c4', 'Owning five global trackers is five times as diversified as owning one.', false, 'They largely overlap.', { concept: 'diversification-limits' }),
          mcqQ('c5', 'Which risk can diversification not remove?', ['Company-specific risk', 'Market-wide risk', 'Single-sector risk', 'One manager’s mistakes'], 1, 'Market risk remains.', { concept: 'diversification-limits' }),
          mcqQ('c6', 'More shares in a portfolio usually means…', ['narrower swings', 'wider swings and higher expected return', 'guaranteed gains', 'no change'], 1, 'The risk–return trade-off.', { concept: 'portfolio-volatility' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'asset-allocation',
    questions: [
      mcqQ('e1', 'In the UK, the annual cost of a fund is usually shown as the…', ['OCF', 'P/E', 'EPS', 'ROE'], 0, 'Ongoing charges figure.', { concept: 'funds-basics' }),
      numQ('e2', 'What does a 0.6% fee cost per year on £25,000?', 150, '£25,000 × 0.006 = £150.', { prefix: '£', tolerance: 0.01, concept: 'funds-basics' }),
      tfQ('e3', 'Research has repeatedly found most active funds underperform their benchmark over long periods after fees.', true, 'SPIVA and similar studies show this, though results vary.', { concept: 'active-passive' }),
      mcqQ('e4', 'ETFs differ from traditional index funds mainly because they…', ['trade on exchanges during the day', 'never have fees', 'cannot track indices', 'are always synthetic'], 0, 'Exchange trading.', { concept: 'etfs' }),
      mcqQ('e5', 'Tracking error measures…', ['the consistency of a fund’s deviation from its index', 'the fund’s total fee', 'the index’s volatility', 'the fund’s size'], 0, 'It is the volatility of the return gap.', { concept: 'etfs' }),
      numQ('e6', 'A portfolio is 50% shares (assumed 7%), 30% bonds (3%), 20% cash (1%). What is the assumed return?', 4.6, '3.5 + 0.9 + 0.2 = 4.6%.', { suffix: '%', tolerance: 0.01, concept: 'asset-allocation' }),
      mcqQ('e7', 'A fund with 50% in one sector has…', ['no concentration risk', 'high sector concentration risk', 'zero volatility', 'guaranteed returns'], 1, 'Half the fund depends on one sector.', { concept: 'concentration' }),
      tfQ('e8', 'Combining assets with low correlation can lower portfolio volatility without necessarily lowering expected return.', true, 'This is the core benefit of diversification.', { concept: 'correlation' }),
      tfQ('e9', 'Correlations between risky assets tend to fall during crises.', false, 'They often rise in crises.', { concept: 'correlation' }),
      numQ('e10', 'Foreign assets rise 10%; foreign currencies fall 10% against yours. What is your return?', -1, '1.10 × 0.90 − 1 = −1%.', { suffix: '%', tolerance: 0.05, concept: 'currency-risk' }),
      numQ('e11', 'Target 80/20. You hold £6,000 shares and £4,000 bonds. How much should you move from bonds to shares?', 2000, 'Total £10,000; target shares £8,000; move £2,000.', { prefix: '£', tolerance: 0.01, concept: 'rebalancing' }),
      multiQ('e12', 'Which are valid rebalancing approaches? Select all that apply.', ['Annual calendar rebalancing', 'Threshold bands', 'Directing new contributions to underweight assets', 'Selling whatever fell most recently'], [0, 1, 2], 'Selling losers is the opposite of rebalancing.', { concept: 'rebalancing' }),
      numQ('e13', 'A portfolio falls from £50,000 to £35,000. What is the drawdown?', 30, '£15,000 ÷ £50,000 = 30%.', { suffix: '%', tolerance: 0.05, concept: 'portfolio-volatility' }),
      mcqQ('e14', 'Which is the best example of genuine diversification?', ['Three overlapping S&P 500 trackers', 'Global shares plus bonds across regions', 'All money in your employer’s shares', 'Five technology funds'], 1, 'Different asset classes and regions.', { concept: 'diversification-limits' }),
      tfQ('e15', 'A diversified portfolio cannot fall in value.', false, 'Market risk remains.', { concept: 'diversification-limits' }),
    ],
  },
})

