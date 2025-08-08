import {
  Plus,
  Image,
  PaintBucket,
  Eraser,
  Paintbrush,
  ImageMinus,
  User,
  Coins,
} from "lucide-react";

export const navLinks = [
  {
    label: "Create",
    route: "/app",
    icon: Plus,
  },
  {
    label: "Image Restore",
    route: "/app/transformations/add/restore",
    icon: Image,
  },
  {
    label: "Generative Fill",
    route: "/app/transformations/add/fill",
    icon: PaintBucket,
  },
  {
    label: "Object Remove",
    route: "/app/transformations/add/remove",
    icon: Eraser,
  },
  {
    label: "Object Recolor",
    route: "/app/transformations/add/recolor",
    icon: Paintbrush,
  },
  {
    label: "Background \nRemove",
    route: "/app/transformations/add/removeBackground",
    icon: ImageMinus,
  },
  {
    label: "Profile",
    route: "/app/profile",
    icon: User,
  },
  {
    label: "Buy Credits",
    route: "/app/credits",
    icon: Coins,
  },
];
