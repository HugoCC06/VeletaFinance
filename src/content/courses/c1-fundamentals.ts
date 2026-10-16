import { analogy, course, diagram, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, ukus, warn } from '../builders'

const whatIsInvesting = lesson(
  {
    title: 'What is investing?',
    description: 'Putting money to work today in the hope of having more tomorrow.',
    objectives: ['Define investing in plain language', 'Distinguish spending, saving and investing', 'Name the two ways an investment can pay you'],
    tags: ['investing-basics'],
  },
  [
    text(
      'Money has three jobs',
      'Every pound or dollar you have can do one of three things:\n\n- **Spend** it on something you use now.\n- **Save** it somewhere safe and easy to reach.\n- **Invest** it in something you expect to grow in value or pay you an income over time.\n\nInvesting means giving up some money *now* in exchange for the chance of more money *later*. The word that matters is *chance*: the extra reward is not guaranteed.',
    ),
    key(
      'Investing, defined',
      'An **investment** is an asset bought with the expectation that it will produce income, grow in value, or both. An **asset** is simply something that has value — a share in a company, a bond, a property, a fund.',
    ),
    mcq(
      'q1',
      'Maya puts £50 a month into a fund that owns shares in hundreds of companies. Which job is her money doing?',
      ['Spending', 'Saving', 'Investing', 'Borrowing'],
      2,
      'She is buying assets (company shares through a fund) in the hope they grow or pay income. That is investing — her money is not guaranteed, unlike a savings account.',
    ),
    text(
      'How investments pay you',
      'Investments can reward you in two ways:\n\n- **Income**: regular payments such as interest from a bond, dividends from a share or rent from a property.\n- **Capital growth**: the asset becomes worth more than you paid, so you could sell it for a profit.\n\nThe combination of the two is called your **total return**.',
    ),
    example(
      'A worked example',
      'You buy a share for £20. Over a year it pays a £1 dividend and its price rises to £22.\n\nIncome = £1. Capital growth = £22 − £20 = £2. Total return = £3, which is £3 ÷ £20 = **15%**.',
    ),
    num(
      'q2',
      'You buy a share for $40. Over a year it pays $2 in dividends and the price rises to $44. What is your total return in dollars?',
      6,
      'Total return = income + capital growth = $2 + ($44 − $40) = $6.',
      { prefix: '$', working: '$2 dividend + ($44 − $40) price gain = $6' },
    ),
    tf(
      'q3',
      'If an investment falls in price, it can still have produced a positive total return.',
      true,
      'True. If the income received is larger than the fall in price, the total return is still positive. For example, a £2 dividend and a £1 price fall gives +£1.',
    ),
    multi(
      'q4',
      'Which of these are forms of investment income? Select all that apply.',
      ['Dividends from shares', 'Interest from a bond', 'Rent from a property', 'A rise in a share’s price'],
      [0, 1, 2],
      'Dividends, interest and rent are income. A price rise is capital growth, not income — you only receive it as cash if you sell.',
      { final: true },
    ),
    recap(
      'Investing means buying assets you expect to grow or pay you over time.',
      'Investment returns come from income and capital growth — together, total return.',
      'Returns are never guaranteed: the reward for investing is a chance, not a promise.',
    ),
  ],
)

const savingVsInvesting = lesson(
  {
    title: 'Saving versus investing',
    description: 'When cash is the right home for your money — and when it is not.',
    objectives: ['Explain the role of an emergency fund', 'Compare the trade-offs of cash savings and investments', 'Match goals to saving or investing'],
    tags: ['saving-vs-investing'],
  },
  [
    text(
      'Two tools, two jobs',
      'Saving and investing are not rivals; they do different jobs.\n\n**Savings** (cash in a bank or building society account) are stable and easy to access. Their value in pounds or dollars does not fall, but interest is usually modest.\n\n**Investments** can grow much more over long periods, but their value goes up and down, sometimes sharply, and you may get back less than you put in.',
    ),
    diagram(
      {
        type: 'compare',
        columns: [
          { title: 'Cash savings', tone: 'sky', points: ['Value does not fall in pounds/dollars', 'Easy to withdraw quickly', 'Usually lower long-run growth', 'Can lose purchasing power to inflation'] },
          { title: 'Investments', tone: 'violet', points: ['Value can rise and fall', 'Selling may take time or be at a bad moment', 'Higher potential long-run growth', 'Possible loss of capital'] },
        ],
      },
      'Neither is “better” — they suit different goals.',
    ),
    key(
      'Emergency fund first',
      'Many people keep an **emergency fund** — often a few months of essential spending — in cash before investing. It covers surprises like a broken laptop or a gap between jobs, so you are not forced to sell investments when prices happen to be low.',
    ),
    mcq(
      'q1',
      'Why is it risky to invest money you might need next month?',
      ['Investments always fall in the short term', 'You might have to sell after a fall and lock in a loss', 'Investments cannot be sold within a month', 'Banks charge you for investing'],
      1,
      'Over short periods investment values can be down. If you need the money at that moment, you have to sell anyway and turn a temporary fall into a real loss.',
    ),
    match(
      'q2',
      'Match each goal with the more suitable home for the money.',
      [
        ['Rent due in three weeks', 'Cash savings'],
        ['Retirement in 40 years', 'Long-term investments'],
        ['Emergency fund', 'Easy-access cash'],
      ],
      'Short-term and must-have money suits cash. Very long horizons can ride out ups and downs, which is where investments make sense.',
    ),
    ukus(
      'UK and US accounts',
      'In the UK, many savers use a **Cash ISA** and investors a **Stocks and Shares ISA** — both shelter returns from UK tax within annual limits. In the US, people often use high-yield savings accounts for cash and accounts such as a **401(k)** or **IRA** for long-term investing. Rules and limits change — always check gov.uk or irs.gov for the current year.',
    ),
    tf('q3', 'Keeping money in cash means its value can never fall in real terms.', false, 'False. Its pound or dollar amount stays the same, but if prices rise faster than the interest you earn, its purchasing power — its *real* value — falls.', { final: true }),
    recap(
      'Savings are for stability and access; investments are for long-term growth with risk.',
      'An emergency fund in cash protects you from being forced to sell investments.',
      'Match money to its time horizon: short-term needs in cash, long-term goals can be invested.',
    ),
  ],
)

