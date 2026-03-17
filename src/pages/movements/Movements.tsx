import { useEffect, useState } from 'react'
import './movements.scss'
import AppNavbar from '../../components/AppNavbar'
import { getExpenseCategoryLabel } from '../../utils/expenseCategories'
import { formatCurrencyCOP, formatDate } from '../../utils/format'
import { getIncomeCategoryLabel } from '../../utils/incomeCategories'
import { getSavingCategoryLabel } from '../../utils/savingCategories'
import {
  SAVY_STATE_EVENT,
  getMonthlyTotals,
  loadState,
  type MetaAhorro,
  type Movimiento,
} from '../../utils/storage'

interface MovementsProps {
  onBack: () => void
}

function getMovementCategoryLabel(movement: Movimiento) {
  if (movement.tipo === 'Ingreso') {
    return getIncomeCategoryLabel(movement.categoria)
  }

  if (movement.tipo === 'Gasto') {
    return getExpenseCategoryLabel(movement.categoria)
  }

  return movement.categoria
}

export default function Movements({ onBack }: MovementsProps) {
  const [movements, setMovements] = useState<Movimiento[]>([])
  const [ahorros, setAhorros] = useState<MetaAhorro[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)

  useEffect(() => {
    const syncState = () => {
      const state = loadState()
      const monthlyTotals = getMonthlyTotals(state.movimientos)

      setMovements(
        [...state.movimientos].sort(
          (current, next) =>
            new Date(next.fechaISO).getTime() - new Date(current.fechaISO).getTime(),
        ),
      )
      setAhorros(state.ahorros)
      setTotalIncome(monthlyTotals.ingresos)
      setTotalExpense(monthlyTotals.gastos)
    }

    syncState()

    window.addEventListener('storage', syncState)
    window.addEventListener(SAVY_STATE_EVENT, syncState)

    return () => {
      window.removeEventListener('storage', syncState)
      window.removeEventListener(SAVY_STATE_EVENT, syncState)
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="screen screen--movements stack">
        <AppNavbar title="Resumen" onBack={onBack} />

        <article className="panel stack">
          <div className="saving-header">
            <p className="eyebrow">Movimientos recientes</p>
            <div className="saving-divider" aria-hidden="true" />
          </div>

          {movements.length > 0 ? (
            <div className="saving-list">
              {movements.map((movement) => (
                <article key={movement.id} className="saving-item">
                  <div className="saving-item__header">
                    <div className="saving-item__identity">
                      <strong className="saving-item__name">{movement.tipo}</strong>
                      <span className="saving-item__category">
                        {getMovementCategoryLabel(movement)}
                      </span>
                    </div>
                    <span className="saving-item__badge">{formatDate(movement.fechaISO)}</span>
                  </div>
                  <div className="saving-item__amounts">
                    <span>{formatCurrencyCOP(movement.monto)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="saving-empty">
              <p className="text-muted">No hay movimientos registrados.</p>
            </div>
          )}
        </article>

        <section className="panel stack" aria-label="Resumen de movimientos">
          <div className="saving-header">
            <p className="eyebrow">Resumen</p>
            <div className="saving-divider" aria-hidden="true" />
          </div>

          <div className="dashboard-actions">
            <article className="stat-card">
              <span className="stat-card__label">Total de ingresos en el mes</span>
              <strong className="stat-card__value">
                {formatCurrencyCOP(totalIncome)}
              </strong>
            </article>

            <article className="stat-card">
              <span className="stat-card__label">Total de gastos al mes</span>
              <strong className="stat-card__value">
                {formatCurrencyCOP(totalExpense)}
              </strong>
            </article>
          </div>
        </section>

        <section className="panel stack" aria-label="Ahorros guardados">
          <div className="saving-header">
            <p className="eyebrow">Ahorros</p>
            <div className="saving-divider" aria-hidden="true" />
          </div>

          {ahorros.length > 0 ? (
            <div className="saving-list">
              {ahorros.map((ahorro) => (
                <article key={ahorro.id} className="saving-item">
                  <div className="saving-item__header">
                    <div className="saving-item__identity">
                      <strong className="saving-item__name">{ahorro.nombre}</strong>
                      <span className="saving-item__category">
                        {getSavingCategoryLabel(ahorro.categoria)}
                      </span>
                    </div>
                    <span className="saving-item__badge">
                      {Math.min(
                        100,
                        Math.round(
                          ahorro.meta ? (ahorro.acumulado / ahorro.meta) * 100 : 0,
                        ),
                      )}
                      %
                    </span>
                  </div>
                  <div className="saving-item__amounts">
                    <span>{formatCurrencyCOP(ahorro.acumulado)}</span>
                    <span>/ {formatCurrencyCOP(ahorro.meta)}</span>
                  </div>
                  <div className="saving-progress" aria-hidden="true">
                    <span
                      className="saving-progress__fill"
                      style={{
                        width: `${Math.min(
                          100,
                          ahorro.meta ? (ahorro.acumulado / ahorro.meta) * 100 : 0,
                        )}%`,
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="saving-empty">
              <p className="text-muted">Todavía no hay metas de ahorro registradas.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
