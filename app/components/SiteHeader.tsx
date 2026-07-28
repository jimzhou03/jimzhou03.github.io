const items = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "notes", label: "Notes", href: "/notes" },
  { id: "timeline", label: "Timeline", href: "/timeline" },
  { id: "about", label: "About", href: "/about" },
];

export default function SiteHeader({ active }: { active: string }) {
  return (
    <header className="site-header">
      <a className="site-logo" href="/" aria-label="Jim Zhou home">
        jimzhou<span>.</span>
      </a>

      <nav className="main-nav" aria-label="Primary navigation">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={active === item.id ? "active" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="site-header-bottom">
        <p>language ×<br />knowledge</p>
        <a
          className="github-button"
          href="https://github.com/jimzhou03"
          target="_blank"
          rel="noreferrer"
        >
          github ↗
        </a>
      </div>
    </header>
  );
}
