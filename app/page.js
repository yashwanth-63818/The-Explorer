import Hero from "@/components/Hero";
import DestinationStrip from "@/components/DestinationStrip";
import DiscoverWorld from "@/components/DiscoverWorld";
import FeaturedPosts from "@/components/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen">
      <Hero
        headline="Your Journey Starts Here"
        description="In-depth travel guides, destination stories, cinematic videos, and smart planning tools — everything you need to explore the world with confidence."
      />
      <DestinationStrip />
      <DiscoverWorld />
      <FeaturedPosts />
      <LatestPosts />
      <Newsletter />
    </main>
  );
}
