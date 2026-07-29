import SiteFrame from "../components/SiteFrame";
import { siteConfig } from "../siteConfig";

const interests = [
  "NATURAL LANGUAGE PROCESSING",
  "LARGE LANGUAGE MODELS",
  "RETRIEVAL-AUGMENTED GENERATION",
  "KNOWLEDGE GRAPHS",
  "PARAMETER-EFFICIENT FINE-TUNING",
  "EVALUATION & TRACEABILITY",
];

export default function AboutPage() {
  return (
    <SiteFrame active="about">
      <header className="about-editorial-hero">
        <div className="archive-index">
          <span>ABOUT / CURRENT CHAPTER</span>
          <b>04 / 04</b>
        </div>
        <div className="about-nameplate">
          <h1>Weijie<br /><em>Zhou.</em></h1>
          <div className="about-monogram" aria-hidden="true">
            <i />
            <span>WZ</span>
            <small>模型 / KNOWLEDGE</small>
          </div>
        </div>
        <p className="about-intro">
          周维杰 · Incoming M.A. student in Computational Linguistics at
          Heidelberg University, starting October 2026. I focus on NLP and large
          language-model systems rather than traditional linguistics.
        </p>
      </header>

      <section className="about-story-grid">
        <article>
          <span>01 / DIRECTION</span>
          <h2>From fluent answers to inspectable systems.</h2>
          <p>
            My current interests connect retrieval-augmented generation,
            knowledge graphs, parameter-efficient fine-tuning and language
            models. I am especially interested in systems whose evidence,
            context and limitations are easier to inspect.
          </p>
          <p>
            I completed a B.Eng. in Intelligent Science and Technology at Zhuhai
            College of Science and Technology, graduating in the top 10% of my
            cohort. The next chapter is about stronger research foundations and
            turning NLP ideas into useful, testable systems.
          </p>
        </article>

        <aside className="about-fact-index">
          <span>02 / INDEX</span>
          <dl>
            <div><dt>NAME</dt><dd>{siteConfig.name}</dd></div>
            <div><dt>FIELD</dt><dd>{siteConfig.title}</dd></div>
            <div><dt>NEXT</dt><dd>HEIDELBERG · OCT 2026</dd></div>
            <div><dt>ACADEMIC STANDING</dt><dd>TOP 10%</dd></div>
            <div><dt>GITHUB</dt><dd>@{siteConfig.handle}</dd></div>
          </dl>
          <a href={siteConfig.github} target="_blank" rel="noreferrer">
            VISIT GITHUB <span>↗</span>
          </a>
        </aside>
      </section>

      <section className="interest-orbit-list">
        <header>
          <span>03 / CURRENT INTERESTS</span>
          <h2>Topics in<br /><em>orbit.</em></h2>
        </header>
        <div>
          {interests.map((interest, index) => (
            <article key={interest}>
              <span>0{index + 1}</span>
              <p>{interest}</p>
              <i />
            </article>
          ))}
        </div>
      </section>

      <section className="contact-band">
        <span>04 / CONTACT</span>
        <h2>For research, projects<br />or a conversation.</h2>
        <a href={`mailto:${siteConfig.email}`}>
          {siteConfig.email.toUpperCase()} <span>↗</span>
        </a>
      </section>
    </SiteFrame>
  );
}
