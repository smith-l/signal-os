export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare(`
      SELECT
        id,
        title,
        tags
      FROM stories
      ORDER BY title
    `)
    .all()

  return Response.json(results)
}