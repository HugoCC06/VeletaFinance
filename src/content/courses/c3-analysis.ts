import { course, diagram, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, warn, ukus, analogy } from '../builders'

/*
 * Throughout this course we use Brightcup Coffee, a HYPOTHETICAL company with
 * invented round numbers, so learners can practise calculations. It is not a
 * real business and its figures are not real financial statements.
 */
const BRIGHTCUP = 'Brightcup Coffee is a hypothetical company used for practice. Its figures are invented for teaching.'

const businessModels = lesson(
  {
    title: 'What is a business model?',
    description: 'How a company creates value, and gets paid for it.',
    objectives: ['Define a business model', 'Identify revenue sources', 'Compare common business models'],
    tags: ['business-model'],
  },
  [
    text(
      'The money story',
      'A **business model** explains how a company makes money: who its customers are, what it sells them, how it charges, and what it costs to deliver.\n\nBefore looking at any numbers, an analyst asks: *Why do customers pay this company, and will they keep doing so?*',
    ),
    match(
      'q1',
      'Match each business model with an example.',
      [
        ['Subscription', 'A music streaming service charging monthly'],
        ['Retail', 'A supermarket selling groceries at a markup'],
        ['Advertising', 'A free search engine paid by advertisers'],
        ['Licensing / royalties', 'A chip designer paid per chip others manufacture'],
      ],
      'The same industry can use different models; what matters is who pays and why.',
    ),
    example('Real-world shapes (no figures)', 'Supermarkets like **Tesco** (UK) operate on thin margins and high volumes. Software companies like **Microsoft** (US) sell subscriptions and licences with high gross margins. **Unilever** (UK) sells branded consumer goods through retailers worldwide. These are broad descriptions — always check a company’s latest annual report for detail.'),
    key('Recurring revenue', 'Revenue that repeats predictably — subscriptions, contracts, consumables — is generally more valuable than one-off sales, because the company can plan and invest with more confidence.'),
    mcq('q2', 'Which revenue stream is usually the most predictable?', ['One-off sales of a new gadget', 'Annual software subscriptions with high renewal rates', 'Fees from a single large project', 'Gains from selling a building'], 1, 'Subscriptions with high renewal rates recur year after year, which makes them predictable.'),
    tf('q3', 'Two companies in the same industry always have the same business model.', false, 'False. One airline may be low-cost and no-frills, another premium; one retailer online-only, another store-based.', { final: true }),
    recap('A business model describes how a company creates value and gets paid.', 'Recurring revenue is usually more predictable and valuable.', 'Understand the model before analysing the numbers.'),
  ],
)

