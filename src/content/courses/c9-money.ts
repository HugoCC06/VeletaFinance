import { course, diagram, example, key, lesson, match, matchQ, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, ukus, warn } from '../builders'

const budgetingBasics = lesson(
  {
    title: 'Building a simple budget',
    description: 'Needs, wants and the 50/30/20 rule.',
    objectives: ['Tell needs from wants', 'Apply the 50/30/20 rule to take-home pay', 'Explain why tracking spending matters'],
    tags: ['mb-budgeting'],
  },
  [
    text(
      'A plan for your money',
      'A **budget** is a plan for where your money goes before you spend it. It isn’t about never having fun. It’s about making sure the essentials are covered, the fun is affordable and something is left over for the future.',
    ),
    key('Needs versus wants', '**Needs** are costs you must pay to live and work: rent, basic food, bills, transport to work or university.\n\n**Wants** are nice to have: takeaways, streaming, new clothes beyond the basics, nights out.\n\nThe line can be blurry — a phone is a need, the latest model is a want.'),
    match('q1', 'Match each cost to the category it usually belongs in.', [['Rent', 'Need'], ['Weekly food shop', 'Need'], ['Concert tickets', 'Want'], ['Third streaming subscription', 'Want']], 'Rent and basic food are essentials; concerts and extra subscriptions are optional.'),
    key('The 50/30/20 rule', 'A popular starting point for **take-home pay** (after tax):\n\n- **50%** on needs\n- **30%** on wants\n- **20%** on savings and paying off debt\n\nIt is a rule of thumb, not a law. In expensive cities, needs often take more than half.'),
    diagram({ type: 'donut', centre: '50/30/20', slices: [{ label: 'Needs', value: 50, tone: 'sky' }, { label: 'Wants', value: 30, tone: 'sun' }, { label: 'Savings and debt', value: 20, tone: 'mint' }] }, 'The 50/30/20 split of take-home pay.'),
    num('q2', 'Your take-home pay is £1,800 a month. Using the 50/30/20 rule, how much goes to savings and debt repayment?', 360, '20% × £1,800 = £360.', { prefix: '£', tolerance: 0.5 }),
    example('Tracking spending', 'For one month, you note every purchase in a banking app or spreadsheet. You discover £12 a week on coffee — about £52 a month. You can’t manage what you don’t measure, so tracking usually comes before cutting.'),
    mcq('q3', 'Take-home pay is $2,400 a month. Under 50/30/20, how much is the guide for wants?', ['$480', '$1,200', '$600', '$720'], 3, '30% × $2,400 = $720. Needs would be $1,200 and savings $480.'),
    tf('q4', 'The 50/30/20 rule is based on your pay before tax.', false, 'False. It is usually applied to take-home (after-tax) pay — the money that actually reaches your account.', { final: true }),
    recap('A budget plans your money before you spend it.', '50/30/20: needs, wants, savings and debt — applied to take-home pay.', 'Track spending first so you know where money actually goes.'),
  ],
)

const emergencyFunds = lesson(
  {
    title: 'Emergency funds',
    description: 'A cash cushion for life’s surprises.',
    objectives: ['Explain the purpose of an emergency fund', 'Calculate a target based on essential spending', 'Choose a sensible place to keep it'],
    tags: ['mb-emergency-fund'],
  },
  [
    text(
      'Why a cushion matters',
      'Boilers break, laptops die and jobs end. Without savings, a surprise bill often goes on a credit card or overdraft — and expensive debt can snowball. An **emergency fund** is cash set aside only for genuine emergencies.',
    ),
    key('How much?', 'A common guide is **3–6 months of essential spending** — your needs, not your full lifestyle. Students often start with a smaller first goal, such as £500 or $500, then build up.\n\nPeople with irregular income or dependants may want more.'),
    num('q1', 'Your essential spending is £950 a month. What is a 4-month emergency fund?', 3800, '£950 × 4 = £3,800.', { prefix: '£', tolerance: 0.5 }),
    numbers('Essentials of £1,200 a month', [['3 months', '£3,600'], ['4 months', '£4,800'], ['6 months', '£7,200']], 'Based on essential spending only, not total spending.'),
    key('Where to keep it', 'Emergency money should be **safe** and **easy to access** — an easy-access savings account, not shares. Investments can fall just when you need the cash.'),
    ukus('Protection', '**UK:** eligible deposits at authorised banks are protected by the **FSCS** up to a limit per person, per banking licence.\n**US:** deposits at insured banks are protected by the **FDIC** up to a limit per depositor, per bank, per ownership category. Check fscs.org.uk or fdic.gov for current limits.'),
    multi('q2', 'Which are genuine uses of an emergency fund? Select all that apply.', ['An urgent car repair to get to work', 'Rent after unexpectedly losing a job', 'A spontaneous weekend away', 'A new phone because a new model came out'], [0, 1], 'Emergencies are unexpected and necessary. Holidays and upgrades are wants to plan for separately.'),
    mcq('q3', 'Where is the most sensible place for an emergency fund?', ['A single company’s shares', 'Cryptocurrency', 'A long fixed-term bond you can’t access for 5 years', 'An easy-access savings account'], 3, 'It needs to be stable and available quickly. The others can fall in value or lock your money away.', { final: true }),
    recap('An emergency fund stops surprises turning into debt.', 'Guide: 3–6 months of essential spending, built up gradually.', 'Keep it safe and easy to access, not invested.'),
  ],
)

