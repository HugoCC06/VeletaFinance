import { course, diagram, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, recap, text, tf, tfQ, ukus, warn, analogy } from '../builders'

const whatIsAShare = lesson(
  {
    title: 'What a share really is',
    description: 'Owning a slice of a real business.',
    objectives: ['Explain what owning a share means', 'Describe shareholders’ main rights', 'Calculate an ownership percentage'],
    tags: ['shares-basics'],
  },
  [
    text(
      'A slice of the company',
      'A company’s ownership is divided into units called **shares** (in the US, usually **stock**). If a company has 1,000,000 shares and you own 1,000, you own 0.1% of it.\n\nThat slice entitles you to a proportional share of the company’s future profits — paid out as dividends or reinvested to grow the business.',
    ),
    num('q1', 'A company has 2,000,000 shares. You own 5,000. What percentage of the company do you own?', 0.25, '5,000 ÷ 2,000,000 = 0.0025 = 0.25%.', { suffix: '%', tolerance: 0.001, working: '5,000 ÷ 2,000,000 × 100 = 0.25%' }),
    key(
      'What shareholders usually get',
      '- A claim on profits, through **dividends** if the board declares them.\n- **Voting rights** on major decisions, such as electing directors (for ordinary shares).\n- **Limited liability**: you can lose what you invested, but you are not personally responsible for the company’s debts.',
    ),
    tf('q2', 'If a company you hold shares in goes bankrupt, creditors can demand that you personally repay its debts.', false, 'False. Shareholders have limited liability — the most you can lose is the money you invested in the shares.'),
    analogy('A pizza, not a lottery ticket', 'Think of the company as a pizza that (hopefully) grows. Your shares are your slices. Whether the pizza gets bigger depends on how well the business performs, not on luck alone.'),
    multi(
      'q3',
      'Which are usual rights of an ordinary shareholder? Select all that apply.',
      ['Voting at the annual general meeting', 'A guaranteed yearly dividend', 'A proportional claim on profits', 'Limited liability'],
      [0, 2, 3],
      'Dividends are never guaranteed — the board decides whether to pay them. Voting, a claim on profits and limited liability are standard.',
      { final: true },
    ),
    recap('A share is a unit of ownership in a company.', 'Shareholders have a claim on profits, usually voting rights and limited liability.', 'Dividends are discretionary, not guaranteed.'),
  ],
)

const whyIssueShares = lesson(
  {
    title: 'Why companies sell shares',
    description: 'Raising money, IPOs and the primary and secondary markets.',
    objectives: ['Explain why companies issue shares', 'Describe an IPO', 'Distinguish primary and secondary markets'],
    tags: ['primary-secondary'],
  },
  [
    text(
      'Raising capital',
      'Companies need money — **capital** — to build factories, hire people or develop products. They can borrow it (debt) or sell ownership (equity).\n\nSelling shares means the company does not have to repay the money or pay interest, but existing owners give up part of their ownership and future profits.',
    ),
    key('Initial public offering', 'An **IPO** (initial public offering, also called a *flotation* or *listing* in the UK) is when a company first sells shares to the public and lists them on a stock exchange.'),
    diagram(
      {
        type: 'flow',
        nodes: [
          { label: 'Primary market', sub: 'Company sells new shares to investors; money goes to the company', tone: 'violet' },
          { label: 'Secondary market', sub: 'Investors trade existing shares with each other; the company receives nothing', tone: 'mint' },
        ],
      },
      'Most everyday trading happens in the secondary market.',
    ),
    mcq('q1', 'You buy 10 shares of a well-established listed company through an app. Who most likely receives your money?', ['The company', 'Another investor selling those shares', 'The stock exchange', 'The government'], 1, 'This is a secondary-market trade: you buy existing shares from another investor. The company only receives money when it issues new shares.'),
    tf('q2', 'In an IPO, the company (and any selling existing owners) receive the money investors pay for the shares offered.', true, 'True. An IPO is a primary-market transaction: new shares sold by the company raise money for it, and existing owners may also sell some of their shares.'),
    mcq(
      'q3',
      'Why might a fast-growing company choose to sell shares rather than borrow?',
      ['Shares must be repaid with interest', 'Selling shares avoids fixed repayments while the business is still growing', 'Borrowing is illegal for companies', 'Shares give the company voting rights over investors'],
      1,
      'Debt requires interest and repayment whatever happens. Equity has no fixed repayment, which suits companies with uncertain or reinvested cash flows — at the cost of diluting existing owners.',
      { final: true },
    ),
    recap('Companies raise capital through debt or equity.', 'An IPO is a company’s first sale of shares to the public.', 'Primary market: company sells new shares. Secondary market: investors trade with each other.'),
  ],
)

