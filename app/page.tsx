import Link from "next/link";
import SiteFrame from "./components/SiteFrame";
import GravityField from "./GravityField";

export default function Home() {
  return (
    <SiteFrame active="index">
      <section className="gravity-home" aria-labelledby="home-title">
        <div className="gravity-copy">
          <span className="gravity-kicker">NLP · LARGE LANGUAGE MODELS</span>
          <h1 id="home-title">
            <span className="gravity-pull gravity-pull-soft" data-text="Building">
              Building
            </span>
            <br />
            language{" "}
            <span className="gravity-pull gravity-pull-medium" data-text="systems">
              systems
            </span>
            <br />
            grounded in{" "}
            <em className="gravity-pull gravity-pull-strong" data-text="evidence.">
              evidence.
            </em>
          </h1>
          <div className="gravity-rule" />
          <h2>
            Weijie Zhou — NLP &amp; Large Language{" "}
            <span className="gravity-pull-inline" data-text="Models">
              Models
            </span>
          </h2>
          <p>
            I build retrieval- and{" "}
            <span className="gravity-pull-inline" data-text="knowledge-enhanced">
              knowledge-enhanced
            </span>{" "}
            <span className="gravity-pull-inline gravity-pull-inline-strong" data-text="language systems">
              language systems
            </span>{" "}
            that connect models with evidence, structured knowledge and
            evaluation.
          </p>
          <div className="gravity-education">
            <span>B.Eng. · Intelligent Science &amp; Technology · Top 10%</span>
            <span>
              Incoming M.A. · Computational Linguistics
              <br />
              Heidelberg University · October 2026
            </span>
          </div>
          <Link className="gravity-cta" href="/projects">
            EXPLORE PROJECTS <span>→</span>
          </Link>
        </div>
        <GravityField />
      </section>

    </SiteFrame>
  );
}
