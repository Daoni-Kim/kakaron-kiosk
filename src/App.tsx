import { useState, useCallback, useRef, useEffect } from 'react'
import Header from './components/Header'
import NameInput from './components/NameInput'
import CategoryTabs from './components/CategoryTabs'
import MenuGrid from './components/MenuGrid'
import OrderPanel from './components/OrderPanel'
import Toast from './components/Toast'
import BackgroundFX from './components/BackgroundFX'
import AdminPage from './components/AdminPage'
import { useLocalUser } from './hooks/useLocalUser'
import { useOrders } from './hooks/useOrders'
import type { FilterType } from './types'

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()

  if (hash === '#/admin') {
    return <AdminPage />
  }

  return <KioskPage />
}

function KioskPage() {
  const { userName, setUserName } = useLocalUser()
  const {
    orders,
    myOrder,
    totalOrders,
    varietyCount,
    macaronCount,
    popularityChart,
    selectMenu,
    cancelMyOrder,
    clearAllOrders,
    refresh,
  } = useOrders(userName)

  const [filter, setFilter] = useState<FilterType>('all')
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }, [])

  const handleSelect = useCallback(
    async (menuId: string) => {
      if (!userName.trim()) {
        showToast('이름을 먼저 입력해주세요')
        document.querySelector<HTMLInputElement>('input[maxlength="20"]')?.focus()
        return
      }
      const result = await selectMenu(menuId)
      if (result) {
        if (result.action === 'cancelled') showToast('Order cancelled')
        else showToast(`${result.menuName} — Ordered`)
      }
    },
    [userName, selectMenu, showToast],
  )

  return (
    <div className="min-h-screen relative">
      {/* 배경 효과 */}
      <BackgroundFX />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="absolute -top-[300px] -left-[300px] w-[800px] h-[800px] rounded-full bg-accent/[0.04] blur-[150px]" />
        <div className="absolute -bottom-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-[0.015]" />
      </div>

      <div className="relative z-10">
        <Header />
        <div className="layout-grid">
          <div className="menu-panel">
            <NameInput userName={userName} onChangeName={setUserName} myOrder={myOrder} />
            <CategoryTabs filter={filter} onChangeFilter={setFilter} />
            <MenuGrid filter={filter} myOrder={myOrder} onSelect={handleSelect} />
          </div>

          <OrderPanel
            orders={orders}
            userName={userName}
            totalOrders={totalOrders}
            varietyCount={varietyCount}
            macaronCount={macaronCount}
            popularityChart={popularityChart}
            onCancel={cancelMyOrder}
            onRefresh={refresh}
            onClearAll={clearAllOrders}
          />
        </div>
      </div>
      <Toast message={toast} />
    </div>
  )
}
