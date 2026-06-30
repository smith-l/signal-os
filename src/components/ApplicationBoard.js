const STATUSES = [
  'Applied',
  'TA Screen',
  'HM Interview',
  'Peer',
  'Panel',
  'Offer',
  'Closed'
]

const BADGE_CLASS = {
  PASS: 'badge-pass',
  REVIEW: 'badge-review',
  CAUTION: 'badge-caution',
  UNKNOWN: 'badge-unknown'
}

function cardHTML(app) {
  return `
    <article
      class="card draggable-card application-card"
      draggable="true"
      data-id="${app.id}"
    >
      <div class="card-header">
        <h4>${app.company}</h4>
        ${app.stability_check ? `
          <span class="stability-badge ${BADGE_CLASS[app.stability_check] || 'badge-unknown'}">
            ${app.stability_check}
          </span>
        ` : ''}
      </div>
      <p class="card-role">${app.role_title}</p>
      ${app.salary && app.salary !== 'TBC' ? `<p class="card-salary">${app.salary}</p>` : ''}
      ${app.next_action ? `<p class="card-next-action">${app.next_action}</p>` : ''}
      <div class="card-links">
        <button class="card-link open-record-btn" data-id="${app.id}" onclick="event.stopPropagation()">Open Record</button>
      </div>
    </article>
  `
}

export function ApplicationBoard(applications) {
  // Anything not matching a known status falls into the catch-all column,
  // so a stray or unexpected status string never silently disappears from the board.
  const knownStatuses = new Set(STATUSES)
  const otherCards = applications.filter(app => !knownStatuses.has(app.status))

  return `
    <section class="board">
      ${STATUSES.map(status => {
        const cards = applications.filter(app => app.status === status)
        return `
          <div class="column drop-zone" data-status="${status}">
            <h3>${status} <span class="col-count">${cards.length}</span></h3>
            ${cards.map(cardHTML).join('')}
          </div>
        `
      }).join('')}
      ${otherCards.length > 0 ? `
        <div class="column column-other" data-status="__other">
          <h3>Other <span class="col-count">${otherCards.length}</span></h3>
          <p class="other-column-note">Status doesn't match a known stage — open the record and update it.</p>
          ${otherCards.map(cardHTML).join('')}
        </div>
      ` : ''}
    </section>
  `
}