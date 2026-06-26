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
      (company, role_title, status, next_action, recruiter, salary, job_link, location, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      body.company,
      body.role_title,
      body.status || 'Applied',
      body.next_action || '',
      body.recruiter || '',
      body.salary || '',
      body.job_link || '',
      body.location || '',
      body.notes || ''
    )
    .run()

  return Response.json({ success: true })
}

export async function onRequestPut(context) {
  const body = await context.request.json()

  await context.env.signal_os_db
    .prepare(`
      UPDATE applications
      SET
        company = ?,
        role_title = ?,
        status = ?,
        next_action = ?,
        recruiter = ?,
        salary = ?,
        job_link = ?,
        location = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(
      body.company,
      body.role_title,
      body.status,
      body.next_action || '',
      body.recruiter || '',
      body.salary || '',
      body.job_link || '',
      body.location || '',
      body.notes || '',
      body.id
    )
    .run()

  return Response.json({ success: true })
}export async function onRequestGet(context) {
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
      (company, role_title, status, next_action, recruiter, salary, job_link, location, jira_id, prep_page_url, stability_check, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      body.company,
      body.role_title,
      body.status || 'Applied',
      body.next_action || '',
      body.recruiter || '',
      body.salary || '',
      body.job_link || '',
      body.location || '',
      body.jira_id || '',
      body.prep_page_url || '',
      body.stability_check || '',
      body.notes || ''
    )
    .run()

  return Response.json({ success: true })
}

export async function onRequestPut(context) {
  const body = await context.request.json()

  await context.env.signal_os_db
    .prepare(`
      UPDATE applications
      SET
        company = ?,
        role_title = ?,
        status = ?,
        next_action = ?,
        recruiter = ?,
        salary = ?,
        job_link = ?,
        location = ?,
        jira_id = ?,
        prep_page_url = ?,
        stability_check = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(
      body.company,
      body.role_title,
      body.status,
      body.next_action || '',
      body.recruiter || '',
      body.salary || '',
      body.job_link || '',
      body.location || '',
      body.jira_id || '',
      body.prep_page_url || '',
      body.stability_check || '',
      body.notes || '',
      body.id
    )
    .run()

  return Response.json({ success: true })
}