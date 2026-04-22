import type { OrderWithMenu } from '../types'

interface Props {
  userName: string
  onChangeName: (name: string) => void
  myOrder: OrderWithMenu | null
}

export default function NameInput({ userName, onChangeName, myOrder }: Props) {
  return (
    <div className="flex items-center gap-5 pb-8 border-b border-white/[0.08] mb-9 flex-wrap">
      <div className="font-montserrat font-bold text-xs tracking-[0.25em] uppercase text-[#888] whitespace-nowrap">
        Name
      </div>
      <div className="flex-1 min-w-[200px] relative group">
        <input
          type="text"
          value={userName}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="이름을 입력하세요"
          maxLength={20}
          autoComplete="off"
          className="w-full bg-transparent border-0 border-b border-[#3D3D3D] font-montserrat font-semibold text-2xl tracking-[0.06em] text-white py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[#555] placeholder:font-normal placeholder:text-base placeholder:normal-case uppercase"
        />
        <div className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-400 group-focus-within:w-full" />
      </div>
      <div
        className={`flex items-center gap-2 bg-accent text-black px-4 py-2 font-montserrat font-extrabold text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-300 ${
          myOrder ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-1.5 h-1.5 bg-black rounded-full" />
        Ordered
      </div>
    </div>
  )
}
