import { useState } from "react";
import Income from "./pages/income/Income";
import Expense from "./pages/expense/Expense";
import "./App.css";

type View = "home" | "income" | "expense";

export default function App() {
  const [view, setView] = useState<View>("home");

  return (
    <>
      {view === "home" && (
        <div className="home-page">
          <h1 className="home-title">Home</h1>

          <div className="home-card">
            <p className="home-subtitle">¿Qué quieres registrar hoy?</p>

            <div className="home-actions">
              <button className="home-btn" onClick={() => setView("income")}>
                Registrar ingreso
              </button>
              <button className="home-btn" onClick={() => setView("expense")}>
                Registrar gasto
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "income" && <Income onClose={() => setView("home")} />}
      {view === "expense" && <Expense onClose={() => setView("home")} />}
    </>
  );
}