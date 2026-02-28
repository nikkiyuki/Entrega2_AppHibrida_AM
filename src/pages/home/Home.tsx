export default function Home() {
  return (
    <main className="app-shell">
      <section className="screen stack">
        <header className="topbar">
          <div className="brand-badge">S</div>
          <div>
            <p className="eyebrow">SAVY</p>
            <h1 className="title">Dashboard principal</h1>
          </div>
        </header>

        <article className="hero-card stack">
          <p className="eyebrow">Bienvenido a tu espacio financiero</p>
          <div className="logo-placeholder">Logo SAVY</div>
          <p className="text-muted">
            Organiza tu dinero, revisa tus metas y toma mejores decisiones cada
            semana.
          </p>
        </article>

        <section className="balance-grid" aria-label="Resumen financiero">
          <article className="stat-card stat-card--highlight">
            <span className="stat-card__label">Dinero disponible</span>
            <strong className="stat-card__value">$120.000</strong>
            <span className="stat-card__hint">Actualizado hoy</span>
          </article>

          <article className="stat-card">
            <span className="stat-card__label">Ahorro total</span>
            <strong className="stat-card__value">$50.000</strong>
            <span className="stat-card__hint">Meta del mes en progreso</span>
          </article>
        </section>

        <section className="panel stack" aria-label="Resumen del mes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Resumen</p>
              <h2 className="section-title">Movimiento del mes</h2>
            </div>
          </div>

          <div className="mini-summary-grid">
            <article className="mini-summary">
              <span className="mini-summary__label">Ingresos</span>
              <strong className="mini-summary__value">$120.000</strong>
            </article>
            <article className="mini-summary">
              <span className="mini-summary__label">Gastos</span>
              <strong className="mini-summary__value">$70.000</strong>
            </article>
          </div>
        </section>

        <section className="dashboard-actions" aria-label="Acciones principales">
          <button className="button button--secondary" type="button">
            Registrar ingreso
          </button>
          <button className="button button--secondary" type="button">
            Registrar gasto
          </button>
          <button className="button button--secondary" type="button">
            Ahorrar
          </button>
          <button className="button button--primary" type="button">
            Ver resumen
          </button>
        </section>
      </section>
    </main>
  )
}