const savingInterest = lesson(
  {
    title: 'Saving, interest and investing',
    description: 'AER, APY and when to save versus invest.',
    objectives: ['Explain AER and APY', 'Calculate simple and compound interest on savings', 'Distinguish saving from investing'],
    tags: ['mb-saving-interest'],
    difficulty: 2,
  },
  [
    key('Comparing savings rates', 'Banks quote a standard rate so you can compare accounts:\n\n- **UK: AER** (Annual Equivalent Rate)\n- **US: APY** (Annual Percentage Yield)\n\nBoth show what you would earn over a year **including compounding** — interest earning interest.'),
    num('q1', 'You keep £1,000 in an account paying 4% AER for one year. How much interest do you earn?', 40, '£1,000 × 4% = £40.', { prefix: '£', tolerance: 0.01 }),
    example('Compounding', 'You save £2,000 at 5% a year and leave the interest in.\n\nYear 1: £2,000 × 1.05 = £2,100.\nYear 2: £2,100 × 1.05 = £2,205.\n\nYear 2’s interest (£105) is bigger than year 1’s (£100) because you earn interest on interest.'),
    num('q2', 'You save $5,000 at 3% APY for 2 years, leaving the interest in. What is the balance at the end?', 5304.5, '$5,000 × 1.03² = $5,000 × 1.0609 = $5,304.50.', { prefix: '$', tolerance: 0.01, working: '5000 × 1.03 = 5150; 5150 × 1.03 = 5304.50' }),
    diagram({ type: 'compare', columns: [
      { title: 'Saving', tone: 'sky', points: ['Cash in a bank account', 'Low risk; balance doesn’t fall', 'Best for short-term goals and emergencies', 'May lose value after inflation'] },
      { title: 'Investing', tone: 'violet', points: ['Buying assets like shares or funds', 'Value can fall as well as rise', 'Suited to goals five or more years away', 'Higher potential long-run return'] },
    ] }, 'A simplified comparison.'),
    warn('Inflation bites', 'If your savings earn 3% but prices rise 4%, your money buys **less** at the end of the year. Real return ≈ interest rate − inflation.'),
    mcq('q3', 'You need money for a house deposit in 18 months. Which is usually more suitable?', ['Investing it all in a single share', 'Keeping it under the mattress', 'Investing in a volatile emerging-market fund', 'Saving it in a cash savings account'], 3, 'Money needed within a few years usually belongs in cash, where its value won’t fall just before you need it.'),
    tf('q4', 'A higher AER or APY means more interest over a year, all else equal.', true, 'True. That is exactly what these standardised rates are for: comparing accounts like for like.', { final: true }),
    recap('AER (UK) and APY (US) include compounding so you can compare accounts.', 'Compound interest means earning interest on interest.', 'Save for short-term goals; consider investing for long-term ones.'),
  ],
)

