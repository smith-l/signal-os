const NAV_ITEMS = [
  { id: 'career',    label: 'Applications', icon: 'ti-briefcase' },
  { id: 'playbooks', label: 'Playbooks',    icon: 'ti-layout-grid' },
  { id: 'knowledge', label: 'Knowledge Hub',icon: 'ti-database' },
]

let kbSectionsCache = null

async function getKbSections() {
  if (kbSectionsCache) return kbSectionsCache
  try {
    const res = await fetch('/api/knowledge-base')
    kbSectionsCache = await res.json()
    return kbSectionsCache
  } catch(e) {
    console.error('KB sections fetch error:', e)
    return []
  }
}

export async function Sidebar(currentModule, activeKbId) {
  const knowledgeExpanded = currentModule === 'knowledge'
  const kbSections = knowledgeExpanded ? await getKbSections() : []

  return `
    <aside class="sidebar">
      <h1>Signal OS</h1>
      <p class="version">Career Edition</p>
      <nav>
        ${NAV_ITEMS.map(item => {
          const isKnowledge = item.id === 'knowledge'
          const isActive = currentModule === item.id

          if (!isKnowledge) {
            return `
              <button
                data-module="${item.id}"
                class="${isActive ? 'active' : ''}"
              >
                <i class="ti ${item.icon}" aria-hidden="true"></i>
                ${item.label}
              </button>
            `
          }

          return `
            <div class="nav-group">
              <button
                data-module="${item.id}"
                class="${isActive ? 'active' : ''} nav-group-toggle"
              >
                <i class="ti ${item.icon}" aria-hidden="true"></i>
                ${item.label}
                <i class="ti ti-chevron-down nav-chevron ${isActive ? 'expanded' : ''}" aria-hidden="true"></i>
              </button>
              ${isActive ? `
                <div class="nav-subitems">
                  ${kbSections.map(s => `
                    <button
                      class="nav-subitem ${String(s.id) === String(activeKbId) ? 'active' : ''}"
                      data-kb-nav-id="${s.id}"
                    >
                      ${s.section_title}
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `
        }).join('')}
      </nav>
    </aside>
  `
}

export function clearKbCache() {
  kbSectionsCache = null
}