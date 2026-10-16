import { analogy, course, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, recap, text, tf, tfQ, warn } from '../builders'

const priceValue = lesson(
  {
    title: 'Price, value and expectations',
    description: 'Why valuation is about the future, not the past.',
    objectives: ['Explain why valuation focuses on future cash flows', 'Describe how expectations are embedded in prices', 'Explain why a great company can be a poor investment'],
    tags: ['valuation-basics'],
  },
  [
    text(
      'What are you buying?',
      'When you buy a share, you buy a claim on the company’s **future** cash flows. Valuation asks: *given what I expect the business to produce, is today’s price reasonable?*\n\nSupply and demand set the price each moment. Valuation is the attempt to estimate whether that price is high or low relative to the business’s prospects.',
    ),
    key('Good company ≠ good investment', 'A wonderful business bought at a price that already assumes perfection can disappoint. A mediocre business bought very cheaply can do well. Returns depend on **what happens versus what the price already expected**.'),
    mcq('q1', 'Company A is excellent and its price assumes 25% growth for a decade. It then grows 15% a year — still impressive. What is a likely outcome for shareholders?', ['Strong returns, because the company grew', 'Disappointing returns, because growth fell short of what was priced in', 'Guaranteed losses', 'No effect on the share price'], 1, 'The price embedded higher expectations. Falling short — even with good growth — can lead to weak returns.'),
    analogy('The house with a view', 'A beautiful house is not a good purchase at any price. Overpay enough and even the nicest house is a poor investment. Valuation is the discipline of asking “at what price?”'),
    tf('q2', 'Valuation is mainly about analysing a company’s past profits.', false, 'False. Past results inform estimates, but value depends on future cash flows. That is why valuation always involves uncertainty.'),
    multi('q3', 'Which affect what a business is worth today? Select all that apply.', ['Expected future cash flows', 'How risky those cash flows are', 'When the cash flows arrive', 'The price you paid for the shares last year'], [0, 1, 2], 'Your own purchase price is irrelevant to the business’s value. Size, risk and timing of future cash flows are what matter.', { final: true }),
    recap('Value comes from future cash flows: their size, timing and risk.', 'Prices embed expectations; returns depend on outcomes versus expectations.', 'A great company can be a poor investment at the wrong price.'),
  ],
)

const peRatio = lesson(
  {
    title: 'The price-to-earnings ratio',
    description: 'The most quoted valuation multiple — and its traps.',
    objectives: ['Calculate a P/E ratio', 'Interpret earnings yield', 'Explain why P/E ratios differ'],
    tags: ['pe-ratio'],
    difficulty: 2,
  },
  [
    text(
      'Paying for profits',
      'The **price-to-earnings (P/E) ratio** compares a share price with earnings per share:\n\n**P/E = share price ÷ EPS** (or market cap ÷ net income).\n\nA P/E of 20 means investors pay £20 for every £1 of current annual earnings.',
    ),
    num('q1', 'A share costs £12 and EPS is £0.80. What is the P/E ratio?', 15, '£12 ÷ £0.80 = 15.', { suffix: '×', tolerance: 0.01 }),
    key('Earnings yield', 'Flip the P/E and you get the **earnings yield**: EPS ÷ price. A P/E of 20 is an earnings yield of 1 ÷ 20 = 5%. It is a handy way to compare with bond yields — but earnings are not paid out in full and are not guaranteed.'),
    num('q2', 'What is the earnings yield of a share with a P/E of 25?', 4, '1 ÷ 25 = 0.04 = 4%.', { suffix: '%', tolerance: 0.01 }),
    key('Why P/Es differ', 'Higher P/Es usually reflect expectations of faster or more reliable growth, or lower risk. Lower P/Es may reflect slow growth, high risk, cyclical earnings near a peak — or genuine undervaluation.\n\n**Trailing** P/E uses past 12 months’ earnings; **forward** P/E uses forecasts, which can be wrong.'),
    warn('When P/E breaks', 'P/E is meaningless for loss-making companies, and distorted when earnings are temporarily high or low. One-off gains can make a P/E look artificially low.'),
    mcq('q3', 'Company X trades on a P/E of 8, Company Y on 30. What can you conclude?', ['X is definitely cheaper', 'Y is definitely overvalued', 'The market expects different growth or risk; you need to investigate why', 'X will outperform'], 2, 'P/E alone cannot tell you which is better value. You need to understand growth prospects, risk and earnings quality.', { final: true }),
    recap('P/E = price ÷ EPS; earnings yield = EPS ÷ price.', 'High P/Es usually embed higher growth expectations.', 'P/E fails for loss-makers and is distorted by unusual earnings.'),
  ],
)

