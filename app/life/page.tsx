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
        <h1>Cats<br /><em>&amp; dogs.</em></h1>
        <p>
          A small photo archive of the animals around home.
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

    </SiteFrame>
  );
}
