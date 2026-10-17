import { course, diagram, example, key, lesson, match, matchQ, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, ukus, warn } from '../builders'

const moneyLedgers = lesson(
  {
    title: 'Money, ledgers and blockchains',
    description: 'What money does and how a shared ledger records it.',
    objectives: ['Describe the three jobs of money', 'Explain what a ledger and a blockchain are', 'Outline how a decentralised network agrees on records'],
    tags: ['cr-blockchain'],
  },
  [
    text(
      'What money does',
      'Money does three jobs. It is a **medium of exchange** (you can pay with it), a **unit of account** (prices are quoted in it) and a **store of value** (it holds purchasing power over time). Pounds and dollars do all three reasonably well, backed by central banks and governments.',
    ),
    key('Ledgers', 'A **ledger** is a record of who owns what and who paid whom. Your bank keeps a ledger of your account. Normally one trusted organisation keeps the ledger and can correct it.'),
    key('Blockchains', 'A **blockchain** is a ledger copied across many computers (**nodes**). New transactions are grouped into **blocks**, and each block is linked to the one before using cryptography, forming a chain. Changing an old record would mean redoing every block after it — and persuading most of the network to accept the change.'),
    diagram({ type: 'flow', nodes: [{ label: 'Transaction sent', sub: 'Signed with a private key', tone: 'sky' }, { label: 'Network checks it', sub: 'Nodes verify the signature', tone: 'violet' }, { label: 'Added to a block', sub: 'By a miner or validator', tone: 'sun' }, { label: 'Block joins the chain', sub: 'Very hard to reverse', tone: 'mint' }] }, 'A simplified view of how a transaction is recorded on a public blockchain.'),
    match('q1', 'Match each job of money with an example.', [['Medium of exchange', 'Paying for a coffee'], ['Unit of account', 'A price tag reading £3.50'], ['Store of value', 'Saving for next year']], 'Money lets you pay, compare prices and hold value over time.'),
    mcq('q2', 'What makes a public blockchain different from a bank’s ledger?', ['It is copied across many computers rather than kept by one organisation', 'It is always backed by a government', 'It guarantees prices only go up', 'Transactions on it can easily be reversed by a helpdesk'], 0, 'A public blockchain is shared and maintained by a network, with no single keeper who can reverse entries.'),
    tf('q3', 'Because a blockchain is hard to alter, any asset recorded on it must be a good investment.', false, 'False. A secure record says nothing about whether the thing recorded is worth anything. Technology and investment value are separate questions.', { final: true }),
    recap('Money is a medium of exchange, unit of account and store of value.', 'A blockchain is a shared ledger of linked blocks kept by many nodes.', 'A secure ledger does not make an asset a sound investment.'),
  ],
)

const bitcoinBasics = lesson(
  {
    title: 'Bitcoin basics',
    description: 'A fixed supply, proof of work and the halving.',
    objectives: ['Describe Bitcoin’s origins and supply cap', 'Explain proof of work in simple terms', 'Calculate the effect of halvings on the block reward'],
    tags: ['cr-bitcoin'],
  },
  [
    text(
      'The first cryptocurrency',
      '**Bitcoin** was described in a 2008 paper by the pseudonymous **Satoshi Nakamoto** and the network launched in **2009**. It was designed as electronic cash that works without a bank or central authority.',
    ),
    key('A fixed supply', 'The Bitcoin protocol caps total supply at **21 million** bitcoin. New coins are released to **miners** as a reward for adding blocks, and the reward **halves** roughly every four years. Supporters call this scarcity a feature; critics note that scarcity alone does not create value.'),
    key('Proof of work', 'In **proof of work**, miners compete to solve a costly computational puzzle. The winner adds the next block and earns the reward. This makes rewriting history very expensive — but it also uses a large amount of electricity, which is a frequent criticism.'),
    numbers('The block reward over time', [['2009 launch', '50 BTC per block'], ['After 1st halving (2012)', '25 BTC'], ['After 2nd halving (2016)', '12.5 BTC'], ['After 3rd halving (2020)', '6.25 BTC'], ['After 4th halving (2024)', '3.125 BTC']], 'The reward halves roughly every 210,000 blocks — about every four years.'),
    num('q1', 'Suppose 19.8 million bitcoin have been created. How many million are left to be created before the 21 million cap?', 1.2, '21 − 19.8 = 1.2 million.', { suffix: 'm', tolerance: 0.001 }),
    num('q2', 'If the block reward is 3.125 BTC, what will it be after the next halving?', 1.5625, '3.125 ÷ 2 = 1.5625 BTC.', { suffix: 'BTC', tolerance: 0.0001 }),
    mcq('q3', 'What do miners provide in a proof-of-work system?', ['Interest payments to holders', 'Computing power to add and secure new blocks', 'A government guarantee', 'Customer refunds'], 1, 'Miners spend computing power (and electricity) to add blocks and secure the ledger.'),
    tf('q4', 'A fixed supply of 21 million guarantees that Bitcoin’s price will rise over time.', false, 'False. Price depends on demand as well as supply. If demand falls, a capped supply does not stop the price falling.', { final: true }),
    recap('Bitcoin launched in 2009 with a supply cap of 21 million.', 'Proof of work: miners spend energy to add blocks and earn rewards.', 'Scarcity does not guarantee value — demand matters too.'),
  ],
)