const psPb = lesson(
  {
    title: 'Price-to-sales and price-to-book',
    description: 'Multiples for when earnings don’t tell the whole story.',
    objectives: ['Calculate P/S and P/B ratios', 'Choose when each multiple is useful', 'Recognise their weaknesses'],
    tags: ['ps-pb'],
    difficulty: 2,
  },
  [
    key('Price-to-sales (P/S)', '**P/S = market cap ÷ revenue.** Useful for young companies with little or no profit. Weakness: revenue is not profit. £1 of sales at a 2% margin is worth far less than £1 at a 30% margin.'),
    num('q1', 'A company has a market cap of £900m and revenue of £300m. What is its P/S ratio?', 3, '£900m ÷ £300m = 3×.', { suffix: '×', tolerance: 0.01 }),
    key('Price-to-book (P/B)', '**P/B = market cap ÷ book value of equity.** Useful for asset-heavy businesses such as banks and insurers, where balance-sheet assets are central. Weakness: book value misses many intangible assets, so it says little about software or brand-driven companies.'),
    num('q2', 'A bank has a market cap of $40bn and book equity of $50bn. What is its P/B?', 0.8, '$40bn ÷ $50bn = 0.8×: the market values it below its accounting net assets.', { suffix: '×', tolerance: 0.01 }),
    match('q3', 'Match each company with the multiple most likely to be informative.', [['A loss-making fast-growing software start-up', 'Price-to-sales'], ['A large retail bank', 'Price-to-book'], ['A stable, profitable consumer goods company', 'Price-to-earnings']], 'Choose the multiple that reflects how each business creates value.'),
    tf('q4', 'A P/B below 1 always means a share is a bargain.', false, 'False. It may signal that the market doubts the asset values or expects poor returns on them — for example, bad loans at a bank.', { final: true }),
    recap('P/S = market cap ÷ revenue; good for early-stage companies but ignores margins.', 'P/B = market cap ÷ book equity; useful for banks, weak for intangible-heavy firms.', 'No single multiple suits every business.'),
  ],
)

const evEbitda = lesson(
  {
    title: 'Enterprise value and EV/EBITDA',
    description: 'Valuing the whole business, debt included.',
    objectives: ['Calculate enterprise value', 'Calculate EV/EBITDA', 'Explain why EV is useful for comparing companies with different debt levels'],
    tags: ['ev-ebitda'],
    difficulty: 3,
    minutes: 6,
  },
  [
    text(
      'Buying the whole company',
      'Market cap only values the shares. If you bought a whole company, you would also take on its debt but get its cash. **Enterprise value (EV)** captures this:\n\n**EV = market cap + debt − cash** (simplified; analysts may also add items such as leases and minority interests).',
    ),
    num('q1', 'Market cap £1,000m, debt £300m, cash £100m. What is enterprise value in £m?', 1200, '£1,000m + £300m − £100m = £1,200m.', { prefix: '£', suffix: 'm' }),
    key('EV/EBITDA', '**EBITDA** is earnings before interest, tax, depreciation and amortisation — a rough proxy for operating cash earnings before capital spending.\n\n**EV/EBITDA** compares the value of the whole business with these earnings. Because both EV and EBITDA are “before” financing, the ratio compares companies with different debt levels more fairly than P/E.'),
    num('q2', 'Using EV of £1,200m and EBITDA of £150m, what is EV/EBITDA?', 8, '£1,200m ÷ £150m = 8×.', { suffix: '×', tolerance: 0.01 }),
    warn('EBITDA is not cash', 'EBITDA ignores capital expenditure, tax and changes in working capital. Capital-intensive businesses can look cheap on EV/EBITDA while generating little free cash flow. A popular quip: “Does management think the tooth fairy pays for capex?”'),
    mcq('q3', 'Two companies have the same market cap and EBITDA. Company A has no debt; Company B has large debt. On EV/EBITDA, which looks more expensive?', ['A', 'B', 'They are the same', 'It cannot be calculated'], 1, 'B’s debt raises its EV, so the same EBITDA buys a larger EV — a higher multiple. P/E would hide this difference in a different way.', { final: true }),
    recap('EV = market cap + debt − cash.', 'EV/EBITDA compares companies regardless of capital structure.', 'EBITDA ignores capex, so check free cash flow too.'),
  ],
)

