import { course, diagram, example, key, lesson, match, matchQ, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, ukus, warn } from '../builders'

const rentVsBuy = lesson(
  {
    title: 'Renting versus buying',
    description: 'Total costs, flexibility and the money your deposit could earn elsewhere.',
    objectives: ['List the full costs of owning and renting', 'Explain opportunity cost on a deposit', 'Weigh flexibility against long-term ownership'],
    tags: ['pr-rent-vs-buy'],
  },
  [
    text(
      'Not just rent versus mortgage',
      'A common mistake is to compare **rent** with a **mortgage payment** and stop there. A fair comparison looks at the **total cost** of each option: what you pay, what you give up and what you might gain.\n\nNeither option is “dead money” or automatically better. It depends on prices, interest rates, how long you stay and what you would do with the cash otherwise.',
    ),
    diagram(
      {
        type: 'compare',
        columns: [
          { title: 'Owning', tone: 'sun', points: ['Mortgage interest', 'Maintenance and repairs', 'Insurance and property taxes or service charges', 'Buying and selling costs', 'Opportunity cost of the deposit', 'Possible gain (or loss) in price'] },
          { title: 'Renting', tone: 'sky', points: ['Rent', 'Contents insurance', 'Moving costs', 'Rent rises at renewal', 'Deposit can stay invested', 'Easier to move'] },
        ],
      },
      'The costs that matter are the ones you don’t get back.',
    ),
    key('Opportunity cost', 'Money tied up in a home can’t be invested elsewhere. The **opportunity cost** is the return you give up. A £40,000 deposit that could have earned 4% a year costs you about £1,600 a year in forgone return — before any change in the home’s value.'),
    num('q1', 'A buyer puts down a $50,000 down payment. If that money could otherwise earn 5% a year, what is the annual opportunity cost?', 2500, '$50,000 × 5% = $2,500 a year in forgone return.', { prefix: '$', tolerance: 0.01 }),
    multi('q2', 'Which are costs of owning that a simple “rent versus mortgage payment” comparison often leaves out? Select all that apply.', ['Maintenance and repairs', 'Buying and selling costs', 'Opportunity cost of the deposit', 'The landlord’s mortgage'], [0, 1, 2], 'The landlord’s mortgage is the landlord’s cost, not yours. The other three are real costs of owning.'),
    key('Flexibility has value', 'Buying and selling are slow and expensive. If you might move within a few years — for a new job or study — one-off costs can outweigh any gain. Renting keeps options open; owning gives security of tenure and control over the home.'),
    tf('q3', 'Renting is always “dead money”, so buying is always the better financial choice.', false, 'False. Owners also pay costs they never get back — interest, maintenance, transaction costs and opportunity cost. The better choice depends on circumstances.', { final: true }),
    recap('Compare total costs, not rent versus mortgage payment.', 'Opportunity cost: what the deposit could earn elsewhere.', 'Flexibility matters, especially if you may move soon.'),
  ],
)

const depositsLtv = lesson(
  {
    title: 'Deposits and loan-to-value',
    description: 'How much you put down shapes how much you borrow — and the rate you pay.',
    objectives: ['Calculate loan-to-value (LTV)', 'Work out the deposit needed for a target LTV', 'Explain why lower LTVs usually get better rates'],
    tags: ['pr-deposits-ltv'],
    difficulty: 2,
  },
  [
    ukus('Deposit or down payment', 'In the UK, the cash you put towards a home is the **deposit**. In the US it is the **down payment**. The rest is borrowed through a **mortgage** secured on the property.'),
    key('Loan-to-value', '**LTV = mortgage ÷ property value.**\n\nBuy a £300,000 home with a £30,000 deposit and you borrow £270,000. LTV = £270,000 ÷ £300,000 = **90%**.'),
    num('q1', 'A home costs £250,000 and the buyer has a £50,000 deposit. What is the LTV?', 80, '£200,000 ÷ £250,000 = 80%.', { suffix: '%', tolerance: 0.01 }),
    num('q2', 'A buyer wants an 85% LTV mortgage on a £200,000 home. How big a deposit do they need?', 30000, '15% of £200,000 = £30,000. They borrow £170,000 (85%).', { prefix: '£', tolerance: 0.5 }),
    text(
      'Why LTV matters',
      'The lower the LTV, the bigger the cushion between the loan and the home’s value. Lenders see that as less risky, so lower-LTV mortgages usually come with **lower interest rates**. Rates often step down at bands such as 90%, 85%, 75% and 60%.',
    ),
    ukus('US mortgage insurance', 'In the US, conventional loans with less than 20% down usually require **private mortgage insurance (PMI)**, which protects the lender — not you — and adds to the monthly cost. It can typically be removed once enough equity builds up.'),
    mcq('q3', 'Two buyers want identical homes. Who would usually be offered the lower interest rate?', ['The buyer borrowing at 95% LTV', 'The buyer borrowing at 90% LTV', 'The buyer borrowing at 75% LTV', 'They would always get the same rate'], 2, 'A lower LTV means more equity protecting the lender, so rates are usually lower.', { final: true }),
    recap('LTV = mortgage ÷ property value.', 'Deposit needed = (100% − LTV) × price.', 'Lower LTV usually means lower rates; US PMI often applies below 20% down.'),
  ],
)

