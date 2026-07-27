import ParticleField from "./ParticleField";

const focusAreas = [
  ["01", "LANGUAGE"],
  ["02", "RETRIEVAL"],
  ["03", "KNOWLEDGE"],
  ["04", "REASONING"],
];

const currentTracks = [
  {
    index: "01",
    title: "MSc Computational Linguistics",
    detail: "Preparing for a new academic chapter in Germany.",
  },
  {
    index: "02",
    title: "RAG × Knowledge Graphs",
    detail: "Turning one project into a clear, evidence-based case study.",
  },
  {
    index: "03",
    title: "Multilingual NLP Foundations",
    detail: "Building the theory and engineering skills for future research.",
  },
];

const notes = [
  {
    code: "NOTE_01",
    title: "Evaluating a course QA system",
    status: "PLANNED",
  },
  {
    code: "NOTE_02",
    title: "What graphs add beyond vector search",
    status: "PLANNED",
  },
  {
    code: "LOG_01",
    title: "Computational Linguistics learning log",
    status: "SOON",
  },
];

export default function Home() {
  return (
    <main>
      <ParticleField />
      <div className="ambient-glow glow-violet" aria-hidden="true" />
      <div className="ambient-glow glow-cyan" aria-hidden="true" />

      <header className="site-header wrap">
        <a className="brand" href="#top" aria-label="Back to the top">
          <span className="brand-mark" aria-hidden="true">◆</span>
          <span>JIMZHOU03.EXE</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">01 / ABOUT</a>
          <a href="#work">02 / WORK</a>
          <a href="#now">03 / NOW</a>
          <a href="#notes">04 / NOTES</a>
        </nav>
        <a
          className="mini-link"
          href="https://github.com/jimzhou03"
          target="_blank"
          rel="noreferrer"
        >
          GITHUB ↗
        </a>
      </header>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse" />
            MSC JOURNEY · LOADING
          </div>
          <p className="overline">COMPUTATIONAL LINGUISTICS / NLP SYSTEMS</p>
          <h1>
            <span>LANGUAGE.</span>
            <span className="outlined">KNOWLEDGE.</span>
            <span>INTELLIGENCE.</span>
          </h1>
          <p className="hero-intro">
            Hi, I&apos;m <strong>Jim</strong> — an incoming Computational Linguistics
            master&apos;s student exploring reliable NLP systems through retrieval,
            knowledge graphs and language models.
          </p>
          <div className="hero-actions">
            <a className="pixel-button primary" href="#work">
              <span>VIEW SELECTED WORK</span><b aria-hidden="true">→</b>
            </a>
            <a
              className="pixel-button ghost"
              href="https://github.com/jimzhou03"
              target="_blank"
              rel="noreferrer"
            >
              GITHUB PROFILE
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Personal profile status">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="pixel-core" aria-hidden="true">
            <span className="core-a" />
            <span className="core-b" />
            <span className="core-c" />
            <span className="core-d" />
            <span className="core-center">NLP</span>
          </div>
          <div className="floating-note note-one">RAG_</div>
          <div className="floating-note note-two">KG.sys</div>
          <div className="floating-note note-three">{"{LLM}"}</div>
          <div className="scan-panel">
            <div className="panel-bar"><span /> PROFILE.SYS <b>×</b></div>
            <div className="panel-body">
              <p><em>ROLE</em><strong>INCOMING MSc</strong></p>
              <p><em>FOCUS</em><strong>NLP × KNOWLEDGE</strong></p>
              <p><em>ROUTE</em><strong>CHINA → GERMANY</strong></p>
              <p><em>STATUS</em><strong className="lime">LEARNING</strong></p>
            </div>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span><i />
        </div>
      </section>

      <section className="signal-strip" aria-label="Focus areas">
        <div className="wrap signal-grid">
          {focusAreas.map(([index, label]) => (
            <span key={label}><b>{index}</b>{label}</span>
          ))}
        </div>
      </section>

      <section className="about wrap" id="about">
        <div className="section-index">01</div>
        <div className="section-heading">
          <p className="overline">ABOUT / CURRENT CHAPTER</p>
          <h2>Learning how language,<br />knowledge and computation connect.</h2>
        </div>
        <div className="about-copy">
          <p>
            I am preparing to begin a master&apos;s degree in Computational
            Linguistics in Germany. My current interests sit between natural
            language processing, retrieval-augmented generation, knowledge
            graphs and practical AI systems.
          </p>
          <p>
            This site is a growing record of what I build, learn and investigate.
            For now, the goal is simple: document one real project clearly and
            develop stronger foundations for future research and engineering work.
          </p>
          <div className="about-status">
            <span><i /> FIRST-YEAR MODE</span>
            <strong>LEARNING &amp; COLLABORATION</strong>
          </div>
        </div>
      </section>

      <section className="project-section" id="work">
        <div className="wrap">
          <div className="project-heading-row">
            <div>
              <p className="overline">SELECTED WORK / 2025</p>
              <h2>ONE PROJECT,<br />DOCUMENTED WITH DEPTH.</h2>
            </div>
            <span className="project-counter">01 / 01</span>
          </div>

          <article className="project-card">
            <div className="project-art" aria-label="Knowledge-enhanced assistant pipeline">
              <div className="art-grid" aria-hidden="true" />
              <div className="node node-a">DOCS</div>
              <div className="node node-b">RAG</div>
              <div className="node node-c">KG</div>
              <div className="node node-d">ANS</div>
              <div className="route route-a" aria-hidden="true" />
              <div className="route route-b" aria-hidden="true" />
              <div className="route route-c" aria-hidden="true" />
              <div className="pixel-burst burst-a" aria-hidden="true" />
              <div className="pixel-burst burst-b" aria-hidden="true" />
              <span className="art-label">KNOWLEDGE ROUTE / ACTIVE</span>
            </div>

            <div className="project-info">
              <div className="quest-status"><span /> FEATURED CASE · IN PROGRESS</div>
              <h3>Knowledge-Enhanced<br />AI Teaching Assistant</h3>
              <p>
                A CCL 2025 project exploring how retrieval-augmented generation
                and knowledge graphs can support more grounded, traceable course
                question answering.
              </p>
              <div className="pipeline" aria-label="System pipeline">
                <span>COURSE DOCS</span><i>→</i><span>RETRIEVE</span><i>→</i>
                <span>GRAPH CONTEXT</span><i>→</i><span>ANSWER</span>
              </div>
              <div className="project-evidence">
                <div>
                  <b>CHALLENGE</b>
                  <span>Ground answers in course material and related concepts.</span>
                </div>
                <div>
                  <b>APPROACH</b>
                  <span>Combine semantic retrieval with structured knowledge context.</span>
                </div>
                <div>
                  <b>CASE STUDY</b>
                  <span>Architecture, examples, evaluation plan and limitations.</span>
                </div>
              </div>
              <ul className="tags" aria-label="Technology tags">
                <li>RAG</li>
                <li>Knowledge Graph</li>
                <li>LLM</li>
                <li>Course QA</li>
              </ul>
              <p className="placeholder-note">
                Detailed write-up and repository documentation are being prepared.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="now-section wrap" id="now">
        <div className="section-index">03</div>
        <div className="now-heading">
          <p className="overline">NOW / ACTIVE THREADS</p>
          <h2>What I&apos;m building<br />towards.</h2>
        </div>
        <div className="track-list">
          {currentTracks.map((track) => (
            <article className="track-item" key={track.index}>
              <span>{track.index}</span>
              <div>
                <h3>{track.title}</h3>
                <p>{track.detail}</p>
              </div>
              <b aria-hidden="true">↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="notes-section" id="notes">
        <div className="wrap notes-layout">
          <div className="notes-heading">
            <p className="overline">LAB NOTES / IDEA QUEUE</p>
            <h2>Small notes,<br />honest thinking.</h2>
            <p>
              Short technical notes will document questions, evaluation ideas
              and lessons from coursework — without pretending unfinished work
              is finished.
            </p>
          </div>
          <div className="notes-list">
            {notes.map((note) => (
              <div className="note-row" key={note.code}>
                <code>{note.code}</code>
                <span>{note.title}</span>
                <b>{note.status}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact wrap" id="contact">
        <div className="contact-terminal">
          <div className="terminal-top">
            <span><i /> <i /> <i /></span>
            CONTACT_TERMINAL
            <b>● CONNECTED</b>
          </div>
          <div className="terminal-content">
            <p className="overline">LEARNING IN PUBLIC, ONE USEFUL THING AT A TIME.</p>
            <h2>FOLLOW THE<br /><span>BUILD LOG.</span></h2>
            <p className="command">
              <em>guest@portfolio:~$</em> open github/jimzhou03
              <span className="cursor">_</span>
            </p>
            <a
              className="pixel-button primary contact-button"
              href="https://github.com/jimzhou03"
              target="_blank"
              rel="noreferrer"
            >
              OPEN GITHUB <b>↗</b>
            </a>
          </div>
        </div>
      </section>

      <footer className="wrap">
        <p>© 2026 JIM ZHOU · BUILT WITH CURIOSITY + CODE</p>
        <div>
          <a href="https://github.com/jimzhou03" target="_blank" rel="noreferrer">GITHUB ↗</a>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
