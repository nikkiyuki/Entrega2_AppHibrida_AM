export const EXPENSE_CATEGORIES = [
  { value: 'Comida', label: 'Comida' },
  { value: 'Transporte', label: 'Transporte' },
  { value: 'Ocio', label: 'Ocio' },
  { value: 'Estudio', label: 'Estudio' },
  { value: 'Salud', label: 'Salud' },
  { value: 'Ropa', label: 'Ropa' },
  { value: 'Suscripción', label: 'Suscripción' },
  { value: 'Otro', label: 'Otro' },
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]['value']

export const DEFAULT_EXPENSE_CATEGORY: ExpenseCategory = 'Comida'

const expenseCategoryAliases: Record<string, ExpenseCategory> = {
  comida: 'Comida',
  transporte: 'Transporte',
  ocio: 'Ocio',
  entretenimiento: 'Ocio',
  estudio: 'Estudio',
  estudios: 'Estudio',
  salud: 'Salud',
  ropa: 'Ropa',
  suscripcion: 'Suscripción',
  suscripciones: 'Suscripción',
  otro: 'Otro',
  otros: 'Otro',
}

export function isExpenseCategory(category: string): category is ExpenseCategory {
  return EXPENSE_CATEGORIES.some((item) => item.value === category)
}

export function normalizeExpenseCategory(category: string) {
  const normalizedKey = category
    .trim()
    .toLocaleLowerCase('es-CO')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return expenseCategoryAliases[normalizedKey] ?? category.trim()
}

export function getExpenseCategoryLabel(category: string) {
  const normalizedCategory = normalizeExpenseCategory(category)
  const matchedCategory = EXPENSE_CATEGORIES.find(
    (item) => item.value === normalizedCategory,
  )

  return matchedCategory?.label ?? category
}
