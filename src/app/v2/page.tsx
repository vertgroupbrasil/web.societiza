import {
  Header,
  HeroSection,
  StatsBar,
  HowItWorks,
  FeaturesShowcase,
  ProblemSection,
  TransformSection,
  DifferentialsSection,
  HighlightsSection,
  TestimonialsSection,
  PositioningSection,
  PricingSection,
  CTASection,
  FaqSection,
  Footer,
} from './_sections';

export const metadata = {
  title: 'Societiza - Operação Societária no Piloto Automático',
  description:
    'Centralize abertura, alteração e encerramento de empresas em um workflow visual. Elimine retrabalho, ganhe previsibilidade e escale sua operação societária.',
};

export default function LandingV2() {
  return (
    <div className="relative bg-background overflow-x-hidden">
      <Header />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturesShowcase />
      <ProblemSection />
      <TransformSection />
      <DifferentialsSection />
      <HighlightsSection />
      <TestimonialsSection />
      <PositioningSection />
      <PricingSection />
      <CTASection />
      <FaqSection />
      <Footer />
    </div>
  );
}