const costsAffordability = lesson(
  {
    title: 'Buying costs and affordability',
    description: 'One-off costs, income limits and stress tests.',
    objectives: ['Identify UK and US one-off buying costs', 'Apply simple affordability rules of thumb', 'Explain why lenders stress test at higher rates'],
    tags: ['pr-buying-costs'],
    difficulty: 2,
  },
  [
    text(
      'The price is not the cost',
      'On top of the deposit, buyers pay **one-off costs** that are not recovered when they sell. These can easily run to thousands, so they belong in the budget from the start.',
    ),
    ukus(
      'UK and US one-off costs',
      '- **UK**: **Stamp Duty Land Tax (SDLT)** in England and Northern Ireland is charged in bands on the portion of the price within each band. Scotland (LBTT) and Wales (LTT) have their own taxes. First-time buyers may get relief, and buyers of additional homes pay a surcharge. Add solicitor (conveyancing), survey and mortgage fees.\n- **US**: **closing costs** — lender fees, title insurance, appraisal, recording fees and sometimes transfer taxes — are often quoted at roughly **2–5% of the price**, varying by state and loan.',
    ),
    warn('Thresholds change', 'Stamp duty bands and reliefs have changed several times, including in April 2025. Always check the current rules on gov.uk (or the Scottish and Welsh revenue authorities) before relying on any figure. This is education, not advice.'),
    num('q1', 'A US buyer estimates closing costs at 3% of a $400,000 purchase price. How much is that?', 12000, '$400,000 × 3% = $12,000.', { prefix: '$', tolerance: 0.5 }),
    key('Affordability', 'UK lenders often cap borrowing at around **4 to 4.5 times income**, sometimes more, after checking spending. A common US guideline (the **28/36 rule**) suggests housing costs of no more than 28% of gross monthly income and total debt payments no more than 36%. These are rules of thumb, not guarantees of comfort.'),
    num('q2', 'Using the 28% guideline, what is the maximum monthly housing cost for someone with gross monthly income of $6,000?', 1680, '$6,000 × 28% = $1,680.', { prefix: '$', tolerance: 0.5 }),
    numbers('Stress test: £200,000 repayment mortgage over 25 years', [['At 5%', '≈ £1,169 a month'], ['At 7%', '≈ £1,414 a month'], ['At 8%', '≈ £1,544 a month']], 'Illustrative monthly payments, rounded to the nearest pound.'),
    num('q3', 'Using the table, how much more a month would the borrower pay at 8% than at 5%?', 375, '£1,544 − £1,169 = £375 a month — about £4,500 a year.', { prefix: '£', tolerance: 1 }),
    tf('q4', 'Lenders check whether you could still afford payments if interest rates rose, not just at today’s rate.', true, 'True. Stress testing asks whether the borrower could cope with higher payments later, for example when a fixed deal ends.', { final: true }),
    recap('Budget for one-off costs: UK SDLT and fees; US closing costs (often 2–5%).', 'Affordability rules: UK income multiples; US 28/36 guideline.', 'Stress test your budget at higher rates.'),
  ],
)

