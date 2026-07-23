import { Board } from '../../components/Board.js'
import { personConfig } from '../../config/entityConfigs.js'

export async function People() {
  const people = await fetch('/api/people').then(r => r.json())

  return `
    <header class="page-header">
      <p class="eyebrow">In-Role</p>
      <h2>Team</h2>
      <button id="add-person-btn">+ Add Team Member</button>
    </header>

    <div id="person-form" class="add-form" style="display:none;">
      <input id="person-name" placeholder="Name" />
      <input id="person-role" placeholder="Role (e.g. Senior SE)" />
      <button id="save-person">Save Team Member</button>
    </div>

    <section class="summary-grid">
      <article><span>${people.length}</span><p>Team</p></article>
      <article><span>${people.filter(p => p.support_stage === 'Needs Support').length}</span><p>Needs Support</p></article>
      <article><span>${people.filter(p => p.support_stage === 'At Risk').length}</span><p>At Risk</p></article>
      <article><span>${people.filter(p => p.support_stage === 'Thriving').length}</span><p>Thriving</p></article>
    </section>

    ${Board(people, personConfig)}
  `
}
