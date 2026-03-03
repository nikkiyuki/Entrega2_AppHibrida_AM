interface AppNavbarProps {
  title: string
  onBack?: () => void
}

export default function AppNavbar({ title, onBack }: AppNavbarProps) {
  return (
    <header className="topbar topbar--app">
      <div className="topbar__content topbar__content--app">
        <div className="brand-badge">
          <img
            className="brand-badge__image"
            src="/assets/logo-savy-no-letter.png"
            alt="Logo de SAVY"
          />
        </div>
        <div className="topbar__meta">
          <p className="eyebrow">SAVY</p>
          <h1 className="title topbar__title">{title}</h1>
        </div>
      </div>
      {onBack ? (
        <button
          className="button button--secondary topbar__action topbar__action--app"
          type="button"
          onClick={onBack}
        >
          Volver
        </button>
      ) : null}
    </header>
  )
}
