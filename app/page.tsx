import SiteFrame from "./components/SiteFrame";
import { featuredProject } from "./siteConfig";

const title = ["J", "I", "M", "Z", "H", "O", "U"];

const questions = [
  ["01", "RETRIEVAL", "When does a knowledge graph add more than vector search?"],
  ["02", "EVIDENCE", "How do we judge whether an answer is genuinely grounded?"],
  ["03", "LANGUAGE", "What survives when terminology moves across languages?"],
];

const archive = [
  ["01", "DOG", "Home / everyday company"],
  ["02", "CAT", "A familiar courtyard visitor"],
  ["03", "CAMPUS", "Where this chapter began"],
];

export default function Home() {
  return (
    <SiteFrame active="home">
      <section className="playful-hero">
        <div className="hero-intro">
          <span>HELLO, I&apos;M</span>
          <p>COMPUTATIONAL LINGUISTICS · NLP</p>
        </div>

        <h1 className="kinetic-title" aria-label="Jim Zhou">
          {title.map((letter, index) => (
            <span className={`letter-window letter-${index}`} key={`${letter}-${index}`}>
              <i className="kinetic-letter">{letter}</i>
            </span>
          ))}
        </h1>

        <div className="hero-stamp">
          <span>MY CURRENT<br />FAVOURITE QUESTION</span>
          <strong>How does a machine<br />hold on to meaning?</strong>
          <i>↘</i>
        </div>

        <div className="floating-words" aria-hidden="true">
          <span>word</span><span>context</span><span>graph</span>
          <span>evidence</span><span>meaning?</span>
        </div>

        <div className="hero-bottom">
          <p>
            I&apos;m preparing to study Computational Linguistics in Germany,
            exploring how retrieval and structured knowledge can make
            language-model answers more grounded and useful.
          </p>
          <div>
            <span>CHINA → GERMANY</span>
            <span>OCTOBER 2026</span>
          </div>
          <a href="#work">SEE THE WORK <b>↓</b></a>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>LANGUAGE IS A SYSTEM OF RELATIONSHIPS · RETRIEVE · CONNECT · QUESTION · </span>
          <span>LANGUAGE IS A SYSTEM OF RELATIONSHIPS · RETRIEVE · CONNECT · QUESTION · </span>
        </div>
      </div>

      <section className="curiosity-section" id="questions">
        <header className="motion-reveal">
          <span>01 / QUESTIONS FIRST</span>
          <h2>I don&apos;t need to pretend<br />I have all the answers.</h2>
          <p>
            A useful portfolio can show the quality of the questions behind the
            work—not just a long inventory of finished things.
          </p>
        </header>
        <div className="question-ribbons">
          {questions.map(([number, label, copy]) => (
            <article className="motion-reveal" key={number}>
              <span>{number}</span>
              <strong>{label}</strong>
              <p>{copy}</p>
              <i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="work-chapter" id="work">
        <div className="work-heading motion-reveal">
          <span>02 / ONE REAL PROJECT</span>
          <h2>{featuredProject.title}</h2>
          <p>{featuredProject.description}</p>
        </div>

        <div className="system-story">
          <article className="story-step">
            <span>01</span><strong>COURSE<br />MATERIAL</strong><small>the source</small>
          </article>
          <i>→</i>
          <article className="story-step">
            <span>02</span><strong>RETRIEVAL</strong><small>find evidence</small>
          </article>
          <i>+</i>
          <article className="story-step invert">
            <span>03</span><strong>KNOWLEDGE<br />GRAPH</strong><small>connect ideas</small>
          </article>
          <i>→</i>
          <article className="story-step">
            <span>04</span><strong>ANSWER</strong><small>stay grounded</small>
          </article>
        </div>

        <div className="work-footer motion-reveal">
          <div>
            {featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <a href={`/projects/${featuredProject.slug}`}>OPEN THE CASE STUDY ↗</a>
        </div>
      </section>

      <section className="life-chapter" id="life">
        <header className="motion-reveal">
          <span>03 / LIFE, TOO</span>
          <h2>Not everything meaningful<br />happens in a terminal.</h2>
          <p>
            Three small windows into home. Your original photographs will live
            here; the frames are intentionally waiting for them.
          </p>
        </header>

        <div className="photo-stack">
          {archive.map(([number, title, note], index) => (
            <figure className={`motion-reveal photo-card card-${index}`} key={number}>
              <div>
                <b>{number}</b>
                <span>YOUR PHOTO<br />GOES HERE</span>
              </div>
              <figcaption><strong>{title}</strong><span>{note}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="closing-note motion-reveal">
        <p>BUILDING A LIFE AROUND</p>
        <h2>language,<br /><i>curiosity</i> & useful systems.</h2>
        <a href="https://github.com/jimzhou03" target="_blank" rel="noreferrer">
          FIND ME ON GITHUB ↗
        </a>
      </section>
    </SiteFrame>
  );
}
