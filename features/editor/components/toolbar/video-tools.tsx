"use client";
import { useProjectStore } from "@/lib/project-store";
import SmartCrop from "./smart-crop";
import ExportImage from "./export-image";
import VideoTranscription from "./transcribe";

export default function VideoTools() {
  const activeLayer = useProjectStore((state) => state.activeLayer);
  if (activeLayer?.resourceType === "video")
    return (
      <>
        <VideoTranscription />
        <SmartCrop />
      </>
    );
}
