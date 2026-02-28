import React from 'react';
import './Movements.css';

const Movements = () => {
  return (
    <div className="movements-container">
      {/* Header Section */}
      <header className="movements-header">
        <img src="/public/assets/logo-savy.png" alt="Logo" className="logo" />
        <button className="back-button">Volver</button>
      </header>

      {/* Movements Section */}
      <section className="movements-list">
        <h2>MOVIMIENTOS</h2>
        <div className="movement-item">Ingreso, gasto o ahorro / fecha / monto</div>
        <div className="movement-item">...</div>
        <div className="movement-item">...</div>
        <div className="movement-item">...</div>
      </section>

      {/* Summary Section */}
      <section className="summary-section">
        <div className="summary-item">
          <h3>Total de ingresos en el mes</h3>
          <p>$...</p>
        </div>
        <div className="summary-item">
          <h3>Total de gastos al mes</h3>
          <p>$...</p>
        </div>
      </section>

      {/* Savings Section */}
      <section className="savings-section">
        <h2>AHORROS</h2>
        <div className="saving-item">
          <h4>Celular nuevo</h4>
          <div className="saving-progress">
            <div className="progress-bar" style={{ width: '30%' }}></div>
          </div>
          <p>$300,000 / $2,000,000</p>
        </div>
      </section>
    </div>
  );
};

export default Movements;