const exchanges = lesson(
  {
    title: 'How stock exchanges work',
    description: 'Where buyers meet sellers — in London, New York and beyond.',
    objectives: ['Describe what a stock exchange does', 'Name major UK and US exchanges', 'Explain trading sessions and liquidity'],
    tags: ['exchanges'],
    sources: [
      { label: 'London Stock Exchange — trading hours (08:00–16:30 UK time continuous trading)', url: 'https://www.londonstockexchange.com/' },
      { label: 'NYSE — core trading session 9:30am–4:00pm ET', url: 'https://www.nyse.com/markets/hours-calendars' },
    ],
  },
  [
    text(
      'A marketplace with rules',
      'A **stock exchange** is a regulated marketplace where buyers and sellers of shares are matched. It sets listing rules, publishes prices and makes trading fair and transparent.\n\nToday almost all trading is electronic: orders arrive from brokers and are matched by computers in fractions of a second.',
    ),
    ukus(
      'Major exchanges',
      '**UK:** the London Stock Exchange (LSE), home to its Main Market and AIM, a market for smaller growing companies.\n\n**US:** the New York Stock Exchange (NYSE) and Nasdaq are the two largest exchanges.',
    ),
    numbers(
      'Regular trading sessions (local time)',
      [
        ['London Stock Exchange', '08:00 – 16:30 UK time'],
        ['NYSE and Nasdaq', '09:30 – 16:00 US Eastern Time'],
      ],
      'Opening and closing auctions, early closes and public holidays vary. Check the exchange calendar for exact dates.',
    ),
    mcq('q1', 'It is 10:00 in London on a normal weekday. Which regular session is open?', ['Only New York', 'Only London', 'Both', 'Neither'], 1, 'At 10:00 UK time it is usually 05:00 in New York, before the 09:30 Eastern open. London has been open since 08:00.'),
    key('Liquidity in markets', 'A share is **liquid** when there are many buyers and sellers, so you can trade quickly at a price close to the last one. Large companies are highly liquid. Small companies may trade rarely, so buying or selling can move the price.'),
    tf('q2', 'Shares in very small companies can be harder to sell quickly at a fair price than shares in large companies.', true, 'True. Fewer buyers and sellers means lower liquidity, wider spreads and bigger price moves when you trade.'),
    match(
      'q3',
      'Match each term with its meaning.',
      [
        ['Exchange', 'Regulated marketplace matching buyers and sellers'],
        ['Broker', 'Firm that passes your orders to the market'],
        ['Listing', 'Admission of a company’s shares to trade on an exchange'],
      ],
      'You place orders with a broker (often via an app), which routes them to an exchange where listed shares trade.',
      { final: true },
    ),
    recap('Exchanges are regulated marketplaces that match orders electronically.', 'The LSE, NYSE and Nasdaq are major UK and US exchanges with different trading hours.', 'Liquidity determines how easily you can trade without moving the price.'),
  ],
)

const marketCap = lesson(
  {
    title: 'Share price and market capitalisation',
    description: 'Why a £2 share is not “cheaper” than a £200 share.',
    objectives: ['Calculate market capitalisation', 'Explain why share price alone says little about value', 'Compare companies by size'],
    tags: ['market-cap'],
  },
  [
    text(
      'The size of the whole company',
      '**Market capitalisation** (market cap) is the total market value of a company’s shares:\n\n**Market cap = share price × number of shares outstanding.**\n\nIt tells you what the stock market currently values the whole company’s equity at.',
    ),
    num('q1', 'A company has 120 million shares priced at £3.50. What is its market capitalisation in £ millions?', 420, '120m × £3.50 = £420m.', { prefix: '£', suffix: 'm', tolerance: 0.5, working: '120,000,000 × £3.50 = £420,000,000' }),
    example('Cheap-looking prices', 'Company A’s shares cost £2 and it has 1 billion shares: market cap £2bn. Company B’s shares cost £200 and it has 5 million shares: market cap £1bn.\n\nA has the *lower* share price but is the *larger* company. Price per share depends on how many slices the pizza is cut into.'),
    tf('q2', 'A share priced at 50p is cheaper — better value — than a share priced at £50.', false, 'False. Price per share tells you nothing about value on its own. You need to compare the price with what each share gives you a claim to, such as earnings or assets.'),
    key('Size categories', 'Investors often group companies as **large-cap**, **mid-cap** and **small-cap**. The cut-offs are not universal: different index providers use different definitions, and they shift as markets grow.'),
    order('q3', 'Order these companies by market cap, largest first.', ['10bn shares at $1', '200m shares at $25', '1m shares at $1,000'], '$10bn, then $5bn, then $1bn — notice the highest share price belongs to the smallest company.', { final: true }),
    recap('Market cap = share price × shares outstanding.', 'A low share price does not mean a company is cheap or small.', 'Size categories (large/mid/small cap) vary by provider.'),
  ],
)

