import { Board } from '../../components/Board.js'
import { applicationConfig } from '../../config/entityConfigs.js'

export async function Applications() {
  const response = await fetch('/api/applications')
  const applications = await response.json()

  return `
    <header class="page-header">
      <p class="eyebrow">Career Hub</p>
      <h2>Applications</h2>
      <button id="add-application-btn">+ Add Application</button>
    </header>

    <div id="application-form" class="add-form" style="display:none;">
      <input id="company" placeholder="Company" />
      <input id="role" placeholder="Role" />
      <button id="save-application">Save Application</button>
    </div>

    <section class="summary-grid">
      <article><span>${applications.length}</span><p>Applications</p></article>
      <article><span>${applications.filter(a => a.status === 'HM Interview').length}</span><p>HM Interview</p></article>
      <article><span>${applications.filter(a => ['HM Interview','Peer','Panel'].includes(a.status)).length}</span><p>In Process</p></article>
    </section>

    ${Board(applications, applicationConfig)}

    <div id="application-panel" class="application-panel hidden">
      <button id="close-panel" class="panel-close">×</button>
      <div id="application-panel-content"></div>
    </div>
  `
}