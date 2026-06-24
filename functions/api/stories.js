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
      (title, situation, task, action, result, tags, competency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      body.title,
      body.situation || '',
      body.task || '',
      body.action || '',
      body.result || '',
      body.tags || '',
      body.competency || ''
    )
    .run()

  return Response.json({ success: true })
}

export async function onRequestPut(context) {
  const body = await context.request.json()

  await context.env.signal_os_db
    .prepare(`
      UPDATE stories
      SET title = ?, situation = ?, task = ?, action = ?, result = ?, tags = ?, competency = ?
      WHERE id = ?
    `)
    .bind(
      body.title,
      body.situation || '',
      body.task || '',
      body.action || '',
      body.result || '',
      body.tags || '',
      body.competency || '',
      body.id
    )
    .run()

  return Response.json({ success: true })
}