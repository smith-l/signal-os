export async function onRequestPost(context) {
  const body = await context.request.json()
  const { prompt, system, application_id, section_id, write_to_db } = body

  if (!prompt) return Response.json({ error: 'No prompt' }, { status: 400 })

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': context.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: system || 'You are an expert interview prep and job search assistant for Lee Smith, a Senior Solutions Engineering leader based in London. Help prepare for SE leadership interviews at enterprise SaaS companies. Respond in markdown.',
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await anthropicRes.json()
  const text = data.content?.[0]?.text || ''

  if (write_to_db && section_id) {
    await context.env.signal_os_db
      .prepare('UPDATE role_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(text, section_id)
      .run()
  }

  return Response.json({ text, success: true })
}