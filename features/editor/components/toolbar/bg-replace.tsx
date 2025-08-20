"use client";

import { useImageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { replaceBackground } from "@/server/bg-replace";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageOff } from "lucide-react";
import { useProjectStore } from "@/lib/project-store";
import { useState } from "react";
import { addLayerApi } from "@/lib/actions/layer.actions";

export default function AIBackgroundReplace() {
  const project = useProjectStore((state) => state);

  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useProjectStore((state) => state.activeLayer);
  const addLayer = useProjectStore((state) => state.addLayer);
  const generating = useImageStore((state) => state.generating);
  const setActiveLayer = useProjectStore((state) => state.setActiveLayer);

  const [prompt, setPrompt] = useState("");

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="ghost" className="py-8 h-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            <ImageOff size={18} />
            AI BG Replace
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Generative Background Replace
            </h4>
            <p className="text-sm text-muted-foreground">
              Replace the background of your image with AI-generated content.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="prompt">Prompt (optional)</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the new background"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
        <Button
          disabled={!activeLayer?.url || generating}
          className="w-full mt-4"
          onClick={async () => {
            setGenerating(true);
            const res = await replaceBackground({
              prompt: prompt,
              activeImage: activeLayer?.url!,
            });

            if (res?.data?.success) {
              const newLayer = {
                projectId: project.id,
                userId: project.user._id,
                name: "bg-replaced-" + activeLayer?.name,
                format: "png",
                height: activeLayer?.height!,
                width: activeLayer?.width!,
                url: res.data.success,
                publicId: activeLayer?.publicId!,
                resourceType: "image",
              };
              const addedLayer = await addLayerApi({
                layer: newLayer,
                userId: project.user._id,
                path: "/",
              });

              addLayer({
                ...addedLayer,
              });

              setGenerating(false);
              setActiveLayer(addedLayer._id);
            }
          }}
        >
          {generating ? "Generating..." : "Replace Background"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
