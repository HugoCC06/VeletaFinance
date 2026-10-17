import { course, diagram, example, key, lesson, match, matchQ, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, ukus, warn } from '../builders'

/* ── Unit 1: Anatomy of a bubble ─────────────────────────────────────────── */

const bubbleStages = lesson(
  {
    title: 'How bubbles form',
    description: 'The five classic stages, from new idea to panic.',
    objectives: ['Define a financial bubble', 'Order the five classic stages of a bubble', 'Explain the role of credit and crowd behaviour'],
    tags: ['hi-bubble-stages'],
    sources: [
      { label: 'Charles P. Kindleberger — Manias, Panics, and Crashes: A History of Financial Crises' },
      { label: 'Hyman P. Minsky — the financial instability hypothesis' },
    ],
  },
  [
    text(
      'Prices that lose touch with reality',
      'A **bubble** is when the price of an asset rises far above any reasonable estimate of its value, driven mostly by the expectation that someone else will pay even more later. Bubbles are easy to spot afterwards and very hard to call in real time.',
    ),
    key(
      'Five classic stages',
      'Economist **Hyman Minsky** and historian **Charles Kindleberger** described a pattern that repeats across centuries:\n\n1. **Displacement**: a new technology, policy or opportunity excites investors.\n2. **Boom**: prices rise, often fuelled by easy credit, and media attention grows.\n3. **Euphoria**: caution disappears; people buy simply because prices are rising.\n4. **Profit-taking (distress)**: insiders and early buyers start to sell.\n5. **Panic**: prices fall fast as everyone tries to sell at once.',
    ),
    diagram(
      { type: 'flow', nodes: [{ label: 'Displacement', sub: 'New story', tone: 'sky' }, { label: 'Boom', sub: 'Credit and attention', tone: 'mint' }, { label: 'Euphoria', sub: 'Caution vanishes', tone: 'sun' }, { label: 'Profit-taking', sub: 'Smart money sells', tone: 'violet' }, { label: 'Panic', sub: 'Rush for the exit', tone: 'coral' }] },
      'A simplified model. Real bubbles are messier, and not every boom ends in a crash.',
    ),
    order('q1', 'Put the classic stages of a bubble in order.', ['Displacement', 'Boom', 'Euphoria', 'Profit-taking', 'Panic'], 'New story → boom → euphoria → profit-taking → panic.'),
    key('Fuel: credit and the crowd', '**Leverage** (borrowing to invest) magnifies gains on the way up and forces selling on the way down. **Herd behaviour** — buying because everyone else is — pushes prices further from value. The most dangerous phrase is “**this time is different**”.'),
    mcq('q2', 'At which stage do people typically buy simply because prices have been rising?', ['Displacement', 'Profit-taking', 'Euphoria', 'Panic'], 2, 'Euphoria is when price momentum itself becomes the main reason to buy.'),
    num('q3', 'An investor buys at the height of euphoria for £100. The price then falls 60%. What is it worth now?', 40, '£100 × (1 − 0.60) = £40.', { prefix: '£', tolerance: 0.01 }),
    multi('q4', 'Which features often appear in bubbles? Select all that apply.', ['Easy credit and rising borrowing', 'Claims that old valuation rules no longer apply', 'Investors buying mainly because prices are rising', 'Prices falling steadily for years'], [0, 1, 2], 'Steadily falling prices are the opposite of a bubble.', { final: true }),
    recap('A bubble is a price far above any reasonable estimate of value.', 'Stages: displacement, boom, euphoria, profit-taking, panic.', 'Leverage, herd behaviour and “this time is different” are recurring fuels.'),
  ],
)

