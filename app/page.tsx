import SiteFrame from "./components/SiteFrame";
import { featuredProject, notes, siteConfig, timeline } from "./siteConfig";

export default function Home() {
  return (
    <SiteFrame active="home">
      <section className="home-hero">
        <div className="hero-introduction glass-panel">
          <div className="hero-status">
            <span className="status-dot" />
            OPEN TO LEARNING, RESEARCH &amp; COLLABORATION
          </div>
          <p className="micro-label">WELCOME TO MY DIGITAL GARDEN</p>
          <h1>
            Building at the edge of
            <span>language and knowledge.</span>
          </h1>
          <p className="hero-lead">
            I&apos;m <strong>{siteConfig.name}</strong>, an incoming Computational
            Linguistics master&apos;s student exploring how retrieval, structured
            knowledge and language models can work together.
          </p>
          <div className="hero-links">
            <a className="action-button primary" href="/projects">
              Explore my work <span>→</span>
            </a>
            <a className="action-button" href="/about">
              About this journey
            </a>
          </div>
          <div className="hero-keywords" aria-label="Research interests">
            {siteConfig.interests.map((interest) => (
              <span key={interest}>{interest}</span>
            ))}
          </div>
        </div>

        <aside className="profile-card glass-panel">
          <div className="profile-visual" aria-hidden="true">
            <div className="profile-ring ring-one" />
            <div className="profile-ring ring-two" />
            <div className="profile-avatar">
              <span>JZ</span>
              <i />
            </div>
            <span className="floating-chip chip-rag">RAG</span>
            <span className="floating-chip chip-kg">KG</span>
            <span className="floating-chip chip-nlp">NLP</span>
          </div>
          <div className="profile-copy">
            <p className="micro-label">PROFILE / 2026</p>
            <h2>{siteConfig.name}</h2>
            <p>{siteConfig.title}</p>
            <dl>
              <div><dt>ROUTE</dt><dd>{siteConfig.location}</dd></div>
              <div><dt>STATUS</dt><dd>{siteConfig.status}</dd></div>
              <div><dt>MODE</dt><dd className="online">LEARNING</dd></div>
            </dl>
          </div>
        </aside>
      </section>

      <section className="dashboard-grid" aria-label="Portfolio dashboard">
        <article className="feature-card glass-panel">
          <div className="card-heading">
            <div>
              <p className="micro-label">{featuredProject.kicker}</p>
              <h2>{featuredProject.title}</h2>
            </div>
            <span className="card-index">01</span>
          </div>
          <div className="system-map" aria-label="Project system pipeline">
            <div className="map-grid" aria-hidden="true" />
            <div className="map-node docs">DOCS</div>
            <div className="map-node retrieve">RAG</div>
            <div className="map-node graph">KG</div>
            <div className="map-node answer">ANS</div>
            <span className="map-line line-one" />
            <span className="map-line line-two" />
            <span className="map-line line-three" />
          </div>
          <p>{featuredProject.description}</p>
          <div className="tag-row">
            {featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="card-bottom">
            <span><i /> {featuredProject.status}</span>
            <a href={`/projects/${featuredProject.slug}`}>Open case study →</a>
          </div>
        </article>

        <div className="dashboard-column">
          <article className="now-card glass-panel">
            <div className="card-heading compact">
              <div>
                <p className="micro-label">NOW / JULY 2026</p>
                <h2>Preparing the next chapter.</h2>
              </div>
              <span className="signal-bars" aria-hidden="true"><i /><i /><i /><i /></span>
            </div>
            <ul className="now-list">
              <li><span>01</span><p><b>Computational Linguistics</b>Strengthening linguistic and technical foundations.</p></li>
              <li><span>02</span><p><b>Project documentation</b>Turning the AI tutor into a clear case study.</p></li>
              <li><span>03</span><p><b>Germany transition</b>Preparing for the MSc journey in October.</p></li>
            </ul>
          </article>

          <article className="quote-card glass-panel">
            <p className="micro-label">FIELD NOTE</p>
            <blockquote>
              “Build systems that can explain where an answer comes from.”
            </blockquote>
            <span>Current research instinct</span>
          </article>
        </div>
      </section>

      <section className="split-heading">
        <div>
          <p className="micro-label">RECENT / PLANNED WRITING</p>
          <h2>Notes from the learning process.</h2>
        </div>
        <a href="/notes">View all notes →</a>
      </section>

      <section className="note-preview-grid">
        {notes.map((note, index) => (
          <article className="note-preview glass-panel" key={note.id}>
            <div>
              <span>{note.id}</span>
              <b>0{index + 1}</b>
            </div>
            <p>{note.category}</p>
            <h3>{note.title}</h3>
            <small>{note.status}</small>
          </article>
        ))}
      </section>

      <section className="journey-card glass-panel">
        <div className="journey-intro">
          <p className="micro-label">JOURNEY / SIGNAL PATH</p>
          <h2>Learning in public, one useful thing at a time.</h2>
          <a href="/timeline">Full timeline →</a>
        </div>
        <div className="journey-track">
          {timeline.map((item) => (
            <div className={`journey-stop ${item.state}`} key={item.year}>
              <span>{item.year}</span>
              <i />
              <div>
                <b>{item.title}</b>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
