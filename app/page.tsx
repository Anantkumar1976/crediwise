import { HeroSlider } from "@/components/landing/hero-slider";
import { HomeContent, SiteFooter } from "@/components/landing/home-content";
import { SiteHeader } from "@/components/landing/site-header";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";

export default async function Home() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <main>
        <HeroSlider />
        <HomeContent t={t} />
      </main>
      <SiteFooter t={t} />
    </div>
  );
}
