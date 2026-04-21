import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'

function App() {
  const aboutImageUrl =
    'https://images.unsplash.com/photo-1581578017424-0cfea7e49b1c?auto=format&fit=crop&w=1800&q=80'
  const serviceImages = {
    ac: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=80',
    maint:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1800&q=80',
    elec: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1800&q=80',
  }

  const sections = useMemo(
    () => [
      { id: 'about', label: 'About' },
      { id: 'discount', label: 'Discounts' },
      { id: 'services', label: 'Services' },
      { id: 'reviews', label: 'Reviews' },
      { id: 'faq', label: 'FAQ' },
      { id: 'contact', label: 'Contact' },
    ],
    []
  )

  const [activeSectionId, setActiveSectionId] = useState<string>('about')
  const [progress, setProgress] = useState<number>(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)
  const heroCursorLogoRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const heroEl = heroRef.current
    const logoEl = heroCursorLogoRef.current
    if (!heroEl || !logoEl) return

    const target = { x: 0, y: 0, visible: false }
    const current = { x: 0, y: 0, visible: false }
    let raf = 0

    const loop = () => {
      const k = 0.14
      current.x += (target.x - current.x) * k
      current.y += (target.y - current.y) * k

      if (target.visible !== current.visible) current.visible = target.visible

      logoEl.style.setProperty('--x', `${current.x}px`)
      logoEl.style.setProperty('--y', `${current.y}px`)
      logoEl.dataset.visible = current.visible ? 'true' : 'false'

      raf = window.requestAnimationFrame(loop)
    }

    const updateFromEvent = (clientX: number, clientY: number) => {
      const r = heroEl.getBoundingClientRect()
      const x = clientX - r.left
      const y = clientY - r.top

      target.x = Math.min(r.width, Math.max(0, x))
      target.y = Math.min(r.height, Math.max(0, y))
      target.visible = true
    }

    const onPointerMove = (e: PointerEvent) => updateFromEvent(e.clientX, e.clientY)
    const onPointerEnter = (e: PointerEvent) => updateFromEvent(e.clientX, e.clientY)
    const onPointerLeave = () => {
      target.visible = false
    }

    heroEl.addEventListener('pointermove', onPointerMove, { passive: true })
    heroEl.addEventListener('pointerenter', onPointerEnter, { passive: true })
    heroEl.addEventListener('pointerleave', onPointerLeave, { passive: true })
    raf = window.requestAnimationFrame(loop)

    return () => {
      heroEl.removeEventListener('pointermove', onPointerMove)
      heroEl.removeEventListener('pointerenter', onPointerEnter)
      heroEl.removeEventListener('pointerleave', onPointerLeave)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight)
      setProgress(Math.min(1, Math.max(0, doc.scrollTop / max)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = sections.map((s) => s.id)
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const id = (e.target as HTMLElement).id
          if (id) setActiveSectionId(id)
        }
      },
      { root: null, rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.1, 0.2] }
    )

    for (const t of targets) io.observe(t)
    return () => io.disconnect()
  }, [sections])

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.section, .hero, .footer, .section__heading, .aboutGrid, .cards3, .discountGrid, .whyGrid, .reviewRail, .faqList, .footer__grid'
      )
    )
    for (const el of targets) el.classList.add('reveal')

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          ;(e.target as HTMLElement).classList.add('reveal--in')
          io.unobserve(e.target)
        }
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    )

    for (const t of targets) io.observe(t)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  return (
    <div className="app">
      <header className="nav" data-scrolled={progress > 0.02 ? 'true' : 'false'}>
        <div className="nav__progress" aria-hidden="true">
          <div className="nav__progressBar" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <a className="nav__brand" href="#main">
          Otter Services
        </a>

        <nav className="nav__pill" aria-label="Primary">
          {sections
            .filter((s) => s.id !== 'contact')
            .map((s) => (
              <a
                key={s.id}
                className="nav__link"
                href={`#${s.id}`}
                data-active={activeSectionId === s.id ? 'true' : 'false'}
              >
                {s.label}
              </a>
            ))}
        </nav>

        <button
          className="nav__menuButton"
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="nav__menuIcon" aria-hidden="true" />
        </button>

        <a className="nav__cta" href="#contact">
          Contact
        </a>

        <div
          className="nav__mobile"
          data-open={mobileOpen ? 'true' : 'false'}
          aria-hidden={mobileOpen ? 'false' : 'true'}
        >
          <div className="nav__mobilePanel" role="dialog" aria-label="Mobile menu">
            {sections.map((s) => (
              <a
                key={s.id}
                className="nav__mobileLink"
                href={`#${s.id}`}
                data-active={activeSectionId === s.id ? 'true' : 'false'}
                onClick={() => setMobileOpen(false)}
              >
                {s.label}
              </a>
            ))}
            <a className="nav__mobileCTA" href="tel:+19253269171" onClick={() => setMobileOpen(false)}>
              Call now
            </a>
          </div>
          <button
            className="nav__mobileBackdrop"
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      </header>

      <main id="main" className="page">
        <section ref={heroRef} className="hero" aria-labelledby="hero-title">
          <div className="hero__bg" aria-hidden="true" />
          <div ref={heroCursorLogoRef} className="hero__cursorLogo" aria-hidden="true">
            <img className="hero__cursorLogoImg" src={reactLogo} alt="" />
          </div>
          <div className="hero__content">
            <p className="hero__kicker">Installation and repair</p>
            <h1 id="hero-title" className="hero__title">
              HVAC <span className="hero__amp">&amp;</span> Electrical Systems
            </h1>
            <p className="hero__sub">
              Professional installations, maintenance, diagnostics and repairs.
            </p>

            <div className="hero__actions">
              <a className="button button--primary" href="tel:+19253269171">
                Call now
              </a>
              <a className="button button--ghost" href="#contact">
                Get a consultation
              </a>
            </div>

            <div className="hero__meta">
              <span>7am–10pm every day</span>
              <span className="dot" aria-hidden="true" />
              <span>+1 (925) 326-9171</span>
            </div>
          </div>
        </section>

        <section id="about" className="section section--about">
          <div className="section__heading">
            <span className="chip">About</span>
            <h2 className="section__title">Friendly. Certified. Trusted.</h2>
            <p className="section__lead">
              We prioritize safety, efficiency, comfort — and reuse/sustainable
              materials where possible.
            </p>
          </div>

          <div className="aboutGrid">
            <div className="aboutCard">
              <h3>Otter Services</h3>
              <p>
                A local team focused on HVAC and electrical work with clear
                communication and clean installs.
              </p>
              <ul className="aboutStats">
                <li>
                  <strong>10+</strong>
                  <span>Years</span>
                </li>
                <li>
                  <strong>2000+</strong>
                  <span>Projects</span>
                </li>
                <li>
                  <strong>1800+</strong>
                  <span>Clients</span>
                </li>
                <li>
                  <strong>160</strong>
                  <span>5-star reviews</span>
                </li>
              </ul>
            </div>
            <div className="aboutImageWrap">
              <img
                className="aboutImage"
                src={aboutImageUrl}
                alt="Technician servicing HVAC equipment"
                loading="lazy"
              />
              <div className="aboutImageOverlay" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="section__heading">
            <span className="chip">Services</span>
            <h2 className="section__title">What we are offering</h2>
          </div>

          <div className="cards3">
            <a className="serviceCard" href="#contact">
              <div className="serviceCard__top">
                <div className="serviceCard__icon" aria-hidden="true">
                  AC
                </div>
                <h3>Air conditioner installation</h3>
              </div>
              <div className="serviceCard__media">
                <img
                  className="serviceCard__img"
                  src={serviceImages.ac}
                  alt="Air conditioner installation"
                  loading="lazy"
                />
                <div className="serviceCard__overlay serviceCard__overlay--ac" aria-hidden="true" />
              </div>
            </a>

            <a className="serviceCard" href="#contact">
              <div className="serviceCard__top">
                <div className="serviceCard__icon" aria-hidden="true">
                  MA
                </div>
                <h3>Air conditioning maintenance</h3>
              </div>
              <div className="serviceCard__media">
                <img
                  className="serviceCard__img"
                  src={serviceImages.maint}
                  alt="Air conditioning maintenance"
                  loading="lazy"
                />
                <div
                  className="serviceCard__overlay serviceCard__overlay--maint"
                  aria-hidden="true"
                />
              </div>
            </a>

            <a className="serviceCard" href="#contact">
              <div className="serviceCard__top">
                <div className="serviceCard__icon" aria-hidden="true">
                  EL
                </div>
                <h3>Electrical systems installation</h3>
              </div>
              <div className="serviceCard__media">
                <img
                  className="serviceCard__img"
                  src={serviceImages.elec}
                  alt="Electrical systems installation"
                  loading="lazy"
                />
                <div
                  className="serviceCard__overlay serviceCard__overlay--elec"
                  aria-hidden="true"
                />
              </div>
            </a>
          </div>
        </section>

        <section id="discount" className="section section--discount">
          <div className="section__heading">
            <span className="chip">Discount</span>
            <h2 className="section__title">We offer you</h2>
          </div>

          <div className="discountGrid">
            <div className="discountCard">
              <p className="discountCard__title">FREE HVAC DIAGNOSTIC</p>
              <p className="discountCard__sub">Limited-time for new customers</p>
            </div>
            <div className="discountCard">
              <p className="discountCard__title">SEASONAL DISCOUNTS 10%</p>
              <p className="discountCard__sub">Ask about current promotions</p>
            </div>
            <div className="discountCard">
              <p className="discountCard__title">WARRANTY UP TO 12 YEARS</p>
              <p className="discountCard__sub">On select HVAC installations</p>
            </div>
            <div className="discountCard">
              <p className="discountCard__title">THERMOSTAT INSTALLATION</p>
              <p className="discountCard__sub">Smart thermostats available</p>
            </div>
          </div>
        </section>

        <section className="section section--why">
          <div className="section__heading">
            <span className="chip">Why us</span>
            <h2 className="section__title">Why us?</h2>
          </div>

          <div className="whyGrid">
            <div className="whyCard">
              <h3>Proven reputation</h3>
              <p>Modern methods and reliable workmanship.</p>
            </div>
            <div className="whyCard">
              <h3>Customized solutions</h3>
              <p>We tailor options to your home and budget.</p>
            </div>
            <div className="whyCard">
              <h3>Client-centric focus</h3>
              <p>Clear estimates, transparent scope, fast scheduling.</p>
            </div>
          </div>
        </section>

        <section id="reviews" className="section section--reviews">
          <div className="section__heading">
            <span className="chip">Reviews</span>
            <h2 className="section__title">Testimonials</h2>
          </div>

          <div className="reviewRail">
            <article className="reviewCard">
              <p className="reviewCard__text">
                “Fast response, clear quote, and excellent work. Great
                communication throughout.”
              </p>
              <p className="reviewCard__by">
                <strong>Sarah G.</strong> <span>Yelp</span>
              </p>
            </article>
            <article className="reviewCard">
              <p className="reviewCard__text">
                “Professional and organized. They fixed the issue quickly and
                even handled an extra clog we didn’t notice.”
              </p>
              <p className="reviewCard__by">
                <strong>Shirley Z.</strong> <span>Yelp</span>
              </p>
            </article>
            <article className="reviewCard">
              <p className="reviewCard__text">
                “Great value compared to other estimates. Family is comfortable
                again.”
              </p>
              <p className="reviewCard__by">
                <strong>Alan V.</strong> <span>Yelp</span>
              </p>
            </article>
          </div>

          <a
            className="button button--primary button--reviews"
            href="https://yelp.to/AuCO0rTBtJ"
            target="_blank"
            rel="noreferrer"
          >
            View all reviews
          </a>
        </section>

        <section id="faq" className="section section--faq">
          <div className="section__heading">
            <span className="chip">FAQ</span>
            <h2 className="section__title">Got questions? We’ve got answers.</h2>
          </div>

          <div className="faqList">
            <details className="faqItem">
              <summary>What types of air conditioning systems do you install?</summary>
              <p>
                Split systems, heat pumps, package units — we’ll recommend what
                fits your space and goals.
              </p>
            </details>
            <details className="faqItem">
              <summary>How often should I service my air conditioner?</summary>
              <p>Typically 1–2 times per year depending on usage and filters.</p>
            </details>
            <details className="faqItem">
              <summary>What electrical services do you offer?</summary>
              <p>Panels, EV chargers, rough wiring, troubleshooting and more.</p>
            </details>
          </div>
        </section>

        <footer id="contact" className="footer">
          <div className="footer__grid">
            <div className="footer__headline">
              <div className="footer__lets">Let’s</div>
              <div className="footer__talk">Talk!</div>
            </div>

            <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
              <label>
                <span className="srOnly">Name</span>
                <input name="name" placeholder="Name" autoComplete="name" />
              </label>
              <label>
                <span className="srOnly">Phone and message</span>
                <textarea
                  name="message"
                  placeholder="Phone number and message"
                  rows={4}
                />
              </label>
              <button className="button button--accent" type="submit">
                Send
              </button>
            </form>
          </div>

          <div className="footer__info">
            <a href="mailto:otterhvacr@gmail.com">otterhvacr@gmail.com</a>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <a href="tel:+19253269171">+1 (925) 326-9171</a>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <span>Walnut Creek, CA</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
