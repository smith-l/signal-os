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
  getProjects,
  updateProject,
  createProject
} from './services/projectService.js'

import {
  openRecordView
} from './components/RecordView.js'

import {
  AppShell
} from './components/AppShell.js'

import { entityConfigs } from './config/entityConfigs.js'

// Expose playbook functions globally for inline onclick handlers
window.__openPlaybook = openPlaybook
window.__closePlaybook = closePlaybook

let currentModule = 'career'
let activeKbId = null
let draggedCardId = null
let draggedEntityType = null

// Registry mapping entity type -> its data service functions.
// Board.js/RecordView.js never call these directly — only main.js's
// dispatch layer does, keeping the shared components config-only.
const entityServices = {
  application: { getAll: getApplications, update: updateApplication, create: createApplication, apiBase: '/api/applications' },
  project: { getAll: getProjects, update: updateProject, create: createProject, apiBase: '/api/projects' },
}

async function renderModule() {
  if (currentModule === 'career') return await Applications()
  if (currentModule === 'playbooks') return await Playbooks()
  if (currentModule === 'projects') return await Projects()
  if (currentModule === 'knowledge') return await KnowledgeHub(activeKbId)
  return await Applications()
}

async function updateEntityStage(entityType, id, stage) {
  const service = entityServices[entityType]
  const config = entityConfigs[entityType]
  if (!service || !config) return
  const records = await service.getAll()
  const record = records.find(r => String(r.id) === String(id))
  if (!record) return
  record[config.stageField] = stage
  await service.update(record)
  await renderApp()
}

function attachModuleHandlers() {
  const addAppButton = document.querySelector('#add-application-btn')
  const saveAppButton = document.querySelector('#save-application')
  const closePanel = document.querySelector('#close-panel')

  if (addAppButton) {
    addAppButton.addEventListener('click', () => {
      document.querySelector('#application-form').style.display = 'block'
    })
  }

  if (closePanel) {
    closePanel.addEventListener('click', () => {
      document.querySelector('#application-panel').classList.add('hidden')
    })
  }

  if (saveAppButton) {
    saveAppButton.addEventListener('click', async () => {
      const company = document.querySelector('#company').value
      const role = document.querySelector('#role').value
      if (!company || !role) { alert('Please enter a company and role'); return }
      await createApplication({ company, role_title: role, status: 'Applied' })
      await renderApp()
    })
  }

  // Projects module — add form
  const addProjectButton = document.querySelector('#add-project-btn')
  const saveProjectButton = document.querySelector('#save-project')

  if (addProjectButton) {
    addProjectButton.addEventListener('click', () => {
      document.querySelector('#project-form').style.display = 'block'
    })
  }

  if (saveProjectButton) {
    saveProjectButton.addEventListener('click', async () => {
      const title = document.querySelector('#project-title').value
      const category = document.querySelector('#project-category').value
      if (!title) { alert('Please enter a project title'); return }
      await createProject({ title, category, stage: 'Not Started' })
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

  // Delete — dispatches by data-entity-type, works for both applications and projects
  document.querySelectorAll('.card-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const entityType = btn.dataset.entityType
      const service = entityServices[entityType]
      if (!service) return
      if (!confirm(`Delete ${btn.dataset.title}? This removes all prep sections and cannot be undone.`)) return
      await fetch(`${service.apiBase}?id=${btn.dataset.id}`, { method: 'DELETE' })
      await renderApp()
    })
  })

  // Card click -> open record view — dispatches by data-entity-type
  document.querySelectorAll('.card[data-entity-type]').forEach(card => {
    card.addEventListener('click', async event => {
      if (event.target.tagName === 'A') return
      const entityType = card.dataset.entityType
      const service = entityServices[entityType]
      const config = entityConfigs[entityType]
      if (!service || !config) return
      const records = await service.getAll()
      await openRecordView(card.dataset.id, records, renderApp, config)
    })
  })

  document.querySelectorAll('.open-record-btn').forEach(btn => {
    btn.addEventListener('click', async event => {
      event.stopPropagation()
      const entityType = btn.dataset.entityType
      const service = entityServices[entityType]
      const config = entityConfigs[entityType]
      if (!service || !config) return
      const records = await service.getAll()
      await openRecordView(btn.dataset.id, records, renderApp, config)
    })
  })

  document.querySelectorAll('.draggable-card').forEach(card => {
    card.addEventListener('dragstart', () => {
      draggedCardId = card.dataset.id
      draggedEntityType = card.dataset.entityType
      card.classList.add('dragging')
    })
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging')
      draggedCardId = null
      draggedEntityType = null
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
      // Guard against dropping a card into a column belonging to a different entity type —
      // shouldn't happen given boards render one type at a time, but the check is cheap.
      if (!draggedCardId || zone.dataset.entityType !== draggedEntityType) return
      await updateEntityStage(draggedEntityType, draggedCardId, zone.dataset.stage)
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