const incomeStatement = lesson(
  {
    title: 'The income statement',
    description: 'From revenue to net income, line by line.',
    objectives: ['Read the main lines of an income statement', 'Calculate gross profit, operating profit and net income', 'Explain what each profit level shows'],
    tags: ['income-statement'],
    difficulty: 2,
    minutes: 6,
  },
  [
    text(
      'Following the money down',
      'The **income statement** (UK: also *profit and loss account*) shows revenue and costs over a period, usually a year or a quarter. You read it from the top line to the bottom line:\n\n- **Revenue** (sales, or *turnover* in the UK)\n- minus **cost of goods sold** (COGS) = **gross profit**\n- minus **operating expenses** = **operating profit** (often similar to EBIT)\n- minus interest and tax = **net income** (profit attributable to shareholders)',
    ),
    diagram(
      { type: 'bars', unit: '£m', bars: [
        { label: 'Revenue', value: 500, tone: 'violet' },
        { label: 'Gross profit', value: 300, tone: 'sky' },
        { label: 'Operating profit', value: 100, tone: 'mint' },
        { label: 'Net income', value: 67.5, tone: 'sun' },
      ] },
      BRIGHTCUP,
      'Brightcup Coffee, one year (£m)',
    ),
    numbers('Brightcup Coffee income statement (£m)', [
      ['Revenue', '500'],
      ['Cost of goods sold (beans, milk, cups)', '(200)'],
      ['Gross profit', '300'],
      ['Operating expenses (staff, rent, marketing)', '(200)'],
      ['Operating profit', '100'],
      ['Interest', '(10)'],
      ['Profit before tax', '90'],
      ['Tax at 25%', '(22.5)'],
      ['Net income', '67.5'],
    ], BRIGHTCUP),
    num('q1', 'A company has revenue of £800m and cost of goods sold of £500m. What is its gross profit in £m?', 300, 'Gross profit = revenue − COGS = £800m − £500m = £300m.', { prefix: '£', suffix: 'm' }),
    num('q2', 'The same company has operating expenses of £180m. What is its operating profit in £m?', 120, 'Operating profit = gross profit − operating expenses = £300m − £180m = £120m.', { prefix: '£', suffix: 'm' }),
    order('q3', 'Order these lines as they appear from top to bottom.', ['Revenue', 'Gross profit', 'Operating profit', 'Profit before tax', 'Net income'], 'Each line subtracts another layer of cost: COGS, operating expenses, then interest, then tax.'),
    ukus('Same thing, different names', 'UK reports often say *turnover* for revenue and *profit for the year* for net income. US reports say *net sales* or *revenue* and *net income*. UK listed groups report under IFRS; US companies under US GAAP — similar ideas, some different rules.'),
    mcq('q4', 'Which profit figure best shows how profitable the core business operations are, before financing choices and tax?', ['Revenue', 'Gross profit', 'Operating profit', 'Net income'], 2, 'Operating profit includes all operating costs but excludes interest (a financing choice) and tax, so it isolates the operating business.', { final: true }),
    recap('Revenue − COGS = gross profit.', 'Gross profit − operating expenses = operating profit.', 'Operating profit − interest − tax = net income.'),
  ],
)

const margins = lesson(
  {
    title: 'Margins and profitability',
    description: 'Turning profit into percentages you can compare.',
    objectives: ['Calculate gross, operating and net margins', 'Compare margins across companies', 'Explain why margins differ between industries'],
    tags: ['margins'],
    difficulty: 2,
  },
  [
    text(
      'Profit per pound of sales',
      'A **margin** is a profit figure divided by revenue. It answers: *out of each £1 of sales, how much is left?*\n\n- **Gross margin** = gross profit ÷ revenue\n- **Operating margin** = operating profit ÷ revenue\n- **Net margin** = net income ÷ revenue',
    ),
    numbers('Brightcup Coffee margins', [['Gross margin', '300 ÷ 500 = 60%'], ['Operating margin', '100 ÷ 500 = 20%'], ['Net margin', '67.5 ÷ 500 = 13.5%']], BRIGHTCUP),
    num('q1', 'A company has revenue of $2,000m and operating profit of $300m. What is its operating margin?', 15, '$300m ÷ $2,000m = 15%.', { suffix: '%', tolerance: 0.05 }),
    key('Compare like with like', 'Margins differ hugely by industry. Grocery retailers often run on low single-digit operating margins, while many software businesses have much higher ones. Compare a company with its own history and with close competitors, not with a random company in another industry.'),
    mcq('q2', 'Supermarket A has a 4% operating margin; software company B has 30%. What can you conclude?', ['B is definitely a better investment', 'A is badly run', 'Their industries have different cost structures, so direct comparison says little', 'A must be losing money'], 2, 'Industry economics drive margins. A 4% margin may be excellent for a grocer. Valuation and other factors also matter.'),
    num('q3', 'Revenue rises from £100m to £120m while net income rises from £10m to £15m. What is the new net margin?', 12.5, '£15m ÷ £120m = 12.5% (up from 10%).', { suffix: '%', tolerance: 0.05 }),
    tf('q4', 'A rising operating margin over several years can indicate improving efficiency or pricing power.', true, 'True. It can also come from temporary factors, so investigate why it changed.', { final: true }),
    recap('Margins = profit ÷ revenue at each level of the income statement.', 'Compare margins with the company’s history and close peers.', 'Look for the reason behind margin changes.'),
  ],
)

