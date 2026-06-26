import {
  getApplications,
  updateApplication,
  getLinkedStories,
  saveLinkedStories
} from '../services/applicationService.js'

import {
  getAllStories
} from '../services/storyService.js'

const STATUSES = [
  'Applied',
  'TA Screen',
  'HM Interview',
  'Peer',
  'Panel',
  'Offer',
  'Closed'
]

const STABILITY = ['PASS', 'REVIEW', 'CAUTION', 'UNKNOWN']

export async function openApplicationPanel(applicationId, onSaved) {

  const applications = await getApplications()

  const application =
    applications.find(a => String(a.id) === String(applicationId))

  if (!application) return

  const allStories = await getAllStories()

  const linkedStories =
    await getLinkedStories(application.id)

  const linkedIds =
    linkedStories.map(s => String(s.story_id))

  const panel =
    document.querySelector('#application-panel')

  const content =
    document.querySelector('#application-panel-content')

  content.innerHTML = `
    <h2>${application.company}</h2>

    <div class="panel-links">
      ${application.jira_id ? `<a href="https://leesmith286.atlassian.net/browse/${application.jira_id}" target="_blank" class="panel-link jira-link">Jira ${application.jira_id}</a>` : ''}
      ${application.prep_page_url ? `<a href="${application.prep_page_url}" target="_blank" class="panel-link prep-link">Prep Page ↗</a>` : ''}
    <button class="ql-btn open-record-btn" data-id="${application.id}">
  <i class="ti ti-layout-sidebar-right" aria-hidden="true"></i> Open Record
</button>
      </div>

    <label>Company</label>
    <input id="panel-company" value="${application.company || ''}" />

    <label>Role</label>
    <input id="panel-role" value="${application.role_title || ''}" />

    <label>Status</label>
    <select id="panel-status">
      ${STATUSES.map(status => `
        <option
          value="${status}"
          ${status === application.status ? 'selected' : ''}
        >
          ${status}
        </option>
      `).join('')}
    </select>

    <label>Stability</label>
    <select id="panel-stability">
      ${STABILITY.map(s => `
        <option
          value="${s}"
          ${s === application.stability_check ? 'selected' : ''}
        >
          ${s}
        </option>
      `).join('')}
    </select>

    <label>Recruiter</label>
    <input id="panel-recruiter" value="${application.recruiter || ''}" />

    <label>Salary</label>
    <input id="panel-salary" value="${application.salary || ''}" />

    <label>Location</label>
    <input id="panel-location" value="${application.location || ''}" />

    <label>Job Link</label>
    <input id="panel-job-link" value="${application.job_link || ''}" />

    <label>Jira ID</label>
    <input id="panel-jira-id" value="${application.jira_id || ''}" placeholder="e.g. JS-1" />

    <label>Prep Page URL</label>
    <input id="panel-prep-page-url" value="${application.prep_page_url || ''}" placeholder="https://leesmith286.atlassian.net/wiki/..." />

    <label>Next Action</label>
    <input id="panel-next-action" value="${application.next_action || ''}" />

    <label>Notes</label>
    <textarea id="panel-notes">${application.notes || ''}</textarea>

    <section class="linked-stories-section">

      <h3>Linked Stories</h3>

      ${allStories.map(story => `

        <label class="story-checkbox">

          <input
            class="linked-story-checkbox"
            type="checkbox"
            value="${story.id}"
            ${linkedIds.includes(String(story.id)) ? 'checked' : ''}
          />

          <span>

            ${story.title}

            <small>${story.tags || ''}</small>

          </span>

        </label>

      `).join('')}

    </section>

    <button
      id="save-panel"
      class="panel-save"
    >
      Save Changes
    </button>
  `

  panel.classList.remove('hidden')
document
  .querySelector('.open-record-btn')
  ?.addEventListener('click', async () => {
    const { openRecordView } = await import('./RecordView.js')
    const allApps = await getApplications()
    panel.classList.add('hidden')
    await openRecordView(application.id, allApps, onSaved)
  })
  document
    .querySelector('#save-panel')
    .addEventListener('click', async () => {

      const selectedStories =
        Array
          .from(document.querySelectorAll('.linked-story-checkbox:checked'))
          .map(cb => cb.value)

      await updateApplication({

        id: application.id,

        company:
          document.querySelector('#panel-company').value,

        role_title:
          document.querySelector('#panel-role').value,

        status:
          document.querySelector('#panel-status').value,

        stability_check:
          document.querySelector('#panel-stability').value,

        recruiter:
          document.querySelector('#panel-recruiter').value,

        salary:
          document.querySelector('#panel-salary').value,

        location:
          document.querySelector('#panel-location').value,

        job_link:
          document.querySelector('#panel-job-link').value,

        jira_id:
          document.querySelector('#panel-jira-id').value,

        prep_page_url:
          document.querySelector('#panel-prep-page-url').value,

        next_action:
          document.querySelector('#panel-next-action').value,

        notes:
          document.querySelector('#panel-notes').value

      })

      await saveLinkedStories(
        application.id,
        selectedStories
      )

      if (onSaved)
        await onSaved()

    })

}