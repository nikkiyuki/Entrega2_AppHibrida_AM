import { useMemo, useState } from 'react'
import './expense.scss'
import { formatCurrencyCOP } from '../../utils/format'
import { addGasto, loadState } from '../../utils/storage'

type Props = { onClose: () => void }

type ExpenseCategory =
  | 'Comida'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Estudio'
  | 'Salud'
  | 'Ropa'
  | 'Suscripcion'
  | 'Otro'

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Estudio',
  'Salud',
  'Ropa',
  'Suscripcion',
  'Otro',
]

export default function Expense({ onClose }: Props) {
  const [amountDigits, setAmountDigits] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Comida')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [availableMoney] = useState(() => loadState().dineroDisponible)

  const motivational = useMemo(() => {
    const amount = Number(amountDigits || 0)
    if (!amount) return 'Tip: piensa si lo necesitas antes de gastar.'
    if (amount < 10000) return 'Bien por registrarlo. Los pequenos suman.'
    if (amount < 50000) return 'Ojo con los gastos repetidos. Pon un limite.'
    return 'Gasto alto: mejor con presupuesto y plan.'
  }, [amountDigits])

  const canSubmit = useMemo(() => Number(amountDigits) > 0, [amountDigits])
  const formattedAmount = amountDigits ? Number(amountDigits).toLocaleString('es-CO') : ''

  const handleResetForm = () => {
    setAmountDigits('')
    setCategory('Comida')
    setNote('')
    setError('')
    setIsSuccessOpen(false)
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      setError('Ingresa un monto valido.')
      return
    }

    try {
      addGasto({
        categoria: category,
        monto: Number(amountDigits),
      })
      setError('')
      setIsSuccessOpen(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo registrar el gasto.',
      )
    }
  }

  return (
    <main className="app-shell">
      <section className={`screen screen--expense stack ${isSuccessOpen ? 'screen--modal-open' : ''}`}>
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
              <h1 className="title">Registrar gasto</h1>
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

        <article className="panel stack expense-panel">
          <div className="expense-header">
            <p className="eyebrow">Controla tus salidas de dinero</p>
            <div className="expense-divider" aria-hidden="true" />
          </div>

          <div className="expense-amount-block" role="group" aria-label="Monto gasto">
            <div className="expense-amount-block__header">
              <span className="expense-amount-block__label">Monto gasto</span>
              <strong className="expense-amount-block__value">
                {formatCurrencyCOP(Number(amountDigits || 0))}
              </strong>
            </div>

            <label className="field" htmlFor="expense-amount">
              <div className="currency-field currency-field--featured">
                <span className="currency-field__symbol">$</span>
                <input
                  id="expense-amount"
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
            <span className="expense-amount-block__help">Solo numeros</span>
            <span className="expense-amount-block__available">
              Disponible: {formatCurrencyCOP(availableMoney)}
            </span>
          </div>

          <div className="expense-section-header">
            <h2 className="expense-section-title">Tipo de gasto</h2>
            <span className="expense-pill">{category}</span>
          </div>

          <div className="expense-category-grid" aria-label="Categorias de gasto">
            {EXPENSE_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={`expense-category ${category === item ? 'expense-category--active' : ''}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="field" htmlFor="note-expense">
            <span className="field__label">Nota (opcional)</span>
            <input
              id="note-expense"
              className="field__control"
              placeholder="Ej: almuerzo"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <div className="expense-message">
            <p className="expense-message__title">Mensaje de motivacion</p>
            <p className="text-muted">{motivational}</p>
          </div>

          {error ? <p className="expense-error">{error}</p> : null}

          <div className="dashboard-actions expense-actions">
            <button type="button" className="button button--secondary" onClick={handleResetForm}>
              Borrar
            </button>
            <button
              type="button"
              className="button button--primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Confirmar
            </button>
          </div>
        </article>

        {isSuccessOpen ? (
          <div className="expense-modal-backdrop" role="presentation">
            <div
              className="expense-modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="expense-success-title"
            >
              <p id="expense-success-title" className="expense-modal__title">
                Gasto registrado
              </p>
              <p className="expense-modal__text">
                Se registro correctamente un gasto de {formatCurrencyCOP(Number(amountDigits || 0))}
                {' '}en la categoria {category}.
              </p>
              <div className="expense-modal__actions">
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
