import { course, diagram, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, ukus, warn } from '../builders'

const dividendBasics = lesson(
  {
    title: 'How dividends work',
    description: 'Declaration, ex-dividend, record and payment dates.',
    objectives: ['Explain what dividends are', 'Order the key dividend dates', 'Describe UK and US payment patterns'],
    tags: ['dividend-mechanics'],
  },
  [
    text(
      'Cash back to owners',
      'A **dividend** is a payment a company makes to shareholders, usually in cash, from its profits or accumulated reserves. The board decides whether to pay, how much and when. Dividends can be increased, cut or suspended at any time.',
    ),
    key('Four key dates', '1. **Declaration date**: the board announces the dividend.\n2. **Ex-dividend date**: buy on or after this date and you won’t receive this dividend.\n3. **Record date**: the company checks its register of shareholders.\n4. **Payment date**: the cash arrives.'),
    order('q1', 'Put the dividend dates in order.', ['Declaration date', 'Ex-dividend date', 'Record date', 'Payment date'], 'Announce → ex-date → record date → payment.'),
    ukus('Payment patterns', 'Many UK companies pay twice a year: an **interim** dividend after half-year results and a **final** dividend approved at the annual general meeting. Many US companies pay **quarterly**. Some companies on both sides pay none at all and reinvest everything.'),
    num('q2', 'A US company pays a quarterly dividend of $0.35 per share. How much does it pay per share over a year if the dividend stays the same?', 1.4, '$0.35 × 4 = $1.40.', { prefix: '$', tolerance: 0.001 }),
    tf('q3', 'A dividend, once declared in previous years, must be paid at the same level every year.', false, 'False. Past dividends create expectations, not obligations. Boards can and do cut dividends.', { final: true }),
    recap('Dividends are discretionary payments decided by the board.', 'Dates: declaration, ex-dividend, record, payment.', 'UK: often interim + final. US: often quarterly.'),
  ],
)

const yieldPayout = lesson(
  {
    title: 'Dividend yield and payout ratio',
    description: 'How much income — and how much of profits — is paid out.',
    objectives: ['Calculate dividend yield', 'Calculate payout ratio and dividend cover', 'Interpret what they suggest about sustainability'],
    tags: ['payout-ratio'],
    difficulty: 2,
  },
  [
    key('Dividend yield', '**Dividend yield = annual dividend per share ÷ share price.** It is the income return at today’s price — assuming the dividend continues.'),
    num('q1', 'A share costs £8.00 and pays 32p a year in dividends. What is the dividend yield?', 4, '£0.32 ÷ £8.00 = 4%.', { suffix: '%', tolerance: 0.01 }),
    key('Payout ratio and cover', '**Payout ratio = dividends per share ÷ earnings per share.** It shows what share of profit is paid out.\n\n**Dividend cover = EPS ÷ DPS** — the inverse. Cover of 2× means profits are twice the dividend.'),
    num('q2', 'EPS is 80p and the dividend is 40p. What is the payout ratio?', 50, '40p ÷ 80p = 50%.', { suffix: '%', tolerance: 0.01 }),
    num('q3', 'EPS is 80p and the dividend is 40p. What is the dividend cover?', 2, '80p ÷ 40p = 2×.', { suffix: '×', tolerance: 0.01 }),
    mcq('q4', 'Which payout ratio most suggests the dividend could be at risk if profits dip?', ['30%', '50%', '70%', '120%'], 3, 'Paying out 120% of earnings means the dividend exceeds profit — it must be funded from elsewhere, which cannot last indefinitely.', { final: true }),
    recap('Dividend yield = DPS ÷ price.', 'Payout ratio = DPS ÷ EPS; cover = EPS ÷ DPS.', 'Payouts above 100% of earnings are a warning sign.'),
  ],
)

