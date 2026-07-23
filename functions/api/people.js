const DEFAULT_SECTIONS = [
  { key: 'role_background', title: 'Role & Background', order: 1, content: '' },
  { key: 'strengths', title: 'Strengths', order: 2, content: '' },
  { key: 'aspirations', title: 'Aspirations', order: 3, content: '' },
  { key: 'notes_log', title: '1:1 Notes Log', order: 4, content: '' },
]

export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare("SELECT * FROM people ORDER BY created_at DESC")
    .all()
  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()
  const result = await context.env.signal_os_db
    .prepare(`INSERT INTO people (name, role, support_stage, next_action, notes) VALUES (?, ?, ?, ?, ?)`)
    .bind(body.name, body.role || '', body.support_stage || 'Steady', body.next_action || '', body.notes || '')
    .run()

  const personId = result.meta.last_row_id

  for (const section of DEFAULT_SECTIONS) {
    await context.env.signal_os_db
      .prepare(`INSERT INTO people_prep (person_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)`)
      .bind(personId, section.key, section.title, section.content, section.order)
      .run()
  }

  return Response.json({ success: true, id: personId })
}

export async function onRequestPut(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`UPDATE people SET name=?, role=?, support_stage=?, next_action=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .bind(body.name, body.role || '', body.support_stage, body.next_action || '', body.notes || '', body.id)
    .run()
  return Response.json({ success: true })
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url)
  const id = url.searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  await context.env.signal_os_db
    .prepare('DELETE FROM people_prep WHERE person_id = ?')
    .bind(id)
    .run()

  await context.env.signal_os_db
    .prepare('DELETE FROM people WHERE id = ?')
    .bind(id)
    .run()

  return Response.json({ success: true })
}