const bidAsk = lesson(
  {
    title: 'Bid, ask and the spread',
    description: 'The two prices behind every quote.',
    objectives: ['Define bid and ask prices', 'Calculate the bid–ask spread', 'Explain why spreads are a trading cost'],
    tags: ['bid-ask'],
    difficulty: 2,
  },
  [
    text(
      'Two prices, not one',
      'At any moment a share has:\n\n- a **bid** — the highest price a buyer is currently willing to pay, and\n- an **ask** (or *offer*) — the lowest price a seller is currently willing to accept.\n\nThe gap between them is the **spread**. If you buy immediately you pay the ask; if you sell immediately you receive the bid.',
    ),
    diagram({ type: 'ladder', currency: 'p', bids: [[100, 1200], [99, 3000], [98, 5200]], asks: [[101, 900], [102, 2500], [103, 4100]] }, 'A simplified order book: price levels in pence with the number of shares wanted or offered.', 'Order book'),
    mcq('q1', 'Using the order book above, what would you pay per share to buy 500 shares immediately?', ['98p', '100p', '101p', '103p'], 2, 'An immediate buy takes the lowest ask: 101p. 900 shares are offered there, enough for 500.'),
    num('q2', 'What is the spread in pence between the best bid and best ask above?', 1, 'Best ask 101p − best bid 100p = 1p.', { suffix: 'p', tolerance: 0 }),
    key('Spreads are a cost', 'If you bought at 101p and immediately sold at 100p, you would lose 1p per share without the price “moving”. That is roughly 1% here. Large, liquid shares often have tiny spreads; small, rarely traded shares can have wide ones.'),
    tf('q3', 'Spreads tend to be narrower for heavily traded large-company shares than for thinly traded small-company shares.', true, 'True. More competing buyers and sellers squeeze the gap between bid and ask.', { final: true }),
    recap('Bid: best price buyers offer. Ask: best price sellers accept.', 'Buy now → pay the ask; sell now → receive the bid.', 'The spread is a hidden trading cost, larger in less liquid shares.'),
  ],
)

const orders = lesson(
  {
    title: 'Market orders and limit orders',
    description: 'Choosing between speed and price control.',
    objectives: ['Distinguish market and limit orders', 'Predict how each order type executes', 'Choose an appropriate order type'],
    tags: ['order-types'],
    difficulty: 2,
  },
  [
    text(
      'Two common instructions',
      'A **market order** says “buy (or sell) now at the best available price.” It prioritises speed; the exact price is not guaranteed.\n\nA **limit order** says “buy only at this price or lower” (or “sell only at this price or higher”). It controls the price, but might never be filled.',
    ),
    diagram(
      { type: 'compare', columns: [
        { title: 'Market order', tone: 'violet', points: ['Executes almost immediately (in liquid markets)', 'Price can differ from the last quote', 'Risky in thin or fast-moving markets'] },
        { title: 'Limit order', tone: 'mint', points: ['You set the worst acceptable price', 'May fill partly or not at all', 'Useful for less liquid shares'] },
      ] },
    ),
    mcq('q1', 'A share’s best ask is $50.20. You place a limit order to buy at $50.00. What happens immediately?', ['It fills at $50.20', 'It fills at $50.00', 'It waits in the order book until a seller accepts $50.00 or less', 'It is cancelled'], 2, 'Your limit is below the best ask, so no seller matches yet. The order rests in the book until the price comes to you — or never does.'),
    tf('q2', 'A market order to sell guarantees the price you saw on screen.', false, 'False. A market order executes at the best available bid when it reaches the market, which can differ from the last quote — especially if the price is moving fast or liquidity is thin.'),
    warn('Price moves fast', 'When prices are moving quickly, the quote you see can be out of date. Many brokers show warnings for market orders on less liquid shares or outside normal hours.'),
    match(
      'q3',
      'Match each situation with the more suitable order type.',
      [
        ['A rarely traded small company with a wide spread', 'Limit order'],
        ['A huge, heavily traded company and you must sell today', 'Market order'],
      ],
      'Limit orders protect you from bad prices in illiquid shares. In very liquid shares, a market order usually fills close to the quote.',
      { final: true },
    ),
    recap('Market order: speed first, price not guaranteed.', 'Limit order: price control, execution not guaranteed.', 'Limit orders are useful for illiquid or volatile shares.'),
  ],
)

