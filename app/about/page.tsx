import SiteFrame from "../components/SiteFrame";
import { siteConfig } from "../siteConfig";

const interests = [
  "COMPUTATIONAL LINGUISTICS",
  "NATURAL LANGUAGE PROCESSING",
  "RETRIEVAL-AUGMENTED GENERATION",
  "KNOWLEDGE GRAPHS",
  "GROUNDED GENERATION",
  "MULTILINGUAL NLP",
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
          <h1>Jim<br /><em>Zhou.</em></h1>
          <div className="about-monogram" aria-hidden="true">
            <i />
            <span>JZ</span>
            <small>语言 / KNOWLEDGE</small>
          </div>
        </div>
        <p className="about-intro">
          I am preparing to study Computational Linguistics in Germany, building
          stronger foundations in linguistics, NLP, evaluation and reliable
          language-system engineering.
        </p>
      </header>

      <section className="about-story-grid">
        <article>
          <span>01 / DIRECTION</span>
          <h2>From fluent answers to inspectable systems.</h2>
          <p>
            My current interests connect retrieval-augmented generation,
            knowledge graphs and language models. I am especially interested in
            systems that make their evidence and context easier to inspect.
          </p>
          <p>
            The next chapter is primarily about learning: understanding how
            language works, how NLP systems are evaluated and how research ideas
            become useful tools.
          </p>
        </article>

        <aside className="about-fact-index">
          <span>02 / INDEX</span>
          <dl>
            <div><dt>NAME</dt><dd>{siteConfig.name}</dd></div>
            <div><dt>FIELD</dt><dd>{siteConfig.title}</dd></div>
            <div><dt>LANGUAGES</dt><dd>CHINESE · ENGLISH</dd></div>
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
        <h2>For now, the best place<br />to find me is GitHub.</h2>
        <a href={siteConfig.github} target="_blank" rel="noreferrer">
          GITHUB.COM/JIMZHOU03 <span>↗</span>
        </a>
      </section>
    </SiteFrame>
  );
}
