import Link from "next/link";

const items = [
  { id: "index", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "life", label: "Life", href: "/life" },
  { id: "about", label: "About", href: "/about" },
];

export default function SiteHeader({ active }: { active: string }) {
  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="Weijie Zhou home">
        WZ<span>/26</span>
      </Link>

      <nav className="main-nav" aria-label="Primary navigation">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={active === item.id ? "active" : undefined}
          >
            <span>0{items.indexOf(item) + 1}</span>{item.label}
          </Link>
        ))}
      </nav>

      <a
        className="github-button"
        href="https://github.com/jimzhou03"
        target="_blank"
        rel="noreferrer"
      >
        GITHUB ↗
      </a>
    </header>
  );
}
