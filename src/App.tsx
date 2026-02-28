import { lazy, Suspense, useState } from 'react'
import Home from './pages/home/Home'
import Saving from './pages/saving/Saving'

const EmptyView = () => null

const loadOptionalView = async (importView: () => Promise<unknown>) => {
  const module = (await importView()) as { default?: typeof EmptyView }

  return {
    default: module.default ?? EmptyView,
  }
}

const Income = lazy(() => loadOptionalView(() => import('./pages/income/Income')))

const Expense = lazy(() => loadOptionalView(() => import('./pages/expense/Expense')))

const Movements = lazy(() => loadOptionalView(() => import('./pages/movements/Movements')))

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