const tulipMania = lesson(
  {
    title: 'Tulip mania',
    description: 'The Dutch flower craze of the 1630s — and the debate about it.',
    objectives: ['Describe tulip mania and when it peaked', 'Explain how bulb contracts were traded', 'Recognise that historians debate its scale'],
    tags: ['hi-tulips'],
    sources: [{ label: 'Anne Goldgar — Tulipmania: Money, Honor, and Knowledge in the Dutch Golden Age' }],
  },
  [
    text(
      'A flower becomes a status symbol',
      'In the **Dutch Republic** of the 1630s, rare tulips — especially “broken” varieties with striking streaked petals — became luxury status symbols. Prices for the rarest bulbs climbed to extraordinary levels, and trading spread beyond specialist growers.',
    ),
    key('Trading the promise of a bulb', 'Bulbs sit in the ground for much of the year, so buyers often traded **contracts** to receive a bulb later — an early form of forward trading. Much of this happened informally, including in taverns, with little cash changing hands at the time.'),
    tf('q1', 'Tulip contracts were often agreements to receive a bulb in the future, rather than immediate swaps of bulbs for cash.', true, 'True. Bulbs were in the ground for much of the year, so many deals were promises for later delivery.'),
    text('The peak and the fall', 'Prices peaked in the winter of **1636–37** and collapsed suddenly in **early February 1637**, when buyers simply stopped turning up. Many contracts were never honoured, leading to years of disputes.'),
    warn('How mad was the mania?', 'The popular story — of a whole nation ruined by flowers — comes largely from later moralising pamphlets and books. Historians such as **Anne Goldgar** argue that the trade involved a fairly small group of merchants and artisans and that wider economic damage was limited. It is still a powerful lesson in crowd psychology, but treat dramatic anecdotes with care.'),
    mcq('q2', 'Roughly when did tulip mania peak and collapse?', ['1590s', 'Early 1637', '1720', '1929'], 1, 'Prices collapsed in early February 1637.'),
    num('q3', 'A hypothetical bulb contract was agreed at 1,000 guilders. After the collapse it is worth 90% less. What is it worth?', 100, '1,000 × (1 − 0.90) = 100 guilders.', { suffix: ' guilders', tolerance: 0.01 }),
    tf('q4', 'All historians agree that tulip mania ruined the Dutch economy.', false, 'False. Many modern historians think its economic impact was limited; the extent of the mania is debated.', { final: true }),
    recap('Tulip mania: rare Dutch tulips, prices peaking in 1636–37.', 'Much trading was in contracts for future delivery.', 'Historians debate how extreme and damaging it really was.'),
  ],
)

const southSea = lesson(
  {
    title: 'The South Sea and Mississippi bubbles',
    description: '1720: when two nations caught investing fever.',
    objectives: ['Describe the South Sea Bubble and the Mississippi Company', 'Explain the role of government debt and paper money', 'Calculate a fall from peak'],
    tags: ['hi-south-sea'],
    difficulty: 2,
  },
  [
    text(
      'Swapping government debt for shares',
      'The British **South Sea Company** was granted trading rights in South America, but its real business became finance. In **1720** it agreed to take on a large part of the government’s debt, swapping it for company shares. Promoters talked up the shares and lent money to buy them. The price soared within months — then collapsed later that year.',
    ),
    ukus('Across the Channel: John Law', 'In France, Scottish financier **John Law** set up a bank issuing paper money and took control of the **Mississippi Company**, which also absorbed French government debt. Shares rocketed in 1719, helped by the bank printing notes, and crashed in **1720**. France’s experience left a deep distrust of paper money and banks.'),
    example('Newton’s loss', '**Isaac Newton** reportedly sold South Sea shares at a profit, bought back in near the top and lost a large sum. He is often quoted as saying he could calculate the motions of the heavenly bodies, but not the madness of people — though the exact wording is uncertain. Even brilliant people get swept along by crowds.'),
    numbers('A hypothetical South Sea-style share', [['Start of the year', '£100'], ['Summer peak', '£1,000'], ['End of the year', '£150']], 'Round illustrative figures, not exact historical prices. Real South Sea shares did rise several-fold and give back most of the gain within 1720.'),
    num('q1', 'Using the table, by what percentage did the share fall from its peak?', 85, '(£1,000 − £150) ÷ £1,000 = 85%.', { suffix: '%', tolerance: 0.01 }),
    match('q2', 'Match each figure with the bubble most associated with them.', [['John Law', 'Mississippi Company'], ['Isaac Newton (as an investor)', 'South Sea Company'], ['Rare “broken” bulbs', 'Tulip mania']], 'Law ran the Mississippi scheme; Newton lost money on South Sea shares; tulip mania centred on rare bulbs.'),
    tf('q3', 'Both the South Sea and Mississippi schemes involved swapping government debt for company shares.', true, 'True. Both companies took on state debt in exchange for their shares.'),
    mcq('q4', 'What lesson does Newton’s South Sea loss best illustrate?', ['Intelligence protects you from bubbles', 'Crowd psychology can overwhelm even brilliant individuals', 'Government-linked companies are always safe', 'Buying near the top is a sound strategy'], 1, 'Newton’s story shows how fear of missing out can catch anyone.', { final: true }),
    recap('South Sea (Britain) and Mississippi (France) bubbles both burst in 1720.', 'Both swapped government debt for shares and were fuelled by credit or paper money.', 'Even Isaac Newton reportedly lost money: crowds can sweep up anyone.'),
  ],
)

/* ── Unit 2: Crashes of the 20th century ─────────────────────────────────── */

