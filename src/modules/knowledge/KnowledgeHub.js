import { marked } from 'marked'

export async function KnowledgeHub(activeKbId) {
  const res = await fetch('/api/knowledge-base')
  const sections = await res.json()

  const activeSection = activeKbId
    ? sections.find(s => String(s.id) === String(activeKbId))
    : sections[0]

  return `
    <header class="page-header">
      <div class="page-header-left">
        <p class="eyebrow">Signal OS</p>
        <h2>${activeSection?.section_title || 'Knowledge Hub'}</h2>
      </div>
    </header>

    <div id="knowledge-content" class="knowledge-content">
      ${activeSection ? renderKBSection(activeSection) : '<p class="empty-section">No content yet.</p>'}
    </div>
  `
}

function renderKBSection(section) {
  if (!section.content) {
    return `
      <div class="content-card">
        <div class="kb-section-header">
          <h2>${section.section_title}</h2>
          <button class="edit-section-btn" data-kb-id="${section.id}">
            <i class="ti ti-edit" aria-hidden="true"></i> Edit
          </button>
        </div>
        <p class="empty-section">No content yet.</p>
      </div>
      <div class="prep-editor hidden" id="kb-edit-${section.id}">
        <textarea class="section-textarea" id="kb-textarea-${section.id}"></textarea>
        <div class="editor-actions">
          <button class="kb-save-btn btn-primary" data-kb-id="${section.id}">Save</button>
          <button class="kb-cancel-btn btn-ghost" data-kb-id="${section.id}">Cancel</button>
        </div>
      </div>
    `
  }

  const chunks = section.content.split(/^(?=## )/m)

  const cards = chunks.map(chunk => {
    const html = marked.parse(chunk.trim(), { breaks: true, gfm: true })
    return `<div class="content-card"><div class="markdown-body">${html}</div></div>`
  }).join('')

  return `
    <div class="kb-section-header">
      <h2>${section.section_title}</h2>
      <button class="edit-section-btn" data-kb-id="${section.id}">
        <i class="ti ti-edit" aria-hidden="true"></i> Edit
      </button>
    </div>
    <div class="prep-content" id="kb-view-${section.id}">
      ${cards}
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

        const chunks = content.split(/^(?=## )/m)
        const cards = chunks.map(chunk => {
          const html = marked.parse(chunk.trim(), { breaks: true, gfm: true })
          return `<div class="content-card"><div class="markdown-body">${html}</div></div>`
        }).join('')

        document.querySelector(`#kb-view-${id}`).innerHTML = cards
        document.querySelector(`#kb-view-${id}`).classList.remove('hidden')
        document.querySelector(`#kb-edit-${id}`).classList.add('hidden')
      })
    }
  })
}