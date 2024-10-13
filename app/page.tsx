"use client";
/* eslint-disable */

import { Header } from "@/components/Header";
import Graph from "@/components/Graph";
import { useState, useEffect } from "react";

export default function Home() {
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen bg-secondary font-array tracking-wider text-primary">
      <Header className="absolute right-10 top-10 z-10" title="chaosnet." />
      <main className="flex h-full w-full">
        <Graph />
      </main>

      <a
        href="/devlog"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-20 top-36 z-10 cursor-pointer text-xl text-purple-600 transition-transform duration-300 hover:scale-110 hover:opacity-80"
      >
        Check out our DevLogs!
      </a>

      <div
        className={`absolute bottom-10 right-10 flex flex-col items-start justify-center gap-1.5 rounded-xl border-2 border-black bg-white px-4 py-2 shadow-2xl transition-opacity duration-[2s] ${showInstructions ? "opacity-100" : "pointer-events-none opacity-0"} `}
      >
        <span className="pl-2 text-lg font-bold">Try it out:</span>
        <span>- Move nodes around</span>
        <span>- Click a Country Node to See Info</span>
        <span>- Start a new simulation</span>
      </div>
    </div>
  );
}
