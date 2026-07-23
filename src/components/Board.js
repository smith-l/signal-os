function cardHTML(record, config) {
  const title = record[config.titleField]
  const subtitle = record[config.subtitleField]
  const badgeValue = config.badge ? record[config.badge.field] : null
  const stageValue = record[config.stageField]
  const stageClass = config.stageClassMap?.[stageValue] || ''

  const fieldsHtml = config.cardFields.map(f => {
    if (f.showIf && !f.showIf(record)) return ''
    const value = f.render ? f.render(record) : record[f.key]
    if (!value) return ''
    return `<p class="card-field card-field-${f.key}">${value}</p>`
  }).join('')

  return `
    <article
      class="card draggable-card ${config.typeKey}-card"
      draggable="true"
      data-id="${record.id}"
      data-entity-type="${config.typeKey}"
    >
      <div class="card-header">
        <h4>${title || ''}</h4>
        ${badgeValue ? `
          <span class="stability-badge ${config.badge.classMap[badgeValue] || 'badge-unknown'}">
            ${badgeValue}
          </span>
        ` : (!config.badge && stageClass ? `
          <span class="stability-badge ${stageClass}">
            ${stageValue}
          </span>
        ` : '')}
      </div>
      ${subtitle ? `<p class="card-role">${subtitle}</p>` : ''}
      ${fieldsHtml}
      <div class="card-links">
        <button class="card-link card-delete-btn" data-id="${record.id}" data-entity-type="${config.typeKey}" data-title="${title || ''}" onclick="event.stopPropagation()" title="Delete">
          <i class="ti ti-trash" aria-hidden="true"></i>
        </button>
      </div>
    </article>
  `
}

export function Board(records, config) {
  const knownStages = new Set(config.stages)
  const otherCards = records.filter(r => !knownStages.has(r[config.stageField]))

  return `
    <section class="board" data-entity-type="${config.typeKey}">
      ${config.stages.map(stage => {
        const cards = records.filter(r => r[config.stageField] === stage)
        return `
          <div class="column drop-zone" data-stage="${stage}" data-entity-type="${config.typeKey}">
            <h3>${stage} <span class="col-count">${cards.length}</span></h3>
            ${cards.map(r => cardHTML(r, config)).join('')}
          </div>
        `
      }).join('')}
      ${otherCards.length > 0 ? `
        <div class="column column-other" data-stage="__other" data-entity-type="${config.typeKey}">
          <h3>Other <span class="col-count">${otherCards.length}</span></h3>
          <p class="other-column-note">Stage doesn't match a known column — open the record and update it.</p>
          ${otherCards.map(r => cardHTML(r, config)).join('')}
        </div>
      ` : ''}
    </section>
  `
}