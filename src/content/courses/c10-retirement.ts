import { course, diagram, example, key, lesson, match, matchQ, mcq, mcqQ, multi, multiQ, num, numQ, numbers, order, orderQ, recap, text, tf, tfQ, ukus, warn } from '../builders'

const whyPlan = lesson(
  {
    title: 'Why plan for retirement?',
    description: 'Decades without a salary, and the jobs a pension has to do.',
    objectives: ['Explain why retirement saving matters', 'Define longevity risk', 'Describe the layers of retirement income in the UK and US'],
    tags: ['rt-why-save'],
  },
  [
    text(
      'A long time without a salary',
      'Retirement can last **20 to 30 years or more**. For all that time, your income has to come from somewhere other than a job. State pensions provide a floor, but for many people they cover only part of the lifestyle they want. The rest comes from what they saved while working.',
    ),
    key('Three jobs a retirement pot must do', '1. **Replace income** once your salary stops.\n2. **Keep pace with inflation** over decades.\n3. **Last as long as you do**. The risk of outliving your money is called **longevity risk**.'),
    mcq('q1', 'What is longevity risk?', ['The risk that share prices fall', 'The risk that interest rates rise', 'The risk of outliving your savings', 'The risk of retiring too late'], 2, 'Longevity risk is the risk that you live longer than your money lasts.'),
    ukus('Two systems, similar layers', '- **UK**: the **State Pension**, **workplace pensions** (most employees are auto-enrolled) and **personal pensions** such as SIPPs, plus other savings like ISAs.\n- **US**: **Social Security**, employer plans such as the **401(k)**, and **IRAs** you open yourself.'),
    diagram({ type: 'compare', columns: [
      { title: 'State', tone: 'sky', points: ['UK State Pension', 'US Social Security', 'Based on your work record'] },
      { title: 'Workplace', tone: 'violet', points: ['UK workplace pensions', 'US 401(k) plans', 'Often include employer money'] },
      { title: 'Personal', tone: 'mint', points: ['UK SIPPs and ISAs', 'US IRAs', 'You choose and contribute'] },
    ] }, 'Three common layers of retirement income.'),
    match('q2', 'Match each scheme with its layer.', [['UK State Pension', 'State'], ['US Social Security', 'State'], ['401(k)', 'Workplace'], ['SIPP', 'Personal'], ['IRA', 'Personal']], 'State schemes are based on your work record; 401(k)s are employer plans; SIPPs and IRAs are personal accounts.'),
    tf('q3', 'Relying on the State Pension or Social Security alone guarantees the same lifestyle you had while working.', false, 'False. State pensions are a foundation, not usually a full replacement for a working income.', { final: true }),
    recap('Retirement can last decades without a salary.', 'A pot must replace income, beat inflation and last: longevity risk is real.', 'Both countries have state, workplace and personal layers.'),
  ],
)

const compounding = lesson(
  {
    title: 'Compounding over decades',
    description: 'Why the years you start matter more than you think.',
    objectives: ['Calculate compound growth over long periods', 'Use the rule of 72', 'Explain why starting early is powerful'],
    tags: ['rt-compounding'],
    difficulty: 2,
  },
  [
    key('Growth on growth', '**Compounding** means your returns earn returns of their own. A lump sum grows as:\n\n**Future value = amount × (1 + rate)ⁿ**, where n is the number of years.'),
    num('q1', '£10,000 grows at an assumed 5% a year for 30 years, with no fees or withdrawals. What is it worth, to the nearest pound?', 43219, '£10,000 × 1.05³⁰ ≈ £10,000 × 4.3219 ≈ £43,219.', { prefix: '£', tolerance: 5, working: '1.05^30 ≈ 4.3219' }),
    numbers('Alex versus Sam (hypothetical)', [['Alex: £2,000 a year, ages 25 to 34', '£20,000 paid in → ≈ £160,500 at 65'], ['Sam: £2,000 a year, ages 35 to 64', '£60,000 paid in → ≈ £167,600 at 65']], 'Illustrative: constant 6% a year, contributions at the start of each year, no fees or tax. Alex stops at 34 and leaves the money invested. Real returns vary and can be negative.'),
    mcq('q2', 'What does the Alex and Sam example show most clearly?', ['Sam was wiser to wait', 'Alex paid in a third as much yet ended with almost the same amount', 'Contributions matter more than time', 'Returns are higher for younger investors'], 1, 'Alex’s money had ten extra years to compound, which almost made up for paying in £40,000 less.'),
    key('The rule of 72', 'A quick estimate: **years to double ≈ 72 ÷ annual growth rate (%)**. At 8%, money roughly doubles in 9 years.'),
    num('q3', 'Using the rule of 72, roughly how many years does money take to double at 6% a year?', 12, '72 ÷ 6 = 12 years.', { suffix: ' years', tolerance: 0.5 }),
    diagram({ type: 'bars', unit: '£', bars: [
      { label: '30 years', value: 166500, segments: [{ value: 72000, tone: 'sky', label: 'Paid in' }, { value: 94500, tone: 'violet', label: 'Growth' }] },
      { label: '40 years', value: 305200, segments: [{ value: 96000, tone: 'sky', label: 'Paid in' }, { value: 209200, tone: 'violet', label: 'Growth' }] },
    ] }, 'Illustrative: £200 a month at a constant 5% a year, compounded monthly, no fees or tax.'),
    tf('q4', 'In the chart, ten extra years of saving adds more than ten years’ worth of contributions to the final pot.', true, 'True. The extra £24,000 paid in comes with about £114,700 of extra hypothetical growth: £305,200 versus £166,500.', { final: true }),
    recap('Compounding means returns earn returns.', 'Rule of 72: years to double ≈ 72 ÷ rate.', 'Starting early gives each pound more years to grow.'),
  ],
)

