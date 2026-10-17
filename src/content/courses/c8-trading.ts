import { analogy, course, diagram, example, key, lesson, match, mcq, mcqQ, multi, multiQ, num, numQ, numbers, recap, text, tf, tfQ, warn } from '../builders'

const investVsTrade = lesson(
  {
    title: 'Investing versus trading',
    description: 'Different time horizons, different games.',
    objectives: ['Distinguish investing from trading', 'Describe common trading time horizons', 'Explain why costs matter more for frequent traders'],
    tags: ['trading-basics'],
  },
  [
    text(
      'Holding versus flipping',
      '**Investors** typically buy and hold for years, aiming to benefit from businesses growing and paying out profits. **Traders** buy and sell over shorter periods — from minutes to months — aiming to profit from price movements.\n\nNeither is automatically wrong, but they require different skills and carry different risks.',
    ),
    match('q1', 'Match each trading style with its typical holding period.', [['Day trading', 'Minutes to hours, closed by day’s end'], ['Swing trading', 'Days to weeks'], ['Position trading', 'Weeks to months'], ['Long-term investing', 'Years to decades']], 'The shorter the horizon, the more trades — and the more costs and decisions.'),
    key('Costs multiply with activity', 'Every trade incurs costs: commissions, the bid–ask spread, sometimes currency fees and taxes (such as 0.5% UK stamp duty on most share purchases). Frequent trading multiplies these costs.'),
    num('q2', 'A trader makes 50 round trips (buy and sell) a year, each costing 0.3% of the position in spreads and fees. Roughly what total cost is that, as a percentage of a fully invested account?', 15, '50 × 0.3% = 15% a year — a large hurdle before any profit.', { suffix: '%', tolerance: 0.05 }),
    tf('q3', 'Short-term trading is a reliable way for beginners to make money quickly.', false, 'False. Studies of retail day traders have generally found that most lose money after costs. Short-term trading is highly competitive and risky.', { final: true }),
    recap('Investing: long horizons, owning businesses. Trading: shorter horizons, price moves.', 'Trading styles range from day trading to position trading.', 'Costs compound with every trade.'),
  ],
)

const candlesticks = lesson(
  {
    title: 'Reading charts: OHLC, candlesticks and volume',
    description: 'The anatomy of a price chart.',
    objectives: ['Read OHLC data', 'Interpret a candlestick', 'Explain what volume shows'],
    tags: ['candlesticks'],
    difficulty: 2,
  },
  [
    text(
      'Four prices per period',
      'Price charts often summarise each period (a day, an hour) with four numbers — **OHLC**:\n\n- **Open**: first traded price\n- **High**: highest price\n- **Low**: lowest price\n- **Close**: last traded price',
    ),
    diagram({ type: 'candles', datasetId: 'synthetic-ohlc', overlay: 'none' }, 'Synthetic illustrative data — not a real share. Rising candles are shown filled in mint, falling candles in coral, with a text label on hover.', 'Candlestick chart'),
    key('Candlesticks', 'Each **candle** has a **body** from open to close and **wicks** (shadows) reaching to the high and low. A rising candle (close above open) and a falling candle (close below open) are shown in different styles.'),
    num('q1', 'A day’s candle has open 100, high 108, low 97 and close 105. What is the day’s high–low range?', 11, '108 − 97 = 11.', { tolerance: 0 }),
    mcq('q2', 'For the same candle, which statement is true?', ['It is a falling candle', 'It is a rising candle with a body from 100 to 105', 'The body runs from 97 to 108', 'The close was the day’s low'], 1, 'Close (105) is above open (100), so it is a rising candle. The body spans open to close; wicks reach the high and low.'),
    key('Volume', '**Volume** is the number of shares traded in the period. Traders often watch whether price moves happen on high volume (broad participation) or low volume (less conviction). Volume is context, not a prediction.'),
    tf('q3', 'A candlestick’s wicks show the highest and lowest prices traded during the period.', true, 'True. The body shows open to close; wicks extend to the high and low.', { final: true }),
    recap('OHLC: open, high, low, close.', 'Candles show the body (open–close) and wicks (high–low).', 'Volume shows how much trading accompanied a move.'),
  ],
)

