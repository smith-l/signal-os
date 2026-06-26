-- Migration v3: clean Confluence content migration
-- wrangler d1 execute signal-os-db --remote --file=migration_v3.sql

CREATE TABLE IF NOT EXISTS knowledge_base (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_key TEXT NOT NULL,
  section_title TEXT NOT NULL,
  content TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELETE FROM role_prep;
DELETE FROM knowledge_base;

INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (7, 'overview', 'Overview', '# Atlassian

**Role:** Senior Manager, Solutions Engineering — Mid-Market Nordics & CEE  |  **Base:** £150k  |  **Variable:** £30k (20%)  |  **Stock:** RSUs  |  **Status:** Peer Interview — Georgie arranging

**Prep pages for this role:**

- [Interview Rounds — Stage-by-Stage Prep](https://leesmith286.atlassian.net/wiki/x/AQBm)
- [Atlassian Values — Interview Prep](https://leesmith286.atlassian.net/wiki/x/AwBf)
- [Kira GO Sheet](https://leesmith286.atlassian.net/wiki/x/AgB3)
- [Atlassian Product Set — Buyer Personas & What Matters](https://leesmith286.atlassian.net/wiki/x/AYAL)

---

## HM Call — Kira Lombardi ✅ PASSED (25 June 2026)

Call went well. Kira confirmed role is progressing to peer stage. She will let Georgie know to arrange.

**Role change confirmed on this call:** no longer UKI — now **Mid-Market Nordics and CEE** (Central and Eastern Europe).

---

## What We Now Know — Confirmed on the Kira Call

This section replaces the previous hypothesis-heavy version. Everything below was confirmed directly by Kira — not inferred from a TA conversation.

| Area | Confirmed State | Implication |
| --- | --- | --- |
| **Geography** | Mid-Market Nordics and CEE | Distributed team across multiple regions — cultural awareness, remote leadership, async communication. Directly evidenced: managed French team and Benelux/Nordics at Zoom under the EMEA North remit. |
| **Team size** | 7 SEs — 3 senior, mix of mid-career and junior starters | Broad spread of experience. Seniors may have strong views on how things should work. New starters need structured onboarding. |
| **Sales org** | New and growing fast, no real playbook | SE and Sales transformation need to happen in parallel — can''t build SE motion on a solid Sales foundation because the Sales foundation isn''t there yet. |
| **Current SE posture** | Mostly demo-based — SEs are handed deals to demo rather than owning end-to-end | Confirmed reactive. The transformation mandate is real. |
| **SE/Sales relationship** | Limited — no QBR involvement, no pipeline ownership from the outset | Kira explicitly wants SEs presenting alongside AEs on QBRs and actively supporting pipeline growth from the start. |
| **CS function** | Limited and under-resourced — SE/CS engagement minimal today | Will change as both orgs grow. Foundation needs to be built now so the relationship is ready when CS scales. |
| **Product portfolio** | Broad — SEs don''t have a joined-up talk track or coherent demo narrative | Kira wants a talk track that connects the products together, and a demo narrative that shows the platform as a whole with ease. |


---

## What Kira Wants in 12 Months

Not a fully transformed team — a team on a journey, with the foundation in place. Specifically:

- SEs owning deals end-to-end, not just doing demos
- Value-add sales motion — SE supporting pipeline growth from the outset
- SEs presenting alongside AEs on QBRs
- A connected talk track that joins the product portfolio together
- A demo narrative that shows the platform as a coherent whole
- SE/CS collaboration foundations built and ready to scale
- The SE team on the journey — progress evidenced, not perfection delivered

---

## The Multi-Region Experience — Confirmed and Usable

The Nordics and CEE geography isn''t a gap — it''s directly evidenced. At Zoom, the EMEA North remit included Benelux and the Nordics, and the French team was managed initially too. Managing people across different cultures, time zones, and working styles is part of the actual track record, not something to explain away.

For the peer round: if the distributed team question comes up, lead with specifics — French team management, Benelux coverage, Nordics engagement — rather than generic "I''m comfortable with distributed teams." Concrete beats conceptual every time.

---

## The Transformation — Now Confirmed, Not a Hypothesis

Kira confirmed all of this directly. The brief is:

- Reactive demo team → proactive, end-to-end SE ownership
- No Sales playbook → SE helping build one alongside Sales leadership
- Disconnected product portfolio → joined-up talk track and demo narrative
- Minimal CS engagement → SE/CS foundation built as both orgs grow

This maps almost exactly to the Zoom GTM pivot — SEs moved from reactive demo machines to proactive commercial partners with their own playbooks, pipeline ownership, and partner enablement responsibilities. The difference is the Atlassian motion is account-led (existing customers, expansion) rather than pipeline-led (net-new). The transformation muscle is the same.

**Stories to use for this:**

- The transformation mandate → Story 6 (building through transformation) and the Zoom capability roadmap angle
- SE/Sales QBR model → Story 2 (case request process — attach rate, data-driven behaviour change)
- Talk track and demo narrative → AI-first transformation at Zoom (building playbooks and demo frameworks that changed how the team positioned)
- CS bridge foundation → frame as a first-90-days priority, not a current achievement

---

## The Talk Track and Demo Narrative Brief

This is the most specific and actionable thing Kira said. The team has a lot of products and currently no coherent story connecting them. Kira wants:

- A talk track that joins the products together — "here''s how Atlassian works as a system"
- A demo narrative that shows the platform with ease — the products working together, not shown in isolation

This is a clear 30/60/90 deliverable. For the peer round, having a point of view on how you''d approach building this will land better than a generic "I''d assess the current state first." Something like:

"I''d start by working with the most commercially experienced SEs to understand how they naturally connect the products in customer conversations today — because that institutional knowledge usually exists, it''s just not documented. Then I''d build the talk track from the outside in: what''s the customer problem, which products solve which part of it, and what does a coherent before-and-after story look like? The demo narrative follows from that — same story, shown rather than told."

---

## The 90-Day Plan — Updated for Confirmed Brief

| Phase | Theme | Actions |
| --- | --- | --- |
| **Days 1–30** | Listen & Learn | 1:1s with all 7 SEs — understand current workflow, what they''re asked to do, what frustrates them. Ride-alongs on live customer calls across Nordics and CEE. Meet every AE in the territory — what do they currently use SE for, what do they wish they had? Meet CS leads — first conversation about how SE and CS currently intersect. Into the CRM — understand pipeline health, SE attachment rate, win rates. Won''t do: restructure, change coverage, make promises. |
| **Days 31–60** | Diagnose & Align | Share back what I''ve heard — with the SEs first, then with Kira. Introduce discovery-before-demo standard — the first non-negotiable. Start building the talk track with the senior SEs — work with what they already know. Propose first SE/AE QBR co-presentation model — small scale, test it, refine it. First CS conversation about a joint account review model on top expansion accounts. |
| **Days 61–90** | Build for Scale | Formalise the operating model — discovery standards, SE/Sales engagement model, QBR rhythm. Complete the first version of the connected talk track and demo narrative. Introduce outcome-based metrics — technical win rate, SE pipeline contribution, QBR co-presentation rate. Present findings and progress to Kira — here''s what I found, here''s what I''ve built, here''s how we measure it going forward. |


---

## The Package

| Element | Value | Notes |
| --- | --- | --- |
| Base salary | £150,000 | Above £140k target |
| Variable (OTE) | £30,000 (20%) | Confirm attainment expectations and historical payout |
| Total cash at target | £180,000 |  |
| Stock (RSUs) | TBC | Confirm grant size, 4-year vest, 1-year cliff, refresh policy |


---

## AI Approach — What Landed With Georgie, Applicable Throughout

"AI for AI''s sake doesn''t work. I start with discovery — understand what the customer is trying to achieve, what''s slowing them down, what success looks like. Then I look at where AI can accelerate that outcome, reduce friction, or deliver measurable ROI. The technology follows the problem, not the other way around."

This mirrors Atlassian''s Rovo positioning directly. Use consistently across all remaining stages.', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (7, 'go_sheet', 'GO Sheet', '**Thursday 25 June, 3:00pm UK time (updated from 4pm) | Kira Lombardi, VP SE Mid-Market, Austin-based**
This is the single reference to read the morning of. Everything else in the prep hub is the depth behind it.

---

## The Call in One Sentence

Kira is assessing whether you can own UKI/Nordics/Benelux independently, build a high-performing team, and deliver outcomes — not whether you know Atlassian''s product cold.

---

## Stories Aligned to This Stage

Three areas Georgie explicitly named. One story per area — don''t reuse.

| What Kira''s assessing | Story to use | Key outcome to land |
| --- | --- | --- |
| **Ownership of outcomes** | Zoom transformation — 4 to 13, meetings → UC → CCaaS → AI, direct → channel-first | Channel revenue 20% → 60% in 18 months. Framework adopted globally. |
| **Managing to results / operating model** | Case Request process (Story 2) — Salesforce process, data to drive behaviour change | SE attach on 75% of qualified opportunities. Shorter cycles, improved win rate. |
| **Develop other leaders** (explicitly called out) | Ronald (Story 8) — demo environments → QBRs → Team Leader promotion | By the time the title came up, it was a formality. He''d already done the job. |


**If domain gap comes up:** "My background is UC and CCaaS rather than Atlassian''s product domain. What I bring is the SE leadership model and a track record of closing product knowledge gaps quickly while keeping the team performing. Product ramp — one quarter. Operating model work — day one."

---

## The Five Things to Land

- **Zoom transformation story** — 90 seconds, no longer. Growth, pivot, global impact.
- **Systems not heroics** — "I build the playbooks and operating rhythm that allow any SE to perform consistently — not just when I''m in the room."
- **Ask about reactive vs proactive — don''t assert it** — "One thing I''m curious about — how does the SE team engage today? Is it more responsive, or is there already a proactive motion in place?" Let her answer shape what you say next.
- **Ask about SE-CS — don''t assert the gap** — "How does the SE team work with Customer Success on existing accounts today?" Same principle — find out first, then respond.
- **Why Atlassian, why mid-market** — PLG-to-enterprise momentum, Rovo AI, System of Work. Mid-market is where that compounds fastest — deal velocity, high adoption signal, fast iteration. Tie to channel programme at Zoom as evidence you''ve operated in a fast, repeatable-motion environment.

---

## What Do You Know About Atlassian — Answer

Two separate questions that get conflated. Keep them distinct:

**"What do you know about Atlassian?"** — factual and current, not motivational. Answer:

"Atlassian is a team collaboration and productivity company — Jira, Confluence, Jira Service Management at the core. But the story right now is really about what sits on top of all of them. At Team ''26 in May they made it clear that Rovo — their AI layer — has moved from being a smart assistant to something that can plan and execute work autonomously. The underlying data layer is the Teamwork Graph, now over 150 billion connections across how teams actually work. What''s interesting is they''ve opened that up to third-party agents via an MCP server — so it''s not just Atlassian-internal anymore, it''s positioning itself as the context layer for enterprise AI more broadly. Over 90% of enterprise customers are using Rovo, agentic automations grew 7x in the last six months, and cloud revenue is around $1B a quarter, up 26% year on year. For me that''s the interesting moment — they''re not a project management tool anymore, they''re making a serious play for being the operating system for how knowledge work gets done."

**"Why Atlassian?"** — personal and specific. Answer is in the Five Things section above (PLG-to-enterprise momentum, mid-market compounding fastest, the kind of value conversations the SC motion now requires). Don''t use the facts above to answer this one.

---

## The Rovo / Teamwork Graph Architecture — Know This Cold

If Kira asks what excites you about Atlassian''s direction, this is a more specific and credible answer than "Rovo is interesting":

A Jira project has a branch task — complete a code build. That task gets assigned to a Rovo agent directly in Jira, the same way you''d assign it to a human. The agent picks up all the context from the ticket and the Teamwork Graph — the spec in Confluence, the PR in GitHub, the related tickets. Because the Teamwork Graph is now open via an MCP server, it can hand off to an external agent like Claude Code to do the actual code work, then pull the result back, update the Jira ticket, and log everything with a full audit trail. Rovo orchestrates, the external agent executes, Jira tracks it all. That''s what "AI-native organisation" actually means in practice — not AI helping people write tickets, but agents doing the work end-to-end with humans staying in the loop at the decision points.

This is also directly relevant to the SC motion: the conversation SEs are now having with customers isn''t "here''s a feature," it''s "here''s how your engineering teams, product teams, and ops teams work differently when agents are doing the repeatable work." That''s the value conversation.

---

## Questions to Ask Kira

Pick three or four based on how the conversation flows. Don''t ask anything she''s already answered.

- How does the SE team engage today — more reactive, or already a proactive motion?
- How does SE work with Customer Success on existing accounts?
- What does the AE profile look like across UKI, Nordics, Benelux — experienced mid-market reps or earlier career?
- What does success look like at 12 months from your perspective?
- On the growth to four SEs — is that firm, or dependent on what the first six months show?
- The Nordics & Benelux Enterprise SE Manager role is also posted — is that a separate team, or is there overlap worth discussing?

---

## The Atlassian Values — Stories Mapped

The Values Interview is Stage 3, not this stage. But if Kira touches on any of these, here''s what to pull:

| Value | What they probe | Story |
| --- | --- | --- |
| **Play, as a team** | Helping a team member succeed when they''re not performing | Story 10 — coaching the Mitel SE on discovery (shadow, 60-day plan, win rate recovered) |
| **Be the change you seek** | Advocating for and driving change | Channel-first GTM pivot at Zoom, or Mitel post-merger rebuild |
| **Don''t #@!% the customer** | Putting customer first over commercial pressure | HMRC — navigating internal complexity to protect the deployment and the customer relationship |
| **Open company, no bullsh*t** | Difficult conversations, conflict, directness | Story 11 — SE resistant to new KPI framework (heard the substance, held the line on behaviour) |
| **Build with heart and balance** | Real failure, recovery, what you learned | Story 12 — Case request rollout to enterprise (diagnostic error, weeks of friction, corrected) |


---

## Story 12 — Build with Heart and Balance

**"When I introduced the case request process at Zoom, I rolled it out across both mid-market and enterprise at the same time. Mid-market was the team I''d diagnosed the problem in — SEs being pulled in late, no context on the deal, wasted effort on poorly qualified opportunities. I assumed enterprise had the same problem and applied the same fix without checking.**

**A few weeks in, I started hearing from the SE team that the enterprise AEs weren''t happy. The friction had been building for a while before it surfaced to me — the AEs were raising it directly with the SEs rather than coming to me. I brought it up in my next 1-2-1 with the enterprise sales lead, and the conversation made it clear pretty quickly that I''d got it wrong. In enterprise, the AE-SE relationship was already a genuine partnership — lower deal volumes, longer cycles, tight collaboration from day one. The case request process wasn''t solving a problem that existed there; it was adding overhead to something that was already working.**

**I removed the requirement for enterprise and kept it for mid-market where it belonged.**

**What I learned wasn''t just ''move slower'' — it was that I''d made a diagnostic error. I''d assumed the same symptom existed across both segments because I''d seen it in one of them, without testing whether the context was actually the same. I''d diagnosed mid-market and treated enterprise. I now make a deliberate point of testing the problem definition with the right stakeholders before implementing anything, not after."**

Roughly 90 seconds spoken. Resist the urge to compress the timeline — the few weeks of friction before it surfaced is part of the honest telling.

---

## Wildcard — "What do you do for fun?" (within the team)

**Answer:** "I''m deliberate about it — it doesn''t happen by accident. I run a Friday highlight in the team chat, calling out something specific someone did well that week. If it''s a big win, I ask them to present it on the next team call — that creates recognition and learning at the same time. Every quarter we get together in person, and I always open that day with something unexpected. Last one was an AI-generated treasure hunt around London from our office — lasted about an hour, got people talking and laughing before we got into any business. The idea is that the energy you create together carries into how the team operates when they''re back at their desks."

---

## Watch-Outs

- Don''t monologue on background — she knows the CV. Get to the point fast.
- Don''t assert the team is reactive or that SE-CS doesn''t exist — ask, don''t tell.
- Don''t say "I would build a CS bridge" as if the gap is confirmed. Find out first.
- Don''t talk enterprise — this is pure mid-market.
- Don''t be generic about Atlassian — reference Rovo, Teamwork Graph, Team ''26 specifically.
- Don''t dwell on the domain gap — name it once, briefly, pivot.
- "What do you know" and "why Atlassian" are different questions — don''t blur the answers.

---

## Logistics

- **Time:** Thursday 25 June, **3:00pm UK (BST) — updated from 4pm.** Kira is Austin-based — 9:00am her time (CDT).
- **Format:** Video call — check the link is confirmed and working beforehand.
- **Length:** 45 minutes standard.
- **After:** Atlassian reviews feedback before scheduling the next stage. No expectation of same-day follow-up.

---

## Full Prep Pages

- [Main Role Page](753665.html) — role context, transformation hypothesis, 90-day plan, package
- [Interview Rounds — Stage-by-Stage](https://leesmith286.atlassian.net/wiki/x/AQBm) — what each stage assesses
- [Kira — Model Answers in My Own Words](https://leesmith286.atlassian.net/wiki/x/AwBl) — practiced answers in your voice
- [Atlassian Values — Interview Prep](https://leesmith286.atlassian.net/wiki/x/AwBf) — the five values with story angles
- [Core Behavioural Stories](https://leesmith286.atlassian.net/wiki/x/GQAL) — the full story bank', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (7, 'interview_process', 'Interview Process', '**Status:** Hiring Manager Interview confirmed — Thursday 25 June, 4:00pm UK time. Five-stage process, each 45 minutes, feedback reviewed after each stage before the next is scheduled.

**Source caution:** The "reactive SE team" and "no SE-CS relationship" framing in this page originated from an early conversation with Georgie Lawrence (TA) and was previously treated as confirmed fact. It is not independently verified and the exact source is no longer traceable with confidence. Throughout this page, references to it have been rewritten as questions to ask Kira, not facts to assert. See the main Atlassian page for the full caution note.

## The Five Stages at a Glance

| Stage | Who | Status | Date |
| --- | --- | --- | --- |
| 0. TA Screening | Georgie Lawrence | COMPLETE | 05/06/2026 |
| 1. Hiring Manager | Kira Lombardi | CONFIRMED | **Thu 25 June, 4:00pm UK** |
| 2. Peer Interview | Another manager, Sales & Success org | UPCOMING | TBC |
| 2. Practical Interview | Future close partners | UPCOMING | TBC |
| 3. Leadership Interview | Senior leader, org/region | UPCOMING | TBC |
| 3. Values Interview | TBC | UPCOMING | TBC |


Values prep (the five Atlassian values with probing questions and story angles) has its own dedicated page — linked at the bottom.

---

## Stage 1 — Hiring Manager: Kira Lombardi

**Thursday 25 June, 4:00pm UK time.** Kira is Austin-based — confirm this time works for her local time before the call.

**What''s assessed (official guide):** How you take ownership of your and your team''s work and drive to outcomes. Your ability to consistently deliver results. Your approach and ability to hold your team accountable to high performance.

**Georgie''s three named areas, mapped to evidence:**

- **Ownership of outcomes** — use the Zoom transformation story and the channel programme as evidence.
- **Managing to results** — the 90-day plan thinking and outcome-based metrics story belongs here.
- **Building high-performing teams** — note "develop other leaders" is explicitly called out. Have an example of growing someone into a leadership-track role, not just a strong IC (Story 8 — Ronald).

**Five things to land:**

- **The Zoom transformation story** — 4 to 13, meetings to CCaaS to AI, direct to channel-first, global enablement. 90 seconds.
- **Systems not heroics** — "I build the playbooks, discovery standards, and operating rhythm that allow any SE to perform consistently."
- **Ask, don''t assert, on reactive vs proactive** — this was originally a TA framing that isn''t independently confirmed. Rather than stating "the team is reactive," ask: "One thing I''m curious about — how does the SE team engage today? Is it more responsive, with AEs bringing SEs in when they spot something, or is there already a proactive motion in place?" Let her answer shape what comes next, rather than walking in having already diagnosed the team.
- **Ask, don''t assert, on the SE-CS relationship** — same caution. A natural way in: "How does the SE team work with Customer Success today on existing accounts?" If she confirms a gap, that''s the moment to talk about the value of building that bridge. If she says it''s already working well, pivot to asking what''s working and where she''d like to see it sharpened.
- **Why Atlassian** — the company''s broader PLG-to-enterprise momentum, Rovo AI, System of Work — landing specifically on why mid-market is where that momentum compounds fastest (deal velocity, high adoption, fast signal on what works before it scales to enterprise). Tie it back to the channel programme at Zoom as evidence you''ve operated well in a similarly fast, repeatable-motion environment.

**Domain gap one-liner:** "My background is UC and CCaaS rather than Atlassian''s product domain. What I bring is the SE leadership capability and a consistent track record of closing product knowledge gaps quickly while keeping the team performing. I''d expect the product ramp to take a quarter — the operating model work starts from day one."

**Questions to ask Kira:**

- How does the SE team engage today — more reactive, or is there already a proactive motion in place? *(replaces an earlier version of this question that assumed the answer)*
- How does the SE team work with Customer Success today on existing accounts? *(replaces an earlier version that assumed no relationship exists)*
- What does the AE profile look like in UKI, Nordics, and Benelux — experienced mid-market reps or earlier career?
- What does success look like for this role at 12 months from your perspective?
- On the hiring plan — is the scope to grow to 4 firm, or dependent on performance in the first 6 months?
- I noticed there''s also a Nordics & BeNeLux Enterprise SE Manager role posted — is that a separate team, or worth discussing alongside this one?

**Watch-outs:**

- Don''t talk too long on background — she knows the CV
- Don''t dwell on the domain gap — acknowledge and pivot
- Don''t describe Atlassian generically — show you''ve read the room
- Don''t talk about enterprise plays — this is pure mid-market
- Don''t assert the team is reactive or that SE-CS doesn''t exist — ask, and let her tell you
- Don''t say "I would build a CS relationship" as if the gap is confirmed — find out first whether it actually is one

---

## Stage 2 — Peer Interview

**What''s assessed (official guide):** Driving Team Health. Managing High Performing Teams — explicitly flagged as "of utmost importance" and covered twice across the process (here and in the Hiring Manager stage). Ability to Develop Self & Others.

Because this competency is tested twice, prepare at least two genuinely distinct stories for managing/building high-performing teams — not the same Zoom story repeated. Consider drawing one from Mitel (the post-merger rebuild) to give real variety. Story 9 (Adarna) is also strong here if the question turns toward accountability rather than pure development.

**Prep notes:** This is a peer — someone doing a similar job day to day. Expect more practical, "how do you actually run this" questions rather than strategic framing. Good place to be candid about what''s hard, not just what went well. Ask about day-to-day reality — coverage model, how AEs currently engage SE, what a typical week looks like for the existing two SEs. This is also a good moment to validate anything Kira didn''t fully clarify about reactive/proactive or SE-CS dynamics — a peer may give a more grounded, less polished answer than a VP would.

---

## Stage 2 — Practical Interview

**What''s assessed (official guide):** Structured prompt — apply skills to a practical situation. Customer Focus & Strategy. Navigating Complexity. Effective Communication.


Per Georgie: pre-work guidance will follow if/when this stage is reached. No need to prepare presentation materials yet. This page will be updated with the actual prompt once received.


**Likely shape (to revisit once briefed):** Possibly a scenario-based exercise — e.g., "here''s an account, here''s the situation, talk us through your approach." Given the role context, a strong instinct would be to frame any answer around discovery-first and outcome-based thinking rather than jumping straight to a demo or technical solution.

---

## Stage 3 — Leadership Interview

**What''s assessed (official guide):** Impact & Influence. Effective Communication. Ability to Champion Change. Insight into broader strategic direction.

**Prep notes:** This is a senior leader in the org or region — likely thinking about Atlassian''s broader enterprise/mid-market strategy, not just this one team. "Champion Change" maps well to the channel-first pivot at Zoom and the post-merger rebuilds at Mitel. Worth preparing a clear, concise view on why Atlassian''s PLG-to-enterprise transition matters and where mid-market SE fits in that bigger picture — this is where the company-level "why Atlassian" answer needs the most depth.

---

## Stage 3 — Values Interview

**What''s assessed (official guide):** Behavioural questions mapped to Atlassian''s five values.

Full prep — the five values, what each one probes, and suggested story angles — is on a dedicated page: [Atlassian Values — Interview Prep](https://leesmith286.atlassian.net/wiki/x/AwBf)

---

## General Notes Across All Stages

- Review each interviewer''s LinkedIn profile before their stage — per Atlassian''s own candidate guidance.
- Come prepared with questions for every stage — interviewers explicitly leave time for this.
- If a question doesn''t get asked in one stage, it''s fine to raise it with the recruiter or coordinator afterwards.
- Anything presented elsewhere in this prep as a "fact" about the team''s current state that isn''t directly drawn from the JD should be treated with the same caution as above — when in doubt, ask rather than assert.', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (7, 'people_intel', 'Atlassian Values', 'Straight from Atlassian''s own candidate guide. The Values Interview (Stage 3) is behavioural and maps directly to these five. Come prepared with a specific story for each — not a generic example. These are the actual probing questions Atlassian uses.


## 1. Play, as a team

**What they probe:** How do you work with other people? How have you helped make a team or individual more successful if they weren''t performing well? Have you ever had to put the team''s goals above personal ambitions?

**Story to prepare:** Coaching an underperforming SE back to strong performance — a Zoom or Mitel example with a clear before/after.

## 2. Be the change you seek

**What they probe:** When have you advocated to push for change? What did you learn from this process? What was the outcome?

**Story to prepare:** The channel-first GTM pivot at Zoom, or rebuilding the SE function from scratch post-Mitel/Aastra merger.

## 3. Don''t #@!% the customer

**What they probe:** How is your mentality ''user-centered''? How have you put the customer first? What trade-off(s) did you make to do this?

**Story to prepare:** A moment where commercial pressure pushed toward a worse customer outcome and you held the line — or the HMRC deployment, where the customer outcome required navigating internal complexity.

## 4. Open company, no bullsh*t

**What they probe:** What''s your approach when having difficult conversations? How have you resolved conflict in the past? Have you adapted your communication style to achieve a better outcome in a potentially negative situation?

**Story to prepare:** A difficult performance conversation, or a moment of disagreement with a peer, AE, or leader that required directness rather than avoidance.

## 5. Build with heart and balance

**What they probe:** How do you think about prioritization and decision making? What are examples when you or the team have missed the mark? How did you react? How did you approach fixing things?

**Story to prepare:** A genuine mistake or misjudged prioritisation decision — this needs to be a real failure, not a humble-brag. Show the recovery clearly.

---

## Preparation Approach

- One specific, well-rehearsed story per value — five total. Avoid reusing the same story twice even if it could technically answer two values.
- Each story should have a clear structure: situation, what you did, what the outcome was, what you learned. Keep the "what you learned" honest — Atlassian is explicitly probing self-awareness, not just results.
- For "Build with heart and balance" specifically — resist the instinct to soften the failure. A real misstep, told straight, lands far better than a disguised success story.
- Cross-reference against the seven core behavioural stories already built in the [Core Behavioural Stories](https://leesmith286.atlassian.net/wiki/x/GQAL) page — several should map directly onto these five values with little rework.', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (7, 'company_research', 'Company Research', 'Reference guide for the Atlassian product portfolio. Written for mid-market SE conversations — focuses on who buys, what they care about, and how to talk about each product. Not a technical deep-dive; a commercial framing guide.

Mid-market context: most customers already use at least one Atlassian product. The SE conversation is rarely "why Atlassian?" — it''s "why more Atlassian?" and "why now?" Keep that lens on every product below.

## Jira

Jira is Atlassian''s flagship product and the anchor of almost every mid-market relationship. It started as a bug tracker for software teams but has evolved into a broad work management platform used across engineering, IT, marketing, HR, and operations. In mid-market accounts it''s usually already in the building — the question is how deeply it''s being used and whether it''s spread beyond the team that originally bought it. The buying conversation for Jira expansion is almost always about visibility and control: teams are running work across too many disconnected tools and losing sight of what''s happening, who owns what, and whether things are on track. Jira solves that by creating a single structured system of record for work across teams, with automation, reporting, and AI-powered prioritisation layered on top via Rovo.

**Primary buyer:** Head of Engineering, VP of Product, IT Director, or Operations Director. In mid-market it''s often a technical leader who also holds budget responsibility. They care about team velocity, delivery predictability, and reducing the admin burden on their people. They''re not buying a tool — they''re buying visibility into whether their organisation is working effectively.

**What matters to them:** Does this give me a clear picture of what my teams are working on and whether we''re going to hit our commitments? Can I reduce the time my people spend updating status and chasing progress? Does it integrate with the tools we already use — GitHub, Slack, Confluence? And with AI now on the table: can Rovo surface the right work at the right time and automate the repetitive triage and routing that slows us down?

## Confluence

Confluence is Atlassian''s knowledge management and team collaboration platform — essentially the place where the work in Jira gets documented, contextualised, and shared. It''s wikis, project documentation, meeting notes, decision logs, and team knowledge bases. In mid-market accounts it often sits alongside Jira but is underused — teams default to Google Docs or Notion for documentation and Confluence becomes a graveyard of outdated pages. The expansion conversation is about making Confluence the living knowledge layer that connects to the work, not a separate documentation tool that nobody maintains. With Rovo''s AI search now embedded, Confluence becomes significantly more powerful — Rovo can surface relevant pages, summarise content, and answer questions from across the organisation''s knowledge base in seconds.

**Primary buyer:** Often the same person who owns Jira — Head of Engineering or IT Director — but Confluence expansions increasingly get pulled into conversations with HR, Legal, and Operations leaders who want a single internal knowledge hub. In mid-market, the CTO or COO sometimes sponsors a Confluence-first initiative when they''re trying to solve the "nobody can find anything" problem at scale.

**What matters to them:** Will people actually use it, or will it become another empty wiki? How does it stay current without someone manually maintaining it? Can it replace the chaos of Google Docs shared by email? And with Rovo: can employees actually find answers without asking someone? The knowledge-retrieval use case is the one that gets attention in 2026 — teams spending 25%+ of their week searching for information is a number that lands hard in a discovery conversation.

## Jira Service Management (JSM)

JSM is Atlassian''s IT service management platform — the ITSM tool built natively on Jira. It handles IT helpdesks, service requests, incident management, change management, and asset tracking. It competes directly with ServiceNow and Freshservice in mid-market, and its key differentiator is that it''s deeply integrated with Jira and Confluence rather than being a standalone ITSM silo. That means when a developer fixes a bug in Jira, the linked service ticket in JSM updates automatically. When an incident occurs, the post-incident review lands in Confluence. The AI story here is strong — Rovo agents in JSM can triage incoming requests, group related incidents, suggest the right resolver, and generate post-incident summaries automatically.

**Primary buyer:** IT Manager or Head of IT Operations. In mid-market they''re often running a small IT team covering a disproportionately large user base — they''re stretched, reactive, and drowning in tickets. They care about deflection rate (how many tickets get resolved without human intervention), SLA compliance, and reducing the time their team spends on repetitive low-value requests. The CISO or IT Director may also be involved if the conversation touches change management or security.

**What matters to them:** Can this reduce my ticket volume through self-service and AI deflection? Does it integrate with what my developers are already using in Jira so I''m not managing two separate systems? Is it easier to configure and maintain than ServiceNow? And is it going to scale without requiring a dedicated admin team to keep it running?

## Rovo

Rovo is Atlassian''s AI layer — and it''s now included with Standard, Premium, and Enterprise cloud plans across Jira, Confluence, and JSM, so it''s not a separate upsell but a capability unlock. It has three core components: Rovo Search (AI-powered search across Atlassian products and 50+ connected third-party tools including Google Drive, Slack, Gmail, and GitHub), Rovo Chat (a conversational interface for querying the organisation''s knowledge base), and Rovo Agents (AI agents that can execute tasks autonomously — triaging tickets, drafting documentation, breaking down work items, running workflow automations). The important positioning point is that Rovo is context-aware — it works from the organisation''s actual work data in Jira, Confluence, and JSM, not from generic internet knowledge. That''s the differentiator from a standalone ChatGPT wrapper.

**Primary buyer:** Rovo doesn''t typically have a standalone buyer in mid-market — it''s a capability that amplifies the value of the products already in place. The conversation usually happens with the same people who own Jira or Confluence. However, the CTO or COO increasingly initiates AI conversations at an organisational level — "how are we using AI to make our teams more productive?" — and Rovo is Atlassian''s answer to that question.

**What matters to them:** Is this actually useful, or is it AI for AI''s sake? Does it work on our data or just generic knowledge? Is it safe — will it surface content people shouldn''t see? (Rovo respects access permissions, which is a critical trust point.) And practically: what does it actually save people from doing? The 2.4 million workflow automations Rovo has run across the customer base in six months is a real number worth having in your pocket. So is the stat that teams spend 25%+ of their week searching for information — Rovo''s search use case pays for itself in that frame alone.

## Loom

Loom is Atlassian''s async video platform — acquired in 2023 and now deeply integrated into the Atlassian ecosystem. It lets people record short videos (screen, camera, or both) to communicate asynchronously instead of scheduling a meeting. In a mid-market context it''s particularly relevant for distributed and remote teams who are spending too much time in synchronous meetings. The integration story with Jira and Confluence is increasingly strong — Loom videos can be embedded directly in Confluence pages and Jira tickets, and AI generates automatic transcripts, summaries, and action items so recipients can skim rather than watch the full recording.

**Primary buyer:** Often comes in through HR, People Ops, or a team lead who''s trying to solve async communication in a distributed team. It can also come through IT or Operations when they''re standardising collaboration tooling. In mid-market, Loom is usually part of the Teamwork Collection conversation rather than a standalone purchase.

**What matters to them:** Can this reduce meeting time without losing the communication quality that video provides? Will my team actually use it? Does it integrate with the tools we already have so recordings don''t just disappear into another silo? And: does AI make it easy to consume — so I don''t have to watch a 10-minute video to find the two minutes that matter?

## Atlassian Guard

Guard is Atlassian''s security and identity management layer for cloud — the organisation-level control plane that sits across all Atlassian products. Guard Standard covers the essentials: SSO, SCIM provisioning, authentication policies, and basic audit logging. Guard Premium adds data security policies, shadow IT detection, content controls, and advanced threat detection. The core problem it solves is that as organisations scale their Atlassian footprint across Jira, Confluence, Bitbucket, and Trello, security controls applied product-by-product become inconsistent and unmanageable. Guard centralises that from a single admin hub.

**Primary buyer:** CISO, IT Security Manager, or Cloud Admin. In mid-market this is often one person wearing multiple hats. They care about compliance (SOC 2, ISO 27001, GDPR), data loss prevention, and making sure the right people have access to the right content — especially as Rovo AI starts surfacing content across the organisation. Guard Premium is increasingly relevant as organisations worry about AI exposing content that users shouldn''t see.

**What matters to them:** Can I see what''s happening across my entire Atlassian estate from one place? Can I enforce consistent security policies without managing each product separately? If we have a data incident, do I have the audit trail I need? And with AI in the mix: am I confident that Rovo isn''t surfacing sensitive content to the wrong people?

## Trello

Trello is Atlassian''s lightweight visual task management tool — simple Kanban boards that anyone can pick up in minutes. In mid-market it tends to exist at team or individual level rather than as an enterprise-wide purchase. It''s the tool people use when Jira feels like too much — smaller teams, simpler workflows, personal task management. Recent development has pushed Trello toward a personal productivity assistant with features like Trello Inbox (capturing tasks from Slack, email, and Siri). In mid-market SE conversations, Trello is rarely the expansion focus — it''s more likely to come up as something that''s already in the account and could potentially be consolidated or complemented by Jira.

**Primary buyer:** Individual contributors, small team leads, or non-technical departments that want simple visual task management without the complexity of Jira. Marketing, HR, and sales ops teams often land on Trello. Budget is usually low and decisions are made close to the team level.

**What matters to them:** Is it simple? Can my team use it without training? Does it connect to the other tools we''re already using? Trello buyers are optimising for ease of adoption over capability depth — if the answer requires configuration, you''ve probably lost them.

## Bitbucket

Bitbucket is Atlassian''s Git code repository and CI/CD platform — the developer tool that competes with GitHub and GitLab. It integrates natively with Jira so that commits, pull requests, and deployments link directly to Jira work items, giving non-technical stakeholders visibility into development progress without needing to read code. In mid-market, Bitbucket tends to already be in accounts that have been with Atlassian for a long time — it''s rarely a net-new expansion unless you''re talking to an engineering team that''s actively evaluating source control. The expansion conversation is more often about deepening the Jira-Bitbucket integration or upgrading tiers for advanced CI/CD pipeline capabilities.

**Primary buyer:** Head of Engineering or a senior developer who controls tooling decisions. They care about pipeline speed, integration with Jira, security of the code repository, and cost versus GitHub. In mid-market, the decision maker is usually technical and price-sensitive.

**What matters to them:** Does it integrate tightly with Jira? Is it secure? Can my team get full CI/CD pipeline capability without paying for a separate tool? And increasingly: does it integrate with Rovo Dev (Atlassian''s engineering intelligence layer) to give me visibility into developer productivity and delivery performance?

## Jira Product Discovery (JPD)

JPD is Atlassian''s product management tool — designed for product managers to capture, prioritise, and roadmap ideas before they become Jira work items. It sits upstream of Jira in the product development lifecycle. Teams use it to collect feature requests, score them against strategic priorities, build roadmaps, and push the winners into Jira for delivery. It''s a relatively newer addition to the portfolio and competes with Productboard and Aha! in mid-market. The integration with Jira is the key differentiator — priorities set in JPD flow directly into development backlogs rather than living in a separate roadmap tool disconnected from delivery reality.

**Primary buyer:** Head of Product or Senior Product Manager. In mid-market these are often small product teams — sometimes a single PM — who are struggling to manage a growing backlog of requests from customers, sales, and internal stakeholders without a structured way to prioritise. They care about being able to justify prioritisation decisions to the business and having a roadmap that stays current.

**What matters to them:** Can I connect customer feedback to delivery priorities in one place? Can I show stakeholders a roadmap that''s actually connected to what''s happening in development? Does it reduce the time I spend maintaining spreadsheets and slide decks that are out of date the moment I publish them?

## The Collections Frame — How to Talk About the Portfolio

Atlassian now packages products into Collections — outcome-focused bundles rather than standalone tools. This is the commercial frame worth understanding for expansion conversations:

- **Teamwork Collection:** Jira + Confluence + Loom + Rovo. For any team that needs to plan, document, communicate, and find information. The broadest expansion play across mid-market.
- **Service Collection:** JSM + AI service management capabilities. For IT teams. Competes with ServiceNow.
- **Software Collection:** Jira + Bitbucket + Compass + Rovo Dev. For engineering-led organisations who want full SDLC coverage.
- **Strategy Collection:** Jira Align + strategic planning tools. Typically enterprise — less relevant for pure mid-market.
- **Product Collection:** Jira + JPD. For product-led organisations who need discovery-to-delivery in one place.


In mid-market expansion conversations, the Teamwork Collection is the most common landing zone. If a customer has Jira and Confluence but not Loom or Rovo, that''s the natural expansion. If they have JSM but at a low tier, the upgrade-plus-AI conversation is the play.', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (7, 'notes', 'Model Answers', 'Model answers built from live mock interview practice, written in your own words and phrasing. Reread these rather than the coaching notes — the goal is to reinforce your natural voice, not memorise a script. Update as you refine answers further.

## Q: Why Atlassian — and why mid-market specifically?

*While the wider business is focusing on enterprise capabilities, it''s mid-market where the action is. It''s mid-market''s deal velocity and high adoption rate that allows us to develop use cases, find out quickly what works and what doesn''t, and feed that back into product shaping — making sure the product is fit for larger enterprise customers with slower sales cycles. I feel mid-market is one of the most important teams in an organisation, and that''s exactly the kind of team I want to lead.*


**Refinement to land:** tie this to the channel programme at Zoom as evidence — that was a similarly fast, repeatable-motion environment, and you built the infrastructure to scale it. Gives the answer a personal proof point, not just an opinion about the segment.


## Q: How would you go about understanding how the team works today, before changing anything?

*This is an area that''s key — to come in and rush to make changes early would be a mistake. Changes can only be effective if they''re built on understanding and reasoning.*

*I''d start with 1:1s with the team. This does two things — it lets me start to understand them, what parts of the role they love and what causes friction, and it also gives them time to get to know me. In my teams, trust is key and it has to be earned.*

*Outside of the team, I''d talk to Sales — understand how they work, how leads are generated, what sales methodology they follow, how they use the SE team today, what works for them and what doesn''t.*

*In my previous role, the CS function was also a key area where the SE team added value. From my understanding, that may not be the case here today — based on that, I''d start conversations with the CS team to understand how the handoff works currently, what''s missing, and what good looks like, with a view to deeper conversations on future playbooks down the line.*

*And I''d want to sit in on live customer calls with each of them — seeing it firsthand tells me more than them describing it to me.*

*What I won''t do is make promises or changes in the first 30 days. Changes before understanding is solving a problem I don''t yet understand.*


**Watch:** "sales methodology" not "sales mythology" — easy slip under pressure. The closing line ("changes before understanding...") is excellent as written — keep it close to verbatim.


## Q: Tell me about a time you developed someone on your team into a leadership role.

*Developing SEs is one of my favourite parts of the role. The most recent example was with Ronald, an SE who wanted to begin his career into leadership. After our initial discussion, we agreed that to give him controlled ownership in a supported environment, we''d plan to progress him to a team leader within my team.*

*It started with giving him ownership of the demo environment — ensuring the team had what they needed to be successful. I gave him a dedicated slot on the team call that he owned, to provide updates and ask questions of the team. Month by month, we added additional responsibilities as his confidence grew. He''d manage the team call if I was out or had to attend other calls. After about a year, he was running team QBRs, surfacing problems early, setting goals around enablement for the team. His QBR then fed into my own leadership review.*

*At the year mark, we were both confident in his abilities, and he was officially promoted to team lead. He was so pleased with his progress, and he''s continuing his journey into management.*


**Watch:** "surfacing problems" not "surfing problems." The month-by-month, year-mark progression is genuinely good — it makes the development feel gradual and real rather than compressed, keep that structure.


## Q (follow-up): Was there ever a point Ronald wanted more responsibility than you felt he was ready for? How did you handle that?

*Yes, for sure. It was about six months in — during one of our regular sessions, he wanted me to put him forward for the promotion. He felt he was delivering what was asked of him and felt ready. I had to push back and say he wasn''t yet ready.*

*He was right that he was doing everything I asked of him, but that''s the same for every good SE. The difference between working to task and leadership is what you bring to the team — it''s proactivity, your suggestions, your thoughts on what''s going to add value and why.*

*He didn''t like it, but he agreed. Over the next quarter, this was refined further and he started to think more strategically rather than tactically. At that point he could see the difference himself, kept working on it, and brought suggestions that turned into real actions for the good of the team.*


**This is one of the strongest answers built so far** — it pairs naturally with the Ronald development story above and directly answers both "develop other leaders" and "make tough calls when necessary" in one connected narrative. The line "the difference between working to task and leadership is what you bring to the team" is sharp and specific — keep it close to verbatim.

**To strengthen further:** if you can recall one concrete example of a suggestion Ronald brought that became a real action, add it — a specific example beats "many suggestions" every time in interview answers.


## Q: How are you thinking about the domain transition from UC/CCaaS to Atlassian''s product world, honestly?

*It''s quite different, and I''ve already highlighted the domain gap as my biggest gap. That said, what I do bring is over 10 years'' experience in multi-technology, complex, highly regulated sales cycles with multiple stakeholders, and deep experience building and coaching SEs into highly successful teams.*

*My plan is to bridge that gap as quickly as possible, with the onboarding programme and support from the hiring manager and the team. I won''t profess to be the most technical person in the room — that''s what my team is there for — but I need to understand enough to talk to customers and coach the team, and that journey has already begun. I''ve spent time understanding the product set itself and the buyer personas across Jira, Confluence, and Rovo, so I''m not walking in cold.*


**This now backs up the closing claim with something real** — "that journey has already begun" used to be a hook with nothing behind it. Naming Jira, Confluence, and Rovo specifically, and the buyer persona work, gives Kira something concrete rather than an assertion. If she asks "tell me more," you genuinely can — the product set and persona pages in this Confluence space are real preparation, not a line.


---

## Notes on Delivery

- The CS line is deliberately hedged — "from my understanding, that may not be the case here today" — rather than stated as fact. This is intentional: the reactive-team and SE-CS-gap framing was never independently confirmed, so the answer is built to invite Kira''s correction rather than assert something that might be wrong. Keep this hedge in any live answer on this topic.
- If Kira''s answer confirms a gap, the natural follow-up is to talk about the value of building that bridge. If she says it''s already working well, pivot to asking what''s working and where she''d like it sharpened.
- Watch for word-substitution slips under pressure — "methodology" not "mythology," "surfacing" not "surfing," "that''s" not "thats." None of these change the substance but they can momentarily distract from otherwise strong answers.', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (8, 'go_sheet', 'GO Sheet', '**Role:** Manager, Solution Consulting — UKI  |  **Req:** JR-0107737  |  **Jira:** JS-6

---

## TA Screen — Completed 23 June 2026 ✅

**Recruiter:** Leah Houlihan, Principal Recruiting. Call went well — passed to HM stage.

---

## What We Now Know — From the TA Screen

| Area | Detail |
| --- | --- |
| **Team size** | 7 SCs — 2 senior, 2 new starters, 3 mid-career |
| **Verticals** | Gas & Oil, Manufacturing, Retail |
| **Scope** | SMB to Enterprise |
| **AE:SC ratio** | 2:1 — SE-heavy relative to most teams |
| **Why role exists** | Previous SE promoted into the manager role, didn''t work out, left. Looking for someone to refocus, stabilise, and reignite the team. Bringing passion back is the explicit brief. |
| **SC-CS relationship** | No structured relationship today. SCs only engage CS on existing accounts, driven by AEs working expansion opportunities — not proactive. |
| **Package** | £120k base + 30% commission + £80k stock + £10k car allowance (paid monthly) |
| **Timeline** | ASAP — but heading into holiday season, expect some slippage |


**Package note:** £120k base is below target anchor of £140k-£150k. Total cash is more competitive (£120k + £36k commission + £10k car = £166k if plan hit) but commission structure and attainment basis are unconfirmed. Stock vesting schedule also unconfirmed. Worth clarifying with Faizan before committing further.

---

## Interview Process

| Stage | Who | Status |
| --- | --- | --- |
| - TA Screen | Leah Houlihan | ✅ Done — passed |
| - HM Interview | Faizan Siddiqi (Director, SC UKI Medium Enterprise) | ⏳ Meeting scheduler incoming |
| - Peer Conversation | Jil Simon (verify still at Workday — Farewell post spotted) | Pending |
| - Panel | Michelle Dawkins (VP SC) — separate call if unavailable | Pending |
| - Offer | — | — |


---

## People Intelligence

**Faizan Siddiqi (HM)** — Director, Solution Consulting — UKI Medium Enterprise, Workday, London. Computer Science, Brunel University (2002–2006). Background in Oracle E-Business Suite and Oracle Applications before Workday — came up through ERP pre-sales, understands the domain deeply, and will be a sharp assessor of pre-sales quality even where the product background differs. Actively hiring: posted about recruiting an HCM SC for his PBS industry team, which Leah reposted — he''s building the team deliberately, not just backfilling. Otherwise low public LinkedIn profile.

**What this means for the Faizan call:** he''s an ERP pre-sales person by background. He''ll probe on whether you can credibly lead a team in that environment. Don''t oversell product knowledge you don''t have — lead with the leadership model, the track record of ramping quickly, and the end-user grounding. He''ll respect directness more than positioning.

**Jil Simon (peer conversation)** — Senior Manager, Workday UKI. Imperial College London. UK-based. Active in presales craft: attended Demo2Win workshop in London, posted about structuring demos around customer problems and value storytelling. Previously recruited SCs for Workday Student UKI launch. **Flag:** LinkedIn includes a "Farewell Workday" post — timing unclear. Verify with Leah whether Jil is still the peer conversation contact before the process progresses.

**Michelle Dawkins (panel) — VP, Solution Consulting, Workday.** She''s not just on the panel — she''s the VP above Faizan and the effective final decision-maker. Publicly vocal on AI adoption in HR and the future of the SC motion. Spoke at Workday Elevate UKI on agentic AI and future of work. Recorded a podcast specifically on how HR can realise the true value of AI. She lives the "lead with AI" mandate personally.

**What this means for the panel:** Michelle won''t be assessing day-to-day management. She''ll want to know whether you have a genuine point of view on where SC leadership and AI are heading together. The Sana framing — "shifting from feature demonstrations to conversations about how someone actually starts their day at work" — is the right language for that room. She needs to believe you''d drive the team in that direction, not just maintain what exists.

---

## What This Role Is Really Asking For

Based on the TA screen, the brief is clearer than the JD suggested. This isn''t a pure growth hire — it''s a **stabilisation and transformation mandate:**

- A team that''s been through leadership disruption (peer promoted, didn''t work out, left)
- Likely sceptical of new management — they''ve seen this before
- Reactive SC motion with no proactive engagement model
- No SC-CS relationship at all
- Two new starters who need structured onboarding
- Two seniors who may have opinions about how things should be run

The person they need can walk into a bruised team, earn trust quickly, stabilise the environment, and then build forward. That''s directly evidenced in your background.

---

## The Mitel Story Is the Lead Story Here

The Mitel post-merger rebuild is the most relevant anchor for this process — more so than Zoom. Built UK pre-sales from scratch after the Mitel/Aastra merger, team hadn''t gelled, no established process, uncertainty about direction. Direct structural parallel to what Workday is describing.

For Faizan''s interview, lead with Mitel when the conversation turns to leading through change. Zoom is the scale and growth story. Mitel is the stability, trust-building, and building-from-scratch story — which is what this team needs right now.

**Three genuine change stories across the career:** Aastra/Mitel merger → ongoing industry consolidation at Mitel → Zoom direct-to-channel-first GTM pivot. Leah resonated with this during the TA screen. Make it more specific with Faizan.

---

## Workday — Current State

Sana acquired 4 November 2025 — $1.1B. Positioned as the "front door for work" — conversational AI across all company systems, not just inside Workday. Prior AI layer: Illuminate (narrower, embedded). "Sana for Workday" live for all customers March 2026. CEO: Aneel Bhusri returned, replacing Carl Eschenbach.

**Say Sana Learn — never "Galileo Learn."** Galileo Learn is a Josh Bersin Company product.

---

## Domain Gap

Ten-plus years as a Workday end user, IC and manager. Four-part answer:

- Name it — one line, direct
- End-user grounding — 10+ years, IC and manager
- Evidence of fast ramp — Zoom pivot, Mitel post-merger rebuild
- Reframe — leadership isn''t about being the deepest product expert, it''s building the team''s depth

---

## Questions for Faizan

- What does the team feel like right now — where''s the energy, and where does it feel flat?
- The brief mentions bringing passion back — what does that look like from your perspective?
- How do you see the AE-SC relationship working today, and where does it need to evolve?
- What does success look like at 6 and 12 months?
- On the package — can you help me understand the commission structure and what attainment looks like for the team today?
- On equity — what''s the vesting schedule on the stock component?

---

## TA Screen Prep (Historical Reference)

**Why Workday:** "What''s drawn me here is less the domain and more the kind of conversation I want my team having with customers. I''ve built my career around developing people and shifting teams away from running demos toward having real value conversations. What makes this moment at Workday specific is the Sana move — it''s pushed the SC conversation from ''here''s a feature'' to ''here''s how this changes how someone actually starts their day at work.'' That''s exactly the kind of conversation I want to be coaching people to have well, and building a team around."

**Domain gap one-liner:** "My background is enterprise communications and collaboration SaaS rather than HCM or Financials specifically. But I''ve used Workday myself for over ten years, both as an individual contributor and as a manager, so I''m not coming at this cold."

**Coaching answer (Story 10):** Mitel SE — technically excellent but losing deals at business case stage. Shadowed two calls. 60-day plan: discovery framework, pre-call planning template, fortnightly call reviews, paired with stronger commercial SE. Win rate from below-average to in-line within two quarters. Framework became team standard.

**Leading and developing:** Zoom 4→13 (brief context) → Ronald (demo environments → QBRs → promotion as formality) → channel programme (200+ partner SEs, year one).', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (8, 'overview', 'Overview', '## The call in one line

30-minute TA screen with Leah Houlihan. Goal: pass to the hiring manager round. Stay crisp, stay honest, show energy.

---

## At a glance

|  |  |
| --- | --- |
| **Role** | Manager, Solution Consulting — UKI |
| **Recruiter** | Leah Houlihan, Principal Recruiting |
| **Date/time** | Tuesday 23 June, 2:00pm UK |
| **Length** | 30 minutes |
| **Salary anchor** | £140k–£150k base — let them respond first |
| **Internal contact** | Soumia (Head of EMEA Legal/PX) — soft assist, not a confirmed lever |
| **Next stage** | Hiring Manager round if screen passes |


---

## Six likely questions — answers built

| Question | Lead with |
| --- | --- |
| Walk me through your background | Zoom transformation story — 4 to 13, meetings → UC → CCaaS → AI, channel-first. 90 seconds, stop. |
| Leading and developing SC/SE teams | Brief Zoom context → Ronald (demo environments → QBRs → promotion) → channel programme closes it |
| Coaching someone struggling with discovery | Mitel SE — shadowed two calls, 60-day plan, discovery framework, win rate recovered in two quarters |
| Industry alignment | FS, public sector, healthcare, tech at Zoom — repeatable frameworks with vertical overlays, not generic demos |
| Why Workday / what do you know | **Keep these separate.** "Why" = people, leadership, AI value conversations + Sana shift. "What do you know" = Sana facts + CEO change |
| Salary expectations | £140k–£150k base, in line with Atlassian target. Open on total package. Don''t lowball. |


---

## Workday AI — know cold

| Fact | Detail |
| --- | --- |
| **Sana acquisition** | Closed 4 November 2025 — $1.1B. Signed 16 September 2025. |
| **What Sana does** | New "front door for work" — conversational AI layer across all company systems, not just inside Workday |
| **Prior AI layer** | Illuminate — narrower, embedded inside Workday workflows only |
| **Sana for Workday** | Live for all customers March 2026 |
| **Learning product** | Sana Learn (alongside Workday Learning) — never say "Galileo Learn" |
| **CEO** | Aneel Bhusri returned (co-founder), replacing Carl Eschenbach |


---

## Domain gap — four-part answer

- **Name it** — one line, direct, no over-explaining
- **End-user grounding** — 10+ years as Workday user, IC and manager. Not coming in cold.
- **Evidence of fast ramp** — Zoom: meetings → UCaaS → CCaaS → AI while running the team. Mitel: built pre-sales from scratch post-merger.
- **Reframe** — leadership isn''t about being the deepest product expert in the room. It''s making sure the team is.

**One-liner to open with:** "My background is enterprise communications and collaboration SaaS rather than HCM or Financials specifically. But I''ve used Workday myself for over ten years, both as an individual contributor and as a manager, so I''m not coming at this cold."

---

## Questions to ask Leah

- What does success look like for this role at 6–12 months?
- How is the SC team currently structured — by vertical, segment, or region?
- How has the Sana acquisition changed what SCs are expected to demo day to day?
- What''s the next stage after this call, and what''s the typical timeline?

---

## Watch-outs

- **"Why Workday" ≠ "what do you know about Workday"** — Sana facts answer the second question, not the first. Keep them separate or it reads as prepped trivia with no real reason behind it.
- **Don''t repeat the Zoom pivot twice** — background answer covers it in full. The "leading and developing" answer opens with Ronald, not the pivot story again.
- **Domain gap — name it once, move on.** Lead with the end-user experience. Don''t let it dominate the call.
- **This is a screen** — crisp answers only. No deep technical defence needed at this stage.
- **Sana Learn** — not "Galileo Learn." Galileo Learn is a Josh Bersin Company product, not Workday''s.
- **Kira call is Thursday 25 June, 4pm** — keep prep proportionate. Atlassian is the higher-priority process this week.

---

## Full prep page

[Workday — TA Screen Prep (full detail)](6225967.html)', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (12, 'overview', 'Overview', '**Role:** Director, Solutions Engineering — UK&I  |  **Jira:** JS-2  |  **Applied:** 02/06/2026  |  **Status:** Waiting on response — warm referral via Tim Keford

**Source caution:** The "Interview Process" stage table below (TA Screening → Hiring Manager → Further stages) is not confirmed by Riverbed. It''s a reasonable assumption based on typical process structure, not something stated by a recruiter or in any official document. Unlike the Atlassian process (which came from an official candidate guide), nothing about Riverbed''s actual process is known yet. Treat any reference to "stages" as a guess, not a fact, until a recruiter confirms it.

**Referral advantage:** Tim Keford has personally introduced the CV to the SVP Global Solutions Engineering (hiring manager). CTO Richard is also endorsing. This is a warm referral, not a cold application — treat every interaction accordingly.

## Company Overview

Riverbed has transformed significantly over the last two years from its legacy as a WAN optimisation company into an AI-powered observability and digital experience platform. CEO Dave Donatelli has led that transformation and it''s showing commercially — Q1 2026 bookings are up 85% and the Aternity revenue line has topped $100M. Observability bookings grew 92% year-over-year in the first half of 2025. The business is private, owned by Vector Capital since 2023, with approximately 1,200–1,600 employees globally.

Riverbed positions itself as the leader in AIOps for observability. The headline stat worth knowing: customers executed over 250 million AI-driven automation steps across the platform in 2025. That''s real-world AI adoption at scale, not a roadmap promise.

## The Product Platform

| Product Area | What it does | Who buys it |
| --- | --- | --- |
| **Network Observability** | AI-powered monitoring of network performance across hybrid and cloud environments. Hardware appliances plus SaaS subscription model. | Head of Network Operations, IT Director, CIO |
| **Aternity (Digital Employee Experience)** | End-user experience monitoring — measures how applications actually perform from the user''s device, not from the network. $100M+ revenue line. | IT Operations, CHRO, CIO — anyone accountable for employee productivity and digital experience |
| **Application Performance Management** | APM across cloud and on-premise — traces application performance, identifies bottlenecks, root cause analysis. | Head of Engineering, IT Operations, DevOps leads |
| **Data Express** | Launched October 2025. High-speed data movement for AI operations — moves data between AWS, Oracle OCI, and enterprise data centres at up to 10x traditional speeds, with up to 30% cost savings. | CTO, Head of Data/AI, Cloud Architect |
| **Riverbed Q** | Conversational AI interface for IT operations — integrates with Microsoft Teams and Slack. Agentic AI expected summer 2026. | IT Operations, NOC teams |


## The Competitive Landscape

| Competitor | Where they compete | Riverbed''s angle |
| --- | --- | --- |
| **Datadog** | APM, observability, cloud monitoring | Riverbed''s strength is the end-user experience layer (Aternity) and network depth — Datadog is stronger in pure cloud-native environments |
| **Dynatrace** | Full-stack observability, AIOps | Riverbed competes on network observability depth and the digital employee experience angle |
| **Netskope / Cato Networks** | SD-WAN, network security | Riverbed still has SD-WAN and WAN acceleration heritage — legacy install base is an asset |
| **Microsoft** | Endpoint monitoring via Intune/Defender | Riverbed goes deeper on application and network performance than Microsoft''s native tooling |


## The Role — What We Know

Director, Solutions Engineering UK&I. The JD language below is drawn from the equivalent Americas West role posting — not the UK&I posting specifically — so treat it as a reasonable proxy, not a confirmed description of this exact role:

- Build, scale, and inspire a high-performing SE team supporting enterprise and strategic accounts
- Partner closely with Sales leadership on pipeline growth and deal execution
- Own regional GTM technical strategy
- Drive technical win rates and position Riverbed as the standard for enterprise observability
- Represent field requirements back to Product and Engineering
- Establish operating rhythms, best practices, and governance that allow the SE org to scale

## Key People

| Name | Role | Relevance |
| --- | --- | --- |
| **Dave Donatelli** | CEO | Leading the AI transformation — worth knowing his narrative and public messaging |
| **Tim Keford** | SVP (warm referral) | Key relationship — has introduced CV to hiring manager and has CTO endorsement alongside |
| **John Atkinson** | Previous Director SE UK&I | Held this role as recently as March 2025. Now departed/promoted. Sets the bar for domain credibility. |


## The Domain Gap — Honest Assessment

Riverbed''s world is AIOps, network observability, and digital employee experience management. The buyer personas are IT Directors, Heads of Network Operations, and CIOs. This is IT infrastructure and operations territory — not UCaaS or CCaaS.

The bridges that exist:

- **AI-first transformation story from Zoom** — Riverbed''s platform pivot to AIOps mirrors what Zoom did with AI.
- **Enterprise complexity from HMRC** — 85,000-user private cloud deployment demonstrates the ability to operate in large, complex, technically demanding enterprise environments.
- **Early career infrastructure background** — network and systems engineering background from the 1989–2013 period is genuinely relevant context, even if distant.
- **Director-level role** — at this level, Riverbed will weight leadership, team-building, and commercial credibility heavily.

The previous incumbent (John Atkinson) was publicly positioning himself as an AIOps and observability expert. Be prepared for domain questions in TA screening — have a credible answer for "what do you know about our platform and where it sits in the market?" Don''t bluff; acknowledge the ramp and lead with the leadership credentials.

## AIOps & Observability — Domain Primer

Key concepts to understand before the TA screening lands.

**Observability:** Goes beyond traditional monitoring ("is the server up?") to answering why something is behaving the way it is across complex, distributed hybrid environments. Built on three pillars: metrics (numerical measurements over time), logs (records of events), and traces (following a single transaction end-to-end across systems).

**AIOps:** Applying AI and machine learning to IT operations data — correlating events, identifying patterns, suppressing alert noise, and surfacing the handful of things that actually need human attention. Riverbed customers executed 250 million AI-driven automation steps in 2025.

**Digital Employee Experience (DEX / Aternity):** Measures application performance from the user''s actual device — not from the network. A network dashboard can look healthy while employees in Manchester experience slow applications every morning. DEX surfaces that gap. Critical in hybrid working environments where IT can''t physically see what employees experience.

**Buyer economic case by persona:**

- **CIO / IT Director:** Know before employees call the helpdesk. Root cause in minutes, not hours.
- **Head of Network Operations:** One platform across hybrid environments instead of six monitoring tools manually correlated.
- **CFO:** AIOps automates the routine — frees the team for work that needs human judgement, avoids headcount growth.
- **CISO:** Speed of detection — is this a performance issue or a security event?

## TA Mock Run-Through — 12 June 2026


Overall verdict: strong performance. Handles domain gap honestly and confidently every time. Examples are specific and outcome-led. Doesn''t over-talk or get defensive. Consistent gap: answers tend to go straight to process and structure — add one sentence on the human/people dimension in each answer.


### Q1: Give me a quick overview of where you are now and what''s brought you to Riverbed.

**What landed well:** Background covered cleanly. Redundancy handled confidently — deliberate choice not to reapply reads as self-aware, not defensive. Riverbed hook was specific and genuine — named DEX and end-to-end value, showed homework had been done.

**Coaching note:** Close with a shorter, punchier line — "and that''s the kind of SE team I build" rather than the longer sentence about value-based SE teams.

### Q2: Your background is in communications — how do you bridge the domain gap and why should we back you?

**What landed well:** Honest and confident. "My role is not to be the most technical person in the room" is exactly right and will land well. Enterprise operating environment angle is strong.

**Coaching note:** "Domain transitions" was mentioned but not evidenced. Add one concrete anchor — e.g. the CCaaS ramp at Zoom. Also: HMRC is sitting unused here. Drop it in naturally — "complex, multi-stakeholder, highly governed environments — the HMRC deployment is a good example of that."

### Q3: Tell me about turning around an underperforming team or individual.

**What landed well:** Specific, structured, concrete outcome — 60% channel contribution in 18 months. "Busy work" observation shows diagnostic instinct. Segmentation logic is good.

**Coaching note:** People element is missing. Add one sentence on the cultural/human side — "the harder part was the cultural shift, some of the team had been operating that way for years." Also: simplify the segmentation language for a TA audience — "we stopped treating every partner the same and started investing SE time where it would actually move revenue."

### Q4: What experience do you have leading a team through major change?

**What landed well:** Framework is clear and credible. "Most of my career has been built on change" is a strong opener for Riverbed specifically.

**Coaching note:** Gets slightly abstract in the middle — "stepping stones", "taking the team on a journey." Ground it with one specific moment: e.g. the channel pivot at Zoom and the team''s initial resistance. Ending drifts — land it more firmly: "The teams I''ve led through change have come out the other side stronger because they understood the why, not just the what."

### Q5: How do you earn the respect of a technically deep team who know this domain better than you?

**What landed well:** "Team Sales can''t manage without" is a strong, memorable closer. Values are clear.

**Coaching note:** "Learned leadership style" is awkward — say "my leadership style is open, honest, and outcome-driven." Answer is short on the "how" — add a concrete behaviour: "In the first 30 days I''d be in the field with them — on calls, in customer meetings, listening more than talking. I''d let the team see how I think before I start changing anything."

## Talking Points

- *"Riverbed has made a significant transition over the last two years — from WAN optimisation to an AI-powered observability platform. That kind of GTM transformation is something I understand from the inside. At Zoom I led the team through an equivalent pivot — from meetings to a full communications and AI platform."*
- *"The AIOps story resonates with me. The problems Riverbed is solving — visibility across complex hybrid environments, understanding digital employee experience at scale, AI-driven automation to reduce manual IT operations — these are the problems that matter to large enterprise IT teams. I''m coming up the curve on the platform specifics but the buyer world is familiar."*
- *"At Director level, my job is to build the team and the motion, not to be the deepest technical expert in the room. I hire people who have the domain depth; my job is to give them the structure, coaching, and environment to use it effectively."*

## Questions to Ask

- How has the SE team evolved through the platform transformation from WAN to observability — is there domain depth already in the team or has it been rebuilt?
- What does the enterprise account mix look like in UKI — greenfield new logo or largely existing install base?
- Where is the biggest growth opportunity in the next 12 months — Aternity, network observability, or Data Express?
- How does Riverbed position against Datadog and Dynatrace in competitive situations?
- What''s the AE:SE ratio in UKI and how is coverage currently managed?

## Interview Process — Unconfirmed, Not Yet Heard From Riverbed

Nothing below is confirmed. There has been no contact from Riverbed since the application went in on 02/06. This table reflects a typical Director-level process structure as a planning assumption, not anything Riverbed has actually communicated. Update it for real once a recruiter makes contact.

| Stage (assumed) | Who | Status | Focus |
| --- | --- | --- | --- |
| TA Screening | TBC | NO CONTACT YET | Background, fit, domain awareness, package expectations |
| Hiring Manager | SVP Global SE | PENDING TA | Leadership credentials, transformation story, regional strategy |
| Further stages | TBC | TBC | TBC |


## Next Steps

- **18/06:** Lee messaging Tim Keford today to check whether the CV actually reached the SVP — no response of any kind in over two weeks since applying 02/06.
- Re-read AIOps domain primer above before any screening call
- Practise adding the people/human dimension into each behavioural answer

## Watch-Outs

- Don''t oversell the domain knowledge — be honest about the ramp and lead with leadership
- Don''t underuse the referral — Tim and the CTO endorsement is the asset, reference it naturally
- Answers tend to go straight to process — consciously add the human dimension in every behavioural answer
- Riverbed went through Chapter 11 bankruptcy in 2021 — if it comes up, lead with the turnaround: 85% bookings growth, $100M Aternity revenue, genuine platform transformation under Donatelli
- Don''t assume the interview stage table above is real — it isn''t confirmed by Riverbed', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (7, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (8, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (8, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (8, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (8, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (8, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (12, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (12, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (12, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (12, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (12, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (12, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (9, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (9, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (9, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (9, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (9, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (9, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (9, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (10, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (10, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (10, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (10, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (10, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (10, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (10, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (11, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (11, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (11, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (11, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (11, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (11, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (11, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (13, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (13, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (13, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (13, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (13, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (13, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (13, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (14, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (14, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (14, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (14, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (14, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (14, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (14, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (15, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (15, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (15, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (15, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (15, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (15, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (15, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (16, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (16, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (16, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (16, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (16, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (16, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (16, 'notes', 'Notes & Activity', '', 7);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (17, 'overview', 'Overview', '', 1);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (17, 'go_sheet', 'GO Sheet', '', 2);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (17, 'interview_process', 'Interview Process', '', 3);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (17, 'people_intel', 'People Intel', '', 4);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (17, 'company_research', 'Company Research', '', 5);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (17, 'stories', 'Behavioural Stories', '', 6);
INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (17, 'notes', 'Notes & Activity', '', 7);
INSERT INTO knowledge_base (section_key, section_title, content, sort_order) VALUES ('stories', 'Core Behavioural Stories', '# Core Behavioural Stories

Twelve proven stories. Each has narrative tension before resolution, measurable outcomes, clear personal ownership, and genuine weakness framing where relevant. Practise each out loud — the structure matters less than the flow.

## Story 1 — HMRC: The Complex Delivery

**Use for:** Complex enterprise delivery, technical leadership, stakeholder management, public sector

| Element | Content |
| --- | --- |
| **Situation** | Mitel won a contract to deploy a private cloud UC platform for HMRC — 85,000 users, their largest global implementation. I was named Technical Design Authority. We had five people, a six-month timeline, and a formal government procurement framework to navigate. |
| **Complication** | Midway through technical testing, a third-party vendor (Unify) created an obstruction that threatened to derail the timeline. We had no contractual leverage over them and HMRC''s go-live date was fixed. |
| **Action** | I escalated directly to Mitel''s global executive team and worked with HMRC''s Cabinet Office stakeholders to apply commercial pressure from multiple angles. I also ran a parallel technical workstream to find an alternative path that didn''t depend on Unify''s cooperation. |
| **Result** | Deployed on time. 85,000 users migrated successfully. The project became Mitel''s reference case globally for large-scale public sector private cloud deployment. |
| **What I learned** | In complex multi-party programmes, the SE''s most important skill isn''t technical — it''s knowing when to escalate and who to escalate to. Political intelligence matters as much as technical design. |


**Alternate angle — influencing a senior technical stakeholder:** if the question is specifically about influencing rather than delivery, there''s a sharper cut of this same engagement. HMRC''s security architects raised a specific objection to the network design mid-programme. Rather than defending the original proposal, I requested a direct technical working session — not a commercial meeting — and came with three alternative options rather than one fixed position. Over two sessions we arrived at a revised architecture that met their requirement without materially affecting the delivery timeline. The trust that built carried through the rest of the implementation. Probe — "what''s your approach when you can''t get agreement?": escalate with full transparency, give both sides the information they need to make a good decision rather than advocating for one side, and escalate early rather than as a last resort.

## Story 2 — Case Request: The SE Process Improvement

**Use for:** Operational excellence, process improvement, cross-functional alignment, changing team behaviour, working with Sales as a peer not a support function

| Element | Content |
| --- | --- |
| **Situation** | At Zoom, the commercial team weren''t engaging SEs early in deals. Requests came in last minute, with no context and poor preparation — SEs were walking into discovery calls and demos blind, with no real chance to add value. |
| **Complication** | I raised it directly with the AE manager. Nothing changed. Talking about it wasn''t shifting behaviour — I needed evidence, not just a conversation. |
| **Action** | I introduced a formal case request process in Salesforce. AEs had to submit specific deal information and stage before an SE would be assigned. This did two things: it forced better-quality handoffs at the point of request, and it created a data trail I didn''t have before. At the next QBR, I used that data to show the sales team exactly how poor the information they''d been giving us actually was — not as a complaint, but as evidence they could see for themselves. |
| **Result** | The AE manager started ensuring requests were submitted in full, on time, with solid data. By the following quarter, we were engaged in 75% of all deals at the correct stage — up from a position where most engagements were too late to add real value. Discovery and demos became more rounded as a result, and we saw a shorter sales cycle and an improved technical win rate off the back of it. |
| **What I learned** | It reinforced for me that change only really happens in earnest when teams are working cross-functionally to the same goal. Process on its own doesn''t fix behaviour — what fixed it was giving Sales a reason to want the same outcome we did, with the data to show why it mattered. |


**Alternate angle — partnering with Sales as a peer:** if the question is specifically about building the SC-Sales relationship rather than process and data, there''s a complementary cut: approaching the Sales Director as a peer around a shared commercial problem (deals with SC attach closed at materially higher rates than those without), then jointly building an engagement model — entry criteria for SC involvement at each deal stage, a weekly review of the top 20 opportunities together, and a structured win/loss debrief process after every significant deal. Within two quarters, Sales was bringing SC in earlier because they trusted the judgement, not just the demo skill.

## Story 3 — Channel Enablement at Scale

**Use for:** Scale, enablement, programme design, global impact, channel SE leadership

| Element | Content |
| --- | --- |
| **Situation** | Zoom pivoted from direct to channel-first in EMEA. There was no dedicated channel SE function — generalist SEs were trying to support partners on the side — and no structured way to bring 200+ partner SEs up to a standard good enough to run technical conversations and demos credibly. |
| **Complication** | Partner SEs had wildly different starting points — some were ex-Cisco engineers, others were generalist reseller staff who''d never run a CCaaS demo. One programme couldn''t serve everyone. |
| **Action** | I built a dedicated internal channel SE function from scratch — started with one SE pulled across from the wider team, grew it to three (part of the team''s overall growth from 4 to 13, not additional headcount on top). In parallel, I designed a tiered onboarding programme for partner SEs — product positioning, hands-on lab work, and value-based demonstration training — with clear certification gates, and ran the first cohort myself before scaling it through a train-the-trainer model. |
| **Result** | 200+ partner SEs completed the programme in year one. Channel''s share of total revenue grew from approximately 20% to 60% within 18 months. The programme was adopted internationally and later rolled out globally. |
| **What I learned** | The most scalable thing a senior SE leader can do is build something that works without them in the room. |


**Precision note — don''t blur this with the team-growth story:** the *internal channel SE team* (one person, then three) and the *channel partner enablement programme* (200+ external partner SEs) are both genuinely "built from scratch." The wider UKI/EMEA North SE team was not — it grew from 4 to 13. Keep these distinct if asked to clarify which "team" was built from nothing.

**Probe — "How much of that revenue growth was organic versus reallocation?":** Be direct rather than letting the number stand unexplained: "Not every dollar of that was newly created by channel — as part of the GTM shift, some deals that would previously have run through direct teams were reallocated to channel. The real achievement was building the enablement infrastructure that made that reallocation credible — partners had to be capable of actually carrying deals that used to sit with direct SEs, and that''s what the programme delivered."

## Story 4 — SE Committed a Roadmap Feature (Live Scenario)

**Use for:** Handling escalations, coaching moments, deal rescue, SE process failure

| Element | Content |
| --- | --- |
| **Situation** | An SE committed a roadmap feature to a prospect to close a deal this quarter. The sales leader escalated to me — the deal was at risk and the customer had a contract addendum referencing the feature. |
| **Action** | First, talked to the SE — understood what was said, why, and whether they genuinely believed it was deliverable or felt pressured. Then talked to the AE and Sales Director to align on the commercial risk. Then brought PLM in to understand realistic timelines. Got all parties on a single call with a plan. Communicated personally to the customer — transparently, with a remediation path and a timeline. Documented the group learning as a process improvement. |
| **Result** | The deal held. The customer''s trust was preserved because we were direct with them rather than hoping they wouldn''t notice. The SE learned the right lesson — not shame, but judgment for next time. |
| **What I learned** | When something goes wrong, the SE leader''s job is to be the calmest person in the room. Blame doesn''t help the customer or the deal. |


## Story 5 — Prioritisation Under Pressure

**Use for:** Capacity management, SE prioritisation, saying no, coverage decisions

| Element | Content |
| --- | --- |
| **Situation** | At Zoom during a particularly intense quarter, the SE team had three major enterprise deals, two large channel RFPs, and a company-wide product launch requiring SE enablement — all at the same time. I had to make hard coverage decisions. |
| **Action** | I mapped every open activity against revenue impact and strategic priority. I pulled two SEs from lower-priority deals — having direct conversations with the relevant AEs — and redeployed them to the highest-impact work. I also pushed back on the product launch timeline, requesting a two-week delay to the SE enablement component. I didn''t ask permission — I made the call and communicated it clearly. |
| **Result** | Two of the three enterprise deals closed in the quarter. The third slipped but closed the following quarter. The product launch enablement was better for the extra two weeks. |
| **What I learned** | SE leaders who try to cover everything end up covering nothing well. The courage to say no to low-priority work is a leadership skill. |


## Story 6 — Building a Team Through Transformation

**Use for:** Team development, change leadership, people management, transformation

| Element | Content |
| --- | --- |
| **Situation** | When I joined Zoom, the SE team was built for a meetings product. By the time I left, we were an AI-first CCaaS SE organisation. The product changed, the GTM changed, the customer conversations changed — and the team had to change with it. |
| **Action** | I made individual development plans with each SE — identifying who had the appetite and ability to grow into the new motion, and who needed more support. I introduced structured enablement for CCaaS and AI alongside the UC base. I also made some hard decisions about role fit when the transformation exposed mismatches. |
| **Result** | The team grew from 4 to 13 and navigated three major product pivots without losing continuity on key accounts. Several SEs who were meeting specialists became credible CCaaS and AI practitioners within 12 months. |
| **What I learned** | Transformation in an SE team is a people challenge more than a technical one. Most SEs want to grow — the leader''s job is to create the conditions and the conviction that it''s worth the effort. |


**Alternate angle — strategic capability planning:** if the question is about strategic thinking specifically rather than people development, frame this as a deliberate 12-month capability roadmap built across three tracks — technical depth, commercial skill, and partner enablement — presented to EMEA Sales and SC leadership for sign-off. Same underlying story, more executive framing: the risk was that the SC team would become a bottleneck to the company''s go-to-market transition, and the roadmap was the structured response, not an improvised one.

## Story 7 — Genuine Weakness

**Use for:** "What''s your biggest weakness?" or "Where do you find the new role hardest?"

| Element | Content |
| --- | --- |
| **The honest answer** | Product domain. In every role I''ve taken, I''ve arrived without deep knowledge of the specific product. That''s true at Atlassian too — my background is UC and CCaaS, not Jira and Confluence. I''ve always closed that gap, but it''s always a gap at the start. |
| **The framing** | "The honest answer is the product depth. I''d expect to lean on the team and on [hiring manager] in the early months while I build that fluency. That''s part of why product onboarding is explicit in my 90-day plan from day one." |
| **Why this works** | It''s honest, it''s specific, it shows self-awareness, and it connects directly to something already said in the interview. It doesn''t sound rehearsed because it''s true. |


## Story 8 — Developing Ronald into Management

**Use for:** "Develop other leaders" — Atlassian''s Hiring Manager and Peer interviews both name this explicitly. Also strong for general team development questions.

| Element | Content |
| --- | --- |
| **Situation** | One of my UK SEs, Ronald, wanted to move into management. He had the right instincts but no track record of ownership beyond his own accounts — nothing yet to point to. |
| **Action** | I started small and deliberate. First gave him ownership of the demo environments — making sure the team had what they needed to demonstrate consistently — with a regular slot on the team call to walk through it. As his confidence grew, I expanded what he owned: setting deadlines against goals, surfacing problems early. Within a year he was running the team''s QBRs himself — setting next quarter''s goals, calling out what was working and what wasn''t — and presenting that up to me so I could roll it into my own QBR for leadership. |
| **Result** | He got the promotion and the title — team leader. By that point it was close to a formality, because he''d already built a genuine track record of ownership and team leadership. He could surface problems early, run a room, and think a quarter ahead — the actual job, not just the label. |
| **What I learned** | Developing someone into leadership isn''t a single moment — it''s a sequence of expanding ownership, each step slightly bigger than their current confidence, with a visible moment to prove it each time. By the time the promotion conversation happens, the case has already made itself. |


## Story 9 — Adarna: Managing Underperformance with Honesty

**Use for:** "Hold teams accountable to a high-performance bar." Managing underperformance, difficult conversations, PIPs, getting the right people in the right roles. A strong counterweight to Story 8 — this one shows the other end of performance management, where the right outcome wasn''t keeping someone in role.

| Element | Content |
| --- | --- |
| **Situation** | Adarna had been on my team from day zero at Zoom. She was a genuinely good people person — great at building customer relationships — but the SE role itself, with the pace of product change, wasn''t a natural fit for her. Her aligned AEs were complaining she was falling back on standard demos rather than tailoring them. |
| **Action** | I had a direct conversation with her first — not to tell her what to fix, but to understand her view and what was getting in the way. She agreed she needed to step up and we set some starting points together that she was happy to commit to. The following week, no progress — she said she''d been unwell. The week after, still no progress, this time with no excuse at all. At that point I had to be honest with her about where things stood and put her on a PIP with clear steps and expectations. She agreed to them. Two weeks later, still very little movement. On that call, she finally told me the truth — she no longer enjoyed the SE role, found it too complicated, but loved working for Zoom. |
| **Result** | Once I had the honest picture, it was clear she wasn''t in the wrong company, just the wrong role. We talked through what she actually enjoyed and where she came alive in her work, and it pointed clearly to Customer Success. I had a conversation with the CS leader, and a few weeks later she moved across. She went on to be a genuinely strong CS account manager. |
| **What I learned** | If that conversation hadn''t gone that way, the PIP would have become formal and we''d have had a harder conversation about her future. But the lesson I''ve carried since is that performance management isn''t always about fixing someone in the role they''re in — sometimes it''s about getting the right people into the right roles at the right time. She''d been a great SE once; that time had passed, and she was brave enough to admit it. That honesty is what let both of us land somewhere better. |


## Story 10 — Coaching for Discovery, Not Just Product Knowledge

**Use for:** Coaching and developing individual SEs where the gap is commercial/discovery skill rather than effort or attitude. Distinct from Story 8 (developing someone into management) and Story 9 (a fit issue) — this is a skill-specific coaching intervention with a measured before/after. Already used live and successfully at Genesys (reached panel stage) — confirmed real, not newly constructed.

| Element | Content |
| --- | --- |
| **Situation** | At Mitel, an SE on my team was technically excellent — deep product knowledge, strong in the room with IT teams — but consistently lost deals at the business case stage. He could demonstrate the platform brilliantly but struggled to connect what it did to what the customer was trying to achieve commercially. His win rate was below the team average, and post-loss feedback repeatedly cited "didn''t understand our business." |
| **Action** | I shadowed him on two customer calls without intervening, to diagnose the actual gap rather than assume one. What I saw was that he led with product features before understanding what the customer needed to see — he had a plan for what to show, not a plan for what to learn first. I gave him direct, evidence-based feedback on exactly what I''d observed, and we agreed a 60-day plan: a structured discovery framework, a pre-call planning template that made him write down the business outcome he was trying to surface before every meeting, and fortnightly call reviews where we listened back together. I also paired him with a stronger commercial SE for two joint customer engagements so he could see a different approach live. |
| **Result** | Within 90 days his discovery quality had measurably improved — more questions, fewer feature monologues, a clearer business case narrative. His win rate moved from below team average to in line with the team within two quarters. He went on to become one of the stronger commercial SEs on the team, and the discovery framework we built for him became part of the broader team enablement. |
| **What I learned** | Diagnosing before fixing matters more than people think — the two shadowed calls told me more than any conversation about the problem would have. |


**Probe — "What if the coaching hadn''t worked?":** "If genuine effort and support over a reasonable timeframe hadn''t moved the dial, I''d have had an honest conversation about whether the role was the right fit. A weak SE on strategic deals affects the whole team''s win rate and the customer''s perception of the company. High standards and genuine investment in people aren''t in conflict — but you can''t let one drag the other indefinitely."

## Story 11 — Handling Resistance to a New Process

**Use for:** Difficult people situations, handling pushback on change, distinguishing valid concerns from problematic behaviour. Distinct from Story 9 (Adarna — a fit/performance issue) — this is a strong performer pushing back on a process change, where some of the pushback was actually valid.

| Element | Content |
| --- | --- |
| **Situation** | At Zoom, an SE who was a strong individual contributor was actively resistant to the new engagement model and KPI framework I''d introduced — vocal about his disagreement in team meetings, to the point it was affecting the team''s adoption of the new approach. His individual performance was fine; his influence on team culture wasn''t. |
| **Action** | I had a direct, private conversation — genuinely to understand his concerns first, not to deliver a verdict. He felt the new model reduced his autonomy and didn''t reflect how his enterprise accounts actually worked. Some of that was valid, so I acknowledged it directly and made two specific adjustments to the model based on his input. I was equally direct that the resistant behaviour in team settings wasn''t something I could keep allowing, regardless of whether his concerns were legitimate. We agreed clear expectations going forward. |
| **Result** | He became a constructive participant rather than a resistant one — partly because he felt genuinely heard, partly because the expectations were now explicit. His input actually improved the model. |
| **What I learned** | Resistance sometimes contains useful signal. The job is separating the substance from the behaviour and addressing both, not just shutting down the behaviour. |


**Probe — "What if the behaviour had continued?":** "Then it would have become a formal performance issue. High standards and psychological safety aren''t the same thing. Someone who keeps undermining agreed process and team cohesion, despite a direct conversation and genuine effort to address their concerns, is a leadership problem that has to be resolved. I''d have acted earlier if the first conversation hadn''t worked."

## Story 12 — Build with Heart and Balance: The Case Request Enterprise Rollback

**Use for:** "Build with heart and balance" (Atlassian Values Interview, Stage 3). Real failure, genuine ownership, honest learning. Also usable for any "tell me about a mistake you made" or "when have you got something wrong" question. Distinct from Story 11 (handling resistance) — this is a self-generated error, not an interpersonal conflict.

| Element | Content |
| --- | --- |
| **Situation** | When I introduced the case request process at Zoom, I rolled it out across both mid-market and enterprise at the same time. Mid-market was the team I''d diagnosed the problem in — SEs being pulled in late, no context on the deal, wasted effort on poorly qualified opportunities. I assumed enterprise had the same problem and applied the same fix without checking. |
| **Complication** | A few weeks in, I started hearing from the SE team that the enterprise AEs weren''t happy. The friction had been building for a while before it surfaced to me — the AEs were raising it directly with the SEs rather than coming to me. |
| **Action** | I brought it up in my next 1-2-1 with the enterprise sales lead. The conversation made it clear pretty quickly that I''d got it wrong. In enterprise, the AE-SE relationship was already a genuine partnership — lower deal volumes, longer cycles, tight collaboration from day one. The case request process wasn''t solving a problem that existed there; it was adding overhead to something that was already working. I removed the requirement for enterprise and kept it for mid-market where it belonged. |
| **Result** | The friction resolved. Mid-market continued to benefit from the process; enterprise went back to operating as they had before, with the relationship intact. |
| **What I learned** | The lesson wasn''t just "move slower." It was that I''d made a diagnostic error — I''d assumed the same symptom existed across both segments because I''d seen it in one of them, without testing whether the context was actually the same. I''d diagnosed mid-market and treated enterprise. I now make a deliberate point of testing the problem definition with the right stakeholders before implementing anything, not after. |


**Delivery note:** resist the urge to compress the timeline when telling this live — the fact that it took a few weeks before it surfaced to you is part of the honest telling. Don''t sanitise it into "I spotted it quickly and corrected course." That''s not what happened, and Atlassian''s probing is specifically looking for real failure, not a managed near-miss.

## Quick Reference — Story Selection

| Question type | Best story |
| --- | --- |
| Complex delivery / enterprise credibility | Story 1 — HMRC |
| Influencing a senior technical stakeholder | Story 1 — HMRC (alternate angle, see note) |
| SE process improvement / cross-functional alignment | Story 2 — Case Request |
| Partnering with Sales as a peer | Story 2 — Case Request (alternate angle, see note) |
| Scale / programme design / global impact / channel | Story 3 — Channel Enablement |
| Escalation / coaching / deal rescue | Story 4 — Roadmap Feature |
| Prioritisation / capacity / saying no | Story 5 — Prioritisation |
| Team development / transformation | Story 6 — Team Through Transformation |
| Strategic thinking / capability planning | Story 6 — Team Through Transformation (alternate angle, see note) |
| Weakness / hardest part of new role | Story 7 — Genuine Weakness |
| Develop other leaders / grow someone into management | Story 8 — Ronald |
| Managing underperformance / difficult performance conversations / PIPs (fit issue) | Story 9 — Adarna |
| Coaching a skill gap (discovery, commercial acumen) | Story 10 — Coaching for Discovery |
| Handling resistance to change / valid pushback vs. problematic behaviour | Story 11 — Resistance to a New Process |
| Real failure / "build with heart and balance" / diagnostic error | Story 12 — Case Request Enterprise Rollback |', 1);
INSERT INTO knowledge_base (section_key, section_title, content, sort_order) VALUES ('background', 'Background Summary', '# Background Summary

The 90-second version. Use this as the answer to "tell me about yourself" or "walk me through your background." Practise out loud — not reading, saying.

## The 90-Second Version


I''ve spent the last decade building and leading SE organisations in enterprise SaaS. Most recently I ran the UKI and EMEA North SE function at Zoom — I joined a team of four and grew it to thirteen through a significant transformation: meetings to UC to CCaaS to AI, with a full GTM pivot from direct to channel-first.

I built the SE practice from the ground up — discovery frameworks, demo standards, POV methodology, partner onboarding. The channel programme I built trained over 200 partner SEs in its first year and contributed directly to 60% channel revenue growth within 18 months. That framework was later adopted across the wider international business and rolled out globally.

Before Zoom, I was at Mitel — first as SE Manager for UKI, then Director for Northern Europe. At Mitel I served as Technical Design Authority for HMRC''s 85,000-user private cloud deployment — their largest global implementation. A multi-year programme with formal government procurement, security accreditation, and senior stakeholders across HMRC and Cabinet Office.

I''m now looking for a Director or Senior Manager SE leadership role in enterprise SaaS where I can build or develop a high-performing team through another period of transformation.


## Career Timeline

| Period | Role | Company | Key Story |
| --- | --- | --- | --- |
| 2021–present | SE Manager, UKI & EMEA North | Zoom | Grew 4→13, meetings→AI, direct→channel-first, global enablement rollout |
| 2020–2021 | Director SE, Northern Europe | Mitel Networks | Regional SE leadership, cloud CX and UCaaS |
| 2015–2020 | SE Manager, UKI | Mitel Networks | Built SE from scratch post-merger, HMRC 85k-user deployment |
| 2013–2015 | Head of Technical & Training | Aastra Technologies | The Junction — chose pre-sales over product when Mitel acquired Aastra |
| 1989–2013 | Senior Engineering & Technical Leadership | Aastra / Ascom / Weston | Deep enterprise telephony, UC, partner delivery |


## Critical Accuracy Notes

**Zoom:** JOINED an existing team of 4 and GREW to 13. Do NOT say "built from scratch."

**Mitel:** BUILT the UK pre-sales function from scratch multiple times post-merger. This IS the "built from scratch" story.

**HMRC:** 85,000-user private cloud deployment. Mitel''s largest global implementation. Always anchor this in enterprise, public sector, and complex delivery conversations.

## Strengths to Signal Early

- Build SE operating models from the ground up — not incremental improvers
- Player-coach: stay close to strategic deals while building the system around me
- Commercial instincts: partner with Sales leadership as a peer, not a support function
- Global impact: work that scales beyond the immediate team
- AI-first: genuine, not performative — use Claude daily, built SE AI tools myself', 2);
INSERT INTO knowledge_base (section_key, section_title, content, sort_order) VALUES ('meddpicc', 'MEDDPICC & Value Selling', '# MEDDPICC and Value Selling

MEDDPICC gives you the structure to qualify and manage a deal. Value selling gives you the content that fills that structure. They reinforce each other at every stage — MEDDPICC tells you where to focus, value selling tells you what to say when you get there.

## The Connection

Most SE teams treat these as separate frameworks. They''re not. MEDDPICC is a qualification and deal management structure. Value selling is a customer engagement philosophy. The two reinforce each other at every stage of the cycle.

## MEDDPICC — Each Element

| Letter | Element | Value Selling Connection | SE''s Job |
| --- | --- | --- | --- |
| **M** | Metrics | This is the value hypothesis. The heart of value selling. | Surface the metrics the customer cares about in their own words. If you can''t quantify success, you haven''t qualified the deal. |
| **E** | Economic Buyer | The person who cares about outcomes, not features. Value conversations happen here. | A value conversation with a technical evaluator is interesting. A value conversation with the economic buyer moves money. |
| **D** | Decision Criteria | Strong discovery lets you shape this early — ideally in your favour. | If you''ve done value selling properly, you''ve helped the customer articulate success before the formal evaluation starts. |
| **D** | Decision Process | How the decision gets made, and by whom, in what order. | Map the steps, approvals, and timeline. Know where the deal can stall before it does. |
| **P** | Paper Process | Procurement, legal, security review — the path from yes to signature. | Often the most underestimated source of slippage. Surface it early, especially in enterprise and public sector. |
| **I** | Identified Pain | MEDDPICC identifies the pain. Value selling prices it. | Identify and implicate the pain. Quantify the cost of inaction — the foundation of urgency. |
| **C** | Champion | The person who sells for you when you''re not in the room. | Build a champion AND arm them with the value narrative. If they can''t answer "what is this worth to us", they''ll lose internally. |
| **C** | Competition | "Do nothing" is the most common competitor. | The cost of inaction is your strongest weapon against status quo. |


## Value Selling — Five Principles

| Principle | What it means in practice |
| --- | --- |
| **Discovery before demo** | Never show the product until you understand the pain, the business impact, and who cares about solving it. A demo without discovery is a product tour — it entertains but rarely advances a deal. |
| **The value hypothesis** | Agree up front what the customer believes the outcome is worth. Get them to articulate it — customers trust their own numbers more than yours. |
| **Economic buyer engagement** | Value conversations happen where budget decisions are made. Ask: who in this organisation loses if the problem isn''t solved? That person needs a business case, not a feature list. |
| **Success metrics before the sale** | Define what "working" looks like in 12 months before the contract is signed. No agreed definition of success = no way to prove value delivered. |
| **The SE as value coach** | The SE''s primary tool is questions, not answers. More interested in understanding the customer''s world than showcasing product knowledge. |


## The Most Important Element for an SE

**Discovery.** Everything else in MEDDPICC depends on it. If the SE doesn''t do proper discovery, the Metrics are guesswork, the Pain is assumed, the Decision Criteria are the customer''s default rather than something you''ve influenced, and the Champion has nothing compelling to carry internally.

Discovery is also where value selling lives or dies. It''s the only point in the cycle where the SE can surface what the problem is actually worth — and get the customer to say it themselves.

## Cost of Inaction — The Most Underdeveloped Skill

When a customer clearly understands what doing nothing is costing them, decisions happen faster. Most SEs avoid putting a credible number on the cost of inaction at the first sign of pushback. This is the single most underdeveloped skill in SE — and the foundation of value-based consultative selling.

## Interview One-Liner


"MEDDPICC gives you the structure to qualify and manage a deal. Value selling gives you the content that fills that structure. Metrics without value selling is just a number. An Economic Buyer conversation without value selling is just a status update. They work together — MEDDPICC tells you where to focus, value selling tells you what to say when you get there."', 3);
INSERT INTO knowledge_base (section_key, section_title, content, sort_order) VALUES ('kpis', 'Pre-Sales KPIs', '# Pre-Sales KPIs

**North Star:** Technical Win Rate. **Primary leading indicator:** Compelling Event Quality. The shift that matters most — decouple activity from impact. High demo volume is meaningless without context on opportunity quality and technical outcomes.

## The Top KPIs

| KPI | Formula | Why it matters |
| --- | --- | --- |
| **Technical Win Rate ★** | Technical wins ÷ technical evaluations undertaken | The North Star. Isolates SE performance from price, timing, and relationship. High TWR + low overall win rate = Sales problem. Low TWR = SE problem. |
| **Compelling Event Quality** | Rubric score 1–10 per opportunity | Primary leading indicator. 7–10 = hard date + verified forcing function + explicit consequence. Below 5 = pipeline risk. |
| **Cost of Inaction** | Qualitative — quantified per deal | Most underdeveloped skill in SE. When the customer understands what doing nothing costs, decisions speed up. |
| **SE Attachment Rate** | Opps with SE ÷ total qualified opps | Are SEs covering the right deals, early enough? Pair with win rate to prevent gaming. |
| **Demo-to-Win Conversion** | Closed-won with demo ÷ opps that received demo | Low = poor qualification or demo quality. The discipline question. |
| **POC Technical Close Rate** | POCs leading to technical win ÷ total POCs run | Primary metric, not vanity. Low rate = poor POC design or wrong qualification — both fixable. |
| **SE-Attached Revenue** | Sum of closed-won ARR with SE attachment | Commercial impact of the SE function. Also: ARR per SE FTE for headcount justification. |
| **Sales Satisfaction (NPS)** | AE rating of SE partnership (1–10 quarterly) | Almost no one does this. Highly effective. Three questions, quarterly. Surfaces patterns fast. |
| **SE Utilisation Rate** | Hours on defined tasks ÷ available hours × 100 | Sweet spot 70–80%. Above 85% = capacity risk. |
| **Average Sales Cycle** | Close date − qualified engagement date (days) | SE-attached deals should be shorter. If not, the SE is adding process not value. |


## KPI Categories

### Leading Indicators

Predict future revenue health before the results arrive.

- Compelling Event Quality Score
- MEDDPICC Compliance
- Pipeline Coverage
- Cost of Inaction Coverage
- POC Success Metrics

### Lagging Indicators

Validate what happened — the scoreboard after the game.

- SE-Attached Win Rate
- ARR per SE FTE
- Average Deal Size
- Sales Cycle Length

### Operational Metrics

The pulse of the machine — resource and activity health.

- SE Utilisation
- Attachment Rate
- Request Volume per AE
- Demo Volume

### Qualitative Metrics

The human standard of excellence.

- Discovery Quality Score
- Demo Quality Score
- Sales Satisfaction NPS
- Handoff Completeness

## Sales Satisfaction NPS — The Underused One


Schedule a 15-minute quarterly coffee with each AE or join a sales team call. Ask the same three questions every time:

- On a scale of 1–10, how would you rate last quarter''s SC collaboration?
- What worked really well?
- What can we improve?

Surfaces patterns fast, builds trust, and creates AE-SE alignment without adding process overhead. For a new SC manager it''s also the fastest way to understand the current relationship state.


## Key Principles

- **Decouple activity from impact.** High demo volume is meaningless without context on opportunity quality and technical outcomes.
- **Pair KPIs to prevent gaming.** Win rate alone can be gamed by disqualifying hard deals. Pair it with attachment rate.
- **Instrument the workflow, not the people.** The best KPI systems capture data automatically from CRM and call transcripts — not from asking SEs to fill in fields manually.
- **Activity metrics are the pulse, not the story.** They tell you if the machine is running — not if it''s running in the right direction.

## Interview Answer — What KPIs Do You Track?


"I lead with Technical Win Rate as the North Star — it isolates SE performance from commercial factors outside our control. Compelling Event Quality is the primary leading indicator — if that''s weak, the pipeline number is fiction. And I always run a quarterly Sales Satisfaction NPS with the AE team — almost no one does it, but it surfaces relationship issues before they become forecast problems. Everything else follows from those three."', 4);
INSERT INTO knowledge_base (section_key, section_title, content, sort_order) VALUES ('90_days', 'The First 90 Days', '# The First 90 Days

Slow is smooth. Smooth is fast. With an experienced team, the worst thing a new leader can do is arrive with a change agenda. The first job is to earn the right to lead — not assert it.

**The posture:** I don''t arrive with answers. I arrive with questions.

## Days 1–30: Listen and Learn


**Theme:** Understand the team, the business, and the relationships before changing anything.


| Activity | Purpose |
| --- | --- |
| Bi-weekly 1:1s with every SE | Genuine conversations, not reviews. What do they find hard? What''s working? What would they change? |
| Into the CRM and KPIs immediately | Use data to sharpen questions, not form conclusions. Understand what''s being measured and what''s being ignored. |
| Sit in on live customer calls | Watch how the team operates in the real world, not how they describe it. |
| Meet every AE and sales leader | How do they use SE? Where do they feel unsupported? What do they wish the SE team did differently? |
| Begin the CS conversation | Understand the post-sale relationship and where SE hands off. |


**Won''t do in days 1–30:** Restructure. Change deal allocation. Make promises. Introduce new process. Announce what''s wrong.

## Days 31–60: Diagnose and Align


**Theme:** Form a view and start sharing it — with the team first.


| Activity | Purpose |
| --- | --- |
| Share back what I''ve heard | People who were listened to need to know it mattered. Build trust before building change. |
| Shape the operating model with the team | Not imposed on them. Built together from two months of learning. |
| Deepen the CS relationship | Frame SE''s role in retention, not just acquisition. |
| Formalise the Sales partnership | Clear rules of engagement — when SE attaches, how deals are qualified, what the AE can expect. |
| Establish what SE should NOT do | Protecting capacity is as important as deploying it. No demo without discovery is the first boundary. |


## Days 61–90: Build for Scale


**Theme:** The operating model delivers three things — Scale, Quality, Long-term Customer Outcomes.


| Activity | Purpose |
| --- | --- |
| Formalise the operating model | Built from two months of learning. Discovery standards, demo quality framework, POC methodology, coverage model. |
| Introduce outcome-based metrics | Technical win rates, deal influence, pipeline contribution. Replace activity counting with impact measurement. |
| Formalise the SE–CS bridge | Shared customer outcomes across the full lifecycle, not a hard handoff at signature. |
| Individual development conversations | Where does each SE want to go? What does the team need to develop to serve the next 12 months of the business? |
| Present 90-day findings and signal direction | To leadership: here''s what I found, here''s what I''m building, here''s how we''ll measure it. |


## What SC Should NOT Do

- **Demo without prior discovery** — a product tour, not a value conversation
- **Attend every AE meeting** — SE attaches where technical credibility is needed, not by default
- **Own post-sale support** — clean handoff to CS and delivery at signature
- **Chase unqualified RFPs** — not every RFP earns full SE investment
- **Write commercial proposals** — SE owns technical architecture, not the commercial wrapper

## Interview One-Liner


"I don''t arrive with a change agenda. I arrive with questions. The first 30 days are about earning the right to lead — understanding the team, the data, and the relationships before touching anything. The operating model comes from listening, not from importing what I did somewhere else."', 5);
INSERT INTO knowledge_base (section_key, section_title, content, sort_order) VALUES ('se_model', 'SE Operating Model', '# SE Operating Model Overview

This is the operating model I build wherever I lead an SE function. It''s not imported wholesale from a previous role — it''s built from listening, then constructed with the team. But the components are consistent. This page is the map.

## The Principle


An SE function that produces consistent results doesn''t rely on heroics. It relies on systems — the playbooks, standards, and rhythms that allow any SE to operate at a high level regardless of who the AE is, what the product is, or how complex the deal is.

**The goal: fewer demos, won more often.**


## The Five Components

| Component | What it is | Why it matters |
| --- | --- | --- |
| **1. Discovery Standards** | A repeatable technical discovery flow. Mandatory before any demo or POC commitment. | Discovery is the foundation of everything. Without it, Metrics are guesswork and demos are product tours. |
| **2. Demo Quality Framework** | Standards for personalisation, prep discipline, and the tell-show-tell structure. AI-assisted prep as default. | A demo earned through discovery. Tailored to the customer''s pain, not the product''s features. |
| **3. POC Methodology** | Qualification gate, mutually-agreed success criteria, fixed time-box, decisive go/no-go. POC technical close rate tracked as primary metric. | A POC is the most expensive thing an SE team does. It has to earn its place. |
| **4. Operating Rhythm** | Deal reviews, forecast discipline, pipeline inspection, coverage model, 1:1 cadence, quarterly Sales NPS. | Consistent execution doesn''t happen by accident. It happens because the rhythm makes it the default. |
| **5. People Development** | Individual development plans, succession planning, coaching cadence, hiring standards, progression paths. | The team is the product. Build a bench, not just fill seats. |


## What SE Should and Should Not Own

### SE Owns

- Technical discovery and qualification
- Demo strategy and execution
- POC design, delivery, and technical close
- RFP technical response
- Solution architecture for complex deals
- Executive technical presentations
- Product feedback loop to Product Management
- SE enablement and team development

### SE Does Not Own

- Sales pipeline and quota (stays with Sales)
- Commercial proposals and pricing (stays with Sales)
- Post-sale implementation (stays with CS and PS)
- Account ownership (AE pre-sale, CSM post-sale)
- Product roadmap decisions (stays with Product)
- Marketing and PMM (stays with Marketing)

## How It Connects to KPIs

| Component | Primary KPI | Leading Indicator |
| --- | --- | --- |
| Discovery Standards | Technical Win Rate | Discovery completion rate |
| Demo Quality Framework | Demo-to-Win Conversion | Demo prep time vs outcome |
| POC Methodology | POC Technical Close Rate | POC qualification gate pass rate |
| Operating Rhythm | Forecast accuracy, SE utilisation | Compelling Event Quality Score |
| People Development | SE retention, progression rate | Sales Satisfaction NPS |


## The SE Playbook Library

Each component above has a detailed playbook. These live in SignalOS (local SE operating system) and in this Confluence space.

- Discovery Framework
- Value Coaching and MEDDPICC
- Demo Standards
- POC Playbook
- RFP and Bid/No-Bid Process
- Key Deal Reviews
- Win/Loss Reviews
- Pre-Sales KPIs
- Hiring and Team Development
- Channel SE Enablement
- Migration Architecture
- The First 90 Days

## How I Build This in a New Role


**Days 1–30:** Listen. Understand the team, the data, and the relationships. Don''t touch anything.

**Days 31–60:** Diagnose. Share back what I''ve heard. Start shaping the operating model with the team, not imposed on it.

**Days 61–90:** Build. Formalise the model. Introduce outcome-based metrics. Present findings to leadership.

The operating model comes from listening, not from importing what I did somewhere else.', 6);