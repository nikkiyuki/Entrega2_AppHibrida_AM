import { useEffect, useState } from 'react';
import { formatCurrencyCOP, formatDate } from '../../utils/format';
import { loadState, SAVY_STATE_EVENT, type Movimiento } from '../../utils/storage';

interface MovementsProps {
  onBack: () => void;
}

export default function Movements({ onBack }: MovementsProps) {
  const [movements, setMovements] = useState<Movimiento[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const syncState = () => {
      const state = loadState();
      setMovements(state.movimientos);
      setTotalIncome(state.totalIngresos);
      setTotalExpense(state.totalGastos);
    };

    syncState();

    window.addEventListener('storage', syncState);
    window.addEventListener(SAVY_STATE_EVENT, syncState);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener(SAVY_STATE_EVENT, syncState);
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="screen stack">
        <header className="topbar">
          <div className="topbar__content">
            <div className="brand-badge">S</div>
            <div>
              <p className="eyebrow">SAVY</p>
              <h1 className="title">Movimientos</h1>
            </div>
          </div>
          <button
            className="button button--secondary topbar__action"
            type="button"
            onClick={() => window.location.href = '/home'}
          >
            Volver
          </button>
        </header>

        <article className="panel stack movements-panel">
          <div className="movements-header">
            <p className="eyebrow">Movimientos recientes</p>
            <div className="movements-divider" aria-hidden="true" />
          </div>

          {movements.length > 0 ? (
            <div className="movements-list">
              {movements.map((movement) => (
                <div key={movement.id} className="movement-item">
                  <div className="movement-item__details">
                    <span className="movement-item__type">{movement.tipo}</span>
                    <span className="movement-item__date">{formatDate(movement.fecha)}</span>
                  </div>
                  <span className="movement-item__amount">
                    {formatCurrencyCOP(movement.monto)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="movements-empty">
              <p className="text-muted">No hay movimientos registrados.</p>
            </div>
          )}
        </article>

        <section className="dashboard-summary" aria-label="Resumen de movimientos">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <article className="stat-card">
              <span className="stat-card__label">Total de ingresos en el mes</span>
              <strong className="stat-card__value">
                {formatCurrencyCOP(totalIncome)}
              </strong>
            </article>

            <article className="stat-card">
              <span className="stat-card__label">Total de gastos al mes</span>
              <strong className="stat-card__value">
                {formatCurrencyCOP(totalExpense)}
              </strong>
            </article>
          </div>
        </section>

        <section className="additional-section" aria-label="Sección adicional">
          <h2 className="additional-section__title">Ahorros</h2>
          <p className="additional-section__content">Contenido de la nueva sección basado en el wireframe.</p>
        </section>
      </section>
    </main>
  );
}