const mortgageTypes = lesson(
  {
    title: 'Types of mortgage',
    description: 'Repayment or interest-only, fixed or variable.',
    objectives: ['Distinguish repayment and interest-only mortgages', 'Compare fixed, tracker and variable rates', 'Contrast typical UK and US mortgage products'],
    tags: ['pr-mortgage-types'],
    difficulty: 2,
  },
  [
    key('Repayment versus interest-only', 'With a **repayment** (US: **amortising**) mortgage, each payment covers interest plus some of the loan, so the debt reaches zero by the end of the term.\n\nWith **interest-only**, you pay just the interest. The full loan is still owed at the end and must be repaid another way — for example from savings or selling the property.'),
    num('q1', 'An interest-only mortgage of £150,000 charges 4% a year. What is the monthly payment?', 500, '£150,000 × 4% = £6,000 a year ÷ 12 = £500 a month. The £150,000 is still owed at the end.', { prefix: '£', tolerance: 0.01 }),
    ukus(
      'Fixed and variable rates',
      '- **UK**: deals are commonly **fixed for 2 or 5 years**, then revert to the lender’s **standard variable rate (SVR)** unless you remortgage. A **tracker** follows the Bank of England’s **Bank Rate** plus a set margin. Leaving a deal early often triggers an **early repayment charge**.\n- **US**: the **30-year fixed-rate** mortgage is the most common product, fixing the payment for the whole term. **Adjustable-rate mortgages (ARMs)** fix for a few years, then adjust periodically.',
    ),
    num('q2', 'A UK tracker is set at Bank Rate + 0.75%. If Bank Rate is 4%, what is the mortgage rate?', 4.75, '4% + 0.75% = 4.75%. If Bank Rate moves, the mortgage rate moves with it.', { suffix: '%', tolerance: 0.001 }),
    match('q3', 'Match each mortgage feature with its description.', [['Fixed rate', 'Payment stays the same for the deal period'], ['Tracker', 'Rate follows Bank Rate plus a margin'], ['Interest-only', 'The loan is still owed at the end of the term'], ['Repayment', 'The loan is cleared by the end of the term']], 'Fixed = certainty; tracker = follows Bank Rate; interest-only leaves the debt; repayment clears it.'),
    warn('Certainty has a price', 'A fixed rate protects you if rates rise but means you won’t benefit if they fall, and early repayment charges can apply. A variable rate can fall or rise. Neither is right for everyone.'),
    mcq('q4', 'Which is the most common mortgage product in the US?', ['A 2-year fixed rate', 'A 30-year fixed rate', 'An interest-only tracker', 'A 5-year standard variable rate'], 1, 'The 30-year fixed-rate mortgage dominates the US market; UK fixes are usually much shorter.', { final: true }),
    recap('Repayment clears the debt; interest-only leaves it outstanding.', 'UK: short fixes, trackers and SVRs. US: 30-year fixed is common.', 'Fixed buys certainty; variable shares rate moves with you.'),
  ],
)

const amortisation = lesson(
  {
    title: 'How mortgage payments work',
    description: 'Amortisation, and why early payments are mostly interest.',
    objectives: ['Explain amortisation', 'Calculate first-month interest', 'Describe how the interest share falls over time'],
    tags: ['pr-amortisation'],
    difficulty: 3,
  },
  [
    text(
      'Same payment, changing mix',
      'On a repayment mortgage the monthly payment usually stays the same (at a fixed rate), but its **mix** changes. Interest is charged on the outstanding balance. Early on the balance is large, so most of the payment is **interest**. As the balance falls, more goes to **capital**. This schedule is called **amortisation**.',
    ),
    key('First-month interest', '**Monthly interest ≈ balance × annual rate ÷ 12.**\n\n£200,000 at 5% over 25 years costs about **£1,169 a month**. In month one, interest is £200,000 × 5% ÷ 12 ≈ **£833**, so only about **£336** reduces the loan.'),
    diagram({ type: 'bars', unit: '£', bars: [{ label: 'Month 1', value: 1169, segments: [{ value: 833, tone: 'coral', label: 'Interest' }, { value: 336, tone: 'mint', label: 'Capital' }] }] }, 'Illustrative: £200,000 at 5% over 25 years. About 71% of the first payment is interest.'),
    num('q1', 'A $300,000 mortgage has a 6% annual rate. Roughly how much interest is charged in the first month?', 1500, '$300,000 × 6% ÷ 12 = $1,500.', { prefix: '$', tolerance: 0.5 }),
    numbers('£200,000 at 5% over 25 years', [['Monthly payment', '≈ £1,169'], ['Paid in the first 5 years', '≈ £70,150'], ['…of which interest', '≈ £47,310'], ['Total paid over 25 years', '≈ £350,750'], ['Total interest over 25 years', '≈ £150,750']], 'Illustrative, assuming the rate stays at 5% for the whole term.'),
    mcq('q2', 'In the example, roughly what share of the first five years’ payments is interest?', ['About 15%', 'About 33%', 'About 67%', 'About 95%'], 2, '£47,310 ÷ £70,150 ≈ 67%. Interest dominates the early years.'),
    order('q3', 'Order these stages of a fixed-rate repayment mortgage from the highest interest share of each payment to the lowest.', ['Year 1', 'Year 10', 'Year 20', 'Final year'], 'The balance falls over time, so the interest share of each payment falls too.'),
    tf('q4', 'Overpaying early in a repayment mortgage (where allowed) reduces the total interest paid, because interest is charged on a smaller balance.', true, 'True. Many deals allow limited overpayments — UK fixes often allow around 10% a year — but check for early repayment charges.', { final: true }),
    recap('Interest ≈ balance × rate ÷ 12, charged each month.', 'Early payments are mostly interest; later ones mostly capital.', 'Over a long term, total interest can be a large fraction of the loan.'),
  ],
)

