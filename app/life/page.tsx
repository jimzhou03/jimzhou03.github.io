import SiteFrame from "../components/SiteFrame";
import LifeAtlas from "./LifeAtlas";
import "./life-atlas.css";

export default function LifePage() {
  return (
    <>
      <link rel="preload" as="image" href="/life/china.svg" type="image/svg+xml" />
      <link rel="preload" as="image" href="/life/world-map.png" type="image/png" />
      <SiteFrame active="life">
        <LifeAtlas />
      </SiteFrame>
    </>
  );
}
