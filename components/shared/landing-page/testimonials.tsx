import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import Link from "next/link";
import React, { ComponentProps } from "react";

const testimonials = [
  {
    id: 1,
    name: "Liam Mwangi",
    designation: "Ecommerce Store Owner",
    company: "Shopfinity",
    testimonial:
      "I used to spend hours on product shoots. Now I generate professional photos in minutes — it’s a total game changer!",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 2,
    name: "Aisha Kamau",
    designation: "Photographer",
    company: "Studio AK",
    testimonial:
      "Perfect for batch retouching and background replacement. My clients are blown away by the results!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 3,
    name: "Kevin Otieno",
    designation: "Creative Director",
    company: "VisualAfrica",
    testimonial:
      "We use it to generate concepts for shoots. It’s like having an AI assistant for our entire design team.",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
  {
    id: 4,
    name: "Grace Njeri",
    designation: "Fashion Brand Owner",
    company: "Threads by Grace",
    testimonial:
      "No more expensive studio shoots — I can showcase my designs in lifestyle scenes with just a few clicks.",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: 5,
    name: "Brian Karanja",
    designation: "Digital Marketer",
    company: "AdSpark",
    testimonial:
      "From background swaps to quick touch-ups, this tool helps me deliver better creatives faster for my campaigns.",
    avatar: "https://randomuser.me/api/portraits/men/27.jpg",
  },
  {
    id: 6,
    name: "Mercy Wambui",
    designation: "Content Creator",
    company: "Mercy Visuals",
    testimonial:
      "I love how easy it is to create professional visuals for my online store and social media. Truly a lifesaver!",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
  },
];


const Testimonials = () => (
  <div id="testimonials" className="flex justify-center items-center py-20">
    <div className="h-full w-full">
      <h2 className="mb-12 text-4xl md:text-5xl font-bold text-center tracking-tight px-6">
        Testimonials
      </h2>
      <div className="relative">
        <div className="z-10 absolute left-0 inset-y-0 w-[15%] bg-gradient-to-r from-background to-transparent" />
        <div className="z-10 absolute right-0 inset-y-0 w-[15%] bg-gradient-to-l from-background to-transparent" />
        <Marquee pauseOnHover className="[--duration:20s]">
          <TestimonialList />
        </Marquee>
        <Marquee pauseOnHover reverse className="mt-0 [--duration:20s]">
          <TestimonialList />
        </Marquee>
      </div>
    </div>
  </div>
);

const TestimonialList = () =>
  testimonials.map((testimonial) => (
    <div
      key={testimonial.id}
      className="min-w-96 max-w-sm bg-accent rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.designation}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="#" target="_blank">
            <TwitterLogo className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <p className="mt-5 text-[17px]">{testimonial.testimonial}</p>
    </div>
  ));

const TwitterLogo = (props: ComponentProps<"svg">) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>X</title>
    <path
      fill="currentColor"
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
    />
  </svg>
);

export default Testimonials;
