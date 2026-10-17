import { analogy, course, diagram, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, order, recap, text, tf, tfQ, ukus, warn } from '../builders'

const whatAreBonds = lesson(
  {
    title: 'What is a bond?',
    description: 'Lending money in exchange for interest and repayment.',
    objectives: ['Define a bond and its key terms', 'Calculate coupon payments', 'Name common bond issuers'],
    tags: ['bonds-basics'],
  },
  [
    text(
      'An IOU you can trade',
      'A **bond** is a loan. You lend money to an **issuer** — a government or company — which promises to pay you interest and to repay the loan on a set date.\n\n- **Face value** (or par): the amount repaid at the end, often £100 or $1,000.\n- **Coupon**: the interest paid, as a percentage of face value.\n- **Maturity**: the date the face value is repaid.',
    ),
    num('q1', 'A bond has a face value of $1,000 and a 4.5% annual coupon, paid in two equal halves. How much is each payment?', 22.5, 'Annual coupon = $1,000 × 4.5% = $45, paid as two payments of $22.50.', { prefix: '$', tolerance: 0.01 }),
    ukus('Government bonds', 'UK government bonds are called **gilts**, issued by the UK Debt Management Office. US government debt is issued by the Treasury as **bills** (up to a year), **notes** (2–10 years) and **bonds** (20–30 years). Both countries also issue inflation-linked versions: **index-linked gilts** and **TIPS**.'),
    match('q2', 'Match each term with its meaning.', [['Coupon', 'Regular interest payment'], ['Face value', 'Amount repaid at maturity'], ['Maturity', 'Date the loan is repaid'], ['Issuer', 'Borrower that created the bond']], 'These four terms describe almost any plain bond.'),
    tf('q3', 'Bondholders own part of the issuing company.', false, 'False. Bondholders are lenders (creditors), not owners. They have a contractual claim to interest and repayment, but no ownership stake.', { final: true }),
    recap('A bond is a tradeable loan to a government or company.', 'Key terms: issuer, face value, coupon, maturity.', 'Gilts (UK) and Treasuries (US) are government bonds.'),
  ],
)

const yieldsPrices = lesson(
  {
    title: 'Bond prices and yields',
    description: 'Why bond prices fall when yields rise.',
    objectives: ['Explain the inverse price–yield relationship', 'Calculate current yield', 'Describe yield to maturity'],
    tags: ['bond-yields'],
    difficulty: 2,
  },
  [
    text(
      'The see-saw',
      'Once issued, bonds trade in the market and their prices change. A bond’s coupon is fixed, so if new bonds offer higher interest, existing lower-coupon bonds become less attractive — their price falls until their effective return matches the market.\n\n**When yields rise, prices fall. When yields fall, prices rise.**',
    ),
    analogy('The see-saw', 'Picture a see-saw with price on one end and yield on the other. Push one up and the other goes down.'),
    key('Two yields', '**Current yield** = annual coupon ÷ price. A £5 coupon on a bond priced at £95 is a current yield of about 5.26%.\n\n**Yield to maturity (YTM)** is the total annual return if you buy at today’s price and hold to maturity, including the gain or loss as the price moves back to face value. It is the standard measure quoted for bonds.'),
    num('q1', 'A bond pays a £4 annual coupon and trades at £80. What is its current yield?', 5, '£4 ÷ £80 = 5%.', { suffix: '%', tolerance: 0.01 }),
    mcq('q2', 'Market interest rates rise sharply. What happens to the price of an existing fixed-coupon bond?', ['It rises', 'It falls', 'It stays at face value', 'It doubles'], 1, 'Its fixed coupon is now less attractive than new bonds, so its price falls to offer a competitive yield.'),
    example('Buying below par', 'A 2-year bond with £100 face value and a 3% coupon trades at about £96.28 when market yields are 5%. If you hold to maturity you get £3 a year plus a £3.72 gain at repayment — a total yield of about 5% a year.'),
    tf('q3', 'If you hold a high-quality bond to maturity and the issuer pays in full, price swings in between do not change the cash you receive.', true, 'True. You still get the coupons and the face value. Price swings matter if you sell early — and inflation can still erode the real value.', { final: true }),
    recap('Bond prices and yields move in opposite directions.', 'Current yield = coupon ÷ price; YTM includes the pull to face value.', 'Holding to maturity locks in the promised cash flows if the issuer pays.'),
  ],
)

