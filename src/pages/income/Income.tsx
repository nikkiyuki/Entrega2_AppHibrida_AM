import { useMemo, useState } from "react";
import "./Income.css";

type Props = { onClose: () => void };

type IncomeCategory =
  | "Salario"
  | "Venta"
  | "Regalo"
  | "Beca"
  | "Freelance"
  | "Propina"
  | "Otro";

type Movement = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  note?: string;
  dateISO: string;
};

const INCOME_CATEGORIES: IncomeCategory[] = [
  "Salario",
  "Venta",
  "Regalo",
  "Beca",
  "Freelance",
  "Propina",
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

export default function Income({ onClose }: Props) {
  const [amountDigits, setAmountDigits] = useState<string>("");
  const [category, setCategory] = useState<IncomeCategory>("Salario");
  const [note, setNote] = useState("");

  const motivational = useMemo(() => {
    const a = Number(amountDigits || 0);
    if (!a) return "Tip: registra todo, así sea poquito.";
    if (a < 10000) return "Cada peso cuenta. Buen hábito.";
    if (a < 50000) return "Bien. Considera guardar una parte.";
    return "Excelente. Define una meta de ahorro.";
  }, [amountDigits]);

  const canSubmit = useMemo(() => Number(amountDigits) > 0, [amountDigits]);

  const handleCancel = () => onClose();

  const handleSubmit = () => {
    if (!canSubmit) return;

    const movement: Movement = {
      id: crypto.randomUUID(),
      type: "income",
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
      <h1 className="wf-title">Registrar Ingresos</h1>

      <section className="wf-card">
        {/* Banner grande superior */}
        <div className="wf-banner" role="group" aria-label="Monto a registrar">
          <div className="wf-banner-top">
            <span className="wf-banner-label">Monto a registrar</span>
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
          <h2 className="wf-section-title">Categorías</h2>
          <span className="wf-pill">{category}</span>
        </div>

        <div className="wf-grid">
          {INCOME_CATEGORIES.map((c) => (
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
          <label className="wf-label" htmlFor="note-income">
            Nota (opcional)
          </label>
          <input
            id="note-income"
            className="wf-input"
            placeholder="Ej: pago del mes"
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
            Confirmar ingreso
          </button>
        </div>
      </section>
    </div>
  );
}
