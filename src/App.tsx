import { useState } from "react";
import Income from "./pages/income/Income";
import Expense from "./pages/expense/Expense";
import "./App.css";

type View = "home" | "income" | "expense";

export default function App() {
  const [view, setView] = useState<View>("home");

  return (
    <>
     {view === "income" && <Income onClose={() => setView("home")} />}
      {view === "expense" && <Expense onClose={() => setView("home")} />}
    </>
  );
}