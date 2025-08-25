import Hero from "@/components/homePage/Hero";
import InfoCards from "@/components/homePage/InfoCards";
import PopularEvents from "@/components/homePage/PopularEvents";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <PopularEvents />
      <InfoCards />
    </main>
  );
}