const leverageEquity = lesson(
  {
    title: 'Equity, leverage and negative equity',
    description: 'How borrowing magnifies gains — and losses.',
    objectives: ['Calculate home equity', 'Show how leverage magnifies returns on a deposit', 'Explain negative equity and its risks'],
    tags: ['pr-leverage-equity'],
    difficulty: 3,
  },
  [
    key('Equity', '**Equity = property value − outstanding mortgage.** It is the part of the home you actually own. It grows as you repay the loan and as prices rise — and shrinks if prices fall.'),
    num('q1', 'A home is worth £320,000 and the mortgage balance is £240,000. What is the owner’s equity?', 80000, '£320,000 − £240,000 = £80,000.', { prefix: '£', tolerance: 0.5 }),
    example(
      'Leverage in both directions (hypothetical)',
      'You buy a £250,000 home with a **£25,000 deposit** (90% LTV, £225,000 loan). Ignoring costs and repayments:\n\n- Price **rises 10%** to £275,000: equity = £50,000. Your £25,000 became £50,000 — a **+100%** return on your deposit.\n- Price **falls 10%** to £225,000: equity = £0. Your deposit is **wiped out (−100%)**.',
    ),
    diagram({ type: 'bars', unit: '%', bars: [{ label: 'Price change', value: 10, tone: 'sky' }, { label: 'Return on deposit (10% down)', value: 100, tone: 'sun' }] }, 'With 10% down, a 10% price move becomes roughly a 100% move in equity — up or down.'),
    num('q2', 'A buyer puts down 20% on a £200,000 home. The price rises 5%. Ignoring costs and repayments, what is the percentage return on the deposit?', 25, 'Deposit £40,000. Gain £10,000. £10,000 ÷ £40,000 = 25%.', { suffix: '%', tolerance: 0.01 }),
    key('Negative equity', '**Negative equity** means the mortgage is larger than the home’s value. Selling would not repay the loan, so moving or remortgaging becomes hard. It is most likely with high LTVs bought near a price peak.'),
    num('q3', 'Using the £250,000 example, the price falls 15% instead. How much negative equity does the owner have (as a positive number)?', 12500, 'New value: £250,000 × 0.85 = £212,500. Loan £225,000 − £212,500 = £12,500 of negative equity.', { prefix: '£', tolerance: 0.5 }),
    tf('q4', 'Leverage only magnifies gains, never losses.', false, 'False. Borrowing magnifies both. The smaller your deposit, the bigger the swing in your equity for a given price change.', { final: true }),
    recap('Equity = value − mortgage.', 'Leverage magnifies returns on your deposit in both directions.', 'Negative equity: you owe more than the home is worth.'),
  ],
)

