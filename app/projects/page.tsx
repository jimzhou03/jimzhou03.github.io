import SiteFrame from "../components/SiteFrame";
import ProjectUniverse from "./ProjectUniverse";

export default function ProjectsPage() {
  return (
    <SiteFrame active="work" showFooter={false}>
      <ProjectUniverse />
    </SiteFrame>
  );
}
