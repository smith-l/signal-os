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
      <p>Track applications, interview stages and next actions.</p>
    </header>

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
        <div class="column">
          <h3>${status}</h3>

          ${applications
            .filter(app => app.status === status)
            .map(app => `
              <article class="card">
                <h4>${app.company}</h4>
                <p>${app.role_title}</p>
                <small>${app.next_action || ''}</small>
              </article>
            `)
            .join('')}
        </div>
      `).join('')}
    </section>
  `
}