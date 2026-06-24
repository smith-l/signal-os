import './style.css'

const statuses = ['Applied', 'Prep Underway', 'Hiring Manager', 'Panel', 'Offer', 'Closed']

const applications = [
  {
    company: 'Atlassian',
    role: 'Senior Manager Solutions Engineering EMEA',
    status: 'Hiring Manager',
    nextAction: 'Mock run-through before Kira call'
  },
  {
    company: 'Workday',
    role: 'Presales Manager UKI',
    status: 'Hiring Manager',
    nextAction: 'Prepare Workday values and AI story'
  },
  {
    company: 'Splunk',
    role: 'AVP Solutions Engineering UKI',
    status: 'Applied',
    nextAction: 'Await response'
  }
]

document.querySelector('#app').innerHTML = `
  <main class="app-shell">
    <aside class="sidebar">
      <h1>Signal OS</h1>
      <nav>
        <button class="active">Dashboard</button>
        <button>Career Hub</button>
        <button>Task Hub</button>
        <button>Project Hub</button>
        <button>Knowledge Hub</button>
      </nav>
    </aside>

    <section class="main-panel">
      <header class="page-header">
        <p class="eyebrow">Personal Operating System</p>
        <h2>Career Hub</h2>
        <p>Applications, interview prep, stories and AI suggestions in one place.</p>
      </header>

      <section class="summary-grid">
        <article>
          <span>${applications.length}</span>
          <p>Active applications</p>
        </article>
        <article>
          <span>2</span>
          <p>Hiring manager stage</p>
        </article>
        <article>
          <span>0</span>
          <p>AI suggestions pending</p>
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
                  <small>${app.nextAction}</small>
                </article>
              `).join('')}
          </div>
        `).join('')}
      </section>
    </section>
  </main>
`