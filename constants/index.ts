export const navLinks = [
  {
    label: "Dashboard",
    route: "/app",
    icon: "/assets/icons/home.svg",
  },
  {
    label: "Image Restore",
    route: "/app/transformations/add/restore",
    icon: "/assets/icons/image.svg",
  },
  {
    label: "Generative Fill",
    route: "/app/transformations/add/fill",
    icon: "/assets/icons/stars.svg",
  },
  {
    label: "Object Remove",
    route: "/app/transformations/add/remove",
    icon: "/assets/icons/scan.svg",
  },
  {
    label: "Object Recolor",
    route: "/app/transformations/add/recolor",
    icon: "/assets/icons/filter.svg",
  },
  {
    label: "Background Remove",
    route: "/app/transformations/add/removeBackground",
    icon: "/assets/icons/camera.svg",
  },
  {
    label: "Profile",
    route: "/app/profile",
    icon: "/assets/icons/profile.svg",
  },
  {
    label: "Buy Credits",
    route: "/app/credits",
    icon: "/assets/icons/bag.svg",
  },
];

export const plans = [
  {
    _id: 1,
    name: "Free",
    icon: "/assets/icons/free-plan.svg",
    price: 0,
    credits: 100,
    inclusions: [
      {
        label: "100 Free Credits",
        isIncluded: true,
      },
      {
        label: "Basic Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: false,
      },
      {
        label: "Priority Updates",
        isIncluded: false,
      },
    ],
  },
  {
    _id: 2,
    name: "Mini Package",
    icon: "/assets/icons/free-plan.svg",
    price: 50,
    credits: 50,
    inclusions: [
      {
        label: "50 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: false,
      },
    ],
  },
  {
    _id: 3,
    name: "Basic Package",
    icon: "/assets/icons/free-plan.svg",
    price: 100,
    credits: 100,
    inclusions: [
      {
        label: "100 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
    ],
  },
  {
    _id: 4,
    name: "Starter Package",
    icon: "/assets/icons/free-plan.svg",
    price: 250,
    credits: 250,
    inclusions: [
      {
        label: "250 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
    ],
  },
  {
    _id: 5,
    name: "Pro Package",
    icon: "/assets/icons/free-plan.svg",
    price: 500,
    credits: 500,
    inclusions: [
      {
        label: "500 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
    ],
  },
  {
    _id: 6,
    name: "Business Package",
    icon: "/assets/icons/free-plan.svg",
    price: 1000,
    credits: 1000,
    inclusions: [
      {
        label: "1000 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
    ],
  },
  {
    _id:7,
    name: "Bulk Saver Package",
    icon: "/assets/icons/free-plan.svg",
    price: 2000,
    credits: 2200,
    inclusions: [
      {
        label: "2200 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
      {
        label: "+10% bonus credits for loyal users",
        isIncluded: true,
      },
    ],
  },
  {
    _id: 8,
    name: "Agency Package",
    icon: "/assets/icons/free-plan.svg",
    price: 5000,
    credits: 5750,
    inclusions: [
      {
        label: "5750 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
      {
        label: "+15% bonus credits for power users",
        isIncluded: true,
      },
    ],
  },
];

export const transformationCosts:Record<string, number> = {
  restore: 4,
  removeBackground: 5,
  fill: 15,
  remove: 10,
  recolor: 15,
};

export const transformationTypes = {
  restore: {
    type: "restore",
    title: "Restore Image",
    subTitle: "Refine images by removing noise and imperfections",
    config: { restore: true },
    icon: "image.svg",
    cost:`${transformationCosts.restore} credits`
  },
  removeBackground: {
    type: "removeBackground",
    title: "Background Remove",
    subTitle: "Removes the background of the image using AI",
    config: { removeBackground: true },
    icon: "camera.svg",
    cost:`${transformationCosts.removeBackground} credits`

  },
  fill: {
    type: "fill",
    title: "Generative Fill",
    subTitle: "Enhance an image's dimensions using AI outpainting",
    config: { fillBackground: true },
    icon: "stars.svg",
    cost:`${transformationCosts.fill} credits`

  },
  remove: {
    type: "remove",
    title: "Object Remove",
    subTitle: "Identify and eliminate objects from images",
    config: {
      remove: { prompt: "", removeShadow: true, multiple: true },
    },
    icon: "scan.svg",
    cost:`${transformationCosts.remove} credits`

  },
  recolor: {
    type: "recolor",
    title: "Object Recolor",
    subTitle: "Identify and recolor objects from the image",
    config: {
      recolor: { prompt: "", to: "", multiple: true },
    },
    icon: "filter.svg",
    cost:`${transformationCosts.recolor} credits`

  },
};



export const aspectRatioOptions = {
  "1:1": {
    aspectRatio: "1:1",
    label: "Square (1:1)",
    width: 1000,
    height: 1000,
  },
  "3:4": {
    aspectRatio: "3:4",
    label: "Standard Portrait (3:4)",
    width: 1000,
    height: 1334,
  },
  "9:16": {
    aspectRatio: "9:16",
    label: "Phone Portrait (9:16)",
    width: 1000,
    height: 1778,
  },
};

export const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
};

// export const creditFee = -1;