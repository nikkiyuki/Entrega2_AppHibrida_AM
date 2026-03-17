export const INCOME_CATEGORIES = [
  { value: 'Mesada', label: 'Mesada' },
  { value: 'Regalo', label: 'Regalo' },
  { value: 'Trabajo', label: 'Trabajo' },
  { value: 'Apoyo familiar', label: 'Apoyo familiar' },
  { value: 'Premio', label: 'Premio' },
  { value: 'Otro', label: 'Otro' },
] as const

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]['value']

export const DEFAULT_INCOME_CATEGORY: IncomeCategory = 'Mesada'

const incomeCategoryAliases: Record<string, IncomeCategory> = {
  mesada: 'Mesada',
  regalo: 'Regalo',
  trabajo: 'Trabajo',
  'apoyo familiar': 'Apoyo familiar',
  apoyofamiliar: 'Apoyo familiar',
  premio: 'Premio',
  otro: 'Otro',
  otros: 'Otro',
}

export function isIncomeCategory(category: string): category is IncomeCategory {
  return INCOME_CATEGORIES.some((item) => item.value === category)
}

export function normalizeIncomeCategory(category: string) {
  const normalizedKey = category
    .trim()
    .toLocaleLowerCase('es-CO')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return incomeCategoryAliases[normalizedKey] ?? category.trim()
}

export function getIncomeCategoryLabel(category: string) {
  const normalizedCategory = normalizeIncomeCategory(category)
  const matchedCategory = INCOME_CATEGORIES.find(
    (item) => item.value === normalizedCategory,
  )

  return matchedCategory?.label ?? category
}
