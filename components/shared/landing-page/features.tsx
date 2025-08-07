import {
  Blocks,
  Bot,
  ChartPie,
  Film,
  MessageCircle,
  Settings2,
} from "lucide-react";
import React from "react";



const features = [
  {
    icon: Settings2,
    title: "Image Restore",
    description:
      "Bring damaged or blurry images back to life with AI-powered restoration.",
  },
  {
    icon: Blocks,
    title: "Generative Fill",
    description:
      "Fill in missing areas of a photo naturally using text or context.",
  },
  {
    icon: Bot,
    title: "Object Remove",
    description:
      "Instantly erase unwanted objects or blemishes from your image.",
  },
  {
    icon: Film,
    title: "Object Recolor",
    description:
      "Change product colors for variants or branding with just a few clicks.",
  },
  {
    icon: ChartPie,
    title: "Background Removal",
    description:
      "Clean cutouts for your products — perfect for white backgrounds or catalogs.",
  },
  {
    icon: MessageCircle,
    title: "Background Generation & Replacement",
    description:
      "Create or swap photorealistic backgrounds that match your brand — all from a simple prompt.",
  },
];

const Features = () => {
  return (
    <div id="features" className="w-full py-12 xs:py-20 px-6">
      <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
        Struggling with Product Image Editing?
      </h2>
       <p className="mt-6 text-center xs:text-lg max-w-3xl mx-auto">
      Creating clean, professional product photos shouldn&apos;t require expensive software or design skills. Our AI handles the hard work for you — from removing unwanted backgrounds to restoring damaged images in seconds.</p>
      <div className="w-full max-w-screen-lg mx-auto mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col bg-background border rounded-xl py-6 px-5"
          >
            <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
              <feature.icon className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">{feature.title}</span>
            <p className="mt-1 text-foreground/80 text-[15px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