const priceVsValue = lesson(
  {
    title: 'Why prices move — and price versus value',
    description: 'Supply, demand, expectations and the idea of intrinsic value.',
    objectives: ['Explain how supply and demand set prices', 'Identify reasons share prices change', 'Distinguish price from intrinsic value'],
    tags: ['price-vs-value'],
    difficulty: 2,
  },
  [
    text(
      'Supply, demand and expectations',
      'In the short run, a share’s price moves because more people want to buy than sell (price rises) or more want to sell than buy (price falls).\n\nWhat changes their minds? News about profits, interest rates, the economy, competitors, management — and plain mood. Prices move on *changes in expectations*, not just on facts.',
    ),
    example('Good news, falling price', 'A company reports profits up 10%. Investors had expected 20%. The share price falls. The news was good, but worse than what was already “priced in”.'),
    mcq('q1', 'A retailer announces higher profits, yet its share price drops. What is the most likely explanation?', ['Stock exchanges reverse good news', 'Results were below what investors expected', 'Higher profits are bad for shareholders', 'Share prices only follow interest rates'], 1, 'Prices reflect expectations. Results that fall short of what was priced in can push the price down even when they are “good”.'),
    key('Price versus intrinsic value', '**Price** is what you pay today. **Intrinsic value** is an estimate of what the business is really worth, based on the cash it can generate in the future.\n\nThe two can differ, sometimes for long periods. Intrinsic value is an *estimate*, so reasonable people disagree about it.'),
    multi('q2', 'Which could change a company’s share price? Select all that apply.', ['Its quarterly results', 'A change in interest rates', 'A competitor launching a better product', 'Investor mood and market sentiment'], [0, 1, 2, 3], 'All of these change what investors expect or how they feel, which shifts supply and demand.'),
    tf('q3', 'A share’s market price always equals its intrinsic value.', false, 'False. Price is set by trading; intrinsic value is an estimate of the business’s worth. Gaps between them are what value investors look for — though their estimates can be wrong.', { final: true }),
    recap('Short-term prices are set by supply and demand.', 'Prices react to changes in expectations, not just news.', 'Price is what you pay; intrinsic value is an estimate of what the business is worth.'),
  ],
)

const dividendsSplits = lesson(
  {
    title: 'Dividends and stock splits',
    description: 'Cash payouts, key dates and why splits don’t create value.',
    objectives: ['Explain how dividends are paid', 'Define the ex-dividend date', 'Explain the effect of a stock split'],
    tags: ['dividends-splits'],
  },
  [
    text(
      'Sharing the profits',
      'A **dividend** is a cash payment from a company to its shareholders, usually from profits. Many UK companies pay twice a year (an interim and a final dividend); many US companies pay quarterly.\n\nDividends are decided by the board and can be raised, cut or cancelled.',
    ),
    key('The ex-dividend date', 'To receive a dividend you must own the share **before** its **ex-dividend date**. Buy on or after that date and the seller gets the dividend instead. On the ex-date the share price typically drops by roughly the dividend amount.'),
    tf('q1', 'If you buy a share on its ex-dividend date, you will receive the upcoming dividend.', false, 'False. Buyers on or after the ex-dividend date do not receive that dividend; it goes to whoever owned the share before.'),
    num('q2', 'You own 400 shares. The company pays a dividend of 12p per share. How much do you receive in pounds?', 48, '400 × £0.12 = £48.', { prefix: '£', tolerance: 0.01 }),
    key('Stock splits', 'In a **2-for-1 split**, every share becomes two, and the price roughly halves. You own twice as many shares worth half as much each — the total value and the company’s market cap are unchanged. Companies sometimes split to make the share price look more accessible.'),
    num('q3', 'You own 30 shares priced at $300. After a 3-for-1 split, how many shares do you own?', 90, 'Each share becomes three: 30 × 3 = 90 shares, each worth about $100. Your total stays about $9,000.', { suffix: 'shares' }),
    tf('q4', 'A stock split makes the company more valuable.', false, 'False. A split just cuts the same pizza into more slices. Market capitalisation is unchanged by the split itself.', { final: true }),
    recap('Dividends are discretionary cash payments to shareholders.', 'Own the share before the ex-dividend date to receive the dividend.', 'Splits change the number of shares and price per share, not the total value.'),
  ],
)

