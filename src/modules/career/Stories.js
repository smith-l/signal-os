export async function Stories() {

  const response = await fetch('/api/stories')
  const stories = await response.json()

  return `
    <header class="page-header">
      <p class="eyebrow">Career Hub</p>
      <h2>Stories</h2>

      <button id="add-story-btn">
        + Add Story
      </button>
    </header>

    <div id="story-form" class="add-form" style="display:none;">
      <input id="story-title" placeholder="Story Title" />
      <button id="save-story">Save Story</button>
    </div>

    <div class="story-grid">
      ${stories.map(story => `
        <article class="story-card">
          <h3>${story.title}</h3>

          <p>
            ${story.tags || 'No tags'}
          </p>
        </article>
      `).join('')}
    </div>
  `
}