const duration = lesson(
  {
    title: 'Duration and interest-rate risk',
    description: 'How sensitive a bond is to changes in rates.',
    objectives: ['Define duration', 'Estimate a price change from duration', 'Explain why long bonds are riskier when rates move'],
    tags: ['duration'],
    difficulty: 3,
  },
  [
    text(
      'Measuring sensitivity',
      '**Duration** (in years) measures how sensitive a bond’s price is to changes in interest rates. Longer maturities and lower coupons mean higher duration.\n\nA useful rule of thumb: **price change ≈ −duration × change in yield**.',
    ),
    num('q1', 'A bond fund has a duration of 7 years. Yields rise by 1 percentage point. Approximately how much does its price change?', -7, '−7 × 1% ≈ −7%.', { suffix: '%', tolerance: 0.05 }),
    mcq('q2', 'Which bond’s price is most sensitive to interest-rate changes?', ['A 1-year Treasury bill', 'A 5-year gilt with a 6% coupon', 'A 30-year bond with a 1% coupon', 'A savings account'], 2, 'Long maturity and low coupon give the highest duration.'),
    warn('2022: a reminder', 'When interest rates rose quickly in 2022, long-dated government bonds — often considered “safe” — suffered large price falls. Safety from default is not the same as safety from price swings.'),
    num('q3', 'A bond has a duration of 4. Yields fall by 0.5 percentage points. Approximately what is the price change?', 2, '−4 × (−0.5%) = +2%.', { suffix: '%', tolerance: 0.05 }),
    tf('q4', 'Short-dated bonds have more interest-rate risk than long-dated bonds.', false, 'False. Long-dated bonds have higher duration and therefore more interest-rate risk.', { final: true }),
    recap('Duration measures interest-rate sensitivity.', 'Price change ≈ −duration × change in yield.', 'Long, low-coupon bonds are most sensitive.'),
  ],
)

const creditRisk = lesson(
  {
    title: 'Credit risk: government and corporate bonds',
    description: 'Will the borrower pay you back?',
    objectives: ['Define credit risk and default', 'Interpret credit ratings', 'Explain credit spreads'],
    tags: ['credit-risk'],
    difficulty: 2,
  },
  [
    text(
      'Will they pay?',
      '**Credit risk** is the risk that the issuer fails to pay interest or repay the face value — a **default**. Governments that borrow in their own currency, like the UK and US, are generally considered very low credit risk. Companies vary enormously.',
    ),
    key('Credit ratings', 'Agencies such as S&P, Moody’s and Fitch rate bonds. Ratings of **BBB−** (S&P/Fitch) or **Baa3** (Moody’s) and above are **investment grade**. Below that are **high-yield** (or “junk”) bonds, which pay more because default risk is higher. Ratings are opinions and can be wrong or change.'),
    order('q1', 'Order these S&P-style ratings from highest to lowest credit quality.', ['AAA', 'AA', 'A', 'BBB', 'BB'], 'AAA is the highest; BB is the first high-yield (below investment grade) rating band in this list.'),
    key('Credit spread', 'The **credit spread** is the extra yield a corporate bond pays over a government bond of similar maturity. It compensates for default risk and lower liquidity, and tends to widen when the economy weakens.'),
    num('q2', 'A 5-year corporate bond yields 6.1% and a 5-year government bond yields 4.3%. What is the credit spread in percentage points?', 1.8, '6.1% − 4.3% = 1.8 percentage points.', { suffix: 'pp', tolerance: 0.01 }),
    mcq('q3', 'Why would an investor accept a lower yield on a gilt than on a bond from a struggling retailer?', ['Gilts have higher coupons', 'The UK government is far less likely to default', 'Retail bonds cannot be sold', 'Gilts are not affected by interest rates'], 1, 'Lower credit risk means investors require less compensation.', { final: true }),
    recap('Credit risk is the risk of default.', 'Investment grade is BBB−/Baa3 and above; below is high-yield.', 'Credit spreads compensate for default risk and widen in downturns.'),
  ],
)

