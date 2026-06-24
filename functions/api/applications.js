export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare("SELECT * FROM applications ORDER BY created_at DESC")
    .all()

  return Response.json(results)
}