const presentValue = lesson(
  {
    title: 'Present value: money now versus later',
    description: 'Why £100 today is worth more than £100 next year.',
    objectives: ['Explain the time value of money', 'Calculate present value', 'Relate discounting to compounding'],
    tags: ['present-value'],
    difficulty: 2,
  },
  [
    text(
      'The time value of money',
      'Would you rather have £100 today or £100 in a year? Today — because you could invest it, and because the future is uncertain. Money in the future is worth less than the same money now.\n\n**Discounting** converts future cash into today’s value. It is compounding in reverse.',
    ),
    numbers('The formula', [['Present value', 'PV = future cash ÷ (1 + r)ⁿ'], ['£110 in 1 year at 10%', '£110 ÷ 1.10 = £100'], ['£1,000 in 3 years at 8%', '£1,000 ÷ 1.08³ ≈ £793.83']]),
    num('q1', 'What is the present value of £500 received in 2 years, discounted at 5% a year? (Nearest penny.)', 453.51, '£500 ÷ 1.05² = £500 ÷ 1.1025 ≈ £453.51.', { prefix: '£', tolerance: 0.02, working: '£500 ÷ (1.05 × 1.05) = £453.51' }),
    mcq('q2', 'If the discount rate rises, what happens to the present value of a fixed future payment?', ['It rises', 'It falls', 'It stays the same', 'It becomes negative'], 1, 'A higher rate means you divide by a bigger number, so the future cash is worth less today.'),
    num('q3', 'What is the total present value of £50 received in 1 year and £50 received in 2 years, at 10%? (Nearest penny.)', 86.78, '£50 ÷ 1.1 = £45.45; £50 ÷ 1.21 = £41.32; total ≈ £86.78.', { prefix: '£', tolerance: 0.02 }),
    tf('q4', 'Cash received further in the future is worth less today, all else equal.', true, 'True. Each extra year of waiting means another round of discounting.', { final: true }),
    recap('Money today is worth more than the same money later.', 'PV = future cash ÷ (1 + r)ⁿ.', 'Higher discount rates and longer waits mean lower present values.'),
  ],
)

const discountRates = lesson(
  {
    title: 'Discount rates and required returns',
    description: 'Choosing the rate that turns future cash into value today.',
    objectives: ['Explain what a discount rate represents', 'Relate discount rates to risk', 'Explain why interest rates affect valuations'],
    tags: ['discount-rate'],
    difficulty: 3,
  },
  [
    text(
      'The rate is a judgement',
      'The **discount rate** is the annual return an investor requires to hold an investment, given its risk. It is often linked to a company’s **cost of capital** — what its lenders and shareholders expect to earn.\n\nA riskier business warrants a higher discount rate, which lowers the present value of its cash flows.',
    ),
    key('Building blocks', 'A required return is often thought of as a **risk-free rate** (such as government bond yields) plus a **risk premium** for the uncertainty of the investment. When government bond yields rise, required returns tend to rise too — which is one reason share valuations often come under pressure when interest rates climb.'),
    mcq('q1', 'Which company should generally be valued with a higher discount rate?', ['A regulated water utility with stable revenue', 'An early-stage biotech with one unproven drug', 'A government bond', 'A cash deposit'], 1, 'The biotech’s cash flows are highly uncertain, so investors require a higher return to compensate.'),
    tf('q2', 'Rising interest rates, all else equal, tend to reduce the present value of companies’ future cash flows.', true, 'True. Higher rates raise the discount rate, shrinking present values — especially for cash flows far in the future.'),
    mcq('q3', 'Why are “long-duration” growth companies, whose cash flows lie mostly far in the future, often especially sensitive to interest rates?', ['They have more debt', 'Distant cash flows are discounted over more years, so rate changes compound their effect', 'They pay higher dividends', 'They are not sensitive'], 1, 'The further away the cash, the more times the discount rate is applied, so changes in the rate have a bigger effect.', { final: true }),
    recap('The discount rate is the required return given risk.', 'Required return ≈ risk-free rate + risk premium.', 'Higher rates lower valuations, especially for distant cash flows.'),
  ],
)

