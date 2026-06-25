import { Sidebar } from './Sidebar.js'

export function AppShell(currentModule) {

  return `
    <main class="app-shell">

      ${Sidebar(currentModule)}

      <section class="main-panel">

        <div id="module-content">

          Loading...

        </div>

      </section>

    </main>
  `

}