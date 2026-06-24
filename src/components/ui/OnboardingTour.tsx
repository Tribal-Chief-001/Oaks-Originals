'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, ChevronRight, ChevronLeft, X, Sparkles, Wand2 } from 'lucide-react'

interface TourStep {
  title: string
  description: string
  target?: string // Optional query selector to highlight
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Oak's Originals V5! 🎓",
    description: "Welcome, Trainer! This is Professor Oak's personal lab dashboard. Let's take a quick 4-step tour to discover the avant-garde tools available to you."
  },
  {
    title: "Cloud Synced Profile ☁️",
    description: "Use the new 'Sign In' button at the top to connect with Supabase. Save your Teams, Favorites, and Tracker progress securely in the cloud."
  },
  {
    title: "Trainer Tools Dropdown 🛠️",
    description: "Hover over 'Tools' in the control bar to open the advanced Damage Calculator, live Kanto Items Store, Type chart checker, or multi-slot Team Builder."
  },
  {
    title: "Breeding & Shiny Hunting 🧬✨",
    description: "Click the 'Breeding' heart toggle to open the unified Breeder dashboard. Match egg compatibility, check offspring, and track your shiny catch combos with interactive audio cries!"
  }
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tourShown = localStorage.getItem('pokedex_v5_tour_completed')
      if (!tourShown) {
        // Show after 1.5 seconds delay for a smooth entrance
        const timer = setTimeout(() => setIsOpen(true), 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokedex_v5_tour_completed', 'true')
    }
  }

  const resetTour = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  return (
    <>
      {/* Help button to re-trigger the tour manually */}
      <Button
        variant="ghost"
        size="icon"
        onClick={resetTour}
        className="fixed bottom-4 right-4 z-40 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg border border-blue-500 hover:scale-105 transition-transform"
        title="Start Lab Tour"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-md w-full"
            >
              <Card className="border border-white/10 bg-gray-900/90 backdrop-blur text-white shadow-2xl overflow-hidden rounded-xl">
                <CardHeader className="pb-2 border-b border-gray-800 bg-gradient-to-r from-red-950/40 to-blue-950/40 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Wand2 className="w-5 h-5 animate-pulse" />
                    <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Lab Assistant</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleComplete}
                    className="h-7 w-7 p-0 rounded-full text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent className="p-6">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                      {TOUR_STEPS[currentStep].title}
                    </CardTitle>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {TOUR_STEPS[currentStep].description}
                    </p>
                  </motion.div>

                  {/* Visual Step Indicator Dots */}
                  <div className="flex justify-center gap-1.5 mt-6">
                    {TOUR_STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentStep ? 'w-6 bg-blue-500' : 'w-2 bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-950/60 p-4 border-t border-gray-800 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="text-gray-400 hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  >
                    {currentStep === TOUR_STEPS.length - 1 ? (
                      <span className="flex items-center gap-1">Complete <Sparkles className="w-4 h-4 text-yellow-300" /></span>
                    ) : (
                      <span className="flex items-center">Next <ChevronRight className="w-4 h-4 ml-1" /></span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
