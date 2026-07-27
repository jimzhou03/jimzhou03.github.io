import SiteFrame from "../components/SiteFrame";
import { featuredProject } from "../siteConfig";

export default function ProjectsPage() {
  return (
    <SiteFrame active="projects">
      <header className="page-hero glass-panel">
        <p className="micro-label">PROJECT ARCHIVE / SELECTED WORK</p>
        <h1>Systems, experiments and questions worth documenting.</h1>
        <p>
          This archive begins with one real project. More work will be added only
          when there is something concrete to explain, evaluate or reflect on.
        </p>
      </header>

      <section className="project-list">
        <article className="project-list-card glass-panel">
          <div className="project-number">01</div>
          <div className="project-list-visual">
            <span>RAG</span><i>+</i><span>KG</span><i>→</i><span>QA</span>
          </div>
          <div className="project-list-copy">
            <p className="micro-label">{featuredProject.kicker}</p>
            <h2>{featuredProject.title}</h2>
            <p>{featuredProject.description}</p>
            <div className="tag-row">
              {featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <a className="action-button primary" href={`/projects/${featuredProject.slug}`}>
              Read the case study <span>→</span>
            </a>
          </div>
        </article>

        <article className="future-project glass-panel">
          <span>02</span>
          <div>
            <p className="micro-label">NEXT SLOT / NOT YET CLAIMED</p>
            <h2>The next project will earn its place here.</h2>
            <p>
              Coursework, research collaboration or a focused language technology
              experiment — documented when the evidence is ready.
            </p>
          </div>
        </article>
      </section>
    </SiteFrame>
  );
}