const indices = lesson(
  {
    title: 'Market indices',
    description: 'FTSE 100, S&P 500, Nasdaq and how indices summarise markets.',
    objectives: ['Explain what a market index is', 'Describe major UK and US indices', 'Distinguish market-cap and price weighting'],
    tags: ['indices'],
    sources: [
      { label: 'FTSE Russell — FTSE 100 index methodology', url: 'https://www.lseg.com/en/ftse-russell/indices/uk' },
      { label: 'S&P Dow Jones Indices — S&P 500 and Dow Jones Industrial Average methodologies', url: 'https://www.spglobal.com/spdji/' },
      { label: 'Nasdaq — Nasdaq-100 index methodology', url: 'https://www.nasdaq.com/' },
    ],
  },
  [
    text(
      'A thermometer for the market',
      'A **market index** tracks the performance of a group of shares, so you can see how “the market” or a slice of it is doing with one number. Indices are also the basis for index funds.',
    ),
    ukus(
      'The headline indices',
      '- **FTSE 100**: the 100 largest eligible companies listed on the London Stock Exchange by market cap.\n- **FTSE 250**: the next 250, more focused on UK mid-sized companies.\n- **S&P 500**: about 500 leading large US companies, chosen by a committee.\n- **Nasdaq-100**: 100 of the largest non-financial companies listed on Nasdaq.\n- **Dow Jones Industrial Average**: 30 large US companies.',
    ),
    key('Weighting', 'Most major indices are **market-cap weighted**: bigger companies have more influence. The Dow is unusual: it is **price-weighted**, so a company with a higher share price moves it more, regardless of the company’s size.'),
    mcq('q1', 'In a market-cap-weighted index, which company moves the index most if all their prices rise 5%?', ['The one with the highest share price', 'The one with the largest market capitalisation', 'The one listed most recently', 'They all have equal effect'], 1, 'Weights are proportional to market cap, so the largest company has the biggest effect.'),
    match('q2', 'Match each index with its description.', [['FTSE 100', '100 largest eligible LSE-listed companies'], ['S&P 500', 'About 500 leading US large companies'], ['Dow Jones Industrial Average', '30 US companies, price-weighted']], 'Each index answers a different question about the market.'),
    warn('UK index ≠ UK economy', 'Many FTSE 100 companies earn most of their revenue overseas, so the index does not simply reflect the UK economy. Similarly, the S&P 500 includes companies with large international sales.'),
    tf('q3', 'You can invest in an index directly, like buying a share.', false, 'False. An index is just a calculation. To get its returns you buy a fund or ETF that tracks it — and you pay that fund’s costs.', { final: true }),
    recap('Indices summarise the performance of a group of shares.', 'FTSE 100/250 cover the UK; S&P 500, Nasdaq-100 and the Dow cover the US.', 'Most indices are market-cap weighted; the Dow is price-weighted.'),
  ],
)

const bullBear = lesson(
  {
    title: 'Bull markets, bear markets and volatility',
    description: 'The language of market moods — and what volatility really means.',
    objectives: ['Define bull and bear markets', 'Explain volatility', 'Interpret a percentage drawdown'],
    tags: ['market-cycles'],
  },
  [
    text(
      'Bulls and bears',
      'A **bull market** is a sustained period of rising prices; a **bear market** is a sustained fall. A widely used rule of thumb calls a fall of **20% or more** from a recent high a bear market, and a fall of 10% a **correction**. These are conventions, not official rules.',
    ),
    num('q1', 'An index peaks at 8,000 and falls to 6,200. By how many percent has it fallen from the peak?', 22.5, '(8,000 − 6,200) ÷ 8,000 = 1,800 ÷ 8,000 = 22.5% — bear-market territory by the common 20% convention.', { suffix: '%', tolerance: 0.05 }),
    diagram({ type: 'line', datasetId: 'synthetic-index' }, 'Synthetic illustrative index — not real market history. Notice the rising trend punctuated by sharp falls.', 'Bulls and bears'),
    key('Volatility', '**Volatility** measures how much prices swing. It is often expressed as the standard deviation of returns. High volatility means wider swings in both directions — it is not the same as losing money, but it makes outcomes less predictable.'),
    tf('q2', 'A highly volatile share is certain to lose money.', false, 'False. Volatility describes the size of price swings, up and down. A volatile share may rise a lot or fall a lot.'),
    mcq('q3', 'Which statement about bear markets is most accurate?', ['They are impossible to recover from', 'They have happened repeatedly, and their timing and length are hard to predict', 'They always last exactly one year', 'They only affect small companies'], 1, 'Bear markets are a recurring feature of markets. Some recover quickly, others take years. Their timing is notoriously hard to predict.', { final: true }),
    recap('Bull market: sustained rise. Bear market: commonly a 20%+ fall from a high.', 'Volatility is the size of price swings, not a guaranteed loss.', 'Market cycles are normal but unpredictable.'),
  ],
)

