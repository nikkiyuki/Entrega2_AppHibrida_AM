import { useMemo, useState } from 'react'
import './expense.scss'
import AppNavbar from '../../components/AppNavbar'
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
  | 'Suscripción'
  | 'Otro'

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Estudio',
  'Salud',
  'Ropa',
  'Suscripción',
  'Otro',
]

export default function Expense({ onClose }: Props) {
  const [amountDigits, setAmountDigits] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Comida')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [isErrorOpen, setIsErrorOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [availableMoney] = useState(() => loadState().dineroDisponible)

  const motivational = useMemo(() => {
    const amount = Number(amountDigits || 0)
    if (!amount) return 'Tip: piensa si lo necesitas antes de gastar.'
    if (amount < 10000) return 'Bien por registrarlo. Los pequeños suman.'
    if (amount < 50000) return 'Ojo con los gastos repetidos. Pon un límite.'
    return 'Gasto alto: mejor con presupuesto y plan.'
  }, [amountDigits])

  const canSubmit = useMemo(() => Number(amountDigits) > 0, [amountDigits])
  const isFormDirty = Boolean(amountDigits || note.trim() || category !== 'Comida')
  const formattedAmount = amountDigits ? Number(amountDigits).toLocaleString('es-CO') : ''

  const handleResetForm = () => {
    setAmountDigits('')
    setCategory('Comida')
    setNote('')
    setError('')
    setIsErrorOpen(false)
    setIsSuccessOpen(false)
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      setError('Ingresa un monto válido.')
      setIsErrorOpen(true)
      return
    }

    try {
      addGasto({
        categoria: category,
        monto: Number(amountDigits),
      })
      setError('')
      setIsErrorOpen(false)
      setIsSuccessOpen(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo registrar el gasto.',
      )
      setIsErrorOpen(true)
    }
  }

  return (
    <main className="app-shell">
      <section
        className={`screen screen--expense stack ${
          isSuccessOpen || isErrorOpen ? 'screen--modal-open' : ''
        }`}
      >
        <AppNavbar title="Registrar gasto" onBack={onClose} />

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
            <span className="expense-amount-block__help">Solo números</span>
            <span className="expense-amount-block__available">
              Disponible: {formatCurrencyCOP(availableMoney)}
            </span>
          </div>

          <div className="expense-section-header">
            <h2 className="expense-section-title">Tipo de gasto</h2>
            <span className="expense-pill">{category}</span>
          </div>

          <div className="expense-category-grid" aria-label="Categorías de gasto">
            {EXPENSE_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={`expense-category ${category === item ? 'expense-category--active' : ''}`}
                onClick={() => setCategory(item)}
              >
                <span className="expense-category__content">
                  <span>{item}</span>
                  {category === item ? <span className="selection-check" aria-hidden="true" /> : null}
                </span>
              </button>
            ))}
          </div>

          <label className="field" htmlFor="note-expense">
            <span className="field__label">Nota (opcional)</span>
            <input
              id="note-expense"
              className="field__control"
              placeholder="Ejemplo: almuerzo"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <div className="expense-message">
            <p className="expense-message__text">{motivational}</p>
          </div>

          <div className={`dashboard-actions expense-actions ${!isFormDirty ? 'expense-actions--single' : ''}`}>
            {isFormDirty ? (
              <button type="button" className="button button--secondary" onClick={handleResetForm}>
                Borrar
              </button>
            ) : null}
            <button
              type="button"
              className="button button--primary"
              onClick={handleSubmit}
            >
              Confirmar
            </button>
          </div>
        </article>

        {isErrorOpen ? (
          <div className="expense-modal-backdrop" role="presentation">
            <div
              className="expense-modal expense-modal--error"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="expense-error-title"
            >
              <p id="expense-error-title" className="expense-modal__title">
                Revisa tu información
              </p>
              <p className="expense-modal__text">{error}</p>
              <div className="expense-modal__actions">
                <button
                  className="button button--primary"
                  type="button"
                  onClick={() => setIsErrorOpen(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        ) : null}

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
                Se registró correctamente un gasto de {formatCurrencyCOP(Number(amountDigits || 0))}
                {' '}en la categoría {category}.
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
