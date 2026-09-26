import { site } from "./data/site";
import { projects } from "./data/projects";
export default function sitemap() {
  return [
    { url: site.url },
    ...projects.map((project) => ({ url: `${site.url}/work/${project.slug}` })),
  ];
}