const ukVsUs = lesson(
  {
    title: 'UK and US markets, pounds and dollars',
    description: 'Pence quotes, stamp duty, settlement and currency exposure.',
    objectives: ['Recognise key differences between UK and US markets', 'Explain currency exposure', 'Calculate a return after a currency move'],
    tags: ['uk-us-markets', 'currency'],
    difficulty: 2,
    sources: [
      { label: 'GOV.UK — Stamp Duty Reserve Tax on shares (0.5%)', url: 'https://www.gov.uk/tax-buy-shares' },
      { label: 'SEC — shortening the securities settlement cycle to T+1 (effective 28 May 2024)', url: 'https://www.sec.gov/' },
    ],
  },
  [
    ukus(
      'Practical differences',
      '- **Quotes:** many UK share prices are quoted in **pence** (GBX), e.g. 250p = £2.50. US prices are quoted in dollars.\n- **Stamp duty:** buying most UK-listed company shares incurs a 0.5% tax (Stamp Duty or SDRT); there are exemptions, such as shares on AIM. The US has no equivalent federal tax on buying shares.\n- **Settlement:** US trades have settled one business day after the trade (T+1) since May 2024; UK trades settle on T+2, with a move to T+1 planned.\n- **Language:** shares ↔ stocks, ordinary shares ↔ common stock, flotation ↔ IPO.',
    ),
    num('q1', 'A UK share is quoted at 345p. What is that in pounds?', 3.45, '100p = £1, so 345p = £3.45.', { prefix: '£', tolerance: 0.001 }),
    key('Currency exposure', 'If you invest in US shares with pounds, your return depends on two things: the share’s return **in dollars** and the change in the **GBP/USD exchange rate**. If the dollar weakens against the pound, your US investment is worth fewer pounds.'),
    example('Two moves combined', 'A US share rises 10% in dollars. Over the same period the dollar falls 5% against the pound.\n\nReturn in pounds ≈ 1.10 × 0.95 − 1 = **4.5%**.'),
    num('q2', 'A US share rises 10% in dollars while the dollar strengthens 5% against the pound. What is the return for a UK investor in pounds?', 15.5, '1.10 × 1.05 − 1 = 0.155 = 15.5%. A stronger dollar adds to returns for a pound-based investor.', { suffix: '%', tolerance: 0.05, working: '1.10 × 1.05 = 1.155 → 15.5%' }),
    tf('q3', 'A UK investor in US shares can lose money in pounds even if the shares rise in dollars.', true, 'True — if the dollar falls against the pound by more than the shares rise.'),
    mcq(
      'q4',
      'A US investor buys a FTSE 100 fund priced in pounds. Which change would hurt their return in dollars?',
      ['The pound strengthening against the dollar', 'The pound weakening against the dollar', 'UK stamp duty being abolished', 'The fund’s shares rising in pounds'],
      1,
      'For a dollar-based investor, holding pound assets means a weaker pound converts into fewer dollars.',
      { final: true },
    ),
    recap('UK prices are often quoted in pence; UK share purchases usually incur 0.5% stamp duty.', 'Foreign investments carry currency exposure.', 'Return in your currency ≈ (1 + local return) × (1 + currency change) − 1.'),
  ],
)

