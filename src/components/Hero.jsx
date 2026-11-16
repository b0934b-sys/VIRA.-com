import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// the Three.js scene is code-split: the main bundle stays small and the
// 3D loads after the page paints
const HeroScene = lazy(() => import('./Scene3D.jsx'))

export const SLIDES = [
  {
    eyebrow: 'Digital Creative Studio',
    lines: ['We Build', 'Digital Experiences', 'Beyond Expectations.'],
    goldLine: 2,
    sub: 'VIRAStudiopro is a digital studio crafting websites, systems and AI products for ambitious brands — designed, built and delivered, never templated.',
    cta: 'Explore Our Work',
  },
  {
    eyebrow: 'Websites',
    lines: ['Websites that', 'turn visitors', 'into customers.'],
    goldLine: 2,
    sub: 'High-end websites and online menus — from $1,000, designed for your brand and delivered fast.',
    cta: 'See the work',
  },
  {
    eyebrow: 'Digital Systems',
    lines: ['Systems that run', 'your business', 'while you sleep.'],
    goldLine: 2,
    sub: 'Orders, bookings, menus and dashboards in one system. No monthly fees, no lock-in.',
    cta: 'How it works',
  },
  {
    eyebrow: 'Artificial Intelligence',
    lines: ['AI that works', 'for you,', 'not instead of you.'],
    goldLine: 1,
    sub: 'Smart assistants and automation that answer customers and save hours every day.',
    cta: 'Talk to us',
  },
]

export default function Hero() {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const scrollRef = useRef(0)
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const autoRef = useRef(null)
  const s = SLIDES[slide]

  useEffect(() => {
    const mq = () => setIsMobile(window.innerWidth < 820)
    mq()
    window.addEventListener('resize', mq)
    return () => window.removeEventListener('resize', mq)
  }, [])

  // hero scroll progress for the 3D camera dolly
  useEffect(() => {
    const onScroll = () => {
      const h = sectionRef.current?.offsetHeight || window.innerHeight
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / h))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // pause the WebGL loop when the hero is off-screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // headline entrance on slide change
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-copy h1 .line > span',
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out', overwrite: true })
      gsap.fromTo([subRef.current, '.hero-cta'],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.35, stagger: 0.1, ease: 'power3.out', overwrite: true })
    }, sectionRef)
    return () => ctx.revert()
  }, [slide, reduced])

  // auto-advance the slider
  useEffect(() => {
    if (reduced) return
    autoRef.current = setInterval(() => setSlide((v) => (v + 1) % SLIDES.length), 6500)
    return () => clearInterval(autoRef.current)
  }, [reduced])

  const goTo = (i) => {
    setSlide(i)
    clearInterval(autoRef.current)
    if (!reduced) autoRef.current = setInterval(() => setSlide((v) => (v + 1) % SLIDES.length), 6500)
  }

  return (
    <section className="hero" id="top" ref={sectionRef} aria-label="Intro">
      <div className="hero-canvas">
        <div className="hero-fallback" aria-hidden="true" />
        <Suspense fallback={null}>
          <HeroScene slide={slide} scrollRef={scrollRef} isMobile={isMobile} reduced={reduced} paused={paused} />
        </Suspense>
      </div>
      <div className="wrap hero-content">
        <div className="hero-copy">
          <p className="eyebrow">{s.eyebrow}</p>
          <h1 ref={headlineRef} key={`h-${slide}`}>
            {s.lines.map((line, i) => (
              <span className="line" key={line}>
                <span className={i === s.goldLine ? 'gold-i' : ''}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-sub" ref={subRef} key={`s-${slide}`}>{s.sub}</p>
          <div className="hero-cta">
            <a className="circle-btn" href="#work" aria-label={s.cta}>→</a>
            <span>{s.cta}</span>
          </div>
        </div>
      </div>
      <div className="wrap hero-bottom">
        <div className="hero-count">
          <span><b>{String(slide + 1).padStart(2, '0')}</b> / {String(SLIDES.length).padStart(2, '0')}</span>
          <span className="bar"><i style={{ width: `${((slide + 1) / SLIDES.length) * 100}%` }} /></span>
        </div>
        <div className="hero-scroll">
          <span>Scroll to discover</span>
          <span className="mouse" aria-hidden="true" />
        </div>
      </div>
      <div className="hero-dots" role="tablist" aria-label="Hero slides">
        {SLIDES.map((sl, i) => (
          <button
            key={sl.eyebrow}
            type="button"
            role="tab"
            aria-selected={i === slide}
            aria-label={`Slide ${i + 1}: ${sl.eyebrow}`}
            className={i === slide ? 'active' : ''}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  )
}
