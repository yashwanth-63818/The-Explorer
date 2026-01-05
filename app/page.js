import Hero from "@/components/Hero";
import FeaturedPosts from "@/components/FeaturedPosts";
import LatestPosts from "@/components/LatestPosts";
import Destinations from "@/components/Destinations";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Destinations />
      <FeaturedPosts />
      <LatestPosts />
      <Newsletter />
    </>
  );
}
