import './style.css'

import { Applications } from './modules/career/Applications.js'
import { Playbooks } from './modules/playbooks/Playbooks.js'
import { Tasks } from './modules/tasks/Tasks.js'
import { Projects } from './modules/projects/Projects.js'
import { KnowledgeHub, attachKnowledgeHandlers } from './modules/knowledge/KnowledgeHub.js'

import {
  getApplications,
  updateApplication,
  createApplication
} from './services/applicationService.js'

import {
  openRecordView
} from './components/RecordView.js'

import {
  AppShell
} from './components/AppShell.js'

let currentModule = 'career'
let draggedCardId = null

async function renderModule() {
  if (currentModule === 'career') return await Applications()
  if (currentModule === 'playbooks') return await Playbooks()
  if (currentModule === 'tasks') return Tasks()
  if (currentModule === 'projects') return Projects()
  if (currentModule === 'knowledge') return await KnowledgeHub()
  return await Applications()
}

async function updateApplicationStatus(id, status) {
  const applications = await getApplications()
  const application = applications.find(app => String(app.id) === String(id))
  if (!application) return
  application.status = status
  await updateApplication(application)
  await renderApp()
}

function attachModuleHandlers() {
  const addButton = document.querySelector('#add-application-btn')
  const saveButton = document.querySelector('#save-application')
  const closePanel = document.querySelector('#close-panel')

  if (addButton) {
    addButton.addEventListener('click', () => {
      document.querySelector('#application-form').style.display = 'block'
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
      if (!company || !role) { alert('Please enter a company and role'); return }
      await createApplication({ company, role_title: role, status: 'Applied' })
      await renderApp()
    })
  }

  // Playbook handlers — event delegation
  if (currentModule === 'playbooks') {
    document.querySelector('#module-content')?.addEventListener('click', e => {
      const card = e.target.closest('.playbook-card')
      const backBtn = e.target.closest('#playbook-back')

      if (card) {
        import('./modules/playbooks/Playbooks.js').then(({ openPlaybook }) => {
          openPlaybook(card.dataset.key)
        })
      }

      if (backBtn) {
        import('./modules/playbooks/Playbooks.js').then(({ closePlaybook }) => {
          closePlaybook()
        })
      }
    })
  }

  // Knowledge Hub handlers
  if (currentModule === 'knowledge') {
    fetch('/api/knowledge-base').then(r => r.json()).then(sections => {
      attachKnowledgeHandlers(sections)
    })
  }

  document.querySelectorAll('.application-card').forEach(card => {
    card.addEventListener('click', async event => {
      if (event.target.tagName === 'A') return
      const applications = await getApplications()
      await openRecordView(card.dataset.id, applications, renderApp)
    })
  })

  document.querySelectorAll('.open-record-btn').forEach(btn => {
    btn.addEventListener('click', async event => {
      event.stopPropagation()
      const applications = await getApplications()
      await openRecordView(btn.dataset.id, applications, renderApp)
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
    zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over') })
    zone.addEventListener('drop', async event => {
      event.preventDefault()
      zone.classList.remove('drag-over')
      if (!draggedCardId) return
      await updateApplicationStatus(draggedCardId, zone.dataset.status)
    })
  })
}

async function renderApp() {
  document.querySelector('#app').innerHTML = AppShell(currentModule)
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