const growthReinvest = lesson(
  {
    title: 'Dividend growth and reinvestment',
    description: 'Growing income and buying more shares with your dividends.',
    objectives: ['Calculate dividend growth over time', 'Explain dividend reinvestment', 'Show how reinvestment compounds'],
    tags: ['dividend-growth'],
    difficulty: 2,
  },
  [
    text(
      'Rising income',
      'Some companies aim to raise their dividend steadily as profits grow. A dividend that grows 6% a year roughly doubles in 12 years (rule of 72). Growth is never guaranteed, though; it depends on the business continuing to grow its cash flows.',
    ),
    num('q1', 'A dividend of 50p grows by 6% a year. What is it after 5 years, to the nearest tenth of a penny?', 66.9, '50p × 1.06⁵ ≈ 66.9p.', { suffix: 'p', tolerance: 0.1, working: '50 × 1.338 = 66.9' }),
    key('Reinvesting dividends', 'Instead of spending dividends, you can use them to buy more shares — automatically, through a **dividend reinvestment plan (DRIP)** or an **accumulation** fund (UK “Acc” units, which reinvest income inside the fund). More shares produce more dividends, which buy more shares: compounding.'),
    example('Reinvestment in action', 'You own 1,000 shares at £10 yielding 4%, and the price and yield stay constant (an unrealistic simplification). Reinvesting each year, your holding grows 4% a year: about 1,480 shares after 10 years — roughly £14,800, versus £10,000 if you spent the dividends.'),
    mcq('q2', 'A UK investor wants a fund to reinvest income automatically. Which share class should they look for?', ['Income (“Inc”) units', 'Accumulation (“Acc”) units', 'Hedged units', 'Bond units'], 1, 'Accumulation units reinvest income within the fund; income units pay it out.'),
    tf('q3', 'Reinvesting dividends means you avoid all tax on them.', false, 'False. Outside tax-sheltered accounts, reinvested dividends are usually still taxable income in both the UK and US.', { final: true }),
    recap('Dividend growth compounds income over time but is not guaranteed.', 'DRIPs and accumulation units reinvest dividends automatically.', 'Reinvested dividends are usually still taxable outside tax-advantaged accounts.'),
  ],
)

const sustainability = lesson(
  {
    title: 'Is the dividend sustainable?',
    description: 'Free cash flow, debt and the quality of the payout.',
    objectives: ['Assess dividend coverage by free cash flow', 'Identify threats to dividends', 'Evaluate a dividend’s sustainability'],
    tags: ['dividend-sustainability'],
    difficulty: 3,
  },
  [
    text(
      'Dividends are paid in cash',
      'Profits can be flattered by accounting, but dividends need **cash**. A sustainable dividend is comfortably covered by free cash flow over time, after the business has invested enough to maintain itself.',
    ),
    num('q1', 'A company generates £300m of free cash flow and pays £240m in dividends. What percentage of FCF is paid out?', 80, '£240m ÷ £300m = 80%.', { suffix: '%', tolerance: 0.05 }),
    multi('q2', 'Which are threats to a dividend’s sustainability? Select all that apply.', ['Dividends exceeding free cash flow for several years', 'Rising debt used to fund the dividend', 'Falling revenue in a declining industry', 'Free cash flow comfortably exceeding dividends'], [0, 1, 2], 'Comfortable FCF coverage is a positive sign.'),
    key('Questions to ask', '- Is the dividend covered by free cash flow over several years?\n- Is the company borrowing to pay it?\n- Is the business stable or cyclical?\n- Does management need cash for investment or debt repayment?'),
    mcq('q3', 'Company A pays dividends equal to 50% of FCF with low debt. Company B pays 110% of FCF and borrows to fund the gap. Which dividend is more sustainable?', ['A', 'B', 'Both equally', 'Neither can be judged'], 0, 'A retains cash to spare; B is funding its dividend with debt, which cannot continue indefinitely.', { final: true }),
    recap('Dividends need cash: check coverage by free cash flow.', 'Borrowing to pay dividends is a red flag.', 'Cyclical and declining businesses have less reliable dividends.'),
  ],
)

