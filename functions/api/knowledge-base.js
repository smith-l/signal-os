export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare('SELECT * FROM knowledge_base ORDER BY sort_order ASC')
    .all()
  return Response.json(results)
}

export async function onRequestPut(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare('UPDATE knowledge_base SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(body.content, body.id)
    .run()
  return Response.json({ success: true })
}