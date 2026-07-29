import Link from "next/link";
import LanguageGalaxy from "./LanguageGalaxy";
import SiteFrame from "./components/SiteFrame";
import { projects } from "../content/projects";

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
            NLP and large language models, with a focus on RAG, knowledge
            graphs and parameter-efficient adaptation.
          </p>
          <p className="hero-status">
            INCOMING M.A. · HEIDELBERG UNIVERSITY · OCT 2026
          </p>
          <div className="orbital-actions">
            <Link href="/projects">VIEW PROJECTS <span>↗</span></Link>
            <Link href="/about">ABOUT <span>→</span></Link>
          </div>
        </div>

        <p className="galaxy-caption">
          <span>NLP / LLM</span>
          Retrieval · Knowledge Graphs<br />
          Model Adaptation
        </p>

        <div className="hero-coordinate">
          <span>CONTEXT / 上下文</span>
          <i />
          <small>MOVE THE CURSOR TO SHIFT THE FIELD</small>
        </div>
      </section>

      <section className="index-work">
        <header>
          <div>
            <p className="section-marker">01 / SELECTED WORK</p>
            <h2>Two projects.<br />No filler.</h2>
          </div>
          <p>
            One deployed RAG system and one reproducible model-adaptation
            experiment. Each page separates what the team built from what I
            personally contributed.
          </p>
        </header>
        <div className="index-work-grid">
          {projects.map((project, index) => (
            <article className="index-work-card" key={project.slug}>
              <div className="index-project-orbit" aria-hidden="true">
                <i className="orbit-line orbit-line-a" />
                <i className="orbit-line orbit-line-b" />
                <strong>
                  {project.slug === "ai-teaching-assistant" ? "RAG + KG" : "LoRA SFT"}
                </strong>
                {project.tags.slice(0, 4).map((tag, tagIndex) => (
                  <span className={`orbit-label orbit-label-${tagIndex + 1}`} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="index-work-copy">
                <p>0{index + 1} / {project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <Link href={`/projects/${project.slug}`}>
                  OPEN CASE STUDY <span>↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="index-life">
        <div>
          <span>02 / OFF THE CLOCK</span>
          <p>Dogs, courtyard cats and a few campus photographs.</p>
        </div>
        <Link href="/life">LIFE ARCHIVE <span>↗</span></Link>
      </section>
    </SiteFrame>
  );
}
