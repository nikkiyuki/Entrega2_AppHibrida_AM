export default function Home() {
  return (
    <main className="app-shell">
      <section className="screen stack">
        <header className="topbar">
          <div className="brand-badge">S</div>
          <div>
            <p className="eyebrow">SAVY</p>
            <h1 className="title">Base visual del proyecto</h1>
          </div>
        </header>

        <article className="panel stack">
          <p className="text-muted">
            SASS ya esta conectado al proyecto. Desde aqui podemos empezar a
            construir las pantallas del app sin trabajar sobre estilos sueltos.
          </p>
          <div className="actions-grid">
            <button className="button button--primary" type="button">
              Accion principal
            </button>
            <button className="button button--secondary" type="button">
              Accion secundaria
            </button>
          </div>
        </article>
      </section>
    </main>
  )
}
