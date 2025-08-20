"use client";

import { useImageStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { recolorImage } from "@/server/recolor";
import { useAction } from "next-safe-action/hooks";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { Paintbrush } from "lucide-react";
import { useProjectStore } from "@/lib/project-store";
import { addLayerApi } from "@/lib/actions/layer.actions";

export default function AIRecolor() {
  const project = useProjectStore((state) => state);

  const tags = useImageStore((state) => state.tags);
  const setActiveTag = useImageStore((state) => state.setActiveTag);
  const activeTag = useImageStore((state) => state.activeTag);
  const setActiveColor = useImageStore((state) => state.setActiveColor);
  const activeColor = useImageStore((state) => state.activeColor);
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useProjectStore((state) => state.activeLayer);
  const addLayer = useProjectStore((state) => state.addLayer);
  const layers = useProjectStore((state) => state.layers);
  const generating = useImageStore((state) => state.generating);
  const setActiveLayer = useProjectStore((state) => state.setActiveLayer);

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="ghost" className="py-8 h-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            <Paintbrush size={18} />
            AI Recolor
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Generative Recolor</h4>
            <p className="text-sm text-muted-foreground">
              Recolor any part of your image with generative recolor.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="text-xs">Suggested selections</h3>
            <div className="flex gap-2">
              {tags.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No tags available
                </p>
              )}
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "px-2 py-1 rounded text-xs",
                    activeTag === tag && "bg-primary text-white"
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Selection</Label>
              <Input
                className="col-span-2 h-8"
                value={activeTag}
                name="tag"
                onChange={(e) => {
                  setActiveTag(e.target.value);
                }}
              />
            </div>
            <h3 className="text-xs">Suggested colors</h3>
            <div className="flex gap-2">
              <div
                className="w-4 h-4 bg-blue-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("blue")}
              ></div>
              <div
                className="w-4 h-4 bg-red-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("red")}
              ></div>
              <div
                className="w-4 h-4 bg-green-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("green")}
              ></div>
              <div
                className="w-4 h-4 bg-yellow-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("yellow")}
              ></div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Color</Label>
              <Input
                name="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
        <Button
          disabled={
            !activeLayer?.url || !activeTag || !activeColor || generating
          }
          className="w-full mt-4"
          onClick={async () => {
            setGenerating(true);
            const res = await recolorImage({
              color: `to-color_` + activeColor,
              activeImage: activeLayer?.url!,
              tag: "prompt_" + activeTag,
            });

            if (res?.data?.success) {
              const newLayer = {
                projectId: project.id,
                userId: project.user._id,
                name: "recolored" + activeLayer?.name!,
                format: activeLayer?.format!,
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
          {generating ? "Generating..." : "Recolor"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
