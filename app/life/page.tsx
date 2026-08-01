import SiteFrame from "../components/SiteFrame";
import LifeAtlas from "./LifeAtlas";
import "./life-atlas.css";

export default function LifePage() {
  return (
    <SiteFrame active="life">
      <LifeAtlas />
    </SiteFrame>
  );
}
