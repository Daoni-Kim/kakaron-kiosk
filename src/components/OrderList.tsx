import type { OrderWithMenu } from '../types'

interface Props {
  orders: OrderWithMenu[]
  userName: string
  onCancel: () => void
}

function relTime(iso: string): string {
  const ts = new Date(iso).getTime()
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const d = new Date(ts)
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function OrderList({ orders, userName, onCancel }: Props) {
  const sorted = [...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  if (sorted.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <span className="font-bebas text-5xl text-[#3D3D3D] tracking-[0.1em] block mb-2.5">
          —
        </span>
        <p className="font-montserrat font-light text-sm tracking-[0.15em] text-[#888] uppercase leading-8">
          No orders yet<br />Be the first to select
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      {sorted.map((o) => {
        const isMine =
          !!userName && o.user_name.toLowerCase() === userName.trim().toLowerCase()
        return (
          <div
            key={o.id}
            className={`relative grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3.5 border animate-row-in ${
              isMine
                ? 'bg-accent/[0.12] border-accent/20'
                : 'bg-[#1A1A1A] border-white/[0.04]'
            }`}
          >
            {/* 좌측 바 */}
            <div
              className={`absolute left-0 top-0 w-0.5 h-full ${isMine ? 'bg-accent' : 'bg-[#3D3D3D]'}`}
            />

            <div>
              <div className="font-montserrat font-bold text-[15px] text-white tracking-[0.04em] uppercase">
                {o.user_name}
              </div>
              <div
                className={`font-noto font-normal text-sm mt-1 flex items-center gap-1.5 ${
                  isMine ? 'text-accent' : 'text-[#AAA]'
                }`}
              >
                {o.menu?.icon} {o.menu?.name}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-montserrat font-normal text-xs tracking-[0.06em] text-[#888]">
                {relTime(o.created_at)}
              </span>
              {isMine && (
                <button
                  onClick={onCancel}
                  className="bg-transparent border border-[#3D3D3D] text-[#888] cursor-pointer text-xs px-2.5 py-1 font-mono transition-all hover:border-accent hover:text-accent"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
