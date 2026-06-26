import { marked } from 'marked'

export async function KnowledgeHub() {
  const res = await fetch('/api/knowledge-base')
  const sections = await res.json()

  return `
    <header class="page-header">
      <div class="page-header-left">
        <p class="eyebrow">Signal OS</p>
        <h2>Knowledge Hub</h2>
      </div>
    </header>

    <div class="knowledge-shell">
      <nav class="knowledge-nav">
        ${sections.map((s, i) => `
          <button
            class="section-nav-btn ${i === 0 ? 'active' : ''}"
            data-kb-id="${s.id}"
          >
            ${s.section_title}
          </button>
        `).join('')}
      </nav>

      <div id="knowledge-content" class="knowledge-content">
        ${sections[0] ? renderKBSection(sections[0]) : '<p class="empty-section">No content yet.</p>'}
      </div>
    </div>
  `
}

function renderKBSection(section) {
  const html = section.content
    ? marked.parse(section.content, { breaks: true, gfm: true })
    : '<p class="empty-section">No content yet.</p>'

  return `
    <div class="kb-section-header">
      <h2>${section.section_title}</h2>
      <button class="edit-section-btn" data-kb-id="${section.id}">
        <i class="ti ti-edit" aria-hidden="true"></i> Edit
      </button>
    </div>
    <div class="prep-content" id="kb-view-${section.id}">
      <div class="markdown-body">${html}</div>
    </div>
    <div class="prep-editor hidden" id="kb-edit-${section.id}">
      <textarea class="section-textarea" id="kb-textarea-${section.id}">${section.content || ''}</textarea>
      <div class="editor-actions">
        <button class="kb-save-btn btn-primary" data-kb-id="${section.id}">Save</button>
        <button class="kb-cancel-btn btn-ghost" data-kb-id="${section.id}">Cancel</button>
      </div>
    </div>
  `
}

export function attachKnowledgeHandlers(sections) {
  document.querySelectorAll('[data-kb-id]').forEach(btn => {
    if (btn.classList.contains('section-nav-btn')) {
      btn.addEventListener('click', () => {
        const id = btn.dataset.kbId
        const section = sections.find(s => String(s.id) === id)
        if (!section) return
        document.querySelectorAll('.section-nav-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        document.querySelector('#knowledge-content').innerHTML = renderKBSection(section)
        attachKnowledgeHandlers(sections)
      })
    }

    if (btn.classList.contains('edit-section-btn')) {
      btn.addEventListener('click', () => {
        const id = btn.dataset.kbId
        document.querySelector(`#kb-view-${id}`).classList.add('hidden')
        document.querySelector(`#kb-edit-${id}`).classList.remove('hidden')
      })
    }

    if (btn.classList.contains('kb-cancel-btn')) {
      btn.addEventListener('click', () => {
        const id = btn.dataset.kbId
        document.querySelector(`#kb-view-${id}`).classList.remove('hidden')
        document.querySelector(`#kb-edit-${id}`).classList.add('hidden')
      })
    }

    if (btn.classList.contains('kb-save-btn')) {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.kbId
        const content = document.querySelector(`#kb-textarea-${id}`).value
        await fetch('/api/knowledge-base', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, content })
        })
        const section = sections.find(s => String(s.id) === id)
        if (section) section.content = content
        document.querySelector(`#kb-view-${id}`).innerHTML =
          `<div class="markdown-body">${marked.parse(content, { breaks: true, gfm: true })}</div>`
        document.querySelector(`#kb-view-${id}`).classList.remove('hidden')
        document.querySelector(`#kb-edit-${id}`).classList.add('hidden')
      })
    }
  })
}