const inflation = lesson(
  {
    title: 'Inflation and your future income',
    description: 'Planning in what money can buy, not just in pounds or dollars.',
    objectives: ['Calculate the effect of inflation on purchasing power', 'Explain real versus nominal targets', 'Identify ways retirement income can keep up with prices'],
    tags: ['rt-inflation'],
    difficulty: 2,
  },
  [
    text(
      'The slow leak',
      '**Inflation** is the general rise in prices over time. A few per cent a year sounds small, but retirement planning spans decades. A fixed income that feels comfortable at 65 can feel tight at 85.',
    ),
    diagram({ type: 'bars', unit: '£', bars: [{ label: 'Today', value: 1000, tone: 'violet' }, { label: '10 years', value: 744, tone: 'sky' }, { label: '20 years', value: 554, tone: 'sun' }, { label: '30 years', value: 412, tone: 'coral' }] }, 'What £1,000 can buy, in today’s money, with 3% inflation each year.'),
    num('q1', 'With 3% inflation a year, what will £100 buy after 20 years, in today’s money? Give your answer to the nearest pound.', 55, '£100 ÷ 1.03²⁰ ≈ £100 ÷ 1.806 ≈ £55.37.', { prefix: '£', tolerance: 0.5, working: '1.03^20 ≈ 1.806' }),
    key('Real versus nominal targets', 'A **nominal** figure is the number of pounds or dollars. A **real** figure is adjusted for inflation. If you want £25,000 a year **in today’s money**, the nominal figure you need will be higher in the future. Plan in real terms.'),
    num('q2', 'Using the rule of 72, roughly how many years does it take for prices to double at 3% inflation?', 24, '72 ÷ 3 = 24 years.', { suffix: ' years', tolerance: 0.5 }),
    ukus('Inflation protection built in', '- **UK**: under current policy, the State Pension rises each year by the **triple lock**, the highest of earnings growth, CPI inflation or 2.5%. Policy can change.\n- **US**: Social Security benefits get an annual **cost-of-living adjustment (COLA)** linked to inflation.'),
    multi('q3', 'Which can help retirement income keep up with inflation? Select all that apply.', ['Investments with long-run growth potential, such as shares', 'Inflation-linked income such as Social Security with COLAs', 'Holding all savings in cash for 30 years', 'An income fixed in pounds that never rises'], [0, 1], 'Growth assets and inflation-linked income can help. Cash and fixed incomes tend to lose purchasing power over long periods.', { final: true }),
    recap('Inflation steadily erodes purchasing power.', 'Set retirement goals in real (today’s money) terms.', 'State pensions in both countries currently rise with prices or earnings; private pots need growth too.'),
  ],
)

