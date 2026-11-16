import { StarMark } from './Nav.jsx'

const WA = 'https://wa.me/963982238734?text=Hi%20VIRAStudiopro%2C%20I%20want%20a%20free%20preview%20for%20my%20business.'

export default function Contact() {
  return (
    <>
      <section className="contact" id="contact">
        <div className="wrap">
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Let&rsquo;s talk</p>
          <h2 className="reveal">Let&rsquo;s build <span className="gold-i">yours.</span></h2>
          <p className="reveal">
            Your business deserves to be found. Tell us what you do — we&rsquo;ll show you what it
            could look like online, free, before you spend anything.
          </p>
          <div className="contact-actions reveal">
            <a className="btn-gold" href={WA} target="_blank" rel="noreferrer">WhatsApp us →</a>
            <a className="btn-ghost" href="mailto:virastudiopro@gmail.com">virastudiopro@gmail.com</a>
          </div>
        </div>
      </section>
      <footer className="foot">
        <div className="wrap foot-inner">
          <a href="#top" className="wordmark" aria-label="VIRAStudiopro — back to top">
            <StarMark />
            <span>VIRA<b>Studiopro</b></span>
          </a>
          <nav className="foot-links" aria-label="Footer">
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="https://www.instagram.com/virastudiopro1/" target="_blank" rel="noreferrer">Instagram</a>
          </nav>
          <p className="foot-note">© 2026 VIRAStudiopro — Damascus, Syria. Projects start at $1,000.</p>
        </div>
      </footer>
    </>
  )
}
