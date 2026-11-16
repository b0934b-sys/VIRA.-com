const SERVICES = [
  {
    num: '01',
    title: 'Websites',
    desc: 'High-end websites and interactive menus for restaurants, clinics, stores and companies — designed around your brand, not a template.',
    tags: ['Restaurants', 'Clinics', 'Stores', 'Companies'],
  },
  {
    num: '02',
    title: 'Digital Systems',
    desc: 'Ordering, booking, menus and dashboards in one system that runs your business — built on free infrastructure, so you never pay a monthly fee.',
    tags: ['Ordering', 'Booking', 'Dashboards', 'Admin panels'],
  },
  {
    num: '03',
    title: 'AI Solutions',
    desc: 'Smart assistants and automation that answer customers, take orders and save hours every day — working for you, not instead of you.',
    tags: ['Chat assistants', 'Automation', 'Content'],
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="sec-head reveal">
          <p className="eyebrow">What we do</p>
          <h2>Services</h2>
          <p>Three crafts, one standard: work that looks expensive and pays for itself. Every project starts at $1,000 — the final price depends on scope.</p>
        </div>
        <div className="svc-list">
          {SERVICES.map((s) => (
            <article className="svc-row reveal" key={s.num}>
              <span className="svc-num">{s.num}</span>
              <h3 className="svc-title">{s.title}</h3>
              <div>
                <p className="svc-desc">{s.desc}</p>
                <div className="svc-tags">{s.tags.map((t) => <i key={t}>{t}</i>)}</div>
              </div>
              <div className="svc-price">
                <b>From $1,000</b>
                <span>one-time, no subscription</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