const gdp = lesson(
  {
    title: 'GDP, growth and recessions',
    description: 'Measuring the size and health of an economy.',
    objectives: ['Define GDP', 'Explain economic growth and recessions', 'Compare how the UK and US identify recessions'],
    tags: ['gdp'],
    sources: [
      { label: 'ONS — GDP and the common “two consecutive quarters” recession definition', url: 'https://www.ons.gov.uk/economy/grossdomesticproductgdp' },
      { label: 'NBER — US Business Cycle Dating Committee', url: 'https://www.nber.org/research/business-cycle-dating' },
    ],
  },
  [
    text(
      'The economy’s scoreboard',
      '**Gross domestic product (GDP)** measures the value of all final goods and services produced in an economy over a period. **Economic growth** is the percentage change in GDP, usually adjusted for inflation (“real” GDP).\n\nGDP can be viewed as spending: consumption + investment + government spending + (exports − imports).',
    ),
    num('q1', 'Real GDP rises from £2,500bn to £2,550bn. What is the growth rate?', 2, '£50bn ÷ £2,500bn = 2%.', { suffix: '%', tolerance: 0.01 }),
    ukus('What counts as a recession?', 'In the UK, a recession is commonly described as **two consecutive quarters of falling real GDP** — a convention used by the ONS and the media. In the US, the **NBER** Business Cycle Dating Committee declares recessions based on a broad range of indicators, including employment and income, not a fixed GDP rule.'),
    mcq('q2', 'Which is NOT a component of GDP measured by spending?', ['Household consumption', 'Business investment', 'Government spending', 'Changes in share prices'], 3, 'Share price changes are not production or spending on goods and services, so they are not part of GDP.'),
    tf('q3', 'A strong economy always means a strong stock market in the same year.', false, 'False. Markets look ahead and respond to expectations, interest rates and valuations; the link between yearly GDP growth and stock returns is loose.', { final: true }),
    recap('GDP measures an economy’s output; growth is its percentage change.', 'UK convention: two quarters of falling GDP; US: NBER judgement.', 'Stock markets and the economy are related but not in lockstep.'),
  ],
)

const inflationUnemployment = lesson(
  {
    title: 'Inflation and unemployment',
    description: 'Two numbers central banks watch closely.',
    objectives: ['Explain causes of inflation', 'Define the unemployment rate', 'Describe the tension central banks face'],
    tags: ['inflation-unemployment'],
    difficulty: 2,
  },
  [
    text(
      'Why prices rise',
      'Inflation can be driven by **demand** (too much spending chasing too few goods), **costs** (rising energy or wages pushing prices up) and **expectations** (if people expect inflation, they ask for higher wages and prices, which can make it self-fulfilling).',
    ),
    match('q1', 'Match each scenario with its main type of inflation pressure.', [['Energy prices surge after a supply shock', 'Cost-push'], ['Booming spending outstrips supply', 'Demand-pull'], ['Workers seek higher pay because they expect prices to keep rising', 'Expectations']], 'Real-world inflation usually mixes all three.'),
    key('Unemployment', 'The **unemployment rate** is the share of people in the labour force (working or actively looking for work) who are unemployed. Very low unemployment can push up wages and inflation; high unemployment signals weak demand and hardship.'),
    num('q2', 'A labour force of 34 million includes 1.36 million unemployed people. What is the unemployment rate?', 4, '1.36m ÷ 34m = 4%.', { suffix: '%', tolerance: 0.01 }),
    mcq('q3', 'Why might a central bank worry when unemployment is very low and inflation is rising?', ['Low unemployment always causes deflation', 'A tight labour market can push wages and prices higher', 'It means the economy is in recession', 'It has no implications'], 1, 'Strong demand for workers can lift wages faster than productivity, adding to inflation — though the relationship is not mechanical.', { final: true }),
    recap('Inflation has demand, cost and expectation drivers.', 'Unemployment rate = unemployed ÷ labour force.', 'Central banks balance inflation against jobs and growth.'),
  ],
)