const inflation = lesson(
  {
    title: 'Inflation and purchasing power',
    description: 'Why £100 today will not buy what £100 buys in ten years.',
    objectives: ['Define inflation and purchasing power', 'Distinguish nominal and real returns', 'Estimate a real return'],
    tags: ['inflation'],
    difficulty: 2,
  },
  [
    text(
      'Prices creep upwards',
      '**Inflation** is the general rise in prices over time. If inflation is 3% a year, a basket of shopping that costs £100 today costs about £103 next year.\n\nThe flip side is **purchasing power**: each pound buys a little less. Money that sits still slowly loses value in real terms.',
    ),
    diagram(
      { type: 'bars', unit: '£', bars: [{ label: 'Today', value: 1000, tone: 'violet' }, { label: '5 years', value: 863, tone: 'sky' }, { label: '10 years', value: 744, tone: 'coral' }] },
      'What £1,000 can buy, in today’s money, with 3% inflation each year.',
      'Purchasing power at 3% inflation',
    ),
    numbers('The calculation', [['Real value after n years', 'Amount ÷ (1 + inflation)ⁿ'], ['£1,000 after 10 years at 3%', '£1,000 ÷ 1.03¹⁰ ≈ £744']]),
    mcq(
      'q1',
      'Inflation is 4% a year and your savings account pays 1% interest. What is happening to your money’s purchasing power?',
      ['It is growing by 5% a year', 'It is growing by 1% a year', 'It is shrinking by roughly 3% a year', 'It is unchanged'],
      2,
      'Your balance grows 1% but prices grow 4%, so each year your money buys roughly 3% less.',
    ),
    key(
      'Nominal versus real',
      'A **nominal** return is the headline percentage. A **real** return adjusts for inflation and tells you how much your *purchasing power* grew.\n\nQuick estimate: real ≈ nominal − inflation.\nExact: real = (1 + nominal) ÷ (1 + inflation) − 1.',
    ),
    num(
      'q2',
      'An investment returns 7% in a year when inflation is 3%. Using the quick estimate, what is the real return?',
      4,
      'Quick estimate: 7% − 3% = 4%. The exact figure is 1.07 ÷ 1.03 − 1 ≈ 3.9%, very close for small rates.',
      { suffix: '%', tolerance: 0.15, working: '7% − 3% ≈ 4% (exact: 1.07 ÷ 1.03 − 1 = 3.88%)' },
    ),
    ukus(
      'Who measures inflation?',
      'In the UK the Office for National Statistics publishes the **CPI** (Consumer Prices Index); the Bank of England’s target is 2% CPI inflation. In the US the Bureau of Labor Statistics publishes the **CPI-U**, while the Federal Reserve’s 2% target is measured with the **PCE** price index.',
    ),
    tf(
      'q3',
      'A 5% nominal return in a year with 6% inflation is a positive real return.',
      false,
      'False. Prices rose faster than your money, so the real return is about −1%: you can buy less than before.',
      { final: true },
    ),
    recap(
      'Inflation erodes purchasing power: the same money buys less over time.',
      'Real return ≈ nominal return − inflation; the exact form is (1+n)/(1+i) − 1.',
      'To grow wealth in real terms, returns need to beat inflation after costs.',
    ),
  ],
  // Inflation measurement facts: ONS CPI and BLS CPI-U are the official measures; BoE target 2% CPI (HM Treasury remit); Fed 2% PCE target (FOMC Statement on Longer-Run Goals).
)

