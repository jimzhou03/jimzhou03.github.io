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
              I like turning broad questions about language models into systems
              that can be tested: what was retrieved, which evidence shaped the
              answer, and where the system still fails.
            </p>
            <p>
              My current work sits between retrieval, structured knowledge and
              parameter-efficient model adaptation.
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
