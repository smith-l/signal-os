// Knowledge base items that live in the Personal section instead of under
// the Knowledge Hub accordion. Matched by title since that's the visible,
// user-editable identifier — if one of these gets renamed later it'll need
// updating here too.
const PERSONAL_KB_TITLES = ['Core Behavioural Stories', 'The First 90 Days', 'Background Summary']

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

function kbButton(section, activeKbId) {
  return `
    <button
      class="nav-subitem ${String(section.id) === String(activeKbId) ? 'active' : ''}"
      data-kb-nav-id="${section.id}"
    >
      ${section.section_title}
    </button>
  `
}

export async function Sidebar(currentModule, activeKbId, personalManuallyExpanded, theme) {
  const kbSections = await getKbSections()
  const personalKb = kbSections.filter(s => PERSONAL_KB_TITLES.includes(s.section_title))
  const roleKb = kbSections.filter(s => !PERSONAL_KB_TITLES.includes(s.section_title))

  const knowledgeActive = currentModule === 'knowledge'
  const insidePersonal = currentModule === 'career' ||
    (currentModule === 'knowledge' && personalKb.some(s => String(s.id) === String(activeKbId)))
  const personalExpanded = personalManuallyExpanded || insidePersonal

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div>
          <h1>Signal OS</h1>
          <p class="version">Career Edition</p>
        </div>
        <button data-theme-toggle class="theme-toggle" title="Toggle light/dark mode">
          <i class="ti ${theme === 'light' ? 'ti-moon' : 'ti-sun'}" aria-hidden="true"></i>
        </button>
      </div>
      <nav>
        <button data-module="projects" class="${currentModule === 'projects' ? 'active' : ''}">
          <i class="ti ti-clipboard-list" aria-hidden="true"></i>
          Projects
        </button>

        <button data-module="people" class="${currentModule === 'people' ? 'active' : ''}">
          <i class="ti ti-users" aria-hidden="true"></i>
          Team
        </button>

        <button data-module="playbooks" class="${currentModule === 'playbooks' ? 'active' : ''}">
          <i class="ti ti-layout-grid" aria-hidden="true"></i>
          Playbooks
        </button>

        <div class="nav-group">
          <button
            data-module="knowledge"
            class="${knowledgeActive ? 'active' : ''} nav-group-toggle"
          >
            <i class="ti ti-database" aria-hidden="true"></i>
            Knowledge Hub
            <i class="ti ti-chevron-down nav-chevron ${knowledgeActive ? 'expanded' : ''}" aria-hidden="true"></i>
          </button>
          ${knowledgeActive ? `
            <div class="nav-subitems">
              ${roleKb.map(s => kbButton(s, activeKbId)).join('')}
            </div>
          ` : ''}
        </div>

        <div class="nav-group">
          <button
            data-personal-toggle
            class="${insidePersonal ? 'active' : ''} nav-group-toggle"
          >
            <i class="ti ti-user" aria-hidden="true"></i>
            Personal
            <i class="ti ti-chevron-down nav-chevron ${personalExpanded ? 'expanded' : ''}" aria-hidden="true"></i>
          </button>
          ${personalExpanded ? `
            <div class="nav-subitems">
              <button
                data-module="career"
                class="nav-subitem ${currentModule === 'career' ? 'active' : ''}"
              >
                Applications
              </button>
              ${personalKb.map(s => kbButton(s, activeKbId)).join('')}
            </div>
          ` : ''}
        </div>
      </nav>
    </aside>
  `
}

export function clearKbCache() {
  kbSectionsCache = null
}