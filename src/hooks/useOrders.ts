import { useState, useEffect, useCallback, useRef } from 'react'
import { getSupabase, getTodaySessionId } from '../lib/supabase'
import { MENUS } from '../data/menu'
import type { Order, OrderWithMenu } from '../types'

function getMenuById(id: string) {
  return MENUS.find((m) => m.id === id)
}

function enrichOrders(orders: Order[]): OrderWithMenu[] {
  return orders.map((o) => ({ ...o, menu: getMenuById(o.menu_id) }))
}

// ── localStorage fallback ──
const LS_KEY = 'kakaron-orders-v2'

function loadLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const all: Order[] = JSON.parse(raw)
    const today = getTodaySessionId()
    return all.filter((o) => o.session_id === today)
  } catch {
    return []
  }
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(orders))
  } catch { /* ignore */ }
}

export function useOrders(userName: string) {
  const [orders, setOrders] = useState<OrderWithMenu[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<NonNullable<ReturnType<typeof getSupabase>>['channel']> | null>(null)
  const sessionId = getTodaySessionId()

  // ── Fetch ──
  const fetchOrders = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) {
      setOrders(enrichOrders(loadLocalOrders()))
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setOrders(enrichOrders(data ?? []))
    } catch (err) {
      console.error('Fetch orders failed:', err)
      setOrders(enrichOrders(loadLocalOrders()))
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  // ── Realtime subscription ──
  useEffect(() => {
    fetchOrders()

    const supabase = getSupabase()
    if (!supabase) return

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `session_id=eq.${sessionId}` },
        () => { fetchOrders() },
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [fetchOrders, sessionId])

  // ── Select / Toggle ──
  const selectMenu = useCallback(
    async (menuId: string): Promise<{ action: 'ordered' | 'cancelled' | 'replaced'; menuName: string } | null> => {
      const menu = getMenuById(menuId)
      if (!menu) return null
      const trimmedName = userName.trim()
      if (!trimmedName) return null

      const myOrder = orders.find(
        (o) => o.user_name.toLowerCase() === trimmedName.toLowerCase(),
      )

      const supabase = getSupabase()

      // ── 같은 메뉴 재클릭 → 취소 ──
      if (myOrder?.menu_id === menuId) {
        if (supabase) {
          await supabase.from('orders').delete().eq('id', myOrder.id)
        } else {
          const local = loadLocalOrders().filter((o) => o.id !== myOrder.id)
          saveLocalOrders(local)
          setOrders(enrichOrders(local))
        }
        return { action: 'cancelled', menuName: menu.name }
      }

      // ── 새 주문 or 교체 ──
      if (supabase) {
        const { error } = await supabase.from('orders').upsert(
          {
            user_name: trimmedName,
            menu_id: menuId,
            session_id: sessionId,
          },
          { onConflict: 'user_name,session_id' },
        )
        if (error) {
          console.error('Upsert failed:', error)
          return null
        }
      } else {
        let local = loadLocalOrders().filter(
          (o) => o.user_name.toLowerCase() !== trimmedName.toLowerCase(),
        )
        const newOrder: Order = {
          id: crypto.randomUUID(),
          user_name: trimmedName,
          menu_id: menuId,
          session_id: sessionId,
          created_at: new Date().toISOString(),
        }
        local = [newOrder, ...local]
        saveLocalOrders(local)
        setOrders(enrichOrders(local))
      }

      return { action: myOrder ? 'replaced' : 'ordered', menuName: menu.name }
    },
    [userName, orders, sessionId],
  )

  // ── Delete my order ──
  const cancelMyOrder = useCallback(async () => {
    const trimmedName = userName.trim()
    if (!trimmedName) return
    const myOrder = orders.find(
      (o) => o.user_name.toLowerCase() === trimmedName.toLowerCase(),
    )
    if (!myOrder) return

    const supabase = getSupabase()
    if (supabase) {
      await supabase.from('orders').delete().eq('id', myOrder.id)
    } else {
      const local = loadLocalOrders().filter((o) => o.id !== myOrder.id)
      saveLocalOrders(local)
      setOrders(enrichOrders(local))
    }
  }, [userName, orders])

  // ── Clear all (admin) ──
  const clearAllOrders = useCallback(async () => {
    const supabase = getSupabase()
    if (supabase) {
      await supabase.from('orders').delete().eq('session_id', sessionId)
    } else {
      saveLocalOrders([])
      setOrders([])
    }
  }, [sessionId])

  // ── Derived ──
  const myOrder = orders.find(
    (o) => userName && o.user_name.toLowerCase() === userName.trim().toLowerCase(),
  ) ?? null

  const totalOrders = orders.length
  const varietyCount = new Set(orders.map((o) => o.menu_id)).size
  const macaronCount = orders.filter((o) => o.menu?.category === 'macaron').length

  const popularityChart = (() => {
    const counts: Record<string, number> = {}
    for (const o of orders) {
      counts[o.menu_id] = (counts[o.menu_id] ?? 0) + 1
    }
    const max = Math.max(...Object.values(counts), 1)
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([menuId, count]) => ({
        menu: getMenuById(menuId)!,
        count,
        pct: (count / max) * 100,
      }))
      .filter((x) => x.menu)
  })()

  return {
    orders,
    myOrder,
    loading,
    totalOrders,
    varietyCount,
    macaronCount,
    popularityChart,
    selectMenu,
    cancelMyOrder,
    clearAllOrders,
    refresh: fetchOrders,
  }
}
