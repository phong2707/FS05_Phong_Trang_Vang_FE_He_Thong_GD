import { Header } from '@/components/Header.tsx';
import { Footer } from '@/components/Footer.tsx';
import { HeroSection } from '@/components/HeroSection.tsx';
import { FeaturedCourses } from '@/components/FeaturedCourses.tsx';
import { AboutUsSection } from '@/components/AboutUsSection.tsx';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturedCourses />
        <AboutUsSection />
      </main>

      <Footer />
    </div>
  );
}
