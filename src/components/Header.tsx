export default function Header() {
  const d = new Date()
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${days[d.getDay()]}`

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-white/[0.08] h-[72px] flex items-center justify-between px-6 md:px-12 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gradient-to-r after:from-accent after:to-transparent after:opacity-60">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-accent flex items-center justify-center font-bebas text-[22px] text-black shrink-0">
          K
        </div>
        <div className="font-bebas text-[32px] tracking-[0.18em] text-white leading-none">
          KAK<span className="text-accent">A</span>RON
        </div>
        <div className="hidden sm:block w-px h-5 bg-white/[0.08] mx-1" />
        <div className="hidden sm:block font-montserrat font-medium text-xs tracking-[0.25em] text-[#888] uppercase leading-none">
          Order Kiosk
        </div>
      </div>
      <div className="text-right">
        <div className="font-montserrat font-semibold text-[15px] tracking-[0.1em] text-[#F0F0F0]">
          {dateStr}
        </div>
        <div className="font-montserrat font-normal text-xs tracking-[0.15em] text-[#888] uppercase mt-0.5">
          Team Daily Order
        </div>
      </div>
    </header>
  )
}
