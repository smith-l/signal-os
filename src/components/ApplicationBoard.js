const STATUSES = [
  'Applied',
  'Prep',
  'Hiring Manager',
  'Panel',
  'Offer',
  'Closed'
]

export function ApplicationBoard(applications) {
  return `
    <section class="board">
      ${STATUSES.map(status => `
        <div class="column drop-zone" data-status="${status}">
          <h3>${status}</h3>

          ${applications
            .filter(app => app.status === status)
            .map(app => `
              <article
                class="card draggable-card application-card"
                draggable="true"
                data-id="${app.id}"
              >
                <h4>${app.company}</h4>
                <p>${app.role_title}</p>
                <small>${app.next_action || ''}</small>

                <select class="status-select" data-id="${app.id}">
                  ${STATUSES.map(option => `
                    <option
                      value="${option}"
                      ${option === app.status ? 'selected' : ''}
                    >
                      ${option}
                    </option>
                  `).join('')}
                </select>
              </article>
            `).join('')}
        </div>
      `).join('')}
    </section>
  `
}