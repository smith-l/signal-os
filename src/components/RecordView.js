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

const STATUSES = ['Applied', 'TA Screen', 'HM Interview', 'Peer', 'Panel', 'Offer', 'Closed']
const STABILITY_OPTIONS = ['PASS', 'REVIEW', 'CAUTION', 'UNKNOWN']

import { marked } from 'marked'

// ── Story bank cache ──────────────────────────────────────────────────────────
let storyBankCache = null

async function getStoryBank() {
  if (storyBankCache) return storyBankCache
  try {
    const res = await fetch('/api/knowledge-base')
    const data = await res.json()
    const storiesSection = data.find(s => s.section_key === 'stories')
    const content = storiesSection?.content || ''
    const stories = content
      .split(/^(?=## )/m)
      .filter(s => s.trim())
      .map(s => ({ raw: s.trim(), title: (s.match(/^## (.+)/m) || [])[1]?.trim() || '' }))
    storyBankCache = stories
    return stories
  } catch(e) {
    console.error('Story bank fetch error:', e)
    return []
  }
}

function findStory(stories, ref) {
  if (!ref) return null
  const r = ref.toLowerCase()
  const numMatch = r.match(/story\s*(\d+)/)
  if (numMatch) {
    const num = numMatch[1]
    const found = stories.find(s => s.title.toLowerCase().includes(`story ${num} `) || s.title.match(new RegExp(`^story ${num}\\b`, 'i')))
    if (found) return found
  }
  return stories.find(s => s.title.toLowerCase().includes(r.substring(0, 15))) || null
}

function attachStoryTableHandlers() {
  document.querySelectorAll('.markdown-body table').forEach(table => {
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim().toLowerCase())
    const storyColIndex = headers.findIndex(h => h.includes('story') || h.includes('best story'))
    if (storyColIndex === -1) return

    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.cursor = 'pointer'
      row.title = 'Click to read story in full'

      row.addEventListener('click', async () => {
        const next = row.nextElementSibling
        if (next?.classList.contains('story-expansion-row')) {
          next.remove()
          row.classList.remove('story-row-active')
          return
        }
        table.querySelectorAll('.story-expansion-row').forEach(r => r.remove())
        table.querySelectorAll('tr.story-row-active').forEach(r => r.classList.remove('story-row-active'))

        const storyRef = row.querySelectorAll('td')[storyColIndex]?.textContent?.trim()
        if (!storyRef) return

        const expansionRow = document.createElement('tr')
        expansionRow.classList.add('story-expansion-row')
        expansionRow.innerHTML = `<td colspan="99" class="story-expansion-cell">
          <div class="story-expansion-loading"><i class="ti ti-loader-2 spin"></i> Loading...</div>
        </td>`
        row.insertAdjacentElement('afterend', expansionRow)
        row.classList.add('story-row-active')

        const stories = await getStoryBank()
        const story = findStory(stories, storyRef)

        if (!story) {
          expansionRow.querySelector('td').innerHTML = `
            <div class="story-expansion">
              <span style="color:var(--ink-faint);font-style:italic">Story not found — reference: "${storyRef}"</span>
            </div>`
          return
        }

        expansionRow.querySelector('td').innerHTML = `
          <div class="story-expansion">
            <div class="story-expansion-header">
              <span class="story-expansion-label">Story Bank</span>
              <button class="story-expansion-close">✕ Close</button>
            </div>
            <div class="markdown-body story-expansion-body">${marked.parse(story.raw, { breaks: true, gfm: true })}</div>
          </div>`

        expansionRow.querySelector('.story-expansion-close').addEventListener('click', e => {
          e.stopPropagation()
          expansionRow.remove()
          row.classList.remove('story-row-active')
        })
      })
    })
  })
}

function cleanContent(text) {
  if (!text) return ''
  return text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
}

function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(cleanContent(text), { breaks: true, gfm: true })
}

function splitIntoCards(content) {
  if (!content) return []
  const cleaned = cleanContent(content)
  const chunks = cleaned.split(/^(?=## )/m).filter(c => c.trim())
  return chunks
}

function renderSection(section, appId) {
  const chunks = splitIntoCards(section.content)

  const contentHtml = chunks.length > 0
    ? chunks.map(chunk => `
        <div class="content-card">
          <div class="markdown-body">${marked.parse(chunk.trim(), { breaks: true, gfm: true })}</div>
        </div>
      `).join('')
    : `<div class="content-card"><p class="empty-section">No content yet — click Edit to add, or use the AI bar below to generate it.</p></div>`

  return `
    <div class="section-page" id="section-page-${section.id}">
      <div class="prep-section-header">
        <h2>${section.section_title}</h2>
        <button class="edit-section-btn" data-id="${section.id}">
          <i class="ti ti-edit" aria-hidden="true"></i> Edit
        </button>
      </div>

      <div class="prep-content" id="content-view-${section.id}">
        ${contentHtml}
      </div>

      <div class="prep-editor hidden" id="content-edit-${section.id}">
        <textarea class="section-textarea" id="textarea-${section.id}">${cleanContent(section.content || '')}</textarea>
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

function renderEditPanel(app) {
  return `
    <div class="app-edit-panel hidden" id="app-edit-panel">
      <div class="app-edit-header">
        <h3>Edit Application</h3>
        <button class="app-edit-close" id="app-edit-close">✕</button>
      </div>
      <div class="app-edit-body">
        <label>Company</label>
        <input id="edit-company" type="text" value="${app.company || ''}" />

        <label>Role Title</label>
        <input id="edit-role" type="text" value="${app.role_title || ''}" />

        <label>Status</label>
        <select id="edit-status">
          ${STATUSES.map(s => `<option value="${s}" ${app.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>

        <label>Recruiter</label>
        <input id="edit-recruiter" type="text" value="${app.recruiter || ''}" />

        <label>Salary / Package</label>
        <input id="edit-salary" type="text" value="${app.salary || ''}" />

        <label>Stability</label>
        <select id="edit-stability">
          ${STABILITY_OPTIONS.map(s => `<option value="${s}" ${app.stability_check === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>

        <label>Next Action</label>
        <textarea id="edit-next-action" rows="2">${app.next_action || ''}</textarea>

        <label>Job Link</label>
        <input id="edit-job-link" type="text" value="${app.job_link || ''}" />

        <label>Applied Date</label>
        <input id="edit-applied-date" type="text" placeholder="e.g. 8 June 2026" value="${app.applied_date || ''}" />

        <label>Notes</label>
        <textarea id="edit-notes" rows="4">${app.notes || ''}</textarea>
      </div>
      <div class="app-edit-footer">
        <button class="btn-primary" id="app-edit-save">Save</button>
        <button class="btn-ghost" id="app-edit-cancel">Cancel</button>
      </div>
    </div>
    <div class="sidebar-backdrop" id="app-edit-backdrop"></div>
  `
}

function renderRecordHeader(app) {
  return `
    <div class="record-header" id="record-header">
      <div>
        <p class="eyebrow">${app.status}</p>
        <h1 class="record-title">${app.company}</h1>
        <p class="record-role">${app.role_title}</p>
        ${app.recruiter ? `<p class="record-recruiter"><i class="ti ti-user" aria-hidden="true"></i> ${app.recruiter}</p>` : ''}
        ${app.applied_date ? `<p class="record-applied"><i class="ti ti-calendar" aria-hidden="true"></i> Applied ${app.applied_date}</p>` : ''}
      </div>
      <div class="record-meta">
        ${app.stability_check ? `<span class="stability-badge ${STABILITY_BADGE[app.stability_check] || 'badge-unknown'}">${app.stability_check}</span>` : ''}
        ${app.salary ? `<span class="record-salary">${app.salary}</span>` : ''}
        <button class="edit-app-btn ql-btn" id="edit-app-btn">
          <i class="ti ti-edit" aria-hidden="true"></i> Edit
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
    <button class="mobile-menu-toggle record-mobile-toggle" id="record-mobile-toggle" aria-label="Open menu">
      <i class="ti ti-menu-2" aria-hidden="true"></i>
    </button>
    <div class="sidebar-backdrop" id="record-sidebar-backdrop"></div>
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
        ${renderRecordHeader(app)}
        ${renderEditPanel(app)}

        ${app.job_link ? `
          <div class="record-quick-links">
            <a href="${app.job_link}" class="ql-btn" target="_blank"><i class="ti ti-external-link" aria-hidden="true"></i> Job Description</a>
          </div>
        ` : ''}

        <div id="section-content-area">
          ${firstSection ? renderSection(firstSection, applicationId) : '<p class="empty-section">No sections found.</p>'}
        </div>
      </main>

    </div>
  `

  attachRecordHandlers(applicationId, allApplications, sections, onBack)
}

function attachEditPanelHandlers(applicationId, allApplications, onBack) {
  const panel = document.querySelector('#app-edit-panel')
  const backdrop = document.querySelector('#app-edit-backdrop')

  const openPanel = () => {
    panel.classList.remove('hidden')
    backdrop.classList.add('visible')
  }

  const closePanel = () => {
    panel.classList.add('hidden')
    backdrop.classList.remove('visible')
  }

  document.querySelector('#edit-app-btn')?.addEventListener('click', openPanel)
  document.querySelector('#app-edit-close')?.addEventListener('click', closePanel)
  document.querySelector('#app-edit-cancel')?.addEventListener('click', closePanel)
  backdrop?.addEventListener('click', closePanel)

  document.querySelector('#app-edit-save')?.addEventListener('click', async () => {
    const updates = {
      id: Number(applicationId),
      company:        document.querySelector('#edit-company').value,
      role_title:     document.querySelector('#edit-role').value,
      status:         document.querySelector('#edit-status').value,
      recruiter:      document.querySelector('#edit-recruiter').value,
      salary:         document.querySelector('#edit-salary').value,
      stability_check:document.querySelector('#edit-stability').value,
      next_action:    document.querySelector('#edit-next-action').value,
      job_link:       document.querySelector('#edit-job-link').value,
      applied_date:   document.querySelector('#edit-applied-date').value,
      notes:          document.querySelector('#edit-notes').value,
    }

    await fetch('/api/applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    closePanel()

    // Re-render header with updated values
    const apps = await fetch('/api/applications').then(r => r.json())
    const updatedApp = apps.find(a => String(a.id) === String(applicationId))
    if (updatedApp) {
      document.querySelector('#record-header').outerHTML = renderRecordHeader(updatedApp)
      // Re-attach edit button
      attachEditPanelHandlers(applicationId, allApplications, onBack)
    }
  })
}

function attachRecordHandlers(applicationId, allApplications, sections, onBack) {

  document.querySelector('#back-to-board')?.addEventListener('click', () => {
    document.querySelector('#record-view').classList.add('hidden')
    document.querySelector('#main-content').classList.remove('hidden')
    if (onBack) onBack()
  })

  // Mobile record sidebar toggle
  const recordToggle = document.querySelector('#record-mobile-toggle')
  const recordBackdrop = document.querySelector('#record-sidebar-backdrop')
  const recordSidebarEl = document.querySelector('.record-sidebar')

  if (recordToggle && recordSidebarEl) {
    recordToggle.addEventListener('click', () => {
      recordSidebarEl.classList.toggle('open')
      recordBackdrop?.classList.toggle('visible')
    })
  }
  if (recordBackdrop) {
    recordBackdrop.addEventListener('click', () => {
      recordSidebarEl?.classList.remove('open')
      recordBackdrop.classList.remove('visible')
    })
  }

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

      recordSidebarEl?.classList.remove('open')
      recordBackdrop?.classList.remove('visible')
    })
  })

  attachEditPanelHandlers(applicationId, allApplications, onBack)
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

      const chunks = splitIntoCards(content)
      const contentHtml = chunks.length > 0
        ? chunks.map(chunk => `
            <div class="content-card">
              <div class="markdown-body">${marked.parse(chunk.trim(), { breaks: true, gfm: true })}</div>
            </div>
          `).join('')
        : `<div class="content-card"><p class="empty-section">No content yet.</p></div>`

      document.querySelector(`#content-view-${id}`).innerHTML = contentHtml
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

Respond with the COMPLETE updated section in markdown — preserve all existing content and add or update only what the user has asked for. Do not remove anything unless explicitly asked to. No preamble or explanation.`

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

        const chunks = splitIntoCards(newContent)
        const contentHtml = chunks.length > 0
          ? chunks.map(chunk => `
              <div class="content-card">
                <div class="markdown-body">${marked.parse(chunk.trim(), { breaks: true, gfm: true })}</div>
              </div>
            `).join('')
          : `<div class="content-card"><p class="empty-section">No content yet.</p></div>`

        document.querySelector(`#content-view-${sectionId}`).innerHTML = contentHtml

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

  attachStoryTableHandlers()
}