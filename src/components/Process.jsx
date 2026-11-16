const STEPS = [
  {
    num: '01',
    title: 'Free preview',
    desc: 'Tell us about your business. We build a real preview of your site — you see it, click it, and decide. No payment, no commitment.',
  },
  {
    num: '02',
    title: 'Design & refine',
    desc: 'We design around your brand and refine every detail with you until it feels right — colours, photos, words, flow.',
  },
  {
    num: '03',
    title: 'Launch & own',
    desc: 'We launch, hand over the keys, and you own everything. No monthly fees, no lock-in — your site, your content, your customers.',
  },
]

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="wrap">
        <div className="sec-head reveal">
          <p className="eyebrow">How we work</p>
          <h2>Three steps, no surprises</h2>
          <p>From first message to launch — simple, transparent, and always with a free preview first.</p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <article className="step reveal" key={s.num}>
              <span className="s-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
