import { Board } from '../../components/Board.js'
import { Timeline } from '../../components/Timeline.js'
import { projectConfig } from '../../config/entityConfigs.js'

export async function Projects(view = 'board') {
  const projects = await fetch('/api/projects').then(r => r.json())

  const tasksByProject = {}
  await Promise.all(projects.map(async p => {
    tasksByProject[p.id] = await fetch(`/api/tasks?project_id=${p.id}`).then(r => r.json())
  }))

  return `
    <header class="page-header">
      <p class="eyebrow">In-Role</p>
      <h2>Projects</h2>
      <div class="view-toggle">
        <button class="view-toggle-btn ${view === 'board' ? 'active' : ''}" data-view="board">Board</button>
        <button class="view-toggle-btn ${view === 'timeline' ? 'active' : ''}" data-view="timeline">Timeline</button>
      </div>
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

    ${view === 'timeline' ? Timeline(projects, tasksByProject, projectConfig) : Board(projects, projectConfig)}
  `
}
