import Link from "next/link";
import SiteFrame from "../components/SiteFrame";
import { projects } from "../../content/projects";

export default function ProjectsPage() {
  return (
    <SiteFrame active="work">
      <header className="archive-hero">
        <div className="archive-index">
          <span>WORK / ARCHIVE</span>
          <b>02 / 04</b>
        </div>
        <h1>Selected<br /><em>work.</em></h1>
        <p>
          A small archive by design. I would rather document one real system
          or reproducible experiment carefully than fill a grid with coursework
          that does not yet have a useful story.
        </p>
      </header>

      <section className="work-index">
        {projects.map((project, index) => (
          <article className="work-window" key={project.slug}>
            <div className="window-bar">
              <span><i /><i /><i /></span>
              <b>{project.category}</b>
              <small>0{index + 1} / 0{projects.length}</small>
            </div>
            <div className="work-window-body">
              <div className="work-planet" aria-hidden="true">
                <i className="work-planet-core" />
                <i className="work-planet-ring ring-one" />
                <i className="work-planet-ring ring-two" />
                <span className="work-satellite sat-one">{project.slug === "ai-teaching-assistant" ? "RAG" : "GLM"}</span>
                <span className="work-satellite sat-two">{project.slug === "ai-teaching-assistant" ? "KG" : "LoRA"}</span>
                <span className="work-satellite sat-three">{project.slug === "ai-teaching-assistant" ? "QA" : "SFT"}</span>
              </div>
              <div className="work-window-copy">
                <div className="work-meta">
                  <span>{project.year}</span>
                  <span>{project.status}</span>
                </div>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <blockquote>“{project.question}”</blockquote>
                <div className="project-tags">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <Link href={`/projects/${project.slug}`}>
                  OPEN CASE STUDY <span>↗</span>
                </Link>
              </div>
            </div>
          </article>
        ))}

        <article className="future-work-panel">
          <span>COURSEWORK / DELIBERATELY OMITTED</span>
          <h2>The archive stays small until another project earns its place.</h2>
          <p>
            Introductory course exercises are not included just to make the
            archive look larger. Future entries will need a clear technical
            question, evidence and an honest account of my contribution.
          </p>
        </article>
      </section>
    </SiteFrame>
  );
}
