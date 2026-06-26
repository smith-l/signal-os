DELETE FROM applications;

INSERT INTO applications (company, role_title, status, recruiter, salary, jira_id, prep_page_url, next_action, stability_check, notes)
VALUES
  ('Atlassian', 'Senior Manager, Solutions Engineering — Nordics & CEE', 'HM Interview', 'Georgie Lawrence', '£150k + £30k + RSUs', 'JS-1', 'https://leesmith286.atlassian.net/wiki/x/AgB3', 'Peer stage — Georgie arranging', 'PASS', 'Passed Kira HM call 25 Jun. Team of 7. Nordics & CEE mid-market. Transformation mandate confirmed.'),
  ('Workday', 'Manager, Solution Consulting UKI', 'HM Interview', 'Leah Houlihan', '£120k + 30% + £80k stock + £10k car', 'JS-6', 'https://leesmith286.atlassian.net/wiki/x/LwBf', 'Faizan Siddiqi HM call — scheduler incoming', 'PASS', 'TA screen passed 23 Jun. Team of 7 SCs. Stabilisation mandate. Faizan HM next.'),
  ('Dialpad', 'International SE Leadership', 'Applied', 'Jared Dennison / Nick Fox', 'TBC', '', '', 'Nick Fox call Friday afternoon (Texas time)', 'REVIEW', 'Warm intro via Jared Dennison and Jim (VP Channel). Two 2025 layoff rounds. Domain fit excellent.'),
  ('Zscaler', 'Sales Engineering Manager, UKI', 'Applied', '', 'TBC', 'JS-11', '', 'Awaiting response', 'PASS', 'Applied 25 Jun. No hard cybersecurity domain requirement. $3.5B ARR, 25% YoY growth.'),
  ('AlphaSense', 'Pre-Sales Manager, UK Financial Services', 'Applied', '', 'TBC', 'JS-12', '', 'Awaiting response', 'PASS', 'Applied 25 Jun. Pre-sales embedded in CS. $600M ARR, $7.5B valuation.'),
  ('Riverbed', 'Director, Solutions Engineering UK&I', 'Applied', '', 'TBC', 'JS-2', 'https://leesmith286.atlassian.net/wiki/spaces/~712020689ee11dab184fc3babb674c83d7421c/pages/3342337', 'Application in with referral — leaving to play out', 'CAUTION', 'Warm referral via Tim Keford and Richard (CTO). SE function hit in Jan 2026 layoffs.'),
  ('Splunk (Cisco)', 'AVP, Solutions Engineering UKI', 'Applied', '', 'TBC', 'JS-9', '', 'Jim Butler referral unlikely — no live contact', 'REVIEW', 'Applied. Cisco/Splunk run separately. Moderate stability concern post-acquisition.'),
  ('Algolia', 'Solutions Engineering Manager, EMEA North', 'Applied', '', '£112k–£140k OTE', 'JS-8', '', 'Awaiting response', 'PASS', 'Applied 12 Jun. Stretch — search domain gap, below target package.'),
  ('Monta', 'Director, Solution Engineering', 'Applied', '', '£130k + 25% + equity', 'JS-4', '', 'Recruiter call pending', 'PASS', 'Applied 06 May. Stability checked — healthy, well-funded, growing EV charging company.'),
  ('Sovos', 'Manager, Sales Engineering EMEA', 'Applied', 'Giselle Rodriguez', 'TBC', '', '', 'Awaiting salary/team info from recruiter', 'PASS', 'LinkedIn recruiter outreach. Awaiting details before committing to call.'),
  ('FinTech via Beynd', 'Head of Pre-Sales', 'Applied', '', '£130k', 'JS-5', '', 'No response — low confidence', 'UNKNOWN', 'Anonymous company. Applied 04 Jun. Very low confidence.');