const ethereumStablecoins = lesson(
  {
    title: 'Ethereum, tokens and stablecoins',
    description: 'Smart contracts, the Merge and coins that try to hold a peg.',
    objectives: ['Explain smart contracts and tokens', 'Distinguish proof of stake from proof of work', 'Compare fiat-backed and algorithmic stablecoins'],
    tags: ['cr-ethereum', 'cr-stablecoins'],
    difficulty: 2,
  },
  [
    key('Ethereum and smart contracts', '**Ethereum** is a blockchain that can run programs called **smart contracts**: code that executes automatically when conditions are met. Its native coin is **ether (ETH)**. Smart contracts power lending apps, exchanges and **tokens** — digital assets created on top of an existing blockchain.'),
    key('Proof of stake', 'In September 2022 Ethereum switched from proof of work to **proof of stake** in an upgrade known as **“the Merge”**. Instead of miners using electricity, **validators** lock up (“stake”) ETH as a deposit and can lose part of it if they cheat. This cut Ethereum’s energy use dramatically.'),
    warn('Code can fail', 'Smart contracts do exactly what they are written to do — including bugs. Hacks and coding errors have caused large losses, and there is often no one to reverse them.'),
    key('Stablecoins', 'A **stablecoin** aims to hold a steady value, usually $1.\n- **Fiat-backed** stablecoins claim to hold cash and short-term government bonds as reserves. The risk is whether the reserves are really there and can be accessed.\n- **Algorithmic** stablecoins rely on code and market incentives rather than full reserves. They can break down badly under stress.'),
    example('TerraUSD, May 2022', '**TerraUSD (UST)** was an algorithmic stablecoin meant to be worth $1, linked to a sister token, LUNA. In May 2022 it lost its peg and collapsed within days, falling to a few cents. LUNA became almost worthless and tens of billions of dollars of value were wiped out.'),
    num('q1', 'You hold 2,000 units of a $1 stablecoin. It loses its peg and trades at $0.08. What are your holdings worth now?', 160, '2,000 × $0.08 = $160 — a 92% loss.', { prefix: '$', tolerance: 0.01 }),
    match('q2', 'Match each term with its description.', [['Proof of work', 'Miners spend electricity to add blocks'], ['Proof of stake', 'Validators lock up coins as a deposit'], ['Smart contract', 'Code that runs automatically on a blockchain'], ['Token', 'A digital asset built on an existing blockchain']], 'These are the core building blocks of Ethereum and similar networks.'),
    multi('q3', 'Which statements about stablecoins are correct? Select all that apply.', ['They aim to track a reference value such as $1', 'Algorithmic stablecoins have collapsed in practice', 'They are guaranteed by the Bank of England', 'Fiat-backed coins depend on the issuer’s reserves'], [0, 1, 3], 'Stablecoins are not central bank money. Their stability depends on reserves or mechanisms that can fail.', { final: true }),
    recap('Ethereum runs smart contracts and moved to proof of stake in 2022 (“the Merge”).', 'Tokens are assets built on existing blockchains.', 'Stablecoins can lose their peg — TerraUSD collapsed in May 2022.'),
  ],
)

