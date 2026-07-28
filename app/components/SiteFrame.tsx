import type { ReactNode } from "react";
import ParticleField from "../ParticleField";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteFrame({
  active,
  children,
}: {
  active: string;
  children: ReactNode;
}) {
  return (
    <main className="site-frame">
      <ParticleField />
      <div className="page-shell">
        <SiteHeader active={active} />
        {children}
        <SiteFooter />
      </div>
    </main>
  );
}