const borrowingCosts = lesson(
  {
    title: 'How borrowing costs work',
    description: 'APR, credit cards and the minimum payment trap.',
    objectives: ['Explain what APR measures', 'Estimate monthly credit card interest', 'Explain why minimum payments keep you in debt'],
    tags: ['mb-borrowing-costs'],
    difficulty: 2,
  },
  [
    key('APR', '**APR** (Annual Percentage Rate) is the yearly cost of borrowing, including interest and certain compulsory fees. Lenders must show it in both the UK and US, so you can compare loans. **Lower APR = cheaper borrowing.**'),
    text(
      'Credit cards',
      'A **credit card** lets you borrow up to a **credit limit**. If you pay the full statement balance by the due date, you usually pay **no interest** on purchases. If you don’t, interest is charged — often at a high APR — on what is left.',
    ),
    num('q1', 'A card balance of £1,000 is charged 24% a year. Using a simple monthly rate (APR ÷ 12), roughly how much interest is added in one month?', 20, '24% ÷ 12 = 2% a month. 2% × £1,000 = £20. (Real cards calculate daily, so the exact figure may differ slightly.)', { prefix: '£', tolerance: 0.5 }),
    example('The minimum payment trap', 'Your £1,000 balance attracts about £20 of interest a month. If you pay £25, only about **£5** actually reduces the debt. Paying just the minimum can mean years of payments and a lot of interest.'),
    num('q2', 'Using the example, if you paid £100 instead of £25 in that month, how much would reduce the balance?', 80, '£100 − £20 interest = £80 off the balance.', { prefix: '£', tolerance: 0.5 }),
    diagram({ type: 'bars', unit: '£', bars: [{ label: 'Pay £25', value: 25, segments: [{ value: 20, tone: 'coral', label: 'Interest' }, { value: 5, tone: 'mint', label: 'Debt repaid' }] }, { label: 'Pay £100', value: 100, segments: [{ value: 20, tone: 'coral', label: 'Interest' }, { value: 80, tone: 'mint', label: 'Debt repaid' }] }] }, 'Where one month’s payment goes on a £1,000 balance at about 2% a month.'),
    mcq('q3', 'Which loan is cheapest to borrow £3,000 for the same term, all else equal?', ['Loan A: 18.9% APR', 'Loan B: 24.9% APR', 'Loan C: 9.9% APR', 'Loan D: 34.9% APR'], 2, 'The lowest APR is the cheapest, when amount and term are the same.'),
    tf('q4', 'Paying only the minimum on a credit card each month is a quick way to clear the balance.', false, 'False. Most of a minimum payment can go on interest, so the balance falls slowly and the total cost rises.', { final: true }),
    recap('APR is the yearly cost of borrowing — compare it like for like.', 'Pay the full card balance to avoid interest on purchases.', 'Minimum payments mostly cover interest; pay more when you can.'),
  ],
)

const debtTraps = lesson(
  {
    title: 'Good debt, bad debt and debt traps',
    description: 'Overdrafts, buy now pay later and payday loans.',
    objectives: ['Distinguish productive from costly debt', 'Describe overdrafts, BNPL and payday loans', 'Recognise warning signs of a debt spiral'],
    tags: ['mb-debt-traps'],
    difficulty: 2,
  },
  [
    key('“Good” versus “bad” debt', 'Debt is a tool. It is often called **good debt** when it is affordable and helps build long-term value — a reasonable mortgage or education that boosts earning power. **Bad debt** is expensive borrowing for things that lose value or are quickly consumed, such as a holiday on a high-APR card.\n\nEven “good” debt is bad if you can’t afford the repayments.'),
    diagram({ type: 'scale', left: 'Usually cheaper', right: 'Usually very expensive', items: [{ label: 'Mortgage', position: 10, tone: 'mint' }, { label: 'Student loan', position: 20, tone: 'mint' }, { label: 'Personal loan', position: 40, tone: 'sky' }, { label: 'Credit card', position: 65, tone: 'sun' }, { label: 'Overdraft', position: 70, tone: 'sun' }, { label: 'Payday loan', position: 95, tone: 'coral' }] }, 'A rough guide. Actual costs depend on the lender, your credit history and the terms.'),
    ukus('Overdrafts', '**UK:** an **arranged overdraft** lets your current account go below zero up to an agreed limit. Since 2020, most banks charge a single annual interest rate, often around 35–40% or more. Many student accounts offer interest-free overdrafts up to a limit — check when that ends.\n**US:** “overdraft” often means the bank covers a payment that would bounce and charges a flat **fee** per transaction.'),
    key('Buy now, pay later (BNPL)', '**BNPL** splits a purchase into instalments, often interest-free. The risks: it makes spending feel painless, it is easy to stack several plans, and missed payments can bring fees, collection and harm to your credit record. Rules on BNPL have been changing in both countries.'),
    key('Payday loans', '**Payday loans** are small, short-term loans with very high costs.\n\n**UK:** the FCA caps interest and fees at **0.8% a day** of the amount borrowed, and total costs at 100% of the loan.\n**US:** costs vary by state; a typical fee of $15 per $100 for two weeks works out at an APR of almost 400%.'),
    num('q1', 'Under the UK cap of 0.8% a day, what is the maximum interest and fees on £200 borrowed for 30 days (no default)?', 48, '0.8% × 30 days = 24%. 24% × £200 = £48.', { prefix: '£', tolerance: 0.5 }),
    multi('q2', 'Which are warning signs of a debt spiral? Select all that apply.', ['Borrowing to pay off other debts each month', 'Only ever making minimum payments', 'Using several BNPL plans at once to cover essentials', 'Paying your card balance in full every month'], [0, 1, 2], 'Paying in full is healthy. The others suggest debt is growing faster than you can repay it. Free help is available from charities such as StepChange or MoneyHelper (UK) or nonprofit credit counsellors (US).'),
    mcq('q3', 'Which is most likely to be called “bad debt”?', ['An affordable mortgage on a home', 'A student loan for a degree', 'A low-rate loan for a reliable car needed for work', 'A high-APR credit card balance from nights out'], 3, 'Expensive borrowing for consumption that is quickly gone is the classic example of bad debt.', { final: true }),
    recap('Debt is a tool: affordability and cost matter most.', 'Overdrafts, BNPL and payday loans can become expensive fast.', 'Borrowing to repay borrowing is a warning sign — seek free help early.'),
  ],
)