const supportResistance = lesson(
  {
    title: 'Trends, support and resistance',
    description: 'Lines traders draw — and why they are not laws of nature.',
    objectives: ['Identify uptrends and downtrends', 'Define support and resistance', 'Explain the limitations of chart patterns'],
    tags: ['support-resistance'],
    difficulty: 2,
  },
  [
    text(
      'Drawing lines',
      'An **uptrend** has a series of higher highs and higher lows; a **downtrend** has lower highs and lower lows. A **trendline** connects these points.\n\n**Support** is a price level where buying has previously tended to stop falls; **resistance** is a level where selling has previously tended to stop rises.',
    ),
    mcq('q1', 'A share has bounced up from around £50 three times in the past year. A technical analyst would call £50…', ['resistance', 'support', 'the intrinsic value', 'the dividend'], 1, 'A level where falls have repeatedly stopped is called support.'),
    mcq('q2', 'Which sequence describes an uptrend?', ['Lower highs and lower lows', 'Higher highs and higher lows', 'Equal highs and lows', 'Random prices'], 1, 'Rising peaks and rising troughs define an uptrend.'),
    warn('Patterns are subjective', 'Two analysts can draw different lines on the same chart. Levels often “break”, and patterns that look obvious in hindsight are much less clear in real time. Support and resistance describe past behaviour; they do not guarantee future behaviour.'),
    tf('q3', 'Once a support level is identified, the price cannot fall below it.', false, 'False. Support levels frequently break, sometimes sharply. They are observations, not barriers.', { final: true }),
    recap('Uptrends: higher highs and lows. Downtrends: lower highs and lows.', 'Support and resistance mark levels where prices previously stalled.', 'Chart patterns are subjective and frequently fail.'),
  ],
)

const indicators = lesson(
  {
    title: 'Moving averages and RSI',
    description: 'Two popular indicators, calculated and critiqued.',
    objectives: ['Calculate a simple moving average', 'Explain the basics of the RSI', 'Recognise indicators’ limitations'],
    tags: ['indicators'],
    difficulty: 3,
    minutes: 6,
  },
  [
    key('Simple moving average (SMA)', 'An **SMA** is the average closing price over the last *n* periods, recalculated each period. A 50-day SMA smooths daily noise to show the broader direction. Because it uses past prices, it always **lags**.'),
    num('q1', 'Closing prices over five days were 10, 11, 12, 13 and 14. What is the 5-day simple moving average?', 12, '(10 + 11 + 12 + 13 + 14) ÷ 5 = 60 ÷ 5 = 12.', { tolerance: 0 }),
    diagram({ type: 'candles', datasetId: 'synthetic-ohlc', overlay: 'sma' }, 'Synthetic data with a 10-period simple moving average. Notice how the average trails turning points.', 'Price with a moving average'),
    key('Relative strength index (RSI)', 'The **RSI** compares the size of recent gains with recent losses, usually over 14 periods, on a 0–100 scale:\n\nRSI = 100 − 100 ÷ (1 + RS), where RS = average gain ÷ average loss.\n\nReadings above 70 are often called “overbought” and below 30 “oversold” — labels, not predictions.'),
    num('q2', 'Over the lookback period the average gain is 1.5 and the average loss is 0.5. What is the RSI?', 75, 'RS = 1.5 ÷ 0.5 = 3. RSI = 100 − 100 ÷ 4 = 75.', { tolerance: 0.01, working: 'RS = 3; 100 − 100/(1+3) = 75' }),
    warn('Indicators don’t predict', 'An “overbought” share can keep rising for months; an “oversold” one can keep falling. Indicators summarise past prices — they contain no information about the business and do not reliably forecast future returns.'),
    tf('q3', 'An RSI above 70 means the price will fall soon.', false, 'False. It means recent gains have outweighed recent losses. Prices can stay “overbought” for a long time.', { final: true }),
    recap('SMA = average of the last n closes; it lags.', 'RSI = 100 − 100 ÷ (1 + RS) on a 0–100 scale.', 'Indicators describe the past; they don’t reliably predict.'),
  ],
)