const compounding = lesson(
  {
    title: 'The power of compounding',
    description: 'Earning returns on your returns — and why time matters so much.',
    objectives: ['Distinguish simple and compound growth', 'Calculate compound growth over several years', 'Use the rule of 72 to estimate doubling time'],
    tags: ['compounding'],
    difficulty: 2,
  },
  [
    text(
      'Returns on returns',
      'With **simple** growth you earn a return only on what you originally put in. With **compound** growth, each year’s return is added to the pot, so next year you earn a return on a bigger amount.\n\nCompounding is slow at first and dramatic later — which is why starting early matters more than starting big.',
    ),
    numbers(
      '£1,000 growing at 5% a year',
      [
        ['After 1 year', '£1,050.00'],
        ['After 2 years', '£1,102.50'],
        ['After 10 years (compound)', '£1,628.89'],
        ['After 10 years (simple)', '£1,500.00'],
      ],
      'Compound value = start × (1 + rate)ⁿ. These are illustrations with a constant rate; real investment returns vary every year.',
    ),
    num(
      'q1',
      'You invest £1,000 at a steady 5% a year, compounded annually. What is it worth after 2 years, to the nearest penny?',
      1102.5,
      'Year 1: £1,000 × 1.05 = £1,050. Year 2: £1,050 × 1.05 = £1,102.50. The extra £2.50 versus simple growth is interest earned on interest.',
      { prefix: '£', tolerance: 0.01, working: '£1,000 × 1.05 × 1.05 = £1,102.50' },
    ),
    diagram(
      { type: 'line', datasetId: 'illus-compounding' },
      'Illustrative: £2,000 at a constant 7% a year. Real returns are not constant.',
      'Starting early',
    ),
    key(
      'The rule of 72',
      'To estimate how long money takes to double at a fixed yearly rate, divide 72 by the rate. At 6% a year: 72 ÷ 6 ≈ **12 years**. It is an approximation that works well for rates between about 2% and 12%.',
    ),
    num('q2', 'Using the rule of 72, roughly how many years does it take money to double at 8% a year?', 9, '72 ÷ 8 = 9 years. (The exact answer is about 9.01 years.)', { suffix: 'years', tolerance: 0.2 }),
    tf('q3', 'Doubling the time invested roughly doubles the final value of a compounding investment.', false, 'False — it does much more than double the *growth*. At 7%, £2,000 becomes about £7,739 after 20 years but about £29,949 after 40 years: nearly four times as much.'),
    order(
      'q4',
      'Put these in order of final value, largest first, for a £1,000 investment at 5% a year.',
      ['20 years of compound growth', '10 years of compound growth', '10 years of simple growth', '1 year of growth'],
      '£1,000 × 1.05²⁰ ≈ £2,653; × 1.05¹⁰ ≈ £1,629; simple for 10 years = £1,500; one year = £1,050.',
      { final: true },
    ),
    recap(
      'Compound growth earns returns on previous returns; simple growth does not.',
      'Value = start × (1 + rate)ⁿ — time is the most powerful input.',
      'Rule of 72: years to double ≈ 72 ÷ rate.',
    ),
  ],
)

const riskReturn = lesson(
  {
    title: 'Risk and return',
    description: 'Why higher potential returns come with a bumpier ride.',
    objectives: ['Define investment risk', 'Explain the risk–return trade-off', 'Recognise that higher risk does not guarantee higher return'],
    tags: ['risk-return'],
  },
  [
    text(
      'What is risk?',
      'In investing, **risk** is the chance that the outcome differs from what you expected — including losing money. A common measure is **volatility**: how much and how quickly prices swing up and down.\n\nCash in a bank is low-volatility. Shares in a single small company can be highly volatile.',
    ),
    diagram(
      {
        type: 'scale',
        left: 'Lower risk, lower potential return',
        right: 'Higher risk, higher potential return',
        items: [
          { label: 'Cash', position: 5, tone: 'sky' },
          { label: 'Government bonds', position: 25, tone: 'mint' },
          { label: 'Corporate bonds', position: 40, tone: 'mint' },
          { label: 'Broad share funds', position: 65, tone: 'violet' },
          { label: 'Single shares', position: 85, tone: 'coral' },
        ],
      },
      'A simplified spectrum. Real-world risk depends on the specific investment and the price paid.',
    ),
    key(
      'The trade-off',
      'Investors usually demand a higher *expected* return to accept more risk. This extra expected reward is called a **risk premium**.\n\nCrucially: higher risk means a wider range of possible outcomes — including worse ones. It does not mean higher returns are guaranteed.',
    ),
    mcq(
      'q1',
      'Why do shares have historically offered higher average long-run returns than cash?',
      ['Banks are not allowed to pay higher interest', 'Investors demand extra expected return for accepting more uncertainty', 'Share prices only go up over time', 'Governments guarantee share returns'],
      1,
      'Investors need compensation — a risk premium — for accepting the possibility of losses and large swings. Nothing guarantees that premium in any given period.',
    ),
    example(
      'Losses hurt more than they look',
      'If an investment falls 50%, it needs to rise **100%** to get back to where it started. £100 → £50 → needs +£50, which is 100% of £50. This asymmetry is one reason large losses are so damaging.',
    ),
    num('q2', 'An investment falls by 20%. By what percentage must it then rise to get back to its original value?', 25, 'From £100 it drops to £80. To return to £100 it needs +£20, which is £20 ÷ £80 = 25%.', { suffix: '%', tolerance: 0.1, working: '£100 → £80; £20 ÷ £80 = 25%' }),
    tf('q3', 'Choosing a riskier investment guarantees you a higher return if you wait long enough.', false, 'False. Riskier assets have higher *expected* returns on average, but individual investments can lose money permanently — companies can fail.', { final: true }),
    recap(
      'Risk is uncertainty about outcomes, including the possibility of loss.',
      'Higher expected returns usually require accepting more risk — the risk premium.',
      'A 50% loss needs a 100% gain to recover: avoid risks you cannot afford.',
    ),
  ],
)