const crash1929 = lesson(
  {
    title: 'The 1929 crash and the Great Depression',
    description: 'From the roaring twenties to the deepest bear market.',
    objectives: ['Describe the causes of the 1929 crash', 'Calculate the size of the 1929–32 fall', 'Explain how long recovery took'],
    tags: ['hi-1929'],
    difficulty: 2,
    sources: [
      { label: 'Federal Reserve History — Stock Market Crash of 1929', url: 'https://www.federalreservehistory.org/essays/stock-market-crash-of-1929' },
      { label: 'Federal Reserve History — The Great Depression', url: 'https://www.federalreservehistory.org/essays/great-depression' },
    ],
  },
  [
    text(
      'The roaring twenties',
      'US shares boomed through the 1920s on new technologies like cars, radio and electricity. Many investors bought **on margin**: putting down a small deposit and borrowing the rest from their broker. When prices fell, brokers demanded more cash (**margin calls**), forcing sales that pushed prices down further.',
    ),
    key('October 1929', 'The crash unfolded over several days in **late October 1929**, including “Black Thursday” (24 October) and “Black Tuesday” (29 October). It was the start of a long slide, not a single bad day.'),
    numbers('Dow Jones Industrial Average (rounded)', [['Peak, September 1929', 'about 381'], ['Low, July 1932', 'about 41'], ['Back above the 1929 peak', '1954']], 'Nominal index levels, rounded. Dividends and falling prices in the 1930s meant real total-return recovery was faster than the index level suggests.'),
    num('q1', 'Using the rounded figures, by roughly what percentage did the Dow fall from 381 to 41? Give your answer to the nearest whole per cent.', 89, '(381 − 41) ÷ 381 ≈ 0.892, so about 89%.', { suffix: '%', tolerance: 0.5 }),
    num('q2', 'If the Dow peaked in 1929 and only regained that level in 1954, how many years did that take?', 25, '1954 − 1929 = 25 years.', { suffix: ' years', tolerance: 0 }),
    key('Why it became a depression', 'The crash damaged confidence, but the **Great Depression** was deepened by thousands of US bank failures, a shrinking money supply, falling prices and trade barriers. Unemployment in the US reached roughly a quarter of the workforce.'),
    multi('q3', 'Which factors made the 1929 crash and its aftermath so severe? Select all that apply.', ['Widespread buying on margin', 'Waves of bank failures', 'A shrinking money supply', 'Deposit insurance protecting all savers'], [0, 1, 2], 'US federal deposit insurance did not exist until 1933–34; bank runs wiped out savers.'),
    tf('q4', 'The 1929 crash happened on a single day and prices recovered within a year.', false, 'False. It unfolded over days, and the market kept falling until 1932. The nominal Dow did not regain its 1929 peak until 1954.', { final: true }),
    recap('Margin buying amplified the October 1929 crash.', 'The Dow fell about 89% from its 1929 peak to its 1932 low.', 'In nominal terms, the Dow took until 1954 to regain its peak.'),
  ],
)

const blackMonday = lesson(
  {
    title: 'Black Monday 1987',
    description: 'The biggest one-day percentage fall in Dow history.',
    objectives: ['Describe what happened on 19 October 1987', 'Explain the role of programme trading and portfolio insurance', 'Calculate the impact of a one-day fall'],
    tags: ['hi-1987'],
    difficulty: 2,
    sources: [{ label: 'Federal Reserve History — Stock Market Crash of 1987', url: 'https://www.federalreservehistory.org/essays/stock-market-crash-of-1987' }],
  },
  [
    text(
      'A global one-day crash',
      'On **Monday 19 October 1987**, markets fell around the world. The Dow dropped about **22.6%** in a single day — still its largest one-day percentage fall. The UK’s FTSE 100 also fell sharply over that Monday and Tuesday.',
    ),
    key('Why so fast?', 'After a strong rally, markets were nervous. Computerised **programme trading** and a strategy called **portfolio insurance** — which automatically sold futures as prices fell — added to selling pressure. Selling triggered more selling.'),
    num('q1', 'A £10,000 portfolio falls 22.6% in one day. What is it worth at the close?', 7740, '£10,000 × (1 − 0.226) = £7,740.', { prefix: '£', tolerance: 1 }),
    ukus('Calm after the storm', 'The US Federal Reserve quickly said it would supply liquidity to the financial system. In the UK, the crash came days after the **Great Storm of October 1987**, which closed the London market on the Friday before. Unlike 1929, there was no depression: the Dow regained its pre-crash level within about two years.'),
    warn('Circuit breakers', 'Since 1987, exchanges have introduced **circuit breakers** that pause trading after very large falls, giving investors time to think. They don’t prevent crashes, but they can slow a panic.'),
    match('q2', 'Match each term with its meaning.', [['Programme trading', 'Computer-driven buying and selling'], ['Portfolio insurance', 'Selling futures automatically as prices fall'], ['Circuit breaker', 'A temporary trading halt after a big fall']], 'These features made 1987 fast, and later reforms tried to slow future panics.'),
    tf('q3', 'Black Monday was followed by a decade-long depression, as in the 1930s.', false, 'False. The economy kept growing and the Dow regained its pre-crash level within about two years.'),
    mcq('q4', 'What is the main lesson of 1987 for long-term investors?', ['One-day crashes always signal a depression', 'Sudden, severe falls can happen without an obvious economic collapse — and selling in panic can lock in losses', 'Computer trading has been banned since', 'Shares should only be bought after a crash'], 1, 'Markets can fall very fast for reasons rooted in market structure and psychology; those who held on recovered within a couple of years.', { final: true }),
    recap('19 October 1987: the Dow fell about 22.6% in one day.', 'Programme trading and portfolio insurance amplified selling.', 'Recovery was relatively quick; circuit breakers were introduced later.'),
  ],
)

