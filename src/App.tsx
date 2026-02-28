import { lazy, Suspense, useState } from 'react'
import Home from './pages/home/Home'

const EmptyView = () => null

const Income = lazy(() =>
  import('./pages/income/Income').then((module) => ({
    default: module.default ?? EmptyView,
  })),
)

const Expense = lazy(() =>
  import('./pages/expense/Expense').then((module) => ({
    default: module.default ?? EmptyView,
  })),
)

const Saving = lazy(() =>
  import('./pages/saving/Saving').then((module) => ({
    default: module.default ?? EmptyView,
  })),
)

const Movements = lazy(() =>
  import('./pages/movements/Movements').then((module) => ({
    default: module.default ?? EmptyView,
  })),
)

function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'income' | 'expense' | 'saving' | 'movements'
  >('home')
  const [savingInitialTab, setSavingInitialTab] = useState<'list' | 'new'>('list')

  if (currentView === 'income') {
    return (
      <Suspense fallback={null}>
        <Income />
      </Suspense>
    )
  }

  if (currentView === 'expense') {
    return (
      <Suspense fallback={null}>
        <Expense />
      </Suspense>
    )
  }

  if (currentView === 'saving') {
    return (
      <Suspense fallback={null}>
        <Saving
          initialTab={savingInitialTab}
          onBack={() => setCurrentView('home')}
        />
      </Suspense>
    )
  }

  if (currentView === 'movements') {
    return (
      <Suspense fallback={null}>
        <Movements />
      </Suspense>
    )
  }

  return (
    <Home
      onNavigateToIncome={() => setCurrentView('income')}
      onNavigateToExpense={() => setCurrentView('expense')}
      onNavigateToSaving={() => {
        setSavingInitialTab('list')
        setCurrentView('saving')
      }}
      onNavigateToMovements={() => setCurrentView('movements')}
    />
  )
}

export default App
