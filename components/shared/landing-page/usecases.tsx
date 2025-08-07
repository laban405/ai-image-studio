// components/UseCases.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const useCases = [
  {
    icon: "🛍️",
    title: "Ecommerce Store Owners",
    description: "Improve catalog quality effortlessly",
  },
  {
    icon: "📸",
    title: "Photographers",
    description: "Retouch portraits and event shots faster",
  },
  {
    icon: "🧵",
    title: "Fashion & Apparel",
    description: "Generate color variants and lifestyle mockups",
  },
  {
    icon: "🎨",
    title: "Designers & Creators",
    description: "Ideate and edit visuals with AI help",
  },
];

export default function UseCases() {
  return (
    <section className="py-20 bg-background" id="use-cases">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight text-center mb-14">Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="text-3xl">{useCase.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{useCase.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {useCase.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