const dotcom = lesson(
  {
    title: 'The dot-com bubble',
    description: 'When the internet was going to change everything — and did, eventually.',
    objectives: ['Describe the dot-com boom and bust', 'Calculate the Nasdaq’s fall and the gain needed to recover', 'Separate a real technology from an overpriced market'],
    tags: ['hi-dotcom'],
    difficulty: 2,
  },
  [
    text(
      'A real revolution, an unreal price',
      'In the late 1990s, investors rushed into internet companies. Firms with little revenue and no profits floated at huge valuations; adding “.com” to a name could lift a share price. The US **Nasdaq Composite**, packed with technology shares, roughly quintupled during the late 1990s.',
    ),
    key('Peak and bust', 'The Nasdaq peaked in **March 2000** at just over 5,000. By **October 2002** it had fallen roughly **78%**. Many dot-com firms went bust. Some survivors, such as Amazon, went on to become giants — but their shares also fell steeply first.'),
    num('q1', 'The Nasdaq falls from 5,000 to 1,100. What is the percentage fall?', 78, '(5,000 − 1,100) ÷ 5,000 = 3,900 ÷ 5,000 = 78%.', { suffix: '%', tolerance: 0.01 }),
    key('Recovery maths', 'After a fall of **L**, the gain needed to get back to where you started is **L ÷ (1 − L)**. Losses hurt more than equal-sized gains help. A 78% loss leaves 22% of your money, which must grow about 4.5 times.'),
    num('q2', 'After a 78% fall, what percentage gain is needed to get back to the starting level? Give your answer to the nearest whole per cent.', 355, '0.78 ÷ 0.22 ≈ 3.545, so about 355%.', { suffix: '%', tolerance: 1, working: '1 ÷ 0.22 = 4.545; 4.545 − 1 = 3.545' }),
    diagram({ type: 'bars', unit: '%', bars: [{ label: '10% loss', value: 11.1, tone: 'mint' }, { label: '25% loss', value: 33.3, tone: 'sky' }, { label: '50% loss', value: 100, tone: 'sun' }, { label: '78% loss', value: 354.5, tone: 'coral' }] }, 'Gain needed to recover from each loss. The bigger the fall, the steeper the climb back.'),
    tf('q3', 'Because the internet did transform the economy, buying dot-com shares at their 2000 peak worked out well for most investors.', false, 'False. A technology can be real while its share prices are far too high. The Nasdaq took about 15 years to regain its 2000 peak.'),
    mcq('q4', 'Which statement best captures the dot-com lesson?', ['New technologies are always bubbles', 'A great story does not justify any price — valuation still matters', 'Loss-making firms always fail', 'Index funds avoid all crashes'], 1, 'The internet changed the world, but paying any price for that story led to heavy losses.', { final: true }),
    recap('The Nasdaq peaked in March 2000 and fell roughly 78% by October 2002.', 'Gain to recover = loss ÷ (1 − loss).', 'A real innovation can still be a terrible investment at the wrong price.'),
  ],
)

/* ── Unit 3: Modern crises and lessons ───────────────────────────────────── */

