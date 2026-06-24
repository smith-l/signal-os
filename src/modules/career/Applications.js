export async function Applications() {
  const response = await fetch('/api/applications')
  const applications = await response.json()

  const statuses = [
    'Applied',
    'Prep',
    'Hiring Manager',
    'Panel',
    'Offer',
    'Closed'
  ]

  return `
    <header class="page-header">
      <p class="eyebrow">Career Hub</p>
      <h2>Applications</h2>

      <button id="add-application-btn">
        + Add Application
      </button>
    </header>

    <div id="application-form" style="display:none;margin-bottom:24px;">
      <input id="company" placeholder="Company" />
      <input id="role" placeholder="Role" />
      <button id="save-application">
        Save
      </button>
    </div>

    <section class="summary-grid">
      <article>
        <span>${applications.length}</span>
        <p>Applications</p>
      </article>

      <article>
        <span>${applications.filter(a => a.status === 'Hiring Manager').length}</span>
        <p>Hiring Manager</p>
      </article>

      <article>
        <span>0</span>
        <p>AI Suggestions</p>
      </article>
    </section>

    <section class="board">
      ${statuses.map(status => `
        <div class="column drop-zone" data-status="${status}">
          <h3>${status}</h3>

          ${applications
            .filter(app => app.status === status)
            .map(app => `
              <article
              <div id="application-panel" class="application-panel hidden">
  <div id="application-panel-content">
  </div>
</div>
  class="card draggable-card application-card"
  draggable="true"
  data-id="${app.id}"
                <h4>${app.company}</h4>
                <p>${app.role_title}</p>
              <small>${app.next_action || ''}</small>

<select class="status-select" data-id="${app.id}">
  ${statuses.map(option => `
    <option value="${option}" ${option === app.status ? 'selected' : ''}>
      ${option}
    </option>
  `).join('')}
</select>
              </article>
            `)
            .join('')}
        </div>
      `).join('')}
    </section>
  `
}