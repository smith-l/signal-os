const NAV_ITEMS = [
  { id: 'career', label: 'Applications' },
  { id: 'stories', label: 'Stories' },
  { id: 'tasks', label: 'Task Hub' },
  { id: 'projects', label: 'Project Hub' },
  { id: 'knowledge', label: 'Knowledge Hub' }
]

export function Sidebar(currentModule) {
  return `
    <aside class="sidebar">
      <h1>Signal OS</h1>

      <nav>
        ${NAV_ITEMS.map(item => `
          <button
            data-module="${item.id}"
            class="${currentModule === item.id ? 'active' : ''}"
          >
            ${item.label}
          </button>
        `).join('')}
      </nav>
    </aside>
  `
}