import CardFlow from "./ui/cardflow";
import Navigation from "./ui/navigation";

export default function Home() {
  return (
    <div className="flex flex-col sm:flex-row">
      <Navigation />
      <main>
        <CardFlow />
      </main>
    </div>
  );
}
