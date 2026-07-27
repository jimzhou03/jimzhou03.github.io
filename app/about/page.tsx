import SiteFrame from "../components/SiteFrame";
import { siteConfig } from "../siteConfig";

export default function AboutPage() {
  return (
    <SiteFrame active="about">
      <header className="about-hero glass-panel">
        <div className="about-portrait" aria-label="Jim Zhou monogram">
          <span>JZ</span>
          <i>LANGUAGE / KNOWLEDGE / SYSTEMS</i>
        </div>
        <div>
          <p className="micro-label">ABOUT / CURRENT CHAPTER</p>
          <h1>Curious about the structures behind useful language systems.</h1>
          <p>{siteConfig.bio}</p>
        </div>
      </header>

      <section className="about-page-grid">
        <article className="about-story glass-panel">
          <p className="micro-label">MY DIRECTION</p>
          <h2>Computational Linguistics in Germany.</h2>
          <p>
            I am preparing to begin a master&apos;s degree in Computational
            Linguistics in Germany. The first year is primarily about learning:
            linguistics, NLP methods, evaluation and the engineering habits
            required to build reliable systems.
          </p>
          <p>
            My current technical interests connect retrieval-augmented generation,
            knowledge graphs and language models. I am especially interested in
            systems that can make their evidence and reasoning context easier to
            inspect.
          </p>
        </article>

        <aside className="about-facts glass-panel">
          <p className="micro-label">QUICK INDEX</p>
          <dl>
            <div><dt>NAME</dt><dd>{siteConfig.name}</dd></div>
            <div><dt>FIELD</dt><dd>{siteConfig.title}</dd></div>
            <div><dt>ROUTE</dt><dd>{siteConfig.location}</dd></div>
            <div><dt>GITHUB</dt><dd>@{siteConfig.handle}</dd></div>
            <div><dt>LANGUAGE</dt><dd>English · Chinese</dd></div>
          </dl>
          <a className="action-button primary" href={siteConfig.github} target="_blank" rel="noreferrer">
            Visit GitHub <span>↗</span>
          </a>
        </aside>
      </section>

      <section className="interest-cloud glass-panel">
        <div>
          <p className="micro-label">CURRENT INTERESTS</p>
          <h2>Topics I want to understand more deeply.</h2>
        </div>
        <div>
          {siteConfig.interests.map((interest, index) => (
            <span key={interest}><b>0{index + 1}</b>{interest}</span>
          ))}
          <span><b>05</b>Grounded Generation</span>
          <span><b>06</b>Multilingual NLP</span>
        </div>
      </section>
    </SiteFrame>
  );
}