const debtPayoff = lesson(
  {
    title: 'Paying off debt',
    description: 'The avalanche and snowball methods.',
    objectives: ['Explain the avalanche and snowball methods', 'Order debts under each method', 'Weigh maths against motivation'],
    tags: ['mb-debt-payoff'],
    difficulty: 2,
  },
  [
    text(
      'The basic plan',
      'With several debts, first make **at least the minimum payment on every one** to avoid fees and damage to your credit record. Then put any extra money towards one target debt. When it is cleared, roll that payment into the next.',
    ),
    diagram({ type: 'compare', columns: [
      { title: 'Avalanche', tone: 'sky', points: ['Target the highest interest rate first', 'Pays the least interest overall', 'Can take longer to see a debt disappear'] },
      { title: 'Snowball', tone: 'sun', points: ['Target the smallest balance first', 'Quick wins build motivation', 'Usually costs a bit more interest'] },
    ] }, 'Two popular repayment strategies.'),
    numbers('Your debts (hypothetical)', [['Credit card', '£3,000 at 29% APR'], ['Store card', '£400 at 22% APR'], ['Personal loan', '£1,500 at 9% APR']]),
    mcq('q1', 'Using the avalanche method, which debt do you target first?', ['Store card', 'Personal loan', 'They are all paid equally', 'Credit card'], 3, 'The credit card has the highest rate (29%), so avalanche targets it first.'),
    mcq('q2', 'Using the snowball method, which debt do you target first?', ['Credit card', 'Personal loan', 'Store card', 'Whichever was taken out first'], 2, 'The store card has the smallest balance (£400), so snowball clears it first.'),
    num('q3', 'Roughly how much interest does the £3,000 credit card cost over a year at 29%, ignoring compounding and repayments?', 870, '£3,000 × 29% = £870.', { prefix: '£', tolerance: 1 }),
    order('q4', 'Order the debts as the avalanche method would target them.', ['Credit card (29%)', 'Store card (22%)', 'Personal loan (9%)'], 'Avalanche goes from the highest interest rate to the lowest.', { final: true }),
    recap('Pay every minimum, then focus extra money on one debt.', 'Avalanche: highest rate first — cheapest overall.', 'Snowball: smallest balance first — quick wins. The best plan is one you stick to.'),
  ],
)

