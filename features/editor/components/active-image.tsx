// import { useImageStore } from "@/lib/store"
// import Image from "next/image"
// import { cn } from "@/lib/utils"
// import { Layer, useProjectStore } from "@/lib/layer-store"
// import { motion } from "framer-motion"
// import ImageComparison from "./layers/image-comparison"

// export default function ActiveImage() {
//   const generating = useImageStore((state) => state.generating)
//   const activeLayer = useProjectStore((state) => state.activeLayer)
//   const layerComparisonMode = useProjectStore(
//     (state) => state.layerComparisonMode
//   )
//   const comparedLayers = useProjectStore((state) => state.comparedLayers)
//   const layers = useProjectStore((state) => state.layers)

//   if (!activeLayer?.url && comparedLayers.length === 0) return null

//   const renderLayer = (layer: Layer) => (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {layer.resourceType === "image" && (
//         <Image
//           alt={layer.name || "Image"}
//           src={layer.url || ""}
//           fill={true}
//           className={cn(
//             "rounded-lg object-contain",
//             generating ? "animate-pulse" : ""
//           )}
//         />
//       )}
//       {layer.resourceType === "video" && (
//         <video
//           width={layer.width}
//           height={layer.height}
//           controls
//           className="rounded-lg object-contain max-w-full max-h-full"
//           src={layer.transcriptionURL || layer.url}
//         />
//       )}
//     </div>
//   )

//   if (layerComparisonMode && comparedLayers.length > 0) {
//     const comparisonLayers = comparedLayers
//       .map((id) => layers.find((l) => l.id === id))
//       .filter(Boolean) as Layer[]

//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center"
//       >
//         <ImageComparison layers={comparisonLayers} />
//       </motion.div>
//     )
//   }

//   return (
//     <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
//       {renderLayer(activeLayer)}
//     </div>
//   )
// }
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useImageStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Layer, useProjectStore } from "@/lib/project-store";
import { motion } from "framer-motion";
import ImageComparison from "./layers/image-comparison";
import { Button } from "./ui/button";
import {
  ArrowDownToLine,
  Drama,
  Eraser,
  Minimize,
  Redo,
  SquaresSubtract,
  Undo,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  brushSize: number;
}

