import { Sidebar } from './Sidebar.js'

export async function AppShell(currentModule, activeKbId) {
  return `
    <div id="record-view" class="hidden"></div>
    <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Open menu">
      <i class="ti ti-menu-2" aria-hidden="true"></i>
    </button>
    <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
    <main class="app-shell" id="main-content">
      ${await Sidebar(currentModule, activeKbId)}
      <section class="main-panel">
        <div id="module-content">Loading...</div>
      </section>
    </main>
  `
}