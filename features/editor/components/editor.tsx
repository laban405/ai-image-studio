"use client"
import UploadForm from "./upload/upload-form"
import ActiveImage from "./active-image"
import Layers from "./layers"
import Loading from "./loading"

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