const balanceSheet = lesson(
  {
    title: 'The balance sheet',
    description: 'What a company owns, what it owes, and what is left for shareholders.',
    objectives: ['State the balance sheet equation', 'Classify assets and liabilities', 'Calculate shareholders’ equity'],
    tags: ['balance-sheet'],
    difficulty: 2,
  },
  [
    text(
      'A snapshot, not a film',
      'The income statement covers a *period*. The **balance sheet** is a *snapshot* at one date. It always balances:\n\n**Assets = Liabilities + Shareholders’ equity**\n\nAssets are what the company owns or controls; liabilities are what it owes; equity is what would be left for shareholders if assets paid off all liabilities (at their book values).',
    ),
    diagram({ type: 'stack',
      left: { title: 'Assets £400m', items: [{ label: 'Cash', value: 50, tone: 'mint' }, { label: 'Inventory', value: 30, tone: 'sky' }, { label: 'Receivables', value: 20, tone: 'sky' }, { label: 'Property & equipment', value: 300, tone: 'violet' }] },
      right: { title: 'Liabilities + equity £400m', items: [{ label: 'Payables', value: 40, tone: 'coral' }, { label: 'Borrowings', value: 160, tone: 'coral' }, { label: 'Shareholders’ equity', value: 200, tone: 'sun' }] },
    }, BRIGHTCUP, 'Brightcup Coffee balance sheet (£m)'),
    num('q1', 'A company has total assets of £900m and total liabilities of £550m. What is shareholders’ equity in £m?', 350, 'Equity = assets − liabilities = £900m − £550m = £350m.', { prefix: '£', suffix: 'm' }),
    match('q2', 'Classify each item.', [['Inventory of coffee beans', 'Asset'], ['A bank loan', 'Liability'], ['Money owed to suppliers', 'Liability'], ['Money owed by customers', 'Asset']], 'Money owed *to* the company (receivables) is an asset; money it owes (payables, loans) is a liability.'),
    key('Current versus non-current', '**Current** items are expected to turn into cash or be paid within a year (cash, inventory, receivables, payables). **Non-current** items last longer (buildings, equipment, long-term loans). Comparing current assets with current liabilities shows short-term financial health.'),
    tf('q3', 'Book value of equity tells you exactly what the shares are worth on the stock market.', false, 'False. Book equity is an accounting figure based largely on historical costs. Market value depends on expected future cash flows and can be far higher or lower.', { final: true }),
    recap('Assets = liabilities + shareholders’ equity.', 'The balance sheet is a snapshot at a single date.', 'Book equity is not the same as market value.'),
  ],
)

const cashFlow = lesson(
  {
    title: 'The cash flow statement',
    description: 'Operating, investing and financing cash flows — and free cash flow.',
    objectives: ['Name the three sections of the cash flow statement', 'Calculate free cash flow', 'Explain why profit and cash differ'],
    tags: ['cash-flow'],
    difficulty: 2,
  },
  [
    text(
      'Cash is a fact, profit is an opinion',
      'Accounting profit includes estimates and timing choices. The **cash flow statement** shows the actual cash coming in and going out, in three sections:\n\n- **Operating**: cash generated by the day-to-day business.\n- **Investing**: spending on long-term assets (*capital expenditure*, or capex) and acquisitions, or proceeds from selling them.\n- **Financing**: borrowing, repaying debt, issuing shares, buying back shares and paying dividends.',
    ),
    match('q1', 'Match each cash flow with its section.', [['Cash received from customers', 'Operating'], ['Buying a new roasting plant', 'Investing'], ['Paying a dividend', 'Financing']], 'Dividends and borrowing are financing; capex is investing; customer receipts are operating. (Under IFRS some items, such as interest and dividends paid, can be classified differently — check the notes.)'),
    key('Free cash flow', '**Free cash flow (FCF)** is the cash left after running and maintaining the business:\n\n**FCF = cash from operations − capital expenditure**\n\nIt is the cash available to repay debt, pay dividends, buy back shares or invest in growth. Definitions vary slightly between companies, so check how a figure was calculated.'),
    num('q2', 'Brightcup generates £120m of cash from operations and spends £50m on capital expenditure. What is its free cash flow in £m?', 70, 'FCF = £120m − £50m = £70m.', { prefix: '£', suffix: 'm' }),
    example('Profitable but short of cash', 'A fast-growing wholesaler books £10m of sales on credit. Its profit looks healthy, but customers have not paid yet, while it has already paid suppliers. Profit is up; cash is down. Growth can *consume* cash.'),
    tf('q3', 'A company can report a profit and still run out of cash.', true, 'True. Profit counts sales when earned, not when paid, and ignores capex. Many businesses fail from lack of cash, not lack of profit.'),
    mcq('q4', 'Which pattern deserves the most scrutiny?', ['Net income and operating cash flow both rising steadily', 'Net income rising every year while operating cash flow keeps falling', 'High FCF used to repay debt', 'Capex rising during an expansion that is explained in the report'], 1, 'Profits that never turn into cash can signal aggressive accounting, collection problems or rising inventory.', { final: true }),
    recap('Three sections: operating, investing, financing.', 'FCF = operating cash flow − capex.', 'Profit and cash can diverge; persistent gaps are a warning sign.'),
  ],
)

