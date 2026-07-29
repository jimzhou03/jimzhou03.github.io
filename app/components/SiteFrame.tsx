import type { ReactNode } from "react";
import ParticleField from "../ParticleField";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteFrame({
  active,
  children,
  showFooter = true,
}: {
  active: string;
  children: ReactNode;
  showFooter?: boolean;
}) {
  return (
    <main className="site-frame">
      <ParticleField />
      <div className="page-shell">
        <SiteHeader active={active} />
        {children}
        {showFooter ? <SiteFooter /> : null}
      </div>
    </main>
  );
}
