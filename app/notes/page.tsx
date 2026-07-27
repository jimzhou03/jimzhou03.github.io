import SiteFrame from "../components/SiteFrame";
import { notes } from "../siteConfig";

export default function NotesPage() {
  return (
    <SiteFrame active="notes">
      <header className="page-hero glass-panel">
        <p className="micro-label">LAB NOTES / DIGITAL GARDEN</p>
        <h1>Small notes, honest questions and visible learning.</h1>
        <p>
          This will become a lightweight notebook for coursework, paper reading,
          system evaluation and ideas that are useful before they become polished.
        </p>
      </header>

      <section className="notes-page-grid">
        {notes.map((note, index) => (
          <article className="note-page-card glass-panel" key={note.id}>
            <div className="note-page-meta">
              <span>{note.id}</span>
              <b>0{index + 1}</b>
            </div>
            <p className="micro-label">{note.category}</p>
            <h2>{note.title}</h2>
            <p>
              A focused note is planned for this topic. It will be published when
              there is a useful argument, example or evaluation result to share.
            </p>
            <small><i /> {note.status}</small>
          </article>
        ))}
      </section>

      <section className="writing-principles glass-panel">
        <p className="micro-label">WRITING RULES</p>
        <h2>Useful over frequent.</h2>
        <div>
          <span><b>01</b>Show the question, not only the conclusion.</span>
          <span><b>02</b>Separate evidence from intuition.</span>
          <span><b>03</b>State limitations without hiding them.</span>
          <span><b>04</b>Prefer a concrete example over broad claims.</span>
        </div>
      </section>
    </SiteFrame>
  );
}
