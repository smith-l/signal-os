export async function onRequestPost(context) {
  const body = await context.request.json()
  const { prompt, system, person_id, section_id, write_to_db } = body

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
      system: system || 'You are helping Lee Smith organize coaching notes about a member of his team. Keep the tone factual and development-focused. Respond in markdown.',
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await anthropicRes.json()

  const text = (data.content || [])
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n\n') || ''

  if (write_to_db && section_id) {
    await context.env.signal_os_db
      .prepare('UPDATE people_prep SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(text, section_id)
      .run()
  }

  return Response.json({ text, success: true })
}