const centralBanks = lesson(
  {
    title: 'Central banks: the Bank of England and the Fed',
    description: 'Who sets interest rates, and why.',
    objectives: ['Describe the roles of the Bank of England and Federal Reserve', 'Compare their mandates', 'Explain how rate changes affect the economy'],
    tags: ['central-banks'],
    difficulty: 2,
    sources: [
      { label: 'Bank of England — Monetary Policy Committee and 2% inflation target', url: 'https://www.bankofengland.co.uk/monetary-policy' },
      { label: 'Federal Reserve — FOMC and statutory mandate', url: 'https://www.federalreserve.gov/monetarypolicy.htm' },
    ],
  },
  [
    ukus(
      'Two central banks',
      '**Bank of England (UK):** its **Monetary Policy Committee** (9 members) sets **Bank Rate**. The government sets the inflation target — currently **2% CPI** — and the MPC decides how to meet it.\n\n**Federal Reserve (US):** the **Federal Open Market Committee (FOMC)** sets a target range for the **federal funds rate**. Its mandate from Congress is maximum employment and stable prices (often called the *dual mandate*); it defines price stability as **2% inflation measured by the PCE price index**.',
    ),
    match('q1', 'Match each institution with its policy rate.', [['Bank of England', 'Bank Rate'], ['Federal Reserve', 'Federal funds rate']], 'Both rates influence borrowing costs throughout their economies.'),
    key('How rate changes work', 'Raising rates makes borrowing more expensive and saving more rewarding. Over time that tends to cool spending, investment and inflation. Cutting rates does the opposite. The effects take time — often a year or more — and are uncertain.'),
    mcq('q2', 'Inflation is well above target. What is a central bank most likely to do?', ['Cut interest rates', 'Raise interest rates', 'Print a fixed amount of money each week', 'Set share prices'], 1, 'Higher rates aim to cool demand and bring inflation back towards target.'),
    text('Other tools', 'Central banks can also buy government bonds to push down longer-term interest rates (**quantitative easing**, QE) or sell/let them mature (**quantitative tightening**, QT). They also oversee financial stability.'),
    tf('q3', 'The Fed’s statutory mandate includes maximum employment as well as stable prices.', true, 'True. The Bank of England’s primary objective is price stability; supporting the government’s economic policy is secondary.', { final: true }),
    recap('BoE’s MPC sets Bank Rate to meet a 2% CPI target set by government.', 'The Fed’s FOMC targets the federal funds rate, with a dual mandate and 2% PCE goal.', 'Rate changes affect the economy with long and variable lags.'),
  ],
)

