export async function onRequestGet(context) {
  try {
    if (!context.env.signal_os_db) {
      return Response.json(
        { error: "D1 binding signal_os_db is missing" },
        { status: 500 }
      )
    }

    const { results } = await context.env.signal_os_db
      .prepare("SELECT * FROM applications ORDER BY created_at DESC")
      .all()

    return Response.json(results)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}