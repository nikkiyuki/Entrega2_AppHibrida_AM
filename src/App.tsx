import { Suspense, useEffect, useState } from 'react'
import Expense from './pages/expense/Expense'
import Home from './pages/home/Home'
import Income from './pages/income/Income'
import Movements from './pages/movements/Movements'
import Saving from './pages/saving/Saving'

function shouldLockLandscape() {
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight
  const isLandscape = viewportWidth > viewportHeight
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  const isTouchDevice = hasCoarsePointer || navigator.maxTouchPoints > 0
  const looksLikeMobileViewport = Math.max(viewportWidth, viewportHeight) <= 1100

  return isLandscape && isTouchDevice && looksLikeMobileViewport
}

function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'income' | 'expense' | 'saving' | 'movements'
  >('home')
  const [savingInitialTab, setSavingInitialTab] = useState<'list' | 'new'>('list')
  const [isLandscapeLocked, setIsLandscapeLocked] = useState(false)

  useEffect(() => {
    const syncOrientationLock = () => {
      setIsLandscapeLocked(shouldLockLandscape())
    }

    syncOrientationLock()

    window.addEventListener('resize', syncOrientationLock)
    window.addEventListener('orientationchange', syncOrientationLock)
    window.visualViewport?.addEventListener('resize', syncOrientationLock)
    screen.orientation?.addEventListener?.('change', syncOrientationLock)

    return () => {
      window.removeEventListener('resize', syncOrientationLock)
      window.removeEventListener('orientationchange', syncOrientationLock)
      window.visualViewport?.removeEventListener('resize', syncOrientationLock)
      screen.orientation?.removeEventListener?.('change', syncOrientationLock)
    }
  }, [])

  let currentScreen = (
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

  if (currentView === 'income') {
    currentScreen = (
      <Suspense fallback={null}>
        <Income onClose={() => setCurrentView('home')} />
      </Suspense>
    )
  }

  if (currentView === 'expense') {
    currentScreen = (
      <Suspense fallback={null}>
        <Expense onClose={() => setCurrentView('home')} />
      </Suspense>
    )
  }

  if (currentView === 'saving') {
    currentScreen = (
      <Suspense fallback={null}>
        <Saving
          initialTab={savingInitialTab}
          onBack={() => setCurrentView('home')}
        />
      </Suspense>
    )
  }

  if (currentView === 'movements') {
    currentScreen = (
      <Suspense fallback={null}>
        <Movements onBack={() => setCurrentView('home')} />
      </Suspense>
    )
  }

  return (
    <div
      className={`app-orientation-lock${isLandscapeLocked ? ' app-orientation-lock--active' : ''}`}
    >
      <div className="app-orientation-lock__content">{currentScreen}</div>
      <div
        className="app-orientation-lock__overlay"
        role="alert"
        aria-live="assertive"
        aria-hidden={!isLandscapeLocked}
      >
        <div className="app-orientation-lock__card">
          <h2 className="app-orientation-lock__title">Usa tu celular en vertical</h2>
          <p className="app-orientation-lock__text">
            Para el correcto funcionamiento de la app, gira el dispositivo a modo vertical.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