const buyToLet = lesson(
  {
    title: 'Buy-to-let: yields and cash flow',
    description: 'Gross yield, net yield, voids and the costs of being a landlord.',
    objectives: ['Calculate gross and net rental yields', 'Account for voids and running costs', 'Estimate cash flow after mortgage interest'],
    tags: ['pr-buy-to-let'],
    difficulty: 2,
  },
  [
    key('Rental yield', '**Gross yield = annual rent ÷ property price.**\n**Net yield = (annual rent − running costs) ÷ property price.**\n\nA £200,000 flat let at £1,000 a month earns £12,000 a year: a **6% gross yield**.'),
    num('q1', 'A property costs £160,000 and rents for £800 a month. What is the gross rental yield?', 6, '£800 × 12 = £9,600. £9,600 ÷ £160,000 = 6%.', { suffix: '%', tolerance: 0.01 }),
    text(
      'The costs gross yield ignores',
      'Landlords face **voids** (empty periods with no rent), letting or management fees, maintenance and repairs, insurance, safety certificates and service charges. These can take a big bite out of the headline yield.',
    ),
    numbers('From gross to net (hypothetical £200,000 flat)', [['Annual rent', '£12,000'], ['Void (one month empty)', '− £1,000'], ['Management, repairs, insurance', '− £2,000'], ['Net income before finance and tax', '£9,000'], ['Net yield', '£9,000 ÷ £200,000 = 4.5%']], 'Illustrative only. Real costs vary widely.'),
    num('q2', 'Using the table, the flat has a £150,000 interest-only mortgage at 5%. What is the annual cash flow before tax?', 1500, 'Interest: £150,000 × 5% = £7,500. £9,000 − £7,500 = £1,500.', { prefix: '£', tolerance: 0.5 }),
    ukus('Tax and rules differ', 'Rental profits are taxable in both countries, and rules differ. In the UK, individual landlords can’t deduct mortgage interest in full as an expense; instead they get a basic-rate tax credit for it. Licensing, deposit protection and tenant rules also vary by country, state and council.'),
    multi('q3', 'Which would reduce a landlord’s net yield? Select all that apply.', ['A three-month void', 'A new boiler', 'Higher letting agent fees', 'A rent increase with no extra costs'], [0, 1, 2], 'Voids and costs reduce net income. A rent increase with no extra costs raises it.'),
    tf('q4', 'A 6% gross yield means the landlord earns a 6% return after all costs.', false, 'False. Gross yield ignores voids, running costs, finance costs and tax. Net returns are usually noticeably lower.', { final: true }),
    recap('Gross yield = annual rent ÷ price.', 'Net yield subtracts voids and running costs.', 'Cash flow after mortgage interest and tax can be thin — or negative.'),
  ],
)

const reitsFunds = lesson(
  {
    title: 'REITs and property funds',
    description: 'Owning property through the stock market — and the liquidity trap of open-ended funds.',
    objectives: ['Explain what a REIT is and its distribution rules', 'Compare REITs with direct property', 'Describe why open-ended property funds can suspend dealing'],
    tags: ['pr-reits-funds'],
    difficulty: 2,
  },
  [
    key('Real estate investment trusts', 'A **REIT** is a listed company that owns (and often runs) income-producing property — offices, warehouses, flats, shops. You buy its shares on a stock exchange, so you can invest small amounts and sell on any trading day.'),
    ukus('Distribution rules', '- **US**: to qualify, a REIT must distribute at least **90% of its taxable income** to shareholders each year.\n- **UK**: a REIT must distribute at least **90% of the profits of its property rental business**.\n\nIn return, REITs largely avoid corporation tax at the company level on qualifying property income; shareholders are taxed on what they receive.'),
    num('q1', 'A US REIT has taxable income of $50m. What is the minimum it must distribute to keep REIT status?', 45, '90% × $50m = $45m.', { prefix: '$', suffix: 'm', tolerance: 0.01 }),
    diagram(
      {
        type: 'compare',
        columns: [
          { title: 'Buying a property', tone: 'sun', points: ['Large sum needed', 'One building, one location', 'Slow and costly to sell', 'You manage it (or pay someone)'] },
          { title: 'Buying a REIT', tone: 'violet', points: ['Small amounts possible', 'Many properties', 'Sell on any trading day', 'Professional management'] },
        ],
      },
    ),
    warn('Listed means volatile', 'REIT share prices move every day and can fall sharply in market sell-offs, sometimes trading well below the value of their buildings (a **discount to net asset value**). Daily liquidity comes with stock-market volatility.'),
    key('Open-ended property funds and gating', 'An **open-ended property fund** promises to let investors withdraw cash but holds buildings that take months to sell. When many investors rush to leave, the fund may **suspend dealing** (“gate”). Several UK property funds did this after the 2016 EU referendum and again in 2020.'),
    mcq('q2', 'Why can open-ended property funds be forced to suspend withdrawals?', ['REIT rules forbid withdrawals', 'They hold illiquid buildings but offer frequent dealing', 'Rental income stops entirely', 'Property funds are not regulated'], 1, 'There is a mismatch: investors expect quick access, but buildings can’t be sold quickly at a fair price.'),
    match('q3', 'Match each vehicle with its feature.', [['REIT', 'Shares traded on a stock exchange'], ['Open-ended property fund', 'May gate withdrawals in a rush to exit'], ['Direct buy-to-let', 'You own and manage a single building']], 'REITs trade on exchanges; open-ended funds can gate; direct ownership is concentrated and hands-on.'),
    tf('q4', 'Because REITs trade daily, their prices are always stable and close to the value of their property.', false, 'False. Daily trading brings volatility, and REITs can trade at significant discounts or premiums to asset value.', { final: true }),
    recap('REITs: listed property companies; US and UK both require 90% distribution (of taxable income / property rental profits).', 'REITs are liquid but volatile.', 'Open-ended property funds can gate when investors rush to leave.'),
  ],
)

