const PROJECTS = [
  {
    cat: 'Restaurant · Digital menu',
    name: 'Al-Bait Al-Shami',
    desc: 'A 193-dish interactive table menu for an old Damascus restaurant — Arabic & English, with WhatsApp ordering.',
    year: '2026',
    url: 'https://al-bait-al-shami-vira-fa35.vercel.app',
  },
  {
    cat: 'Café · Digital menu',
    name: 'Ghazal Café',
    desc: 'A warm heritage menu for a Damascus café — drinks, shisha and the story of every cup.',
    year: '2026',
    url: 'https://ghazal-cafe-vira-fa35.vercel.app',
  },
  {
    cat: 'Fast food · Full system',
    name: 'Shanab Restaurants',
    desc: 'A complete ordering system for a Homs landmark since 1997 — menu, cart, admin and WhatsApp orders.',
    year: '2026',
    url: 'https://shanab-vira-fa35.vercel.app',
  },
  {
    cat: 'Restaurant · Website',
    name: 'Red Burger',
    desc: 'A bold one-page website for a Raqqa burger house — menu, photos and WhatsApp ordering in one scroll.',
    year: '2026',
    url: 'https://red-burger-vira-fa35.vercel.app',
  },
  {
    cat: 'Interior design · Website',
    name: 'Silent Dimensions',
    desc: 'A quiet, elegant website for a Daraa interior-decoration studio — work first, words second.',
    year: '2026',
    url: 'https://silent-dimensions-web.vercel.app',
  },
  {
    cat: 'Online store · Storybooks',
    name: 'Alami',
    desc: 'A store selling illustrated children’s storybooks — a new story publishes the moment a row is added.',
    year: '2026',
    url: 'https://alami-vira-fa35.vercel.app',
  },
]

export default function Work() {
  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="sec-head reveal">
          <p className="eyebrow">Selected work</p>
          <h2>Work</h2>
          <p>Real projects, live on the web — restaurants, cafés, stores and studios. Every one started as a free preview.</p>
        </div>
        <div className="work-grid">
          {PROJECTS.map((p) => (
            <article className="work-card reveal" key={p.name}>
              <span className="w-cat">{p.cat}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="w-foot">
                <span className="w-year">{p.year}</span>
                <a className="w-link" href={p.url} target="_blank" rel="noreferrer">View live →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