const monetaryFiscal = lesson(
  {
    title: 'Monetary versus fiscal policy',
    description: 'Central banks and governments pull different levers.',
    objectives: ['Distinguish monetary and fiscal policy', 'Identify who controls each in the UK and US', 'Explain how they can work together or against each other'],
    tags: ['monetary-fiscal'],
  },
  [
    diagram({ type: 'compare', columns: [
      { title: 'Monetary policy', tone: 'violet', points: ['Interest rates, QE/QT', 'Set by the central bank', 'UK: Bank of England; US: Federal Reserve'] },
      { title: 'Fiscal policy', tone: 'mint', points: ['Government spending and taxes', 'Set by government and legislature', 'UK: HM Treasury & Parliament; US: Congress & President'] },
    ] }),
    multi('q1', 'Which are examples of fiscal policy? Select all that apply.', ['Cutting income tax', 'Raising Bank Rate', 'Increasing spending on infrastructure', 'Quantitative easing'], [0, 2], 'Taxes and spending are fiscal. Rate changes and QE are monetary policy.'),
    example('Pulling in opposite directions', 'If a government boosts spending (fiscal stimulus) while inflation is high, the central bank may need to keep rates higher for longer to offset the extra demand.'),
    mcq('q2', 'Who sets UK income tax rates?', ['The Bank of England', 'The government, through Parliament', 'The London Stock Exchange', 'The Federal Reserve'], 1, 'Taxation is fiscal policy, set by government and approved by Parliament.'),
    tf('q3', 'Central bank independence means the central bank sets interest rates without day-to-day political instruction.', true, 'True. The Bank of England has had operational independence since 1997; the Fed is also independent in setting monetary policy, though accountable to Congress.', { final: true }),
    recap('Monetary policy: interest rates and central bank balance sheets.', 'Fiscal policy: government taxes and spending.', 'The two can reinforce or offset each other.'),
  ],
)

const yieldCurve = lesson(
  {
    title: 'The yield curve',
    description: 'What borrowing costs across maturities can signal.',
    objectives: ['Read a yield curve', 'Distinguish normal and inverted curves', 'Explain why inversions attract attention'],
    tags: ['yield-curve'],
    difficulty: 3,
  },
  [
    text(
      'Yields by maturity',
      'The **yield curve** plots government bond yields against their maturity — from a few months to 30 years. Usually longer maturities yield more, because lenders want compensation for tying money up longer and bearing more interest-rate risk. That is a **normal**, upward-sloping curve.',
    ),
    diagram({ type: 'line', datasetId: 'illus-yield-curves' }, 'Illustrative shapes, not actual market data.', 'Normal and inverted curves'),
    key('Inversion', 'An **inverted** yield curve has short-term yields above long-term yields. It often happens when markets expect central banks to cut rates in future, perhaps because of a slowdown. In the US, inversions have preceded several recessions — but the signal is imperfect and the timing varies.'),
    mcq('q1', 'The 2-year government yield is 4.8% and the 10-year is 4.1%. What shape is this part of the curve?', ['Normal', 'Inverted', 'Flat', 'Impossible'], 1, 'Shorter maturity yielding more than longer maturity is an inversion.'),
    num('q2', 'The 2-year yield is 4.8% and the 10-year yield is 4.1%. What is the 10-year minus 2-year spread, in percentage points?', -0.7, '4.1% − 4.8% = −0.7 percentage points.', { suffix: 'pp', tolerance: 0.01 }),
    tf('q3', 'An inverted yield curve guarantees a recession within twelve months.', false, 'False. Inversions have often preceded US recessions, but not with fixed timing, and not every inversion has been followed by one.', { final: true }),
    recap('The yield curve shows yields across maturities.', 'Normal: upward sloping. Inverted: short yields above long yields.', 'Inversions are watched as a warning sign, not a guarantee.'),
  ],
)

const ratesEquities = lesson(
  {
    title: 'Interest rates and share valuations',
    description: 'How the cost of money ripples through markets.',
    objectives: ['Explain channels from interest rates to share prices', 'Distinguish sensitivities across sectors', 'Avoid mechanical thinking about macro data'],
    tags: ['rates-equities'],
    difficulty: 3,
  },
  [
    text(
      'Several channels at once',
      'Interest rates affect shares in several ways:\n\n- **Discount rates**: higher rates lower the present value of future profits.\n- **Competition**: when bonds and cash pay more, shares must offer more to attract investors.\n- **Company costs**: borrowing becomes more expensive.\n- **The economy**: higher rates tend to slow spending and profits.',
    ),
    multi('q1', 'Through which channels can higher interest rates weigh on share prices? Select all that apply.', ['Higher discount rates', 'More attractive bond and cash yields', 'Higher borrowing costs for companies', 'Automatically higher company revenue'], [0, 1, 2], 'Higher rates do not automatically raise revenue; banks may earn more on loans, but that is sector-specific.'),
    mcq('q2', 'Which type of company might benefit from moderately higher interest rates, at least initially?', ['A highly indebted property developer', 'A bank earning more on its lending', 'A loss-making start-up', 'A long-duration growth company'], 1, 'Banks can earn wider margins between lending and deposit rates — though a weaker economy could raise bad loans.'),
    warn('No mechanical rules', 'Markets respond to *changes versus expectations*, and many forces act together. A rate rise that was fully expected may barely move prices; an inflation figure that surprises can move markets sharply. No single indicator mechanically determines share prices.'),
    tf('q3', 'If the central bank raises rates, share prices must fall that day.', false, 'False. Prices may already reflect the expected rise, and other factors matter. Markets may even rise if the move was smaller than feared.', { final: true }),
    recap('Rates affect shares via discount rates, competition from bonds, costs and the economy.', 'Effects differ by sector.', 'Markets react to surprises, not to the data alone.'),
  ],
)

