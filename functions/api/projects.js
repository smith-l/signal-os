const DEFAULT_SECTIONS = [
  { key: 'problem_statement', title: 'Problem Statement / Objective', order: 1, content: '' },
  {
    key: 'roles_responsibilities', title: 'Roles & Responsibilities', order: 2,
    content: '| Owner | Role | Responsibility |\n|---|---|---|\n| | | |\n'
  },
  {
    key: 'risks_mitigation', title: 'Risks & Mitigation', order: 3,
    content: '| Risk | Impact | Likelihood | Mitigation |\n|---|---|---|---|\n| | | | |\n'
  },
  { key: 'general_info', title: 'General Info', order: 4, content: '' },
]

export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare("SELECT * FROM projects ORDER BY created_at DESC")
    .all()
  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()
  const result = await context.env.signal_os_db
    .prepare(`INSERT INTO projects (title, category, stage, rag_status, next_action, notes) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(body.title, body.category || '', body.stage || 'Not Started', body.rag_status || '', body.next_action || '', body.notes || '')
    .run()

  const projectId = result.meta.last_row_id

  for (const section of DEFAULT_SECTIONS) {
    await context.env.signal_os_db
      .prepare(`INSERT INTO project_prep (project_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, ?)`)
      .bind(projectId, section.key, section.title, section.content, section.order)
      .run()
  }

  return Response.json({ success: true, id: projectId })
}

export async function onRequestPut(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`UPDATE projects SET title=?, category=?, stage=?, rag_status=?, next_action=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .bind(body.title, body.category || '', body.stage, body.rag_status || '', body.next_action || '', body.notes || '', body.id)
    .run()
  return Response.json({ success: true })
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url)
  const id = url.searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  // Cascade delete prep sections and any tasks pointed at this project first
  await context.env.signal_os_db
    .prepare('DELETE FROM project_prep WHERE project_id = ?')
    .bind(id)
    .run()

  await context.env.signal_os_db
    .prepare('UPDATE tasks SET project_id = NULL WHERE project_id = ?')
    .bind(id)
    .run()

  await context.env.signal_os_db
    .prepare('DELETE FROM projects WHERE id = ?')
    .bind(id)
    .run()

  return Response.json({ success: true })
}