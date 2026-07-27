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
      <div className="background-aurora aurora-one" aria-hidden="true" />
      <div className="background-aurora aurora-two" aria-hidden="true" />
      <div className="page-shell">
        <SiteHeader active={active} />
        {children}
        <SiteFooter />
      </div>
    </main>
  );
}
