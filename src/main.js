import './style.css'

import { Applications } from './modules/career/Applications.js'
import { Tasks } from './modules/tasks/Tasks.js'
import { Projects } from './modules/projects/Projects.js'
import { Knowledge } from './modules/knowledge/Knowledge.js'

let currentModule = 'career'
let draggedCardId = null

async function renderModule() {
  if (currentModule === 'career') return await Applications()
  if (currentModule === 'tasks') return Tasks()
  if (currentModule === 'projects') return Projects()
  if (currentModule === 'knowledge') return Knowledge()
  return await Applications()
}

function attachModuleHandlers() {
  const saveButton = document.querySelector('#save-application')

  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      const company = document.querySelector('#company').value
      const role = document.querySelector('#role').value

      if (!company || !role) {
        alert('Please enter a company and role')
        return
      }

      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role_title: role, status: 'Applied' })
      })

      await renderApp()
    })
  }

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async () => {
      await updateApplicationStatus(select.dataset.id, select.value)
    })
  })

  document.querySelectorAll('.draggable-card').forEach(card => {
    card.addEventListener('dragstart', () => {
      draggedCardId = card.dataset.id
      card.classList.add('dragging')
    })

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging')
      draggedCardId = null
    })
  })

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', event => {
      event.preventDefault()
      zone.classList.add('drag-over')
    })

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over')
    })

    zone.addEventListener('drop', async event => {
      event.preventDefault()
      zone.classList.remove('drag-over')

      if (!draggedCardId) return

      await updateApplicationStatus(draggedCardId, zone.dataset.status)
    })
  })
}

async function updateApplicationStatus(id, status) {
  await fetch('/api/applications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status })
  })

  await renderApp()
}

async function renderApp() {
  document.querySelector('#app').innerHTML = `
    <main class="app-shell">
      <aside class="sidebar">
        <h1>Signal OS</h1>
        <nav>
          <button data-module="career" class="${currentModule === 'career' ? 'active' : ''}">Career Hub</button>
          <button data-module="tasks" class="${currentModule === 'tasks' ? 'active' : ''}">Task Hub</button>
          <button data-module="projects" class="${currentModule === 'projects' ? 'active' : ''}">Project Hub</button>
          <button data-module="knowledge" class="${currentModule === 'knowledge' ? 'active' : ''}">Knowledge Hub</button>
        </nav>
      </aside>

      <section class="main-panel">
        <div id="module-content">Loading...</div>
      </section>
    </main>
  `

  document.querySelector('#module-content').innerHTML = await renderModule()

  document.querySelectorAll('[data-module]').forEach(button => {
    button.addEventListener('click', async () => {
      currentModule = button.dataset.module
      await renderApp()
    })
  })

  attachModuleHandlers()
}

renderApp()