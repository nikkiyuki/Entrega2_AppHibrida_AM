export type TipoMovimiento = 'Ingreso' | 'Gasto' | 'Ahorro'

export interface Movimiento {
  id: string
  tipo: TipoMovimiento
  monto: number
  categoria: string
  fechaISO: string
}

export interface SavyState {
  dineroDisponible: number
  ahorroTotal: number
  movimientos: Movimiento[]
}

export const SAVY_STORAGE_KEY = 'savy_state'

const defaultState: SavyState = {
  dineroDisponible: 0,
  ahorroTotal: 0,
  movimientos: [],
}

export function loadState(): SavyState {
  const savedState = window.localStorage.getItem(SAVY_STORAGE_KEY)

  if (!savedState) {
    saveState(defaultState)
    return defaultState
  }

  try {
    const parsedState = JSON.parse(savedState) as Partial<SavyState>

    return {
      dineroDisponible: Number(parsedState.dineroDisponible) || 0,
      ahorroTotal: Number(parsedState.ahorroTotal) || 0,
      movimientos: Array.isArray(parsedState.movimientos)
        ? parsedState.movimientos
        : [],
    }
  } catch {
    saveState(defaultState)
    return defaultState
  }
}

export function saveState(state: SavyState) {
  window.localStorage.setItem(SAVY_STORAGE_KEY, JSON.stringify(state))
}

export function getMonthlyTotals(movimientos: Movimiento[]) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return movimientos.reduce(
    (totals, movimiento) => {
      const movementDate = new Date(movimiento.fechaISO)

      if (
        movementDate.getMonth() !== currentMonth ||
        movementDate.getFullYear() !== currentYear
      ) {
        return totals
      }

      if (movimiento.tipo === 'Ingreso') {
        totals.ingresos += movimiento.monto
      }

      if (movimiento.tipo === 'Gasto') {
        totals.gastos += movimiento.monto
      }

      return totals
    },
    { ingresos: 0, gastos: 0 },
  )
}

export function getLastMovementDate(movimientos: Movimiento[]) {
  if (movimientos.length === 0) {
    return null
  }

  return [...movimientos]
    .sort(
      (current, next) =>
        new Date(next.fechaISO).getTime() - new Date(current.fechaISO).getTime(),
    )[0]
    .fechaISO
}
