import SiteFrame from "../../components/SiteFrame";
import { featuredProject } from "../../../content/projects";

const route = [
  ["01", "COURSE MATERIAL", "Prepare and segment the source material."],
  ["02", "RETRIEVAL", "Find passages relevant to a learner's question."],
  ["03", "GRAPH CONTEXT", "Bring connected concepts and relations into view."],
  ["04", "GROUNDED ANSWER", "Generate a response tied to available evidence."],
];

const evaluation = [
  ["GROUNDEDNESS", "Is the answer supported by retrieved course material?"],
  ["RELEVANCE", "Does the response address the learner's actual question?"],
  ["TRACEABILITY", "Can a reader understand where the answer came from?"],
  ["COVERAGE", "Are important related concepts included without drifting?"],
];

export default function TeachingAssistantCaseStudy() {
  return (
    <SiteFrame active="work">
      <header className="case-orbit-hero">
        <div className="case-orbit-meta">
          <span>{featuredProject.category}</span>
          <span>CASE STUDY / 01</span>
        </div>
        <div className="case-orbit-title">
          <p>KNOWLEDGE-ENHANCED</p>
          <h1>AI Teaching<br /><em>Assistant.</em></h1>
          <p>{featuredProject.summary}</p>
        </div>
        <div className="case-title-orbit" aria-hidden="true">
          <i />
          <span>RAG</span>
          <span>KG</span>
          <span>EVIDENCE</span>
          <b>QA</b>
        </div>
        <dl>
          <div><dt>YEAR</dt><dd>{featuredProject.year}</dd></div>
          <div><dt>ROLE</dt><dd>{featuredProject.role}</dd></div>
          <div><dt>STATUS</dt><dd>{featuredProject.status}</dd></div>
        </dl>
      </header>

      <section className="case-editorial-grid">
        <article className="case-lead">
          <span>01 / THE QUESTION</span>
          <h2>How can a course assistant answer with better grounding?</h2>
          <p>
            A language model can produce fluent answers while still missing the
            specific course context a learner needs. This project explored a
            combined retrieval and knowledge-graph approach to make the evidence
            path clearer and the response more connected to course concepts.
          </p>
        </article>
        <blockquote className="case-pullquote">
          “Vector retrieval finds useful text. A graph can make conceptual
          relationships explicit.”
        </blockquote>
      </section>

      <section className="system-route">
        <header>
          <span>02 / SYSTEM ROUTE</span>
          <h2>Retrieval first.<br />Structured context next.</h2>
        </header>
        <div>
          {route.map(([number, title, detail]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="evaluation-panel">
        <header>
          <span>03 / EVALUATION</span>
          <h2>Judge more than fluency.</h2>
          <p>
            The public documentation is still growing, so these are the
            evaluation dimensions the final write-up should make visible.
          </p>
        </header>
        <div>
          {evaluation.map(([title, detail], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="honest-status">
        <span>04 / HONEST STATUS</span>
        <h2>The system exists.<br /><em>The documentation is still becoming clearer.</em></h2>
        <p>
          Architecture details, representative examples, screenshots, evaluation
          notes and limitations will be added as the project is prepared for
          public presentation. No live demo is claimed yet.
        </p>
      </section>
    </SiteFrame>
  );
}