const efficiency = lesson(
  {
    title: 'Market efficiency and technical versus fundamental analysis',
    description: 'How much can you learn from prices alone?',
    objectives: ['Explain the efficient market hypothesis', 'Contrast technical and fundamental analysis', 'Evaluate claims of easy predictability'],
    tags: ['market-efficiency'],
    difficulty: 3,
  },
  [
    text(
      'Is the information already in the price?',
      'The **efficient market hypothesis** (EMH) argues that prices quickly reflect available information, so it is hard to consistently beat the market after costs. In its weak form, past prices alone should not let you predict future prices profitably.\n\nMarkets are not perfectly efficient — anomalies and bubbles happen — but competition among millions of participants makes easy profits rare.',
    ),
    match('q1', 'Match each approach with what it mainly studies.', [['Fundamental analysis', 'Business performance, financial statements and valuation'], ['Technical analysis', 'Price and volume patterns'], ['Passive investing', 'Owning the market at low cost']], 'Each makes different assumptions about what information is useful.'),
    mcq('q2', 'If a simple chart pattern reliably predicted profits, what would efficient-market thinking expect to happen?', ['It would keep working forever', 'Traders would exploit it until the profit disappeared', 'Regulators would ban charts', 'Prices would stop moving'], 1, 'Exploitable patterns tend to be arbitraged away once widely known.'),
    tf('q3', 'Markets being “mostly efficient” means prices are always right.', false, 'False. Efficiency means mispricings are hard to exploit consistently after costs — not that prices are always correct. Bubbles and crashes show prices can be badly wrong.', { final: true }),
    recap('EMH: prices quickly reflect information, making consistent outperformance hard.', 'Technical analysis studies prices; fundamental analysis studies businesses.', 'Markets can be wrong, yet still hard to beat.'),
  ],
)

const overconfidence = lesson(
  {
    title: 'Overconfidence and confirmation bias',
    description: 'Why we think we know more than we do.',
    objectives: ['Define overconfidence and confirmation bias', 'Recognise them in investing decisions', 'Use techniques to counter them'],
    tags: ['overconfidence'],
  },
  [
    text(
      'The brain’s shortcuts',
      'Behavioural finance studies how psychological biases affect financial decisions.\n\n**Overconfidence** is overestimating our own knowledge or skill — for example, believing we can pick winners or time the market. It tends to lead to more trading, and more trading tends to lead to higher costs.\n\n**Confirmation bias** is seeking out information that supports what we already believe and dismissing what contradicts it.',
    ),
    mcq('q1', 'An investor reads only bullish posts about a share they own and ignores a negative analyst report. Which bias is this?', ['Loss aversion', 'Confirmation bias', 'Recency bias', 'Herding'], 1, 'Favouring confirming information over disconfirming information is confirmation bias.'),
    mcq('q2', 'After three winning trades, a student doubles their position sizes because they are “good at this”. Which bias is most evident?', ['Overconfidence', 'Loss aversion', 'Anchoring', 'Home bias'], 0, 'A short run of wins is weak evidence of skill; luck plays a big role over small samples.'),
    key('Counter-measures', '- Write down your reasons *before* investing, and what would prove you wrong.\n- Actively seek the strongest argument against your view.\n- Track all your decisions, not just the wins.\n- Prefer rules and diversification over gut feel.'),
    tf('q3', 'Keeping a written record of why you made each investment can help counter hindsight and confirmation bias.', true, 'True. A record makes it harder to rewrite history and forces you to confront evidence.', { final: true }),
    recap('Overconfidence leads to excessive risk and trading.', 'Confirmation bias filters out inconvenient evidence.', 'Write down your thesis and seek out opposing views.'),
  ],
)