const dcf = lesson(
  {
    title: 'Discounted cash flow (DCF) fundamentals',
    description: 'Adding up a business’s future cash, in today’s money.',
    objectives: ['Describe the steps of a DCF', 'Calculate a simple terminal value', 'Value a business with a simple three-year DCF'],
    tags: ['dcf'],
    difficulty: 3,
    minutes: 7,
  },
  [
    text(
      'The DCF recipe',
      'A **discounted cash flow** valuation estimates a business’s value as the present value of all its expected future free cash flows.\n\n1. Forecast free cash flow for a few years.\n2. Estimate a **terminal value** for all the years after that.\n3. Discount everything back at the discount rate.\n4. Add it up. (Subtract net debt to get the value of the equity.)',
    ),
    order('q1', 'Put the steps of a DCF in order.', ['Forecast free cash flows', 'Estimate a terminal value', 'Discount all cash flows to today', 'Sum the present values'], 'Forecast, add a terminal value, discount, sum.'),
    key('Terminal value', 'A common method assumes cash flows grow at a constant rate *g* forever after the forecast. The **perpetuity growth formula** gives the value at the end of the forecast period:\n\nTV = next year’s cash flow ÷ (r − g)\n\nIt only works when r is greater than g, and g should be modest — no company can outgrow the economy forever.'),
    num('q2', 'Next year’s cash flow is £5m, the discount rate is 9% and growth is 4% forever. What is the value using the perpetuity formula (£m)?', 100, '£5m ÷ (0.09 − 0.04) = £5m ÷ 0.05 = £100m.', { prefix: '£', suffix: 'm', tolerance: 0.01 }),
    numbers('A three-year DCF (£m, discount rate 10%, terminal growth 2%)', [
      ['Year 1 FCF 10 → PV', '10 ÷ 1.1 = 9.09'],
      ['Year 2 FCF 11 → PV', '11 ÷ 1.21 = 9.09'],
      ['Year 3 FCF 12 + terminal value 153 → PV', '165 ÷ 1.331 = 123.97'],
      ['Terminal value', '12 × 1.02 ÷ (0.10 − 0.02) = 153'],
      ['Enterprise value', '≈ 142.1'],
    ], 'Hypothetical numbers. Notice that the terminal value makes up about 80% of the total.'),
    mcq('q3', 'In the table above, roughly what share of the value comes from the terminal value?', ['About 10%', 'About 30%', 'About 50%', 'About 80%'], 3, 'The terminal value’s present value is 153 ÷ 1.331 ≈ 115, out of about 142 — roughly 80%. DCFs are often dominated by assumptions about the distant future.', { final: true }),
    recap('A DCF sums the present value of expected future free cash flows.', 'Terminal value = next year’s cash flow ÷ (r − g), with r > g.', 'Terminal values often dominate — so assumptions matter enormously.'),
  ],
)

const sensitivity = lesson(
  {
    title: 'Sensitivity and margin of safety',
    description: 'Why valuation outputs are ranges, not answers.',
    objectives: ['Show how small assumption changes move a DCF', 'Calculate a margin of safety', 'Explain why valuations should be treated as ranges'],
    tags: ['margin-of-safety'],
    difficulty: 3,
  },
  [
    numbers('Same three-year DCF, different discount rates', [['Discount rate 9%', '≈ £162.7m'], ['Discount rate 10%', '≈ £142.1m'], ['Discount rate 11%', '≈ £126.2m']], 'A 2-percentage-point range in one assumption moves the value by about 29% from low to high.'),
    key('Garbage in, garbage out', 'A DCF is only as good as its assumptions. Small changes to growth, margins or discount rates can swing the result dramatically. Good analysts test a range of scenarios rather than trusting a single number.'),
    mcq('q1', 'An analyst’s DCF says a share is worth exactly £23.47. How should you treat this?', ['As a precise prediction of the future price', 'As one estimate within a wide range that depends heavily on assumptions', 'As a guarantee', 'As irrelevant'], 1, 'Precision is not accuracy. The figure is one output of many uncertain inputs.'),
    key('Margin of safety', 'A **margin of safety** is the gap between your estimate of value and the price you pay. Buying well below your estimate leaves room for error.\n\nMargin of safety = (estimated value − price) ÷ estimated value.'),
    num('q2', 'You estimate a share is worth £20. It trades at £15. What is your margin of safety?', 25, '(£20 − £15) ÷ £20 = 25%.', { suffix: '%', tolerance: 0.05 }),
    tf('q3', 'A margin of safety protects you against your own estimation errors as well as bad luck.', true, 'True. That is its main purpose: your estimate could simply be wrong.', { final: true }),
    recap('Valuation outputs are highly sensitive to assumptions.', 'Use scenarios and ranges, not single numbers.', 'Margin of safety = (value − price) ÷ value.'),
  ],
)