const cutsTraps = lesson(
  {
    title: 'Dividend cuts and yield traps',
    description: 'When a high yield is a warning, not a gift.',
    objectives: ['Explain how yields rise when prices fall', 'Define a dividend (yield) trap', 'Interpret a dividend cut scenario'],
    tags: ['dividend-traps'],
    difficulty: 2,
  },
  [
    text(
      'Why yields jump',
      'Dividend yield = dividend ÷ price. If the price **falls**, the yield **rises** — even though nothing about the dividend has improved. A falling price often means investors expect trouble.',
    ),
    num('q1', 'A share paying a $2 dividend falls from $40 to $20. What is its yield now, if the dividend is unchanged?', 10, '$2 ÷ $20 = 10% (it was 5% at $40).', { suffix: '%', tolerance: 0.01 }),
    key('Dividend traps', 'A **dividend trap** (or yield trap) is a share whose high yield attracts income seekers just before the dividend is cut — and the share price often falls further when it is.'),
    example('A cut in numbers (hypothetical)', 'You buy at £5.00 with a 50p dividend (10% yield). The company halves the dividend to 25p and the shares fall to £4.00. You receive 25p but lose £1.00 in price: a total return of −15% in that year.'),
    num('q2', 'In the example, what is the new dividend yield at £4.00?', 6.25, '25p ÷ £4.00 = 6.25%.', { suffix: '%', tolerance: 0.01 }),
    warn('Dividends are not guaranteed', 'During the 2020 pandemic, many UK companies cut or suspended dividends, including banks asked to do so by the regulator. Even long-standing payers can cut when circumstances change.'),
    tf('q3', 'An unusually high dividend yield compared with similar companies can signal that the market expects a cut.', true, 'True. It is worth investigating why the price has fallen before buying for the yield.', { final: true }),
    recap('Falling prices push yields up without improving the dividend.', 'Dividend traps lure buyers just before cuts.', 'Investigate high yields relative to peers.'),
  ],
)

const yieldVsReturn = lesson(
  {
    title: 'Yield versus total return',
    description: 'Why income is only half the story.',
    objectives: ['Calculate total return', 'Compare high-yield and growth investments fairly', 'Explain why dividends are not “free money”'],
    tags: ['total-return'],
    difficulty: 2,
  },
  [
    key('Total return', '**Total return = income + change in price**, as a percentage of the starting price. It is the fairest way to compare investments.'),
    num('q1', 'You buy a share at £100. It pays £6 in dividends and ends the year at £95. What is the total return?', 1, '(£6 + (£95 − £100)) ÷ £100 = £1 ÷ £100 = 1%.', { suffix: '%', tolerance: 0.01 }),
    text(
      'Dividends are not free money',
      'When a company pays a dividend, cash leaves the company, so the company — and typically its share price — is worth that much less (you can see this on the ex-dividend date). The dividend is part of your return, not a bonus on top of it. A company that reinvests profits wisely can create as much value for shareholders as one that pays them out.',
    ),
    mcq('q2', 'Share A yields 6% with a price that fell 4%. Share B yields 0% with a price that rose 5%. Which had the higher total return?', ['A, because of the higher yield', 'B: 5% versus A’s 2%', 'They are equal', 'Cannot be compared'], 1, 'A: 6% − 4% = 2%. B: 0% + 5% = 5%.'),
    tf('q3', 'Dividend-paying shares are automatically better investments than non-paying shares.', false, 'False. What matters is total return and risk. Dividends suit some investors’ income needs, but they are not inherently superior to capital growth.', { final: true }),
    recap('Total return = dividends + price change.', 'Dividends reduce the company’s cash — they are part of return, not extra.', 'Compare investments on total return, not yield alone.'),
  ],
)