const lossAversion = lesson(
  {
    title: 'Loss aversion and recency bias',
    description: 'Why losses sting and recent events loom large.',
    objectives: ['Define loss aversion', 'Explain the disposition effect', 'Recognise recency bias'],
    tags: ['loss-aversion'],
    difficulty: 2,
  },
  [
    text(
      'Losses hurt more',
      '**Loss aversion** describes how losses feel more painful than equivalent gains feel good. Research in behavioural economics (notably by Kahneman and Tversky) suggests losses can feel roughly twice as intense as gains of the same size.\n\nOne result is the **disposition effect**: selling winners too early to “lock in” gains, while holding losers too long hoping to “get back to even”.',
    ),
    mcq('q1', 'Which behaviour illustrates the disposition effect?', ['Rebalancing once a year', 'Selling a rising share quickly while refusing to sell a falling one until it “recovers”', 'Buying a global index fund', 'Reading an annual report'], 1, 'Holding losers and selling winners is the classic disposition effect.'),
    key('Recency bias', '**Recency bias** is giving too much weight to recent events. After a strong year, people expect more of the same; after a crash, they expect further falls. Both can lead to buying high and selling low.'),
    tf('q2', 'Your purchase price is relevant to whether a share is a good investment from today onwards.', false, 'False. The market does not know what you paid. The question is always: given today’s price and prospects, is this the best place for the money?'),
    mcq('q3', 'After three years of strong returns, a friend says shares are now “safe”. Which bias is this?', ['Recency bias', 'Loss aversion', 'Home bias', 'Confirmation bias'], 0, 'Extrapolating recent good years into the future is recency bias.', { final: true }),
    recap('Losses feel worse than equivalent gains feel good.', 'The disposition effect: selling winners early, holding losers too long.', 'Recency bias overweights recent events.'),
  ],
)

const herdFomo = lesson(
  {
    title: 'Herd behaviour, FOMO and emotional decisions',
    description: 'When everyone is buying, should you?',
    objectives: ['Explain herd behaviour and FOMO', 'Describe how bubbles can form', 'Use a simple plan to reduce emotional decisions'],
    tags: ['herding'],
  },
  [
    text(
      'Following the crowd',
      '**Herd behaviour** is copying what others are doing rather than relying on your own analysis. **FOMO** — fear of missing out — pushes people to buy after prices have soared, often near the top.\n\nHerding can fuel **bubbles**, where prices rise far above any reasonable value until sentiment reverses.',
    ),
    analogy('The packed restaurant', 'A busy restaurant seems like a good sign — but if everyone only goes because it is busy, the crowd tells you little about the food.'),
    multi('q1', 'Which are signs that FOMO may be driving a decision? Select all that apply.', ['Buying because a price has risen sharply and friends are boasting', 'Feeling you must act immediately', 'Following a written plan you made last year', 'Not knowing what the asset does'], [0, 1, 3], 'Following a pre-made plan is the antidote to FOMO.'),
    key('An emotional circuit-breaker', '- Have a written investment plan before markets get exciting.\n- Wait 24 hours before acting on a hot tip.\n- Ask: “Would I buy this if the price hadn’t just risen?”\n- Size positions so no single decision can hurt you badly.'),
    tf('q2', 'If many people are buying an asset, it must be a good investment.', false, 'False. Popularity is not evidence of value. Crowds can be right, but bubbles show they can also be spectacularly wrong.'),
    mcq('q3', 'A token rises 300% in a month and is all over social media. A classmate wants to put their rent money in. What is the best advice?', ['Do it — the trend is your friend', 'Never invest money you need for essentials; recognise FOMO and herd behaviour', 'Borrow more to buy more', 'Wait for 400%'], 1, 'Essential money should never be put at speculative risk. The situation shows classic FOMO and herding.', { final: true }),
    recap('Herding means copying the crowd instead of analysing.', 'FOMO pushes people to buy after big rises.', 'A written plan and cooling-off period reduce emotional decisions.'),
  ],
)

