import { useState } from 'react'
import { formatCurrencyCOP } from '../../utils/format'
import { loadState } from '../../utils/storage'

const savingCategories = [
  'Viaje',
  'Estudio',
  'Celular',
  'Regalo mama',
  'Gimnasio',
  'Otro',
]

export default function Saving() {
  const [monto, setMonto] = useState('')
  const [nombreAhorro, setNombreAhorro] = useState('')
  const [metaAhorro, setMetaAhorro] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Viaje')
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
          <button className="button button--secondary topbar__action" type="button">
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

          <div className="saving-message">
            <p className="saving-message__title">Mensaje de motivacion</p>
            <p className="text-muted">
              Ahorrar poco a poco tambien cuenta. Cada aporte te acerca a tu meta.
            </p>
          </div>

          <div className="dashboard-actions saving-actions" aria-label="Acciones de ahorro">
            <button className="button button--secondary" type="button">
              Cancelar
            </button>
            <button className="button button--primary" type="button">
              Confirmar
            </button>
          </div>
        </article>
      </section>
    </main>
  )
}