const longTermCompounding = lesson(
  {
    title: 'Time in the market',
    description: 'Regular investing and the long-run power of compounding.',
    objectives: ['Explain the value of investing regularly', 'Estimate long-run growth of regular contributions', 'Explain why starting early matters'],
    tags: ['long-term-investing'],
    difficulty: 2,
  },
  [
    numbers('£100 a month at an assumed 5% a year', [['After 20 years', '≈ £41,100 (you paid in £24,000)'], ['After 30 years', '≈ £83,200 (you paid in £36,000)'], ['After 40 years', '≈ £152,600 (you paid in £48,000)']], 'Illustrative: constant 5% annual return compounded monthly, contributions at month end, no fees or tax. Real returns vary and can be negative.'),
    mcq('q1', 'In the table, roughly how much of the 40-year total comes from growth rather than contributions?', ['About £10,000', 'About £48,000', 'About £104,600', 'About £152,600'], 2, '£152,600 − £48,000 ≈ £104,600 of hypothetical growth.'),
    key('Start early', 'Each pound invested early has more years to compound. Ten extra years at the start can matter more than larger contributions later — one reason starting small at university can be powerful.'),
    tf('q2', 'Regular monthly investing guarantees a profit over 40 years.', false, 'False. It is a disciplined approach that smooths entry prices, but no strategy guarantees a profit.'),
    key('Behaviour matters', 'Long-run results depend heavily on staying invested through bad periods. Selling in a panic after a crash can lock in losses and miss the recovery.'),
    mcq('q3', 'Which habit best supports long-term wealth building?', ['Checking prices hourly and trading on news', 'Regular contributions to a diversified, low-cost portfolio held for years', 'Moving everything to cash after every fall', 'Chasing last year’s best fund'], 1, 'Consistency, diversification, low costs and patience do the heavy lifting.', { final: true }),
    recap('Regular investing plus time lets compounding work.', 'Starting early is powerful.', 'Behaviour — staying invested — often matters as much as selection.'),
  ],
)

const feesInflationReal = lesson(
  {
    title: 'Fees, inflation and real returns',
    description: 'Measuring growth in what your money can actually buy.',
    objectives: ['Calculate a return after fees and inflation', 'Explain why real returns matter for long-term goals', 'Combine costs and inflation in planning'],
    tags: ['real-returns'],
    difficulty: 2,
  },
  [
    text(
      'From headline to reality',
      'Your headline (nominal) return is reduced by fees, then by inflation:\n\n1. **Gross return** − fees = **net return**.\n2. Net return adjusted for inflation = **real return**.\n\nReal return ≈ gross return − fees − inflation.',
    ),
    num('q1', 'A portfolio returns 7% gross, charges 0.5% in fees and inflation is 2.5%. Approximately what is the real return?', 4, '7% − 0.5% − 2.5% = 4% (exact: 1.065 ÷ 1.025 − 1 ≈ 3.9%).', { suffix: '%', tolerance: 0.15 }),
    mcq('q2', 'Why should long-term plans use real returns?', ['Because inflation is always zero', 'Because goals like retirement depend on what money can buy, not the number of pounds', 'Because fees are tax-deductible', 'They should not'], 1, 'A pension pot of £500,000 in 40 years buys far less than £500,000 does today.'),
    diagram({ type: 'bars', unit: '%', bars: [{ label: 'Gross', value: 7, tone: 'violet' }, { label: 'After fees', value: 6.5, tone: 'sky' }, { label: 'After inflation', value: 4, tone: 'mint' }] }, 'Illustrative: 7% gross, 0.5% fees, 2.5% inflation (approximate method).'),
    tf('q3', 'A 0.5% difference in annual fees is negligible over 40 years.', false, 'False. Over decades, small fee differences compound into large differences in final value.', { final: true }),
    recap('Real return ≈ gross − fees − inflation.', 'Plan in real terms: what money can buy.', 'Small, persistent costs compound significantly.'),
  ],
)

