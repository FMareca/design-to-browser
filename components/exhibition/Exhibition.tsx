"use client";

import { useEffect, useRef, useState } from "react";
import BrowserChrome from "./BrowserChrome";
import CursorCrosshair from "./CursorCrosshair";
import GridOverlay from "./GridOverlay";
import HeroSection from "./HeroSection";
import HtmlSection from "./HtmlSection";
import CssSection from "./CssSection";
import JavaScriptSection from "./JavaScriptSection";
import ReactSection from "./ReactSection";
import ResponsiveSection from "./ResponsiveSection";
import InteractionSection from "./InteractionSection";
import BrowserSection from "./BrowserSection";
import PerformanceFooter from "./PerformanceFooter";
import JourneySection from "./JourneySection";
import MotionSection from "./MotionSection";
import VelocityMarquee from "./VelocityMarquee";
import PlaygroundSection from "./PlaygroundSection";
import RoadmapSection from "./RoadmapSection";

const STAGES = [
  "design",
  "html",
  "css",
  "javascript",
  "react",
  "responsive",
  "interaction",
  "motion",
  "browser",
];

const MARQUEE_TOP = ["HTML", "CSS", "JAVASCRIPT", "TYPESCRIPT", "REACT", "NEXT.JS"];
const MARQUEE_BOTTOM = ["CRIE", "ANIME", "INTERAJA", "EXPERIMENTE", "PUBLIQUE"];

export default function Exhibition() {
  const [activeStage, setActiveStage] = useState("design");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [gridVisible, setGridVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // scroll progress for the chrome bar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll spy — track which stage is centered
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveStage(entry.target.id);
        });
      },
      // a thin band at mid-screen: whichever section crosses it is active,
      // no matter how tall the section is
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    [...STAGES, "playground", "roadmap"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[var(--lab-white)] pt-11">
      <BrowserChrome
        activeStage={activeStage}
        scrollProgress={scrollProgress}
        gridVisible={gridVisible}
        onToggleGrid={() => setGridVisible((v) => !v)}
      />
      <GridOverlay visible={gridVisible} />
      <CursorCrosshair />

      <main>
        <HeroSection />
        <JourneySection />
        <HtmlSection />
        <CssSection />
        <JavaScriptSection />
        <VelocityMarquee items={MARQUEE_TOP} />
        <ReactSection />
        <ResponsiveSection />
        <InteractionSection />
        <MotionSection />
        <VelocityMarquee items={MARQUEE_BOTTOM} reverse />
        <PlaygroundSection />
        <BrowserSection />
        <RoadmapSection />
      </main>

      <PerformanceFooter />
    </div>
  );
}