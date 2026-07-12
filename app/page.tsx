const techStack = ["RAG", "Knowledge Graph", "LLM", "智能问答"];

export default function Home() {
  return (
    <main>
      <div className="starfield" aria-hidden="true">
        <i className="star star-1" />
        <i className="star star-2" />
        <i className="star star-3" />
        <i className="star star-4" />
        <i className="star star-5" />
        <i className="star star-6" />
      </div>

      <header className="site-header wrap">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark" aria-hidden="true">◆</span>
          <span>YOUR_NAME.EXE</span>
        </a>
        <nav aria-label="主导航">
          <a href="#about">01 / ABOUT</a>
          <a href="#project">02 / PROJECT</a>
          <a href="#contact">03 / CONTACT</a>
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
          <div className="eyebrow"><span className="pulse" /> PLAYER 01 · ONLINE</div>
          <p className="overline">AI BUILDER / KNOWLEDGE SYSTEMS EXPLORER</p>
          <h1>
            <span>BUILDING</span>
            <span className="outlined">INTELLIGENT</span>
            <span>SYSTEMS.</span>
          </h1>
          <p className="hero-intro">
            你好，我是 <strong>YOUR_NAME</strong>。我正在探索检索增强生成、
            知识图谱与大语言模型之间更可靠、更有用的连接方式。
          </p>
          <div className="hero-actions">
            <a className="pixel-button primary" href="#project">
              <span>进入项目</span><b aria-hidden="true">→</b>
            </a>
            <a
              className="pixel-button ghost"
              href="https://github.com/jimzhou03"
              target="_blank"
              rel="noreferrer"
            >
              查看 GitHub
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="个人状态面板">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="pixel-core" aria-hidden="true">
            <span className="core-a" />
            <span className="core-b" />
            <span className="core-c" />
            <span className="core-d" />
            <span className="core-center">AI</span>
          </div>
          <div className="floating-note note-one">RAG_</div>
          <div className="floating-note note-two">KG.sys</div>
          <div className="floating-note note-three">{`{LLM}`}</div>
          <div className="scan-panel">
            <div className="panel-bar"><span /> SYSTEM_PROFILE <b>×</b></div>
            <div className="panel-body">
              <p><em>FOCUS</em><strong>AI × KNOWLEDGE</strong></p>
              <p><em>STATUS</em><strong className="lime">BUILDING</strong></p>
              <p><em>LOCATION</em><strong>CHINA / UTC+8</strong></p>
            </div>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span><i />
        </div>
      </section>

      <section className="about wrap" id="about">
        <div className="section-index">01</div>
        <div className="section-heading">
          <p className="overline">ABOUT / PLAYER PROFILE</p>
          <h2>在代码、知识与<br />真实问题之间探索。</h2>
        </div>
        <div className="about-copy">
          <p>
            这里暂时放一段关于你的介绍。未来可以补充你的专业背景、研究兴趣、
            技术方向，以及你希望通过 AI 解决的问题。
          </p>
          <p>
            当前关注：让模型不只会“生成”，也能基于可追溯的知识进行检索、推理与回答。
          </p>
          <div className="focus-grid">
            <span><b>01</b> RETRIEVAL</span>
            <span><b>02</b> KNOWLEDGE</span>
            <span><b>03</b> REASONING</span>
            <span><b>04</b> EXPERIENCE</span>
          </div>
        </div>
      </section>

      <section className="project-section" id="project">
        <div className="wrap">
          <div className="project-heading-row">
            <div>
              <p className="overline">SELECTED QUEST / 2025</p>
              <h2>FEATURED PROJECT</h2>
            </div>
            <span className="project-counter">01 / 01</span>
          </div>

          <article className="project-card">
            <div className="project-art" aria-hidden="true">
              <div className="art-grid" />
              <div className="node node-a">Q</div>
              <div className="node node-b">R</div>
              <div className="node node-c">KG</div>
              <div className="node node-d">A</div>
              <div className="route route-a" />
              <div className="route route-b" />
              <div className="route route-c" />
              <div className="pixel-burst burst-a" />
              <div className="pixel-burst burst-b" />
              <span className="art-label">KNOWLEDGE ROUTE / ACTIVE</span>
            </div>

            <div className="project-info">
              <div className="quest-status"><span /> MAIN QUEST · IN PROGRESS</div>
              <h3>CCL 2025<br />AI 助教系统</h3>
              <p>
                一个结合 RAG 与知识图谱的 AI 助教系统。通过语义检索召回相关内容，
                再利用结构化知识关系补充上下文，为学习者提供更连贯、更可追溯的智能问答体验。
              </p>
              <div className="pipeline" aria-label="系统流程">
                <span>QUERY</span><i>→</i><span>RETRIEVE</span><i>→</i><span>GRAPH</span><i>→</i><span>ANSWER</span>
              </div>
              <ul className="tags" aria-label="技术标签">
                {techStack.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="placeholder-note">项目详情与仓库链接可在后续补充</p>
            </div>
          </article>
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
            <p className="overline">READY FOR THE NEXT QUEST?</p>
            <h2>LET&apos;S BUILD<br /><span>SOMETHING USEFUL.</span></h2>
            <p className="command"><em>guest@portfolio:~$</em> open github/jimzhou03<span className="cursor">_</span></p>
            <a
              className="pixel-button primary contact-button"
              href="https://github.com/jimzhou03"
              target="_blank"
              rel="noreferrer"
            >
              前往 GitHub <b>↗</b>
            </a>
          </div>
        </div>
      </section>

      <footer className="wrap">
        <p>© 2025 YOUR_NAME · MADE WITH CURIOSITY + CODE</p>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
