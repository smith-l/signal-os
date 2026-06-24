export function Applications() {

  const statuses = [
    'Applied',
    'Prep',
    'Hiring Manager',
    'Panel',
    'Offer',
    'Closed'
  ]

  const applications = [
    {
      company: 'Atlassian',
      role: 'Senior Manager Solutions Engineering',
      status: 'Hiring Manager'
    },
    {
      company: 'Workday',
      role: 'Manager Presales',
      status: 'Hiring Manager'
    },
    {
      company: 'Splunk',
      role: 'AVP Solutions Engineering',
      status: 'Applied'
    }
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
        <span>2</span>
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
                <p>${app.role}</p>
              </article>
            `)
            .join('')}
        </div>
      `).join('')}
    </section>
  `
}