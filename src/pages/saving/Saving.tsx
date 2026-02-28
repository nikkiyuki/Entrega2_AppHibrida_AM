import { useState } from 'react'
import { formatCurrencyCOP } from '../../utils/format'
import { addAhorro, loadState } from '../../utils/storage'

const savingCategories = [
  'Viaje',
  'Estudio',
  'Celular',
  'Regalo mama',
  'Gimnasio',
  'Otro',
]

const motivationalMessages = [
  'Ahorrar poco a poco tambien cuenta. Cada aporte te acerca a tu meta.',
  'Cada peso que guardas hoy te da mas tranquilidad manana.',
  'Tus metas crecen cuando eres constante con tus ahorros.',
  'No necesitas ahorrar mucho de una vez, lo importante es empezar.',
  'Cada ahorro es una decision inteligente para tu futuro.',
]

interface SavingProps {
  onBack: () => void
}

export default function Saving({ onBack }: SavingProps) {
  const [monto, setMonto] = useState('')
  const [nombreAhorro, setNombreAhorro] = useState('')
  const [metaAhorro, setMetaAhorro] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Viaje')
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [motivationalMessage] = useState(
    () =>
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ],
  )
  const savingState = loadState()
  const formattedMonto = monto ? Number(monto).toLocaleString('es-CO') : ''
  const formattedMeta = metaAhorro ? Number(metaAhorro).toLocaleString('es-CO') : ''

  const handleMontoChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setMonto(numericValue)
  }

  const handleMetaChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setMetaAhorro(numericValue)
  }

  const handleCancel = () => {
    setMonto('')
    setNombreAhorro('')
    setMetaAhorro('')
    setSelectedCategory('Viaje')
    setFeedback('')
    setFeedbackType('')
    onBack()
  }

  const handleConfirmSaving = () => {
    const montoNumber = Number(monto)
    const metaNumber = Number(metaAhorro)

    if (!montoNumber || montoNumber <= 0) {
      setFeedback('Ingresa un monto valido para ahorrar.')
      setFeedbackType('error')
      return
    }

    if (montoNumber > savingState.dineroDisponible) {
      setFeedback('El monto no puede ser mayor que tu dinero disponible.')
      setFeedbackType('error')
      return
    }

    if (!metaNumber || metaNumber <= 0) {
      setFeedback('Ingresa una meta de ahorro valida.')
      setFeedbackType('error')
      return
    }

    addAhorro({
      categoria: selectedCategory,
      nombre: nombreAhorro,
      meta: metaNumber,
      monto: montoNumber,
    })

    setFeedback('Tu ahorro fue registrado con exito.')
    setFeedbackType('success')
    setMonto('')
    setMetaAhorro('')
    setNombreAhorro('')

    window.setTimeout(() => {
      onBack()
    }, 900)
  }

  return (
    <main className="app-shell">
      <section className="screen stack">
        <header className="topbar">
          <div className="topbar__content">
            <div className="brand-badge">S</div>
            <div>
              <p className="eyebrow">SAVY</p>
              <h1 className="title">Ahorrar</h1>
            </div>
          </div>
          <button
            className="button button--secondary topbar__action"
            type="button"
            onClick={onBack}
          >
            Volver
          </button>
        </header>

        <article className="panel stack saving-panel">
          <div className="saving-header">
            <p className="eyebrow">Selecciona tu categoria de ahorro</p>
            <div className="saving-divider" aria-hidden="true" />
          </div>

          <div className="saving-category-grid" aria-label="Categorias de ahorro">
            {savingCategories.map((category) => (
              <button
                key={category}
                className={`saving-category ${
                  selectedCategory === category ? 'saving-category--active' : ''
                }`}
                type="button"
                onClick={() => setSelectedCategory(category)}
              >
                <span className="saving-category__label">{category}</span>
                <span className="saving-category__icon-placeholder">
                  Espacio para icono
                </span>
              </button>
            ))}
          </div>

          <label className="field" htmlFor="saving-name">
            <span className="field__label">Nombre personalizado del ahorro</span>
            <input
              id="saving-name"
              className="field__control"
              type="text"
              placeholder="Ejemplo: Viaje de fin de ano"
              value={nombreAhorro}
              onChange={(event) => setNombreAhorro(event.target.value)}
            />
          </label>

          <label className="field" htmlFor="saving-goal">
            <span className="field__label">Meta del ahorro</span>
            <div className="currency-field currency-field--soft">
              <span className="currency-field__symbol">$</span>
              <input
                id="saving-goal"
                className="field__control field__control--currency"
                type="text"
                inputMode="numeric"
                placeholder="50.000"
                value={formattedMeta}
                onChange={(event) => handleMetaChange(event.target.value)}
              />
            </div>
          </label>

          <div className="saving-amount-block">
            <span className="saving-amount-block__label">Ingresar monto a ahorrar</span>
            <div className="saving-amount-block__available">
              Disponible: {formatCurrencyCOP(savingState.dineroDisponible)}
            </div>
            <label className="field" htmlFor="saving-amount">
              <div className="currency-field currency-field--featured">
                <span className="currency-field__symbol">$</span>
                <input
                  id="saving-amount"
                  className="field__control field__control--currency"
                  type="text"
                  inputMode="numeric"
                  placeholder="2.000"
                  value={formattedMonto}
                  onChange={(event) => handleMontoChange(event.target.value)}
                />
              </div>
            </label>
          </div>

          <div className={`saving-message ${feedbackType ? `saving-message--${feedbackType}` : ''}`}>
            <p className="saving-message__title">Mensaje de motivacion</p>
            <p className="text-muted">
              {feedback || motivationalMessage}
            </p>
          </div>

          <div className="dashboard-actions saving-actions" aria-label="Acciones de ahorro">
            <button className="button button--secondary" type="button" onClick={handleCancel}>
              Cancelar
            </button>
            <button className="button button--primary" type="button" onClick={handleConfirmSaving}>
              Confirmar
            </button>
          </div>
        </article>
      </section>
    </main>
  )
}