const walletsKeys = lesson(
  {
    title: 'Wallets and keys',
    description: 'Who really controls your crypto — and how you can lose it.',
    objectives: ['Explain public and private keys', 'Compare custodial and self-custody wallets', 'Protect a seed phrase'],
    tags: ['cr-wallets'],
    difficulty: 2,
  },
  [
    key('Keys, not coins', 'A crypto **wallet** doesn’t hold coins; the coins stay on the blockchain. The wallet holds **keys**. Your **public address** is like an account number you can share. Your **private key** proves ownership and authorises payments — anyone who has it can move your funds.'),
    key('Seed phrases', 'Most wallets generate a **seed phrase** (usually 12 or 24 words) that can recreate all your keys. Write it down offline and **never share it** — no genuine company, support agent or wallet app will ever ask for it.'),
    diagram({ type: 'compare', columns: [{ title: 'Custodial', tone: 'sky', points: ['An exchange holds the keys for you', 'Easy to use and recover a login', 'You rely on the firm staying solvent and honest'] }, { title: 'Self-custody', tone: 'violet', points: ['You hold your own keys', 'No firm can freeze or lose your coins', 'Lose the seed phrase and the funds are gone for good'] }] }, 'Neither option is risk-free; the risks are different.'),
    text('“Not your keys, not your coins”', 'This common saying means that if a company holds your keys, you are trusting that company. If it fails, freezes withdrawals or is hacked, you may become an unsecured creditor rather than an owner.'),
    mcq('q1', 'Which piece of information can you safely share so someone can send you crypto?', ['Your seed phrase', 'Your private key', 'Your public address', 'Your wallet password'], 2, 'The public address is designed to be shared. The others give control of your funds.'),
    tf('q2', 'If you lose the seed phrase to a self-custody wallet, the wallet provider can usually reset it for you.', false, 'False. With true self-custody, nobody else has your keys. Losing the seed phrase usually means losing access permanently.'),
    multi('q3', 'A “support agent” messages you and asks for your 12-word seed phrase to fix a problem. Which responses are sensible? Select all that apply.', ['Refuse — genuine support never needs it', 'Send only the first six words', 'Stop replying and report the account', 'Type it into the link they send'], [0, 2], 'Any request for a seed phrase is a scam. Even part of it helps an attacker.', { final: true }),
    recap('Wallets hold keys; the private key or seed phrase controls the funds.', 'Custodial: convenient but you trust a firm. Self-custody: control but full responsibility.', 'Never share a seed phrase with anyone.'),
  ],
)

const exchangesCounterparty = lesson(
  {
    title: 'Exchanges and counterparty risk',
    description: 'What can go wrong when a firm holds your assets.',
    objectives: ['Define counterparty risk', 'Describe the FTX collapse', 'Calculate the cost of fees and spreads'],
    tags: ['cr-exchanges'],
    difficulty: 2,
  },
  [
    text(
      'How most people buy',
      'Most people buy crypto through an **exchange** or app. The exchange matches buyers and sellers and usually holds customers’ assets. Costs include trading **fees** and the **spread** — the gap between the buying and selling price.',
    ),
    key('Counterparty risk', '**Counterparty risk** is the risk that the firm on the other side fails to do what it promised — for example, returning your assets. Crypto exchanges have not generally had the same protections as banks: in the UK, crypto held on an exchange is not covered by the **Financial Services Compensation Scheme (FSCS)**.'),
    example('FTX, November 2022', '**FTX** was one of the world’s largest crypto exchanges. In November 2022, customers rushed to withdraw, it emerged that customer funds had been misused, and the firm filed for bankruptcy. Withdrawals were frozen and customers waited years for repayment through the bankruptcy process. Its founder was later convicted of fraud in the US.'),
    num('q1', 'An app charges a 1.5% fee. How much is the fee on a £400 purchase?', 6, '£400 × 1.5% = £6.', { prefix: '£', tolerance: 0.01 }),
    num('q2', 'A coin’s buy price is $102 and its sell price is $98. If you buy and immediately sell, what percentage of your purchase price do you lose to the spread? (Round to 1 decimal place.)', 3.9, '($102 − $98) ÷ $102 ≈ 3.9%.', { suffix: '%', tolerance: 0.05 }),
    multi('q3', 'Which are signs of higher counterparty risk at an exchange? Select all that apply.', ['Promises of very high guaranteed yields on deposits', 'Little transparency about where customer assets are held', 'Sudden limits on withdrawals', 'Clear, regularly audited segregation of customer assets'], [0, 1, 2], 'Audited segregation of client assets reduces risk; the others are warning signs.'),
    tf('q4', 'In the UK, crypto held on an exchange is protected by the FSCS in the same way as a bank deposit.', false, 'False. The FSCS does not cover crypto held on exchanges. If the firm fails, you could lose some or all of it.', { final: true }),
    recap('Exchanges are convenient but hold your assets — that is counterparty risk.', 'FTX collapsed in November 2022 after misusing customer funds.', 'Fees and spreads are real costs; UK crypto is not FSCS-protected.'),
  ],
)