const positionSizing = lesson(
  {
    title: 'Risk management and position sizing',
    description: 'Deciding how much to risk on any one idea.',
    objectives: ['Explain position sizing', 'Calculate a position size from a risk budget', 'Describe stop-loss orders and their limits'],
    tags: ['position-sizing'],
    difficulty: 3,
    minutes: 6,
  },
  [
    text(
      'Survive first',
      'Professional risk management starts with a simple question: *how much could I lose on this, and can I afford it?*\n\n**Position sizing** sets how much of your portfolio goes into each holding or trade, so that no single mistake is devastating.',
    ),
    example('A risk budget', 'A trader with a £10,000 account decides to risk at most 1% (£100) on any trade. They buy at £20 and plan to exit if the price hits £18 — a £2 risk per share. Position size = £100 ÷ £2 = **50 shares**.'),
    num('q1', 'Account $20,000. Maximum risk per trade 2%. Entry $50, planned exit $45. How many shares?', 80, 'Risk budget = $400. Risk per share = $5. Shares = $400 ÷ $5 = 80.', { suffix: 'shares', working: '$20,000 × 2% = $400; $400 ÷ ($50 − $45) = 80' }),
    key('Stop-loss orders', 'A **stop-loss order** becomes a market order to sell if the price falls to a set level. It can limit losses, but in fast markets or overnight price gaps it may execute well below the stop price — so actual losses can exceed the plan.'),
    tf('q2', 'A stop-loss order guarantees you will sell at exactly your stop price.', false, 'False. If the price gaps below the stop (for example after bad overnight news), the order executes at the next available price, which may be much lower.'),
    mcq('q3', 'Why do many risk managers limit any single position to a small percentage of the portfolio?', ['To make returns guaranteed', 'So that one bad outcome cannot cause catastrophic damage', 'Because regulators require exactly 5%', 'To avoid paying dividends tax'], 1, 'Small positions mean even a total loss on one idea is survivable.', { final: true }),
    recap('Position size = risk budget ÷ risk per share.', 'Stop-losses can limit losses but are not guaranteed prices.', 'Size positions so you can survive being wrong.'),
  ],
)

const leverageDrawdowns = lesson(
  {
    title: 'Leverage and drawdowns',
    description: 'How borrowed money turns small moves into big losses.',
    objectives: ['Calculate leveraged gains and losses', 'Explain margin calls', 'Relate drawdowns to recovery requirements'],
    tags: ['leverage-risk'],
    difficulty: 3,
  },
  [
    text(
      'Magnifying glass',
      '**Leverage** means controlling a position larger than your own money, using borrowed funds or derivatives (such as CFDs, spread bets, futures or options). It magnifies gains *and* losses.\n\nWith 5× leverage, a 10% price move becomes a 50% gain or loss on your own money.',
    ),
    num('q1', 'You use 5× leverage and the price falls 20%. What percentage of your own money have you lost (before costs)?', 100, '5 × 20% = 100%: your entire stake is wiped out.', { suffix: '%', tolerance: 0.01 }),
    warn('Regulatory warnings', 'In the UK, CFD providers must show the percentage of their retail clients who lose money; these figures are typically a majority. The FCA restricts leverage on CFDs for retail clients for this reason. In the US, retail investors face margin rules and pattern day trader requirements.'),
    key('Margin calls', 'When leveraged losses eat into your deposit, the provider may issue a **margin call**, demanding more money or closing your position — often at the worst moment.'),
    numbers('Recovering from drawdowns', [['Fall of 10%', 'needs +11.1% to recover'], ['Fall of 25%', 'needs +33.3%'], ['Fall of 50%', 'needs +100%'], ['Fall of 80%', 'needs +400%']], 'Required gain = 1 ÷ (1 − loss) − 1.'),
    num('q2', 'An account falls 60%. What percentage gain is needed to get back to the starting value?', 150, '1 ÷ 0.4 − 1 = 1.5 = 150%.', { suffix: '%', tolerance: 0.1 }),
    tf('q3', 'Leverage can make it possible to lose more than your initial deposit in some products.', true, 'True. Some leveraged products (such as certain futures positions or short options) can create losses beyond your deposit, though UK retail CFD rules include negative balance protection.', { final: true }),
    recap('Leverage multiplies gains and losses.', 'Margin calls can force selling at bad prices.', 'Deep drawdowns require huge gains to recover.'),
  ],
)

