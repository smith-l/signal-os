export async function getApplications() {
  const response = await fetch('/api/applications')
  return await response.json()
}

export async function updateApplication(application) {
  await fetch('/api/applications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  })
}

export async function createApplication(application) {
  await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  })
}

export async function getLinkedStories(applicationId) {
  const response = await fetch(`/api/application-stories?application_id=${applicationId}`)
  return await response.json()
}

export async function saveLinkedStories(applicationId, storyIds) {
  await fetch('/api/application-stories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      application_id: applicationId,
      story_ids: storyIds
    })
  })
}