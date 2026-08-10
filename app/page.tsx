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
            NLP &amp; Large Language Models
          </p>
          <div className="gravity-education">
            <span>B.Eng. · Intelligent Science &amp; Technology · Top 10%</span>
            <span>
              Incoming M.A. · Computational Linguistics
              <br />
              Heidelberg University · October 2026
            </span>
          </div>
        </div>
        <GravityField />
      </section>

    </SiteFrame>
  );
}