const cyclesDiversification = lesson(
  {
    title: 'Cycles, interest rates and diversification',
    description: 'Why house prices move, and why your home is a concentrated bet.',
    objectives: ['Describe housing market cycles', 'Explain how interest rates affect property', 'Assess how concentrated a household’s wealth is in its home'],
    tags: ['pr-cycles-diversification'],
    difficulty: 2,
  },
  [
    text(
      'Prices go down as well as up',
      'Housing markets move in **cycles**: credit eases, prices rise, buyers stretch, then something — higher rates, a recession, tighter lending — cools demand. In the 2007–09 crisis, national US house prices fell by roughly a quarter from peak to trough, and UK prices also fell sharply. Recoveries can take years.',
    ),
    diagram({ type: 'flow', nodes: [{ label: 'Rates rise', tone: 'coral' }, { label: 'Mortgages cost more', sub: 'Buyers can borrow less' }, { label: 'Demand cools', sub: 'Fewer sales' }, { label: 'Price pressure', sub: 'Prices may stall or fall', tone: 'sun' }] }, 'A simplified chain. Supply, jobs and confidence matter too.'),
    key('Interest rate sensitivity', 'Most property is bought with debt, so **interest rates** matter a lot. Higher rates raise mortgage payments for new buyers and those coming off fixes. They also raise the return investors can get on safer assets, which can weigh on property and REIT valuations.'),
    mcq('q1', 'Which change would most directly increase monthly payments for a UK borrower on a tracker mortgage?', ['A fall in Bank Rate', 'A rise in Bank Rate', 'A rise in rents', 'A fall in house prices'], 1, 'Trackers follow Bank Rate, so a rise feeds straight into payments.'),
    key('A concentrated, illiquid asset', 'For many households the home is their **largest single asset**: one building, in one place, often bought with debt. It can’t be sold in pieces, and selling takes months. That is the opposite of diversification.'),
    diagram({ type: 'donut', centre: 'Net worth', slices: [{ label: 'Home equity', value: 80, tone: 'sun' }, { label: 'Pension and investments', value: 15, tone: 'violet' }, { label: 'Cash', value: 5, tone: 'mint' }] }, 'A hypothetical household with most of its wealth in one property.'),
    num('q2', 'A household has £120,000 of home equity and total net worth of £150,000. What percentage of its net worth is home equity?', 80, '£120,000 ÷ £150,000 = 80%.', { suffix: '%', tolerance: 0.01 }),
    multi('q3', 'Which are reasons a home is a concentrated, illiquid investment? Select all that apply.', ['It is one property in one location', 'It can take months to sell', 'It can’t easily be sold in small pieces', 'It is automatically spread across many sectors'], [0, 1, 2], 'A single home is the opposite of a diversified portfolio.'),
    tf('q4', 'Someone whose wealth is mostly in their home might reasonably consider that when deciding where else to invest.', true, 'True. Recognising existing concentration — and that it may be tied to the local economy where you work — is part of thinking about diversification. This is education, not personal advice.', { final: true }),
    recap('Housing moves in cycles; prices can fall for years.', 'Interest rates strongly affect affordability and values.', 'A home is concentrated and illiquid — factor that into your overall picture.'),
  ],
)

