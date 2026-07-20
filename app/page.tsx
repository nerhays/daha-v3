import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import LatestProject from "@/components/sections/LatestProject";
import Clients from "@/components/sections/Clients";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <LatestProject />
      <Clients />
      <CTA />
    </>
  );
}
