export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const applicationId = url.searchParams.get('application_id')
  if (!applicationId) return Response.json([])
  const { results } = await context.env.signal_os_db
    .prepare('SELECT * FROM role_prep WHERE application_id = ? ORDER BY sort_order ASC')
    .bind(applicationId)
    .all()
  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order)
              VALUES (?, ?, ?, ?, ?)`)
    .bind(body.application_id, body.section_key, body.section_title, body.content || '', body.sort_order || 99)
    .run()
  return Response.json({ success: true })
}

export async function onRequestPut(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`UPDATE role_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(body.content, body.id)
    .run()
  return Response.json({ success: true })
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url)
  const id = url.searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  await context.env.signal_os_db
    .prepare('DELETE FROM role_prep WHERE id = ?')
    .bind(id)
    .run()
  return Response.json({ success: true })
}