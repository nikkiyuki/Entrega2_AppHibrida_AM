export type TipoMovimiento = 'Ingreso' | 'Gasto' | 'Ahorro'

export interface Movimiento {
  id: string
  tipo: TipoMovimiento
  monto: number
  categoria: string
  fechaISO: string
}

export interface MetaAhorro {
  id: string
  categoria: string
  nombre: string
  meta: number
  acumulado: number
  fechaISO: string
}

export interface SavyState {
  dineroDisponible: number
  ahorroTotal: number
  movimientos: Movimiento[]
  ahorros: MetaAhorro[]
}

export const SAVY_STORAGE_KEY = 'savy_state'
export const SAVY_STATE_EVENT = 'savy-state-change'

const defaultState: SavyState = {
  dineroDisponible: 0,
  ahorroTotal: 0,
  movimientos: [],
  ahorros: [],
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
      ahorros: Array.isArray(parsedState.ahorros) ? parsedState.ahorros : [],
    }
  } catch {
    saveState(defaultState)
    return defaultState
  }
}

export function saveState(state: SavyState) {
  window.localStorage.setItem(SAVY_STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(SAVY_STATE_EVENT))
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

interface AddAhorroInput {
  categoria: string
  nombre: string
  meta: number
  monto: number
}

export function addAhorro(input: AddAhorroInput) {
  const currentState = loadState()
  const nowISO = new Date().toISOString()
  const ahorroName = input.nombre.trim() || input.categoria
  const existingAhorro = currentState.ahorros.find(
    (ahorro) =>
      ahorro.nombre.toLowerCase() === ahorroName.toLowerCase() &&
      ahorro.categoria.toLowerCase() === input.categoria.toLowerCase(),
  )

  const nextAhorros = existingAhorro
    ? currentState.ahorros.map((ahorro) =>
        ahorro.id === existingAhorro.id
          ? {
              ...ahorro,
              meta: input.meta || ahorro.meta,
              acumulado: ahorro.acumulado + input.monto,
              fechaISO: nowISO,
            }
          : ahorro,
      )
    : [
        ...currentState.ahorros,
        {
          id: `ahorro-${Date.now()}`,
          categoria: input.categoria,
          nombre: ahorroName,
          meta: input.meta,
          acumulado: input.monto,
          fechaISO: nowISO,
        },
      ]

  const nextState: SavyState = {
    ...currentState,
    dineroDisponible: currentState.dineroDisponible - input.monto,
    ahorroTotal: currentState.ahorroTotal + input.monto,
    movimientos: [
      {
        id: `mov-${Date.now()}`,
        tipo: 'Ahorro',
        monto: input.monto,
        categoria: ahorroName,
        fechaISO: nowISO,
      },
      ...currentState.movimientos,
    ],
    ahorros: nextAhorros,
  }

  saveState(nextState)
  return nextState
}
