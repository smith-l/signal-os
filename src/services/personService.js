export async function getPeople() {
  const response = await fetch('/api/people')
  return await response.json()
}

export async function updatePerson(person) {
  await fetch('/api/people', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person)
  })
}

export async function createPerson(person) {
  await fetch('/api/people', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person)
  })
}
