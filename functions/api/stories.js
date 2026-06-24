export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const applicationId = url.searchParams.get('application_id')

  const { results } = await context.env.signal_os_db
    .prepare("SELECT * FROM application_stories WHERE application_id = ?")
    .bind(applicationId)
    .all()

  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()

  await context.env.signal_os_db
    .prepare("DELETE FROM application_stories WHERE application_id = ?")
    .bind(body.application_id)
    .run()

  for (const storyId of body.story_ids) {
    await context.env.signal_os_db
      .prepare("INSERT INTO application_stories (application_id, story_id) VALUES (?, ?)")
      .bind(body.application_id, storyId)
      .run()
  }

  return Response.json({ success: true })
}