const debt = lesson(
  {
    title: 'Debt and leverage',
    description: 'How borrowing magnifies both returns and risks.',
    objectives: ['Explain financial leverage', 'Calculate net debt and interest cover', 'Assess whether debt levels are risky'],
    tags: ['leverage'],
    difficulty: 3,
    minutes: 6,
  },
  [
    text(
      'Borrowing to grow',
      'Companies borrow to fund growth. Debt is often cheaper than equity, and interest is usually tax-deductible. But interest and repayments must be paid whatever happens — in bad years too.\n\n**Leverage** means using borrowed money. It magnifies outcomes: good years look better for shareholders, bad years look worse.',
    ),
    key('Three useful measures', '- **Net debt** = borrowings − cash.\n- **Net debt ÷ EBITDA**: roughly how many years of operating earnings (before depreciation and amortisation) it would take to repay net debt.\n- **Interest cover** = operating profit ÷ interest expense: how many times profits cover interest.'),
    numbers('Brightcup Coffee leverage', [['Borrowings', '£160m'], ['Cash', '£50m'], ['Net debt', '£110m'], ['EBITDA (operating profit £100m + depreciation £30m)', '£130m'], ['Net debt ÷ EBITDA', '≈ 0.85×'], ['Interest cover (£100m ÷ £10m)', '10×']], BRIGHTCUP),
    num('q1', 'A company has borrowings of $900m and cash of $150m. What is its net debt in $m?', 750, 'Net debt = $900m − $150m = $750m.', { prefix: '$', suffix: 'm' }),
    num('q2', 'Operating profit is £60m and interest expense is £20m. What is interest cover?', 3, '£60m ÷ £20m = 3×. Profits cover interest three times — a thinner cushion than Brightcup’s 10×.', { suffix: '×', tolerance: 0.01 }),
    warn('When leverage bites', 'Highly leveraged companies are vulnerable when profits fall or interest rates rise. Debt that looks comfortable in a boom can become dangerous in a recession, especially if it must be refinanced at higher rates.'),
    mcq('q3', 'Which company looks most financially fragile?', ['Net debt ÷ EBITDA 0.5×, interest cover 20×', 'Net cash (more cash than debt)', 'Net debt ÷ EBITDA 5×, interest cover 1.5×', 'Net debt ÷ EBITDA 1×, interest cover 12×'], 2, 'High debt relative to earnings and barely covered interest leave little room for a bad year.', { final: true }),
    recap('Leverage magnifies returns and risks for shareholders.', 'Net debt = borrowings − cash; interest cover = operating profit ÷ interest.', 'Judge debt against the stability of the company’s earnings.'),
  ],
)

