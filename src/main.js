import './style.css'

import { Applications } from './modules/career/Applications.js'
import { Playbooks, openPlaybook, closePlaybook } from './modules/playbooks/Playbooks.js'
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

// Expose playbook functions globally for inline onclick handlers
window.__openPlaybook = openPlaybook
window.__closePlaybook = closePlaybook

let currentModule = 'career'
let activeKbId = null
let draggedCardId = null

async function renderModule() {
  if (currentModule === 'career') return await Applications()
  if (currentModule === 'playbooks') return await Playbooks()
  if (currentModule === 'projects') return Projects()
  if (currentModule === 'knowledge') return await KnowledgeHub(activeKbId)
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

  // Knowledge Hub handlers
  if (currentModule === 'knowledge') {
    fetch('/api/knowledge-base').then(r => r.json()).then(sections => {
      attachKnowledgeHandlers(sections)
    })
  }

  // Sidebar nested KB nav — section click
  document.querySelectorAll('[data-kb-nav-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      activeKbId = btn.dataset.kbNavId
      await renderApp()
    })
  })

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
  document.querySelector('#app').innerHTML = await AppShell(currentModule, activeKbId)
  document.querySelector('#module-content').innerHTML = await renderModule()

  // Mobile sidebar toggle
  const menuToggle = document.querySelector('#mobile-menu-toggle')
  const backdrop = document.querySelector('#sidebar-backdrop')
  const sidebarEl = document.querySelector('.sidebar')

  if (menuToggle && sidebarEl) {
    menuToggle.addEventListener('click', () => {
      sidebarEl.classList.toggle('open')
      backdrop?.classList.toggle('visible')
    })
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      sidebarEl?.classList.remove('open')
      backdrop.classList.remove('visible')
    })
  }
  // Close mobile sidebar after selecting a module
  document.querySelectorAll('[data-module], [data-kb-nav-id]').forEach(el => {
    el.addEventListener('click', () => {
      sidebarEl?.classList.remove('open')
      backdrop?.classList.remove('visible')
    })
  })

  document.querySelectorAll('[data-module]').forEach(button => {
    button.addEventListener('click', async () => {
      const clickedModule = button.dataset.module
      // If clicking Knowledge Hub while already on it, just toggle — don't reset section
      if (clickedModule === 'knowledge' && currentModule === 'knowledge') {
        currentModule = 'career'
      } else {
        currentModule = clickedModule
        if (clickedModule === 'knowledge') activeKbId = null
      }
      await renderApp()
    })
  })

  attachModuleHandlers()
}

// Persistent playbook delegation — survives re-renders
document.addEventListener('click', e => {
  const card = e.target.closest('.playbook-card')
  const backBtn = e.target.closest('#playbook-back')
  if (card) openPlaybook(card.dataset.key)
  if (backBtn) closePlaybook()
})

renderApp()