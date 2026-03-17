export const SAVING_CATEGORIES = [
  { value: 'Estudios', label: 'Estudios' },
  { value: 'Viaje', label: 'Viaje' },
  { value: 'Tecnologia', label: 'Tecnología' },
  { value: 'Emprendimiento', label: 'Emprendimiento' },
  { value: 'Emergencia', label: 'Emergencia' },
  { value: 'Otro', label: 'Otro' },
] as const

export type SavingCategory = (typeof SAVING_CATEGORIES)[number]['value']

export const DEFAULT_SAVING_CATEGORY: SavingCategory = 'Viaje'

const savingCategoryAliases: Record<string, SavingCategory> = {
  estudios: 'Estudios',
  viaje: 'Viaje',
  tecnologia: 'Tecnologia',
  'tecnología': 'Tecnologia',
  'tecnologã­a': 'Tecnologia',
  negocio: 'Emprendimiento',
  emprendimiento: 'Emprendimiento',
  emergencia: 'Emergencia',
  otro: 'Otro',
}

export function isSavingCategory(category: string): category is SavingCategory {
  return SAVING_CATEGORIES.some((item) => item.value === category)
}

export function normalizeSavingCategory(category: string) {
  const normalizedKey = category
    .trim()
    .toLocaleLowerCase('es-CO')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (normalizedKey.includes('tecnolog')) {
    return 'Tecnologia'
  }

  if (normalizedKey.includes('emprend') || normalizedKey.includes('negocio')) {
    return 'Emprendimiento'
  }

  return savingCategoryAliases[normalizedKey] ?? category.trim()
}

export function getSavingCategoryLabel(category: string) {
  const normalizedCategory = normalizeSavingCategory(category)
  const matchedCategory = SAVING_CATEGORIES.find(
    (item) => item.value === normalizedCategory,
  )

  return matchedCategory?.label ?? category
}
