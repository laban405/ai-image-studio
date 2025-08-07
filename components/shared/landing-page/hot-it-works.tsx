// components/HowItWorks.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Upload Your Image",
    description: "Add a product or portrait photo",
  },
  {
    step: "2",
    title: "Choose a Tool",
    description: "Select what you want to change or improve",
  },
  {
    step: "3",
    title: "Download or Share",
    description: "Get instant results ready for publishing",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 " id="how-it-works">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight text-center mb-14">Transform Images in 3 Easy Steps</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ step, title, description }, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
            >
              <Card className="p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0 mb-4 text-center">
                  <div className="text-4xl font-extrabold text-primary mb-2">{step}</div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="">{description}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
