import SiteFrame from "../components/SiteFrame";
import { siteConfig } from "../siteConfig";

export default function AboutPage() {
  return (
    <SiteFrame active="about" showFooter={false}>
      <section className="about-minimal" aria-labelledby="about-title">
        <div className="archive-index">
          <span>ABOUT / A SHORT NOTE</span>
          <b>04 / 04</b>
        </div>

        <div className="about-minimal-grid">
          <h1 id="about-title">About<br /><em>me.</em></h1>
          <div className="about-minimal-copy">
            <p>
              I&apos;m Weijie Zhou, an incoming M.A. student in Computational
              Linguistics at Heidelberg University. I want to keep exploring
              NLP and large language models, especially systems that can
              remember and reason across time.
            </p>
            <p>
              The idea that draws me in is persistent context: software that
              can preserve a growing record of knowledge, experience and
              perspective instead of starting every interaction from zero. The
              speculative version is a form of <em>cyber immortality.</em>
            </p>
            <p>
              I don&apos;t pretend to have everything figured out. I&apos;m
              still learning how to form my own judgments, test them against
              evidence and change my mind when a better answer appears.
            </p>
          </div>
        </div>

        <div className="about-contact-line">
          <span>CONTACT</span>
          <div>
            <a href={siteConfig.github} target="_blank" rel="noreferrer">GITHUB / @{siteConfig.handle} ↗</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email.toUpperCase()} ↗</a>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
