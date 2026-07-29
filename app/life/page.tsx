import SiteFrame from "../components/SiteFrame";
import { lifeEntries } from "../../content/life";

export default function LifePage() {
  return (
    <SiteFrame active="life">
      <header className="life-archive-hero">
        <div className="archive-index">
          <span>LIFE / PHOTO ARCHIVE</span>
          <b>03 / 04</b>
        </div>
        <h1>Small lives,<br /><em>quiet places.</em></h1>
        <p>
          A personal counterweight to the technical work: home, animals and the
          campus where this chapter began. Your photographs will replace these
          frames without changing the composition.
        </p>
      </header>

      <section className="photo-archive">
        {lifeEntries.map((entry, index) => (
          <article className={`photo-archive-entry photo-entry-${index + 1}`} key={entry.id}>
            <div className="photo-archive-image">
              {entry.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.image} alt={entry.alt} />
              ) : (
                <div className="photo-placeholder-orbit">
                  <span>{entry.id}</span>
                  <i />
                  <b>YOUR PHOTOGRAPH<br />WILL LIVE HERE</b>
                  <small>{entry.category}</small>
                </div>
              )}
            </div>
            <div className="photo-archive-copy">
              <span>{entry.id} / {entry.category}</span>
              <h2>{entry.title}</h2>
              <p>{entry.caption}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="life-note">
        <span>ARCHIVE PRINCIPLE</span>
        <p>
          The photographs stay lightly captioned. This page is a visual record,
          not a public diary.
        </p>
      </section>
    </SiteFrame>
  );
}
