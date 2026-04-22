import { useState, useEffect, useCallback } from 'react'
import { getSupabase, getTodaySessionId } from '../lib/supabase'
import { MENUS } from '../data/menu'
import { CAT_META } from '../types'
import type { Order } from '../types'

interface SessionOption {
  session_id: string
  count: number
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sessions, setSessions] = useState<SessionOption[]>([])
  const [selectedSession, setSelectedSession] = useState(getTodaySessionId())
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }, [])

  // 세션 목록 로드
  const fetchSessions = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return

    const { data } = await supabase
      .from('orders')
      .select('session_id')
      .order('session_id', { ascending: false })

    if (data) {
      const counts: Record<string, number> = {}
      for (const row of data) {
        counts[row.session_id] = (counts[row.session_id] ?? 0) + 1
      }
      setSessions(
        Object.entries(counts).map(([session_id, count]) => ({ session_id, count }))
      )
    }
  }, [])

  // 주문 로드
  const fetchOrders = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('session_id', selectedSession)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
  }, [selectedSession])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // 개별 주문 삭제
  const deleteOrder = async (id: string) => {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.from('orders').delete().eq('id', id)
    showToast('주문 삭제됨')
    fetchOrders()
    fetchSessions()
  }

  // 세션 전체 삭제
  const clearSession = async () => {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.from('orders').delete().eq('session_id', selectedSession)
    setConfirmClear(false)
    showToast(`${selectedSession} 주문 전체 삭제됨`)
    fetchOrders()
    fetchSessions()
  }

  // 집계 계산
  const menuCounts: Record<string, { menu_id: string; name: string; category: string; icon: string; count: number }> = {}
  for (const o of orders) {
    if (!menuCounts[o.menu_id]) {
      const m = MENUS.find((x) => x.id === o.menu_id)
      menuCounts[o.menu_id] = {
        menu_id: o.menu_id,
        name: m?.name ?? o.menu_id,
        category: m?.category ?? '',
        icon: m?.icon ?? '',
        count: 0,
      }
    }
    menuCounts[o.menu_id].count++
  }
  const sortedCounts = Object.values(menuCounts).sort((a, b) => b.count - a.count)
  const macaronTotal = orders.filter((o) => MENUS.find((m) => m.id === o.menu_id)?.category === 'macaron').length
  const dacquoiseTotal = orders.length - macaronTotal

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#fff', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 헤더 */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 48px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: '#0A0A0A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 40, background: '#E8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue'", fontSize: 22, color: '#0A0A0A' }}>K</div>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: '0.18em', color: '#fff' }}>
            KAK<span style={{ color: '#E8FF00' }}>A</span>RON
          </span>
          <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
          <span style={{ fontFamily: "'Montserrat'", fontWeight: 500, fontSize: 12, letterSpacing: '0.25em', color: '#E8FF00', textTransform: 'uppercase' }}>Admin</span>
        </div>
        <a href="/" style={{ fontFamily: "'Montserrat'", fontWeight: 600, fontSize: 13, color: '#888', textDecoration: 'none', letterSpacing: '0.1em' }}>
          ← Back to Kiosk
        </a>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px' }}>
        {/* 세션 선택 + 통계 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Montserrat'", fontWeight: 700, fontSize: 11, letterSpacing: '0.22em', color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>Session Date</div>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              style={{ background: '#1A1A1A', border: '1px solid #3D3D3D', color: '#fff', padding: '10px 16px', fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 600, outline: 'none', minWidth: 200, cursor: 'pointer' }}
            >
              {sessions.map((s) => (
                <option key={s.session_id} value={s.session_id}>
                  {s.session_id} ({s.count}건)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
            {[
              { label: 'Total', val: orders.length, accent: true },
              { label: 'Macaron', val: macaronTotal, accent: false },
              { label: 'Dacquoise', val: dacquoiseTotal, accent: false },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '12px 20px', background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: s.accent ? '#E8FF00' : '#fff', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: "'Montserrat'", fontWeight: 500, fontSize: 10, letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 메뉴별 집계 */}
        {sortedCounts.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Montserrat'", fontWeight: 700, fontSize: 11, letterSpacing: '0.22em', color: '#888', textTransform: 'uppercase', marginBottom: 12 }}>Menu Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
              {sortedCounts.map((item) => (
                <div key={item.menu_id} style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.04)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#F0F0F0' }}>{item.name}</div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {item.category ? CAT_META[item.category as keyof typeof CAT_META]?.ko : ''}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, color: '#E8FF00', lineHeight: 1 }}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주문 목록 테이블 */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: "'Montserrat'", fontWeight: 700, fontSize: 11, letterSpacing: '0.22em', color: '#888', textTransform: 'uppercase' }}>
              Order List — {orders.length}건
            </div>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                style={{ background: 'transparent', border: '1px solid #3D3D3D', color: '#666', padding: '8px 16px', fontFamily: "'Montserrat'", fontWeight: 700, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Clear All Orders
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={clearSession}
                  style={{ background: '#dc2626', border: 'none', color: '#fff', padding: '8px 20px', fontFamily: "'Montserrat'", fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  style={{ background: 'transparent', border: '1px solid #3D3D3D', color: '#888', padding: '8px 16px', fontFamily: "'Montserrat'", fontSize: 11, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#666', fontFamily: "'Montserrat'", fontSize: 13 }}>Loading...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#3D3D3D' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 48, letterSpacing: '0.1em', marginBottom: 8 }}>—</div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase' }}>No orders for this session</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orders.map((o) => {
                const menu = MENUS.find((m) => m.id === o.menu_id)
                const time = new Date(o.created_at)
                const timeStr = `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`
                return (
                  <div key={o.id} style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.04)', padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 22 }}>{menu?.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Montserrat'", fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {o.user_name}
                        </div>
                        <div style={{ fontSize: 14, color: '#AAA', marginTop: 2 }}>
                          {menu?.name ?? o.menu_id}
                          <span style={{ fontFamily: "'Montserrat'", fontSize: 11, color: '#666', marginLeft: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {menu ? CAT_META[menu.category].ko : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: "'Montserrat'", fontSize: 12, color: '#666' }}>{timeStr}</span>
                      <button
                        onClick={() => deleteOrder(o.id)}
                        style={{ background: 'transparent', border: '1px solid #3D3D3D', color: '#666', padding: '6px 12px', fontFamily: 'monospace', fontSize: 12, cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3D3D3D'; e.currentTarget.style.color = '#666' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#000', padding: '14px 32px', fontFamily: "'Montserrat'", fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', borderLeft: '4px solid #E8FF00', zIndex: 999 }}>
          {toast}
        </div>
      )}
    </div>
  )
}
