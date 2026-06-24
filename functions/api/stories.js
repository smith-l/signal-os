export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare("SELECT * FROM stories ORDER BY title")
    .all()

  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()

  await context.env.signal_os_db
    .prepare(`
      INSERT INTO stories
      (title, situation, task, action, result, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(
      body.title,
      body.situation || '',
      body.task || '',
      body.action || '',
      body.result || '',
      body.tags || ''
    )
    .run()

  return Response.json({ success: true })
}