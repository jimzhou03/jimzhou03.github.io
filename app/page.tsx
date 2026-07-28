import SiteFrame from "./components/SiteFrame";
import { featuredProject } from "./siteConfig";

const questions = [
  {
    number: "01",
    title: "Retrieval or structure?",
    copy: "When does a knowledge graph add more than vector search to a language system?",
  },
  {
    number: "02",
    title: "Grounded, but how?",
    copy: "How should course-question answers be evaluated beyond fluency and confidence?",
  },
  {
    number: "03",
    title: "Across languages.",
    copy: "How can multilingual systems preserve terminology, evidence and context?",
  },
];

const archive = [
  { number: "01", title: "My dog", note: "Home / everyday company", className: "dog" },
  { number: "02", title: "Courtyard cat", note: "A familiar visitor", className: "cat" },
  { number: "03", title: "Undergraduate campus", note: "Where this chapter began", className: "campus" },
];

export default function Home() {
  return (
    <SiteFrame active="home">
      <section className="constellation-hero">
        <div className="hero-status">
          <span>PORTFOLIO / 2026</span>
          <span>CHINA → GERMANY</span>
        </div>

        <div className="hero-grid">
          <div className="constellation-copy">
            <p className="micro-label">COMPUTATIONAL LINGUISTICS · NLP</p>
            <h1><span>JIM</span><span>ZHOU</span></h1>
            <p className="hero-statement">
              I&apos;m preparing to study Computational Linguistics in Germany,
              exploring how retrieval and structured knowledge can make
              language-model answers more grounded, traceable and useful.
            </p>
            <div className="hero-actions">
              <a className="action-button primary" href="#work">Selected work <span>↓</span></a>
              <a className="action-button ghost" href="/about">About me <span>↗</span></a>
            </div>
          </div>

          <div className="language-map" aria-label="An interactive constellation of language technology topics">
            <div className="map-grid" aria-hidden="true" />
            <span className="map-node node-language">language</span>
            <span className="map-node node-retrieval">retrieval</span>
            <span className="map-node node-knowledge">knowledge</span>
            <span className="map-node node-context">context</span>
            <span className="map-node node-evidence">evidence</span>
            <i className="map-link link-a" aria-hidden="true" />
            <i className="map-link link-b" aria-hidden="true" />
            <i className="map-link link-c" aria-hidden="true" />
            <i className="map-link link-d" aria-hidden="true" />
            <i className="map-link link-e" aria-hidden="true" />
            <div className="map-core">
              <small>CURRENT ORBIT</small>
              <strong>meaning</strong>
              <span>CL / NLP</span>
            </div>
            <div className="map-readout">
              <span>05 NODES</span>
              <span>MOVE CURSOR TO DISTURB FIELD</span>
            </div>
          </div>
        </div>

        <div className="hero-foot">
          <span>LANGUAGE / RETRIEVAL / KNOWLEDGE</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <section className="question-section" id="questions">
        <div className="section-intro">
          <p className="section-index">01 / QUESTIONS</p>
          <h2>A portfolio built around what I want to understand.</h2>
          <p>
            I am early in the journey, so the honest starting point is not a long
            list of claims. It is a small set of technical questions that can grow
            into coursework, experiments and research.
          </p>
        </div>
        <div className="question-list">
          {questions.map((question) => (
            <article key={question.number}>
              <span>{question.number}</span>
              <h3>{question.title}</h3>
              <p>{question.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="selected-case" id="work">
        <div className="case-label">
          <p className="section-index">02 / SELECTED WORK</p>
          <span>ONE PROJECT, EXPLAINED PROPERLY</span>
        </div>
        <article className="case-feature">
          <div className="case-feature-copy">
            <p>{featuredProject.kicker}</p>
            <h2>{featuredProject.title}</h2>
            <p>{featuredProject.description}</p>
            <div className="tag-row">
              {featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <a className="action-button light" href={`/projects/${featuredProject.slug}`}>
              Read the case study <span>↗</span>
            </a>
          </div>
          <div className="system-map" aria-label="Project architecture: course materials to retrieval and graph context to grounded answers">
            <span className="system-node source">COURSE<br />MATERIAL</span>
            <span className="system-node retrieve">RETRIEVAL</span>
            <span className="system-node graph">KNOWLEDGE<br />GRAPH</span>
            <span className="system-node answer">GROUNDED<br />ANSWER</span>
            <i className="system-line line-one" />
            <i className="system-line line-two" />
            <i className="system-line line-three" />
            <i className="system-line line-four" />
            <div className="system-center">RAG <b>+</b> KG</div>
          </div>
        </article>
      </section>

      <section className="life-archive" id="life">
        <div className="section-intro compact">
          <p className="section-index">03 / PERSONAL ARCHIVE</p>
          <h2>A little life outside the terminal.</h2>
          <p>
            The places and animals that make a life feel real. These frames are
            ready for your original photographs.
          </p>
        </div>
        <div className="archive-grid">
          {archive.map((item) => (
            <figure className={`archive-card ${item.className}`} key={item.number}>
              <div className="photo-placeholder">
                <span>ORIGINAL PHOTO<br />COMING SOON</span>
                <b>{item.number}</b>
              </div>
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="next-chapter">
        <p className="section-index">04 / NOW & NEXT</p>
        <div>
          <h2>Learning first.<br />Building in public.</h2>
          <p>
            Germany · October 2026<br />
            MSc Computational Linguistics
          </p>
          <a href="https://github.com/jimzhou03" target="_blank" rel="noreferrer">
            FOLLOW THE WORK ON GITHUB ↗
          </a>
        </div>
      </section>
    </SiteFrame>
  );
}
