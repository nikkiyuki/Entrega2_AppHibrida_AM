import { useMemo, useState } from 'react'
import './Income.css'
import { addIngreso } from '../../utils/storage'

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

function formatCOPDigits(digits: string) {
  const n = Number(digits || 0)
  return n.toLocaleString('es-CO')
}

export default function Income({ onClose }: Props) {
  const [amountDigits, setAmountDigits] = useState('')
  const [category, setCategory] = useState<IncomeCategory>('Mesada')
  const [error, setError] = useState('')

  const motivational = useMemo(() => {
    const amount = Number(amountDigits || 0)

    if (!amount) return 'Tip: registra cada ingreso, incluso si es pequeno.'
    if (amount < 10000) return 'Cada peso cuenta. Mantener el registro ya es un avance.'
    if (amount < 50000) return 'Buen ingreso. Puedes apartar una parte para una meta.'
    return 'Muy bien. Este ingreso puede ayudarte a crecer tu ahorro.'
  }, [amountDigits])

  const canSubmit = useMemo(() => Number(amountDigits) > 0, [amountDigits])

  const handleCancel = () => onClose()

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
      onClose()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo registrar el ingreso.',
      )
    }
  }

  return (
    <div className="wf-page">
      <h1 className="wf-title">Registrar ingresos</h1>

      <section className="wf-card">
        <div className="wf-banner" role="group" aria-label="Monto a registrar">
          <div className="wf-banner-top">
            <span className="wf-banner-label">Monto a registrar</span>
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
        </div>

        <div className="wf-section-header">
          <h2 className="wf-section-title">Categorias</h2>
          <span className="wf-pill">{category}</span>
        </div>

        <div className="wf-grid">
          {INCOME_CATEGORIES.map((item) => (
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

        <div className="wf-motivation">
          <span className="wf-motivation-title">Mensaje motivacion</span>
          <p className="wf-motivation-text">{motivational}</p>
        </div>

        {error ? <p className="wf-error">{error}</p> : null}

        <div className="wf-actions">
          <button type="button" className="wf-action secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="wf-action primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Guardar ingreso
          </button>
        </div>
      </section>
    </div>
  )
}