const creditScores = lesson(
  {
    title: 'Credit scores and reports',
    description: 'What lenders see and how to build a good record.',
    objectives: ['Explain what a credit report contains', 'Compare UK and US credit scoring', 'Identify habits that build good credit'],
    tags: ['mb-credit-scores'],
    difficulty: 2,
  },
  [
    text(
      'Your financial track record',
      'A **credit report** is a record of how you have handled credit: accounts, limits, balances and whether you paid on time. A **credit score** is a number summarising that record. Lenders, landlords and some phone providers use them to decide whether to lend to you and at what price.',
    ),
    ukus('UK and US', '**UK:** the three main **credit reference agencies** are **Experian, Equifax and TransUnion**. Each uses its own scale and there is **no single universal score** — lenders also apply their own criteria. Being on the **electoral register** at your address helps.\n**US:** the most widely used score is **FICO**, ranging from **300 to 850**. The three bureaus are Equifax, Experian and TransUnion.'),
    diagram({ type: 'bars', unit: '%', bars: [{ label: 'Payment history', value: 35, tone: 'violet' }, { label: 'Amounts owed', value: 30, tone: 'sky' }, { label: 'Length of history', value: 15, tone: 'mint' }, { label: 'New credit', value: 10, tone: 'sun' }, { label: 'Credit mix', value: 10, tone: 'grey' }] }, 'Approximate weightings published by FICO for the general population. Individual scores vary.', 'What goes into a FICO score'),
    mcq('q1', 'Which factor has the largest weighting in a FICO score?', ['Credit mix', 'New credit', 'Length of credit history', 'Payment history'], 3, 'Payment history is about 35% — paying on time matters most.'),
    key('Credit utilisation', '**Utilisation** = balance ÷ credit limit. Using a small share of your available credit generally looks better to lenders than maxing out cards.'),
    num('q2', 'You have a £300 balance on a card with a £1,000 limit. What is your utilisation?', 30, '£300 ÷ £1,000 = 30%.', { suffix: '%', tolerance: 0.01 }),
    multi('q3', 'Which habits usually help build a good credit record? Select all that apply.', ['Paying every bill on time', 'Keeping balances low relative to limits', 'Applying for lots of credit cards in one month', 'Checking your report for errors'], [0, 1, 3], 'Many applications in a short period can count against you. Checking your own report is a “soft” search and doesn’t harm your score.'),
    tf('q4', 'In the UK, there is one official credit score that every lender uses.', false, 'False. Each agency has its own scale, and lenders use their own scoring too.', { final: true }),
    recap('Credit reports record how you have managed credit.', 'UK: Experian, Equifax, TransUnion — no single universal score. US: FICO 300–850.', 'Pay on time, keep utilisation low and check your report.'),
  ],
)

const studentLoans = lesson(
  {
    title: 'Student loans (educational overview)',
    description: 'How UK and US student loans differ.',
    objectives: ['Explain income-contingent repayment in the UK', 'Compare US federal and private loans', 'Recognise that rules change and where to check them'],
    tags: ['mb-student-loans'],
    difficulty: 2,
    sources: [
      { label: 'GOV.UK — Repaying your student loan', url: 'https://www.gov.uk/repaying-your-student-loan' },
      { label: 'Federal Student Aid — studentaid.gov', url: 'https://studentaid.gov/' },
    ],
  },
  [
    warn('Educational only — check current rules', 'Student loan thresholds, interest rates and repayment plans change. This lesson explains the general mechanics only. Check gov.uk/repaying-your-student-loan or studentaid.gov for the rules that apply to you.'),
    ukus('UK: repay as you earn', 'English and Welsh undergraduate loans (such as **Plan 2** and **Plan 5**) are **income-contingent**: you repay **9% of your income above a threshold**, usually through your payslip. Earn below the threshold and you repay nothing that month. Any balance left is **written off after a set period** (for example, 30 years for Plan 2 and 40 years for Plan 5). Interest is charged, and rules differ by plan.'),
    example('A hypothetical calculation', 'Suppose the threshold were **£25,000** a year (a made-up round number for practice). You earn £31,000.\n\nIncome above the threshold: £31,000 − £25,000 = £6,000.\nAnnual repayment: 9% × £6,000 = £540, or £45 a month.'),
    num('q1', 'With the same hypothetical £25,000 threshold, how much would someone earning £35,000 repay in a year?', 900, '£35,000 − £25,000 = £10,000. 9% × £10,000 = £900.', { prefix: '£', tolerance: 0.5 }),
    ukus('US: federal versus private', '**Federal loans** come from the US Department of Education (apply via the **FAFSA**). They have fixed rates set by law and borrower protections such as deferment and, for many borrowers, income-driven repayment options.\n**Private loans** come from banks and other lenders. Terms depend on your credit (often needing a co-signer), rates may be variable and protections are usually fewer.'),
    match('q2', 'Match each feature with the loan type.', [['Repaid as 9% of income above a threshold', 'UK Plan 2/Plan 5'], ['Applied for through the FAFSA', 'US federal loan'], ['Terms depend on your credit and may need a co-signer', 'US private loan']], 'UK loans are income-contingent; US federal loans start with the FAFSA; private loans are credit-based.'),
    tf('q3', 'Under UK Plan 2 or Plan 5, if your income is below the repayment threshold, you make no repayments.', true, 'True. Repayments are based only on income above the threshold.'),
    mcq('q4', 'Why do many US students consider federal loans before private ones?', ['Private loans are always interest-free', 'Federal loans can never be repaid early', 'Private loans are written off after 10 years', 'Federal loans typically have fixed rates and more borrower protections'], 3, 'Federal loans generally offer fixed rates and protections that private loans often lack.', { final: true }),
    recap('UK: repay 9% of income above a threshold; written off after a set period.', 'US: federal loans (via FAFSA) usually offer more protections than private loans.', 'Rules change — always check gov.uk or studentaid.gov.'),
  ],
)