const ASPECT_RATIOS = [
  { name: "Free", ratio: null },
  { name: "1:1", ratio: 1 },
  { name: "4:3", ratio: 4 / 3 },
  { name: "3:2", ratio: 3 / 2 },
  { name: "16:9", ratio: 16 / 9 },
  { name: "9:16", ratio: 9 / 16 },
  { name: "3:4", ratio: 3 / 4 },
  { name: "2:3", ratio: 2 / 3 },
];

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useProjectStore((state) => state.activeLayer);
  const layerComparisonMode = useProjectStore(
    (state) => state.layerComparisonMode
  );
  const comparedLayers = useProjectStore((state) => state.comparedLayers);
  const layers = useProjectStore((state) => state.layers);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Mask painting state
  const [isPainting, setIsPainting] = useState(false);
  const [maskMode, setMaskMode] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [maskStrokes, setMaskStrokes] = useState<Stroke[]>([]);
  const [maskHistory, setMaskHistory] = useState<Stroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Aspect ratio state
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(
    null
  );
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Calculate canvas dimensions based on aspect ratio
  const calculateCanvasSize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { width: 800, height: 600 };

    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height - 100; // Reserve space for controls

    if (selectedAspectRatio === null) {
      return { width: containerWidth, height: containerHeight };
    }

    let width, height;
    if (containerWidth / containerHeight > selectedAspectRatio) {
      height = containerHeight;
      width = height * selectedAspectRatio;
    } else {
      width = containerWidth;
      height = width / selectedAspectRatio;
    }

    return { width: Math.floor(width), height: Math.floor(height) };
  }, [selectedAspectRatio]);

  // Resize canvas to calculated size
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const size = calculateCanvasSize();
    setCanvasSize(size);

    // Set canvas dimensions
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    // Set mask canvas dimensions
    maskCanvas.width = size.width;
    maskCanvas.height = size.height;
    maskCanvas.style.width = `${size.width}px`;
    maskCanvas.style.height = `${size.height}px`;
  }, [calculateCanvasSize]);

  // Convert screen coordinates to image coordinates
  const screenToImageCoords = useCallback(
    (screenX: number, screenY: number) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const canvasX = screenX - rect.left;
      const canvasY = screenY - rect.top;

      // Calculate image position and size on canvas
      const imgDisplayWidth = img.width * zoom;
      const imgDisplayHeight = img.height * zoom;
      const centerX = (canvas.width - imgDisplayWidth) / 2;
      const centerY = (canvas.height - imgDisplayHeight) / 2;
      const imgX = centerX + offset.x;
      const imgY = centerY + offset.y;

      // Convert to image coordinates
      const imageX = (canvasX - imgX) / zoom;
      const imageY = (canvasY - imgY) / zoom;

      return { x: imageX, y: imageY };
    },
    [zoom, offset]
  );

  // Helper: fit image to canvas and center it
  const fitImageToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const scaleFactor = Math.min(
      canvasWidth / img.width,
      canvasHeight / img.height
    );

    setZoom(scaleFactor);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Draw image on main canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx!.fillStyle = "green";
    ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
    const img = imgRef.current;
    if (!canvas || !ctx || !img) return;

    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgDisplayWidth = img.width * zoom;
    const imgDisplayHeight = img.height * zoom;
    const centerX = (canvas.width - imgDisplayWidth) / 2;
    const centerY = (canvas.height - imgDisplayHeight) / 2;
    const drawX = centerX + offset.x;
    const drawY = centerY + offset.y;

    ctx.drawImage(img, drawX, drawY, imgDisplayWidth, imgDisplayHeight);
  }, [zoom, offset]);

  // Draw mask on mask canvas
  const drawMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    const ctx = maskCanvas?.getContext("2d");
    ctx!.fillStyle = "green";
    ctx!.fillRect(0, 0, maskCanvas!.width, maskCanvas!.height);
    const img = imgRef.current;
    if (!maskCanvas || !ctx || !img) return;

    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

    const imgDisplayWidth = img.width * zoom;
    const imgDisplayHeight = img.height * zoom;
    const centerX = (maskCanvas.width - imgDisplayWidth) / 2;
    const centerY = (maskCanvas.height - imgDisplayHeight) / 2;
    const imgX = centerX + offset.x;
    const imgY = centerY + offset.y;

    // Draw all mask strokes
    maskStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
      ctx.lineWidth = stroke.brushSize * zoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const startPoint = stroke.points[0];
      ctx.moveTo(imgX + startPoint.x * zoom, imgY + startPoint.y * zoom);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        ctx.lineTo(imgX + point.x * zoom, imgY + point.y * zoom);
      }
      ctx.stroke();
    });

    // Draw current stroke
    if (currentStroke.length > 1) {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.7)";
      ctx.lineWidth = brushSize * zoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const startPoint = currentStroke[0];
      ctx.moveTo(imgX + startPoint.x * zoom, imgY + startPoint.y * zoom);

      for (let i = 1; i < currentStroke.length; i++) {
        const point = currentStroke[i];
        ctx.lineTo(imgX + point.x * zoom, imgY + point.y * zoom);
      }
      ctx.stroke();
    }
  }, [maskStrokes, currentStroke, brushSize, zoom, offset]);

  // Update mask on offscreen canvas
  const updateOffscreenMask = useCallback(() => {
    const img = imgRef.current;
    if (!img || !offscreenMaskCanvasRef.current) return;

    const ctx = offscreenMaskCanvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, img.width, img.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, img.width, img.height);

    maskStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "white";
      ctx.lineWidth = stroke.brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const startPoint = stroke.points[0];
      ctx.moveTo(startPoint.x, startPoint.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    });
  }, [maskStrokes]);

  // Save state to history
  const saveToHistory = useCallback(() => {
    const newHistory = maskHistory.slice(0, historyIndex + 1);
    newHistory.push([...maskStrokes]);
    setMaskHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [maskHistory, historyIndex, maskStrokes]);

  // Load image
  useEffect(() => {
    if (!activeLayer?.url || activeLayer?.resourceType !== "image") return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activeLayer?.url;
    img.onload = () => {
      imgRef.current = img;

      const offscreen = document.createElement("canvas");
      offscreen.width = img.width;
      offscreen.height = img.height;
      const offCtx = offscreen.getContext("2d");
      offCtx?.drawImage(img, 0, 0);
      offscreenCanvasRef.current = offscreen;

      const offscreenMask = document.createElement("canvas");
      offscreenMask.width = img.width;
      offscreenMask.height = img.height;
      offscreenMaskCanvasRef.current = offscreenMask;

      resizeCanvas();
      fitImageToCanvas();
      setIsFirstLoad(false);
    };
  }, [activeLayer, fitImageToCanvas, resizeCanvas]);

  // Redraw canvases
  useEffect(() => {
    if (!isFirstLoad) {
      drawCanvas();
      drawMask();
    }
  }, [drawCanvas, drawMask, isFirstLoad]);

  // Update offscreen mask when mask strokes change
  useEffect(() => {
    updateOffscreenMask();
  }, [maskStrokes, updateOffscreenMask]);

  // Handle window resize and aspect ratio changes
  useEffect(() => {
    const handleResize = () => {
      resizeCanvas();
      if (!isFirstLoad) {
        drawCanvas();
        drawMask();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas, drawCanvas, drawMask, isFirstLoad, selectedAspectRatio]);

  // Add wheel event listener manually to make it non-passive
  useEffect(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (maskMode && isPainting) return;
      e.preventDefault();
      const newZoom = Math.max(0.1, zoom - e.deltaY * 0.001);
      setZoom(newZoom);
    };

    maskCanvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => maskCanvas.removeEventListener("wheel", handleWheel);
  }, [zoom, maskMode, isPainting]);

  // Mouse handlers for pan and paint
  const handleMouseDown = (e: React.MouseEvent) => {
    if (maskMode) {
      setIsPainting(true);
      const imageCoords = screenToImageCoords(e.clientX, e.clientY);
      setCurrentStroke([imageCoords]);
    } else {
      setIsPanning(true);
      setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (maskMode && isPainting) {
      const imageCoords = screenToImageCoords(e.clientX, e.clientY);
      setCurrentStroke((prev) => [...prev, imageCoords]);
    } else if (isPanning) {
      setOffset({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const handleMouseUp = () => {
    if (maskMode && isPainting) {
      if (currentStroke.length > 1) {
        const newStroke: Stroke = { points: currentStroke, brushSize };
        setMaskStrokes((prev) => [...prev, newStroke]);
        saveToHistory();
      }
      setCurrentStroke([]);
      setIsPainting(false);
    } else {
      setIsPanning(false);
    }
  };

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMaskStrokes(maskHistory[historyIndex - 1]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setMaskStrokes([]);
    }
  };

  const redo = () => {
    if (historyIndex < maskHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMaskStrokes(maskHistory[historyIndex + 1]);
    }
  };

  // Save functions
  const handleSaveImage = () => {
    if (!offscreenCanvasRef.current) return;
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = offscreenCanvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleSaveMask = () => {
    if (!offscreenMaskCanvasRef.current) return;
    const link = document.createElement("a");
    link.download = "mask.png";
    link.href = offscreenMaskCanvasRef.current.toDataURL("image/png");
    link.click();
  };

  const clearMask = () => {
    setMaskStrokes([]);
    setCurrentStroke([]);
    saveToHistory();
  };

  // Control functions
  const zoomIn = () => setZoom((z) => z * 1.1);
  const zoomOut = () => setZoom((z) => Math.max(0.1, z / 1.1));
  const resetZoom = () => fitImageToCanvas();

  if (!activeLayer?.url && comparedLayers.length === 0) return null;

  if (layerComparisonMode && comparedLayers.length > 0) {
    const comparisonLayers = comparedLayers
      .map((id) => layers.find((l) => l.id === id))
      .filter(Boolean) as Layer[];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center"
      >
        <ImageComparison layers={comparisonLayers} />
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {activeLayer?.resourceType === "image" && (
        <>
          {/* Top Controls */}
          <div
            className={cn(`p-4  flex flex-wrap items-center
             justify-between gap-4 
             white-bg border border-l-0 border-t-0
              border-r-0 border-b-gray-200 dark:border-b-accent`)}
          >
            {/* Aspect Ratio Controls */}
            {/* <div className="flex items-center gap-2">
              <label className=" text-sm">Aspect Ratio:</label>
              <select
                value={selectedAspectRatio?.toString() || "null"}
                onChange={(e) =>
                  setSelectedAspectRatio(
                    e.target.value === "null"
                      ? null
                      : parseFloat(e.target.value)
                  )
                }
                className="px-2 py-1 bg-gray-700  rounded text-sm"
              >
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar.name} value={ar.ratio?.toString() || "null"}>
                    {ar.name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Mask Controls */}
            <div className="flex items-center gap-2 w-full">
              <Button
                variant={"ghost"}
                onClick={() => setMaskMode(!maskMode)}
                className={cn({
                  "size-10 text-black p-2 transition-colors duration-200 m-0":
                    true,
                  "bg-gray-100": maskMode,
                })}
              >
                <Drama className="" />
              </Button>

              {maskMode && (
                <div
                  className={cn(
                    "transition-all duration-1000 p-1 rounded w-full flex overflow-hidden",
                    maskMode ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <label className=" text-sm">Brush:</label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className=" text-sm w-8">{brushSize}</span>
                  </div>

                  <Button
                    variant={"ghost"}
                    onClick={undo}
                    disabled={historyIndex < 0}
                    className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
                  >
                    <Undo />
                  </Button>

                  <Button
                    variant={"ghost"}
                    onClick={redo}
                    disabled={historyIndex >= maskHistory.length - 1}
                    className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
                  >
                    <Redo />
                  </Button>

                  <Button
                    variant={"ghost"}
                    onClick={clearMask}
                    className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
                  >
                    <Eraser className="text-sm h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="flex-1 relative  flex items-center justify-center"
          >
            <div
              className="relative"
              style={{ width: canvasSize.width, height: canvasSize.height }}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0 bg-transparent"
                style={{ backgroundColor: "#f0f0f000" }}
              />
              <canvas
                ref={maskCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={cn(
                  "absolute inset-0 bg-transparent",
                  maskMode ? "cursor-crosshair" : "cursor-move",
                  generating ? "animate-pulse" : ""
                )}
                style={{ backgroundColor: "#f0f0f000" }}
              />
            </div>
          </div>

          {/* Bottom Controls */}
          <div
            className={cn(`p-4 flex justify-end gap-2 flex-wrap 
          white-bg border border-l-0 border-b-0
              border-r-0 border-t-gray-200 dark:border-t-accent`)}
          >
            <Button
              variant={"ghost"}
              onClick={zoomOut}
              className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <ZoomOut className="text-sm h-5 w-5" />
            </Button>
            <Button
              variant={"ghost"}
              onClick={zoomIn}
              className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <ZoomIn className="text-sm h-5 w-5" />
            </Button>
            <Button
              variant={"ghost"}
              onClick={resetZoom}
              className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <Minimize className="text-sm h-5 w-5" />
            </Button>
            <Button
              variant={"ghost"}
              onClick={handleSaveImage}
              className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
            >
              <ArrowDownToLine className="text-sm h-5 w-5 " />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  onClick={handleSaveMask}
                  className="h-8 w-8 ml-2 p-1 text-gray-700 hover:text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <SquaresSubtract className="text-sm h-5 w-5 " />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Mask</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
}
