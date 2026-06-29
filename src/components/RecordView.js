const STABILITY_BADGE = {
  PASS: 'badge-pass',
  REVIEW: 'badge-review',
  CAUTION: 'badge-caution',
  UNKNOWN: 'badge-unknown'
}

const STATUS_BADGE = {
  'Applied': 'status-applied',
  'TA Screen': 'status-ta',
  'HM Interview': 'status-hm',
  'Peer': 'status-peer',
  'Panel': 'status-panel',
  'Offer': 'status-offer',
  'Closed': 'status-closed'
}

import { marked } from 'marked'

function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(text, { breaks: true, gfm: true })
}

function renderSection(section, appId) {
  return `
    <div class="section-page content-card" id="section-page-${section.id}">
      <div class="prep-section-header">
        <h2>${section.section_title}</h2>
        <button class="edit-section-btn" data-id="${section.id}">
          <i class="ti ti-edit" aria-hidden="true"></i> Edit
        </button>
      </div>

      <div class="prep-content" id="content-view-${section.id}">
        ${section.content
          ? `<div class="markdown-body">${renderMarkdown(section.content)}</div>`
          : `<p class="empty-section">No content yet — click Edit to add, or use the AI bar below to generate it.</p>`
        }
      </div>

      <div class="prep-editor hidden" id="content-edit-${section.id}">
        <textarea class="section-textarea" id="textarea-${section.id}">${section.content || ''}</textarea>
        <div class="editor-actions">
          <button class="save-section-btn btn-primary" data-id="${section.id}">Save</button>
          <button class="cancel-section-btn btn-ghost" data-id="${section.id}">Cancel</button>
        </div>
      </div>

      <div class="ai-bar">
        <input
          class="ai-input"
          type="text"
          placeholder="Ask AI to generate or update this section..."
          data-section-id="${section.id}"
          data-app-id="${appId}"
        />
        <button class="ai-submit-btn" data-section-id="${section.id}" data-app-id="${appId}">
          <i class="ti ti-sparkles" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `
}

export async function openRecordView(applicationId, allApplications, onBack) {
  const app = allApplications.find(a => String(a.id) === String(applicationId))
  if (!app) return

  const sections = await fetch(`/api/role-prep?application_id=${applicationId}`)
    .then(r => r.json())

  const container = document.querySelector('#record-view')
  container.classList.remove('hidden')
  document.querySelector('#main-content').classList.add('hidden')

  const roleNav = allApplications
    .filter(a => a.status !== 'Closed')
    .map(a => `
      <button
        class="role-nav-btn ${String(a.id) === String(applicationId) ? 'active' : ''}"
        data-id="${a.id}"
      >
        <span class="role-nav-company">${a.company}</span>
        <span class="role-nav-status ${STATUS_BADGE[a.status] || 'status-applied'}">${a.status}</span>
      </button>
    `).join('')

  const firstSection = sections[0]

  container.innerHTML = `
    <div class="record-shell">

      <aside class="record-sidebar">
        <button class="back-btn" id="back-to-board">
          <i class="ti ti-arrow-left" aria-hidden="true"></i> Board
        </button>

        <div class="role-nav-list">
          ${roleNav}
        </div>

        <div class="section-nav">
          <p class="section-nav-label">Sections</p>
          ${sections.map((s, i) => `
            <button
              class="section-nav-btn ${i === 0 ? 'active' : ''}"
              data-section-id="${s.id}"
            >
              ${s.section_title}
            </button>
          `).join('')}
        </div>
      </aside>

      <main class="record-main">
        <div class="record-header">
          <div>
            <p class="eyebrow">${app.status}</p>
            <h1 class="record-title">${app.company}</h1>
            <p class="record-role">${app.role_title}</p>
          </div>
          <div class="record-meta">
            ${app.stability_check ? `<span class="stability-badge ${STABILITY_BADGE[app.stability_check] || 'badge-unknown'}">${app.stability_check}</span>` : ''}
            ${app.salary ? `<span class="record-salary">${app.salary}</span>` : ''}
          </div>
        </div>

        <div class="record-quick-links">
          ${app.jira_id ? `<a href="https://leesmith286.atlassian.net/browse/${app.jira_id}" class="ql-btn jira-link"><i class="ti ti-external-link" aria-hidden="true"></i> Jira ${app.jira_id}</a>` : ''}
          ${app.prep_page_url ? `<a href="${app.prep_page_url}" class="ql-btn prep-link"><i class="ti ti-external-link" aria-hidden="true"></i> Confluence</a>` : ''}
          ${app.job_link ? `<a href="${app.job_link}" class="ql-btn"><i class="ti ti-external-link" aria-hidden="true"></i> JD</a>` : ''}
        </div>

        <div id="section-content-area">
          ${firstSection ? renderSection(firstSection, applicationId) : '<p class="empty-section">No sections found.</p>'}
        </div>
      </main>

    </div>
  `

  attachRecordHandlers(applicationId, allApplications, sections, onBack)
}

