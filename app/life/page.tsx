import SiteFrame from "../components/SiteFrame";
import { lifeEntries, type LifeEntry } from "../../content/life";

function PhotoFrame({ entry, className }: { entry: LifeEntry; className: string }) {
  return (
    <figure className={`life-frame ${className}`} data-sequence={entry.id}>
      <div className="life-frame-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.image}
          alt={entry.alt}
          width={entry.width}
          height={entry.height}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>
        <span>{entry.id} / {entry.category}</span>
        <div>
          <strong>{entry.title}</strong>
          <p>{entry.caption}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function LifePage() {
  const dogs = lifeEntries.filter((entry) => entry.group === "dogs");
  const places = lifeEntries.filter((entry) => entry.group === "places");
  const courtyard = lifeEntries.find((entry) => entry.group === "courtyard");

  return (
    <SiteFrame active="life">
      <main className="life-story">
        <section className="life-chapter life-dog-chapter" aria-labelledby="dogs-heading">
          <header className="life-chapter-heading">
            <span>01 / HOME</span>
            <h2 id="dogs-heading">Three dogs,<br /><em>many years.</em></h2>
            <p>Xiaopang, Xiaoshou and Xiaosan — seen across different rooms and different years.</p>
          </header>
          <div className="life-photo-grid life-dog-grid">
            {dogs.map((entry, index) => (
              <PhotoFrame entry={entry} className={`life-dog-${index + 1}`} key={entry.id} />
            ))}
          </div>
        </section>

        <section className="life-chapter life-place-chapter" aria-labelledby="places-heading">
          <header className="life-chapter-heading life-chapter-heading-split">
            <span>02 / BETWEEN CLASSES</span>
            <h2 id="places-heading">Skies around<br /><em>school.</em></h2>
            <p>Railways, water, palm trees and the changing light around campus.</p>
          </header>
          <div className="life-photo-grid life-place-grid">
            {places.map((entry, index) => (
              <PhotoFrame entry={entry} className={`life-place-${index + 1}`} key={entry.id} />
            ))}
          </div>
        </section>

        {courtyard ? (
          <section className="life-epilogue" aria-labelledby="courtyard-heading">
            <div className="life-epilogue-copy">
              <span>03 / COURTYARD</span>
              <h2 id="courtyard-heading">One last<br /><em>visitor.</em></h2>
              <p>{courtyard.caption}</p>
            </div>
            <PhotoFrame entry={courtyard} className="life-cat-frame" />
          </section>
        ) : null}
      </main>
    </SiteFrame>
  );
}
