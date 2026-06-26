export async function onRequestPost(context) {
  const body = await context.request.json()
  const { application_id, fields, prep_sections } = body

  if (!application_id) return Response.json({ error: 'No application_id' }, { status: 400 })

  // Update application fields
  if (fields && Object.keys(fields).length > 0) {
    const allowed = ['status','next_action','notes','recruiter','salary','stability_check','location','job_link']
    const updates = Object.entries(fields).filter(([k]) => allowed.includes(k))
    if (updates.length > 0) {
      const setClauses = updates.map(([k]) => `${k} = ?`).join(', ')
      const values = updates.map(([, v]) => v)
      await context.env.signal_os_db
        .prepare(`UPDATE applications SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
        .bind(...values, application_id)
        .run()
    }
  }

  // Update prep sections
  if (prep_sections && prep_sections.length > 0) {
    for (const section of prep_sections) {
      if (section.section_key && section.content !== undefined) {
        // Check if section exists
        const existing = await context.env.signal_os_db
          .prepare('SELECT id FROM role_prep WHERE application_id = ? AND section_key = ?')
          .bind(application_id, section.section_key)
          .first()

        if (existing) {
          await context.env.signal_os_db
            .prepare('UPDATE role_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .bind(section.content, existing.id)
            .run()
        } else {
          await context.env.signal_os_db
            .prepare('INSERT INTO role_prep (application_id, section_key, section_title, content, sort_order) VALUES (?, ?, ?, ?, 99)')
            .bind(application_id, section.section_key, section.section_title || section.section_key, section.content)
            .run()
        }
      }
    }
  }

  // Return updated application
  const app = await context.env.signal_os_db
    .prepare('SELECT * FROM applications WHERE id = ?')
    .bind(application_id)
    .first()

  return Response.json({ success: true, application: app })
}