const whyTradingIsHard = lesson(
  {
    title: 'Why short-term trading is hard — and backtests mislead',
    description: 'Competition, costs, luck and overfitting.',
    objectives: ['Explain why short-term trading is difficult', 'Identify backtesting pitfalls', 'Evaluate a too-good-to-be-true strategy claim'],
    tags: ['backtesting'],
    difficulty: 3,
    minutes: 6,
  },
  [
    text(
      'A tough game',
      'Short-term traders compete against professional firms with faster technology, better data and lower costs. Every trade has costs, and short-term price moves are noisy. After costs, the average short-term trader tends to underperform simply buying and holding.',
    ),
    key('Backtesting pitfalls', 'A **backtest** tests a strategy on historical data. It can mislead:\n\n- **Overfitting**: tuning rules until they fit past noise perfectly.\n- **Survivorship bias**: testing only companies that still exist, ignoring those that failed.\n- **Look-ahead bias**: accidentally using information that wasn’t available at the time.\n- **Ignoring costs**: spreads, commissions, slippage and taxes.'),
    match('q1', 'Match each backtest flaw with its description.', [['Overfitting', 'Rules tuned to fit past noise'], ['Survivorship bias', 'Failed companies left out of the data'], ['Look-ahead bias', 'Using information not known at the time'], ['Ignoring costs', 'Leaving out spreads, fees and slippage']], 'Each flaw makes past performance look better than reality.'),
    example('Testing many ideas', 'If you test 100 random strategies with no real edge, some will look excellent by luck alone. Picking the best performer after the fact and expecting it to continue is a trap.'),
    mcq('q2', 'A course advertises a strategy that “returned 400% in backtests with no losing years”. What is the most sceptical, sensible response?', ['Buy the course immediately', 'Ask about overfitting, costs, survivorship and live out-of-sample results', 'Trust it because backtests use real data', 'Use leverage to multiply the 400%'], 1, 'Spectacular backtests are common and cheap to produce. Live, out-of-sample results after costs are what matter — and even those can be luck.'),
    tf('q3', 'Strong backtested performance is reliable evidence that a strategy will work in the future.', false, 'False. Backtests are vulnerable to overfitting and other biases; past performance — real or simulated — does not guarantee future results.', { final: true }),
    recap('Short-term trading pits you against professionals, with costs on every trade.', 'Backtests suffer from overfitting, survivorship, look-ahead bias and missing costs.', 'Be very sceptical of too-good-to-be-true strategies.'),
  ],
)

