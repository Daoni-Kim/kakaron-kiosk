interface Props {
  message: string
}

export default function Toast({ message }: Props) {
  return (
    <div
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3.5 font-montserrat font-bold text-[11px] tracking-[0.18em] uppercase whitespace-nowrap border-l-4 border-accent z-[999] transition-all duration-300 ${
        message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {message}
    </div>
  )
}