const taxBasics = lesson(
  {
    title: 'Tax basics: UK and US (educational overview)',
    description: 'Tax-advantaged accounts and how investment income is taxed.',
    objectives: ['Name key UK and US tax-advantaged accounts', 'Explain why account type matters', 'Recognise that rules depend on jurisdiction and change over time'],
    tags: ['tax-basics'],
    difficulty: 2,
    sources: [
      { label: 'GOV.UK — Individual Savings Accounts (ISAs)', url: 'https://www.gov.uk/individual-savings-accounts' },
      { label: 'GOV.UK — Tax on dividends', url: 'https://www.gov.uk/tax-on-dividends' },
      { label: 'GOV.UK — Capital Gains Tax allowances', url: 'https://www.gov.uk/capital-gains-tax/allowances' },
      { label: 'IRS — Topic no. 404, Dividends', url: 'https://www.irs.gov/taxtopics/tc404' },
      { label: 'IRS — Retirement plans (IRAs and 401(k)s)', url: 'https://www.irs.gov/retirement-plans' },
    ],
  },
  [
    warn('Educational only — check current rules', 'This lesson summarises rules **as understood for the UK 2025/26 tax year and the US 2025 tax year**. Tax rules change and depend on personal circumstances. It is not tax advice. Check gov.uk or irs.gov, or speak to a qualified adviser.'),
    ukus(
      'UK',
      '- **ISAs**: you can put up to **£20,000 a year** (2025/26) across ISAs. Income and gains inside an ISA are free of UK income tax and capital gains tax. A **Lifetime ISA** has a lower limit and government bonus, with conditions.\n- **Pensions** (e.g. SIPPs, workplace pensions) get tax relief on contributions, with limits and access restrictions.\n- Outside these wrappers, dividends above the **£500 dividend allowance** (since April 2024) are taxed, and gains above the **£3,000 capital gains annual exempt amount** (since April 2024) may be taxed.',
    ),
    ukus(
      'US',
      '- **401(k)** (employer plans) and **IRAs** offer tax advantages. **Traditional** versions generally give tax relief on contributions with tax on withdrawals; **Roth** versions use after-tax contributions with qualifying withdrawals tax-free. Contribution limits change annually.\n- In taxable accounts, **qualified dividends** and long-term capital gains are taxed at federal rates of **0%, 15% or 20%** depending on income; ordinary (non-qualified) dividends are taxed as ordinary income. State taxes may also apply.',
    ),
    match('q1', 'Match each account with its country.', [['Stocks and Shares ISA', 'UK'], ['Roth IRA', 'US'], ['SIPP', 'UK'], ['401(k)', 'US']], 'ISAs and SIPPs are UK wrappers; IRAs and 401(k)s are US accounts.'),
    mcq('q2', 'A UK investor holds a dividend-paying fund inside a Stocks and Shares ISA. How are the dividends treated for UK income tax?', ['Taxed at the investor’s marginal rate', 'Free of UK income tax', 'Taxed at 50%', 'Taxed only above £20,000'], 1, 'Income and gains within an ISA are free of UK income tax and CGT.'),
    tf('q3', 'Tax rules for investing are the same in the UK and the US.', false, 'False. Accounts, allowances and rates differ — and change over time. Always identify the jurisdiction and tax year.', { final: true }),
    recap('UK: ISAs and pensions shelter investments; allowances apply outside them.', 'US: 401(k)s and IRAs (traditional or Roth); qualified dividends taxed at 0/15/20% federally.', 'Rules vary by country and year — this is education, not advice.'),
  ],
)

