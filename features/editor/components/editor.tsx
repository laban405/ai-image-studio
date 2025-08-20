"use client";
import UploadForm from "./upload/upload-form";
import ActiveImage from "./active-image";
import Layers from "./layers";
import Loading from "./loading";
import { useProjectStore } from "@/lib/project-store";
import { ProjectStoreSync } from "@/lib/project-store-sync";
import { useEffect } from "react";

export default function Editor({ project }) {
  const layerStore = useProjectStore((state) => state);
  console.log("editor project", project);
  useEffect(() => {
    if (!project) return;
    layerStore.addId(project._id);
    layerStore.addName(project.name);
    layerStore.addUser(project.userId);
    layerStore.setThumbnailUrl(project.thumbnailUrl);
    layerStore.setActiveLayer(project.activeLayer);
    layerStore.setComparedLayers(project.comparedLayers);
    layerStore.setLayerComparisonMode(project.layerComparisonMode);
    layerStore.setLayers(project.layers);
  }, [project]);
  return (
    <div className="flex h-full ">
      <ProjectStoreSync />
      <Loading />
      <ActiveImage />
      <UploadForm />
      <Layers />
    </div>
  );
}
