import { MENUS } from '../data/menu'
import type { FilterType } from '../types'

interface Props {
  filter: FilterType
  onChangeFilter: (f: FilterType) => void
}

export default function CategoryTabs({ filter, onChangeFilter }: Props) {
  const mc = MENUS.filter((m) => m.category === 'macaron').length
  const dq = MENUS.filter((m) => m.category === 'dacquoise').length

  const tabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: MENUS.length },
    { key: 'macaron', label: 'Macaron', count: mc },
    { key: 'dacquoise', label: 'Dacquoise', count: dq },
  ]

  return (
    <div className="flex gap-0.5 mb-9">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChangeFilter(t.key)}
          className={`relative overflow-hidden px-7 py-3.5 font-montserrat font-bold text-sm tracking-[0.18em] uppercase cursor-pointer flex items-center gap-2.5 transition-all duration-200 border ${
            filter === t.key
              ? 'bg-accent text-black border-accent'
              : 'bg-[#1A1A1A] border-white/[0.08] text-[#888] hover:text-white hover:border-[#3D3D3D]'
          }`}
        >
          {t.label}
          <span className="text-xs font-normal opacity-65">{t.count}</span>
        </button>
      ))}
    </div>
  )
}
