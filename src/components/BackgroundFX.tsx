import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -500, y: -500 })
  const particles = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const onClick = (e: MouseEvent) => {
      // 클릭 시 파티클 버스트
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5
        const speed = 1.5 + Math.random() * 3
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          size: 2 + Math.random() * 3,
        })
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)

    // 떠다니는 ambient 파티클
    const floaters: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number }[] = []
    for (let i = 0; i < 30; i++) {
      floaters.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.2,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // ── 마우스 글로우 ──
      const mx = mouse.current.x
      const my = mouse.current.y
      if (mx > 0 && my > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 250)
        grad.addColorStop(0, 'rgba(232, 255, 0, 0.06)')
        grad.addColorStop(0.5, 'rgba(232, 255, 0, 0.02)')
        grad.addColorStop(1, 'rgba(232, 255, 0, 0)')
        ctx.fillStyle = grad
        ctx.fillRect(mx - 250, my - 250, 500, 500)
      }

      // ── 떠다니는 파티클 ──
      for (const f of floaters) {
        f.x += f.vx
        f.y += f.vy
        f.pulse += 0.015

        // 화면 밖으로 나가면 반대편에서 등장
        if (f.x < -10) f.x = canvas.width + 10
        if (f.x > canvas.width + 10) f.x = -10
        if (f.y < -10) f.y = canvas.height + 10
        if (f.y > canvas.height + 10) f.y = -10

        // 마우스 근처면 살짝 밝아짐
        const dx = f.x - mx
        const dy = f.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const boost = dist < 200 ? (1 - dist / 200) * 0.4 : 0

        const alpha = (f.alpha + boost) * (0.6 + 0.4 * Math.sin(f.pulse))
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 255, 0, ${alpha})`
        ctx.fill()
      }

      // ── 클릭 파티클 ──
      const alive: Particle[] = []
      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.97
        p.vy *= 0.97
        p.life -= 0.02

        if (p.life > 0) {
          const alpha = p.life * 0.8
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(232, 255, 0, ${alpha})`
          ctx.fill()
          alive.push(p)
        }
      }
      particles.current = alive

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