const gfc = lesson(
  {
    title: 'The global financial crisis',
    description: 'Subprime mortgages, leverage and the fall of Lehman Brothers.',
    objectives: ['Explain how subprime lending and securitisation spread risk', 'Order the key events of 2007–09', 'Calculate how leverage wipes out equity'],
    tags: ['hi-gfc'],
    difficulty: 3,
    sources: [{ label: 'Federal Reserve History — The Great Recession and Its Aftermath', url: 'https://www.federalreservehistory.org/essays/great-recession-and-its-aftermath' }],
  },
  [
    text(
      'From mortgages to meltdown',
      'In the 2000s, US lenders made many **subprime** mortgages to borrowers with weak credit, assuming house prices would keep rising. Through **securitisation**, these loans were bundled into securities and sold to investors worldwide, often with high credit ratings. When US house prices fell and borrowers defaulted, losses surfaced in banks across the world — and nobody was sure who held what.',
    ),
    diagram({ type: 'flow', nodes: [{ label: 'Risky mortgages', sub: 'Subprime lending', tone: 'sun' }, { label: 'Securitisation', sub: 'Bundled and sold on', tone: 'sky' }, { label: 'Leverage', sub: 'Banks borrow heavily', tone: 'violet' }, { label: 'House prices fall', sub: 'Defaults rise', tone: 'coral' }, { label: 'Crisis', sub: 'Funding dries up', tone: 'ink' }] }, 'A simplified chain of cause and effect.'),
    key('Leverage cuts both ways', 'Many banks held very little **equity** relative to their assets. If a bank has £100 of assets funded by £97 of borrowing and £3 of equity, a fall of just 3% in asset values wipes out its equity entirely.'),
    num('q1', 'A bank has £100bn of assets and £4bn of equity. By what percentage must its assets fall to wipe out its equity?', 4, '£4bn ÷ £100bn = 4%.', { suffix: '%', tolerance: 0.01 }),
    ukus('Northern Rock and Lehman Brothers', '- **UK**: in **September 2007**, customers queued outside branches of **Northern Rock** — the first run on a British bank in well over a century. It was later nationalised.\n- **US**: investment bank **Lehman Brothers** filed for bankruptcy on **15 September 2008**, sending shock waves through global markets. Governments then spent and lent huge sums bailing out banks.'),
    order('q2', 'Put these events in order.', ['US house prices start to fall', 'Run on Northern Rock (September 2007)', 'Lehman Brothers files for bankruptcy (September 2008)', 'Global stock markets hit their crisis lows (early 2009)'], 'Housing turned first; Northern Rock in 2007; Lehman in 2008; markets bottomed in early 2009.'),
    multi('q3', 'Which contributed to the 2007–09 crisis? Select all that apply.', ['Lending to borrowers with weak credit', 'High leverage at financial firms', 'Complex securities that spread and hid risk', 'Banks holding far more equity than required'], [0, 1, 2], 'Thin equity, not excessive equity, was the problem.'),
    num('q4', 'The S&P 500 fell about 57% from its 2007 peak to its 2009 low. What percentage gain was needed to recover? Give your answer to the nearest whole per cent.', 133, '0.57 ÷ 0.43 ≈ 1.326, so about 133%.', { suffix: '%', tolerance: 1, working: '1 ÷ 0.43 = 2.326; 2.326 − 1 = 1.326', final: true }),
    recap('Subprime lending, securitisation and leverage built up hidden risk.', 'Northern Rock (2007) and Lehman Brothers (15 September 2008) were turning points.', 'Thin equity means small asset falls can wipe a firm out.'),
  ],
)

const modernShocks = lesson(
  {
    title: 'Euro debt, COVID and the gilt crisis',
    description: 'Three very different shocks from the 2010s and 2020s.',
    objectives: ['Outline the eurozone debt crisis', 'Describe the 2020 COVID crash and recovery', 'Explain the 2022 UK gilt and LDI crisis'],
    tags: ['hi-modern-shocks'],
    difficulty: 2,
  },
  [
    text(
      'The eurozone debt crisis',
      'From **2010**, investors worried that some eurozone governments — notably **Greece**, as well as Ireland, Portugal, Spain and Italy — could not repay their debts. Borrowing costs soared and bailouts followed, with tough spending cuts. Pressure eased after the European Central Bank pledged in **2012** to do “whatever it takes” to preserve the euro.',
    ),
    key('The COVID crash of 2020', 'As the pandemic spread, the **S&P 500** fell roughly **34%** in about a month, from mid-February to late March **2020** — one of the fastest falls on record. Huge central bank and government support followed, and the index reached a **new high by August 2020**.'),
    num('q1', 'An index falls from 3,400 to 2,244. What is the percentage fall?', 34, '(3,400 − 2,244) ÷ 3,400 = 1,156 ÷ 3,400 = 34%.', { suffix: '%', tolerance: 0.01 }),
    tf('q2', 'Investors who sold at the March 2020 low and stayed in cash missed a recovery to new highs within months.', true, 'True. The S&P 500 regained its February 2020 peak by August 2020.'),
    ukus('UK: the 2022 gilt crisis', 'After the **September 2022 mini-budget** announced large unfunded tax cuts, UK government bond (**gilt**) prices fell sharply. Many pension schemes used **liability-driven investment (LDI)** strategies with borrowed money; falling gilt prices triggered collateral calls, forcing them to sell gilts — pushing prices down further. The **Bank of England** stepped in with temporary gilt purchases to restore order.'),
    diagram({ type: 'compare', columns: [{ title: 'Eurozone 2010–12', tone: 'sky', points: ['Government debt fears', 'Bailouts and austerity', 'ECB “whatever it takes”'] }, { title: 'COVID 2020', tone: 'coral', points: ['Sudden health shock', 'Fall of roughly 34% in a month', 'New highs by August'] }, { title: 'UK gilts 2022', tone: 'violet', points: ['Mini-budget shock', 'Leveraged LDI selling', 'Bank of England intervention'] }] }, 'Different triggers, familiar themes: confidence, leverage and forced selling.'),
    match('q3', 'Match each crisis with its central feature.', [['Eurozone crisis', 'Fears over government debt'], ['COVID crash', 'A sudden pandemic shock'], ['UK gilt crisis', 'Forced selling by leveraged pension strategies']], 'Each crisis had a distinct trigger.'),
    mcq('q4', 'What common thread links the 2022 gilt crisis with 1929 margin calls?', ['Both were caused by tulips', 'Leverage forced sales that pushed prices down further', 'Both involved Greek debt', 'Neither involved borrowing'], 1, 'In both cases, borrowed money turned falling prices into forced selling — a self-reinforcing spiral.', { final: true }),
    recap('Eurozone crisis: government debt fears from 2010, eased after 2012.', 'COVID: S&P 500 fell roughly 34% in about a month, then hit new highs by August 2020.', 'UK 2022: mini-budget, LDI forced selling and Bank of England intervention.'),
  ],
)

