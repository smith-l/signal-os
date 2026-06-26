const STATUSES = [
  'Applied',
  'TA Screen',
  'HM Interview',
  'Peer',
  'Panel',
  'Offer',
  'Closed'
]

const STABILITY_COLOURS = {
  PASS: '#22c55e',
  REVIEW: '#f59e0b',
  CAUTION: '#ef4444',
  UNKNOWN: '#94a3b8'
}

export function ApplicationBoard(applications) {
  return `
    <section class="board">
      ${STATUSES.map(status => {
        const cards = applications.filter(app => app.status === status)
        return `
          <div class="column drop-zone" data-status="${status}">
            <h3>${status} <span class="col-count">${cards.length}</span></h3>
            ${cards.map(app => `
              <article
                class="card draggable-card application-card"
                draggable="true"
                data-id="${app.id}"
              >
                <div class="card-header">
                  <h4>${app.company}</h4>
                  ${app.stability_check ? `
                    <span class="stability-badge" style="background:${STABILITY_COLOURS[app.stability_check] || '#94a3b8'}">
                      ${app.stability_check}
                    </span>
                  ` : ''}
                </div>

                <p class="card-role">${app.role_title}</p>

                ${app.salary ? `<p class="card-salary">${app.salary}</p>` : ''}

                ${app.next_action ? `<p class="card-next-action">${app.next_action}</p>` : ''}

                <div class="card-links">
                  ${app.prep_page_url ? `<a href="${app.prep_page_url}" target="_blank" onclick="event.stopPropagation()" class="card-link">Prep ↗</a>` : ''}
                </div>
              </article>
            `).join('')}
          </div>
        `
      }).join('')}
    </section>
  `
}