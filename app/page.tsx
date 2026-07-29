import Link from "next/link";
import LanguageGalaxy from "./LanguageGalaxy";
import SiteFrame from "./components/SiteFrame";
import { featuredProject } from "../content/projects";
import { lifeEntries } from "../content/life";

const researchQuestions = [
  ["01", "RETRIEVAL", "What should a system retrieve before it begins to answer?"],
  ["02", "STRUCTURE", "When does a knowledge graph add more than vector similarity?"],
  ["03", "LANGUAGE", "What changes when meaning moves between Chinese and English?"],
];

export default function Home() {
  return (
    <SiteFrame active="index">
      <section className="orbital-hero">
        <LanguageGalaxy />

        <div className="orbital-hero-meta">
          <span>INDEX / 01</span>
          <span>COMPUTATIONAL LINGUISTICS · NLP</span>
        </div>

        <div className="orbital-hero-copy">
          <p className="eyebrow">HELLO, I&apos;M</p>
          <h1>Jim<br />Zhou</h1>
          <p className="orbital-intro">
            I explore how language, retrieval and structured knowledge can make
            AI systems more grounded and useful.
          </p>
          <div className="orbital-actions">
            <Link href="/projects">EXPLORE WORK <span>↗</span></Link>
            <Link href="/about">ABOUT ME <span>→</span></Link>
          </div>
        </div>

        <p className="galaxy-caption">
          <span>语言</span>
          Language is not a list of isolated words.<br />
          It is a universe of relationships.
        </p>

        <div className="hero-coordinate">
          <span>MEANING / 意义</span>
          <i />
          <small>MOVE THE CURSOR TO SHIFT THE FIELD</small>
        </div>
      </section>

      <section className="editorial-intro">
        <div className="section-marker">
          <span>01 / FIELD NOTES</span>
          <i />
        </div>
        <div>
          <p className="display-serif">
            Between <em>characters</em>, context and computation.
          </p>
          <p>
            Coming from China and moving toward Computational Linguistics, I am
            interested in the structures that help machines connect words to
            evidence, concepts and meaning.
          </p>
        </div>
      </section>

      <section className="question-observatory">
        <header>
          <p className="section-marker">02 / QUESTIONS BEFORE ANSWERS</p>
          <h2>Three coordinates<br />for the work ahead.</h2>
        </header>
        <div className="question-orbits">
          {researchQuestions.map(([number, label, question]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{label}</strong>
              <p>{question}</p>
              <i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-window">
        <div className="window-bar">
          <span><i /><i /><i /></span>
          <b>WORK / FEATURED CASE STUDY</b>
          <small>01 / 01</small>
        </div>
        <div className="featured-window-body">
          <div className="project-orbit-visual" aria-hidden="true">
            <span className="project-core">ANSWER</span>
            <span className="project-node node-a">RAG</span>
            <span className="project-node node-b">KG</span>
            <span className="project-node node-c">EVIDENCE</span>
            <i className="project-ring ring-a" />
            <i className="project-ring ring-b" />
          </div>
          <div className="featured-copy">
            <p>{featuredProject.category}</p>
            <h2>{featuredProject.title}</h2>
            <blockquote>“{featuredProject.question}”</blockquote>
            <div>
              {featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <Link href={`/projects/${featuredProject.slug}`}>
              READ THE CASE STUDY <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="life-preview">
        <header>
          <div className="section-marker">
            <span>03 / LIFE ARCHIVE</span>
            <i />
          </div>
          <h2>Not everything meaningful<br />happens in a terminal.</h2>
          <Link href="/life">OPEN THE ARCHIVE ↗</Link>
        </header>

        <div className="life-preview-grid">
          {lifeEntries.map((entry, index) => (
            <figure className={`life-preview-card life-card-${index + 1}`} key={entry.id}>
              <div className="photo-waiting">
                <span>{entry.id}</span>
                <b>PHOTOGRAPH<br />COMING NEXT</b>
              </div>
              <figcaption>
                <strong>{entry.category}</strong>
                <span>{entry.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="home-closing">
        <p className="section-marker">04 / A LIVING INDEX</p>
        <h2>
          Learning language,<br />
          <em>one relationship</em><br />
          at a time.
        </h2>
        <div>
          <p>
            This site will grow with the work: one honest case study, one useful
            note and one small photograph at a time.
          </p>
          <Link href="/about">CONTINUE TO ABOUT <span>→</span></Link>
        </div>
      </section>
    </SiteFrame>
  );
}
