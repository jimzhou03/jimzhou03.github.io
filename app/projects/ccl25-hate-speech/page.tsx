import Image from "next/image";
import SiteFrame from "../../components/SiteFrame";
import { projects } from "../../../content/projects";

const project = projects.find((entry) => entry.slug === "ccl25-hate-speech")!;

const stages = [
  ["01", "PREPARE", "Convert the official samples into supervised message pairs without changing the task schema."],
  ["02", "ADAPT", "Fine-tune GLM-4-9B with LoRA while keeping the base model frozen."],
  ["03", "GENERATE", "Decode target, argument, group and hateful label in the required sequence."],
  ["04", "SUBMIT", "Validate separators and export one competition-formatted result per line."],
];

const evidence = [
  {
    src: "/project-demos/ccl25-hate-speech/process-04-train-loss.png",
    alt: "Original GLM-4-9B LoRA rank-64 training loss curve",
    label: "TRAINING",
    title: "Loss across 1,488 steps",
    detail: "The selected rank-64 run descends quickly and keeps a stable late-stage profile.",
  },
  {
    src: "/project-demos/ccl25-hate-speech/process-05-token-accuracy.png",
    alt: "Original token accuracy curve from the selected training run",
    label: "VALIDATION",
    title: "Token accuracy stabilizes",
    detail: "The same trainer export shows rapid early learning followed by a sustained plateau.",
  },
  {
    src: "/project-demos/ccl25-hate-speech/05-project-outcome.png",
    alt: "Documented project outcome and competition result",
    label: "OUTCOME",
    title: "A documented competition result",
    detail: "The report connects the chosen configuration, comparison record and submitted score.",
  },
];

const responsibilities = [
  "Selected the GLM-4-9B base model and parameter-efficient adaptation strategy.",
  "Designed the supervised prompt and strict quadruple output contract.",
  "Ran the LoRA rank comparison and selected rank 64 with alpha 128.",
  "Built the training, inference and submission-export workflow.",
  "Wrote the system report as first author and documented the reproduction path.",
];

const stack = [
  ["BASE MODEL", "GLM-4-9B-0414"],
  ["ADAPTATION", "LoRA · r 64 · α 128"],
  ["TRAINING", "ms-swift · 3 epochs · cosine schedule"],
  ["TASK", "Fine-grained Chinese hate-speech quadruples"],
  ["RECORD", "Scripts · configs · curves · model card"],
];

export default function HateSpeechCaseStudy() {
  return (
    <SiteFrame active="work">
      <article className="case-study-page">
        <header className="case-study-hero">
          <div className="case-study-hero-copy">
            <div className="case-study-kicker">
              <span>CASE STUDY / 02</span>
              <span>{project.category}</span>
            </div>
            <p className="case-study-overline">PARAMETER-EFFICIENT ADAPTATION</p>
            <h1>Chinese Hate<br /><em>Speech Detection.</em></h1>
            <p className="case-study-standfirst">
              A reproducible GLM-4-9B LoRA system for extracting fine-grained
              Chinese hate-speech quadruples under a strict competition format.
            </p>
            <dl className="case-study-facts">
              <div><dt>YEAR</dt><dd>{project.year}</dd></div>
              <div><dt>ROLE</dt><dd>MODEL LEAD · FIRST AUTHOR</dd></div>
              <div><dt>RESULT</dt><dd>PUBLIC SCORE · 0.3566</dd></div>
            </dl>
          </div>
          <figure className="case-study-hero-visual">
            <Image
              src="/project-demos/ccl25-hate-speech/process-01-competition-registration.png"
              alt="Original CCL2025 competition registration page"
              width={1600}
              height={900}
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <figcaption>01 / ORIGINAL CCL2025 COMPETITION ENTRY</figcaption>
          </figure>
        </header>

        <section className="case-study-overview">
          <span>01 / THE PROBLEM</span>
          <div>
            <h2>Classification was not enough.<br />The output had to be exact.</h2>
            <p>
              The task requires a model to identify who or what is targeted, the
              associated argument, the targeted group and the hateful label—then
              express every decision in one machine-readable sequence.
            </p>
            <div className="case-study-metrics" aria-label="Project summary">
              <div><strong>4</strong><span>FIELDS<br />PER QUADRUPLE</span></div>
              <div><strong>64</strong><span>SELECTED<br />LORA RANK</span></div>
              <div><strong>0.76%</strong><span>APPROXIMATE<br />TRAINABLE PARAMETERS</span></div>
            </div>
          </div>
        </section>

        <section className="case-study-method">
          <header>
            <span>02 / REPRODUCTION ROUTE</span>
            <h2>Data to adapter.<br />Adapter to submission.</h2>
          </header>
          <ol>
            {stages.map(([number, title, detail]) => (
              <li key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="case-study-proof">
          <header>
            <span>03 / EXPERIMENT EVIDENCE</span>
            <h2>Trained, measured<br />and reported.</h2>
            <p>The evidence set keeps the experiment readable without hiding the raw training record behind summary claims.</p>
          </header>
          <div className="case-study-proof-grid">
            {evidence.map((item, index) => (
              <figure className={index === 0 ? "is-featured" : ""} key={item.src}>
                <div>
                  <Image src={item.src} alt={item.alt} width={1600} height={900} sizes="(max-width: 760px) 100vw, 50vw" />
                </div>
                <figcaption>
                  <span>0{index + 1} / {item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="case-study-contribution">
          <div>
            <span>04 / MY CONTRIBUTION</span>
            <h2>Model lead,<br /><em>experiment author.</em></h2>
            <p>
              I owned the model and experiment path from task formatting through
              adapter selection, training, submission preparation and reporting.
            </p>
            <ul>
              {responsibilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <aside className="case-study-ledger">
            <span>EXPERIMENT LEDGER</span>
            <dl>
              {stack.map(([label, detail]) => (
                <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>
              ))}
            </dl>
            <a href="https://github.com/jimzhou03/GLM-4-9B-LoRA-HateSpeech" target="_blank" rel="noreferrer">
              VIEW CODE &amp; DOCUMENTATION <span>↗</span>
            </a>
          </aside>
        </section>
      </article>
    </SiteFrame>
  );
}
