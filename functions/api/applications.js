export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare("SELECT * FROM applications ORDER BY created_at DESC")
    .all()

  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()

  await context.env.signal_os_db
    .prepare(`
      INSERT INTO applications
      (
        company,
        role_title,
        status,
        next_action
      )
      VALUES (?, ?, ?, ?)
    `)
    .bind(
      body.company,
      body.role_title,
      body.status || 'Applied',
      body.next_action || ''
    )
    .run()

  return Response.json({
    success: true
  })
}