export const c8 = course({
  id: 'c8',
  slug: 'trading-and-psychology',
  title: 'Trading, Technical Analysis and Investor Psychology',
  tagline: 'Understand charts, biases and risk — honestly.',
  description: 'Learn to read candlestick charts and common indicators, understand their limits, recognise the biases that trip investors up, and manage risk, leverage and position size responsibly.',
  colour: 'violet',
  icon: 'brain',
  outcomes: [
    'Read OHLC and candlestick charts, moving averages and RSI, and explain their limitations',
    'Contrast technical analysis, fundamental analysis and market efficiency',
    'Recognise behavioural biases including overconfidence, loss aversion and FOMO',
    'Apply position sizing and explain the risks of leverage, drawdowns and misleading backtests',
  ],
  units: [
    {
      title: 'Charts and indicators',
      description: 'Trading horizons, candlesticks, levels and indicators.',
      lessons: [investVsTrade, candlesticks, supportResistance, indicators],
      checkpoint: {
        concept: 'candlesticks',
        questions: [
          mcqQ('c1', 'Swing trading usually holds positions for…', ['seconds', 'days to weeks', 'decades', 'exactly one year'], 1, 'Days to weeks.', { concept: 'trading-basics' }),
          numQ('c2', 'A candle: open 50, high 55, low 48, close 49. What is the range?', 7, '55 − 48 = 7.', { tolerance: 0, concept: 'candlesticks' }),
          mcqQ('c3', 'A candle opens at 50 and closes at 49. What kind of candle is it?', ['Rising', 'Falling', 'Flat', 'Impossible'], 1, 'Close (49) is below open (50).', { concept: 'candlesticks' }),
          tfQ('c4', 'Resistance is a level where rises have previously stalled.', true, 'By definition.', { concept: 'support-resistance' }),
          numQ('c5', 'Closes: 20, 22, 24. What is the 3-period SMA?', 22, '66 ÷ 3 = 22.', { tolerance: 0, concept: 'indicators' }),
          numQ('c6', 'Average gain 1, average loss 1. What is the RSI?', 50, 'RS = 1; 100 − 100/2 = 50.', { tolerance: 0.01, concept: 'indicators' }),
        ],
      },
    },
    {
      title: 'Investor psychology',
      description: 'Efficiency and the biases that cost money.',
      lessons: [efficiency, overconfidence, lossAversion, herdFomo],
      checkpoint: {
        concept: 'overconfidence',
        questions: [
          mcqQ('c1', 'The weak form of market efficiency implies…', ['past prices alone can’t reliably predict future profits', 'prices never change', 'all investors are rational', 'insider trading is legal'], 0, 'Price history is already reflected in prices.', { concept: 'market-efficiency' }),
          mcqQ('c2', 'Ignoring evidence against your view is…', ['confirmation bias', 'loss aversion', 'recency bias', 'diversification'], 0, 'Confirmation bias.', { concept: 'overconfidence' }),
          mcqQ('c3', 'Holding losers while selling winners is the…', ['disposition effect', 'January effect', 'wealth effect', 'halo effect'], 0, 'The disposition effect.', { concept: 'loss-aversion' }),
          tfQ('c4', 'Recency bias means giving too much weight to recent events.', true, 'By definition.', { concept: 'loss-aversion' }),
          mcqQ('c5', 'FOMO is best countered by…', ['a written plan and a cooling-off period', 'more leverage', 'following social media', 'checking prices more often'], 0, 'Plans and pauses reduce impulsive decisions.', { concept: 'herding' }),
          tfQ('c6', 'Popularity proves an asset is good value.', false, 'Crowds can be wrong.', { concept: 'herding' }),
        ],
      },
    },
    {
      title: 'Managing risk',
      description: 'Position sizing, leverage and honest testing.',
      lessons: [positionSizing, leverageDrawdowns, whyTradingIsHard],
      checkpoint: {
        concept: 'position-sizing',
        questions: [
          numQ('c1', 'Account £5,000; risk 1% per trade; entry £10; exit £9.50. How many shares?', 100, '£50 ÷ £0.50 = 100.', { suffix: 'shares', concept: 'position-sizing' }),
          tfQ('c2', 'Stop-loss orders can execute below the stop price.', true, 'Gaps and fast markets cause slippage.', { concept: 'position-sizing' }),
          numQ('c3', '10× leverage; price rises 3%. Gain on your own money (before costs)?', 30, '10 × 3% = 30%.', { suffix: '%', tolerance: 0.01, concept: 'leverage-risk' }),
          numQ('c4', 'An account falls 20%. Gain needed to recover?', 25, '1 ÷ 0.8 − 1 = 25%.', { suffix: '%', tolerance: 0.1, concept: 'leverage-risk' }),
          mcqQ('c5', 'Testing only companies that still exist causes…', ['survivorship bias', 'overconfidence', 'deflation', 'liquidity'], 0, 'Survivorship bias.', { concept: 'backtesting' }),
          tfQ('c6', 'Excellent backtests guarantee future performance.', false, 'They can be overfitted and biased.', { concept: 'backtesting' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'trading-basics',
    questions: [
      mcqQ('e1', 'Which is the longest typical horizon?', ['Day trading', 'Swing trading', 'Position trading', 'Long-term investing'], 3, 'Years to decades.', { concept: 'trading-basics' }),
      numQ('e2', '30 round trips at 0.4% each. Approximate annual cost as % of a fully invested account?', 12, '30 × 0.4% = 12%.', { suffix: '%', tolerance: 0.05, concept: 'trading-basics' }),
      mcqQ('e3', 'OHLC stands for…', ['Open, High, Low, Close', 'Order, Hold, Limit, Cancel', 'Open, Hedge, Leverage, Cash', 'Overbought, High, Low, Cheap'], 0, 'Open, high, low, close.', { concept: 'candlesticks' }),
      tfQ('e4', 'Volume measures how many shares traded in a period.', true, 'By definition.', { concept: 'candlesticks' }),
      tfQ('e5', 'Support levels cannot be broken.', false, 'They often break.', { concept: 'support-resistance' }),
      numQ('e6', 'Closes: 8, 9, 10, 11. What is the 4-period SMA?', 9.5, '38 ÷ 4 = 9.5.', { tolerance: 0.001, concept: 'indicators' }),
      numQ('e7', 'Average gain 2, average loss 1. What is the RSI (to 1 decimal place)?', 66.7, 'RS = 2; 100 − 100/3 ≈ 66.7.', { tolerance: 0.1, concept: 'indicators' }),
      mcqQ('e8', 'An RSI above 70 is commonly labelled…', ['oversold', 'overbought', 'bankrupt', 'efficient'], 1, '“Overbought” — a label, not a forecast.', { concept: 'indicators' }),
      mcqQ('e9', 'Fundamental analysis focuses on…', ['chart patterns', 'business performance and valuation', 'social media trends', 'lottery odds'], 1, 'The business and its value.', { concept: 'market-efficiency' }),
      mcqQ('e10', 'Doubling position sizes after a few lucky wins shows…', ['overconfidence', 'diversification', 'rebalancing', 'loss aversion'], 0, 'Overconfidence.', { concept: 'overconfidence' }),
      tfQ('e11', 'Losses tend to feel more painful than equivalent gains feel good.', true, 'Loss aversion.', { concept: 'loss-aversion' }),
      multiQ('e12', 'Which help reduce emotional investing decisions? Select all that apply.', ['A written plan', 'A cooling-off period', 'Sensible position sizes', 'Acting on every social media tip'], [0, 1, 2], 'Reacting to every tip increases emotional decisions.', { concept: 'herding' }),
      numQ('e13', 'Account $8,000; risk 1.5%; entry $40; stop $37. How many shares?', 40, '$120 ÷ $3 = 40.', { suffix: 'shares', concept: 'position-sizing' }),
      numQ('e14', '4× leverage; price falls 15%. Loss on your own money (before costs)?', 60, '4 × 15% = 60%.', { suffix: '%', tolerance: 0.01, concept: 'leverage-risk' }),
      mcqQ('e15', 'Tuning a strategy until it perfectly fits past data is called…', ['overfitting', 'hedging', 'rebalancing', 'diversifying'], 0, 'Overfitting.', { concept: 'backtesting' }),
    ],
  },
})
