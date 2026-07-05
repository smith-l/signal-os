export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const projectId = url.searchParams.get('project_id')
  if (!projectId) return Response.json([])
  const { results } = await context.env.signal_os_db
    .prepare('SELECT * FROM project_prep WHERE project_id = ? ORDER BY sort_order ASC')
    .bind(projectId)
    .all()
  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`INSERT INTO project_prep (project_id, section_key, section_title, content, sort_order)
              VALUES (?, ?, ?, ?, ?)`)
    .bind(body.project_id, body.section_key, body.section_title, body.content || '', body.sort_order || 99)
    .run()
  return Response.json({ success: true })
}

export async function onRequestPut(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`UPDATE project_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(body.content, body.id)
    .run()
  return Response.json({ success: true })
}
