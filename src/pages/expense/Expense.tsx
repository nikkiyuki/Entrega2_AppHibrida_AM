import { useMemo, useState } from 'react'
import './Expense.css'
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

function formatCOPDigits(digits: string) {
  const amount = Number(digits || 0)
  return amount.toLocaleString('es-CO')
}

export default function Expense({ onClose }: Props) {
  const [amountDigits, setAmountDigits] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Comida')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [availableMoney] = useState(() => loadState().dineroDisponible)

  const motivational = useMemo(() => {
    const amount = Number(amountDigits || 0)
    if (!amount) return 'Tip: piensa si lo necesitas antes de gastar.'
    if (amount < 10000) return 'Bien por registrarlo. Los pequenos suman.'
    if (amount < 50000) return 'Ojo con los gastos repetidos. Pon un limite.'
    return 'Gasto alto: mejor con presupuesto y plan.'
  }, [amountDigits])

  const canSubmit = useMemo(() => Number(amountDigits) > 0, [amountDigits])

  const handleResetForm = () => {
    setAmountDigits('')
    setCategory('Comida')
    setNote('')
    setError('')
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
      onClose()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo registrar el gasto.',
      )
    }
  }

  return (
    <div className="wf-page">
      <section className="wf-shell">
        <header className="topbar wf-topbar">
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

        <section className="wf-card">
          <div className="wf-banner" role="group" aria-label="Monto gasto">
            <div className="wf-banner-top">
              <span className="wf-banner-label">Monto gasto</span>
              <span className="wf-banner-amount">$ {formatCOPDigits(amountDigits)}</span>
            </div>

            <input
              className="wf-banner-input"
              inputMode="numeric"
              placeholder="Escribe el monto..."
              value={amountDigits}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d]/g, '')
                setAmountDigits(value)
                setError('')
              }}
            />
            <div className="wf-hint">Solo numeros</div>
            <div className="wf-available">Disponible: $ {formatCOPDigits(String(availableMoney))}</div>
          </div>

          <div className="wf-section-header">
            <h2 className="wf-section-title">Tipo de gasto</h2>
            <span className="wf-pill">{category}</span>
          </div>

          <div className="wf-grid">
            {EXPENSE_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={`wf-grid-btn ${category === item ? 'active' : ''}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="wf-field">
            <label className="wf-label" htmlFor="note-expense">
              Nota (opcional)
            </label>
            <input
              id="note-expense"
              className="wf-input"
              placeholder="Ej: almuerzo"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="wf-motivation">
            <span className="wf-motivation-title">Mensaje motivacion</span>
            <p className="wf-motivation-text">{motivational}</p>
          </div>

          {error ? <p className="wf-error">{error}</p> : null}

          <div className="wf-actions">
            <button
              type="button"
              className="wf-action primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Confirmar
            </button>
            <button type="button" className="wf-action secondary" onClick={handleResetForm}>
              Borrar
            </button>
          </div>
        </section>
      </section>
    </div>
  )
}
