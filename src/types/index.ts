export type Category = 'macaron' | 'dacquoise'
export type FilterType = 'all' | Category

export interface Menu {
  id: string
  category: Category
  name: string
  icon: string
  sort_order: number
  is_active: boolean
}

export interface Order {
  id: string
  user_name: string
  menu_id: string
  session_id: string
  created_at: string
}

export interface OrderWithMenu extends Order {
  menu?: Menu
}

export const CAT_META: Record<Category, { label: string; ko: string }> = {
  macaron: { label: 'Macaron', ko: '마카롱' },
  dacquoise: { label: 'Dacquoise', ko: '다쿠아즈' },
}
