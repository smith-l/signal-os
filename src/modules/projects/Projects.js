import { Board } from '../../components/Board.js'
import { projectConfig } from '../../config/entityConfigs.js'

export async function Projects() {
  const response = await fetch('/api/projects')
  const projects = await response.json()

  return `
    <header class="page-header">
      <p class="eyebrow">In-Role</p>
      <h2>Projects</h2>
      <button id="add-project-btn">+ Add Project</button>
    </header>

    <div id="project-form" class="add-form" style="display:none;">
      <input id="project-title" placeholder="Project title" />
      <input id="project-category" placeholder="Category (e.g. in-role, signal_os_build)" />
      <button id="save-project">Save Project</button>
    </div>

    <section class="summary-grid">
      <article><span>${projects.length}</span><p>Projects</p></article>
      <article><span>${projects.filter(p => p.stage === 'Active').length}</span><p>Active</p></article>
      <article><span>${projects.filter(p => p.stage === 'Blocked').length}</span><p>Blocked</p></article>
      <article><span>${projects.filter(p => p.stage === 'Done').length}</span><p>Done</p></article>
    </section>

    ${Board(projects, projectConfig)}
  `
}