const lessons = lesson(
  {
    title: 'Lessons from history',
    description: 'What centuries of manias and crashes teach investors.',
    objectives: ['Apply recovery maths to losses', 'Explain why diversification and time in the market help', 'Recognise behavioural traps that repeat across crises'],
    tags: ['hi-lessons'],
    difficulty: 2,
  },
  [
    key('Losses are lopsided', 'A **50% loss needs a 100% gain** to get back to where you started. £10,000 falling to £5,000 must double to return to £10,000. Avoiding very large losses — for example by not concentrating everything in one hot asset — matters a lot.'),
    num('q1', 'Your investment falls 50%. What percentage gain do you need to get back to your starting value?', 100, '0.5 ÷ (1 − 0.5) = 1, so 100%.', { suffix: '%', tolerance: 0.01 }),
    num('q2', 'Your investment falls 20%. What percentage gain do you need to recover?', 25, '0.2 ÷ 0.8 = 0.25, so 25%.', { suffix: '%', tolerance: 0.01 }),
    numbers('Patterns that repeat', [['Leverage', '1929 margin calls, 2008 banks, 2022 LDI'], ['Herd behaviour', 'Tulips, South Sea, dot-com'], ['“This time is different”', 'Paper money in 1720, the internet in 2000'], ['Recovery after panic', '1987, 2009, 2020']], 'History does not repeat exactly, but its themes recur.'),
    key('What has helped long-term investors', '- **Diversification**: spreading money across many companies, sectors and countries so no single bubble sinks you.\n- **Staying invested**: the best days often come soon after the worst, so selling in panic can lock in losses.\n- **Avoiding heavy borrowing**: leverage can force you to sell at the bottom.\n- **Patience**: some recoveries take months, others decades.'),
    warn('No guarantees', 'Broad markets have recovered from every past crash, but some took a very long time, and individual shares can fall to zero and never come back. History is a guide, not a promise. This is education, not personal advice.'),
    multi('q3', 'Which habits help investors survive bubbles and crashes? Select all that apply.', ['Diversifying across many investments', 'Avoiding heavy borrowing to invest', 'Selling everything after every sharp fall', 'Being sceptical of “this time is different”'], [0, 1, 3], 'Panic selling tends to lock in losses and miss recoveries.'),
    scaleStep(),
    mcq('q4', 'A friend says a hot new asset “can’t fall because everyone is buying it”. Which historical lesson applies most directly?', ['Prices only fall when interest rates rise', 'Herd behaviour can drive prices far above value — and reverse suddenly', 'Popular assets are always fairly valued', 'Diversification guarantees profits'], 1, 'From tulips to dot-com, popularity alone has never protected prices.', { final: true }),
    recap('A 50% loss needs a 100% gain to recover.', 'Leverage, herd behaviour and “this time is different” recur in every era.', 'Diversification, patience and avoiding forced selling have helped long-term investors.'),
  ],
)

function scaleStep() {
  return diagram(
    {
      type: 'scale',
      left: 'Smaller loss, easy recovery',
      right: 'Bigger loss, long climb back',
      items: [
        { label: '−10%: +11%', position: 10, tone: 'mint' },
        { label: '−34%: +52%', position: 34, tone: 'sky' },
        { label: '−50%: +100%', position: 50, tone: 'sun' },
        { label: '−78%: +355%', position: 78, tone: 'violet' },
        { label: '−89%: +809%', position: 92, tone: 'coral' },
      ],
    },
    'Loss and the gain needed to recover, rounded. The 1929–32 fall of about 89% needed a gain of roughly 800%.',
  )
}

