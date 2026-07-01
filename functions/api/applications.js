export async function onRequestGet(context) {
  const { results } = await context.env.signal_os_db
    .prepare("SELECT * FROM applications ORDER BY created_at DESC")
    .all()
  return Response.json(results)
}

export async function onRequestPost(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`INSERT INTO applications (company, role_title, status, next_action, recruiter, salary, job_link, location, jira_id, prep_page_url, stability_check, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(body.company, body.role_title, body.status || 'Applied', body.next_action || '', body.recruiter || '', body.salary || '', body.job_link || '', body.location || '', body.jira_id || '', body.prep_page_url || '', body.stability_check || '', body.notes || '')
    .run()
  return Response.json({ success: true })
}

export async function onRequestPut(context) {
  const body = await context.request.json()
  await context.env.signal_os_db
    .prepare(`UPDATE applications SET company=?, role_title=?, status=?, next_action=?, recruiter=?, salary=?, job_link=?, location=?, jira_id=?, prep_page_url=?, stability_check=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .bind(body.company, body.role_title, body.status, body.next_action || '', body.recruiter || '', body.salary || '', body.job_link || '', body.location || '', body.jira_id || '', body.prep_page_url || '', body.stability_check || '', body.notes || '', body.id)
    .run()
  return Response.json({ success: true })
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url)
  const id = url.searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  // Cascade delete prep sections first
  await context.env.signal_os_db
    .prepare('DELETE FROM role_prep WHERE application_id = ?')
    .bind(id)
    .run()

  await context.env.signal_os_db
    .prepare('DELETE FROM applications WHERE id = ?')
    .bind(id)
    .run()

  return Response.json({ success: true })
}