export const c2 = course({
  id: 'c2',
  slug: 'stocks-and-markets',
  title: 'Understanding Stocks and Stock Markets',
  tagline: 'What you actually own — and how markets set prices.',
  description: 'Learn what shares are, how exchanges in London and New York work, how orders get filled, what moves prices, and how currency affects your returns.',
  colour: 'violet',
  icon: 'chart',
  outcomes: [
    'Explain what a share represents and why companies issue them',
    'Interpret bid and ask prices, market capitalisation and order types',
    'Describe major UK and US exchanges and indices',
    'Explain why prices change and how currency affects international returns',
  ],
  units: [
    {
      title: 'Owning a piece of a company',
      description: 'Shares, IPOs and how exchanges work.',
      lessons: [whatIsAShare, whyIssueShares, exchanges],
      checkpoint: {
        concept: 'shares-basics',
        questions: [
          numQ('c1', 'A company has 50 million shares. You own 100,000. What percentage do you own?', 0.2, '100,000 ÷ 50,000,000 = 0.2%.', { suffix: '%', tolerance: 0.001, concept: 'shares-basics' }),
          tfQ('c2', 'Ordinary shareholders are guaranteed a dividend each year.', false, 'Dividends are at the board’s discretion.', { concept: 'shares-basics' }),
          mcqQ('c3', 'In which market does a company receive money from investors?', ['Primary market', 'Secondary market', 'Both equally', 'Neither'], 0, 'New shares are sold in the primary market.', { concept: 'primary-secondary' }),
          mcqQ('c4', 'What is an IPO?', ['A company’s first sale of shares to the public', 'A type of bond', 'A dividend payment', 'A stock split'], 0, 'Initial public offering.', { concept: 'primary-secondary' }),
          mcqQ('c5', 'Regular trading on the NYSE runs…', ['08:00–16:30 UK time', '09:30–16:00 US Eastern Time', '24 hours a day', '10:00–15:00 US Eastern Time'], 1, 'The NYSE core session is 9:30am–4:00pm ET.', { concept: 'exchanges' }),
          tfQ('c6', 'Shares that trade rarely are said to be highly liquid.', false, 'Rare trading means low liquidity.', { concept: 'exchanges' }),
        ],
      },
    },
    {
      title: 'Prices and orders',
      description: 'Market cap, spreads, order types and what moves prices.',
      lessons: [marketCap, bidAsk, orders, priceVsValue],
      checkpoint: {
        concept: 'market-cap',
        questions: [
          numQ('c1', 'A company has 400 million shares at $12.50. What is its market cap in $ billions?', 5, '400m × $12.50 = $5bn.', { prefix: '$', suffix: 'bn', tolerance: 0.01, concept: 'market-cap' }),
          tfQ('c2', 'A lower share price means a company is smaller.', false, 'Size depends on price × number of shares.', { concept: 'market-cap' }),
          mcqQ('c3', 'Best bid 248p, best ask 250p. You sell immediately. What price per share do you receive?', ['248p', '249p', '250p', 'It depends on yesterday’s close'], 0, 'Immediate sells receive the best bid.', { concept: 'bid-ask' }),
          mcqQ('c4', 'Which order type guarantees you will not pay more than a set price?', ['Market order', 'Limit order', 'Both', 'Neither'], 1, 'A buy limit order caps the price you pay, but may not fill.', { concept: 'order-types' }),
          tfQ('c5', 'Share prices can fall after good news if the news was less good than expected.', true, 'Prices move on surprises versus expectations.', { concept: 'price-vs-value' }),
          mcqQ('c6', 'Intrinsic value is best described as…', ['The last traded price', 'An estimate of what a business is worth based on its future cash flows', 'The price at the IPO', 'The book value printed on the share certificate'], 1, 'It is an estimate, so it varies between analysts.', { concept: 'price-vs-value' }),
        ],
      },
    },
    {
      title: 'Market life',
      description: 'Dividends, splits, indices, cycles and currencies.',
      lessons: [dividendsSplits, indices, bullBear, ukVsUs],
      checkpoint: {
        concept: 'indices',
        questions: [
          numQ('c1', 'You own 250 shares and the company pays 40 cents per share. How many dollars do you receive?', 100, '250 × $0.40 = $100.', { prefix: '$', tolerance: 0.01, concept: 'dividends-splits' }),
          mcqQ('c2', 'After a 2-for-1 split, what happens to the company’s market cap (all else equal)?', ['It doubles', 'It halves', 'It stays the same', 'It falls to zero'], 2, 'Splits do not change total value.', { concept: 'dividends-splits' }),
          mcqQ('c3', 'Which index is price-weighted?', ['FTSE 100', 'S&P 500', 'Dow Jones Industrial Average', 'FTSE 250'], 2, 'The Dow is price-weighted.', { concept: 'indices' }),
          numQ('c4', 'An index falls from 5,000 to 4,000. What is the percentage fall?', 20, '1,000 ÷ 5,000 = 20%.', { suffix: '%', tolerance: 0.05, concept: 'market-cycles' }),
          numQ('c5', 'A US share returns 20% in dollars while the dollar falls 10% against the pound. What is the return in pounds?', 8, '1.20 × 0.90 − 1 = 8%.', { suffix: '%', tolerance: 0.05, concept: 'currency' }),
          tfQ('c6', 'Most UK share purchases incur 0.5% stamp duty.', true, 'Stamp Duty/SDRT of 0.5% applies to most UK share purchases, with exemptions such as AIM shares.', { concept: 'uk-us-markets' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'shares-basics',
    questions: [
      mcqQ('e1', 'Owning a share means you…', ['have lent money to the company', 'own part of the company', 'are an employee', 'are guaranteed dividends'], 1, 'A share is an ownership stake.', { concept: 'shares-basics' }),
      tfQ('e2', 'Shareholders’ losses are limited to the amount invested.', true, 'Limited liability.', { concept: 'shares-basics' }),
      mcqQ('e3', 'You buy shares of a listed company from another investor. This is a…', ['primary-market trade', 'secondary-market trade', 'bond issue', 'rights issue'], 1, 'Investor-to-investor trading is the secondary market.', { concept: 'primary-secondary' }),
      mcqQ('e4', 'Which is a UK market for smaller growing companies?', ['Nasdaq', 'AIM', 'NYSE', 'Dow'], 1, 'AIM is the LSE’s growth market.', { concept: 'exchanges' }),
      numQ('e5', 'A company has 80 million shares at £2.25. What is its market cap in £ millions?', 180, '80m × £2.25 = £180m.', { prefix: '£', suffix: 'm', tolerance: 0.1, concept: 'market-cap' }),
      numQ('e6', 'Best bid $19.96, best ask $20.04. What is the spread in cents?', 8, '$20.04 − $19.96 = $0.08 = 8 cents.', { suffix: 'cents', tolerance: 0.01, concept: 'bid-ask' }),
      mcqQ('e7', 'Which order could remain unfilled?', ['A market order in a liquid share', 'A limit order priced away from the market', 'Both always fill', 'Neither can fill'], 1, 'Limit orders only fill at the limit price or better.', { concept: 'order-types' }),
      tfQ('e8', 'Price and intrinsic value can differ for long periods.', true, 'Markets can misprice, and value estimates differ.', { concept: 'price-vs-value' }),
      tfQ('e9', 'To receive a dividend you must buy the share on or after its ex-dividend date.', false, 'You must own it before the ex-date.', { concept: 'dividends-splits' }),
      numQ('e10', 'You hold 12 shares at £150. After a 5-for-1 split, roughly what is each share’s price?', 30, '£150 ÷ 5 = £30, and you hold 60 shares.', { prefix: '£', tolerance: 0.01, concept: 'dividends-splits' }),
      mcqQ('e11', 'In a market-cap-weighted index, influence depends on…', ['share price', 'company market cap', 'age of company', 'alphabetical order'], 1, 'Bigger market cap, bigger weight.', { concept: 'indices' }),
      mcqQ('e12', 'A common rule of thumb for a bear market is a fall of at least…', ['5%', '10%', '20%', '50%'], 2, 'A 20% fall from a recent high.', { concept: 'market-cycles' }),
      tfQ('e13', 'Volatility measures how much prices swing, not whether you will make or lose money.', true, 'Volatility describes the size of moves in both directions.', { concept: 'market-cycles' }),
      numQ('e14', 'A US share returns 5% in dollars and the dollar rises 10% against the pound. What is the return in pounds?', 15.5, '1.05 × 1.10 − 1 = 15.5%.', { suffix: '%', tolerance: 0.05, concept: 'currency' }),
      multiQ('e15', 'Which are differences between UK and US share trading? Select all that apply.', ['Many UK prices are quoted in pence', 'UK share purchases usually incur stamp duty', 'US shares cannot pay dividends', 'US regular trading runs 09:30–16:00 Eastern'], [0, 1, 3], 'US companies can and do pay dividends.', { concept: 'uk-us-markets' }),
    ],
  },
})