const yields = lesson(
  {
    title: 'Dividend yield and free cash flow yield',
    description: 'Measuring cash returned — or available — per pound invested.',
    objectives: ['Calculate dividend yield', 'Calculate free cash flow yield', 'Explain why yield alone can mislead'],
    tags: ['yields'],
    difficulty: 2,
  },
  [
    key('Dividend yield', '**Dividend yield = annual dividend per share ÷ share price.** A share paying 30p a year at £6.00 yields 5%.'),
    num('q1', 'A company pays annual dividends of $1.20 per share and the share price is $40. What is the dividend yield?', 3, '$1.20 ÷ $40 = 3%.', { suffix: '%', tolerance: 0.01 }),
    key('Free cash flow yield', '**FCF yield = free cash flow ÷ market cap** (or FCF per share ÷ price). It shows how much cash the business generates relative to its price — cash that *could* fund dividends, buybacks, debt repayment or growth.'),
    num('q2', 'Free cash flow is £50m and market cap is £1bn. What is the FCF yield?', 5, '£50m ÷ £1,000m = 5%.', { suffix: '%', tolerance: 0.01 }),
    warn('High yield, high risk?', 'Yields rise when prices fall. A very high yield can mean the market expects the dividend to be cut. Check whether dividends are covered by free cash flow.'),
    mcq('q3', 'Company A yields 9% but its dividend exceeds its free cash flow. Company B yields 3% with dividends covered three times by FCF. Which statement is most reasonable?', ['A is clearly better — higher income', 'A’s dividend may be at risk; B’s is better supported', 'Both are equally safe', 'Yield is unrelated to risk'], 1, 'A dividend not covered by free cash flow must be funded by debt, savings or asset sales — unsustainable over time.', { final: true }),
    recap('Dividend yield = dividend ÷ price.', 'FCF yield = free cash flow ÷ market cap.', 'Very high yields can signal risk; check cash coverage.'),
  ],
)

const comparables = lesson(
  {
    title: 'Comparable company analysis',
    description: 'Valuing a business by looking at its peers.',
    objectives: ['Apply a peer multiple to estimate value', 'Choose appropriate comparables', 'Recognise the limits of relative valuation'],
    tags: ['comparables'],
    difficulty: 2,
  },
  [
    text(
      'Relative valuation',
      '**Comparable company analysis** (“comps”) values a business using the multiples of similar listed companies. If similar firms trade on 15× earnings, a company with £2 EPS might be worth around £30 per share.\n\nIt is quick and grounded in market prices — but if the whole sector is overvalued, comps will say your company is too.',
    ),
    num('q1', 'Peers trade on an average P/E of 18. Your company’s EPS is £1.50. What price does this imply?', 27, '18 × £1.50 = £27.', { prefix: '£', tolerance: 0.01 }),
    num('q2', 'Peers trade on 10× EV/EBITDA. Your company’s EBITDA is £40m and net debt is £100m. What equity value does this imply (£m)?', 300, 'EV = 10 × £40m = £400m. Equity = EV − net debt = £400m − £100m = £300m.', { prefix: '£', suffix: 'm', working: '10 × £40m = £400m; £400m − £100m = £300m' }),
    multi('q3', 'What makes a good comparable? Select all that apply.', ['Similar business model', 'Similar growth and margins', 'Same first letter of company name', 'Similar risk profile'], [0, 1, 3], 'Comparables should share economics, not names.'),
    tf('q4', 'Comparable analysis tells you whether a whole sector is fairly valued.', false, 'False. It values companies relative to each other. If the sector is mispriced, comps inherit the error.', { final: true }),
    recap('Comps apply peer multiples to your company’s metrics.', 'Choose peers with similar business models, growth, margins and risk.', 'Relative valuation can’t detect sector-wide mispricing.'),
  ],
)

