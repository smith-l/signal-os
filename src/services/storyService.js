export async function getStories() {
  const response = await fetch('/api/stories')
  return await response.json()
}

export async function getAllStories() {
  const response = await fetch('/api/all-stories')
  return await response.json()
}

export async function createStory(story) {
  await fetch('/api/stories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(story)
  })
}

export async function updateStory(story) {
  await fetch('/api/stories', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(story)
  })
}