const volatilityValuation = lesson(
  {
    title: 'Volatility and valuation',
    description: 'Deep drawdowns and why crypto is hard to value.',
    objectives: ['Calculate a drawdown and the gain needed to recover', 'Explain why assets without cash flows are hard to value', 'Describe crypto’s historical volatility'],
    tags: ['cr-volatility'],
    difficulty: 3,
  },
  [
    key('Drawdowns', 'A **drawdown** is the fall from a peak to a later low. Bitcoin has had **several drawdowns of more than 70%** — including in 2014–15, 2018 and 2022. Many smaller coins have fallen 90% or more and never recovered.'),
    num('q1', 'A coin falls from $60,000 to $18,000. What is the drawdown?', 70, '($60,000 − $18,000) ÷ $60,000 = 70%.', { suffix: '%', tolerance: 0.01 }),
    key('The maths of recovery', 'Losses and gains are not symmetrical. After a 50% fall you need a 100% gain to get back to where you started. After a 75% fall you need 300%.'),
    diagram({ type: 'bars', unit: '%', bars: [{ label: '−25% fall', value: 33.3, tone: 'mint' }, { label: '−50% fall', value: 100, tone: 'sun' }, { label: '−75% fall', value: 300, tone: 'coral' }, { label: '−90% fall', value: 900, tone: 'violet' }] }, 'Gain needed to recover from each fall: 1 ÷ (1 − loss) − 1.'),
    num('q2', 'After an 80% fall, what percentage gain is needed to get back to the original price?', 400, 'You are left with 20% of the value. 100 ÷ 20 = 5×, so you need a 400% gain.', { suffix: '%', tolerance: 0.5 }),
    text(
      'No cash flows',
      'A share is a claim on a company’s future profits; a bond pays interest. Most cryptoassets produce **no cash flows** at all. Their price depends on what the next buyer will pay, which is driven by adoption, sentiment and speculation. That makes a “fair value” very hard to estimate — and prices can swing wildly on news or social media.',
    ),
    mcq('q3', 'Why is valuing bitcoin harder than valuing a profitable company?', ['Bitcoin has too many shareholders', 'It produces no earnings or dividends to discount', 'Its price is set by the Bank of England', 'It cannot be bought in pounds'], 1, 'Without cash flows, methods like discounted cash flow don’t apply; price rests on demand alone.'),
    tf('q4', 'A coin that has fallen 90% is likely to be cheap, so it is a safe buy.', false, 'False. A large fall says nothing about value. Many coins that fell 90% kept falling or disappeared entirely.', { final: true }),
    recap('Crypto has had repeated drawdowns of 70%+.', 'Recovery needs a bigger gain than the loss: −80% needs +400%.', 'No cash flows means no anchor for valuation.'),
  ],
)

