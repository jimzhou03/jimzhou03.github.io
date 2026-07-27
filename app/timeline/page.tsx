import SiteFrame from "../components/SiteFrame";
import { timeline } from "../siteConfig";

export default function TimelinePage() {
  return (
    <SiteFrame active="timeline">
      <header className="page-hero glass-panel">
        <p className="micro-label">TIMELINE / THE LONG ARC</p>
        <h1>From one AI project to a life in language technology.</h1>
        <p>
          A deliberately simple timeline: what has happened, what is starting,
          and what I hope to grow into during the coming years in Germany.
        </p>
      </header>

      <section className="timeline-page">
        {timeline.map((item, index) => (
          <article className={`timeline-entry ${item.state}`} key={item.year}>
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-axis"><i /><span /></div>
            <div className="timeline-card glass-panel">
              <p className="micro-label">
                {item.state === "complete" ? "ARCHIVED" : item.state === "active" ? "NOW LOADING" : "DIRECTION"}
              </p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <small>CHAPTER 0{index + 1}</small>
            </div>
          </article>
        ))}
      </section>
    </SiteFrame>
  );
}
