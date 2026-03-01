export type TipoMovimiento = 'Ingreso' | 'Gasto' | 'Ahorro' | 'RetiroAhorro'

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

interface AddIngresoInput {
  categoria: string
  monto: number
}

interface AddGastoInput {
  categoria: string
  monto: number
}

interface AgregarDineroAhorroInput {
  ahorroId: string
  monto: number
}

interface RetirarDeAhorroInput {
  ahorroId: string
  monto: number
}

interface EliminarAhorroInput {
  ahorroId: string
}

interface ActualizarAhorroInput {
  ahorroId: string
  categoria: string
  nombre: string
  meta: number
}

export function addIngreso(input: AddIngresoInput) {
  const currentState = loadState()

  if (!input.monto || input.monto <= 0) {
    throw new Error('El monto del ingreso debe ser mayor a cero.')
  }

  const nowISO = new Date().toISOString()
  const nextState: SavyState = {
    ...currentState,
    dineroDisponible: currentState.dineroDisponible + input.monto,
    movimientos: [
      {
        id: `mov-${Date.now()}`,
        tipo: 'Ingreso',
        monto: input.monto,
        categoria: input.categoria,
        fechaISO: nowISO,
      },
      ...currentState.movimientos,
    ],
  }

  saveState(nextState)
  return nextState
}

export function addGasto(input: AddGastoInput) {
  const currentState = loadState()

  if (!input.monto || input.monto <= 0) {
    throw new Error('El monto del gasto debe ser mayor a cero.')
  }

  if (input.monto > currentState.dineroDisponible) {
    throw new Error('No puedes gastar mas dinero del disponible.')
  }

  const nowISO = new Date().toISOString()
  const nextState: SavyState = {
    ...currentState,
    dineroDisponible: currentState.dineroDisponible - input.monto,
    movimientos: [
      {
        id: `mov-${Date.now()}`,
        tipo: 'Gasto',
        monto: input.monto,
        categoria: input.categoria,
        fechaISO: nowISO,
      },
      ...currentState.movimientos,
    ],
  }

  saveState(nextState)
  return nextState
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

export function agregarDineroAhorro(input: AgregarDineroAhorroInput) {
  const currentState = loadState()
  const ahorro = currentState.ahorros.find((item) => item.id === input.ahorroId)

  if (!ahorro) {
    throw new Error('No se encontro el ahorro seleccionado.')
  }

  if (!input.monto || input.monto <= 0) {
    throw new Error('El monto debe ser mayor a cero.')
  }

  if (input.monto > currentState.dineroDisponible) {
    throw new Error('No tienes suficiente dinero disponible.')
  }

  const restanteMeta = Math.max(0, ahorro.meta - ahorro.acumulado)

  if (input.monto > restanteMeta) {
    throw new Error('No puedes agregar mas dinero del necesario para completar esta meta.')
  }

  const nowISO = new Date().toISOString()
  const nextState: SavyState = {
    ...currentState,
    dineroDisponible: currentState.dineroDisponible - input.monto,
    ahorroTotal: currentState.ahorroTotal + input.monto,
    movimientos: [
      {
        id: `mov-${Date.now()}`,
        tipo: 'Ahorro',
        monto: input.monto,
        categoria: ahorro.nombre,
        fechaISO: nowISO,
      },
      ...currentState.movimientos,
    ],
    ahorros: currentState.ahorros.map((item) =>
      item.id === ahorro.id
        ? {
            ...item,
            acumulado: item.acumulado + input.monto,
            fechaISO: nowISO,
          }
        : item,
    ),
  }

  saveState(nextState)
  return nextState
}

export function retirarDeAhorro(input: RetirarDeAhorroInput) {
  const currentState = loadState()
  const ahorro = currentState.ahorros.find((item) => item.id === input.ahorroId)

  if (!ahorro) {
    throw new Error('No se encontro el ahorro seleccionado.')
  }

  if (!input.monto || input.monto <= 0) {
    throw new Error('El monto a retirar debe ser mayor a cero.')
  }

  if (input.monto > ahorro.acumulado) {
    throw new Error('No puedes retirar mas dinero del que tienes ahorrado.')
  }

  const nowISO = new Date().toISOString()
  const nextAhorros = currentState.ahorros
    .map((item) =>
      item.id === ahorro.id
        ? {
            ...item,
            acumulado: item.acumulado - input.monto,
            fechaISO: nowISO,
          }
        : item,
    )
    .filter((item) => item.acumulado > 0)

  const nextState: SavyState = {
    ...currentState,
    dineroDisponible: currentState.dineroDisponible + input.monto,
    ahorroTotal: Math.max(0, currentState.ahorroTotal - input.monto),
    movimientos: [
      {
        id: `mov-${Date.now()}`,
        tipo: 'RetiroAhorro',
        monto: input.monto,
        categoria: ahorro.nombre,
        fechaISO: nowISO,
      },
      ...currentState.movimientos,
    ],
    ahorros: nextAhorros,
  }

  saveState(nextState)
  return nextState
}

export function eliminarAhorro(input: EliminarAhorroInput) {
  const currentState = loadState()
  const ahorro = currentState.ahorros.find((item) => item.id === input.ahorroId)

  if (!ahorro) {
    throw new Error('No se encontro el ahorro que deseas eliminar.')
  }

  const nowISO = new Date().toISOString()
  const nextState: SavyState = {
    ...currentState,
    dineroDisponible: currentState.dineroDisponible + ahorro.acumulado,
    ahorroTotal: Math.max(0, currentState.ahorroTotal - ahorro.acumulado),
    movimientos: ahorro.acumulado
      ? [
          {
            id: `mov-${Date.now()}`,
            tipo: 'RetiroAhorro',
            monto: ahorro.acumulado,
            categoria: ahorro.nombre,
            fechaISO: nowISO,
          },
          ...currentState.movimientos,
        ]
      : currentState.movimientos,
    ahorros: currentState.ahorros.filter((item) => item.id !== input.ahorroId),
  }

  saveState(nextState)
  return nextState
}

export function actualizarAhorro(input: ActualizarAhorroInput) {
  const currentState = loadState()
  const ahorro = currentState.ahorros.find((item) => item.id === input.ahorroId)

  if (!ahorro) {
    throw new Error('No se encontro el ahorro que deseas editar.')
  }

  const nextState: SavyState = {
    ...currentState,
    ahorros: currentState.ahorros.map((item) =>
      item.id === ahorro.id
        ? {
            ...item,
            categoria: input.categoria,
            nombre: input.nombre.trim() || input.categoria,
            meta: input.meta,
          }
        : item,
    ),
  }

  saveState(nextState)
  return nextState
}
