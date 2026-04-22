import type { Menu } from '../types'

interface ChartItem {
  menu: Menu
  count: number
  pct: number
}

interface Props {
  data: ChartItem[]
}

export default function OrderChart({ data }: Props) {
  if (data.length === 0) return null

  return (
    <div className="px-6 pt-5 pb-2 shrink-0 border-b border-white/[0.08]">
      <div className="font-montserrat font-bold text-[11px] tracking-[0.22em] text-[#888] uppercase mb-3">
        Popularity
      </div>
      {data.map((item) => (
        <div key={item.menu.id} className="flex items-center gap-3 mb-2.5">
          <span className="text-base shrink-0">{item.menu.icon}</span>
          <span className="font-noto font-normal text-sm text-[#DDD] w-[100px] shrink-0 whitespace-nowrap overflow-hidden text-ellipsis">
            {item.menu.name}
          </span>
          <div className="flex-1 h-0.5 bg-[#2C2C2C] relative overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-600 ease-out"
              style={{ width: `${item.pct}%` }}
            />
          </div>
          <span className="font-montserrat font-bold text-sm text-accent min-w-[20px] text-right">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  )
}
