export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const projectId = url.searchParams.get('project_id')
  const module = url.searchParams.get('module')

  let query = 'SELECT * FROM tasks WHERE 1=1'
  const binds = []
  if (projectId) { query += ' AND project_id = ?'; binds.push(projectId) }
  if (module) { query += ' AND module = ?'; binds.push(module) }
  query += ' ORDER BY updated_at DESC'

  const { results } = await context.env.signal_os_db.prepare(query).bind(...binds).all()
  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()
  const result = await context.env.signal_os_db
    .prepare('INSERT INTO tasks (title, status, module, notes, project_id, application_id) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(body.title, body.status || 'Backlog', body.module || 'general', body.notes || '', body.project_id || null, body.application_id || null)
    .run()
  return Response.json({ success: true, id: result.meta.last_row_id })
}

export async function onRequestPut(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare('UPDATE tasks SET title=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .bind(body.title, body.status, body.notes || '', body.id)
    .run()
  return Response.json({ success: true })
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url)
  const id = url.searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  await context.env.signal_os_db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run()
  return Response.json({ success: true })
}
