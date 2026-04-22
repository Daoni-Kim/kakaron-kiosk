import { MENUS } from '../data/menu'
import { CAT_META } from '../types'
import type { FilterType, Category, OrderWithMenu } from '../types'
import MenuCard from './MenuCard'

interface Props {
  filter: FilterType
  myOrder: OrderWithMenu | null
  onSelect: (menuId: string) => void
}

export default function MenuGrid({ filter, myOrder, onSelect }: Props) {
  const cats: Category[] = filter === 'all' ? ['macaron', 'dacquoise'] : [filter as Category]

  return (
    <div>
      {cats.map((catKey) => {
        const meta = CAT_META[catKey]
        const items = MENUS.filter((m) => m.category === catKey && m.is_active)

        return (
          <div key={catKey}>
            {/* 카테고리 헤딩 */}
            <div className="flex items-center gap-5 mb-5">
              <div className="font-bebas text-[32px] tracking-[0.1em] text-white leading-none whitespace-nowrap">
                {meta.ko}<span className="text-accent">.</span>
              </div>
              <div className="flex-1 h-px bg-white/[0.08]" />
              <div className="font-montserrat font-medium text-xs tracking-[0.15em] text-[#888] uppercase">
                {items.length} items
              </div>
            </div>

            {/* 그리드 */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-0.5 mb-0.5">
              {items.map((menu, i) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  index={i}
                  isSelected={myOrder?.menu_id === menu.id}
                  onClick={() => onSelect(menu.id)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
