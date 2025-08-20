// "use client";

import Editor from "@/features/editor/components/editor";
import { getProjectById } from "@/lib/actions/project.actions"; 
export default async function Edit({
  params,
}: {
  params: { projectId?: string };
}) {
  const projectId = params.projectId;
  const project = projectId ? await getProjectById(projectId) : null;
  console.log('project>>>>>>>>>>>>>>>>>>>>>>>>>>>>',project);
  
  return <Editor project={project} />;
}