export const c11 = course({
  id: 'c11',
  slug: 'property-and-real-estate',
  title: 'Property and Real Estate',
  tagline: 'Bricks, mortgages and REITs explained.',
  description: 'Understand renting versus buying, deposits and loan-to-value, how mortgages work, how leverage magnifies gains and losses, and how buy-to-let, REITs and property funds compare — with UK and US examples.',
  colour: 'sun',
  icon: 'house',
  outcomes: [
    'Compare the total costs of renting and buying, including opportunity cost',
    'Calculate LTV, mortgage interest, equity and the effect of leverage',
    'Calculate gross and net rental yields and explain buy-to-let cash flow',
    'Explain REITs, property fund liquidity, housing cycles and diversification',
  ],
  units: [
    {
      title: 'Renting, buying and deposits',
      description: 'Total costs, LTV, buying costs and affordability.',
      lessons: [rentVsBuy, depositsLtv, costsAffordability],
      checkpoint: {
        concept: 'pr-deposits-ltv',
        questions: [
          numQ('c1', 'Home £400,000, deposit £60,000. LTV?', 85, '£340,000 ÷ £400,000 = 85%.', { suffix: '%', tolerance: 0.01, concept: 'pr-deposits-ltv' }),
          numQ('c2', 'A £30,000 deposit could earn 4% a year elsewhere. Annual opportunity cost?', 1200, '£30,000 × 4% = £1,200.', { prefix: '£', tolerance: 0.5, concept: 'pr-rent-vs-buy' }),
          mcqQ('c3', 'Stamp Duty Land Tax applies to property purchases in…', ['the whole US', 'England and Northern Ireland', 'every EU country', 'Scotland only'], 1, 'Scotland and Wales have their own taxes (LBTT and LTT).', { concept: 'pr-buying-costs' }),
          tfQ('c4', 'In the US, putting down less than 20% on a conventional loan usually means paying private mortgage insurance.', true, 'PMI protects the lender and usually applies below 20% down.', { concept: 'pr-deposits-ltv' }),
          multiQ('c5', 'Which are one-off costs of buying a home? Select all that apply.', ['UK Stamp Duty Land Tax', 'US closing costs', 'Conveyancing fees', 'Monthly rent'], [0, 1, 2], 'Monthly rent is an ongoing cost of renting, not a buying cost.', { concept: 'pr-buying-costs' }),
          mcqQ('c6', 'Why do lenders stress test borrowers?', ['To set the house price', 'To check payments stay affordable if rates rise', 'To calculate stamp duty', 'To decide the rent'], 1, 'Stress tests check resilience to higher rates.', { concept: 'pr-buying-costs' }),
        ],
      },
    },
    {
      title: 'Mortgages and leverage',
      description: 'Mortgage types, amortisation, equity and negative equity.',
      lessons: [mortgageTypes, amortisation, leverageEquity],
      checkpoint: {
        concept: 'pr-mortgage-types',
        questions: [
          matchQ('c1', 'Match each term with its meaning.', [['Interest-only', 'Pay just the interest; loan owed at the end'], ['Tracker', 'Rate follows Bank Rate plus a margin'], ['SVR', 'Lender’s standard variable rate after a deal ends']], 'Interest-only leaves the debt; trackers follow Bank Rate; the SVR is the default variable rate.', { concept: 'pr-mortgage-types' }),
          numQ('c2', 'First-month interest on £240,000 at 4.5% a year?', 900, '£240,000 × 4.5% ÷ 12 = £900.', { prefix: '£', tolerance: 0.5, concept: 'pr-amortisation' }),
          tfQ('c3', 'In the early years of a repayment mortgage, most of each payment is usually interest.', true, 'The balance is largest at the start, so interest dominates.', { concept: 'pr-amortisation' }),
          numQ('c4', 'Home worth $350,000, mortgage $280,000. Equity?', 70000, '$350,000 − $280,000 = $70,000.', { prefix: '$', tolerance: 0.5, concept: 'pr-leverage-equity' }),
          numQ('c5', '10% deposit on £300,000. Price rises 5%. Return on deposit, ignoring costs?', 50, 'Deposit £30,000; gain £15,000; £15,000 ÷ £30,000 = 50%.', { suffix: '%', tolerance: 0.01, concept: 'pr-leverage-equity' }),
          mcqQ('c6', 'Negative equity means…', ['the home is worth more than the loan', 'the loan is larger than the home’s value', 'you have no mortgage', 'interest rates are negative'], 1, 'You owe more than the home is worth.', { concept: 'pr-leverage-equity' }),
        ],
      },
    },
    {
      title: 'Investing in property',
      description: 'Buy-to-let, REITs, property funds and cycles.',
      lessons: [buyToLet, reitsFunds, cyclesDiversification],
      checkpoint: {
        concept: 'pr-buy-to-let',
        questions: [
          numQ('c1', 'Price $250,000, rent $1,500 a month. Gross yield?', 7.2, '$18,000 ÷ $250,000 = 7.2%.', { suffix: '%', tolerance: 0.01, concept: 'pr-buy-to-let' }),
          numQ('c2', 'Price £180,000, rent £10,800 a year, costs £2,700 a year. Net yield?', 4.5, '(£10,800 − £2,700) ÷ £180,000 = £8,100 ÷ £180,000 = 4.5%.', { suffix: '%', tolerance: 0.01, concept: 'pr-buy-to-let' }),
          mcqQ('c3', 'A UK REIT must distribute at least…', ['50% of total revenue', '90% of the profits of its property rental business', '100% of its share price', 'nothing at all'], 1, 'The UK rule is 90% of property rental business profits.', { concept: 'pr-reits-funds' }),
          tfQ('c4', 'Open-ended property funds can suspend withdrawals when many investors try to leave at once.', true, 'Buildings can’t be sold quickly, so funds may gate.', { concept: 'pr-reits-funds' }),
          orderQ('c5', 'Put this simplified chain in order.', ['Interest rates rise', 'Mortgage payments rise', 'Buyer demand cools', 'Prices come under pressure'], 'Higher rates → costlier borrowing → weaker demand → price pressure.', { concept: 'pr-cycles-diversification' }),
          tfQ('c6', 'A single home is a well-diversified investment.', false, 'It is concentrated in one asset and location, and illiquid.', { concept: 'pr-cycles-diversification' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'pr-leverage-equity',
    questions: [
      multiQ('e1', 'Which belong in a fair rent-versus-buy comparison? Select all that apply.', ['Maintenance', 'Opportunity cost of the deposit', 'Buying and selling costs', 'The colour of the front door'], [0, 1, 2], 'Total costs, including ones you don’t get back.', { concept: 'pr-rent-vs-buy' }),
      numQ('e2', 'Home £500,000, mortgage £375,000. LTV?', 75, '£375,000 ÷ £500,000 = 75%.', { suffix: '%', tolerance: 0.01, concept: 'pr-deposits-ltv' }),
      numQ('e3', 'Deposit needed for a 90% LTV mortgage on a £220,000 home?', 22000, '10% × £220,000 = £22,000.', { prefix: '£', tolerance: 0.5, concept: 'pr-deposits-ltv' }),
      mcqQ('e4', 'US closing costs are often quoted at roughly…', ['0.1% of the price', '2–5% of the price', '20–25% of the price', 'exactly $1,000'], 1, 'Often around 2–5%, varying by state and loan.', { concept: 'pr-buying-costs' }),
      tfQ('e5', 'Stamp duty thresholds never change, so an old guide is always reliable.', false, 'Bands and reliefs change; check gov.uk for current rules.', { concept: 'pr-buying-costs' }),
      numQ('e6', 'Interest-only mortgage of $240,000 at 5%. Monthly payment?', 1000, '$240,000 × 5% ÷ 12 = $1,000.', { prefix: '$', tolerance: 0.5, concept: 'pr-mortgage-types' }),
      mcqQ('e7', 'At the end of an interest-only mortgage term, the borrower…', ['owes nothing', 'still owes the full original loan', 'owes only the final month’s interest', 'automatically owns a second home'], 1, 'Interest-only payments don’t reduce the loan.', { concept: 'pr-mortgage-types' }),
      orderQ('e8', 'Order these from the largest outstanding balance to the smallest on a 25-year repayment mortgage.', ['Start of year 1', 'Start of year 10', 'Start of year 20', 'End of year 25'], 'The balance falls over the term and reaches zero at the end.', { concept: 'pr-amortisation' }),
      numQ('e9', 'First-month interest on £180,000 at 6%?', 900, '£180,000 × 6% ÷ 12 = £900.', { prefix: '£', tolerance: 0.5, concept: 'pr-amortisation' }),
      numQ('e10', '5% deposit on a £200,000 home. Price falls 10%. Negative equity, ignoring repayments (positive number)?', 10000, 'Loan £190,000; value £180,000; shortfall £10,000.', { prefix: '£', tolerance: 0.5, concept: 'pr-leverage-equity' }),
      numQ('e11', '25% deposit on a £400,000 home. Price rises 8%. Return on deposit, ignoring costs?', 32, 'Deposit £100,000; gain £32,000; £32,000 ÷ £100,000 = 32%.', { suffix: '%', tolerance: 0.01, concept: 'pr-leverage-equity' }),
      numQ('e12', 'Price £300,000, rent £1,250 a month. Gross yield?', 5, '£15,000 ÷ £300,000 = 5%.', { suffix: '%', tolerance: 0.01, concept: 'pr-buy-to-let' }),
      matchQ('e13', 'Match each term with its meaning.', [['Void', 'Period with no tenant or rent'], ['Gross yield', 'Annual rent ÷ price'], ['Net yield', 'Rent minus running costs, ÷ price']], 'Voids cut income; gross ignores costs; net includes them.', { concept: 'pr-buy-to-let' }),
      mcqQ('e14', 'A US REIT must generally distribute at least what share of its taxable income?', ['25%', '50%', '75%', '90%'], 3, 'At least 90% of taxable income.', { concept: 'pr-reits-funds' }),
      tfQ('e15', 'Higher interest rates tend to make property less affordable for new buyers.', true, 'Higher rates raise mortgage costs and can weigh on prices.', { concept: 'pr-cycles-diversification' }),
    ],
  },
})
