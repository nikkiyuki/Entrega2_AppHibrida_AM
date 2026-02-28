import { useEffect, useState } from 'react'
import { formatCurrencyCOP } from '../../utils/format'
import {
  SAVY_STATE_EVENT,
  addAhorro,
  agregarDineroAhorro,
  actualizarAhorro,
  eliminarAhorro,
  loadState,
  retirarDeAhorro,
  type MetaAhorro,
  type SavyState,
} from '../../utils/storage'

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
  initialTab: 'list' | 'new'
  onBack: () => void
}

export default function Saving({ initialTab, onBack }: SavingProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>(initialTab)
  const [manageMode, setManageMode] = useState<'add' | 'withdraw' | 'edit' | 'delete' | null>(null)
  const [selectedAhorro, setSelectedAhorro] = useState<MetaAhorro | null>(null)
  const [monto, setMonto] = useState('')
  const [nombreAhorro, setNombreAhorro] = useState('')
  const [metaAhorro, setMetaAhorro] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Viaje')
  const [manageAmount, setManageAmount] = useState('')
  const [manageName, setManageName] = useState('')
  const [manageMeta, setManageMeta] = useState('')
  const [manageCategory, setManageCategory] = useState('Viaje')
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [motivationalMessage] = useState(
    () =>
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ],
  )

  const [savingState, setSavingState] = useState<SavyState>(() => loadState())
  const formattedMonto = monto ? Number(monto).toLocaleString('es-CO') : ''
  const formattedMeta = metaAhorro ? Number(metaAhorro).toLocaleString('es-CO') : ''

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    const syncState = () => {
      setSavingState(loadState())
    }

    window.addEventListener('storage', syncState)
    window.addEventListener(SAVY_STATE_EVENT, syncState)

    return () => {
      window.removeEventListener('storage', syncState)
      window.removeEventListener(SAVY_STATE_EVENT, syncState)
    }
  }, [])

  const handleMontoChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setMonto(numericValue)
  }

  const handleMetaChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setMetaAhorro(numericValue)
  }

  const handleManageAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setManageAmount(numericValue)
  }

  const handleManageMetaChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    setManageMeta(numericValue)
  }

  const resetManagePanel = () => {
    setManageMode(null)
    setSelectedAhorro(null)
    setManageAmount('')
    setManageName('')
    setManageMeta('')
    setManageCategory('Viaje')
  }

  const handleResetForm = () => {
    setMonto('')
    setNombreAhorro('')
    setMetaAhorro('')
    setSelectedCategory('Viaje')
    setFeedback('')
    setFeedbackType('')
  }

  const handleCloseFeedback = () => {
    const isSuccess = feedbackType === 'success'
    setFeedback('')
    setFeedbackType('')

    if (isSuccess) {
      setActiveTab('list')
      resetManagePanel()
    }
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
    setSavingState(loadState())
  }

  const handleTopBack = () => {
    if (activeTab === 'new') {
      setActiveTab('list')
      setFeedback('')
      setFeedbackType('')
      return
    }

    onBack()
  }

  const openManagePanel = (
    mode: 'add' | 'withdraw' | 'edit' | 'delete',
    ahorro: MetaAhorro,
  ) => {
    setSelectedAhorro(ahorro)
    setManageMode(mode)
    setManageAmount('')
    setManageName(ahorro.nombre)
    setManageMeta(String(ahorro.meta))
    setManageCategory(ahorro.categoria)
  }

  const handleManageAction = () => {
    if (!selectedAhorro || !manageMode) {
      return
    }

    try {
      if (manageMode === 'add') {
        agregarDineroAhorro({
          ahorroId: selectedAhorro.id,
          monto: Number(manageAmount),
        })
        setFeedback('Se agrego dinero al ahorro correctamente.')
      }

      if (manageMode === 'withdraw') {
        retirarDeAhorro({
          ahorroId: selectedAhorro.id,
          monto: Number(manageAmount),
        })
        setFeedback('El retiro del ahorro se registro correctamente.')
      }

      if (manageMode === 'edit') {
        if (!Number(manageMeta) || Number(manageMeta) <= 0) {
          throw new Error('Ingresa una meta valida para actualizar el ahorro.')
        }

        actualizarAhorro({
          ahorroId: selectedAhorro.id,
          nombre: manageName,
          categoria: manageCategory,
          meta: Number(manageMeta),
        })
        setFeedback('Los datos del ahorro fueron actualizados.')
      }

      if (manageMode === 'delete') {
        eliminarAhorro({
          ahorroId: selectedAhorro.id,
        })
        setFeedback('El ahorro fue eliminado correctamente.')
      }

      setFeedbackType('success')
      setSavingState(loadState())
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Ocurrio un error inesperado.')
      setFeedbackType('error')
    }
  }

  return (
    <main className="app-shell">
      <section className={`screen stack ${feedbackType ? 'screen--modal-open' : ''}`}>
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
            onClick={handleTopBack}
          >
            Volver
          </button>
        </header>

        <div className="saving-tabs" role="tablist" aria-label="Pestanas de ahorro">
          <button
            className={`saving-tab ${activeTab === 'list' ? 'saving-tab--active' : ''}`}
            type="button"
            onClick={() => setActiveTab('list')}
          >
            Mis ahorros
          </button>
          <button
            className={`saving-tab ${activeTab === 'new' ? 'saving-tab--active' : ''}`}
            type="button"
            onClick={() => setActiveTab('new')}
          >
            Nuevo ahorro
          </button>
        </div>

        {activeTab === 'list' ? (
          <article className="panel stack saving-panel">
            <div className="saving-header">
              <p className="eyebrow">Tus metas guardadas</p>
              <div className="saving-divider" aria-hidden="true" />
            </div>

            <div className="saving-available">
              <span className="saving-available__label">Ahorro total</span>
              <strong className="saving-available__value">
                {formatCurrencyCOP(savingState.ahorroTotal)}
              </strong>
            </div>

            {savingState.ahorros.length > 0 ? (
              <div className="saving-list">
                {savingState.ahorros.map((ahorro) => (
                  <article key={ahorro.id} className="saving-item">
                    <div className="saving-item__header">
                      <div className="saving-item__identity">
                        <strong className="saving-item__name">{ahorro.nombre}</strong>
                        <span className="saving-item__category">{ahorro.categoria}</span>
                      </div>
                      <span className="saving-item__badge">
                        {Math.min(
                          100,
                          Math.round(
                            ahorro.meta ? (ahorro.acumulado / ahorro.meta) * 100 : 0,
                          ),
                        )}
                        %
                      </span>
                    </div>
                    <div className="saving-item__amounts">
                      <span>{formatCurrencyCOP(ahorro.acumulado)}</span>
                      <span>/ {formatCurrencyCOP(ahorro.meta)}</span>
                    </div>
                    <div className="saving-progress" aria-hidden="true">
                      <span
                        className="saving-progress__fill"
                        style={{
                          width: `${Math.min(
                            100,
                            ahorro.meta ? (ahorro.acumulado / ahorro.meta) * 100 : 0,
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="saving-item__actions">
                      <button
                        type="button"
                        className="saving-item__action-button"
                        onClick={() => openManagePanel('add', ahorro)}
                      >
                        Agregar dinero
                      </button>
                      <button
                        type="button"
                        className="saving-item__action-button"
                        onClick={() => openManagePanel('withdraw', ahorro)}
                      >
                        Retirar
                      </button>
                      <button
                        type="button"
                        className="saving-item__action-button"
                        onClick={() => openManagePanel('edit', ahorro)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="saving-item__action-button saving-item__action-button--danger"
                        onClick={() => openManagePanel('delete', ahorro)}
                      >
                        Eliminar
                      </button>
                    </div>

                    {selectedAhorro?.id === ahorro.id && manageMode ? (
                      <div className="saving-manage">
                        <p className="saving-manage__title">
                          {manageMode === 'add' && `Agregar dinero a ${selectedAhorro.nombre}`}
                          {manageMode === 'withdraw' && `Retirar dinero de ${selectedAhorro.nombre}`}
                          {manageMode === 'edit' && `Editar ${selectedAhorro.nombre}`}
                          {manageMode === 'delete' && `Eliminar ${selectedAhorro.nombre}`}
                        </p>

                        {(manageMode === 'add' || manageMode === 'withdraw') && (
                          <label className="field" htmlFor="manage-amount">
                            <span className="field__label">Monto</span>
                            <div className="currency-field currency-field--soft">
                              <span className="currency-field__symbol">$</span>
                              <input
                                id="manage-amount"
                                className="field__control field__control--currency"
                                type="text"
                                inputMode="numeric"
                                placeholder="20.000"
                                value={manageAmount ? Number(manageAmount).toLocaleString('es-CO') : ''}
                                onChange={(event) => handleManageAmountChange(event.target.value)}
                              />
                            </div>
                          </label>
                        )}

                        {manageMode === 'edit' && (
                          <>
                            <label className="field" htmlFor="manage-name">
                              <span className="field__label">Nombre</span>
                              <input
                                id="manage-name"
                                className="field__control"
                                type="text"
                                value={manageName}
                                onChange={(event) => setManageName(event.target.value)}
                              />
                            </label>

                            <label className="field" htmlFor="manage-meta">
                              <span className="field__label">Meta</span>
                              <div className="currency-field currency-field--soft">
                                <span className="currency-field__symbol">$</span>
                                <input
                                  id="manage-meta"
                                  className="field__control field__control--currency"
                                  type="text"
                                  inputMode="numeric"
                                  value={manageMeta ? Number(manageMeta).toLocaleString('es-CO') : ''}
                                  onChange={(event) => handleManageMetaChange(event.target.value)}
                                />
                              </div>
                            </label>

                            <div className="saving-category-grid" aria-label="Editar categoria">
                              {savingCategories.map((category) => (
                                <button
                                  key={`manage-${category}`}
                                  className={`saving-category ${
                                    manageCategory === category ? 'saving-category--active' : ''
                                  }`}
                                  type="button"
                                  onClick={() => setManageCategory(category)}
                                >
                                  <span className="saving-category__label">{category}</span>
                                  <span className="saving-category__icon-placeholder">
                                    Espacio para icono
                                  </span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {manageMode === 'delete' && (
                          <p className="text-muted">
                            Se devolvera al disponible el dinero acumulado de este ahorro.
                          </p>
                        )}

                        <div className="saving-manage__actions">
                          <button className="button button--secondary" type="button" onClick={resetManagePanel}>
                            Cerrar
                          </button>
                          <button className="button button--primary" type="button" onClick={handleManageAction}>
                            Confirmar
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="saving-empty">
                <p className="text-muted">
                  Todavia no tienes metas guardadas. Crea tu primer ahorro.
                </p>
              </div>
            )}

            <button
              className="button button--primary"
              type="button"
              onClick={() => setActiveTab('new')}
            >
              Nuevo ahorro
            </button>
          </article>
        ) : (
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
            <p className="text-muted">{motivationalMessage}</p>
          </div>

          <div className="dashboard-actions saving-actions" aria-label="Acciones de ahorro">
            <button className="button button--secondary" type="button" onClick={handleResetForm}>
              Borrar
            </button>
            <button className="button button--primary" type="button" onClick={handleConfirmSaving}>
              Confirmar
            </button>
          </div>
        </article>
        )}

        {feedbackType ? (
          <div className="feedback-modal-backdrop" role="presentation">
            <div
              className={`feedback-modal feedback-modal--${feedbackType}`}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="saving-feedback-title"
            >
              <p id="saving-feedback-title" className="feedback-modal__title">
                {feedbackType === 'success'
                  ? 'VAMOS POR ESA META'
                  : 'REVISA TU INFORMACION'}
              </p>
              <p className="feedback-modal__text">
                {feedbackType === 'success'
                  ? 'TU AHORRO HA SIDO REGISTRADO CON EXITO'
                  : feedback}
              </p>
              <div className="feedback-modal__actions">
                <button
                  className="feedback-modal__button"
                  type="button"
                  onClick={handleCloseFeedback}
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