const returnsMetrics = lesson(
  {
    title: 'ROE, ROIC and EPS',
    description: 'How efficiently a company turns capital into profit.',
    objectives: ['Calculate return on equity', 'Explain return on invested capital', 'Calculate earnings per share'],
    tags: ['returns-metrics'],
    difficulty: 3,
    minutes: 6,
  },
  [
    text(
      'Returns on the money used',
      'Profit on its own does not tell you whether a business is *efficient*. A £10m profit is impressive from £20m of capital and poor from £500m. Return metrics compare profit with the capital that produced it.',
    ),
    key('Return on equity (ROE)', '**ROE = net income ÷ shareholders’ equity.** It shows the return generated on shareholders’ book capital. Brightcup: £67.5m ÷ £200m = **33.75%**.\n\nCaution: debt can inflate ROE, because borrowing shrinks equity relative to profit.'),
    num('q1', 'Net income is £45m and shareholders’ equity is £300m. What is ROE?', 15, '£45m ÷ £300m = 15%.', { suffix: '%', tolerance: 0.05 }),
    key('Return on invested capital (ROIC)', '**ROIC = after-tax operating profit ÷ invested capital**, where invested capital is roughly debt + equity − cash. It measures returns on *all* capital, regardless of how it was financed. Brightcup: £100m × (1 − 25%) = £75m; ÷ (£160m + £200m − £50m = £310m) ≈ **24%**.\n\nA business earning an ROIC well above its cost of capital is creating value.'),
    mcq('q2', 'Why might an analyst prefer ROIC to ROE when comparing companies?', ['ROIC ignores profit', 'ROIC is not distorted by how much debt a company uses', 'ROIC is always higher', 'ROE cannot be calculated for UK companies'], 1, 'ROE can be boosted by leverage. ROIC looks at returns on the whole capital base, so it compares operating performance more fairly.'),
    key('Earnings per share (EPS)', '**EPS = net income ÷ number of shares.** Brightcup: £67.5m ÷ 100m shares = **67.5p**. Watch for *diluted* EPS, which includes shares that could be created from options or convertibles.'),
    num('q3', 'A company earns net income of $250m and has 125m shares. What is its EPS in dollars?', 2, '$250m ÷ 125m = $2.00 per share.', { prefix: '$', tolerance: 0.001 }),
    tf('q4', 'EPS can rise even if net income is flat, if the company buys back and cancels shares.', true, 'True. Fewer shares means each share gets a larger slice of the same profit. That is why EPS growth should be compared with net income growth.', { final: true }),
    recap('ROE = net income ÷ equity (can be flattered by debt).', 'ROIC = after-tax operating profit ÷ invested capital.', 'EPS = net income ÷ shares; buybacks can lift EPS.'),
  ],
)

const qualityMoats = lesson(
  {
    title: 'Growth, quality and competitive advantages',
    description: 'What makes a business durable — and why growth alone is not enough.',
    objectives: ['Calculate revenue growth', 'Describe common competitive advantages', 'Explain what “business quality” means'],
    tags: ['business-quality'],
    difficulty: 2,
  },
  [
    num('q1', 'Revenue grows from £400m to £460m. What is the growth rate?', 15, '(£460m − £400m) ÷ £400m = 15%.', { suffix: '%', tolerance: 0.05 }),
    text(
      'Not all growth is equal',
      'Growth funded by heavy borrowing, constant share issuance or price cuts that destroy margins may not create value. **Quality growth** comes with healthy margins, strong returns on capital and cash generation.',
    ),
    key('Competitive advantages (“moats”)', 'A **competitive advantage** protects profits from competitors. Common sources:\n\n- **Brand**: customers pay more for a name they trust.\n- **Network effects**: the product gets more useful as more people use it.\n- **Switching costs**: changing provider is painful or expensive.\n- **Cost advantages**: scale or processes rivals cannot match.\n- **Intangible assets**: patents, licences, regulatory approvals.'),
    match('q2', 'Match each example with the competitive advantage it best illustrates.', [['A messaging app everyone’s friends already use', 'Network effects'], ['Accounting software a firm has used for 15 years', 'Switching costs'], ['A patented medicine', 'Intangible assets'], ['The world’s largest low-cost retailer', 'Cost advantages']], 'Each protects profits in a different way.'),
    analogy('A castle and its moat', 'Profits are the castle; competitors want to capture them. A moat makes attack harder. Moats can narrow over time — technology shifts, patents expire, tastes change.'),
    multi('q3', 'Which suggest a higher-quality business? Select all that apply.', ['Consistently high ROIC', 'Profits that convert reliably into free cash flow', 'Growth funded mainly by issuing new shares every year', 'Pricing power: it can raise prices without losing many customers'], [0, 1, 3], 'Constant share issuance dilutes existing owners and can signal the business cannot fund itself.', { final: true }),
    recap('Growth rate = (new − old) ÷ old.', 'Quality growth comes with good margins, returns and cash generation.', 'Moats — brand, network effects, switching costs, cost and intangibles — protect profits but can erode.'),
  ],
)

