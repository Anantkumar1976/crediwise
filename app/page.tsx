import { HeroSlider } from "@/components/landing/hero-slider";
import { HomeContent, SiteFooter } from "@/components/landing/home-content";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <main>
        <HeroSlider />
        <HomeContent />
      </main>
      <SiteFooter />
    </div>
  );
}
