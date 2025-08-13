"use client"
import UploadForm from "./upload/upload-form"
import ActiveImage from "./active-image"
import { useLayerStore } from "@/lib/layer-store"
import Layers from "./layers"
import ImageTools from "./toolbar/image-tools"
import VideoTools from "./toolbar/video-tools"
import { ModeToggle } from "./toggle"
import GenerativeFill from "./toolbar/generative-fill"
import Loading from "./loading"
import ExportAsset from "./toolbar/export-image"

export default function Editor() {

  return (
    <div className="flex h-full ">
     
      <Loading />
      <ActiveImage />
      <UploadForm />
      <Layers />
    </div>
  )
}
