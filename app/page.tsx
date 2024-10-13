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
    </div>
  );
}
