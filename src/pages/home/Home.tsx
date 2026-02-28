import { useEffect, useState } from 'react'
import { formatCurrencyCOP, formatDate } from '../../utils/format'
import {
  getLastMovementDate,
  getMonthlyTotals,
  loadState,
  type SavyState,
} from '../../utils/storage'

export default function Home() {
  const [dashboardState, setDashboardState] = useState<SavyState>(() => loadState())

  useEffect(() => {
    const syncState = () => {
      setDashboardState(loadState())
    }

    window.addEventListener('storage', syncState)

    return () => {
      window.removeEventListener('storage', syncState)
    }
  }, [])

  const monthlyTotals = getMonthlyTotals(dashboardState.movimientos)
  const lastMovementDate = getLastMovementDate(dashboardState.movimientos)
  const lastUpdateText = lastMovementDate
    ? `Actualizado ${formatDate(lastMovementDate)}`
    : 'Sin movimientos aun'

  const handleAction = (actionName: string) => {
    console.log(`Accion pendiente: ${actionName}`)
  }

  return (
    <main className="app-shell">
      <section className="screen stack">
        <header className="topbar">
          <div className="brand-badge">S</div>
          <div>
            <p className="eyebrow">SAVY</p>
            <h1 className="title">Tu dashboard</h1>
          </div>
        </header>

        <article className="hero-card stack">
          <p className="eyebrow">Bienvenido</p>
          <div className="logo-placeholder logo-placeholder--image">
            <img
              className="logo-image"
              src="/assets/logo-savy.png"
              alt="Logo de SAVY"
            />
          </div>
          <p className="text-muted">
            Revisa tu dinero disponible, controla tus gastos y aparta un poco
            para tus metas de ahorro.
          </p>
        </article>

        <section className="balance-grid" aria-label="Resumen financiero">
          <article className="stat-card stat-card--highlight">
            <span className="stat-card__label">Dinero disponible</span>
            <strong className="stat-card__value">
              {formatCurrencyCOP(dashboardState.dineroDisponible)}
            </strong>
            <span className="stat-card__hint">{lastUpdateText}</span>
          </article>

          <article className="stat-card">
            <span className="stat-card__label">Ahorro total</span>
            <strong className="stat-card__value">
              {formatCurrencyCOP(dashboardState.ahorroTotal)}
            </strong>
            <span className="stat-card__hint">Sigue creciendo tu meta</span>
          </article>
        </section>

        <section className="panel stack" aria-label="Resumen del mes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Resumen</p>
              <h2 className="section-title">Resumen del mes</h2>
            </div>
          </div>

          <div className="mini-summary-grid">
            <article className="mini-summary">
              <span className="mini-summary__label">Ingresos del mes</span>
              <strong className="mini-summary__value">
                {formatCurrencyCOP(monthlyTotals.ingresos)}
              </strong>
            </article>
            <article className="mini-summary">
              <span className="mini-summary__label">Gastos del mes</span>
              <strong className="mini-summary__value">
                {formatCurrencyCOP(monthlyTotals.gastos)}
              </strong>
            </article>
          </div>
        </section>

        <section className="dashboard-actions" aria-label="Acciones principales">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => handleAction('Registrar ingreso')}
          >
            Registrar ingreso
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => handleAction('Registrar gasto')}
          >
            Registrar gasto
          </button>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => handleAction('Ahorrar')}
          >
            Ahorrar
          </button>
          <button
            className="button button--primary"
            type="button"
            onClick={() => handleAction('Ver resumen')}
          >
            Ver resumen
          </button>
        </section>
      </section>
    </main>
  )
}