const horizonsLiquidity = lesson(
  {
    title: 'Time horizons and liquidity',
    description: 'How long you can wait — and how quickly you can get your money out.',
    objectives: ['Define time horizon and liquidity', 'Explain why longer horizons can tolerate more volatility', 'Compare the liquidity of common assets'],
    tags: ['time-horizon', 'liquidity'],
  },
  [
    text(
      'Your time horizon',
      'Your **time horizon** is how long until you need the money. A student saving for a gap year in 18 months has a short horizon; someone saving for retirement in 40 years has a very long one.\n\nThe longer your horizon, the more time investments have to recover from falls — so you may be able to accept more volatility.',
    ),
    warn('Time is not a guarantee', 'A long horizon reduces the chance that you are forced to sell at a bad moment, but it does not remove risk. Markets can stay down for years, and individual companies can disappear entirely.'),
    mcq(
      'q1',
      'Which person can most reasonably accept large short-term swings in value?',
      ['Sam, buying a car in 6 months', 'Priya, paying university fees next term', 'Leo, investing for retirement in 35 years', 'Ana, holding her emergency fund'],
      2,
      'Leo’s long horizon gives time to ride out falls without being forced to sell. The others need their money soon or unexpectedly.',
    ),
    key('Liquidity', '**Liquidity** is how quickly and cheaply you can turn an asset into cash without pushing its price down. Cash is perfectly liquid. Large company shares are usually very liquid during market hours. Property is illiquid: selling a house can take months and costs fees.'),
    order('q2', 'Order these from most liquid to least liquid.', ['Cash in an easy-access account', 'Shares in a large listed company', 'A rare painting', 'A buy-to-let flat'], 'Cash is instant. Large company shares sell within seconds on an exchange. Art and property can take weeks or months and sale costs can be high. (Art versus property can vary — both are illiquid.)'),
    tf('q3', 'An illiquid investment can be a problem even if it is worth a lot on paper.', true, 'True. If you need cash quickly, a valuable asset you cannot sell fast — or can only sell at a discount — does not help.', { final: true }),
    recap('Time horizon: how long until you need the money.', 'Longer horizons can absorb more volatility, but risk never disappears.', 'Liquidity: how quickly and cheaply an asset converts to cash.'),
  ],
)

const diversification = lesson(
  {
    title: 'Don’t put all your eggs in one basket',
    description: 'Diversification: spreading risk so one bad outcome does not sink you.',
    objectives: ['Define diversification', 'Explain why combining investments reduces company-specific risk', 'Recognise the limits of diversification'],
    tags: ['diversification-basics'],
  },
  [
    text(
      'Spreading your bets',
      '**Diversification** means spreading money across many different investments so that a problem with one has a limited effect on the whole.\n\nIf you own one company and it fails, you could lose everything. If you own 300 companies and one fails, the impact is small.',
    ),
    example(
      'Two portfolios',
      'Portfolio A holds £1,000 in one company. Portfolio B holds £10 in each of 100 companies.\n\nIf one company goes bust, A loses £1,000 (100%). B loses £10 — 1% of the portfolio.',
    ),
    num('q1', 'You split £2,000 equally across 40 companies. One company fails completely. What percentage of your portfolio do you lose (ignoring other price moves)?', 2.5, 'Each holding is £2,000 ÷ 40 = £50. Losing £50 out of £2,000 is 2.5%.', { suffix: '%', tolerance: 0.01, working: '£2,000 ÷ 40 = £50; £50 ÷ £2,000 = 2.5%' }),
    key('Two kinds of risk', '**Specific risk** affects one company or industry (a failed product, a scandal). Diversification can reduce it a lot.\n\n**Market risk** affects almost everything at once (a recession, a financial crisis). Diversification across shares cannot remove it.'),
    mcq('q2', 'Which risk does owning shares in hundreds of companies reduce the most?', ['A global recession', 'One company’s new product flopping', 'A worldwide stock market fall', 'Rising inflation everywhere'], 1, 'A single company’s problems are specific risk, which diversification dilutes. Market-wide events hit most shares together.'),
    tf('q3', 'A well-diversified share portfolio cannot fall in value.', false, 'False. Diversification reduces specific risk but cannot eliminate market risk. In 2008 and 2020, diversified share portfolios fell sharply.', { final: true }),
    recap('Diversification spreads money so one failure has a limited impact.', 'It reduces specific risk but not market risk.', 'Diversified does not mean risk-free.'),
  ],
)

