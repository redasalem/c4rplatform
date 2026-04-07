import HeroAd from "@/components/home/HeroAd";
import Departments from "@/components/home/Departments";
import Partners from "@/components/home/Partners";
import FAQ from "@/components/home/FAQ";
import ReviewMarquee from "@/components/home/ReviewMarquee";

export default function Home() {
  return (
    <main className="min-h-screen pb-24">
      <HeroAd />
      <Departments />
      <ReviewMarquee />
      {/* <Partners /> */}
      <FAQ />
    </main>
  );
}
