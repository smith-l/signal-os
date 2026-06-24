import './style.css'

import { Applications } from './modules/career/Applications.js'
import { Tasks } from './modules/tasks/Tasks.js'
import { Projects } from './modules/projects/Projects.js'
import { Knowledge } from './modules/knowledge/Knowledge.js'

let currentModule = 'career'

async function renderModule() {
  if (currentModule === 'career') return await Applications()
  if (currentModule === 'tasks') return Tasks()
  if (currentModule === 'projects') return Projects()
  if (currentModule === 'knowledge') return Knowledge()

  return await Applications()
}

function attachModuleHandlers() {
  const addButton = document.querySelector('#add-application-btn')
  const form = document.querySelector('#application-form')
  const saveButton = document.querySelector('#save-application')

  if (addButton && form) {
    addButton.addEventListener('click', () => {
      form.style.display = 'block'
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company,
          role_title: role,
          status: 'Applied'
        })
      })

      await renderApp()
    })
  }

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async () => {
      await fetch('/api/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: select.dataset.id,
          status: select.value
        })
      })

      await renderApp()
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