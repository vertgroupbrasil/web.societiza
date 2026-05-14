"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@societiza/components/header"

import CTASection from './cta-section';
import DocumentationSection from "./documentation-section"
import FooterSection from "./footer-section"
import { LandingBentoGridSection } from "./landing-bento-grid-section"
import { landingHeroCards } from "./landing-hero-cards"
import { LandingFeatureSelector } from "./landing-feature-selector"
import { LandingFrame } from "./landing-frame"
import { LandingHeroSection } from "./landing-hero-section"


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
    <>
      <Header />

      <LandingFrame>
        <div className="pb-8 pt-10 sm:pb-12 sm:pt-14 md:pb-16 md:pt-16 lg:pt-[160px] flex w-full flex-col items-center justify-start px-0 sm:px-4 md:px-8 lg:px-0">
          <LandingHeroSection activeCard={activeCard} cards={landingHeroCards} />
          <LandingFeatureSelector
            activeCard={activeCard}
            cards={landingHeroCards}
            progress={progress}
            onCardClick={handleCardClick}
          />
          <LandingBentoGridSection />
          <DocumentationSection />
          <CTASection />
          <FooterSection />
        </div>
      </LandingFrame>
    </>
  )
}