const statePensions = lesson(
  {
    title: 'State Pension and Social Security',
    description: 'How the UK and US state schemes work.',
    objectives: ['Explain how the UK new State Pension is built from National Insurance years', 'Describe how US Social Security benefits are calculated', 'Compare the key ages and thresholds'],
    tags: ['rt-state-pension'],
    sources: [
      { label: 'GOV.UK — The new State Pension', url: 'https://www.gov.uk/new-state-pension' },
      { label: 'GOV.UK — Check your State Pension forecast', url: 'https://www.gov.uk/check-state-pension' },
      { label: 'SSA — Retirement benefits', url: 'https://www.ssa.gov/retirement' },
    ],
  },
  [
    key('UK: the new State Pension', 'Your entitlement depends on your **National Insurance (NI) record**. Each year you pay NI or receive NI credits (for example while caring for a child or claiming certain benefits) can count as a **qualifying year**.\n\n- You usually need **at least 10 qualifying years** to get any new State Pension.\n- You usually need **35 qualifying years** for the full amount.\n\nState Pension age is being raised from **66 to 67** between 2026 and 2028.'),
    num('q1', 'Simplified: someone whose whole NI record falls under the new State Pension has 21 qualifying years. What percentage of the full new State Pension would they get?', 60, '21 ÷ 35 = 60% of the full amount.', { suffix: '%', tolerance: 0.5 }),
    tf('q2', 'With 8 qualifying years, a person would normally receive some new State Pension.', false, 'False. You usually need at least 10 qualifying years to get any new State Pension.'),
    key('US: Social Security', 'You generally need **40 credits** (about 10 years of work) to qualify. Your benefit is based on your **35 highest-earning years**, adjusted for wage growth.\n\n- **Full retirement age** is **67** for anyone born in 1960 or later.\n- You can claim from **62**, but your benefit is permanently reduced.\n- Waiting beyond full retirement age, up to **70**, increases it.'),
    mcq('q3', 'What is the US full retirement age for someone born in 1995?', ['62', '65', '67', '70'], 2, 'Full retirement age is 67 for those born in 1960 or later.'),
    ukus('Check your own record', '- **UK**: get a State Pension forecast and see any NI gaps on gov.uk.\n- **US**: view your earnings record and benefit estimates with a my Social Security account at ssa.gov.'),
    match('q4', 'Match each figure with what it describes.', [['35 qualifying years', 'Full UK new State Pension'], ['35 highest-earning years', 'US Social Security benefit formula'], ['10 qualifying years', 'Usual UK minimum for any new State Pension'], ['Age 62', 'Earliest reduced Social Security claim']], 'Both countries use “35”, but differently: qualifying NI years in the UK, highest-earning years in the US.', { final: true }),
    recap('UK: 10 qualifying NI years for any new State Pension, 35 for the full amount.', 'US: benefits based on your 35 highest-earning years; full retirement age 67 if born 1960+.', 'Check your forecast on gov.uk or ssa.gov.'),
  ],
)

