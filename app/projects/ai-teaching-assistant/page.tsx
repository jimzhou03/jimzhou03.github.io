import SiteFrame from "../../components/SiteFrame";
import { featuredProject } from "../../../content/projects";

const route = [
  ["01", "DOMAIN MATERIAL", "Prepare course knowledge for vector and graph retrieval."],
  ["02", "HYBRID RETRIEVAL", "Retrieve semantically relevant passages and connected entities."],
  ["03", "DIFY WORKFLOW", "Assemble evidence, graph context and prompt logic into an answer route."],
  ["04", "TRACEABLE ANSWER", "Generate a response with citations to the available knowledge."],
];

const evaluation = [
  ["1.000", "Citation accuracy in the project evaluation."],
  ["93.4%", "Average evidence coverage across the evaluated answers."],
  ["100%", "Citation rate reported for the evaluated question set."],
  ["104 ms", "Average graph-query latency on the 30-question main route."],
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
          <div><dt>SYSTEM</dt><dd>LIVE · LOGIN REQUIRED</dd></div>
        </dl>
      </header>

      <section className="case-editorial-grid">
        <article className="case-lead">
          <span>01 / THE QUESTION</span>
          <h2>How can a course assistant answer with better grounding?</h2>
          <p>
            A language model can produce fluent answers while missing the
            specific domain context a learner needs. This bachelor capstone used
            PostgreSQL with Apache AGE, vector retrieval and graph context to
            make the evidence path clearer and connect answers to related course
            concepts.
          </p>
        </article>
        <blockquote className="case-pullquote">
          “Vector retrieval finds useful text. A graph makes the relationships
          between domain concepts explicit.”
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
          <h2>Evidence from the<br />system report.</h2>
          <p>
            These figures are taken from the project report. They describe a
            limited evaluation, not a claim of general model quality.
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
        <span>04 / MY CONTRIBUTION</span>
        <h2>Workflow, graph and deployment.<br /><em>Built as a team system.</em></h2>
        <p>
          I designed the Dify workflow, knowledge-graph integration, backend
          fields and data structure, selected and deployed the server, and
          contributed to the interface design. A teammate implemented the
          frontend code. The deployed system remains available as a team
          project; representative screenshots and limitations can be added when
          the case study is prepared for public presentation.
          <a
            className="case-external-link"
            href="https://www.zcst-ai-assistant.online/login"
            target="_blank"
            rel="noreferrer"
          >
            OPEN TEAM SYSTEM · LOGIN REQUIRED <span>↗</span>
          </a>
        </p>
      </section>
    </SiteFrame>
  );
}
