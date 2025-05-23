import ClientSection from "@/components/landing/client-section";
import CallToActionSection from "@/components/landing/cta-section";
import HeroSection from "@/components/landing/hero-section";
import PricingSection from "@/components/landing/pricing-section";
import Particles from "@/components/delta-mars/particles";
import { SphereMask } from "@/components/delta-mars/sphere-mask";
import Problem from "@/components/landing/problem";
import HowItWorks from "@/components/landing/how-it-works";

export default async function Page() {
  return (
    <>
      <HeroSection />
      <ClientSection />
      <SphereMask />
      <Problem />
      <HowItWorks />
      {/* <PricingSection />
       */}
      {/* <CallToActionSection /> */}
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />
    </>
  );
}