const businessTypes = lesson(
  {
    title: 'Growth, mature and cyclical businesses',
    description: 'Why different businesses need different valuation approaches.',
    objectives: ['Match valuation approaches to business types', 'Explain the cyclical P/E trap', 'Recognise sector-specific metrics'],
    tags: ['business-types'],
    difficulty: 3,
  },
  [
    match('q1', 'Match each business type with a sensible valuation focus.', [['Early-stage high-growth software', 'Revenue multiples and long-term DCF scenarios'], ['Mature consumer staples company', 'P/E, dividend and FCF yields'], ['Bank', 'Price-to-book and return on equity'], ['Cyclical steel producer', 'Normalised (mid-cycle) earnings']], 'Different economics require different lenses.'),
    key('The cyclical trap', 'Cyclical companies (steel, mining, airlines, carmakers) earn bumper profits at the top of the cycle and little or nothing at the bottom. At the peak, their P/E can look temptingly **low** — just before profits fall. At the bottom, P/E can look absurdly **high** while the business is about to recover. Analysts often use average earnings across a cycle.'),
    mcq('q2', 'A mining company trades on a P/E of 4 after a year of record commodity prices. What should a careful analyst consider?', ['It is obviously cheap', 'Earnings may be at a cyclical peak and could fall sharply', 'Mining companies cannot be valued', 'P/E always works for cyclicals'], 1, 'A low P/E on peak earnings may simply reflect the market expecting those earnings to fall.'),
    example('Growth versus mature', 'A young company reinvesting everything may have no profit today but large potential cash flows later; P/E is useless, so analysts use revenue multiples or scenario-based DCFs. A mature company with steady profits can be valued on earnings and cash yields.'),
    tf('q3', 'The same valuation multiple is equally useful across all sectors.', false, 'False. Banks, software firms, miners and utilities have very different economics; each needs suitable metrics.', { final: true }),
    recap('Match valuation methods to the business’s economics.', 'Cyclicals look cheapest at peak earnings: use normalised profits.', 'Growth companies often need revenue multiples and scenario analysis.'),
  ],
)

const trapsAndPremiums = lesson(
  {
    title: 'Value traps and justified premiums',
    description: 'When cheap is expensive, and expensive is fair.',
    objectives: ['Define a value trap', 'Explain when a high multiple can be justified', 'Evaluate a valuation case'],
    tags: ['value-traps'],
    difficulty: 3,
  },
  [
    key('Value traps', 'A **value trap** is a share that looks cheap on multiples but stays cheap or gets cheaper, because the business is declining. Low multiples can reflect shrinking revenue, disruption, heavy debt or accounting problems.'),
    multi('q1', 'Which are signs a cheap-looking share could be a value trap? Select all that apply.', ['Revenue shrinking for several years', 'Customers moving to new technology', 'High debt due for refinancing soon', 'Rising free cash flow and market share'], [0, 1, 2], 'Rising FCF and market share point the other way.'),
    key('Justified premiums', 'A high multiple can be reasonable when a company can reinvest at high returns for many years, has a durable competitive advantage and predictable cash flows. The risk is that the premium already assumes a rosy future — leaving little margin for error.'),
    example('A simple case (hypothetical)', 'Company Q trades on 35× earnings. It has grown earnings 20% a year for a decade, earns a 30% ROIC and has high customer retention. Company R trades on 6× earnings; its revenue has fallen 8% a year for five years and it has heavy debt.\n\nQ is not automatically overvalued, and R is not automatically a bargain.'),
    mcq('q2', 'In the case above, what is the most defensible analytical stance?', ['Buy R: lowest P/E wins', 'Sell Q: high P/E means overvalued', 'Investigate whether Q’s growth can persist and whether R’s decline is priced in', 'Both are equally attractive'], 2, 'Valuation requires comparing expectations embedded in the price with a realistic view of the future.'),
    tf('q3', 'A share with a P/E of 40 can be better value than one with a P/E of 10.', true, 'True — if its future earnings growth and durability are strong enough relative to the price, and the low-P/E company is in decline.', { final: true }),
    recap('Value traps look cheap because the business is deteriorating.', 'High multiples can be justified by durable, high-return growth.', 'Always ask what the price assumes about the future.'),
  ],
)

