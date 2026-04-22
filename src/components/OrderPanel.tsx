import { useState, useCallback } from 'react'
import type { OrderWithMenu, Menu } from '../types'
import { CAT_META } from '../types'
import { MENUS } from '../data/menu'
import OrderChart from './OrderChart'
import OrderList from './OrderList'
import Toast from './Toast'

interface ChartItem {
  menu: Menu
  count: number
  pct: number
}

interface Props {
  orders: OrderWithMenu[]
  userName: string
  totalOrders: number
  varietyCount: number
  macaronCount: number
  popularityChart: ChartItem[]
  onCancel: () => void
  onRefresh: () => Promise<void>
  onClearAll: () => Promise<void>
}

export default function OrderPanel({
  orders,
  userName,
  totalOrders,
  varietyCount,
  macaronCount,
  popularityChart,
  onCancel,
  onRefresh,
  onClearAll,
}: Props) {
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState('')
  const [showAdminConfirm, setShowAdminConfirm] = useState(false)
  const [adminPw, setAdminPw] = useState('')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setTimeout(() => {
      setRefreshing(false)
      showToast('Updated')
    }, 300)
  }

  const handleCopy = () => {
    if (orders.length === 0) {
      showToast('No orders to copy')
      return
    }
    const text = buildSummaryText(orders)
    navigator.clipboard.writeText(text).then(
      () => showToast('Copied to clipboard'),
      () => showToast('Copy failed'),
    )
  }

  const handleClearAll = async () => {
    if (adminPw === '1234') {
      await onClearAll()
      setShowAdminConfirm(false)
      setAdminPw('')
      showToast('All orders cleared')
    } else {
      showToast('Wrong password')
    }
  }

  return (
    <div className="order-panel-wrap">
      {/* 헤더 */}
      <div className="px-7 pt-7 pb-6 border-b border-white/[0.08] shrink-0 relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-[60px] after:h-px after:bg-accent">
        <div className="font-montserrat font-bold text-xs tracking-[0.25em] text-accent uppercase mb-1.5">
          Live
        </div>
        <div className="font-bebas text-[36px] tracking-[0.1em] text-white leading-none">
          Order Board
        </div>
        <div className="font-montserrat font-normal text-sm tracking-[0.1em] text-[#888] mt-1.5">
          Shared with your team · Auto-sync
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 border-b border-white/[0.08] shrink-0">
        {[
          { val: totalOrders, label: 'Orders', accent: true },
          { val: varietyCount, label: 'Variety', accent: false },
          { val: macaronCount, label: 'Macaron', accent: false },
        ].map((s) => (
          <div key={s.label} className="py-5 px-2.5 text-center border-r border-white/[0.08] last:border-r-0">
            <div className={`font-bebas text-[48px] tracking-[0.04em] leading-none ${s.accent ? 'text-accent' : 'text-white'}`}>
              {s.val}
            </div>
            <div className="font-montserrat font-medium text-[11px] tracking-[0.18em] uppercase text-[#888] mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <OrderChart data={popularityChart} />

      {/* 주문 목록 */}
      <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
        <div className="font-montserrat font-bold text-[11px] tracking-[0.22em] text-[#888] uppercase mb-3">
          Order Details
        </div>
        <OrderList orders={orders} userName={userName} onCancel={onCancel} />
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 py-4 border-t border-white/[0.08] flex gap-1.5 shrink-0 bg-[#111]">
        <button
          onClick={handleRefresh}
          className="flex-1 bg-transparent border border-[#3D3D3D] text-[#888] py-3.5 px-2.5 font-montserrat font-bold text-xs tracking-[0.18em] uppercase cursor-pointer flex items-center justify-center gap-2 transition-all hover:text-white hover:border-[#666]"
        >
          ↻&nbsp;{refreshing ? '...' : 'Refresh'}
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 bg-accent text-black py-3.5 px-2.5 font-montserrat font-bold text-xs tracking-[0.18em] uppercase cursor-pointer flex items-center justify-center gap-2 transition-all border-0 hover:bg-white hover:-translate-y-px"
        >
          ↗&nbsp;Copy Summary
        </button>
      </div>

      {/* 관리자 초기화 */}
      <div className="px-5 pb-4 shrink-0 bg-[#111]">
        {!showAdminConfirm ? (
          <button
            onClick={() => setShowAdminConfirm(true)}
            className="w-full bg-transparent border border-[#2C2C2C] text-[#555] py-2.5 font-montserrat font-bold text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-all hover:text-[#888] hover:border-[#3D3D3D]"
          >
            Admin: Clear All
          </button>
        ) : (
          <div className="flex gap-1.5">
            <input
              type="password"
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              placeholder="Password"
              className="flex-1 bg-transparent border border-[#3D3D3D] text-white px-3 py-2.5 font-montserrat text-sm outline-none focus:border-accent"
              onKeyDown={(e) => e.key === 'Enter' && handleClearAll()}
            />
            <button
              onClick={handleClearAll}
              className="bg-red-600 text-white px-4 py-2.5 font-montserrat font-bold text-xs tracking-[0.08em] uppercase cursor-pointer border-0"
            >
              Clear
            </button>
            <button
              onClick={() => { setShowAdminConfirm(false); setAdminPw('') }}
              className="bg-transparent border border-[#3D3D3D] text-[#888] px-3 py-2.5 font-montserrat text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <Toast message={toast} />
    </div>
  )
}

// ── 집계 텍스트 생성 ──
function buildSummaryText(orders: OrderWithMenu[]): string {
  const d = new Date()
  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`

  const counts: Record<string, number> = {}
  for (const o of orders) {
    counts[o.menu_id] = (counts[o.menu_id] ?? 0) + 1
  }

  const byCat: Record<string, { name: string; count: number }[]> = {
    macaron: [],
    dacquoise: [],
  }

  for (const [menuId, count] of Object.entries(counts)) {
    const menu = MENUS.find((m) => m.id === menuId)
    if (menu) {
      byCat[menu.category].push({ name: menu.name, count })
    }
  }

  let out = `[카카론 주문 집계] ${dateStr} / 총 ${orders.length}건\n\n`

  if (byCat.macaron.length) {
    out += `■ 마카롱\n`
    byCat.macaron.sort((a, b) => b.count - a.count).forEach((i) => {
      out += `  · ${i.name} × ${i.count}\n`
    })
    out += '\n'
  }

  if (byCat.dacquoise.length) {
    out += `■ 다쿠아즈\n`
    byCat.dacquoise.sort((a, b) => b.count - a.count).forEach((i) => {
      out += `  · ${i.name} × ${i.count}\n`
    })
    out += '\n'
  }

  out += `■ 주문자 목록\n`
  const sorted = [...orders].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )
  for (const o of sorted) {
    const menu = MENUS.find((m) => m.id === o.menu_id)
    if (menu) {
      out += `  · ${o.user_name}: [${CAT_META[menu.category].ko}] ${menu.name}\n`
    }
  }

  return out
}
