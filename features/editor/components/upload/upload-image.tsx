"use client";

import { uploadImage } from "@/server/upload-image";
import { useImageStore } from "@/lib/store";
import { useDropzone } from "react-dropzone";
import Lottie from "lottie-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/lib/layer-store";
import imageAnimation from "@/public/animations/image-upload.json";
import { toast } from "sonner";
import MediaUploader from "@/components/shared/MediaUploader";
import { z } from "zod";
import { CustomField } from "@/components/shared/CustomField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValues } from "@/constants";
import { Form } from "../ui/form";
import { useState } from "react";

export const formSchema = z.object({
  // title: z.string().optional(),
  // aspectRatio: z.string().optional(),
  // color: z.string().optional(),
  // prompt: z.string().optional(),
  publicId: z.string(),
});

export default function UploadImage() {
  const setTags = useImageStore((state) => state.setTags);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { publicId: "" },
  });
  const [image, setImage] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/webp": [".webp"],
      "image/jpeg": ["jpeg"],
    },
    onDrop: async (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length) {
        const formData = new FormData();
        formData.append("image", acceptedFiles[0]);
        // Generate Object url
        const objectUrl = URL.createObjectURL(acceptedFiles[0]);
        setGenerating(true);
        // State management to create a new layers, set the active layer, set the image as the active layer
        updateLayer({
          id: activeLayer.id,
          url: objectUrl,
          width: 0,
          height: 0,
          name: "uploading",
          publicId: "",
          format: "",
          resourceType: "image",
        });
        setActiveLayer(activeLayer.id);
        const res = await uploadImage({ image: formData });

        if (res?.data?.success) {
          updateLayer({
            id: activeLayer.id,
            url: res.data.success.url,
            width: res.data.success.width,
            height: res.data.success.height,
            name: res.data.success.original_filename,
            publicId: res.data.success.public_id,
            format: res.data.success.format,
            resourceType: res.data.success.resource_type,
          });
          setTags(res.data.success.tags);

          setActiveLayer(activeLayer.id);
          console.log(activeLayer);
          setGenerating(false);
        }
        if (res?.data?.error) {
          setGenerating(false);
        }
      }

      if (fileRejections.length) {
        console.log("rejected");
        toast.error(fileRejections[0].errors[0].message);
      }
    },
  });

  function setLayerState(response: any) {
    updateLayer({
      id: activeLayer.id,
      url: response.secure_url,
      width: response.width,
      height: response.height,
      name: response.original_filename,
      publicId: response.public_id,
      format: response.format,
      resourceType: response.resource_type,
    });
    setTags(response.tags);

    setActiveLayer(activeLayer.id);
  }

  if (!activeLayer.url)
    return (
      <Card
        {...getRootProps()}
        className={cn(
          " hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all  ease-in-out ",
          `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
        )}
      >
        <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24  text-xs ">
          {/* <input {...getInputProps()} />
          <div className="flex items-center flex-col justify-center gap-4">
            <Lottie className="h-48" animationData={imageAnimation} />
            <p className="text-muted-foreground text-2xl">
              {isDragActive
                ? "Drop your image here!"
                : "Get started by uploading an image"}
            </p>
            <p className="text-muted-foreground">
              Supported formats: (.jpeg .jpg .png .webp)
            </p>
          </div> */}
          <Form {...form}>
            <form
              // onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <CustomField
                control={form.control}
                name="publicId"
                className="flex size-full flex-col"
                render={({ field }) => (
                  <MediaUploader
                    onValueChange={field.onChange}
                    setImage={setImage}
                    publicId={field.value}
                    image={image}
                    type={"fill"}
                    setLayerState={setLayerState}
                    onUploadAdded={(onUpload) => {
                      console.log("on upload added", onUpload.info?.file);
                      // setGenerating(true);
                      // State management to create a new layers, set the active layer, set the image as the active layer
                    }}
                    onOpen={(onOpen: any) => {
                      console.log("on open added", onOpen);
                    }}
                  />
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    );
}
