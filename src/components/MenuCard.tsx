import type { Menu } from '../types'
import { CAT_META } from '../types'

interface Props {
  menu: Menu
  index: number
  isSelected: boolean
  onClick: () => void
}

export default function MenuCard({ menu, index, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col gap-2.5 p-5 min-h-[148px] cursor-pointer text-left transition-all duration-150 border select-none group animate-fade-up ${
        isSelected
          ? 'bg-accent/[0.12] border-accent'
          : 'bg-[#1A1A1A] border-white/[0.04] hover:bg-[#222] hover:border-[#3D3D3D]'
      }`}
      style={{ animationDelay: `${index * 25}ms` }}
    >
      {/* 좌측 액센트 바 */}
      <div
        className={`absolute top-0 left-0 w-[3px] h-full bg-accent origin-bottom transition-transform duration-250 ${
          isSelected ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
        }`}
      />

      {/* 체크 마크 */}
      <div
        className={`absolute bottom-4 right-4 w-6 h-6 border-[1.5px] border-accent flex items-center justify-center transition-all duration-250 ${
          isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-60'
        }`}
      >
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
          <path d="M1 3.5L3.5 6L9 1" stroke="#E8FF00" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 상단 */}
      <div className="flex items-start justify-between w-full">
        <span className={`text-[32px] leading-none transition-transform duration-200 ${isSelected ? 'scale-110' : 'group-hover:scale-115'}`}>
          {menu.icon}
        </span>
        <span className={`font-montserrat font-light text-xs tracking-[0.1em] ${isSelected ? 'text-accent' : 'text-[#888]'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* 이름 */}
      <div className={`font-noto font-bold text-base leading-tight mt-auto ${isSelected ? 'text-white' : 'text-[#F0F0F0]'}`}>
        {menu.name}
      </div>
      <div className={`font-montserrat font-normal text-[11px] tracking-[0.18em] uppercase ${isSelected ? 'text-accent' : 'text-[#888]'}`}>
        {CAT_META[menu.category].label}
      </div>
    </button>
  )
}
