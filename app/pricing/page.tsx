import Navbar from "@/components/navbar"
import { PricingHeader } from "@/components/pricing-header"
import { PricingCards } from "@/components/pricing-cards"
import { PricingFAQ } from "@/components/pricing-faq"
import { SparklesCore } from "@/components/sparkles"
import { FloatingPaper } from "@/components/floating-paper"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden pt-20">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#00EDBE"
        />
      </div>

      {/* Floating papers in background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={8} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <PricingHeader />
          <PricingCards />
          <PricingFAQ />
        </div>
      </div>
    </main>
  )
}