export const c13 = course({
  id: 'c13',
  slug: 'bubbles-and-crises',
  title: 'Financial History: Bubbles and Crises',
  tagline: 'Learn from the markets’ greatest mistakes.',
  description: 'Explore four centuries of manias, panics and crashes — from Dutch tulips and the South Sea Bubble to 1929, the dot-com bust, the global financial crisis, COVID and the 2022 UK gilt crisis — and draw out the lessons that still apply to investors today.',
  colour: 'mint',
  icon: 'scroll',
  outcomes: [
    'Describe the classic stages of a bubble and recognise its warning signs',
    'Explain the causes and consequences of major crashes from 1637 to 2022',
    'Calculate falls from peak and the gains needed to recover',
    'Draw lessons on leverage, herd behaviour, diversification and staying invested',
  ],
  units: [
    {
      title: 'Anatomy of a bubble',
      description: 'Stages, tulips and the bubbles of 1720.',
      lessons: [bubbleStages, tulipMania, southSea],
      checkpoint: {
        concept: 'hi-bubble-stages',
        questions: [
          orderQ('c1', 'Order the stages of a bubble.', ['Displacement', 'Boom', 'Euphoria', 'Profit-taking', 'Panic'], 'New story, boom, euphoria, profit-taking, panic.', { concept: 'hi-bubble-stages' }),
          mcqQ('c2', 'Which phrase is a classic warning sign of a bubble?', ['“Valuations look stretched”', '“This time is different”', '“Diversify your risk”', '“Past performance is no guide”'], 1, 'Claims that old rules no longer apply recur in bubbles.', { concept: 'hi-bubble-stages' }),
          tfQ('c3', 'Tulip mania collapsed in early 1637.', true, 'Prices collapsed in February 1637.', { concept: 'hi-tulips' }),
          tfQ('c4', 'Historians agree tulip mania wrecked the entire Dutch economy.', false, 'Its scale and impact are debated.', { concept: 'hi-tulips' }),
          numQ('c5', 'A share rises to £800 and then falls to £200. What is the percentage fall from the peak?', 75, '(£800 − £200) ÷ £800 = 75%.', { suffix: '%', tolerance: 0.01, concept: 'hi-south-sea' }),
          matchQ('c6', 'Match each bubble with its country.', [['South Sea Bubble', 'Britain'], ['Mississippi Company', 'France'], ['Tulip mania', 'Dutch Republic']], 'Britain, France and the Dutch Republic respectively.', { concept: 'hi-south-sea' }),
        ],
      },
    },
    {
      title: 'Crashes of the 20th century',
      description: '1929, Black Monday and the dot-com bust.',
      lessons: [crash1929, blackMonday, dotcom],
      checkpoint: {
        concept: 'hi-1929',
        questions: [
          mcqQ('c1', 'Buying shares with a small deposit and a loan from your broker is called…', ['short selling', 'buying on margin', 'dividend reinvestment', 'hedging'], 1, 'Margin buying was widespread in 1929.', { concept: 'hi-1929' }),
          numQ('c2', 'An index peaks at 400 and falls to 44. What is the percentage fall?', 89, '(400 − 44) ÷ 400 = 356 ÷ 400 = 89%.', { suffix: '%', tolerance: 0.01, concept: 'hi-1929' }),
          tfQ('c3', 'On Black Monday 1987 the Dow fell about 22.6% in a single day.', true, 'Its largest one-day percentage fall.', { concept: 'hi-1987' }),
          numQ('c4', 'A $50,000 portfolio falls 20% in one day. What is it worth?', 40000, '$50,000 × 0.8 = $40,000.', { prefix: '$', tolerance: 1, concept: 'hi-1987' }),
          numQ('c5', 'After a 75% fall, what percentage gain is needed to recover?', 300, '0.75 ÷ 0.25 = 3, so 300%.', { suffix: '%', tolerance: 0.01, concept: 'hi-dotcom' }),
          orderQ('c6', 'Put these crashes in chronological order.', ['Wall Street Crash', 'Black Monday', 'Dot-com bust'], '1929, 1987, 2000–02.', { concept: 'hi-dotcom' }),
        ],
      },
    },
    {
      title: 'Modern crises and lessons',
      description: '2008, euro debt, COVID, gilts — and what they teach.',
      lessons: [gfc, modernShocks, lessons],
      checkpoint: {
        concept: 'hi-gfc',
        questions: [
          mcqQ('c1', 'On what date did Lehman Brothers file for bankruptcy?', ['15 September 2008', '19 October 1987', '24 October 1929', '23 March 2020'], 0, '15 September 2008.', { concept: 'hi-gfc' }),
          numQ('c2', 'A bank has £200bn of assets and £5bn of equity. What percentage fall in assets wipes out its equity?', 2.5, '£5bn ÷ £200bn = 2.5%.', { suffix: '%', tolerance: 0.01, concept: 'hi-gfc' }),
          tfQ('c3', 'After the COVID crash, the S&P 500 reached a new high by August 2020.', true, 'The recovery took only months.', { concept: 'hi-modern-shocks' }),
          mcqQ('c4', 'What prompted the Bank of England’s gilt market intervention in 2022?', ['A run on Northern Rock', 'Forced selling by LDI pension strategies after the mini-budget', 'Greek debt default', 'The collapse of Lehman Brothers'], 1, 'Falling gilt prices triggered collateral calls on leveraged LDI funds.', { concept: 'hi-modern-shocks' }),
          numQ('c5', 'After a 50% loss, what percentage gain is needed to recover?', 100, '0.5 ÷ 0.5 = 1, so 100%.', { suffix: '%', tolerance: 0.01, concept: 'hi-lessons' }),
          multiQ('c6', 'Which recurring themes appear across financial crises? Select all that apply.', ['Leverage', 'Herd behaviour', '“This time is different” thinking', 'Guaranteed quick recoveries'], [0, 1, 2], 'Recoveries are never guaranteed and can take decades.', { concept: 'hi-lessons' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'hi-lessons',
    questions: [
      orderQ('e1', 'Order the stages of a bubble.', ['Displacement', 'Boom', 'Euphoria', 'Profit-taking', 'Panic'], 'The Minsky–Kindleberger pattern.', { concept: 'hi-bubble-stages' }),
      mcqQ('e2', 'Tulip mania took place in…', ['Britain in 1720', 'France in 1719', 'the Dutch Republic in the 1630s', 'the US in the 1920s'], 2, 'It peaked in early 1637.', { concept: 'hi-tulips' }),
      tfQ('e3', 'Isaac Newton reportedly lost money in the South Sea Bubble.', true, 'He is said to have bought back in near the top.', { concept: 'hi-south-sea' }),
      matchQ('e4', 'Match each person with their story.', [['John Law', 'Mississippi Company'], ['Hyman Minsky', 'Financial instability and bubble stages'], ['Isaac Newton', 'South Sea losses']], 'Law ran the French scheme; Minsky described instability; Newton lost on South Sea shares.', { concept: 'hi-south-sea' }),
      numQ('e5', 'The Dow fell from about 381 in 1929 to about 41 in 1932. Roughly what percentage fall is that, to the nearest whole per cent?', 89, '(381 − 41) ÷ 381 ≈ 89%.', { suffix: '%', tolerance: 0.5, concept: 'hi-1929' }),
      mcqQ('e6', 'In nominal terms, when did the Dow regain its 1929 peak?', ['1932', '1939', '1945', '1954'], 3, 'About 25 years later, in 1954.', { concept: 'hi-1929' }),
      numQ('e7', 'A £20,000 portfolio falls 22.6% in a day. What is it worth?', 15480, '£20,000 × 0.774 = £15,480.', { prefix: '£', tolerance: 1, concept: 'hi-1987' }),
      tfQ('e8', 'Portfolio insurance automatically bought more shares as prices fell.', false, 'It sold futures as prices fell, adding to the pressure.', { concept: 'hi-1987' }),
      numQ('e9', 'The Nasdaq falls from 5,000 to 1,100. What is the percentage fall?', 78, '3,900 ÷ 5,000 = 78%.', { suffix: '%', tolerance: 0.01, concept: 'hi-dotcom' }),
      mcqQ('e10', 'The Nasdaq Composite peaked during the dot-com bubble in…', ['March 2000', 'October 1987', 'September 2008', 'February 2020'], 0, 'March 2000, before falling roughly 78% by October 2002.', { concept: 'hi-dotcom' }),
      orderQ('e11', 'Put these crisis events in order.', ['Run on Northern Rock', 'Lehman Brothers bankruptcy', 'Greek bailout and eurozone debt crisis', 'COVID crash', 'UK gilt and LDI crisis'], '2007, 2008, 2010, 2020, 2022.', { concept: 'hi-gfc' }),
      multiQ('e12', 'Which contributed to the 2007–09 global financial crisis? Select all that apply.', ['Subprime mortgage lending', 'Securitisation spreading risk', 'High leverage at banks', 'Tulip futures'], [0, 1, 2], 'Tulips belong to the 1630s.', { concept: 'hi-gfc' }),
      numQ('e13', 'The S&P 500 falls 34%. What percentage gain is needed to recover? Give your answer to the nearest whole per cent.', 52, '0.34 ÷ 0.66 ≈ 0.515, so about 52%.', { suffix: '%', tolerance: 1, concept: 'hi-modern-shocks' }),
      numQ('e14', 'An investment falls 60%. What percentage gain is needed to recover?', 150, '0.6 ÷ 0.4 = 1.5, so 150%.', { suffix: '%', tolerance: 0.01, concept: 'hi-lessons' }),
      tfQ('e15', 'History shows broad diversification and avoiding forced selling have helped investors get through crashes.', true, 'They limit the damage from any single bubble and avoid locking in losses — though nothing is guaranteed.', { concept: 'hi-lessons' }),
    ],
  },
})