const annualReports = lesson(
  {
    title: 'Annual reports, limitations and red flags',
    description: 'Where to find the facts — and what the numbers can hide.',
    objectives: ['Navigate an annual report', 'Recognise limitations of financial statements', 'Spot common accounting red flags'],
    tags: ['red-flags'],
    difficulty: 3,
    minutes: 6,
    sources: [
      { label: 'SEC EDGAR — US company filings (10-K annual reports)', url: 'https://www.sec.gov/edgar/search/' },
      { label: 'Companies House — UK company filings', url: 'https://find-and-update.company-information.service.gov.uk/' },
    ],
  },
  [
    ukus('Where to find reports', 'UK listed companies publish an **annual report and accounts** on their investor relations website; filings are also available from Companies House. US listed companies file a **10-K** (annual) and **10-Q** (quarterly) with the SEC, searchable free on EDGAR.'),
    order('q1', 'A typical annual report flows roughly in this order. Arrange the sections.', ['Strategic report / business overview', 'Governance and remuneration', 'Financial statements', 'Notes to the accounts'], 'Narrative first, then governance, then the statements, followed by the notes that explain them.'),
    key('Read the notes', 'The **notes** explain accounting policies, debt maturities, lease obligations, segment results and one-off items. Many important details live there, not in the headline numbers.'),
    warn('Limitations', 'Financial statements are backward-looking, use estimates (depreciation, provisions, asset values) and may exclude valuable intangibles like brands built in-house. “Adjusted” or “underlying” profits are chosen by management and can leave out real costs.'),
    multi('q2', 'Which are common accounting red flags? Select all that apply.', ['Receivables growing much faster than revenue', 'Frequent “one-off” charges every year', 'Auditor resignation or a qualified audit opinion', 'Steady dividends covered by free cash flow'], [0, 1, 2], 'Fast-growing receivables can mean sales are not being collected; recurring “one-offs” are not one-off; auditor problems are serious warnings. Covered dividends are a healthy sign.'),
    mcq('q3', 'A company reports “adjusted profit” of £50m and statutory profit of £5m, excluding “restructuring costs” every year for five years. What is the sensible interpretation?', ['Use adjusted profit — it is always more accurate', 'Be sceptical: recurring costs excluded every year are arguably ordinary costs', 'Statutory profit is always wrong', 'The difference is irrelevant to investors'], 1, 'Costs that recur every year are part of running the business. Check the reconciliation between adjusted and statutory figures.', { final: true }),
    recap('UK: annual report and accounts; US: 10-K on EDGAR.', 'The notes hold crucial detail.', 'Watch for receivables outpacing sales, recurring “one-offs” and audit issues.'),
  ],
)

