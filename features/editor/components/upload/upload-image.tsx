"use client";

import { uploadImage } from "@/server/upload-image";
import { useImageStore } from "@/lib/store";
import { useDropzone } from "react-dropzone";
import Lottie from "lottie-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/lib/project-store";
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
import { updateLayerApi } from "@/lib/actions/layer.actions";

export const formSchema = z.object({
  // title: z.string().optional(),
  // aspectRatio: z.string().optional(),
  // color: z.string().optional(),
  // prompt: z.string().optional(),
  publicId: z.string(),
});

export default function UploadImage() {
  const setTags = useImageStore((state) => state.setTags);
  const project = useProjectStore((state) => state);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useProjectStore((state) => state.activeLayer);
  const updateLayer = useProjectStore((state) => state.updateLayer);
  const setActiveLayer = useProjectStore((state) => state.setActiveLayer);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { publicId: "" },
  });
  const [image, setImage] = useState(null);

  async function setLayerState(response: any) {
    await updateLayerApi({
      layer: {
        _id: activeLayer?._id!,
        projectId: activeLayer?.projectId!,
        userId: project.user._id,
        name: response.original_filename,
        format: response.format,
        height: response.height,
        width: response.width,
        url: response.secure_url,
        publicId: response.public_id,
        resourceType: response.resource_type,
      },
      userId: project.user._id,
      path: "/",
    });
    updateLayer({
      _id: activeLayer?._id!,
      projectId: activeLayer?.projectId!,
      userId: project.user._id,
      name: response.original_filename,
      format: response.format,
      height: response.height,
      width: response.width,
      url: response.secure_url,
      publicId: response.public_id,
      resourceType: response.resource_type,
    });
    setActiveLayer(activeLayer?._id!);
    setTags(response.tags);
  }

  if (!activeLayer?.url)
    return (
      <Card className={cn("hover:cursor-pointer transition-all  ease-in-out ")}>
        <CardContent className="flex flex-col h-full items-center justify-center px-2 py-2  text-xs ">
          <Form {...form}>
            <form
              // onSubmit={form.handleSubmit(onSubmit)}
              className="w-full"
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
