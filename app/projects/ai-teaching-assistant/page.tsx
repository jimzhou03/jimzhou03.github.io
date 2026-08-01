import SiteFrame from "../../components/SiteFrame";
import { featuredProject } from "../../../content/projects";

const architecture = [
  ["01", "INTERFACE", "React, Vite and TanStack Query provide the student-facing experience and streamed responses."],
  ["02", "WORKFLOW", "Dify coordinates retrieval, prompt logic, graph context and four task-specific routes."],
  ["03", "APPLICATION", "Node.js and TypeScript APIs validate requests, wrap model calls and stream results over SSE."],
  ["04", "KNOWLEDGE", "PostgreSQL, Apache AGE and openCypher connect course content, entities and topic relationships."],
  ["05", "LEARNER STATE", "Bayesian Knowledge Tracing updates persistent topic mastery after each submitted answer."],
];

const workflows = [
  ["01", "COURSE Q&A", "Retrieve course evidence and return grounded answers with usable context."],
  ["02", "EXERCISE RECOMMENDATION", "Combine topic relationships and mastery state to select useful practice."],
  ["03", "LEARNING REPORT", "Turn attempts and mastery updates into an interpretable progress summary."],
  ["04", "LEARNING PATH", "Sequence next steps from prerequisites, weak topics and course structure."],
];

const stack = [
  ["AI ORCHESTRATION", "Dify · GPT-4o · RAG"],
  ["RETRIEVAL", "text-embedding-3-large · gte-rerank-v2"],
  ["KNOWLEDGE", "Apache AGE · openCypher · Domain KG"],
  ["BACKEND", "Node.js · TypeScript · REST API · SSE"],
  ["DATA & UI", "PostgreSQL · React · Vite · TanStack Query"],
];

const responsibilities = [
  "Led planning, task allocation and cross-module integration for the project team.",
  "Built the Dify workflows and connected retrieval, graph context and model calls.",
  "Defined database fields, API contracts and the payloads shared between services.",
  "Built the early domain-knowledge-graph schema and query prototype with Apache AGE.",
  "Wrapped external API calls, configured Dify HTTP nodes and supported end-to-end debugging.",
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
          <p>KNOWLEDGE-ENHANCED LEARNING SYSTEM</p>
          <h1>AI Teaching<br /><em>Assistant.</em></h1>
          <p>{featuredProject.summary}</p>
        </div>
        <div className="case-title-orbit" aria-hidden="true">
          <i />
          <span>RAG</span>
          <span>KG</span>
          <span>BKT</span>
          <b>DIFY</b>
        </div>
        <dl>
          <div><dt>YEAR</dt><dd>{featuredProject.year}</dd></div>
          <div><dt>ROLE</dt><dd>{featuredProject.role}</dd></div>
          <div><dt>SYSTEM</dt><dd>TEAM SYSTEM · DEPLOYED</dd></div>
        </dl>
      </header>

      <section className="case-editorial-grid">
        <article className="case-lead">
          <span>01 / PURPOSE</span>
          <h2>Course-grounded answers are only one part of the system.</h2>
          <p>
            The system combines course-material retrieval, domain-graph relationships
            and persistent learner-state updates. It supports grounded question
            answering, personalized exercises, learning reports and path planning
            through one connected application.
          </p>
        </article>
        <blockquote className="case-pullquote">
          “Dify orchestrates the language-model workflows; the backend owns
          deterministic state and learning calculations.”
        </blockquote>
      </section>

      <section className="system-route architecture-route">
        <header>
          <span>02 / ARCHITECTURE</span>
          <h2>Five layers.<br />One learning loop.</h2>
        </header>
        <div>
          {architecture.map(([number, title, detail]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-panel">
        <header>
          <span>03 / PRODUCT WORKFLOWS</span>
          <h2>Four routes.<br />Shared learner state.</h2>
          <p>
            Each workflow serves a different student need, while the same course
            structure and mastery record keep the experience coherent.
          </p>
        </header>
        <div>
          {workflows.map(([number, title, detail]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contribution-panel">
        <div className="contribution-copy">
          <span>04 / MY ROLE</span>
          <h2>Project lead,<br /><em>workflow engineer.</em></h2>
          <p>
            This was a team system. My contribution focused on coordination,
            workflow architecture and the integration boundaries between the AI,
            graph, backend and data layers.
          </p>
          <ul>
            {responsibilities.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <aside className="stack-ledger">
          <span>05 / TECHNOLOGY STACK</span>
          <dl>
            {stack.map(([label, detail]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
          <a
            className="case-external-link"
            href="https://www.zcst-ai-assistant.online/login"
            target="_blank"
            rel="noreferrer"
          >
            OPEN TEAM SYSTEM · LOGIN REQUIRED <span>↗</span>
          </a>
        </aside>
      </section>
    </SiteFrame>
  );
}
