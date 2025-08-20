import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProjectStore } from "@/lib/project-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  ArrowRight,
  CornerLeftDown,
  Ellipsis,
  GitCompare,
  GitCompareArrows,
  Images,
  Layers2,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useImageStore } from "@/lib/store";
import LayerImage from "./layers/layer-image";
import { cn } from "@/lib/utils";
import Image from "next/image";
import LayerInfo from "./layers/layer-info";
import { addLayerApi } from "@/lib/actions/layer.actions";

export default function Layers() {
  const layers = useProjectStore((state) => state.layers);
  const project = useProjectStore((state) => state);
  const activeLayer = useProjectStore((state) => state.activeLayer);
  const setActiveLayer = useProjectStore((state) => state.setActiveLayer);
  const addLayer = useProjectStore((state) => state.addLayer);
  const generating = useImageStore((state) => state.generating);
  const layerComparisonMode = useProjectStore(
    (state) => state.layerComparisonMode
  );
  const setLayerComparisonMode = useProjectStore(
    (state) => state.setLayerComparisonMode
  );
  const comparedLayers = useProjectStore((state) => state.comparedLayers);
  const toggleComparedLayer = useProjectStore(
    (state) => state.toggleComparedLayer
  );
  const setComparedLayers = useProjectStore((state) => state.setComparedLayers);

  const MCard = useMemo(() => motion(Card), []);
  const MButton = useMemo(() => motion(Button), []);

  const getLayerName = useMemo(
    () => (id: string) => {
      const layer = layers.find((l) => l._id === id);
      return layer ? layer.url : "Nothing here";
    },
    [layers]
  );

  const visibleLayers = useMemo(
    () =>
      layerComparisonMode
        ? layers.filter((layer) => layer.url && layer.resourceType === "image")
        : layers,
    [layerComparisonMode, layers]
  );

  return (
    <MCard
      layout
      className={cn({
        "basis-[320px] shrink-0  scrollbar-thin scrollbar-track-secondary overflow-y-scroll":
          true,
        "scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full border-t-0 border-b-0":
          true,
        "border-t-0 border-b-0 border-r-0": true,
        " overflow-x-hidden relative flex flex-col shadow-none rounded-none dark:border-accent bg-white dark:bg-card":
          true,
      })}
    >
      <CardHeader className="sticky top-0 z-50 px-4 py-6  min-h-28 bg-white dark:bg-card shadow-sm">
        {layerComparisonMode ? (
          <div>
            <CardTitle className="text-sm pb-2">Comparing...</CardTitle>
            <CardDescription className="flex gap-2 items-center">
              <Image
                alt="compare"
                width={32}
                height={32}
                src={getLayerName(comparedLayers[0]) as string}
              />
              {comparedLayers.length > 0 && <ArrowRight />}
              {comparedLayers.length > 1 ? (
                <Image
                  alt="compare"
                  width={32}
                  height={32}
                  src={getLayerName(comparedLayers[1]) as string}
                />
              ) : (
                "Nothing here"
              )}
            </CardDescription>
          </div>
        ) : (
          <div className="flex flex-col gap-1 ">
            <CardTitle className="text-sm bg-white dark:bg-card">
              {activeLayer?.name || "Layers"}
            </CardTitle>
            {activeLayer?.width && activeLayer?.height ? (
              <CardDescription className="text-xs bg-white dark:bg-card">
                {activeLayer?.width}X{activeLayer?.height}
              </CardDescription>
            ) : null}
          </div>
        )}
      </CardHeader>
      <motion.div className="flex-1 flex flex-col">
        <AnimatePresence>
          {visibleLayers.map((layer, index) => {
            return (
              <motion.div
                key={layer._id! + index}
                animate={{ scale: 1, opacity: 1 }}
                initial={{ scale: 0, opacity: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                layout
                className={cn(
                  "cursor-pointer ease-in-out hover:bg-accent  border-transparent",
                  {
                    "bg-accent": layerComparisonMode
                      ? comparedLayers.includes(layer._id!)
                      : activeLayer?._id === layer._id,
                    "animate-pulse": generating,
                  }
                )}
                onClick={() => {
                  if (generating) return;
                  if (layerComparisonMode) {
                    toggleComparedLayer(layer._id!);
                  } else {
                    setActiveLayer(layer._id!);
                  }
                }}
              >
                <div className="relative p-4 flex items-center">
                  <div className="flex gap-2 items-center h-8 w-full justify-between">
                    {!layer.url ? (
                      <p className="text-xs font-medium justify-self-end ">
                        {layer.name ?? "New layer"}
                      </p>
                    ) : null}
                    <LayerImage layer={layer} />
                    {layers.length !== 1 && (
                      <LayerInfo layer={layer} layerIndex={index} />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <CardContent className="sticky bottom-0 bg-card flex gap-2  shrink-0 bg-white dark:bg-card">
        <MButton
          layout
          onClick={async () => {
            console.log("added layer project", project);

            const newLayer = {
              projectId: project.id,
              userId: project.user._id,
              name: "New Layer",
              format: "",
              height: 0,
              width: 0,
              url: "",
              publicId: "",
              resourceType: "image",
            };
            const addedLayer = await addLayerApi({
              layer: newLayer,
              userId: project.user._id,
              path: "/",
            });
            console.log("added create layer", addedLayer);
            addLayer({
              ...addedLayer,
            });
            setActiveLayer(addedLayer._id);
          }}
          variant="outline"
          className="w-full flex gap-2"
        >
          <span className="text-xs">Create Layer</span>
          <Layers2 className="text-secondary-foreground" size={18} />
        </MButton>
        <MButton
          disabled={!activeLayer?.url || activeLayer?.resourceType === "video"}
          layout
          onClick={() => {
            if (layerComparisonMode) {
              setLayerComparisonMode(!layerComparisonMode);
            } else if (activeLayer?._id) {
              setComparedLayers([activeLayer?._id]);
            }
          }}
          variant={layerComparisonMode ? "destructive" : "outline"}
          className="w-full flex gap-2"
        >
          <motion.span className={cn("text-xs font-bold")}>
            {layerComparisonMode ? "Stop Comparing" : "Compare"}
          </motion.span>
          {!layerComparisonMode && (
            <Images className="text-secondary-foreground" size={18} />
          )}
        </MButton>
      </CardContent>
    </MCard>
  );
}
