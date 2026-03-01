import { useMemo, useState } from "react";
import "./Expense.css";

type Props = { onClose: () => void };

type ExpenseCategory =
  | "Comida"
  | "Transporte"
  | "Entretenimiento"
  | "Estudio"
  | "Salud"
  | "Ropa"
  | "Suscripción"
  | "Otro";

type Movement = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
  dateISO: string;
};

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Comida",
  "Transporte",
  "Entretenimiento",
  "Estudio",
  "Salud",
  "Ropa",
  "Suscripción",
  "Otro",
];

function saveMovement(m: Movement) {
  const key = "movements";
  const raw = localStorage.getItem(key);
  const list: Movement[] = raw ? JSON.parse(raw) : [];
  list.unshift(m);
  localStorage.setItem(key, JSON.stringify(list));
}

function formatCOPDigits(digits: string) {
  const n = Number(digits || 0);
  return n.toLocaleString("es-CO");
}

export default function Expense({ onClose }: Props) {
  const [amountDigits, setAmountDigits] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("Comida");
  const [note, setNote] = useState("");

  const motivational = useMemo(() => {
    const a = Number(amountDigits || 0);
    if (!a) return "Tip: piensa si lo necesitas antes de gastar.";
    if (a < 10000) return "Bien por registrarlo. Los pequeños suman.";
    if (a < 50000) return "Ojo con los gastos repetidos. Pon un límite.";
    return "Gasto alto: mejor con presupuesto y plan.";
  }, [amountDigits]);

  const canSubmit = useMemo(() => Number(amountDigits) > 0, [amountDigits]);

  const handleCancel = () => onClose();

  const handleSubmit = () => {
    if (!canSubmit) return;

    const movement: Movement = {
      id: crypto.randomUUID(),
      type: "expense",
      amount: Number(amountDigits),
      category,
      note: note.trim() ? note.trim() : undefined,
      dateISO: new Date().toISOString(),
    };

    saveMovement(movement);
    onClose();
  };

  return (
    <div className="wf-page">
      <h1 className="wf-title">Registrar Gastos</h1>

      <section className="wf-card">
        {/* Banner grande superior */}
        <div className="wf-banner" role="group" aria-label="Monto gasto">
          <div className="wf-banner-top">
            <span className="wf-banner-label">Monto gasto</span>
            <span className="wf-banner-amount">
              $ {formatCOPDigits(amountDigits)}
            </span>
          </div>

          <input
            className="wf-banner-input"
            inputMode="numeric"
            placeholder="Escribe el monto..."
            value={amountDigits}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, "");
              setAmountDigits(v);
            }}
          />
          <div className="wf-hint">Solo números</div>
        </div>

        <div className="wf-section-header">
          <h2 className="wf-section-title">Tipo de gasto</h2>
          <span className="wf-pill">{category}</span>
        </div>

        <div className="wf-grid">
          {EXPENSE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`wf-grid-btn ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
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
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="wf-motivation">
          <span className="wf-motivation-title">Mensaje motivación</span>
          <p className="wf-motivation-text">{motivational}</p>
        </div>

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
            Confirmar
          </button>
        </div>
      </section>
    </div>
  );
}