const scams = lesson(
  {
    title: 'Spotting crypto scams',
    description: 'Pump-and-dumps, rug pulls, fake giveaways and romance scams.',
    objectives: ['Name common crypto scams', 'Recognise red flags', 'Respond safely to suspicious approaches'],
    tags: ['cr-scams'],
    difficulty: 2,
  },
  [
    text(
      'Why crypto attracts scams',
      'Transactions are fast, global and usually irreversible, and the market is lightly regulated in many places. That makes crypto attractive to fraudsters. Money sent to a scammer is very rarely recovered.',
    ),
    key('Common scams', '- **Pump-and-dump**: promoters hype a small coin, then sell to the buyers they attracted.\n- **Rug pull**: a project’s creators vanish with investors’ money.\n- **Fake giveaways**: “send 1 coin, get 2 back”, often using a celebrity’s name or image.\n- **Romance or “pig-butchering” scams**: a stranger builds trust over weeks, then steers you to a fake trading platform that shows fake profits.\n- **Impersonation**: fake exchanges, support staff, regulators or apps.'),
    match('q1', 'Match each scam with its description.', [['Pump-and-dump', 'Hype a coin, then sell to new buyers'], ['Rug pull', 'Creators disappear with the funds'], ['Fake giveaway', 'Send crypto to get double back'], ['Pig-butchering', 'Long-term fake relationship leading to a fake platform']], 'Knowing the patterns makes them easier to spot.'),
    warn('Red flags', 'Guaranteed or very high returns. Pressure to act fast. Unsolicited contact. Requests for your seed phrase or remote access to your device. A platform that lets you deposit but charges “fees” or “taxes” before you can withdraw.'),
    multi('q2', 'Which are red flags? Select all that apply.', ['A guaranteed 2% daily return', 'An online friend urging you to use their trading site', 'Being asked to pay a “release fee” before withdrawing', 'A regulator’s official warning list'], [0, 1, 2], 'Regulators’ warning lists are a tool to check firms, not a red flag.'),
    mcq('q3', 'A video shows a famous entrepreneur promising to double any bitcoin you send to an address. What is it most likely to be?', ['A genuine charity event', 'A fake giveaway scam', 'A new type of stablecoin', 'A government scheme'], 1, 'Nobody gives away free money this way. These videos are frequently faked or use hijacked accounts.'),
    tf('q4', 'If a trading platform shows large profits on your screen, those profits must be real and withdrawable.', false, 'False. Scam platforms display fake balances to encourage bigger deposits. The test is whether you can withdraw — and scammers will invent fees to stop you.', { final: true }),
    recap('Common scams: pump-and-dumps, rug pulls, fake giveaways, pig-butchering, impersonation.', 'Red flags: guaranteed returns, urgency, unsolicited contact, fees to withdraw.', 'Crypto transfers are usually irreversible — pause before sending.'),
  ],
)

const regulationTax = lesson(
  {
    title: 'Regulation and tax (educational overview)',
    description: 'What UK and US authorities say and how gains can be taxed.',
    objectives: ['Summarise the UK regulator’s stance on crypto', 'Outline the US regulatory picture', 'Explain when crypto disposals can be taxable'],
    tags: ['cr-regulation', 'cr-tax'],
    difficulty: 2,
    sources: [
      { label: 'FCA — Cryptoassets', url: 'https://www.fca.org.uk/firms/cryptoassets' },
      { label: 'GOV.UK — Check if you need to pay tax when you sell cryptoassets', url: 'https://www.gov.uk/guidance/check-if-you-need-to-pay-tax-when-you-sell-cryptoassets' },
      { label: 'IRS — Digital assets', url: 'https://www.irs.gov/filing/digital-assets' },
    ],
  },
  [
    warn('Educational only — rules change', 'Crypto rules are developing quickly in both the UK and US. This lesson gives a high-level picture, not legal or tax advice. Check fca.org.uk, gov.uk or irs.gov, or speak to a qualified adviser.'),
    ukus('UK', '- The **FCA** warns that crypto is high risk and that you should be **prepared to lose all your money**.\n- Crypto firms must **register with the FCA** for anti-money-laundering purposes. Registration does not mean the FCA protects your investment.\n- Crypto held on exchanges is not covered by the FSCS or, generally, the Financial Ombudsman Service.'),
    ukus('US', '- Regulators have long debated whether particular tokens are **securities** (overseen by the **SEC**) or **commodities** (overseen by the **CFTC**), and new legislation continues to change the picture.\n- In **January 2024** the SEC approved **spot bitcoin ETFs**, letting investors gain bitcoin exposure through a regulated fund in an ordinary brokerage account. The fund wrapper doesn’t remove bitcoin’s volatility.'),
    key('Tax: disposals count', '**UK**: HMRC treats selling crypto, swapping one crypto for another, spending it or gifting it (other than to a spouse or civil partner) as a **disposal**, which can trigger **Capital Gains Tax** on the gain.\n**US**: the **IRS** treats digital assets as **property**, so selling, swapping or spending them can create a taxable capital gain or loss. Keep records of every transaction.'),
    num('q1', 'You buy crypto for £2,500 and later sell it for £6,100. Ignoring fees, what is your gain?', 3600, '£6,100 − £2,500 = £3,600. Whether tax is due depends on your allowances and other gains.', { prefix: '£', tolerance: 0.5 }),
    mcq('q2', 'In the UK, which of these is generally a disposal for Capital Gains Tax?', ['Moving coins between two wallets you own', 'Buying crypto with pounds', 'Swapping one cryptoasset for another', 'Checking your balance'], 2, 'A crypto-to-crypto swap is a disposal. Buying, or moving between your own wallets, generally is not.'),
    match('q3', 'Match each body with its role.', [['FCA', 'Registers UK crypto firms for anti-money laundering'], ['HMRC', 'Collects UK tax on crypto gains'], ['SEC', 'US securities regulator'], ['IRS', 'US tax authority treating crypto as property']], 'Different bodies handle regulation and tax in each country.'),
    tf('q4', 'If a crypto firm is registered with the FCA, your investment is protected if the firm fails.', false, 'False. FCA registration is for anti-money-laundering supervision. It is not a guarantee, and losses are generally not covered by the FSCS.', { final: true }),
    recap('UK: the FCA warns you could lose all your money; firms register for AML.', 'US: SEC and CFTC roles debated; spot bitcoin ETFs approved January 2024.', 'Selling, swapping or spending crypto can be a taxable disposal in both countries.'),
  ],
)

