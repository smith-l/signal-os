import { marked } from 'marked'

// ── Story bank cache (application-only feature) ───────────────────────────────
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

function splitIntoCards(content) {
  if (!content) return []
  const cleaned = cleanContent(content)
  const chunks = cleaned.split(/^(?=## )/m).filter(c => c.trim())
  return chunks
}

function renderSection(section, recordId) {
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
          data-record-id="${recordId}"
        />
        <button class="ai-submit-btn" data-section-id="${section.id}" data-record-id="${recordId}">
          <i class="ti ti-sparkles" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `
}

function renderEditField(record, field) {
  const value = record[field.key] || ''
  if (field.type === 'select') {
    return `
      <label>${field.label}</label>
      <select id="edit-${field.key}">
        ${field.options.map(o => `<option value="${o}" ${value === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    `
  }
  if (field.type === 'textarea') {
    return `
      <label>${field.label}</label>
      <textarea id="edit-${field.key}" rows="4">${value}</textarea>
    `
  }
  return `
    <label>${field.label}</label>
    <input id="edit-${field.key}" type="text" value="${value}" />
  `
}

function renderEditPanel(record, config) {
  return `
    <div class="app-edit-panel hidden" id="app-edit-panel">
      <div class="app-edit-header">
        <h3>Edit ${config.label}</h3>
        <button class="app-edit-close" id="app-edit-close">✕</button>
      </div>
      <div class="app-edit-body">
        ${config.editFields.map(f => renderEditField(record, f)).join('')}
      </div>
      <div class="app-edit-footer">
        <button class="btn-primary" id="app-edit-save">Save</button>
        <button class="btn-ghost" id="app-edit-cancel">Cancel</button>
      </div>
    </div>
    <div class="sidebar-backdrop" id="app-edit-backdrop"></div>
  `
}

function renderRecordHeader(record, config) {
  const stage = record[config.stageField]
  const badgeValue = config.badge ? record[config.badge.field] : null
  return `
    <div class="record-header" id="record-header">
      <div>
        <p class="eyebrow">${stage}</p>
        <h1 class="record-title">${record[config.titleField] || ''}</h1>
        ${record[config.subtitleField] ? `<p class="record-role">${record[config.subtitleField]}</p>` : ''}
        ${record.recruiter ? `<p class="record-recruiter"><i class="ti ti-user" aria-hidden="true"></i> ${record.recruiter}</p>` : ''}
        ${record.applied_date ? `<p class="record-applied"><i class="ti ti-calendar" aria-hidden="true"></i> Applied ${record.applied_date}</p>` : ''}
      </div>
      <div class="record-meta">
        ${badgeValue ? `<span class="stability-badge ${config.badge.classMap[badgeValue] || 'badge-unknown'}">${badgeValue}</span>` : ''}
        ${record.salary ? `<span class="record-salary">${record.salary}</span>` : ''}
        <button class="edit-app-btn ql-btn" id="edit-app-btn">
          <i class="ti ti-edit" aria-hidden="true"></i> Edit
        </button>
      </div>
    </div>
  `
}

export async function openRecordView(recordId, allRecords, onBack, config) {
  const record = allRecords.find(r => String(r.id) === String(recordId))
  if (!record) return

  const sections = await fetch(`${config.prepApiBase}?${config.prepIdParam}=${recordId}`)
    .then(r => r.json())

  const container = document.querySelector('#record-view')
  container.classList.remove('hidden')
  document.querySelector('#main-content').classList.add('hidden')

  const activeStages = new Set(config.activeStages || config.stages)
  const roleNav = allRecords
    .filter(r => activeStages.has(r[config.stageField]))
    .map(r => `
      <button
        class="role-nav-btn ${String(r.id) === String(recordId) ? 'active' : ''}"
        data-id="${r.id}"
      >
        <span class="role-nav-company">${r[config.titleField]}</span>
        <span class="role-nav-status">${r[config.stageField]}</span>
      </button>
    `).join('')

  const firstSection = sections[0]
  const quickLinksHtml = (config.quickLinks || [])
    .filter(ql => record[ql.field])
    .map(ql => `<a href="${record[ql.field]}" class="ql-btn" target="_blank"><i class="ti ti-external-link" aria-hidden="true"></i> ${ql.label}</a>`)
    .join('')

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
        ${renderRecordHeader(record, config)}
        ${renderEditPanel(record, config)}

        ${quickLinksHtml ? `<div class="record-quick-links">${quickLinksHtml}</div>` : ''}

        <div id="section-content-area">
          ${firstSection ? renderSection(firstSection, recordId) : '<p class="empty-section">No sections found.</p>'}
        </div>
      </main>

    </div>
  `

  attachRecordHandlers(recordId, allRecords, sections, onBack, config)
}

function attachEditPanelHandlers(recordId, allRecords, onBack, config) {
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
    const updates = { id: Number(recordId) }
    config.editFields.forEach(f => {
      updates[f.key] = document.querySelector(`#edit-${f.key}`).value
    })

    await fetch(config.apiBase, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    closePanel()

    const records = await fetch(config.apiBase).then(r => r.json())
    const updatedRecord = records.find(r => String(r.id) === String(recordId))
    if (updatedRecord) {
      document.querySelector('#record-header').outerHTML = renderRecordHeader(updatedRecord, config)
      attachEditPanelHandlers(recordId, records, onBack, config)
    }
  })
}

function attachRecordHandlers(recordId, allRecords, sections, onBack, config) {

  document.querySelector('#back-to-board')?.addEventListener('click', () => {
    document.querySelector('#record-view').classList.add('hidden')
    document.querySelector('#main-content').classList.remove('hidden')
    if (onBack) onBack()
  })

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
      const records = await fetch(config.apiBase).then(r => r.json())
      await openRecordView(btn.dataset.id, records, onBack, config)
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
        renderSection(section, recordId)

      attachSectionHandlers(recordId, sections, allRecords, config)

      recordSidebarEl?.classList.remove('open')
      recordBackdrop?.classList.remove('visible')
    })
  })

  attachEditPanelHandlers(recordId, allRecords, onBack, config)
  attachSectionHandlers(recordId, sections, allRecords, config)
}

function attachSectionHandlers(recordId, sections, allRecords, config) {

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

      await fetch(config.prepApiBase, {
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
      const recId = btn.dataset.recordId
      const input = document.querySelector(`.ai-input[data-section-id="${sectionId}"]`)
      const prompt = input.value.trim()
      if (!prompt) return

      btn.innerHTML = '<i class="ti ti-loader-2 spin" aria-hidden="true"></i>'
      btn.disabled = true

      const records = await fetch(config.apiBase).then(r => r.json())
      const record = records.find(r => String(r.id) === String(recId))
      const section = sections.find(s => String(s.id) === String(sectionId))
      const currentContent = section?.content || ''

      const systemPrompt = config.aiSystemPrompt(record, { ...section, content: currentContent })

      try {
        const res = await fetch(config.aiApiBase, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            system: systemPrompt,
            section_id: sectionId,
            [config.idParam]: recId,
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

  if (config.enableStoryBank) attachStoryTableHandlers()
}