const speculation = lesson(
  {
    title: 'Investing versus speculation',
    description: 'Owning productive assets versus betting on price moves.',
    objectives: ['Distinguish investing from speculation', 'Identify warning signs of speculative behaviour', 'Explain why speculation can resemble gambling'],
    tags: ['speculation'],
    difficulty: 2,
  },
  [
    text(
      'Same tools, different mindset',
      'An **investor** buys an asset because of what it is expected to produce over time — company profits, interest, rent. A **speculator** buys mainly because they expect someone else to pay a higher price soon.\n\nThe same share can be bought either way. The difference is the reason and the time horizon.',
    ),
    analogy('An orchard and a raffle', 'Buying an orchard because it produces fruit every year is like investing. Buying a raffle ticket because one ticket might win big is closer to speculation: the outcome depends on luck and other people’s behaviour rather than on what the asset produces.'),
    multi(
      'q1',
      'Which statements suggest speculation rather than investing? Select all that apply.',
      ['“I’ll sell as soon as it doubles next week.”', '“The business grows profits and I plan to hold for years.”', '“Everyone online is buying it, so the price must go up.”', '“I don’t know what the company does, but the chart looks exciting.”'],
      [0, 2, 3],
      'Short time frames, following the crowd and ignoring what the asset is are hallmarks of speculation. Holding a profitable business for years is an investing mindset.',
    ),
    warn('Red flags', 'Promises of quick, guaranteed returns; pressure to act immediately; and assets nobody can explain are classic warning signs — of speculation and, sometimes, of scams. The UK’s FCA and the US SEC both publish scam warnings for exactly these patterns.'),
    mcq('q2', 'A social media post promises “guaranteed 30% a month” from a new token. What is the most sensible reaction?', ['Invest a little to test it', 'Treat it as a major red flag — guaranteed high returns do not exist', 'Invest only if friends are doing it', 'Wait until it reaches 40%'], 1, 'Guaranteed high returns are a hallmark of fraud. Legitimate investments with high potential returns carry high risk, and nobody can guarantee them.'),
    tf('q3', 'Speculation is always illegal.', false, 'False. Speculation is legal and can even help markets function. The issue is understanding that it is closer to betting, with a real chance of losing your money.', { final: true }),
    recap('Investors focus on what an asset produces over time; speculators focus on short-term price moves.', 'Guaranteed high returns, urgency and hype are red flags.', 'Speculation is legal but should be recognised for the gamble it is.'),
  ],
)

const assetClasses = lesson(
  {
    title: 'The main asset classes',
    description: 'Cash, bonds, shares, property and commodities at a glance.',
    objectives: ['Name the main asset classes', 'Describe how each typically generates returns', 'Compare their typical risk levels'],
    tags: ['asset-classes'],
  },
  [
    text(
      'Families of investments',
      'An **asset class** is a group of investments that behave in similar ways. The big five:\n\n- **Cash**: bank deposits, money market funds.\n- **Bonds**: loans to governments or companies that pay interest.\n- **Shares (equities)**: part-ownership of companies.\n- **Property**: buildings and land, owned directly or through funds.\n- **Commodities**: raw materials such as gold, oil or wheat.',
    ),
    match(
      'q1',
      'Match each asset class with its main source of return.',
      [
        ['Bond', 'Interest payments'],
        ['Share', 'Company profits (dividends and growth)'],
        ['Property', 'Rent and changes in value'],
        ['Gold', 'Price changes only'],
      ],
      'Bonds pay interest; shares give you a slice of company profits; property earns rent; gold produces no income, so returns depend entirely on its price.',
    ),
    key('Equities = shares', 'In the UK people often say **shares**; in the US, **stocks**. Both mean ownership stakes in companies. “Equities” is the formal term for the asset class.'),
    mcq('q2', 'Which asset class generally produces no income of its own?', ['Corporate bonds', 'Rental property', 'Commodities like gold', 'Dividend-paying shares'], 2, 'A bar of gold does not pay interest, rent or dividends. Its return comes only from price changes (minus storage costs).'),
    tf('q3', 'Bonds are always lower risk than shares.', false, 'False. Bonds from strong governments are usually lower risk than shares, but bonds from struggling companies can be very risky, and long-dated bonds can fall sharply when interest rates rise.', { final: true }),
    recap('The main asset classes are cash, bonds, shares, property and commodities.', 'They differ in how they generate returns and how risky they tend to be.', 'Generalisations help, but the specific investment matters.'),
  ],
)

