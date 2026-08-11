import SiteFrame from "./components/SiteFrame";
import GravityField from "./GravityField";

export default function Home() {
  return (
    <SiteFrame active="index">
      <section className="gravity-home" aria-labelledby="home-title">
        <div className="gravity-copy">
          <h1 id="home-title" className="gravity-identity">
            Weijie Zhou
          </h1>
          <p className="gravity-discipline">
            Natural Language Processing
            <br />
            &amp; Large Language Models
          </p>
          <div className="gravity-education">
            <div className="gravity-education-entry">
              <span>B.Eng. · Intelligent Science &amp; Technology · Top 10%</span>
              <ul className="gravity-degree-honors" aria-label="Undergraduate honors">
                <li>
                  <span>LanQiao Cup · Python B · Guangdong Third Prize</span>
                  <time dateTime="2024">2024</time>
                </li>
                <li>
                  <span>Third-Class Scholarship</span>
                  <time dateTime="2024">2024</time>
                </li>
                <li>
                  <span>Second-Class Scholarship</span>
                  <time dateTime="2025">2025</time>
                </li>
                <li>
                  <span>CCL25-Eval Task 10 · 4th Place · Third Prize</span>
                  <time dateTime="2025">2025</time>
                </li>
                <li>
                  <span>Outstanding Undergraduate Thesis</span>
                  <time dateTime="2026">2026</time>
                </li>
              </ul>
            </div>
            <div className="gravity-education-entry">
              <span>
                Incoming M.A. · Computational Linguistics
                <br />
                Heidelberg University · October 2026
              </span>
            </div>
          </div>
        </div>
        <GravityField />
      </section>

    </SiteFrame>
  );
}