export const c7 = course({
  id: 'c7',
  slug: 'dividends-and-wealth',
  title: 'Dividends and Long-Term Wealth Building',
  tagline: 'Income, compounding and patience.',
  description: 'Learn how dividends work, how to judge whether they are sustainable, why total return matters more than yield, and how costs, inflation and tax shape long-term wealth in the UK and US.',
  colour: 'mint',
  icon: 'coins',
  outcomes: [
    'Explain dividend mechanics, yields, payout ratios and cover',
    'Assess dividend sustainability and recognise yield traps',
    'Compare investments on total, net and real returns',
    'Describe UK and US tax-advantaged accounts at an educational level',
  ],
  units: [
    {
      title: 'Dividend basics',
      description: 'Dates, yields, payout ratios and reinvestment.',
      lessons: [dividendBasics, yieldPayout, growthReinvest],
      checkpoint: {
        concept: 'dividend-mechanics',
        questions: [
          mcqQ('c1', 'Buy on or after which date and you miss the upcoming dividend?', ['Declaration date', 'Ex-dividend date', 'Payment date', 'AGM date'], 1, 'The ex-dividend date.', { concept: 'dividend-mechanics' }),
          numQ('c2', 'Dividend 15p, price £3.00. Yield?', 5, '£0.15 ÷ £3.00 = 5%.', { suffix: '%', tolerance: 0.01, concept: 'payout-ratio' }),
          numQ('c3', 'EPS $4, dividend $3. Payout ratio?', 75, '$3 ÷ $4 = 75%.', { suffix: '%', tolerance: 0.01, concept: 'payout-ratio' }),
          numQ('c4', 'EPS 90p, dividend 30p. Dividend cover?', 3, '90 ÷ 30 = 3×.', { suffix: '×', tolerance: 0.01, concept: 'payout-ratio' }),
          mcqQ('c5', 'Accumulation units…', ['pay income out', 'reinvest income inside the fund', 'avoid all tax', 'are only for bonds'], 1, 'They reinvest income.', { concept: 'dividend-growth' }),
          tfQ('c6', 'Boards can cut dividends at any time.', true, 'Dividends are discretionary.', { concept: 'dividend-mechanics' }),
        ],
      },
    },
    {
      title: 'Sustainable income',
      description: 'Coverage, cuts, traps and total return.',
      lessons: [sustainability, cutsTraps, yieldVsReturn],
      checkpoint: {
        concept: 'dividend-sustainability',
        questions: [
          numQ('c1', 'FCF $500m, dividends $200m. Percentage of FCF paid out?', 40, '$200m ÷ $500m = 40%.', { suffix: '%', tolerance: 0.05, concept: 'dividend-sustainability' }),
          tfQ('c2', 'Borrowing to pay dividends is a sign of strength.', false, 'It is a warning sign.', { concept: 'dividend-sustainability' }),
          numQ('c3', 'A £0.60 dividend share falls from £12 to £6. New yield?', 10, '£0.60 ÷ £6 = 10%.', { suffix: '%', tolerance: 0.01, concept: 'dividend-traps' }),
          mcqQ('c4', 'A dividend trap is…', ['a high-yield share whose dividend is likely to be cut', 'a fund with no dividends', 'a tax on dividends', 'a stock split'], 0, 'High yield preceding a cut.', { concept: 'dividend-traps' }),
          numQ('c5', 'Buy at $50; dividends $2; end price $53. Total return?', 10, '($2 + $3) ÷ $50 = 10%.', { suffix: '%', tolerance: 0.01, concept: 'total-return' }),
          tfQ('c6', 'Dividends are a bonus on top of a share’s total return.', false, 'They are part of total return.', { concept: 'total-return' }),
        ],
      },
    },
    {
      title: 'Building wealth for the long term',
      description: 'Compounding, real returns and tax wrappers.',
      lessons: [longTermCompounding, feesInflationReal, taxBasics],
      checkpoint: {
        concept: 'long-term-investing',
        questions: [
          mcqQ('c1', 'Why does starting early matter?', ['Early money has more years to compound', 'Fees are lower for young people by law', 'Markets only rise for young investors', 'It doesn’t'], 0, 'Time drives compounding.', { concept: 'long-term-investing' }),
          tfQ('c2', 'Selling after every crash tends to improve long-term returns.', false, 'It risks locking in losses and missing recoveries.', { concept: 'long-term-investing' }),
          numQ('c3', 'Gross 6%, fees 1%, inflation 2%. Approximate real return?', 3, '6 − 1 − 2 = 3%.', { suffix: '%', tolerance: 0.15, concept: 'real-returns' }),
          mcqQ('c4', 'The overall UK ISA allowance for 2025/26 is…', ['£5,000', '£12,000', '£20,000', 'Unlimited'], 2, '£20,000 across ISAs (check gov.uk for current rules).', { concept: 'tax-basics' }),
          mcqQ('c5', 'A Roth IRA generally means…', ['tax relief now, tax on withdrawals', 'after-tax contributions, qualifying withdrawals tax-free', 'no limits', 'a UK pension'], 1, 'Roth: pay tax now, not later.', { concept: 'tax-basics' }),
          tfQ('c6', 'When discussing tax, you should always state the jurisdiction and tax year.', true, 'Rules vary by country and change over time.', { concept: 'tax-basics' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'dividend-mechanics',
    questions: [
      orderQ('e1', 'Order the dividend dates.', ['Declaration', 'Ex-dividend', 'Record', 'Payment'], 'Announce, ex-date, record, pay.', { concept: 'dividend-mechanics' }),
      numQ('e2', 'Quarterly dividend $0.50. Annual dividend if unchanged?', 2, '$0.50 × 4 = $2.', { prefix: '$', tolerance: 0.001, concept: 'dividend-mechanics' }),
      numQ('e3', 'Dividend 45p, price £9.00. Yield?', 5, '£0.45 ÷ £9 = 5%.', { suffix: '%', tolerance: 0.01, concept: 'payout-ratio' }),
      numQ('e4', 'EPS 60p, DPS 45p. Payout ratio?', 75, '45 ÷ 60 = 75%.', { suffix: '%', tolerance: 0.01, concept: 'payout-ratio' }),
      numQ('e5', 'A 40p dividend grows 10% a year. What is it after 2 years (pence)?', 48.4, '40 × 1.1² = 48.4p.', { suffix: 'p', tolerance: 0.05, concept: 'dividend-growth' }),
      mcqQ('e6', 'Which best indicates a sustainable dividend?', ['Dividends covered comfortably by FCF over years', 'Dividends paid from new borrowing', 'A yield far above peers after a price collapse', 'A payout ratio of 150%'], 0, 'Cash coverage over time.', { concept: 'dividend-sustainability' }),
      tfQ('e7', 'A rising dividend yield always means the dividend increased.', false, 'Falling prices also raise yields.', { concept: 'dividend-traps' }),
      numQ('e8', 'Buy at £20; dividend £1; end price £18. Total return?', -5, '(£1 − £2) ÷ £20 = −5%.', { suffix: '%', tolerance: 0.01, concept: 'total-return' }),
      tfQ('e9', 'Dividend-paying shares are automatically superior to non-paying shares.', false, 'Total return and risk matter.', { concept: 'total-return' }),
      mcqQ('e10', 'On the ex-dividend date, a share price typically…', ['rises by the dividend', 'falls by roughly the dividend amount', 'doubles', 'is unaffected'], 1, 'Cash is leaving the company.', { concept: 'total-return' }),
      tfQ('e11', 'Regular investing guarantees a profit.', false, 'Nothing guarantees a profit.', { concept: 'long-term-investing' }),
      numQ('e12', 'Gross 8%, fees 0.75%, inflation 3.25%. Approximate real return?', 4, '8 − 0.75 − 3.25 = 4%.', { suffix: '%', tolerance: 0.15, concept: 'real-returns' }),
      multiQ('e13', 'Which are UK tax wrappers? Select all that apply.', ['Stocks and Shares ISA', 'SIPP', 'Roth IRA', 'Lifetime ISA'], [0, 1, 3], 'Roth IRAs are US accounts.', { concept: 'tax-basics' }),
      mcqQ('e14', 'Federal tax rates on US qualified dividends are…', ['always 0%', '0%, 15% or 20% depending on income', 'a flat 50%', 'the same as UK rates'], 1, 'Depending on taxable income (2025 rules).', { concept: 'tax-basics' }),
      tfQ('e15', 'Dividends can be cut even by companies with long histories of paying them.', true, 'Dividends are never guaranteed.', { concept: 'dividend-traps' }),
    ],
  },
})
