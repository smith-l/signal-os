export async function getProjects() {
  const response = await fetch('/api/projects')
  return await response.json()
}

export async function updateProject(project) {
  await fetch('/api/projects', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  })
}

export async function createProject(project) {
  await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  })
}