const ukPensions = lesson(
  {
    title: 'UK workplace and personal pensions',
    description: 'Auto-enrolment, tax relief, DC versus DB, and SIPPs.',
    objectives: ['Calculate minimum auto-enrolment contributions', 'Explain pension tax relief', 'Compare defined contribution and defined benefit pensions', 'Describe access ages and the tax-free lump sum'],
    tags: ['rt-uk-pensions'],
    difficulty: 2,
    sources: [
      { label: 'GOV.UK — Workplace pensions', url: 'https://www.gov.uk/workplace-pensions' },
      { label: 'GOV.UK — Tax on your private pension contributions', url: 'https://www.gov.uk/tax-on-your-private-pension' },
      { label: 'MoneyHelper — Pensions and retirement', url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement' },
    ],
  },
  [
    key('Auto-enrolment', 'UK employers must automatically enrol eligible workers (broadly, aged 22 to State Pension age and earning above a threshold) into a **workplace pension**.\n\nThe minimum total contribution is **8% of qualifying earnings**, with **at least 3% from the employer**. The rest comes from you, including tax relief. You can opt out, but you would usually lose the employer’s contribution.'),
    num('q1', 'An employee has £20,000 of qualifying earnings in a year. What is the minimum total contribution under auto-enrolment?', 1600, '8% × £20,000 = £1,600.', { prefix: '£', tolerance: 1 }),
    num('q2', 'If the employer pays only the 3% minimum, how much of that £1,600 comes from the employee (including tax relief)?', 1000, '8% − 3% = 5%; 5% × £20,000 = £1,000.', { prefix: '£', tolerance: 1 }),
    key('Tax relief', 'Pension contributions generally get **tax relief** at your marginal rate, within limits. With **relief at source**, you pay £80 and your provider claims £20 of basic-rate relief from HMRC, so **£100** goes in. Higher- and additional-rate taxpayers can claim more, for example through Self Assessment. Scottish income tax rates differ.'),
    num('q3', 'Under relief at source with 20% basic-rate relief, how much must you pay to get £500 into your pension?', 400, '£500 × 80% = £400; HMRC adds £100.', { prefix: '£', tolerance: 1 }),
    diagram({ type: 'compare', columns: [
      { title: 'Defined contribution (DC)', tone: 'violet', points: ['A pot built from contributions and investment growth', 'Final value is not guaranteed', 'You bear the investment risk', 'Most new workplace pensions'] },
      { title: 'Defined benefit (DB)', tone: 'mint', points: ['Income based on salary and years of service', 'Promised by the scheme', 'Employer bears the investment risk', 'Now mostly in the public sector'] },
    ] }, 'DC versus DB pensions.'),
    mcq('q4', 'In a defined contribution pension, who bears the investment risk?', ['The employer', 'The government', 'Nobody, because returns are guaranteed', 'You, the member'], 3, 'In DC schemes your pot depends on contributions and investment performance, so you carry the risk.'),
    key('SIPPs, access and the tax-free lump sum', 'A **SIPP** (self-invested personal pension) lets you choose your own investments.\n\n- The **normal minimum pension age** is **55**, rising to **57** from 6 April 2028 (some exceptions apply).\n- You can generally take **25% tax-free**, up to an overall cap. The rest is taxed as income when you take it.'),
    num('q5', 'A DC pot is worth £160,000. Ignoring any cap, how much could generally be taken tax-free at 25%?', 40000, '25% × £160,000 = £40,000.', { prefix: '£', tolerance: 1, final: true }),
    warn('Limits change — check gov.uk', 'There are limits on how much can be paid in with tax relief each year and on tax-free lump sums. These change, so check gov.uk for the current tax year. This is education, not advice.'),
    recap('Auto-enrolment: at least 8% of qualifying earnings in total, at least 3% from the employer.', 'Tax relief boosts contributions: £80 paid becomes £100 at basic rate.', 'DC: you bear the risk. DB: the scheme promises an income.', 'Access from 55 (57 from 2028); generally 25% tax-free.'),
  ],
)

const usAccounts = lesson(
  {
    title: 'US retirement accounts',
    description: '401(k)s, IRAs, employer matches and the Roth choice.',
    objectives: ['Calculate an employer match', 'Compare traditional and Roth accounts', 'Explain early withdrawal penalties and required minimum distributions'],
    tags: ['rt-us-accounts'],
    difficulty: 2,
    sources: [
      { label: 'IRS — Retirement plans', url: 'https://www.irs.gov/retirement-plans' },
      { label: 'IRS — Required minimum distributions (RMDs)', url: 'https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs' },
    ],
  },
  [
    key('The 401(k) and the employer match', 'A **401(k)** is an employer-sponsored plan funded from your paycheck. Many employers **match** part of what you put in, for example **50% of your contributions up to 6% of pay**. Not contributing enough to get the full match means turning down part of your pay. Matched money may **vest** over several years.'),
    num('q1', 'Your salary is $60,000. You contribute 6%, and your employer matches 50% of contributions up to 6% of pay. How much is the employer match per year?', 1800, '6% × $60,000 = $3,600; 50% of that = $1,800.', { prefix: '$', tolerance: 1 }),
    diagram({ type: 'compare', columns: [
      { title: 'Traditional 401(k) / IRA', tone: 'sky', points: ['Contributions usually reduce taxable income now', 'Growth is tax-deferred', 'Withdrawals taxed as ordinary income'] },
      { title: 'Roth 401(k) / IRA', tone: 'violet', points: ['Contributions made with after-tax money', 'Growth is tax-free', 'Qualified withdrawals are tax-free'] },
    ] }, 'Traditional versus Roth: tax now or tax later.'),
    match('q2', 'Match each feature with the account type.', [['Contributions usually reduce taxable income now', 'Traditional'], ['Qualified withdrawals are tax-free', 'Roth'], ['Withdrawals generally taxed as ordinary income', 'Traditional'], ['Contributions made with after-tax money', 'Roth']], 'Traditional: tax relief now, tax later. Roth: tax now, qualified withdrawals tax-free.'),
    key('Access rules', '- Withdrawals before age **59½** generally face a **10% additional tax** on top of ordinary income tax, with some exceptions.\n- From traditional accounts you must eventually take **required minimum distributions (RMDs)**. Under the SECURE 2.0 Act they currently start at **73** for many people. Check irs.gov for your situation.'),
    num('q3', 'At age 45 you withdraw $10,000 from a traditional 401(k) with no exception applying. How much is the 10% additional tax (before ordinary income tax)?', 1000, '10% × $10,000 = $1,000, plus ordinary income tax on the withdrawal.', { prefix: '$', tolerance: 1 }),
    tf('q4', 'If you expect your tax rate in retirement to be higher than it is now, a Roth account tends to look more attractive.', true, 'True. With a Roth you pay tax at today’s lower rate and qualified withdrawals later are tax-free.', { final: true }),
    warn('Limits change — check irs.gov', 'Contribution limits for 401(k)s and IRAs, and eligibility for Roth IRAs, change each year. Check irs.gov for the current tax year. This is education, not advice.'),
    recap('Get the full employer match where you can: it is part of your pay.', 'Traditional: tax relief now, taxed later. Roth: taxed now, qualified withdrawals tax-free.', 'Before 59½: generally a 10% additional tax. RMDs apply to traditional accounts.'),
  ],
)

const allocation = lesson(
  {
    title: 'Asset allocation through life',
    description: 'Glide paths, lifestyling and target-date funds.',
    objectives: ['Explain why allocation often changes with age', 'Describe glide paths and target-date funds', 'Recognise the limits of simple rules of thumb'],
    tags: ['rt-allocation'],
    difficulty: 2,
  },
  [
    text(
      'Time horizon shapes risk',
      'A 25-year-old has decades to recover from a market fall, so many hold mostly **shares** for growth. Close to retirement, a big fall matters more because there is less time to recover. Many investors therefore shift gradually towards **bonds and cash**.',
    ),
    diagram({ type: 'scale', left: 'More growth (shares)', right: 'More stability (bonds and cash)', items: [{ label: 'Age 25', position: 15, tone: 'violet' }, { label: 'Age 45', position: 35, tone: 'sky' }, { label: 'Age 60', position: 55, tone: 'mint' }, { label: 'Age 75', position: 70, tone: 'sun' }] }, 'An illustrative glide path. Not a recommendation.'),
    key('Glide paths and target-date funds', 'A **glide path** is a plan for shifting your mix as you age. **Target-date funds** (for example a “2060” fund) do this automatically, becoming more cautious as the date nears. Many UK workplace default funds do something similar, often called **lifestyling**. Check the fees and what the fund aims for at its target date.'),
    mcq('q1', 'In 2026, which fund is likely to hold more shares?', ['A 2065 target-date fund', 'A 2030 target-date fund', 'They hold identical mixes', 'Neither holds shares'], 0, 'The 2065 fund is decades from its target date, so it typically takes more growth risk.'),
    example('An old rule of thumb', '“Hold your age in bonds”: a 60-year-old would hold 60% in bonds. It is only a rough starting point. Many modern glide paths hold more shares, partly because retirements now last longer.'),
    num('q2', 'Under the “age in bonds” rule, how much of a £50,000 portfolio would a 40-year-old hold in bonds?', 20000, '40% × £50,000 = £20,000.', { prefix: '£', tolerance: 1 }),
    order('q3', 'Order this illustrative glide path from the most shares to the fewest.', ['Age 25: mostly shares', 'Age 45: shares with some bonds', 'Age 60: a more balanced mix', 'Age 75: more bonds and cash'], 'A glide path typically reduces share exposure as retirement approaches and progresses.'),
    tf('q4', 'Moving entirely into bonds and cash removes all risk in retirement.', false, 'False. It reduces market swings but increases the risk that inflation erodes your money or that it runs out over a long retirement.', { final: true }),
    recap('Allocation often becomes more cautious with age.', 'Glide paths, lifestyling and target-date funds automate the shift.', 'Rules of thumb are starting points; too little growth has risks too.'),
  ],
)

const drawingIncome = lesson(
  {
    title: 'Turning a pot into an income',
    description: 'The 4% rule, annuities and drawdown.',
    objectives: ['Apply the 4% rule as a rough guideline', 'Compare annuities and drawdown', 'Explain the 4% rule’s limitations'],
    tags: ['rt-withdrawal'],
    difficulty: 3,
  },
  [
    key('The “4% rule”', 'A guideline from US historical research in the 1990s: withdraw **4% of your pot in the first year**, then raise that cash amount each year with inflation. In the historical US data studied, a mix of shares and bonds lasted at least 30 years in most periods.\n\nIt is **not a guarantee**: it rests on past US returns, ignores fees and tax, and retirements may be longer than 30 years.'),
    num('q1', 'Under the 4% rule, what is the first-year withdrawal from a £500,000 pot?', 20000, '4% × £500,000 = £20,000.', { prefix: '£', tolerance: 1 }),
    num('q2', 'Inflation that year is 3%. Under the rule, what is the second-year withdrawal?', 20600, '£20,000 × 1.03 = £20,600. The amount rises with inflation, regardless of the pot’s value.', { prefix: '£', tolerance: 1 }),
    num('q3', 'Roughly what pot does the 4% rule suggest for a £30,000 first-year income?', 750000, '£30,000 ÷ 0.04 = £750,000 (equivalently, 25 × £30,000).', { prefix: '£', tolerance: 1 }),
    diagram({ type: 'compare', columns: [
      { title: 'Annuity', tone: 'mint', points: ['Swap some or all of your pot for a guaranteed income', 'Lifetime annuities pay for as long as you live', 'Usually cannot be reversed', 'Little or no flexibility'] },
      { title: 'Drawdown', tone: 'violet', points: ['Pot stays invested', 'You choose how much to take', 'Money left can be passed on', 'Can run out if withdrawals are too high or markets fall'] },
    ] }, 'Annuities trade flexibility for certainty. Drawdown does the opposite.'),
    multi('q4', 'Which are features of a lifetime annuity? Select all that apply.', ['Guaranteed income for life', 'Usually cannot be reversed once bought', 'Your remaining pot stays invested and can be passed on in full', 'Protects against outliving your money'], [0, 1, 3], 'A lifetime annuity converts the pot into a guaranteed income. The pot is no longer yours to invest or pass on.'),
    ukus('Mixing approaches', '- **UK**: many retirees combine drawdown with an annuity later, or use the State Pension as their guaranteed base.\n- **US**: annuities are also available, and **Social Security** itself works like an inflation-linked annuity, which is one reason some people delay claiming.'),
    mcq('q5', 'Which statement about the 4% rule is most accurate?', ['It guarantees your money will last 30 years', 'It is a UK legal limit on pension withdrawals', 'It is a rough historical guideline, not a guarantee', 'It means your pot earns a guaranteed 4% a year'], 2, 'It comes from historical US data and has important caveats.', { final: true }),
    recap('4% rule: withdraw 4% in year one, then rise with inflation — a rough guide only.', 'Annuities offer certainty; drawdown offers flexibility and keeps market risk.', 'Many people combine a guaranteed base with flexible withdrawals.'),
  ],
)

const retirementRisks = lesson(
  {
    title: 'Sequence risk and the cost of fees',
    description: 'Why the order of returns and small charges matter so much.',
    objectives: ['Explain sequence-of-returns risk', 'Calculate the effect of early losses during withdrawals', 'Show how fees compound over decades'],
    tags: ['rt-risks'],
    difficulty: 3,
  },
  [
    text(
      'Order matters once you withdraw',
      'For a lump sum left untouched, the **order** of yearly returns does not change the final value. Once you start **withdrawing**, it does. Losses early in retirement force you to sell more at low prices, leaving a smaller pot to recover. This is **sequence-of-returns risk**.',
    ),
    numbers('Same returns, different order (hypothetical)', [['Retiree A: −20%, +10%, +10%', '≈ £80,410 after 3 years'], ['Retiree B: +10%, +10%, −20%', '≈ £83,560 after 3 years']], 'Both start with £100,000 and withdraw £5,000 at the start of each year. No fees or tax.'),
    num('q1', 'Retiree A starts with £100,000, withdraws £5,000, then the pot falls 20%. What is it worth at the end of year 1?', 76000, '(£100,000 − £5,000) × 0.8 = £76,000.', { prefix: '£', tolerance: 1 }),
    mcq('q2', 'Why does Retiree A end with less, despite the same three returns?', ['A paid higher fees', 'A withdrew more money in total', 'The early loss hit a larger pot, and later withdrawals came out of a smaller one', 'Returns are always worse for early retirees'], 2, 'Both withdrew £15,000. The early fall left less money in the pot to benefit from the later gains.'),
    key('Ways people manage sequence risk', '- Keep a **cash buffer**, for example one to two years of spending.\n- Be **flexible**: take less after bad years.\n- Use an **annuity** or state pension to cover essential spending.\n- Hold a **balanced mix** of assets.'),
    diagram({ type: 'bars', unit: '£', bars: [{ label: 'Start', value: 100000, tone: 'grey' }, { label: '6% a year', value: 574349, tone: 'mint' }, { label: '5% a year (1% fee)', value: 432194, tone: 'coral' }] }, 'Illustrative: £100,000 for 30 years. A 1% annual fee turns a 6% return into 5%.'),
    num('q3', 'Using the chart, how much less does the pot with a 1% fee end with after 30 years, to the nearest £1,000?', 142000, '£574,349 − £432,194 = £142,155, about £142,000.', { prefix: '£', tolerance: 1000 }),
    tf('q4', 'A 1% annual fee costs only about 1% of your final pot over 30 years.', false, 'False. In the example, the 1% fee leaves a pot about 25% smaller (£142,155 ÷ £574,349), because fees compound too.', { final: true }),
    recap('Sequence risk: early losses during withdrawals do lasting damage.', 'Cash buffers, flexibility and guaranteed income can help manage it.', 'Small annual fees compound into large differences over decades.'),
  ],
)

export const c10 = course({
  id: 'c10',
  slug: 'retirement-and-pensions',
  title: 'Retirement and Pensions',
  tagline: 'Your future self will thank you.',
  description: 'Learn why retirement saving matters, how UK and US pensions and retirement accounts work, and how people invest for and draw an income through retirement. Educational only, not personal advice.',
  colour: 'violet',
  icon: 'hourglass',
  outcomes: [
    'Explain how compounding and inflation shape long-term retirement planning',
    'Describe the UK State Pension, workplace pensions and SIPPs at an educational level',
    'Describe US Social Security, 401(k)s and traditional and Roth IRAs',
    'Compare ways to invest for and draw an income in retirement, and the risks involved',
  ],
  units: [
    {
      title: 'Why retirement saving matters',
      description: 'Longevity, compounding and inflation.',
      lessons: [whyPlan, compounding, inflation],
      checkpoint: {
        concept: 'rt-why-save',
        questions: [
          mcqQ('c1', 'The risk of outliving your savings is called…', ['market risk', 'longevity risk', 'credit risk', 'currency risk'], 1, 'Longevity risk.', { concept: 'rt-why-save' }),
          matchQ('c2', 'Match each scheme with its country.', [['State Pension', 'UK'], ['Social Security', 'US'], ['401(k)', 'US'], ['SIPP', 'UK']], 'State Pension and SIPPs are UK; Social Security and 401(k)s are US.', { concept: 'rt-why-save' }),
          numQ('c3', '£5,000 grows at 4% a year for 10 years. Value to the nearest pound?', 7401, '£5,000 × 1.04¹⁰ ≈ £5,000 × 1.4802 ≈ £7,401.', { prefix: '£', tolerance: 2, concept: 'rt-compounding' }),
          numQ('c4', 'Rule of 72: roughly how many years to double at 9% a year?', 8, '72 ÷ 9 = 8 years.', { suffix: ' years', tolerance: 0.5, concept: 'rt-compounding' }),
          tfQ('c5', 'Retirement goals are best set in today’s money (real terms).', true, 'Real terms reflect what money can actually buy.', { concept: 'rt-inflation' }),
          numQ('c6', 'With 2% inflation a year, what will £1,000 buy after 10 years, in today’s money, to the nearest pound?', 820, '£1,000 ÷ 1.02¹⁰ ≈ £1,000 ÷ 1.219 ≈ £820.', { prefix: '£', tolerance: 1, concept: 'rt-inflation' }),
        ],
      },
    },
    {
      title: 'Pensions in the UK and US',
      description: 'State schemes, workplace pensions and retirement accounts.',
      lessons: [statePensions, ukPensions, usAccounts],
      checkpoint: {
        concept: 'rt-state-pension',
        questions: [
          mcqQ('c1', 'How many qualifying years are usually needed for the full UK new State Pension?', ['10', '30', '35', '40'], 2, '35 qualifying years.', { concept: 'rt-state-pension' }),
          tfQ('c2', 'US Social Security benefits are based on your 35 highest-earning years.', true, 'Adjusted for wage growth.', { concept: 'rt-state-pension' }),
          numQ('c3', 'Qualifying earnings £30,000. Minimum total auto-enrolment contribution?', 2400, '8% × £30,000 = £2,400.', { prefix: '£', tolerance: 1, concept: 'rt-uk-pensions' }),
          numQ('c4', 'Relief at source at 20%: you pay £240. How much goes into the pension?', 300, '£240 ÷ 0.8 = £300; HMRC adds £60.', { prefix: '£', tolerance: 1, concept: 'rt-uk-pensions' }),
          multiQ('c5', 'Which describe a Roth IRA? Select all that apply.', ['Contributions made with after-tax money', 'Qualified withdrawals are tax-free', 'Contributions reduce taxable income now', 'A UK pension wrapper'], [0, 1], 'Roth: tax now, qualified withdrawals tax-free. It is a US account.', { concept: 'rt-us-accounts' }),
          numQ('c6', 'Salary $80,000. You contribute 5%; your employer matches 100% up to 4% of pay. Annual employer match?', 3200, 'The match is capped at 4% × $80,000 = $3,200.', { prefix: '$', tolerance: 1, concept: 'rt-us-accounts' }),
        ],
      },
    },
    {
      title: 'Investing through retirement',
      description: 'Allocation, withdrawals and the risks along the way.',
      lessons: [allocation, drawingIncome, retirementRisks],
      checkpoint: {
        concept: 'rt-allocation',
        questions: [
          mcqQ('c1', 'A target-date fund…', ['keeps the same mix forever', 'only holds cash', 'becomes more cautious as its target date nears', 'guarantees a return'], 2, 'It follows a glide path.', { concept: 'rt-allocation' }),
          tfQ('c2', 'Holding only cash throughout a long retirement carries no risk.', false, 'Inflation can erode its value.', { concept: 'rt-allocation' }),
          numQ('c3', '4% rule: first-year withdrawal from a $800,000 pot?', 32000, '4% × $800,000 = $32,000.', { prefix: '$', tolerance: 1, concept: 'rt-withdrawal' }),
          orderQ('c4', 'Order the 4% rule steps.', ['Work out 4% of the starting pot', 'Withdraw that amount in year one', 'Increase the cash amount by inflation each year'], 'Set the first withdrawal, then index it to inflation.', { concept: 'rt-withdrawal' }),
          mcqQ('c5', 'Sequence-of-returns risk is greatest when…', ['losses come early while you are withdrawing', 'losses come before you start saving', 'you never withdraw', 'fees are zero'], 0, 'Early losses during withdrawals do lasting damage.', { concept: 'rt-risks' }),
          tfQ('c6', 'Over decades, small differences in annual fees can add up to large differences in final value.', true, 'Fees compound too.', { concept: 'rt-risks' }),
        ],
      },
    },
  ],
  exam: {
    concept: 'rt-why-save',
    questions: [
      mcqQ('e1', 'Which is a key job of a retirement pot?', ['Doubling every year', 'Lasting as long as you do', 'Avoiding all investment', 'Matching last year’s best fund'], 1, 'It must manage longevity risk.', { concept: 'rt-why-save' }),
      numQ('e2', '£20,000 grows at 7% a year for 10 years. Value to the nearest pound?', 39343, '£20,000 × 1.07¹⁰ ≈ £20,000 × 1.9672 ≈ £39,343.', { prefix: '£', tolerance: 5, concept: 'rt-compounding' }),
      tfQ('e3', 'Starting to save ten years earlier can matter more than paying in larger amounts later.', true, 'Early money has more years to compound.', { concept: 'rt-compounding' }),
      numQ('e4', 'Rule of 72: at 4% inflation, roughly how many years until prices double?', 18, '72 ÷ 4 = 18 years.', { suffix: ' years', tolerance: 0.5, concept: 'rt-inflation' }),
      mcqQ('e5', 'What is the usual minimum number of qualifying years for any UK new State Pension?', ['5', '10', '20', '35'], 1, 'Usually 10 qualifying years.', { concept: 'rt-state-pension' }),
      mcqQ('e6', 'The US full retirement age for someone born in 1975 is…', ['62', '65', '66', '67'], 3, '67 for those born in 1960 or later.', { concept: 'rt-state-pension' }),
      numQ('e7', 'Qualifying earnings £25,000; employer pays the 3% minimum. Minimum employee share (including tax relief)?', 1250, '(8% − 3%) × £25,000 = 5% × £25,000 = £1,250.', { prefix: '£', tolerance: 1, concept: 'rt-uk-pensions' }),
      matchQ('e8', 'Match each pension type with who bears the investment risk.', [['Defined contribution', 'The member'], ['Defined benefit', 'The employer or scheme'], ['SIPP', 'The member']], 'DC pots and SIPPs depend on investment returns; DB schemes promise an income.', { concept: 'rt-uk-pensions' }),
      tfQ('e9', 'The UK normal minimum pension age is due to rise from 55 to 57 in 2028.', true, 'From 6 April 2028, with some exceptions.', { concept: 'rt-uk-pensions' }),
      numQ('e10', 'You withdraw $20,000 early from a traditional IRA at 40, with no exception. What is the 10% additional tax?', 2000, '10% × $20,000 = $2,000, plus ordinary income tax.', { prefix: '$', tolerance: 1, concept: 'rt-us-accounts' }),
      multiQ('e11', 'Which are true of traditional 401(k)s? Select all that apply.', ['Contributions usually reduce taxable income now', 'Withdrawals are generally taxed as ordinary income', 'Required minimum distributions apply', 'All withdrawals are tax-free'], [0, 1, 2], 'Traditional accounts defer tax; RMDs apply.', { concept: 'rt-us-accounts' }),
      orderQ('e12', 'Order this illustrative glide path from most shares to fewest.', ['Age 30', 'Age 50', 'Age 65', 'Age 80'], 'Glide paths usually reduce share exposure with age.', { concept: 'rt-allocation' }),
      numQ('e13', 'Using the 4% rule, roughly what pot would support a £24,000 first-year income?', 600000, '£24,000 ÷ 0.04 = £600,000.', { prefix: '£', tolerance: 1, concept: 'rt-withdrawal' }),
      mcqQ('e14', 'Compared with drawdown, a lifetime annuity offers…', ['more flexibility', 'certainty of income for life', 'higher guaranteed growth', 'easy reversal'], 1, 'It trades flexibility for a guaranteed income.', { concept: 'rt-withdrawal' }),
      numQ('e15', 'Start £200,000; withdraw £10,000; then the pot falls 10%. Value at year end?', 171000, '(£200,000 − £10,000) × 0.9 = £171,000.', { prefix: '£', tolerance: 1, concept: 'rt-risks' }),
    ],
  },
})