const costs = lesson(
  {
    title: 'The hidden power of costs',
    description: 'Small fees compound into big differences.',
    objectives: ['Identify common investment costs', 'Calculate the long-term effect of a fee', 'Explain net versus gross returns'],
    tags: ['investment-costs'],
    difficulty: 2,
  },
  [
    text(
      'What you pay to invest',
      'Common costs include:\n\n- **Fund fees** — an annual percentage of your money (for example 0.2% a year).\n- **Platform fees** — what an app or broker charges to hold your investments.\n- **Trading costs** — commissions, the bid–ask spread, currency conversion fees.\n- **Taxes** — on income or gains, depending on where you live and the account used.',
    ),
    key('Gross versus net', 'A **gross** return is before costs; a **net** return is after costs. What actually lands in your pocket is the net return. A fund returning 6% gross with a 1% annual fee gives about 5% net.'),
    numbers(
      '£10,000 for 30 years',
      [
        ['6% a year (no fee)', '£57,435'],
        ['5% a year (after a 1% fee)', '£43,219'],
        ['Difference', '≈ £14,215'],
      ],
      'Illustrative constant returns. A 1% yearly fee consumed about a quarter of the final value.',
    ),
    num('q1', 'A fund returns 7% before fees and charges 0.5% a year. Approximately what is the net return?', 6.5, 'Net ≈ gross − fee = 7% − 0.5% = 6.5%.', { suffix: '%', tolerance: 0.05 }),
    mcq('q2', 'Why does a 1% annual fee matter more over 30 years than over 1 year?', ['Fees increase each year by law', 'The fee is taken from a growing pot, and the money lost also stops compounding', 'Fees are only charged at the end', 'It doesn’t — it is always 1%'], 1, 'Every pound paid in fees is a pound that can no longer grow. Over decades, that lost compounding adds up dramatically.'),
    tf('q3', 'A fund with higher fees always delivers better performance.', false, 'False. Fees are a certain cost; extra performance is uncertain. Research on fund performance consistently finds that many higher-cost active funds underperform cheaper index alternatives after fees, though not all do.', { final: true }),
    recap('Costs include fund fees, platform fees, trading costs and taxes.', 'Net return = gross return − costs; only the net return matters to you.', 'Small annual fees compound into large differences over decades.'),
  ],
)

const misconceptions = lesson(
  {
    title: 'Common investing myths',
    description: 'Clearing up five misconceptions that stop people investing well.',
    objectives: ['Recognise common investing myths', 'Explain why past performance does not guarantee future results', 'Explain why timing the market is difficult'],
    tags: ['misconceptions'],
  },
  [
    text(
      'Myth-busting',
      'Plenty of beliefs about investing are half-true at best. Let’s test a few.',
    ),
    tf('q1', '“You need a lot of money to start investing.”', false, 'False. Many platforms allow small regular contributions or fractional shares. What matters more than the starting amount is time, costs and consistency.'),
    tf('q2', '“If a fund did brilliantly last year, it will probably do brilliantly this year.”', false, 'False. Past performance is not a reliable guide to future performance — that is why regulators require the warning. Last year’s winners often revert to average.'),
    key('Timing the market', 'Trying to sell before falls and buy before rises sounds sensible, but you have to be right *twice* — when to get out and when to get back in. Some of the biggest daily gains in market history have come shortly after big falls, so missing them can be costly.'),
    mcq('q3', 'Which approach avoids having to predict short-term market moves?', ['Selling everything whenever the news is bad', 'Investing a fixed amount regularly regardless of price', 'Only buying after prices have risen for a month', 'Waiting for the perfect moment'], 1, 'Regular investing (sometimes called pound- or dollar-cost averaging) removes the need to time the market. It does not guarantee profit, but it reduces timing regret.'),
    tf('q4', '“Investing is basically the same as gambling.”', false, 'False, though speculation can resemble gambling. A diversified long-term investment owns real businesses producing profits; a casino game has a negative expected value for the player by design.'),
    mcq(
      'q5',
      'A friend says: “This fund returned 40% last year, so I’m putting all my savings in.” What is the best response?',
      ['Great plan — momentum always continues', 'Past returns don’t guarantee future returns, and putting all your savings in one fund concentrates risk', 'Only invest if it returned 50%', 'Funds can’t lose money'],
      1,
      'One strong year says little about the next, and putting everything in one place ignores diversification and the need for an emergency fund.',
      { final: true },
    ),
    recap('You can start investing with small amounts.', 'Past performance is not a reliable guide to the future.', 'Timing the market requires being right twice; regular investing avoids it.'),
  ],
)