export const c3 = course({
  id: 'c3',
  slug: 'company-analysis',
  title: 'Company Financial Analysis',
  tagline: 'Read the numbers behind the business.',
  description: 'Learn to read income statements, balance sheets and cash flow statements, calculate margins and returns, judge debt, and spot red flags — using practical exercises.',
  colour: 'sky',
  icon: 'doc',
  outcomes: [
    'Interpret income statements, balance sheets and cash flow statements',
    'Calculate and compare margins, ROE, ROIC, EPS and free cash flow',
    'Assess leverage and financial resilience',
    'Evaluate business quality and recognise accounting red flags',
  ],
  units: [
    {
      title: 'How businesses make money',
      description: 'Business models, the income statement and margins.',
      lessons: [businessModels, incomeStatement, margins],
      checkpoint: {
        concept: 'income-statement',
        questions: [
          mcqQ('c1', 'A gym charging monthly membership fees uses mainly which model?', ['Advertising', 'Subscription', 'Licensing', 'Commodity'], 1, 'Recurring monthly fees are a subscription model.', { concept: 'business-model' }),
          numQ('c2', 'Revenue £250m, COGS £150m, operating expenses £60m. What is operating profit in £m?', 40, '£250m − £150m − £60m = £40m.', { prefix: '£', suffix: 'm', concept: 'income-statement' }),
          numQ('c3', 'What is the operating margin in the previous question?', 16, '£40m ÷ £250m = 16%.', { suffix: '%', tolerance: 0.05, concept: 'margins' }),
          tfQ('c4', 'Net income is calculated before interest and tax.', false, 'Net income is after interest and tax.', { concept: 'income-statement' }),
          mcqQ('c5', 'What is the best way to judge whether a 5% net margin is good?', ['Compare with any random company', 'Compare with the company’s history and close competitors', 'Compare with the interest rate', 'Margins cannot be judged'], 1, 'Industry economics drive margins.', { concept: 'margins' }),
          orderQ('c6', 'Order from largest to smallest for a typical profitable company.', ['Revenue', 'Gross profit', 'Operating profit', 'Net income'], 'Each step subtracts costs.', { concept: 'income-statement' }),
        ],
      },
    },
    {
      title: 'Balance sheets, cash and debt',
      description: 'Assets, liabilities, equity, cash flow and leverage.',
      lessons: [balanceSheet, cashFlow, debt],
      checkpoint: {
        concept: 'balance-sheet',
        questions: [
          numQ('c1', 'Assets £1,200m, liabilities £700m. What is equity in £m?', 500, '£1,200m − £700m = £500m.', { prefix: '£', suffix: 'm', concept: 'balance-sheet' }),
          mcqQ('c2', 'Money customers owe a company is…', ['a liability', 'an asset (receivables)', 'equity', 'revenue'], 1, 'Receivables are assets.', { concept: 'balance-sheet' }),
          numQ('c3', 'Operating cash flow $300m, capex $120m. What is free cash flow in $m?', 180, '$300m − $120m = $180m.', { prefix: '$', suffix: 'm', concept: 'cash-flow' }),
          mcqQ('c4', 'Repaying a bank loan appears in which cash flow section?', ['Operating', 'Investing', 'Financing', 'None'], 2, 'Debt flows are financing.', { concept: 'cash-flow' }),
          numQ('c5', 'Operating profit £40m, interest £8m. What is interest cover?', 5, '£40m ÷ £8m = 5×.', { suffix: '×', tolerance: 0.01, concept: 'leverage' }),
          tfQ('c6', 'Leverage magnifies both gains and losses for shareholders.', true, 'Fixed interest costs amplify swings in profit.', { concept: 'leverage' }),
        ],
      },
    },
    {
      title: 'Judging quality',
      description: 'Returns on capital, moats, reports and red flags.',
      lessons: [returnsMetrics, qualityMoats, annualReports],
      checkpoint: {
        concept: 'returns-metrics',
        questions: [
          numQ('c1', 'Net income £30m, equity £150m. What is ROE?', 20, '£30m ÷ £150m = 20%.', { suffix: '%', tolerance: 0.05, concept: 'returns-metrics' }),
          numQ('c2', 'Net income £84m, 120m shares. What is EPS in pence?', 70, '£84m ÷ 120m = £0.70 = 70p.', { suffix: 'p', tolerance: 0.01, concept: 'returns-metrics' }),
          mcqQ('c3', 'Which can inflate ROE without improving the underlying business?', ['Higher customer satisfaction', 'Taking on more debt', 'Better products', 'Lower costs'], 1, 'Debt shrinks equity relative to profit.', { concept: 'returns-metrics' }),
          mcqQ('c4', 'Customers struggling to leave a provider illustrates…', ['network effects', 'switching costs', 'cost advantage', 'brand'], 1, 'High switching costs.', { concept: 'business-quality' }),
          tfQ('c5', 'Receivables growing much faster than revenue can be a red flag.', true, 'It may mean sales are not turning into cash.', { concept: 'red-flags' }),
          mcqQ('c6', 'Where do US listed companies file annual reports?', ['Companies House', 'The SEC, as a 10-K', 'The Bank of England', 'Nasdaq only'], 1, 'Form 10-K, available on EDGAR.', { concept: 'red-flags' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'income-statement',
    questions: [
      mcqQ('e1', 'Which statement best describes a business model?', ['The company’s share price history', 'How the company creates value for customers and gets paid', 'The list of directors', 'The company’s tax bill'], 1, 'A business model explains who pays, for what, and how.', { concept: 'business-model' }),
      numQ('e2', 'Revenue $600m, COGS $360m. What is the gross margin?', 40, '($600m − $360m) ÷ $600m = 40%.', { suffix: '%', tolerance: 0.05, concept: 'margins' }),
      numQ('e3', 'Gross profit £90m, operating expenses £54m, revenue £300m. What is the operating margin?', 12, '(£90m − £54m) ÷ £300m = 12%.', { suffix: '%', tolerance: 0.05, concept: 'margins' }),
      tfQ('e4', 'Assets always equal liabilities plus shareholders’ equity.', true, 'This is the balance sheet identity.', { concept: 'balance-sheet' }),
      numQ('e5', 'Total assets £2bn; equity £800m. What are total liabilities in £m?', 1200, '£2,000m − £800m = £1,200m.', { prefix: '£', suffix: 'm', concept: 'balance-sheet' }),
      mcqQ('e6', 'Free cash flow is usually calculated as…', ['net income + dividends', 'operating cash flow − capital expenditure', 'revenue − COGS', 'cash − debt'], 1, 'FCF = OCF − capex.', { concept: 'cash-flow' }),
      tfQ('e7', 'Rapid growth can reduce a company’s cash even while profits rise.', true, 'Working capital and capex can absorb cash.', { concept: 'cash-flow' }),
      numQ('e8', 'Borrowings £500m, cash £120m, EBITDA £190m. What is net debt ÷ EBITDA?', 2, '(£500m − £120m) ÷ £190m = 2×.', { suffix: '×', tolerance: 0.01, concept: 'leverage' }),
      mcqQ('e9', 'Which interest cover suggests the greatest risk?', ['15×', '8×', '4×', '1.2×'], 3, 'At 1.2×, a small fall in profit could leave interest unpaid.', { concept: 'leverage' }),
      numQ('e10', 'Operating profit £80m, tax rate 25%, invested capital £400m. What is ROIC?', 15, '£80m × 0.75 = £60m; ÷ £400m = 15%.', { suffix: '%', tolerance: 0.05, concept: 'returns-metrics' }),
      mcqQ('e11', 'A company’s net income is flat but EPS rises 5%. The most likely reason is…', ['a share buyback', 'higher debt interest', 'a stock split', 'falling revenue'], 0, 'Fewer shares outstanding lift EPS.', { concept: 'returns-metrics' }),
      numQ('e12', 'Revenue falls from £500m to £450m. What is the growth rate?', -10, '(£450m − £500m) ÷ £500m = −10%.', { suffix: '%', tolerance: 0.05, concept: 'business-quality' }),
      multiQ('e13', 'Which are sources of competitive advantage? Select all that apply.', ['Network effects', 'Switching costs', 'A rising share price', 'Patents'], [0, 1, 3], 'A rising share price is an outcome, not an advantage.', { concept: 'business-quality' }),
      mcqQ('e14', 'Where are accounting policies and debt details usually explained?', ['The chair’s letter', 'The notes to the accounts', 'The share price chart', 'Press releases only'], 1, 'The notes.', { concept: 'red-flags' }),
      tfQ('e15', 'Adjusted or “underlying” profit figures are defined by accounting standards and cannot exclude real costs.', false, 'They are chosen by management; check the reconciliation.', { concept: 'red-flags' }),
    ],
  },
})