const exchangeRates = lesson(
  {
    title: 'Exchange rates',
    description: 'What moves the pound and the dollar.',
    objectives: ['Read an exchange rate quote', 'Identify drivers of exchange rates', 'Explain effects on companies and investors'],
    tags: ['exchange-rates'],
    difficulty: 2,
  },
  [
    text(
      'The price of a currency',
      'An **exchange rate** is the price of one currency in another. GBP/USD = 1.25 means £1 buys $1.25.\n\nIf GBP/USD rises to 1.30, the pound has **strengthened** (appreciated); if it falls to 1.20, it has **weakened** (depreciated).',
    ),
    num('q1', 'GBP/USD is 1.25. How many dollars do you get for £400?', 500, '£400 × 1.25 = $500.', { prefix: '$', tolerance: 0.01 }),
    key('What moves currencies', '- **Interest rate differences**: higher rates can attract capital, supporting a currency.\n- **Inflation**: persistently higher inflation tends to weaken a currency over time.\n- **Growth and trade**, **political risk** and **investor sentiment**.\nShort-term moves are notoriously hard to predict.'),
    mcq('q2', 'The pound weakens sharply against the dollar. Which UK-listed company is most likely to benefit in pound terms?', ['A UK company earning most revenue in dollars', 'A UK importer paying suppliers in dollars', 'A UK holiday company selling US trips', 'A purely domestic UK hairdressing chain'], 0, 'Dollar revenues convert into more pounds. Importers and companies with dollar costs are hurt.'),
    example('FTSE 100 and the pound', 'Because many FTSE 100 companies earn much of their revenue overseas, the index has sometimes risen when the pound fell — overseas earnings are worth more in pounds. This is a tendency, not a rule.'),
    tf('q3', 'Exchange rates are easy to forecast because they depend only on interest rates.', false, 'False. Many forces interact, and short-term currency moves are very hard to predict.', { final: true }),
    recap('GBP/USD = dollars per pound.', 'Rates, inflation, growth, politics and sentiment move currencies.', 'Currency moves affect companies with foreign revenues or costs, and investors with foreign assets.'),
  ],
)