export const c5 = course({
  id: 'c5',
  slug: 'valuation',
  title: 'Valuation and Company Analysis',
  tagline: 'Is the price right? Learn to estimate value.',
  description: 'From P/E ratios to discounted cash flows: learn the core valuation tools, how to use them sensibly, and why every valuation is an estimate built on assumptions.',
  colour: 'coral',
  icon: 'scale',
  outcomes: [
    'Calculate and interpret P/E, P/S, P/B, EV/EBITDA, dividend and FCF yields',
    'Apply present value and simple discounted cash flow models',
    'Use comparable companies and match methods to business types',
    'Explain valuation sensitivity, margin of safety, value traps and justified premiums',
  ],
  units: [
    {
      title: 'Multiples',
      description: 'P/E, P/S, P/B and EV/EBITDA.',
      lessons: [priceValue, peRatio, psPb, evEbitda],
      checkpoint: {
        concept: 'pe-ratio',
        questions: [
          numQ('c1', 'Price $45, EPS $3. What is the P/E?', 15, '$45 ÷ $3 = 15.', { suffix: '×', tolerance: 0.01, concept: 'pe-ratio' }),
          numQ('c2', 'What is the earnings yield at a P/E of 10?', 10, '1 ÷ 10 = 10%.', { suffix: '%', tolerance: 0.01, concept: 'pe-ratio' }),
          mcqQ('c3', 'P/E is least useful for…', ['a stable profitable retailer', 'a loss-making start-up', 'a mature drinks company', 'a utility'], 1, 'No earnings, no meaningful P/E.', { concept: 'pe-ratio' }),
          numQ('c4', 'Market cap £2bn, book equity £2.5bn. What is P/B?', 0.8, '2 ÷ 2.5 = 0.8×.', { suffix: '×', tolerance: 0.01, concept: 'ps-pb' }),
          numQ('c5', 'Market cap $800m, debt $250m, cash $50m. What is EV in $m?', 1000, '$800m + $250m − $50m = $1,000m.', { prefix: '$', suffix: 'm', concept: 'ev-ebitda' }),
          tfQ('c6', 'A great company is always a good investment regardless of price.', false, 'Price determines returns relative to expectations.', { concept: 'valuation-basics' }),
        ],
      },
    },
    {
      title: 'Cash flow valuation',
      description: 'Present value, discount rates and DCF.',
      lessons: [presentValue, discountRates, dcf, sensitivity],
      checkpoint: {
        concept: 'dcf',
        questions: [
          numQ('c1', 'What is the present value of £121 in 2 years at 10%?', 100, '£121 ÷ 1.21 = £100.', { prefix: '£', tolerance: 0.01, concept: 'present-value' }),
          mcqQ('c2', 'A higher discount rate…', ['raises present values', 'lowers present values', 'has no effect', 'only affects bonds'], 1, 'Dividing by a larger factor lowers PV.', { concept: 'present-value' }),
          mcqQ('c3', 'Which needs the highest discount rate?', ['A government bond', 'A stable utility', 'A speculative start-up', 'Cash'], 2, 'Highest uncertainty.', { concept: 'discount-rate' }),
          numQ('c4', 'Next year’s FCF £8m, r = 10%, g = 2%. Perpetuity value in £m?', 100, '£8m ÷ 0.08 = £100m.', { prefix: '£', suffix: 'm', tolerance: 0.01, concept: 'dcf' }),
          numQ('c5', 'Value estimate $50, price $40. Margin of safety?', 20, '$10 ÷ $50 = 20%.', { suffix: '%', tolerance: 0.05, concept: 'margin-of-safety' }),
          tfQ('c6', 'DCF outputs are precise predictions of future share prices.', false, 'They are estimates highly sensitive to assumptions.', { concept: 'margin-of-safety' }),
        ],
      },
    },
    {
      title: 'Valuation in practice',
      description: 'Yields, comparables, business types and traps.',
      lessons: [yields, comparables, businessTypes, trapsAndPremiums],
      checkpoint: {
        concept: 'comparables',
        questions: [
          numQ('c1', 'Dividend 24p, price £4.80. What is the dividend yield?', 5, '£0.24 ÷ £4.80 = 5%.', { suffix: '%', tolerance: 0.01, concept: 'yields' }),
          numQ('c2', 'FCF $120m, market cap $3bn. What is the FCF yield?', 4, '$120m ÷ $3,000m = 4%.', { suffix: '%', tolerance: 0.01, concept: 'yields' }),
          numQ('c3', 'Peers on 12× P/E; EPS £2.50. Implied price?', 30, '12 × £2.50 = £30.', { prefix: '£', tolerance: 0.01, concept: 'comparables' }),
          mcqQ('c4', 'At the peak of its cycle, a cyclical company’s P/E often looks…', ['very high', 'very low', 'exactly average', 'negative'], 1, 'Peak earnings shrink the P/E.', { concept: 'business-types' }),
          mcqQ('c5', 'Banks are commonly analysed with…', ['price-to-sales', 'price-to-book and ROE', 'EV/EBITDA only', 'dividend cover only'], 1, 'Banks’ balance sheets are central.', { concept: 'business-types' }),
          tfQ('c6', 'A low P/E always signals a bargain.', false, 'It may be a value trap.', { concept: 'value-traps' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'valuation-basics',
    questions: [
      mcqQ('e1', 'The value of a business is fundamentally based on…', ['its past share price', 'expected future cash flows, their timing and risk', 'its number of employees', 'its headquarters location'], 1, 'Future cash flows.', { concept: 'valuation-basics' }),
      numQ('e2', 'Market cap £600m, net income £40m. What is the P/E?', 15, '£600m ÷ £40m = 15.', { suffix: '×', tolerance: 0.01, concept: 'pe-ratio' }),
      numQ('e3', 'Market cap $1.5bn, revenue $500m. What is P/S?', 3, '1.5 ÷ 0.5 = 3×.', { suffix: '×', tolerance: 0.01, concept: 'ps-pb' }),
      numQ('e4', 'Market cap £500m, debt £200m, cash £50m, EBITDA £65m. What is EV/EBITDA?', 10, 'EV £650m ÷ £65m = 10×.', { suffix: '×', tolerance: 0.01, concept: 'ev-ebitda' }),
      tfQ('e5', 'EBITDA includes the cost of capital expenditure.', false, 'EBITDA ignores capex.', { concept: 'ev-ebitda' }),
      numQ('e6', 'Present value of £1,000 in 1 year at 25%?', 800, '£1,000 ÷ 1.25 = £800.', { prefix: '£', tolerance: 0.01, concept: 'present-value' }),
      mcqQ('e7', 'Rising government bond yields tend to…', ['raise share valuations', 'lower share valuations, all else equal', 'have no effect on shares', 'only affect banks'], 1, 'Higher required returns lower present values.', { concept: 'discount-rate' }),
      numQ('e8', 'Next year’s FCF £12m, r = 8%, g = 3%. Perpetuity value in £m?', 240, '£12m ÷ 0.05 = £240m.', { prefix: '£', suffix: 'm', tolerance: 0.01, concept: 'dcf' }),
      tfQ('e9', 'The perpetuity growth formula requires the discount rate to exceed the growth rate.', true, 'Otherwise the formula breaks down.', { concept: 'dcf' }),
      numQ('e10', 'Value estimate £80, price £60. What is the margin of safety?', 25, '£20 ÷ £80 = 25%.', { suffix: '%', tolerance: 0.05, concept: 'margin-of-safety' }),
      numQ('e11', 'Dividend $2 per share, price $50. Dividend yield?', 4, '$2 ÷ $50 = 4%.', { suffix: '%', tolerance: 0.01, concept: 'yields' }),
      numQ('e12', 'Peers trade on 8× EV/EBITDA. EBITDA £50m, net debt £150m. Implied equity value in £m?', 250, 'EV £400m − £150m = £250m.', { prefix: '£', suffix: 'm', concept: 'comparables' }),
      mcqQ('e13', 'Which metric best suits a loss-making high-growth company?', ['P/E', 'Dividend yield', 'Price-to-sales', 'Interest cover'], 2, 'Revenue-based multiples work without profits.', { concept: 'business-types' }),
      multiQ('e14', 'Which are signs of a potential value trap? Select all that apply.', ['Persistently falling revenue', 'Heavy debt maturing soon', 'Disruption by new technology', 'Rising ROIC'], [0, 1, 2], 'Rising ROIC is a positive sign.', { concept: 'value-traps' }),
      tfQ('e15', 'A high P/E can be justified by durable, high-return growth.', true, 'If growth and durability are strong enough relative to the price.', { concept: 'value-traps' }),
    ],
  },
})

