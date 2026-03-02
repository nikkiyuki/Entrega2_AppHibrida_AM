import { useMemo, useState } from 'react'
import './income.scss'
import { formatCurrencyCOP } from '../../utils/format'
import { addIngreso, loadState } from '../../utils/storage'

type Props = { onClose: () => void }

type IncomeCategory =
  | 'Mesada'
  | 'Regalo'
  | 'Trabajo'
  | 'Apoyo familiar'
  | 'Emprendimiento'
  | 'Premio'
  | 'Otros'

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Mesada',
  'Regalo',
  'Trabajo',
  'Apoyo familiar',
  'Emprendimiento',
  'Premio',
  'Otros',
]

export default function Income({ onClose }: Props) {
  const [amountDigits, setAmountDigits] = useState('')
  const [category, setCategory] = useState<IncomeCategory>('Mesada')
  const [error, setError] = useState('')
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [availableMoney] = useState(() => loadState().dineroDisponible)

  const motivational = useMemo(() => {
    const amount = Number(amountDigits || 0)

    if (!amount) return 'Tip: registra cada ingreso, incluso si es pequeno.'
    if (amount < 10000) return 'Cada peso cuenta. Mantener el registro ya es un avance.'
    if (amount < 50000) return 'Buen ingreso. Puedes apartar una parte para una meta.'
    return 'Muy bien. Este ingreso puede ayudarte a crecer tu ahorro.'
  }, [amountDigits])

  const canSubmit = useMemo(() => Number(amountDigits) > 0, [amountDigits])
  const formattedAmount = amountDigits ? Number(amountDigits).toLocaleString('es-CO') : ''

  const handleResetForm = () => {
    setAmountDigits('')
    setCategory('Mesada')
    setError('')
    setIsSuccessOpen(false)
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      setError('Ingresa un monto valido.')
      return
    }

    try {
      addIngreso({
        categoria: category,
        monto: Number(amountDigits),
      })
      setError('')
      setIsSuccessOpen(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo registrar el ingreso.',
      )
    }
  }

  return (
    <main className="app-shell">
      <section className={`screen screen--income stack ${isSuccessOpen ? 'screen--modal-open' : ''}`}>
        <header className="topbar">
          <div className="topbar__content">
            <div className="brand-badge">
              <img
                className="brand-badge__image"
                src="/assets/logo-savy-no-letter.png"
                alt="Logo de SAVY"
              />
            </div>
            <div>
              <p className="eyebrow">SAVY</p>
              <h1 className="title">Registrar ingreso</h1>
            </div>
          </div>
          <button
            className="button button--secondary topbar__action"
            type="button"
            onClick={onClose}
          >
            Volver
          </button>
        </header>

        <article className="panel stack income-panel">
          <div className="income-header">
            <p className="eyebrow">Registra el dinero que entra</p>
            <div className="income-divider" aria-hidden="true" />
          </div>

          <div className="income-amount-block" role="group" aria-label="Monto ingreso">
            <div className="income-amount-block__header">
              <span className="income-amount-block__label">Monto ingreso</span>
              <strong className="income-amount-block__value">
                {formatCurrencyCOP(Number(amountDigits || 0))}
              </strong>
            </div>

            <label className="field" htmlFor="income-amount">
              <div className="currency-field currency-field--featured">
                <span className="currency-field__symbol">$</span>
                <input
                  id="income-amount"
                  className="field__control field__control--currency"
                  type="text"
                  inputMode="numeric"
                  placeholder="Escribe el monto..."
                  value={formattedAmount}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d]/g, '')
                    setAmountDigits(value)
                    setError('')
                  }}
                />
              </div>
            </label>
            <span className="income-amount-block__help">Solo numeros</span>
            <span className="income-amount-block__available">
              Disponible actual: {formatCurrencyCOP(availableMoney)}
            </span>
          </div>

          <div className="income-section-header">
            <h2 className="income-section-title">Tipo de ingreso</h2>
            <span className="income-pill">{category}</span>
          </div>

          <div className="income-category-grid" aria-label="Categorias de ingreso">
            {INCOME_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={`income-category ${category === item ? 'income-category--active' : ''}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="income-message">
            <p className="income-message__title">Mensaje de motivacion</p>
            <p className="text-muted">{motivational}</p>
          </div>

          {error ? <p className="income-error">{error}</p> : null}

          <div className="dashboard-actions income-actions">
            <button type="button" className="button button--secondary" onClick={handleResetForm}>
              Borrar
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={handleSubmit}
            >
              Confirmar
            </button>
          </div>
        </article>

        {isSuccessOpen ? (
          <div className="income-modal-backdrop" role="presentation">
            <div
              className="income-modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="income-success-title"
            >
              <p id="income-success-title" className="income-modal__title">
                Ingreso registrado
              </p>
              <p className="income-modal__text">
                Se registro correctamente un ingreso de {formatCurrencyCOP(Number(amountDigits || 0))}
                {' '}en la categoria {category}.
              </p>
              <div className="income-modal__actions">
                <button
                  className="button button--primary"
                  type="button"
                  onClick={onClose}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
