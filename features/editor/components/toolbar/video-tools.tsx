"use client"
import { useLayerStore } from "@/lib/layer-store"
import SmartCrop from "./smart-crop"
import ExportImage from "./export-image"
import VideoTranscription from "./transcribe"

export default function VideoTools() {
  const activeLayer = useLayerStore((state) => state.activeLayer)
  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription />
        <SmartCrop />
      </>
    )
}
