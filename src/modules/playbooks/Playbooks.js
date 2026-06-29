import { PLAYBOOK_CONTENT } from './playbookContent.js'

const PLAYBOOKS = [
  { key: 'discoveryframework', title: 'Discovery Framework',      badge: 'Customer Execution',       desc: 'Structured business and technical discovery' },
  { key: 'value',              title: 'Value Coaching',           badge: 'Customer Engagement',       desc: 'Lead with the problem, not the product' },
  { key: 'meddpicc',          title: 'MEDDPICC',                 badge: 'Deal Qualification',        desc: 'Qualification structure + value content' },
  { key: 'demo',              title: 'Demo Standards',            badge: 'Pre-Sales Craft',           desc: 'The reward for discovery, not a substitute' },
  { key: 'poc',               title: 'POC Playbook',              badge: 'Pre-Sales Methodology',     desc: 'Run pilots that close — discipline over drift' },
  { key: 'rfp',               title: 'RFP Bid Go/No Go',         badge: 'Pre-Sales Operations',      desc: 'Decide whether to bid before you bid' },
  { key: 'dealreview',        title: 'Key Deal Reviews',          badge: 'Deal Management',           desc: 'Stress-test the deals that matter' },
  { key: 'winloss',           title: 'Win / Loss Reviews',        badge: 'Continuous Improvement',    desc: "Capture the lesson while it's fresh" },
  { key: 'executive',         title: 'Executive Engagement',      badge: 'Enterprise Selling',        desc: 'Run outcome-led executive conversations' },
  { key: 'competitive',       title: 'Competitive Strategy',      badge: 'Competitive Execution',     desc: 'Battlecards, differentiation, and displacement' },
  { key: 'migration',         title: 'Migration Architecture',    badge: 'Solution Architecture',     desc: 'Where complex deals are won on trust' },
  { key: 'technicalqualification', title: 'Technical Qualification', badge: 'Technical Assessment', desc: 'Architecture, integration, compliance and delivery risk' },
  { key: 'escalation',        title: 'Escalation & Recovery',     badge: 'Customer Recovery',         desc: 'Recover trust when technical confidence is at risk' },
  { key: 'cs-transition',     title: 'CS Transition',             badge: 'Post-Sales Continuity',     desc: 'Protect adoption, value and renewal outcomes' },
  { key: 'kpis',              title: 'Pre-Sales KPIs',            badge: 'Performance Architecture',  desc: 'Measure impact, not activity' },
  { key: 'capacity',          title: 'SE Capacity Model',         badge: 'Operating Model',           desc: 'Rules for engagement and technical resource allocation' },
  { key: 'hiring',            title: 'Hiring & Development',      badge: 'Team Leadership',           desc: 'Build a bench, not just fill seats' },
  { key: 'channel',           title: 'Channel SE Enablement',     badge: 'Go-To-Market',              desc: 'Partner SEs who can sell without you' },
  { key: 'ninety',            title: '90-Day Plan',               badge: 'Leadership Onboarding',     desc: 'Listen, diagnose, build for scale' },
  { key: 'aiops',             title: 'AI & Automation',           badge: 'AI Augmentation',           desc: 'AI-assisted SE execution' },
]

const SECTIONS = [
  { title: 'Customer Execution',             keys: ['discoveryframework','value','meddpicc','demo','poc','rfp','dealreview','winloss'] },
  { title: 'Enterprise & Technical Strategy',keys: ['executive','competitive','migration','technicalqualification','escalation','cs-transition'] },
  { title: 'SE Operating Model',             keys: ['kpis','capacity','hiring','channel','ninety','aiops'] },
]

let currentPlaybook = null

export async function Playbooks() {
  currentPlaybook = null
  return renderIndex()
}

function renderIndex() {
  return `
    <header class="page-header">
      <div class="page-header-left">
        <p class="eyebrow">Signal OS</p>
        <h2>Playbooks</h2>
      </div>
    </header>

    <div id="playbook-content">
      ${SECTIONS.map(section => `
        <div class="playbook-section">
          <h3 class="playbook-section-title">${section.title}</h3>
          <div class="playbook-grid">
            ${section.keys.map(key => {
              const pb = PLAYBOOKS.find(p => p.key === key)
              if (!pb) return ''
              return `
                <div class="playbook-card" data-key="${pb.key}">
                  <span class="badge">${pb.badge}</span>
                  <h4>${pb.title}</h4>
                  <p>${pb.desc}</p>
                  <span class="playbook-open">Open playbook →</span>
                </div>
              `
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function renderDetail(key) {
  const pb = PLAYBOOKS.find(p => p.key === key)
  const content = PLAYBOOK_CONTENT[key] || '<p>Content not found.</p>'
  return `
    <div class="playbook-detail">
      <button class="back-btn" id="playbook-back">
        <i class="ti ti-arrow-left" aria-hidden="true"></i> All Playbooks
      </button>
      <div class="playbook-detail-content">
        ${content}
      </div>
    </div>
  `
}

export function attachPlaybookHandlers() {
  document.querySelectorAll('.playbook-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.key
      currentPlaybook = key
      document.querySelector('#playbook-content').innerHTML = renderDetail(key)
      attachPlaybookDetailHandlers()
    })
  })
}

function attachPlaybookDetailHandlers() {
  document.querySelector('#playbook-back')?.addEventListener('click', () => {
    currentPlaybook = null
    document.querySelector('#playbook-content').innerHTML = SECTIONS.map(section => `
      <div class="playbook-section">
        <h3 class="playbook-section-title">${section.title}</h3>
        <div class="playbook-grid">
          ${section.keys.map(key => {
            const pb = PLAYBOOKS.find(p => p.key === key)
            if (!pb) return ''
            return `
              <div class="playbook-card" data-key="${pb.key}">
                <span class="badge">${pb.badge}</span>
                <h4>${pb.title}</h4>
                <p>${pb.desc}</p>
                <span class="playbook-open">Open playbook →</span>
              </div>
            `
          }).join('')}
        </div>
      </div>
    `).join('')
    attachPlaybookHandlers()
  })
}