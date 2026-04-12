"use client"

import { useEffect, useRef, useState } from "react"

import CTASection from './cta-section';
import DocumentationSection from "./documentation-section"
import FAQSection from "./faq-section"
import FooterSection from "./footer-section"
import { LandingBentoGridSection } from "./landing-bento-grid-section"
import { LandingFeatureSelector } from "./landing-feature-selector"
import { LandingFrame } from "./landing-frame"
import { LandingHeroSection } from "./landing-hero-section"
import { LandingNavigation } from "./landing-navigation"
import { LandingSocialProofSection } from "./landing-social-proof-section"
import PricingSection from "./pricing-section"
import TestimonialsSection from "./testimonials-section"

export function LandingPage() {
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return

      setProgress((previousProgress) => {
        if (previousProgress >= 100) {
          if (mountedRef.current) {
            setActiveCard((currentCard) => (currentCard + 1) % 3)
          }

          return 0
        }

        return previousProgress + 2
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return

    setActiveCard(index)
    setProgress(0)
  }

  return (
    <LandingFrame>
      <LandingNavigation />

      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
        <LandingHeroSection activeCard={activeCard} />
        <LandingFeatureSelector
          activeCard={activeCard}
          progress={progress}
          onCardClick={handleCardClick}
        />
        {/* <LandingSocialProofSection /> */}
        <LandingBentoGridSection />
        <DocumentationSection />
        {/* <TestimonialsSection /> */}
        {/* <PricingSection /> */}
        {/* <FAQSection /> */}
        <CTASection />
        {/* <FooterSection /> */}
      </div>
    </LandingFrame>
  )
}
