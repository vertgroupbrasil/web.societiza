import {
  FeaturesShowcase,
  FeaturesSection,
  ProblemSection,
  FeatureHighlightsSection,
  PositioningSection,
  PricingSection,
  TestimonialsSection,
  CTASection,
  FaqSection,
  Footer,
} from './_landing';
import { LandingGrid, GridSection } from './_landing/landing-grid';
import { Header } from '@societiza/components/header';
import { HeroSection } from '@societiza/components/hero3';
import { FeatureSection2 } from '@societiza/components/feature-section2';
import { AbandonMessSection } from './_landing/abandon-mess-section';

export default function Home() {
  return (
    <LandingGrid>
    <Header />
      <GridSection isHero>
        <HeroSection />
      </GridSection>
      <GridSection>
        <FeatureSection2 />
      </GridSection>
      <GridSection>
        <FeaturesShowcase />
      </GridSection>
      <GridSection>
        <ProblemSection />
      </GridSection>
      <GridSection>
        <AbandonMessSection />
      </GridSection>
      <GridSection>
        <FeaturesSection />
      </GridSection>
      <GridSection>
        <FeatureHighlightsSection />
      </GridSection>
      <GridSection>
        <TestimonialsSection />
      </GridSection>
      <GridSection>
        <PositioningSection />
      </GridSection>
      <GridSection>
        <PricingSection />
      </GridSection>
      <section className="">
        <div className="mx-auto w-full max-w-7xl">
          <CTASection />
        </div>
      </section>
      <GridSection>
        <FaqSection />
      </GridSection>
      <Footer />
    </LandingGrid>
  );
}