const positionSizing = lesson(
  {
    title: 'Position sizing and personal limits',
    description: 'Only invest what you can afford to lose.',
    objectives: ['Calculate the portfolio impact of a crypto loss', 'Order sensible steps before considering crypto', 'Explain why speculation should be sized small'],
    tags: ['cr-position-sizing'],
    difficulty: 2,
  },
  [
    text(
      'Size decides the damage',
      'You can’t control crypto’s price, but you can control **how much** you expose yourself to. **Position sizing** means limiting any high-risk holding so that even a total loss would not derail your finances. This is educational, not a recommendation to buy crypto at all.',
    ),
    order('q1', 'Put these steps in a sensible order before taking any speculative risk.', ['Pay off high-interest debt', 'Build an emergency fund', 'Invest regularly in a diversified, long-term portfolio', 'Consider a small speculative amount you could afford to lose'], 'Foundations first. Speculation, if any, comes last and stays small.'),
    example('Sizing in numbers (hypothetical)', 'You have a £10,000 portfolio and put 5% (£500) into crypto. If crypto falls 80%, you lose £400 — 4% of the total. Put 50% (£5,000) in and the same fall costs £4,000 — 40% of the total.'),
    diagram({ type: 'donut', centre: '£10,000', slices: [{ label: 'Diversified funds', value: 85, tone: 'violet' }, { label: 'Cash', value: 10, tone: 'sky' }, { label: 'Speculative', value: 5, tone: 'coral' }] }, 'A hypothetical portfolio with a small speculative slice. Not a recommendation.'),
    num('q2', 'A £20,000 portfolio has 3% in crypto. If the crypto falls 75%, how much is lost in pounds?', 450, '3% × £20,000 = £600. £600 × 75% = £450 — about 2.25% of the portfolio.', { prefix: '£', tolerance: 0.5 }),
    num('q3', 'Another £20,000 portfolio has 40% in crypto. The crypto falls 75%. What percentage of the whole portfolio is lost?', 30, '40% × 75% = 30% of the portfolio (£6,000).', { suffix: '%', tolerance: 0.01 }),
    tf('q4', 'Borrowing money to buy crypto is a sensible way to reach a target allocation faster.', false, 'False. Borrowing magnifies losses and can leave you owing money after the asset has fallen. Only risk money you can afford to lose.', { final: true }),
    recap('Position size controls how much a crash can hurt you.', 'Debt, emergency fund and diversified investing come before speculation.', 'Only invest what you can afford to lose — never borrowed money.'),
  ],
)

