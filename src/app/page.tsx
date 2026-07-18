import Nav from "@/components/Nav";
import CursorGlow from "@/components/CursorGlow";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Activity from "@/components/sections/Activity";
import Projects from "@/components/sections/Projects";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <div className="relative mx-auto max-w-[920px] px-7">
        <Hero />
        <About />
        <Skills />
        <Activity />
        <Projects />
        <Achievements />
        <Contact />
      </div>
      <Footer />
    </>
  );
}