export const c6 = course({
  id: 'c6',
  slug: 'bonds-and-macro',
  title: 'Bonds, Interest Rates and Macroeconomics',
  tagline: 'The big forces that move markets.',
  description: 'Understand bonds, yields and credit risk, then explore inflation, GDP, central banks in the UK and US, the yield curve and how interest rates ripple through markets.',
  colour: 'sky',
  icon: 'bank',
  outcomes: [
    'Explain bond terms, prices, yields, duration and credit risk',
    'Describe GDP, inflation, unemployment and recessions',
    'Compare the Bank of England and the Federal Reserve and their policy tools',
    'Interpret the yield curve and the links between interest rates, currencies and share valuations',
  ],
  units: [
    {
      title: 'Bonds',
      description: 'Coupons, yields, duration and credit.',
      lessons: [whatAreBonds, yieldsPrices, duration, creditRisk],
      checkpoint: {
        concept: 'bonds-basics',
        questions: [
          numQ('c1', 'A £100 face value gilt pays a 3% annual coupon. How much interest per year?', 3, '£100 × 3% = £3.', { prefix: '£', tolerance: 0.01, concept: 'bonds-basics' }),
          mcqQ('c2', 'If yields fall, bond prices…', ['fall', 'rise', 'stay the same', 'go to zero'], 1, 'Inverse relationship.', { concept: 'bond-yields' }),
          numQ('c3', 'A $6 coupon bond trades at $120. What is its current yield?', 5, '$6 ÷ $120 = 5%.', { suffix: '%', tolerance: 0.01, concept: 'bond-yields' }),
          numQ('c4', 'Duration 10, yields rise 0.5pp. Approximate price change?', -5, '−10 × 0.5% = −5%.', { suffix: '%', tolerance: 0.05, concept: 'duration' }),
          mcqQ('c5', 'The lowest investment-grade rating at S&P is…', ['AAA', 'A', 'BBB−', 'BB+'], 2, 'BBB− is the lowest investment-grade rating.', { concept: 'credit-risk' }),
          tfQ('c6', 'Credit spreads tend to widen when the economy weakens.', true, 'Investors demand more compensation for default risk.', { concept: 'credit-risk' }),
        ],
      },
    },
    {
      title: 'The economy and central banks',
      description: 'GDP, inflation, jobs and policy.',
      lessons: [gdp, inflationUnemployment, centralBanks, monetaryFiscal],
      checkpoint: {
        concept: 'central-banks',
        questions: [
          numQ('c1', 'GDP grows from $20.0tn to $20.6tn. Growth rate?', 3, '$0.6tn ÷ $20tn = 3%.', { suffix: '%', tolerance: 0.01, concept: 'gdp' }),
          mcqQ('c2', 'Who declares US recessions?', ['The Federal Reserve', 'The NBER’s Business Cycle Dating Committee', 'The NYSE', 'The Treasury'], 1, 'The NBER committee.', { concept: 'gdp' }),
          numQ('c3', 'Labour force 50m, unemployed 2.5m. Unemployment rate?', 5, '2.5 ÷ 50 = 5%.', { suffix: '%', tolerance: 0.01, concept: 'inflation-unemployment' }),
          mcqQ('c4', 'The Bank of England’s inflation target is…', ['0%', '2% CPI', '5% RPI', 'set by the MPC itself'], 1, 'A 2% CPI target set by the government.', { concept: 'central-banks' }),
          mcqQ('c5', 'Quantitative easing is a tool of…', ['fiscal policy', 'monetary policy', 'trade policy', 'tax policy'], 1, 'QE is a central bank tool.', { concept: 'monetary-fiscal' }),
          tfQ('c6', 'Cutting VAT is an example of fiscal policy.', true, 'Taxes are fiscal policy.', { concept: 'monetary-fiscal' }),
        ],
      },
    },
    {
      title: 'Markets and macro',
      description: 'Yield curves, valuations and currencies.',
      lessons: [yieldCurve, ratesEquities, exchangeRates],
      checkpoint: {
        concept: 'yield-curve',
        questions: [
          mcqQ('c1', 'A normal yield curve…', ['slopes upwards', 'slopes downwards', 'is always flat', 'shows share prices'], 0, 'Longer maturities usually yield more.', { concept: 'yield-curve' }),
          numQ('c2', '3-month yield 5.2%, 10-year yield 4.2%. What is the 10-year minus 3-month spread in pp?', -1, '4.2 − 5.2 = −1pp (inverted).', { suffix: 'pp', tolerance: 0.01, concept: 'yield-curve' }),
          tfQ('c3', 'Higher interest rates raise the present value of future company profits.', false, 'They lower it.', { concept: 'rates-equities' }),
          mcqQ('c4', 'Why might markets barely react to a rate rise?', ['It was already expected', 'Rates never matter', 'Markets are closed on rate days', 'Central banks control share prices'], 0, 'Expected news is largely priced in.', { concept: 'rates-equities' }),
          numQ('c5', 'GBP/USD is 1.20. How many pounds does $600 buy?', 500, '$600 ÷ 1.20 = £500.', { prefix: '£', tolerance: 0.01, concept: 'exchange-rates' }),
          mcqQ('c6', 'A weaker pound tends to help…', ['UK importers', 'UK companies earning in dollars', 'UK tourists in the US', 'nobody'], 1, 'Foreign revenues convert into more pounds.', { concept: 'exchange-rates' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'bonds-basics',
    questions: [
      tfQ('e1', 'A bondholder is a lender to the issuer.', true, 'Bonds are loans.', { concept: 'bonds-basics' }),
      numQ('e2', 'A $1,000 bond pays 6% annually. What is the annual coupon in dollars?', 60, '$1,000 × 6% = $60.', { prefix: '$', tolerance: 0.01, concept: 'bonds-basics' }),
      numQ('e3', 'Coupon £7, price £140. Current yield?', 5, '£7 ÷ £140 = 5%.', { suffix: '%', tolerance: 0.01, concept: 'bond-yields' }),
      mcqQ('e4', 'Interest rates rise. A long-dated bond’s price is likely to…', ['rise sharply', 'fall, potentially sharply', 'stay at par', 'become a share'], 1, 'Long duration means high sensitivity.', { concept: 'duration' }),
      numQ('e5', 'Duration 6; yields fall 1pp. Approximate price change?', 6, '−6 × (−1%) = +6%.', { suffix: '%', tolerance: 0.05, concept: 'duration' }),
      numQ('e6', 'Corporate yield 7.5%, government yield 4.0%. Credit spread in pp?', 3.5, '7.5 − 4.0 = 3.5pp.', { suffix: 'pp', tolerance: 0.01, concept: 'credit-risk' }),
      mcqQ('e7', 'Bonds rated below BBB−/Baa3 are called…', ['investment grade', 'high-yield', 'gilts', 'Treasuries'], 1, 'High-yield or “junk”.', { concept: 'credit-risk' }),
      tfQ('e8', 'In the UK, a recession is commonly described as two consecutive quarters of falling real GDP.', true, 'A widely used convention.', { concept: 'gdp' }),
      multiQ('e9', 'Which can drive inflation? Select all that apply.', ['Strong demand outstripping supply', 'Rising energy costs', 'Expectations of future inflation', 'A stock split'], [0, 1, 2], 'Stock splits are unrelated.', { concept: 'inflation-unemployment' }),
      mcqQ('e10', 'The Fed’s preferred inflation measure for its 2% goal is…', ['CPI', 'PCE price index', 'RPI', 'GDP deflator'], 1, 'The Fed defines its 2% goal using the PCE price index.', { concept: 'central-banks' }),
      mcqQ('e11', 'The Bank of England’s rate-setting committee is the…', ['FOMC', 'MPC', 'SEC', 'FCA'], 1, 'The Monetary Policy Committee sets Bank Rate.', { concept: 'central-banks' }),
      mcqQ('e12', 'Government spending decisions are…', ['monetary policy', 'fiscal policy', 'exchange-rate policy', 'credit ratings'], 1, 'Spending and taxation are fiscal policy.', { concept: 'monetary-fiscal' }),
      tfQ('e13', 'An inverted yield curve always leads to a recession within a year.', false, 'It is a warning sign with variable timing.', { concept: 'yield-curve' }),
      tfQ('e14', 'A single economic indicator mechanically determines share prices.', false, 'Many forces interact; markets react to surprises.', { concept: 'rates-equities' }),
      numQ('e15', 'GBP/USD moves from 1.25 to 1.30. By what percentage has the pound strengthened against the dollar?', 4, '1.30 ÷ 1.25 − 1 = 4%.', { suffix: '%', tolerance: 0.05, concept: 'exchange-rates' }),
    ],
  },
})

