import SiteFrame from "../../components/SiteFrame";
import { featuredProject } from "../../siteConfig";

const steps = [
  ["01", "Course materials", "Prepare and segment the source material for retrieval."],
  ["02", "Semantic retrieval", "Find passages relevant to the learner's question."],
  ["03", "Graph context", "Bring related concepts and relationships into view."],
  ["04", "Grounded answer", "Generate an answer tied back to the available evidence."],
];

export default function TeachingAssistantCaseStudy() {
  return (
    <SiteFrame active="projects">
      <header className="case-hero glass-panel">
        <div>
          <p className="micro-label">{featuredProject.kicker}</p>
          <h1>{featuredProject.title}</h1>
          <p>{featuredProject.description}</p>
          <div className="tag-row">
            {featuredProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <aside>
          <dl>
            <div><dt>YEAR</dt><dd>2025</dd></div>
            <div><dt>TYPE</dt><dd>AI / NLP SYSTEM</dd></div>
            <div><dt>ROLE</dt><dd>PROJECT CONTRIBUTOR</dd></div>
            <div><dt>STATUS</dt><dd className="online">DOCUMENTING</dd></div>
          </dl>
        </aside>
      </header>

      <section className="case-layout">
        <div className="case-main">
          <article className="case-section glass-panel">
            <p className="micro-label">01 / THE QUESTION</p>
            <h2>How can a course assistant answer with better grounding?</h2>
            <p>
              A language model can produce fluent answers while still missing the
              specific course context a learner needs. This project explored a
              combined retrieval and knowledge-graph approach to make the evidence
              path clearer and the response more connected to course concepts.
            </p>
          </article>

          <article className="case-section glass-panel">
            <p className="micro-label">02 / SYSTEM ROUTE</p>
            <h2>Retrieval first, structured context next.</h2>
            <div className="architecture-flow">
              {steps.map(([index, title, detail]) => (
                <div key={index}>
                  <span>{index}</span>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="case-section glass-panel">
            <p className="micro-label">03 / EVALUATION PLAN</p>
            <h2>Judge more than fluency.</h2>
            <div className="metric-grid">
              <div><b>Groundedness</b><span>Is the answer supported by retrieved course material?</span></div>
              <div><b>Relevance</b><span>Does it address the learner&apos;s actual question?</span></div>
              <div><b>Traceability</b><span>Can a reader understand the evidence path?</span></div>
              <div><b>Coverage</b><span>Are important related concepts included?</span></div>
            </div>
          </article>

          <article className="case-section glass-panel">
            <p className="micro-label">04 / HONEST STATUS</p>
            <h2>The project exists; the public documentation is still growing.</h2>
            <p>
              I am currently turning the implementation into a clearer public case
              study with architecture details, representative examples, evaluation
              notes and limitations. No live demo is claimed yet.
            </p>
          </article>
        </div>

        <aside className="case-sidebar">
          <div className="glass-panel">
            <p className="micro-label">KEY IDEA</p>
            <blockquote>
              Vector retrieval finds useful text. A graph can make conceptual
              relationships explicit.
            </blockquote>
          </div>
          <div className="glass-panel">
            <p className="micro-label">PUBLIC LINKS</p>
            <a href="https://github.com/jimzhou03" target="_blank" rel="noreferrer">
              GitHub profile ↗
            </a>
            <span>Repository documentation · preparing</span>
            <span>Technical report · preparing</span>
          </div>
        </aside>
      </section>
    </SiteFrame>
  );
}
