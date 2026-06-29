const NAV_ITEMS = [
  { id: 'career',    label: 'Applications', icon: 'ti-briefcase' },
  { id: 'stories',   label: 'Stories',      icon: 'ti-book' },
  { id: 'playbooks', label: 'Playbooks',    icon: 'ti-layout-grid' },
  { id: 'tasks',     label: 'Task Hub',     icon: 'ti-checkbox' },
  { id: 'knowledge', label: 'Knowledge Hub',icon: 'ti-database' },
]

export function Sidebar(currentModule) {
  return `
    <aside class="sidebar">
      <h1>Signal OS</h1>
      <p class="version">Career Edition</p>
      <nav>
        ${NAV_ITEMS.map(item => `
          <button
            data-module="${item.id}"
            class="${currentModule === item.id ? 'active' : ''}"
          >
            <i class="ti ${item.icon}" aria-hidden="true"></i>
            ${item.label}
          </button>
        `).join('')}
      </nav>
    </aside>
  `
}
