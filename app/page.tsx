import { Header } from "@/components/Header";
import Graph from "@/components/Graph";

export default function Home() {
  return (
    <div className="h-screen bg-secondary font-array tracking-wider text-primary">
      <Header className="absolute right-10 top-10 z-10" title="chaosnet." />
      {/* <Header className="absolute right-10 top-32 z-10" title="Chaos." /> */}
      <main className="flex h-full w-full">
        <Graph />
      </main>
      <a
        href="/devlog"
        target="_blank"
        className="absolute right-20 top-36 z-10 cursor-pointer text-xl text-purple-600 transition-all duration-300 hover:scale-110 hover:opacity-80"
      >
        Check out our DevLogs!
      </a>
    </div>
  );
}
