import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: "💪",
      title: "Welcome to Your Protein Tracker",
      description: "Track your daily protein intake while on GLP-1 medications to preserve muscle mass and feel your best.",
      highlight: "Built by a Registered Dietitian"
    },
    {
      icon: "📊",
      title: "Animated Progress Ring",
      description: "Watch your daily protein goal come to life with our beautiful circular progress indicator. Colors change based on your streak!",
      highlight: "Teal → Purple (7 days) → Gold (30 days)"
    },
    {
      icon: "🎊",
      title: "Celebrate Your Wins",
      description: "Hit your daily protein goal and enjoy confetti celebrations with haptic feedback. Small wins, big motivation!",
      highlight: "You've got this!"
    },
    {
      icon: "⚡",
      title: "Quick Add Button",
      description: "Use the floating action button (bottom-right) to quickly scroll to food options. Tap any food to instantly log protein.",
      highlight: "390+ common protein sources"
    },
    {
      icon: "🔥",
      title: "Build Your Streak",
      description: "Hit your minimum protein target daily to build streaks, unlock achievements, and level up your theme colors.",
      highlight: "Consistency is key!"
    },
    {
      icon: "🚀",
      title: "You're All Set!",
      description: "We'll guide you through setting up your profile. Your personalized protein targets are calculated using clinical ABW formulas.",
      highlight: "Let's get started!"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50">
      {/* Glass card container */}
      <div className="glass-card max-w-md w-full p-8 relative">
        {/* Skip button */}
        {currentStep < steps.length - 1 && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip
          </button>
        )}

        {/* Animated step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-6"
            >
              {steps[currentStep].icon}
            </motion.div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {steps[currentStep].title}
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 mb-4 leading-relaxed">
              {steps[currentStep].description}
            </p>

            {/* Highlight badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-500 text-white font-semibold text-sm mb-8">
              {steps[currentStep].highlight}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-gradient-to-r from-teal-400 to-green-500"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Next/Get Started button */}
        <motion.button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-green-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          whileTap={{ scale: 0.98 }}
        >
          {currentStep < steps.length - 1 ? "Next" : "Get Started"}
        </motion.button>

        {/* Step counter */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