export const c1 = course({
  id: 'c1',
  slug: 'investing-fundamentals',
  title: 'Investing Fundamentals',
  tagline: 'The why and how of putting money to work.',
  description: 'Start here. Learn what investing is, how risk and return are linked, why compounding and inflation matter, and how to avoid the most common mistakes.',
  colour: 'mint',
  icon: 'seed',
  outcomes: [
    'Explain the purpose, risks and basic mechanics of investing',
    'Distinguish saving, investing and speculation',
    'Calculate compound growth and real (inflation-adjusted) returns',
    'Explain diversification, liquidity, time horizons and the impact of costs',
  ],
  units: [
    {
      title: 'Why invest?',
      description: 'Spending, saving and investing; inflation and compounding.',
      lessons: [whatIsInvesting, savingVsInvesting, inflation, compounding],
      checkpoint: {
        concept: 'investing-basics',
        questions: [
          mcqQ('c1', 'Which is the best description of investing?', ['Keeping money in a current account', 'Buying assets expected to produce income or grow in value, accepting risk', 'Spending money on things that hold their value', 'Lending money to friends'], 1, 'Investing means buying assets with an expectation — not a guarantee — of income or growth.', { concept: 'investing-basics' }),
          numQ('c2', 'You buy a share for £50. It pays £1.50 of dividends and ends the year at £53. What is the total return as a percentage?', 9, 'Total return = (£1.50 + £3) ÷ £50 = £4.50 ÷ £50 = 9%.', { suffix: '%', tolerance: 0.05, concept: 'investing-basics', working: '(£1.50 + (£53 − £50)) ÷ £50 = 9%' }),
          tfQ('c3', 'An emergency fund is usually best kept in investments that might grow quickly.', false, 'Emergency money must be available and stable, so cash is usually the right home.', { concept: 'saving-vs-investing' }),
          numQ('c4', 'Your savings earn 2% while inflation is 5%. Using the quick estimate, what is your real return?', -3, 'Real ≈ nominal − inflation = 2% − 5% = −3%.', { suffix: '%', tolerance: 0.15, concept: 'inflation' }),
          numQ('c5', '£500 grows at a steady 10% a year, compounded annually. What is it worth after 2 years?', 605, '£500 × 1.1 = £550; £550 × 1.1 = £605.', { prefix: '£', tolerance: 0.01, concept: 'compounding' }),
          mcqQ('c6', 'Using the rule of 72, how long does money take to double at 4% a year?', ['About 4 years', 'About 12 years', 'About 18 years', 'About 29 years'], 2, '72 ÷ 4 = 18 years.', { concept: 'compounding' }),
        ],
      },
    },
    {
      title: 'Risk and return',
      description: 'Volatility, time horizons, diversification and speculation.',
      lessons: [riskReturn, horizonsLiquidity, diversification, speculation],
      checkpoint: {
        concept: 'risk-return',
        questions: [
          mcqQ('c1', 'What does a “risk premium” refer to?', ['A fee charged for risky investments', 'The extra expected return investors demand for taking more risk', 'Insurance against losses', 'A guaranteed bonus on shares'], 1, 'The risk premium is the additional *expected* (not guaranteed) return for bearing more risk.', { concept: 'risk-return' }),
          numQ('c2', 'A share falls 50%. What percentage rise does it need to return to its starting price?', 100, 'Halving to 50 needs +50, which is 100% of 50.', { suffix: '%', tolerance: 0.1, concept: 'risk-return' }),
          mcqQ('c3', 'Which asset is the least liquid?', ['A FTSE 100 company share', 'Cash in a current account', 'A small commercial building', 'A large US company share'], 2, 'Property can take months to sell and has high transaction costs.', { concept: 'liquidity' }),
          tfQ('c4', 'Diversifying across hundreds of companies removes the risk of a market-wide fall.', false, 'Diversification reduces company-specific risk; market risk remains.', { concept: 'diversification-basics' }),
          multiQ('c5', 'Which are warning signs of speculation or a scam? Select all that apply.', ['Guaranteed high returns', 'Pressure to invest today', 'A long track record of audited financial statements', 'An asset nobody can explain'], [0, 1, 3], 'Guarantees, urgency and unexplainable assets are red flags. Audited statements are a sign of transparency (though not a guarantee of quality).', { concept: 'speculation' }),
          mcqQ('c6', 'Who can most reasonably invest in a volatile asset?', ['Someone saving for a deposit due next month', 'Someone with a 30-year horizon and an emergency fund', 'Someone who might need the money any day', 'Someone using borrowed money due back in a week'], 1, 'A long horizon plus a cash buffer means short-term swings are less likely to force a sale.', { concept: 'time-horizon' }),
        ],
      },
    },
    {
      title: 'The investor’s toolkit',
      description: 'Asset classes, costs and common myths.',
      lessons: [assetClasses, costs, misconceptions],
      checkpoint: {
        concept: 'asset-classes',
        questions: [
          mcqQ('c1', 'A bond is best described as…', ['Part-ownership of a company', 'A loan to a government or company that pays interest', 'A physical commodity', 'A type of bank account'], 1, 'A bond is a loan: the issuer promises interest and to repay the face value at maturity.', { concept: 'asset-classes' }),
          tfQ('c2', '“Stocks” and “shares” refer to the same basic idea: ownership stakes in companies.', true, 'US usage favours “stocks”, UK usage “shares”; both mean equity ownership.', { concept: 'asset-classes' }),
          numQ('c3', 'A fund earns 8% gross and charges 1.5% a year. Approximately what is the net return?', 6.5, 'Net ≈ 8% − 1.5% = 6.5%.', { suffix: '%', tolerance: 0.05, concept: 'investment-costs' }),
          mcqQ('c4', 'Why are fees more damaging over long periods?', ['They are taken from a growing pot and lose future compounding', 'Fees rise automatically with age', 'Long-term investors pay double', 'They are not'], 0, 'Money paid in fees stops compounding for you.', { concept: 'investment-costs' }),
          tfQ('c5', 'Past performance is a reliable guide to future performance.', false, 'It is not — strong past returns often fail to persist.', { concept: 'misconceptions' }),
          mcqQ('c6', 'What is the main drawback of trying to time the market?', ['It is illegal', 'You must be right about both when to sell and when to buy back', 'Brokers forbid it', 'It guarantees losses'], 1, 'Timing needs two correct decisions, and big recovery days often follow big falls.', { concept: 'misconceptions' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'investing-basics',
    questions: [
      mcqQ('e1', 'Which of these is investing rather than saving?', ['Putting money in an easy-access savings account', 'Buying units in a global share fund', 'Keeping cash in a current account', 'Holding banknotes at home'], 1, 'A share fund buys assets whose value can rise or fall — investing.', { concept: 'investing-basics' }),
      numQ('e2', 'You buy a share for $25. It pays $0.50 in dividends and ends the year at $27. What is the total return in dollars?', 2.5, '$0.50 + ($27 − $25) = $2.50.', { prefix: '$', tolerance: 0.01, concept: 'investing-basics' }),
      tfQ('e3', 'Cash savings can lose purchasing power even though their balance never falls.', true, 'If inflation exceeds the interest rate, real value falls.', { concept: 'inflation' }),
      numQ('e4', 'Using the exact formula, what is the real return when the nominal return is 10% and inflation is 10%?', 0, '(1.10 ÷ 1.10) − 1 = 0%.', { suffix: '%', tolerance: 0.05, concept: 'inflation' }),
      numQ('e5', '£2,000 grows at 3% a year compounded annually for 2 years. What is it worth (to the nearest penny)?', 2121.8, '£2,000 × 1.03² = £2,121.80.', { prefix: '£', tolerance: 0.01, concept: 'compounding' }),
      mcqQ('e6', 'At 9% a year, roughly how long does it take to double money (rule of 72)?', ['About 4 years', 'About 8 years', 'About 12 years', 'About 15 years'], 1, '72 ÷ 9 = 8 years.', { concept: 'compounding' }),
      mcqQ('e7', 'Higher-risk investments…', ['always earn more', 'have a wider range of possible outcomes, including losses', 'are illegal for students', 'cannot fall below their purchase price'], 1, 'More risk means more uncertainty — good and bad outcomes.', { concept: 'risk-return' }),
      numQ('e8', 'An investment falls 25%. What percentage gain is needed to recover?', 33.33, '£100 → £75; needs £25 ÷ £75 ≈ 33.3%.', { suffix: '%', tolerance: 0.1, concept: 'risk-return' }),
      orderQ('e9', 'Order from most to least liquid.', ['Cash', 'Large listed company shares', 'Residential property'], 'Cash is instant, listed shares sell in seconds, property takes months.', { concept: 'liquidity' }),
      mcqQ('e10', 'Owning 200 companies instead of one mainly reduces…', ['market risk', 'company-specific risk', 'inflation', 'all risk'], 1, 'Diversification dilutes specific risk.', { concept: 'diversification-basics' }),
      tfQ('e11', 'An investor focuses mainly on what an asset will produce over time; a speculator focuses on short-term price moves.', true, 'That is the core distinction.', { concept: 'speculation' }),
      mcqQ('e12', 'Which asset class is most associated with ownership of businesses?', ['Bonds', 'Equities', 'Commodities', 'Cash'], 1, 'Equities (shares or stocks) are ownership stakes.', { concept: 'asset-classes' }),
      numQ('e13', 'Fund A returns 6% gross with a 0.2% fee; Fund B returns 6% gross with a 1.2% fee. By how many percentage points is A’s net return higher?', 1, '5.8% − 4.8% = 1 percentage point.', { suffix: 'pp', tolerance: 0.01, concept: 'investment-costs' }),
      mcqQ('e14', 'Which is the most reliable conclusion from a fund’s excellent return last year?', ['It will repeat this year', 'It tells you little on its own about future returns', 'It is now risk-free', 'Its fees must be low'], 1, 'Past performance alone is not a reliable predictor.', { concept: 'misconceptions' }),
      tfQ('e15', 'A long time horizon guarantees you will not lose money in shares.', false, 'It lowers the chance of being forced to sell in a slump, but losses remain possible.', { concept: 'time-horizon' }),
    ],
  },
})
