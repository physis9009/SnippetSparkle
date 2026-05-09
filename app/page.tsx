import CardFlow from "./ui/cardflow";
import Navigation from "./ui/navigation";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full sm:flex-row">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <CardFlow />
      </main>
    </div>
  );
}
