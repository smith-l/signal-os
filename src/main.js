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

async function getApplications() {
  const response = await fetch('/api/applications')
  return await response.json()
}

async function updateApplication(application) {
  await fetch('/api/applications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  })
}

async function updateApplicationStatus(id, status) {
  const applications = await getApplications()
  const application = applications.find(app => String(app.id) === String(id))

  if (!application) return

  application.status = status
  await updateApplication(application)
  await renderApp()
}

async function openApplicationPanel(id) {
  const applications = await getApplications()
  const application = applications.find(app => String(app.id) === String(id))

  if (!application) return

  const panel = document.querySelector('#application-panel')
  const content = document.querySelector('#application-panel-content')

  content.innerHTML = `
    <h2>${application.company}</h2>
    <p>${application.role_title}</p>

    <label>Company</label>
    <input id="panel-company" value="${application.company || ''}" />

    <label>Role</label>
    <input id="panel-role" value="${application.role_title || ''}" />

    <label>Status</label>
    <select id="panel-status">
      ${['Applied', 'Prep', 'Hiring Manager', 'Panel', 'Offer', 'Closed'].map(status => `
        <option value="${status}" ${status === application.status ? 'selected' : ''}>
          ${status}
        </option>
      `).join('')}
    </select>

    <label>Recruiter</label>
    <input id="panel-recruiter" value="${application.recruiter || ''}" />

    <label>Salary</label>
    <input id="panel-salary" value="${application.salary || ''}" />

    <label>Location</label>
    <input id="panel-location" value="${application.location || ''}" />

    <label>Job Link</label>
    <input id="panel-job-link" value="${application.job_link || ''}" />

    <label>Next Action</label>
    <input id="panel-next-action" value="${application.next_action || ''}" />

    <label>Notes</label>
    <textarea id="panel-notes">${application.notes || ''}</textarea>

    <button id="save-panel" class="panel-save">Save Changes</button>
  `

  panel.classList.remove('hidden')

  document.querySelector('#save-panel').addEventListener('click', async () => {
    await updateApplication({
      id: application.id,
      company: document.querySelector('#panel-company').value,
      role_title: document.querySelector('#panel-role').value,
      status: document.querySelector('#panel-status').value,
      recruiter: document.querySelector('#panel-recruiter').value,
      salary: document.querySelector('#panel-salary').value,
      location: document.querySelector('#panel-location').value,
      job_link: document.querySelector('#panel-job-link').value,
      next_action: document.querySelector('#panel-next-action').value,
      notes: document.querySelector('#panel-notes').value
    })

    await renderApp()
  })
}

function attachModuleHandlers() {
  const addButton = document.querySelector('#add-application-btn')
  const form = document.querySelector('#application-form')
  const saveButton = document.querySelector('#save-application')
  const closePanel = document.querySelector('#close-panel')

  if (addButton && form) {
    addButton.addEventListener('click', () => {
      form.style.display = 'block'
    })
  }

  if (closePanel) {
    closePanel.addEventListener('click', () => {
      document.querySelector('#application-panel').classList.add('hidden')
    })
  }

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

  document.querySelectorAll('.application-card').forEach(card => {
    card.addEventListener('click', async event => {
      if (event.target.tagName === 'SELECT') return
      await openApplicationPanel(card.dataset.id)
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