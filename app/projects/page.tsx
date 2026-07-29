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
          carefully than fill a grid with projects that do not yet have a useful
          story.
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
                <span className="work-satellite sat-one">RAG</span>
                <span className="work-satellite sat-two">KG</span>
                <span className="work-satellite sat-three">QA</span>
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
          <span>RESEARCH EXPERIMENTS / RESERVED</span>
          <h2>The next entry appears only when there is something concrete to show.</h2>
          <p>
            Retrieval tests, evaluation notes and small language experiments can
            grow into this space later. Nothing is being invented to make the
            archive look larger.
          </p>
        </article>
      </section>
    </SiteFrame>
  );
}
