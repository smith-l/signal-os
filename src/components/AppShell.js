import { Sidebar } from './Sidebar.js'

export function AppShell(currentModule) {
  return `
    <div id="record-view" class="hidden"></div>
    <main class="app-shell" id="main-content">
      ${Sidebar(currentModule)}
      <section class="main-panel">
        <div id="module-content">Loading...</div>
      </section>
    </main>
  `
}