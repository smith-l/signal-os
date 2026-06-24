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
}

renderApp()