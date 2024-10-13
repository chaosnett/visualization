/* eslint-disable */

import { Header } from "@/components/Header";
import Graph from "@/components/Graph";

export default function Home() {
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
    </div>
  );
}
