export function Tasks() {
  return `
    <header class="page-header">
      <div class="page-header-left">
        <p class="eyebrow">Signal OS</p>
        <h2>Task Hub</h2>
      </div>
    </header>

    <div class="iframe-shell">
      <iframe
        src="https://taskmanager-8hu.pages.dev/"
        title="ToDay Task Hub"
        class="embedded-app"
        loading="lazy"
      ></iframe>
    </div>
  `;
}