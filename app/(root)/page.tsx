import CTABanner from "@/components/shared/landing-page/cta-banner";
import FAQ from "@/components/shared/landing-page/faq";
import Features from "@/components/shared/landing-page/features";
import Footer from "@/components/shared/landing-page/footer";
import Hero from "@/components/shared/landing-page/hero";
import { Navbar } from "@/components/navbar";
import Pricing from "@/components/shared/landing-page/pricing";
import Testimonials from "@/components/shared/landing-page/testimonials";
import HowItWorks from "@/components/shared/landing-page/hot-it-works";
import UseCases from "@/components/shared/landing-page/usecases";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24">
        <Hero />
        <Features />
        <HowItWorks/>
        <UseCases/>
        <Pricing />
        <FAQ />
        <Testimonials />
        <CTABanner />
        <Footer />
      </main>
    </>
  );
}
