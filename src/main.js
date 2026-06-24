import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="app-shell">
    <aside class="sidebar">
      <h1>Signal OS</h1>
      <nav>
        <button>Dashboard</button>
        <button>Career Hub</button>
        <button>Task Hub</button>
        <button>Project Hub</button>
        <button>Knowledge Hub</button>
      </nav>
    </aside>

    <section class="main-panel">
      <header>
        <p class="eyebrow">Personal Operating System</p>
        <h2>Dashboard</h2>
        <p>Choose a module to continue.</p>
      </header>

      <div class="module-grid">
        <article>Career Hub</article>
        <article>Task Hub</article>
        <article>Project Hub</article>
        <article>Knowledge Hub</article>
      </div>
    </section>
  </main>
`