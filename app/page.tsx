import Link from "next/link";
import LanguageGalaxy from "./LanguageGalaxy";
import SiteFrame from "./components/SiteFrame";
import { featuredProject } from "../content/projects";
import { lifeEntries } from "../content/life";

const researchQuestions = [
  ["01", "RETRIEVAL", "What should a system retrieve before it begins to answer?"],
  ["02", "STRUCTURE", "When does a knowledge graph add more than vector similarity?"],
  ["03", "ADAPTATION", "How much behavior can parameter-efficient fine-tuning change?"],
];

export default function Home() {
  return (
    <SiteFrame active="index">
      <section className="orbital-hero">
        <LanguageGalaxy />

        <div className="orbital-hero-meta">
          <span>INDEX / 01</span>
          <span>NATURAL LANGUAGE PROCESSING · LARGE LANGUAGE MODELS</span>
        </div>

        <div className="orbital-hero-copy">
          <p className="eyebrow">HELLO, I&apos;M</p>
          <h1>Weijie<br />Zhou</h1>
          <p className="orbital-intro">
            I build and study retrieval- and knowledge-enhanced language-model
            systems, with a focus on RAG, knowledge graphs and applied NLP.
          </p>
          <div className="orbital-actions">
            <Link href="/projects">EXPLORE WORK <span>↗</span></Link>
            <Link href="/about">ABOUT ME <span>→</span></Link>
          </div>
        </div>

        <p className="galaxy-caption">
          <span>智能</span>
          Language models do not work in isolation.<br />
          Context, evidence and structure shape the answer.
        </p>

        <div className="hero-coordinate">
          <span>CONTEXT / 上下文</span>
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
            Between <em>language data</em>, models and evidence.
          </p>
          <p>
            I am an incoming M.A. student in Computational Linguistics at
            Heidelberg University. My work sits on the engineering side of the
            field: large language models, retrieval, structured knowledge and
            evaluation.
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
          Building language systems,<br />
          <em>one grounded answer</em><br />
          at a time.
        </h2>
        <div>
          <p>
            This site will grow with the work: one reproducible experiment, one
            honest system case study and one small photograph at a time.
          </p>
          <Link href="/about">CONTINUE TO ABOUT <span>→</span></Link>
        </div>
      </section>
    </SiteFrame>
  );
}
