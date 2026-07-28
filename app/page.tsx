import SiteFrame from "./components/SiteFrame";
import { featuredProject, notes, siteConfig, timeline } from "./siteConfig";

export default function Home() {
  return (
    <SiteFrame active="home">
      <section className="minimal-hero">
        <div className="hero-copy">
          <p className="eyebrow">hello, i&apos;m</p>
          <h1>jim zhou<span>.</span></h1>
          <p className="hero-lead">
            I&apos;m preparing to study <strong>Computational Linguistics</strong> in
            Germany — curious about language models, retrieval and the quiet
            structures that make AI answers more useful.
          </p>
          <div className="hero-links">
            <a className="text-link strong" href="/projects">see my work <span>↗</span></a>
            <a className="text-link" href="/about">more about me</a>
          </div>
          <p className="tiny-note">currently: China → Germany · October 2026</p>
        </div>

        <div className="desk-doodle" aria-label="A line drawing of a student learning at a desk">
          <div className="doodle-speech">learning language,<br />one graph at a time.</div>
          <div className="doodle-stars" aria-hidden="true">· ＊ ·</div>
          <div className="doodle-person" aria-hidden="true">
            <span className="doodle-hair" />
            <span className="doodle-head" />
            <span className="doodle-body" />
            <span className="doodle-arm" />
          </div>
          <div className="doodle-laptop" aria-hidden="true"><span>⌁</span></div>
          <div className="doodle-desk" aria-hidden="true">
            <i /><i />
          </div>
          <span className="doodle-caption">a small corner of the internet</span>
        </div>
      </section>

      <section className="quiet-grid" aria-label="Current focus">
        <div>
          <p className="section-mark">01 / now</p>
          <h2>Starting with curiosity.</h2>
        </div>
        <div className="plain-list">
          <p><span>→</span> strengthening linguistics and NLP foundations</p>
          <p><span>→</span> documenting one real RAG + KG project honestly</p>
          <p><span>→</span> preparing for a new academic chapter in Germany</p>
        </div>
      </section>

      <section className="featured-work">
        <div className="section-heading">
          <div>
            <p className="section-mark">02 / selected work</p>
            <h2>One project, explained properly.</h2>
          </div>
          <a href="/projects">all projects ↗</a>
        </div>

        <article className="project-strip">
          <div className="project-year">2025</div>
          <div className="project-copy">
            <p className="project-kicker">{featuredProject.kicker}</p>
            <h3>{featuredProject.title}</h3>
            <p>{featuredProject.description}</p>
            <div className="plain-tags">
              {featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
          <div className="project-sketch" aria-label="RAG and knowledge graph pipeline">
            <span>docs</span><i>→</i><span>RAG</span><i>+</i><span>KG</span><i>→</i><span>answer</span>
          </div>
          <a className="circle-link" href={`/projects/${featuredProject.slug}`} aria-label="Open project case study">↗</a>
        </article>
      </section>

      <section className="home-notes">
        <div className="section-heading">
          <div>
            <p className="section-mark">03 / notebook</p>
            <h2>Things I want to understand.</h2>
          </div>
          <a href="/notes">open notebook ↗</a>
        </div>
        <div className="note-lines">
          {notes.map((note, index) => (
            <article key={note.id}>
              <span>0{index + 1}</span>
              <div><small>{note.category}</small><h3>{note.title}</h3></div>
              <em>{note.status}</em>
            </article>
          ))}
        </div>
      </section>

      <section className="home-journey">
        <div>
          <p className="section-mark">04 / route</p>
          <h2>A slow, useful journey.</h2>
          <p>No inflated story — just the chapters I can stand behind.</p>
        </div>
        <div className="route-line">
          {timeline.map((item) => (
            <div className={item.state} key={item.year}>
              <i />
              <span>{item.year}</span>
              <b>{item.title}</b>
            </div>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
