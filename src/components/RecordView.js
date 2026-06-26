const STABILITY_BADGE = {
  PASS: 'badge-pass',
  REVIEW: 'badge-review',
  CAUTION: 'badge-caution',
  UNKNOWN: 'badge-unknown'
}

export async function openRecordView(applicationId, allApplications, onBack) {
  const app = allApplications.find(a => String(a.id) === String(applicationId))
  if (!app) return

  const prepRes = await fetch(`/api/role-prep?application_id=${applicationId}`)
  const sections = await prepRes.json()

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
        <span class="role-nav-status ${STABILITY_BADGE[a.stability_check] || 'badge-unknown'}">${a.status}</span>
      </button>
    `).join('')

  container.innerHTML = `
    <div class="record-shell">

      <aside class="record-sidebar">
        <div class="record-sidebar-top">
          <button class="back-btn" id="back-to-board">
            <i class="ti ti-arrow-left" aria-hidden="true"></i> Board
          </button>
          <div class="role-nav-list">
            ${roleNav}
          </div>
        </div>

        <nav class="section-nav">
          <p class="section-nav-label">Sections</p>
          ${sections.map(s => `
            <button class="section-nav-btn" data-section="${s.id}">
              ${s.section_title}
            </button>
          `).join('')}
        </nav>
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

        <div class="record-sections" id="record-sections">
          ${sections.map(s => `
            <section class="prep-section" id="section-${s.id}" data-section-id="${s.id}">
              <div class="prep-section-header">
                <h2>${s.section_title}</h2>
                <button class="edit-section-btn" data-id="${s.id}">
                  <i class="ti ti-edit" aria-hidden="true"></i> Edit
                </button>
              </div>
              <div class="prep-content" id="content-view-${s.id}">
                ${s.content
                  ? `<div class="markdown-body">${renderMarkdown(s.content)}</div>`
                  : `<p class="empty-section">No content yet. Click Edit to add, or ask AI to generate it.</p>`
                }
              </div>
              <div class="prep-editor hidden" id="content-edit-${s.id}">
                <textarea class="section-textarea" id="textarea-${s.id}">${s.content || ''}</textarea>
                <div class="editor-actions">
                  <button class="save-section-btn btn-primary" data-id="${s.id}">Save</button>
                  <button class="cancel-section-btn btn-ghost" data-id="${s.id}">Cancel</button>
                </div>
              </div>

              <div class="ai-bar">
                <input
                  class="ai-input"
                  type="text"
                  placeholder="Ask AI about this section..."
                  data-section-id="${s.id}"
                  data-app-id="${applicationId}"
                />
                <button class="ai-submit-btn" data-section-id="${s.id}" data-app-id="${applicationId}">
                  <i class="ti ti-sparkles" aria-hidden="true"></i>
                </button>
              </div>
            </section>
          `).join('')}
        </div>
      </main>

    </div>
  `

  attachRecordHandlers(allApplications, onBack)
}

function renderMarkdown(text) {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '')
    .trim()
}

function attachRecordHandlers(allApplications, onBack) {
  document.querySelector('#back-to-board')?.addEventListener('click', () => {
    document.querySelector('#record-view').classList.add('hidden')
    document.querySelector('#main-content').classList.remove('hidden')
    if (onBack) onBack()
  })

  document.querySelectorAll('.role-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openRecordView(btn.dataset.id, allApplications, onBack)
    })
  })

  document.querySelectorAll('.section-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(`#section-${btn.dataset.section}`)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

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
      document.querySelector(`#content-view-${id}`).innerHTML =
        content
          ? `<div class="markdown-body">${renderMarkdown(content)}</div>`
          : `<p class="empty-section">No content yet. Click Edit to add, or ask AI to generate it.</p>`
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

      btn.innerHTML = '<i class="ti ti-loader-2" aria-hidden="true"></i>'
      btn.disabled = true

      const app = await fetch('/api/applications').then(r => r.json()).then(apps => apps.find(a => String(a.id) === String(appId)))
      const sections = await fetch(`/api/role-prep?application_id=${appId}`).then(r => r.json())
      const section = sections.find(s => String(s.id) === String(sectionId))
      const currentContent = document.querySelector(`#textarea-${sectionId}`)?.value || section?.content || ''

      const systemPrompt = `You are an expert job search and interview prep assistant for Lee Smith, a Senior Solutions Engineering leader in London. You help prepare for SE leadership interviews at enterprise SaaS companies.

Current role: ${app?.company} — ${app?.role_title}
Current section: ${section?.section_title}
Current content: ${currentContent}

Respond with the updated section content in markdown format only. No preamble, no explanation — just the content that should go in this section.`

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }]
          })
        })
        const data = await res.json()
        const newContent = data.content?.[0]?.text || ''

        await fetch('/api/role-prep', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: sectionId, content: newContent })
        })

        document.querySelector(`#content-view-${sectionId}`).innerHTML =
          `<div class="markdown-body">${renderMarkdown(newContent)}</div>`

        if (document.querySelector(`#textarea-${sectionId}`)) {
          document.querySelector(`#textarea-${sectionId}`).value = newContent
        }

        input.value = ''
      } catch (e) {
        console.error('AI error:', e)
      }

      btn.innerHTML = '<i class="ti ti-sparkles" aria-hidden="true"></i>'
      btn.disabled = false
    })
  })
}