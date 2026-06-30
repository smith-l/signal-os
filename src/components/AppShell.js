import { Sidebar } from './Sidebar.js'

export async function AppShell(currentModule, activeKbId) {
  return `
    <div id="record-view" class="hidden"></div>
    <main class="app-shell" id="main-content">
      ${await Sidebar(currentModule, activeKbId)}
      <section class="main-panel">
        <div id="module-content">Loading...</div>
      </section>
    </main>
  `
}