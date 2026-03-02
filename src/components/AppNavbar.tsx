interface AppNavbarProps {
  title: string
  onBack?: () => void
}

export default function AppNavbar({ title, onBack }: AppNavbarProps) {
  return (
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
          <h1 className="title">{title}</h1>
        </div>
      </div>
      {onBack ? (
        <button
          className="button button--secondary topbar__action"
          type="button"
          onClick={onBack}
        >
          Volver
        </button>
      ) : null}
    </header>
  )
}