const payslips = lesson(
  {
    title: 'Reading your payslip',
    description: 'Gross pay, deductions and take-home pay.',
    objectives: ['Distinguish gross pay from net pay', 'Name common UK and US payroll deductions', 'Calculate take-home pay from a simple payslip'],
    tags: ['mb-payslips'],
    difficulty: 2,
    sources: [
      { label: 'GOV.UK — Understanding your payslip', url: 'https://www.gov.uk/understanding-your-pay' },
      { label: 'IRS — Understanding employment taxes', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/understanding-employment-taxes' },
    ],
  },
  [
    key('Gross versus net', '**Gross pay** is what you earn before deductions. **Net pay** (take-home pay) is what lands in your account after tax and other deductions. Budgets should be built on **net** pay.'),
    diagram({ type: 'flow', nodes: [{ label: 'Gross pay', sub: 'Before deductions', tone: 'violet' }, { label: 'Deductions', sub: 'Tax, NI or FICA, pension, student loan', tone: 'coral' }, { label: 'Net pay', sub: 'Take-home', tone: 'mint' }] }, 'From gross to net.'),
    ukus('UK payslip', '- **Income tax** collected through **PAYE**. Your **tax code** (for example 1257L in 2025/26) tells your employer your tax-free allowance.\n- **National Insurance** contributions.\n- Often **workplace pension** contributions and **student loan** repayments.'),
    ukus('US paycheck', '- **Federal income tax** withholding, based on your W-4.\n- **State** (and sometimes local) income tax — some states have none.\n- **FICA**: Social Security (6.2%) and Medicare (1.45%), **7.65%** in total for most employees, with an annual cap on earnings subject to Social Security.'),
    numbers('A hypothetical UK monthly payslip', [['Gross pay', '£2,200'], ['Income tax', '−£190'], ['National Insurance', '−£60'], ['Pension', '−£110'], ['Net pay', '£1,840']], 'Made-up figures for practice, not current tax rates.'),
    num('q1', 'Using the payslip, if pension contributions rose to £150 and everything else stayed the same, what would net pay be?', 1800, '£2,200 − £190 − £60 − £150 = £1,800.', { prefix: '£', tolerance: 0.5 }),
    num('q2', 'A US employee earns $3,000 gross in a pay period. At a combined FICA rate of 7.65%, how much FICA is withheld?', 229.5, '$3,000 × 7.65% = $229.50.', { prefix: '$', tolerance: 0.01 }),
    match('q3', 'Match each deduction with its country.', [['National Insurance', 'UK'], ['FICA', 'US'], ['PAYE income tax', 'UK'], ['W-4 federal withholding', 'US']], 'National Insurance and PAYE are UK; FICA and W-4 withholding are US.'),
    mcq('q4', 'Your contract says £24,000 a year, but less arrives in your account each month. Why?', ['Your employer is keeping a bonus', 'Banks charge a fee on salaries', 'Gross pay is paid every two years', 'Deductions such as tax, NI and pension come off gross pay'], 3, 'The salary in your contract is gross. Net pay is what is left after deductions.', { final: true }),
    recap('Gross pay is before deductions; net pay is take-home.', 'UK: PAYE income tax, National Insurance, pension, student loan.', 'US: federal and state tax, FICA (7.65% for most employees).'),
  ],
)

export const c9 = course({
  id: 'c9',
  slug: 'money-basics',
  title: 'Money Basics: Budgeting, Debt and Credit',
  tagline: 'Make your money work before you invest it.',
  description: 'Build the foundations every investor needs: a budget that works, an emergency fund, smart saving, borrowing without traps, a healthy credit record and a clear picture of student loans and payslips in the UK and US.',
  colour: 'sky',
  icon: 'wallet',
  outcomes: [
    'Build a budget using needs, wants and the 50/30/20 rule',
    'Size an emergency fund and compare savings using AER and APY',
    'Explain APR, common debt traps and debt payoff strategies',
    'Describe credit scores, student loans and payslips in the UK and US at an educational level',
  ],
  units: [
    {
      title: 'Budgeting and saving',
      description: 'Budgets, emergency funds and earning interest.',
      lessons: [budgetingBasics, emergencyFunds, savingInterest],
      checkpoint: {
        concept: 'mb-budgeting',
        questions: [
          numQ('c1', 'Take-home pay £2,000 a month. Using 50/30/20, how much is the guide for needs?', 1000, '50% × £2,000 = £1,000.', { prefix: '£', tolerance: 0.5, concept: 'mb-budgeting' }),
          mcqQ('c2', 'Which is a want rather than a need?', ['Rent', 'Basic groceries', 'A gym membership upgrade with a spa', 'Bus fare to work'], 2, 'The spa upgrade is optional.', { concept: 'mb-budgeting' }),
          numQ('c3', 'Essential spending is $1,500 a month. What is a 6-month emergency fund?', 9000, '$1,500 × 6 = $9,000.', { prefix: '$', tolerance: 0.5, concept: 'mb-emergency-fund' }),
          tfQ('c4', 'An emergency fund is best held in shares to maximise growth.', false, 'It should be safe and easy to access.', { concept: 'mb-emergency-fund' }),
          numQ('c5', '£4,000 earns 2.5% AER for one year. Interest earned?', 100, '£4,000 × 2.5% = £100.', { prefix: '£', tolerance: 0.01, concept: 'mb-saving-interest' }),
          matchQ('c6', 'Match each rate with its country.', [['AER', 'UK'], ['APY', 'US']], 'AER is the UK term; APY is the US term.', { concept: 'mb-saving-interest' }),
        ],
      },
    },
    {
      title: 'Borrowing and debt',
      description: 'APR, debt traps and paying it off.',
      lessons: [borrowingCosts, debtTraps, debtPayoff],
      checkpoint: {
        concept: 'mb-borrowing-costs',
        questions: [
          numQ('c1', 'A £600 card balance is charged 18% a year. Using APR ÷ 12, roughly how much interest is added in a month?', 9, '18% ÷ 12 = 1.5%. 1.5% × £600 = £9.', { prefix: '£', tolerance: 0.1, concept: 'mb-borrowing-costs' }),
          tfQ('c2', 'Paying a credit card’s full statement balance by the due date usually avoids interest on purchases.', true, 'Interest is charged on balances carried over.', { concept: 'mb-borrowing-costs' }),
          multiQ('c3', 'Which are typically very expensive forms of borrowing? Select all that apply.', ['Payday loans', 'Unarranged or high-rate overdrafts', 'Missed BNPL payments with fees', 'An interest-free overdraft within its limit'], [0, 1, 2], 'An interest-free overdraft within its limit costs nothing while it lasts.', { concept: 'mb-debt-traps' }),
          numQ('c4', 'Under the UK payday cap of 0.8% a day, what is the maximum interest and fees on £100 borrowed for 15 days?', 12, '0.8% × 15 = 12%. 12% × £100 = £12.', { prefix: '£', tolerance: 0.1, concept: 'mb-debt-traps' }),
          mcqQ('c5', 'The snowball method targets…', ['the highest interest rate first', 'the oldest debt first', 'the smallest balance first', 'the largest balance first'], 2, 'Snowball goes smallest balance first for quick wins.', { concept: 'mb-debt-payoff' }),
          orderQ('c6', 'Order these debts for the avalanche method.', ['Payday loan (300%)', 'Credit card (25%)', 'Car loan (8%)'], 'Highest interest rate first.', { concept: 'mb-debt-payoff' }),
        ],
      },
    },
    {
      title: 'Credit, student loans and pay',
      description: 'Credit records, student finance and payslips.',
      lessons: [creditScores, studentLoans, payslips],
      checkpoint: {
        concept: 'mb-credit-scores',
        questions: [
          mcqQ('c1', 'The FICO score range is…', ['0–100', '300–850', '0–999', '1–10'], 1, 'FICO scores run from 300 to 850.', { concept: 'mb-credit-scores' }),
          numQ('c2', 'Balance $450, credit limit $1,500. Utilisation?', 30, '$450 ÷ $1,500 = 30%.', { suffix: '%', tolerance: 0.01, concept: 'mb-credit-scores' }),
          tfQ('c3', 'Checking your own credit report harms your score.', false, 'It is a soft search and doesn’t affect your score.', { concept: 'mb-credit-scores' }),
          numQ('c4', 'Hypothetical threshold £25,000; income £29,000; rate 9%. Annual repayment?', 360, '£4,000 × 9% = £360.', { prefix: '£', tolerance: 0.5, concept: 'mb-student-loans' }),
          mcqQ('c5', 'Net pay is…', ['pay before any deductions', 'your annual salary', 'pay after tax and other deductions', 'your employer’s pension contribution'], 2, 'Net pay is take-home pay.', { concept: 'mb-payslips' }),
          multiQ('c6', 'Which commonly appear on a UK payslip? Select all that apply.', ['Income tax (PAYE)', 'National Insurance', 'FICA', 'Student loan repayment'], [0, 1, 3], 'FICA is a US payroll tax.', { concept: 'mb-payslips' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'mb-budgeting',
    questions: [
      numQ('e1', 'Take-home pay £2,500 a month. Using 50/30/20, what is the guide for wants?', 750, '30% × £2,500 = £750.', { prefix: '£', tolerance: 0.5, concept: 'mb-budgeting' }),
      tfQ('e2', 'Tracking your spending is a useful first step before setting a budget.', true, 'You can’t manage what you don’t measure.', { concept: 'mb-budgeting' }),
      numQ('e3', 'Essential spending £1,100 a month. What is a 3-month emergency fund?', 3300, '£1,100 × 3 = £3,300.', { prefix: '£', tolerance: 0.5, concept: 'mb-emergency-fund' }),
      numQ('e4', '$1,000 at 6% APY for 2 years, interest left in. Final balance?', 1123.6, '$1,000 × 1.06² = $1,123.60.', { prefix: '$', tolerance: 0.01, concept: 'mb-saving-interest' }),
      mcqQ('e5', 'Savings earn 2% while inflation is 4%. Roughly what is the real return?', ['−2%', '+6%', '+2%', '0%'], 0, '2% − 4% ≈ −2%: your money buys less.', { concept: 'mb-saving-interest' }),
      mcqQ('e6', 'APR measures…', ['the interest you earn on savings', 'your credit score', 'the yearly cost of borrowing, including certain fees', 'your monthly minimum payment'], 2, 'APR is the annual cost of borrowing.', { concept: 'mb-borrowing-costs' }),
      numQ('e7', 'Card balance £2,000; monthly interest about £40; you pay £50. How much reduces the balance?', 10, '£50 − £40 = £10.', { prefix: '£', tolerance: 0.1, concept: 'mb-borrowing-costs' }),
      tfQ('e8', 'Buy now, pay later plans carry no risk because they are often interest-free.', false, 'Missed payments can bring fees and harm your credit record, and stacking plans is easy.', { concept: 'mb-debt-traps' }),
      mcqQ('e9', 'Which is the best description of “good debt”?', ['Any loan with a low monthly payment', 'Debt you never need to repay', 'Affordable borrowing that helps build long-term value', 'A payday loan repaid on time'], 2, 'Affordability and long-term value are key.', { concept: 'mb-debt-traps' }),
      matchQ('e10', 'Match each method with its rule.', [['Avalanche', 'Highest interest rate first'], ['Snowball', 'Smallest balance first']], 'Avalanche minimises interest; snowball builds motivation.', { concept: 'mb-debt-payoff' }),
      orderQ('e11', 'Order the steps of a debt repayment plan.', ['List every debt with its balance and rate', 'Pay the minimum on every debt', 'Put extra money towards one target debt', 'Roll that payment into the next debt once it’s cleared'], 'List, cover minimums, target one, then roll over.', { concept: 'mb-debt-payoff' }),
      mcqQ('e12', 'Which factor carries the most weight in a FICO score?', ['Credit mix', 'Length of history', 'New credit', 'Payment history'], 3, 'Payment history is about 35%.', { concept: 'mb-credit-scores' }),
      multiQ('e13', 'Which are UK credit reference agencies? Select all that apply.', ['Experian', 'Equifax', 'TransUnion', 'FICO'], [0, 1, 2], 'FICO is a US scoring model, not a UK agency.', { concept: 'mb-credit-scores' }),
      numQ('e14', 'Hypothetical threshold £25,000; income £40,000; rate 9%. Annual student loan repayment?', 1350, '£15,000 × 9% = £1,350.', { prefix: '£', tolerance: 0.5, concept: 'mb-student-loans' }),
      numQ('e15', 'Gross pay £1,900; tax £150; NI £45; pension £95. Net pay?', 1610, '£1,900 − £150 − £45 − £95 = £1,610.', { prefix: '£', tolerance: 0.5, concept: 'mb-payslips' }),
    ],
  },
})
