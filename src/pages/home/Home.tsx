import { useEffect, useState } from 'react'
import { formatCurrencyCOP, formatDate } from '../../utils/format'
import { getLastMovementDate, loadState, type SavyState } from '../../utils/storage'

interface HomeProps {
  onNavigateToIncome: () => void
  onNavigateToExpense: () => void
  onNavigateToSaving: () => void
  onNavigateToMovements: () => void
}

export default function Home({
  onNavigateToIncome,
  onNavigateToExpense,
  onNavigateToSaving,
  onNavigateToMovements,
}: HomeProps) {
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

  const lastMovementDate = getLastMovementDate(dashboardState.movimientos)
  const lastUpdateText = lastMovementDate
    ? `Actualizado ${formatDate(lastMovementDate)}`
    : 'Sin movimientos aun'

  return (
    <main className="app-shell">
      <section className="screen stack">
        <article className="dashboard-hero stack">
          <div className="dashboard-logo-box">
            <img
              className="dashboard-logo-image"
              src="/assets/logo-savy.png"
              alt="Logo de SAVY"
            />
          </div>

          <div className="dashboard-welcome">
            <p className="dashboard-welcome__text">
              Cada paso cuenta: registra tus ingresos, controla tus gastos y haz crecer tus ahorros.
            </p>
            <div className="dashboard-welcome__divider" aria-hidden="true" />
          </div>
        </article>

        <section className="dashboard-stack" aria-label="Resumen financiero">
          <article className="stat-card stat-card--highlight">
            <span className="stat-card__label">Total disponible</span>
            <strong className="stat-card__value">
              {formatCurrencyCOP(dashboardState.dineroDisponible)}
            </strong>
            <span className="stat-card__hint">{lastUpdateText}</span>
          </article>

          <article className="stat-card">
            <span className="stat-card__label">Total en ahorros</span>
            <strong className="stat-card__value">
              {formatCurrencyCOP(dashboardState.ahorroTotal)}
            </strong>
            <span className="stat-card__hint">Sigue creciendo tu meta</span>
          </article>
        </section>

        <section className="dashboard-actions" aria-label="Acciones principales">
          <button
            className="button button--dashboard button--primary"
            type="button"
            onClick={onNavigateToIncome}
          >
            Registrar ingreso
          </button>
          <button
            className="button button--dashboard button--secondary"
            type="button"
            onClick={onNavigateToExpense}
          >
            Registrar gasto
          </button>
          <button
            className="button button--dashboard button--secondary"
            type="button"
            onClick={onNavigateToSaving}
          >
            Registrar ahorro
          </button>
          <button
            className="button button--dashboard button--secondary"
            type="button"
            onClick={onNavigateToMovements}
          >
            Resumen o movimientos
          </button>
        </section>
      </section>
    </main>
  )
}
