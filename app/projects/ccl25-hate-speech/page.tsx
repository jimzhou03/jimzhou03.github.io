import SiteFrame from "../../components/SiteFrame";
import { projects } from "../../../content/projects";

const project = projects.find((entry) => entry.slug === "ccl25-hate-speech")!;

const route = [
  ["01", "DATA PREPARATION", "Convert the official Chinese dataset into the ms-swift SFT format."],
  ["02", "LORA SFT", "Adapt GLM-4-9B-0414 while training only a small fraction of its parameters."],
  ["03", "STRUCTURED DECODING", "Generate target, argument, group and hate-label quadruples."],
  ["04", "SUBMISSION EXPORT", "Validate separators and convert model output into the competition format."],
];

const evidence = [
  ["0.3566", "Best recorded public score for the GLM-4-9B-0414 v1 run."],
  ["r = 64", "Best LoRA rank in the documented rank comparison."],
  ["α = 128", "LoRA scaling used for the selected experiment."],
  ["0.76%", "Approximate share of trainable parameters in the adapted model."],
];

export default function HateSpeechCaseStudy() {
  return (
    <SiteFrame active="work">
      <header className="case-orbit-hero">
        <div className="case-orbit-meta">
          <span>{project.category}</span>
          <span>CASE STUDY / 02</span>
        </div>
        <div className="case-orbit-title">
          <p>PARAMETER-EFFICIENT ADAPTATION</p>
          <h1>Chinese Hate<br /><em>Speech Detection.</em></h1>
          <p>{project.summary}</p>
        </div>
        <div className="case-title-orbit" aria-hidden="true">
          <i />
          <span>GLM</span>
          <span>LoRA</span>
          <span>4-TUPLE</span>
          <b>SFT</b>
        </div>
        <dl>
          <div><dt>YEAR</dt><dd>{project.year}</dd></div>
          <div><dt>ROLE</dt><dd>{project.role}</dd></div>
          <div><dt>STATUS</dt><dd>OPEN REPRODUCTION</dd></div>
        </dl>
      </header>

      <section className="case-editorial-grid">
        <article className="case-lead">
          <span>01 / THE TASK</span>
          <h2>From a comment to a strict semantic structure.</h2>
          <p>
            CCL25-Eval Task 10 asks a model to identify fine-grained Chinese
            hate speech and generate one or more structured quadruples:
            target, argument, targeted group and hateful label. I was
            responsible for model selection, hyperparameter decisions, prompt
            iteration and training, and was first author of the system report.
          </p>
        </article>
        <blockquote className="case-pullquote">
          “The difficult part is not only classification. The model must express
          the decision in an exact, machine-readable sequence.”
        </blockquote>
      </section>

      <section className="system-route">
        <header>
          <span>02 / REPRODUCTION ROUTE</span>
          <h2>Data to adapter.<br />Adapter to submission.</h2>
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
          <span>03 / EXPERIMENT RECORD</span>
          <h2>Small adapter.<br />Measured result.</h2>
          <p>
            The public repository includes data-conversion, training, inference
            and submission scripts, configuration files, experiment records,
            training curves and a model card. Competition data and model
            checkpoints are intentionally excluded.
          </p>
        </header>
        <div>
          {evidence.map(([value, detail], index) => (
            <article key={value}>
              <span>0{index + 1}</span>
              <h3>{value}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="honest-status">
        <span>04 / REPRODUCIBILITY</span>
        <h2>More than a weight file.<br /><em>A documented experiment path.</em></h2>
        <p>
          The repository is a compliant reproduction scaffold for the complete
          training and inference workflow. It does not redistribute the
          competition dataset, base-model weights, checkpoints or final
          submission files.
          <a
            className="case-external-link"
            href="https://github.com/jimzhou03/GLM-4-9B-LoRA-HateSpeech"
            target="_blank"
            rel="noreferrer"
          >
            VIEW CODE &amp; DOCUMENTATION <span>↗</span>
          </a>
        </p>
      </section>
    </SiteFrame>
  );
}
