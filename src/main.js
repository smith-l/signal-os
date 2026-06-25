import './style.css'

import { Applications } from './modules/career/Applications.js'
import { Stories } from './modules/career/Stories.js'
import { Tasks } from './modules/tasks/Tasks.js'
import { Projects } from './modules/projects/Projects.js'
import { Knowledge } from './modules/knowledge/Knowledge.js'

import {
  getApplications,
  updateApplication,
  createApplication
} from './services/applicationService.js'

import {
  createStory
} from './services/storyService.js'

import {
  openApplicationPanel
} from './components/ApplicationPanel.js'

import {
  openStoryPanel
} from './components/StoryPanel.js'

import {
  AppShell
} from './components/AppShell.js'

let currentModule = 'career'
let draggedCardId = null

async function renderModule() {
  if (currentModule === 'career') return await Applications()
  if (currentModule === 'stories') return await Stories()
  if (currentModule === 'tasks') return Tasks()
  if (currentModule === 'projects') return Projects()
  if (currentModule === 'knowledge') return Knowledge()

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
  const form = document.querySelector('#application-form')
  const saveButton = document.querySelector('#save-application')
  const closePanel = document.querySelector('#close-panel')

  const addStoryButton = document.querySelector('#add-story-btn')
  const storyForm = document.querySelector('#story-form')
  const saveStoryButton = document.querySelector('#save-story')
  const closeStoryPanel = document.querySelector('#close-story-panel')

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

  if (closeStoryPanel) {
    closeStoryPanel.addEventListener('click', () => {
      document.querySelector('#story-panel').classList.add('hidden')
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

      await createApplication({
        company,
        role_title: role,
        status: 'Applied'
      })

      await renderApp()
    })
  }

  if (addStoryButton && storyForm) {
    addStoryButton.addEventListener('click', () => {
      storyForm.style.display = 'block'
    })
  }

  if (saveStoryButton) {
    saveStoryButton.addEventListener('click', async () => {
      const title = document.querySelector('#story-title').value

      if (!title) {
        alert('Please enter a story title')
        return
      }

      await createStory({ title })

      await renderApp()
    })
  }

  document.querySelectorAll('.story-card').forEach(card => {
    card.addEventListener('click', async () => {
      await openStoryPanel(card.dataset.storyId, renderApp)
    })
  })

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async () => {
      await updateApplicationStatus(select.dataset.id, select.value)
    })
  })

  document.querySelectorAll('.application-card').forEach(card => {
    card.addEventListener('click', async event => {
      if (event.target.tagName === 'SELECT') return

      await openApplicationPanel(card.dataset.id, renderApp)
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
  document.querySelector('#app').innerHTML =
    AppShell(currentModule)

  document.querySelector('#module-content').innerHTML =
    await renderModule()

  document.querySelectorAll('[data-module]').forEach(button => {
    button.addEventListener('click', async () => {
      currentModule = button.dataset.module
      await renderApp()
    })
  })

  attachModuleHandlers()
}

renderApp()