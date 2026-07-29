import Link from "next/link";
import LanguageGalaxy from "./LanguageGalaxy";
import SiteFrame from "./components/SiteFrame";

export default function Home() {
  return (
    <SiteFrame active="index">
      <section className="orbital-hero">
        <LanguageGalaxy />

        <div className="orbital-hero-meta">
          <span>INDEX / 01</span>
          <span>NATURAL LANGUAGE PROCESSING · LARGE LANGUAGE MODELS</span>
        </div>

        <div className="orbital-hero-copy">
          <p className="eyebrow">HELLO, I&apos;M</p>
          <h1>Weijie<br />Zhou</h1>
          <p className="orbital-intro">
            I build and study retrieval- and knowledge-enhanced language-model
            systems, with a focus on RAG, knowledge graphs and applied NLP.
          </p>
          <div className="orbital-actions">
            <Link href="/projects">EXPLORE WORK <span>↗</span></Link>
            <Link href="/about">ABOUT ME <span>→</span></Link>
          </div>
        </div>

        <p className="galaxy-caption">
          <span>智能</span>
          Language models do not work in isolation.<br />
          Context, evidence and structure shape the answer.
        </p>

        <div className="hero-coordinate">
          <span>CONTEXT / 上下文</span>
          <i />
          <small>MOVE THE CURSOR TO SHIFT THE FIELD</small>
        </div>
      </section>

      <section className="home-profile" aria-labelledby="profile-title">
        <div className="home-profile-heading">
          <span>01 / PROFILE</span>
          <h2 id="profile-title">NLP systems,<br /><em>from China to Heidelberg.</em></h2>
        </div>

        <div className="home-profile-intro">
          <p>
            I am Zhou Weijie, focused on natural language processing and
            large language-model systems.
          </p>
          <Link href="/about">MORE ABOUT ME <span>↗</span></Link>
        </div>

        <div className="education-ledger">
          <article>
            <span>01 / BACHELOR</span>
            <h3>B.Eng. in Intelligent<br />Science and Technology</h3>
            <p>Top 10% · China</p>
          </article>
          <article>
            <span>02 / MASTER</span>
            <h3>M.A. in Computational<br />Linguistics</h3>
            <p>Heidelberg University · October 2026</p>
          </article>
        </div>
      </section>
    </SiteFrame>
  );
}
