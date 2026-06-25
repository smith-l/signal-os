import {
  getStories,
  updateStory
} from '../services/storyService.js'

export async function openStoryPanel(storyId, onSaved) {
  const stories = await getStories()

  const story =
    stories.find(item => String(item.id) === String(storyId))

  if (!story) return

  const panel =
    document.querySelector('#story-panel')

  const content =
    document.querySelector('#story-panel-content')

  content.innerHTML = `
    <h2>${story.title}</h2>

    <label>Title</label>
    <input id="story-panel-title" value="${story.title || ''}" />

    <label>Situation</label>
    <textarea id="story-panel-situation">${story.situation || ''}</textarea>

    <label>Task</label>
    <textarea id="story-panel-task">${story.task || ''}</textarea>

    <label>Action</label>
    <textarea id="story-panel-action">${story.action || ''}</textarea>

    <label>Result</label>
    <textarea id="story-panel-result">${story.result || ''}</textarea>

    <label>Tags</label>
    <input id="story-panel-tags" value="${story.tags || ''}" />

    <label>Competency</label>
    <input id="story-panel-competency" value="${story.competency || ''}" />

    <button id="save-story-panel" class="panel-save">
      Save Story
    </button>
  `

  panel.classList.remove('hidden')

  document
    .querySelector('#save-story-panel')
    .addEventListener('click', async () => {
      await updateStory({
        id: story.id,
        title: document.querySelector('#story-panel-title').value,
        situation: document.querySelector('#story-panel-situation').value,
        task: document.querySelector('#story-panel-task').value,
        action: document.querySelector('#story-panel-action').value,
        result: document.querySelector('#story-panel-result').value,
        tags: document.querySelector('#story-panel-tags').value,
        competency: document.querySelector('#story-panel-competency').value
      })

      if (onSaved) {
        await onSaved()
      }
    })
}