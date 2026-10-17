# Content: authoring, standards and sources

## Authoring
Courses live in `src/content/courses/*.ts`, written with the helpers in `src/content/builders.ts` (`text`, `key`, `example`, `warn`, `ukus`, `analogy`, `diagram`, `numbers`, `recap`, and question builders `mcq`, `tf`, `multi`, `num`, `match`, `order`). IDs are derived from position (`c1-u2-l3.q4`) — **append new lessons/questions rather than reordering** existing ones, or learner progress will point at different content.

`src/content/validate.ts` (run by `npm test`) enforces: unique IDs, ≥3 questions per lesson, a recap and objectives, the last question flagged as the final challenge, valid answer indices, non-ambiguous options, ≥5 checkpoint and ≥12 exam questions, valid dataset references, and that every canonical answer grades as correct.

After edits: `npm test && npm run content:sql`.

## Writing standards
Each lesson: introduction, objectives, concise explanation, realistic example, interactive questions, recap, final challenge; ~5 minutes. Terms are defined at first use. UK and US differences are called out in “UK & US” callouts.

## Factual claims and sources
Numerical examples are worked calculations, verified with the formula tests or by computation. Factual claims about institutions and rules are stated with their jurisdiction, and lessons list sources where relevant. Key references:

- Bank of England, Monetary Policy Committee and 2% CPI target — https://www.bankofengland.co.uk/monetary-policy
- Federal Reserve, FOMC, statutory mandate and 2% PCE goal — https://www.federalreserve.gov/monetarypolicy.htm
- London Stock Exchange trading hours (08:00–16:30 UK time) — https://www.londonstockexchange.com/
- NYSE core session 9:30am–4:00pm ET — https://www.nyse.com/markets/hours-calendars
- SEC, US move to T+1 settlement (28 May 2024) — https://www.sec.gov/
- GOV.UK: Stamp Duty Reserve Tax on shares (0.5%) — https://www.gov.uk/tax-buy-shares
- GOV.UK: ISAs (£20,000 allowance, 2025/26) — https://www.gov.uk/individual-savings-accounts
- GOV.UK: dividend allowance (£500 from April 2024) — https://www.gov.uk/tax-on-dividends
- GOV.UK: Capital Gains Tax annual exempt amount (£3,000 from April 2024) — https://www.gov.uk/capital-gains-tax/allowances
- IRS Topic 404, dividends (qualified dividends 0/15/20%) — https://www.irs.gov/taxtopics/tc404
- ONS (GDP, CPI) — https://www.ons.gov.uk/ ; NBER business cycle dating — https://www.nber.org/research/business-cycle-dating
- FTSE Russell, S&P Dow Jones Indices and Nasdaq index methodologies; S&P SPIVA scorecards.

Tax content is dated to the **UK 2025/26 and US 2025 tax years** and must be reviewed each year (`src/content/courses/c7-dividends.ts`, lesson “Tax basics”).

## Company content
Case studies (`src/data/caseStudies.ts`) are qualitative, written in October 2026 from the companies’ own public descriptions, link to primary sources, and contain **no reported figures**. Calculations use invented numbers and are labelled “hypothetical”. The fictional “Brightcup Coffee” is used for statement exercises and labelled as such.

## Review checklist for new lessons
- [ ] Every claim is either general knowledge, sourced, or clearly hypothetical
- [ ] Worked numbers re-computed
- [ ] UK/US jurisdiction stated for rules and taxes
- [ ] No implied advice, guarantees or predictions
- [ ] Questions have one defensible answer and an explanation of the misconception