function attachRecordHandlers(applicationId, allApplications, sections, onBack) {

  document.querySelector('#back-to-board')?.addEventListener('click', () => {
    document.querySelector('#record-view').classList.add('hidden')
    document.querySelector('#main-content').classList.remove('hidden')
    if (onBack) onBack()
  })

  document.querySelectorAll('.role-nav-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const apps = await fetch('/api/applications').then(r => r.json())
      await openRecordView(btn.dataset.id, apps, onBack)
    })
  })

  document.querySelectorAll('.section-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.sectionId
      const section = sections.find(s => String(s.id) === sectionId)
      if (!section) return

      document.querySelectorAll('.section-nav-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      document.querySelector('#section-content-area').innerHTML =
        renderSection(section, applicationId)

      attachSectionHandlers(applicationId, sections)
    })
  })

  attachSectionHandlers(applicationId, sections)
}

function attachSectionHandlers(applicationId, sections) {

  document.querySelectorAll('.edit-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      document.querySelector(`#content-view-${id}`).classList.add('hidden')
      document.querySelector(`#content-edit-${id}`).classList.remove('hidden')
    })
  })

  document.querySelectorAll('.cancel-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      document.querySelector(`#content-view-${id}`).classList.remove('hidden')
      document.querySelector(`#content-edit-${id}`).classList.add('hidden')
    })
  })

  document.querySelectorAll('.save-section-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id
      const content = document.querySelector(`#textarea-${id}`).value

      await fetch('/api/role-prep', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content })
      })

      const section = sections.find(s => String(s.id) === id)
      if (section) section.content = content

      document.querySelector(`#content-view-${id}`).innerHTML =
        content
          ? `<div class="markdown-body">${renderMarkdown(content)}</div>`
          : `<p class="empty-section">No content yet — click Edit to add, or use the AI bar below to generate it.</p>`

      document.querySelector(`#content-view-${id}`).classList.remove('hidden')
      document.querySelector(`#content-edit-${id}`).classList.add('hidden')
    })
  })

  document.querySelectorAll('.ai-submit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sectionId = btn.dataset.sectionId
      const appId = btn.dataset.appId
      const input = document.querySelector(`.ai-input[data-section-id="${sectionId}"]`)
      const prompt = input.value.trim()
      if (!prompt) return

      btn.innerHTML = '<i class="ti ti-loader-2 spin" aria-hidden="true"></i>'
      btn.disabled = true

      const apps = await fetch('/api/applications').then(r => r.json())
      const app = apps.find(a => String(a.id) === String(appId))
      const section = sections.find(s => String(s.id) === String(sectionId))
      const currentContent = section?.content || ''

      const systemPrompt = `You are an expert interview prep and job search assistant for Lee Smith, a Senior Solutions Engineering leader based in London. Help prepare for SE leadership interviews at enterprise SaaS companies.

Role: ${app?.company} — ${app?.role_title}
Status: ${app?.status}
Section: ${section?.section_title}
Current content: ${currentContent}

Respond with the updated section content in markdown only. No preamble or explanation.`

      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            system: systemPrompt,
            section_id: sectionId,
            application_id: appId,
            write_to_db: true
          })
        })
        const data = await res.json()
        const newContent = data.text || ''

        if (section) section.content = newContent

        document.querySelector(`#content-view-${sectionId}`).innerHTML =
          `<div class="markdown-body">${renderMarkdown(newContent)}</div>`

        if (document.querySelector(`#textarea-${sectionId}`)) {
          document.querySelector(`#textarea-${sectionId}`).value = newContent
        }

        input.value = ''
      } catch(e) {
        console.error('AI error:', e)
      }

      btn.innerHTML = '<i class="ti ti-sparkles" aria-hidden="true"></i>'
      btn.disabled = false
    })
  })
}