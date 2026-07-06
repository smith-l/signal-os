function parseDate(d) {
  return d ? new Date(d + 'T00:00:00') : null
}

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export function Timeline(projects, tasksByProject, config) {
  const dated = projects.filter(p => p.start_date || p.target_end_date)

  if (dated.length === 0) {
    return `
      <div class="timeline-empty">
        <p>No projects have dates set yet. Open a project, hit Edit, and add a Start Date / Target End Date to see it here.</p>
      </div>
    `
  }

  const allDates = []
  dated.forEach(p => {
    if (p.start_date) allDates.push(parseDate(p.start_date))
    if (p.target_end_date) allDates.push(parseDate(p.target_end_date))
    ;(tasksByProject[p.id] || []).forEach(t => { if (t.due_date) allDates.push(parseDate(t.due_date)) })
  })

  const minDate = new Date(Math.min(...allDates))
  const maxDate = new Date(Math.max(...allDates))
  // Pad either side by a few days so bars/markers don't sit flush against the edge
  minDate.setDate(minDate.getDate() - 3)
  maxDate.setDate(maxDate.getDate() + 3)
  const totalDays = Math.max(daysBetween(minDate, maxDate), 1)

  const pct = d => (daysBetween(minDate, d) / totalDays) * 100

  const rows = dated.map(p => {
    const start = parseDate(p.start_date) || minDate
    const end = parseDate(p.target_end_date) || start
    const left = pct(start)
    const width = Math.max(pct(end) - left, 1.5)
    const stageClass = config.stageClassMap?.[p.stage] || ''

    const milestones = (tasksByProject[p.id] || [])
      .filter(t => t.is_milestone && t.due_date)
      .map(t => `
        <div class="timeline-milestone" style="left:${pct(parseDate(t.due_date))}%" title="${t.title} — ${t.due_date}">
          <i class="ti ti-flag-filled" aria-hidden="true"></i>
          <span class="timeline-milestone-label">${t.title}</span>
        </div>
      `).join('')

    return `
      <div class="timeline-row">
        <div class="timeline-label">
          <span class="timeline-title">${p[config.titleField]}</span>
          <span class="timeline-stage ${stageClass}">${p.stage}</span>
        </div>
        <div class="timeline-track">
          <div class="timeline-bar" style="left:${left}%; width:${width}%">
            ${p.start_date ? `<span class="timeline-bar-date timeline-bar-date-start">${p.start_date}</span>` : ''}
            ${p.target_end_date ? `<span class="timeline-bar-date timeline-bar-date-end">${p.target_end_date}</span>` : ''}
          </div>
          ${milestones}
        </div>
      </div>
    `
  }).join('')

  // Month gridlines/labels along the top
  const months = []
  let cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  while (cursor <= maxDate) {
    months.push(new Date(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }

  const monthLabels = months.map(m => `
    <div class="timeline-month-label" style="left:${pct(m)}%">${m.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}</div>
  `).join('')

  return `
    <div class="timeline">
      <div class="timeline-months">${monthLabels}</div>
      ${rows}
    </div>
  `
}