export const c12 = course({
  id: 'c12',
  slug: 'crypto-and-digital-assets',
  title: 'Crypto and Digital Assets',
  tagline: 'Understand the hype, the tech and the risks.',
  description: 'A balanced, risk-focused introduction to cryptoassets: how blockchains, Bitcoin, Ethereum and stablecoins work, how wallets and exchanges can fail, why prices swing so far, how to spot scams, and what UK and US regulators and tax authorities say. Educational only — not a recommendation to buy.',
  colour: 'coral',
  icon: 'crypto',
  outcomes: [
    'Explain blockchains, Bitcoin, Ethereum, tokens and stablecoins',
    'Compare custodial and self-custody wallets and assess counterparty risk',
    'Quantify crypto volatility and recognise common scams',
    'Describe UK and US regulation and tax at an educational level, and size risk sensibly',
  ],
  units: [
    {
      title: 'How crypto works',
      description: 'Money, blockchains, Bitcoin, Ethereum and stablecoins.',
      lessons: [moneyLedgers, bitcoinBasics, ethereumStablecoins],
      checkpoint: {
        concept: 'cr-blockchain',
        questions: [
          mcqQ('c1', 'A blockchain is best described as…', ['a bank account with higher interest', 'a shared ledger copied across many computers', 'a government database of coins', 'a type of share'], 1, 'A shared, linked ledger maintained by a network.', { concept: 'cr-blockchain' }),
          numQ('c2', 'Bitcoin’s supply cap is 21 million. If 19.6 million exist, how many million remain to be created?', 1.4, '21 − 19.6 = 1.4 million.', { suffix: 'm', tolerance: 0.001, concept: 'cr-bitcoin' }),
          tfQ('c3', 'Ethereum moved from proof of work to proof of stake in 2022.', true, 'The Merge, September 2022.', { concept: 'cr-ethereum' }),
          matchQ('c4', 'Match each consensus method with who adds blocks.', [['Proof of work', 'Miners'], ['Proof of stake', 'Validators']], 'Miners spend energy; validators stake coins.', { concept: 'cr-ethereum' }),
          numQ('c5', 'You hold 500 units of a $1 stablecoin that falls to $0.30. What are they worth?', 150, '500 × $0.30 = $150.', { prefix: '$', tolerance: 0.01, concept: 'cr-stablecoins' }),
          multiQ('c6', 'Which are true of Bitcoin? Select all that apply.', ['It launched in 2009', 'It uses proof of work', 'It pays dividends to holders', 'Its block reward halves roughly every four years'], [0, 1, 3], 'Bitcoin pays no dividends.', { concept: 'cr-bitcoin' }),
        ],
      },
    },
    {
      title: 'Holding crypto and its risks',
      description: 'Wallets, exchanges, volatility and valuation.',
      lessons: [walletsKeys, exchangesCounterparty, volatilityValuation],
      checkpoint: {
        concept: 'cr-wallets',
        questions: [
          tfQ('c1', 'It is safe to share your seed phrase with an exchange’s support team.', false, 'Never share it with anyone.', { concept: 'cr-wallets' }),
          mcqQ('c2', '“Not your keys, not your coins” means…', ['keys are optional', 'if a firm holds your keys, you depend on that firm', 'coins are stored inside your phone', 'only banks can hold crypto'], 1, 'Custodial holdings carry counterparty risk.', { concept: 'cr-wallets' }),
          mcqQ('c3', 'Which event in November 2022 showed exchange counterparty risk?', ['The Merge', 'The bitcoin halving', 'The collapse of FTX', 'The launch of Bitcoin'], 2, 'FTX froze withdrawals and filed for bankruptcy.', { concept: 'cr-exchanges' }),
          numQ('c4', 'A coin falls from $40 to $10. What is the drawdown?', 75, '($40 − $10) ÷ $40 = 75%.', { suffix: '%', tolerance: 0.01, concept: 'cr-volatility' }),
          numQ('c5', 'After a 50% fall, what gain is needed to recover?', 100, '1 ÷ 0.5 − 1 = 100%.', { suffix: '%', tolerance: 0.01, concept: 'cr-volatility' }),
          tfQ('c6', 'Most cryptoassets produce cash flows such as interest or dividends.', false, 'Most produce none, which makes valuation hard.', { concept: 'cr-volatility' }),
        ],
      },
    },
    {
      title: 'Staying safe',
      description: 'Scams, regulation, tax and position sizing.',
      lessons: [scams, regulationTax, positionSizing],
      checkpoint: {
        concept: 'cr-scams',
        questions: [
          mcqQ('c1', 'Creators of a new token disappear with investors’ money. This is a…', ['rug pull', 'halving', 'stablecoin', 'spread'], 0, 'A rug pull.', { concept: 'cr-scams' }),
          tfQ('c2', 'Being asked to pay a fee before you can withdraw your “profits” is a common scam tactic.', true, 'Fake platforms invent fees to extract more money.', { concept: 'cr-scams' }),
          mcqQ('c3', 'The UK regulator for crypto firms’ anti-money-laundering registration is the…', ['SEC', 'FCA', 'IRS', 'CFTC'], 1, 'The Financial Conduct Authority.', { concept: 'cr-regulation' }),
          numQ('c4', 'Buy crypto for £1,200, sell for £3,000. Gain, ignoring fees?', 1800, '£3,000 − £1,200 = £1,800.', { prefix: '£', tolerance: 0.5, concept: 'cr-tax' }),
          numQ('c5', 'A £8,000 portfolio has 5% in crypto, which falls 60%. Loss in pounds?', 240, '£8,000 × 5% = £400; £400 × 60% = £240.', { prefix: '£', tolerance: 0.5, concept: 'cr-position-sizing' }),
          orderQ('c6', 'Order these financial priorities, first to last.', ['Clear high-interest debt', 'Build an emergency fund', 'Invest in a diversified portfolio', 'Consider a small speculative amount'], 'Foundations first; speculation last and small.', { concept: 'cr-position-sizing' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'cr-blockchain',
    questions: [
      mcqQ('e1', 'Which is NOT one of the three jobs of money?', ['Medium of exchange', 'Unit of account', 'Store of value', 'Guaranteed source of profit'], 3, 'Money pays, prices and stores value — it doesn’t guarantee profit.', { concept: 'cr-blockchain' }),
      numQ('e2', 'What is the maximum number of bitcoin that can ever exist, in millions?', 21, 'The protocol caps supply at 21 million.', { suffix: 'm', tolerance: 0, concept: 'cr-bitcoin' }),
      numQ('e3', 'A block reward of 6.25 BTC halves twice. What is it then?', 1.5625, '6.25 ÷ 2 ÷ 2 = 1.5625 BTC.', { suffix: 'BTC', tolerance: 0.0001, concept: 'cr-bitcoin' }),
      matchQ('e4', 'Match each term with its meaning.', [['Smart contract', 'Code that runs automatically on a blockchain'], ['Stablecoin', 'A token aiming to hold a fixed value'], ['Seed phrase', 'Words that can recreate your wallet keys']], 'Core crypto vocabulary.', { concept: 'cr-ethereum' }),
      tfQ('e5', 'TerraUSD was an algorithmic stablecoin that collapsed in May 2022.', true, 'It lost its $1 peg and fell to a few cents.', { concept: 'cr-stablecoins' }),
      mcqQ('e6', 'What does a self-custody wallet mean?', ['An exchange holds your keys', 'You hold your own private keys', 'Your coins are insured by the FSCS', 'The government stores your coins'], 1, 'You control the keys — and bear full responsibility.', { concept: 'cr-wallets' }),
      tfQ('e7', 'Crypto held on a UK exchange is covered by the FSCS.', false, 'It is not FSCS-protected.', { concept: 'cr-exchanges' }),
      numQ('e8', 'A 2% fee on a $750 purchase is how much?', 15, '$750 × 2% = $15.', { prefix: '$', tolerance: 0.01, concept: 'cr-exchanges' }),
      numQ('e9', 'A coin falls from £5.00 to £0.50. What is the drawdown?', 90, '(£5.00 − £0.50) ÷ £5.00 = 90%.', { suffix: '%', tolerance: 0.01, concept: 'cr-volatility' }),
      numQ('e10', 'After a 75% fall, what percentage gain is needed to recover?', 300, '1 ÷ 0.25 − 1 = 3, i.e. 300%.', { suffix: '%', tolerance: 0.5, concept: 'cr-volatility' }),
      multiQ('e11', 'Which are common crypto scams? Select all that apply.', ['Pump-and-dump', 'Rug pull', 'Pig-butchering', 'Spot bitcoin ETF'], [0, 1, 2], 'A spot bitcoin ETF is a regulated fund, though still volatile.', { concept: 'cr-scams' }),
      mcqQ('e12', 'In which month and year did the SEC approve spot bitcoin ETFs?', ['September 2022', 'November 2022', 'January 2024', 'January 2009'], 2, 'January 2024.', { concept: 'cr-regulation' }),
      mcqQ('e13', 'How does the IRS treat digital assets for tax?', ['As foreign currency', 'As property', 'As tax-free', 'As dividends'], 1, 'Property: disposals can create capital gains or losses.', { concept: 'cr-tax' }),
      orderQ('e14', 'Order the steps of recording a blockchain transaction.', ['Transaction signed and sent', 'Network verifies it', 'Added to a block', 'Block joins the chain'], 'Sign, verify, include, chain.', { concept: 'cr-blockchain' }),
      numQ('e15', 'A £15,000 portfolio has 4% in crypto, which falls 90%. What percentage of the portfolio is lost?', 3.6, '4% × 90% = 3.6% (£540).', { suffix: '%', tolerance: 0.01, concept: 'cr-position-sizing' }),
    ],
  },
})
