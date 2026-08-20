"use client";

import React, { useState } from "react";
import { Upload, Cpu, Smile, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faceShapes = [
  {
    name: "Oval",
    description: "Balanced proportions with a slightly curved chin. Most frame shapes complement this versatile structure.",
    recommended: "Rectangular, Geometric, Square, Aviator",
    shapesLink: "/shop?shape=Rectangle"
  },
  {
    name: "Round",
    description: "Equal width and length with soft curves. Angular frames help add structure and definition.",
    recommended: "Square, Rectangular, Geometric",
    shapesLink: "/shop?shape=Rectangle"
  },
  {
    name: "Square",
    description: "Strong jawline and broad forehead. Rounded or curved frames soften strong lines.",
    recommended: "Round, Oval, Cat-Eye",
    shapesLink: "/shop?shape=Round"
  },
  {
    name: "Heart",
    description: "Broad forehead tapering to a pointed chin. Bottom-heavy frames balance proportions.",
    recommended: "Oval, Round, Cat-Eye, Aviator",
    shapesLink: "/shop?shape=Oval"
  },
  {
    name: "Diamond",
    description: "Narrow forehead and jaw with dramatic cheekbones. Top-heavy or rimless frames highlight features.",
    recommended: "Oval, Round, Cat-Eye",
    shapesLink: "/shop?shape=Round"
  }
];

export default function FaceShapeFinder() {
  const [step, setStep] = useState<"idle" | "uploading" | "analyzing" | "result">("idle");
  const [detectedShape, setDetectedShape] = useState<typeof faceShapes[0] | null>(null);

  const startAnalysis = () => {
    setStep("uploading");
    setTimeout(() => {
      setStep("analyzing");
      setTimeout(() => {
        // Randomly pick a face shape for simulation
        const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
        setDetectedShape(randomShape);
        setStep("result");
      }, 2000);
    }, 1500);
  };

  const reset = () => {
    setStep("idle");
    setDetectedShape(null);
  };

  return (
    <section className="py-20 bg-beige-50/50 border-y border-beige-100 hidden">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Information & Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-sm font-semibold uppercase -widest text-charcoal/60 block mb-2">
                Face Shape Guide
              </span>
              <h2 className=" text-3xl md:text-4xl text-charcoal font-medium uppercase leading-tight">
                Find Frames That <br />Fit You.
              </h2>
            </div>
            <p className="text-sm font-light text-charcoal/60 leading-relaxed">
              Upload a front-facing selfie or let our virtual assistant scan your features to identify your facial structure. We&rsquo;ll recommend the precise silhouettes to balance and highlight your natural aesthetics.
            </p>

            {/* Stepper progress indicator */}
            <div className="hidden sm:grid grid-cols-4 gap-2 pt-4">
              {[
                { label: "Upload", icon: Upload, active: step === "uploading" },
                { label: "Analyze", icon: Cpu, active: step === "analyzing" },
                { label: "Face Shape", icon: Smile, active: step === "result" },
                { label: "Recommended", icon: CheckCircle, active: step === "result" }
              ].map((s, idx) => (
                <div key={idx} className="text-center">
                  <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    s.active 
                      ? "bg-charcoal border-charcoal text-white" 
                      : "bg-white border-beige-200 text-charcoal/40"
                  }`}>
                    <s.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold uppercase -wider text-charcoal/50 mt-1 block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              {step === "idle" && (
                <button
                  onClick={startAnalysis}
                  className="px-8 py-3.5 bg-charcoal hover:bg-charcoal/90 text-white text-sm font-semibold uppercase -widest flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>Find My Frames</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === "result" && (
                <button
                  onClick={reset}
                  className="px-6 py-2.5 border border-charcoal/20 hover:border-charcoal text-charcoal text-sm font-semibold uppercase -widest transition-all bg-white"
                >
                  Analyze Again
                </button>
              )}
            </div>
          </div>

          {/* Interactive Screen Preview */}
          <div className="lg:col-span-7 bg-white border border-beige-100 shadow-2xl p-6 sm:p-8 aspect-16/10 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait">
              {step === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-beige-50 border border-beige-100 flex items-center justify-center mx-auto text-charcoal/50">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Upload a photo to preview</p>
                    <p className="text-sm text-charcoal/40 mt-1">Supports JPG, PNG (maximum 5MB)</p>
                  </div>
                  <button
                    onClick={startAnalysis}
                    className="mx-auto border border-beige-200 hover:border-charcoal/30 px-5 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors bg-beige-50/50"
                  >
                    Upload Photo
                  </button>
                </motion.div>
              )}

              {step === "uploading" && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-beige-200 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-charcoal animate-spin" />
                    <Upload className="w-5 h-5 text-charcoal animate-bounce" />
                  </div>
                  <p className="text-sm font-medium text-charcoal">Uploading selfie image...</p>
                </motion.div>
              )}

              {step === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border border-dashed border-charcoal/30 animate-spin" />
                    <Smile className="w-8 h-8 text-charcoal absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">Scanning facial geometry...</p>
                    <p className="text-sm text-charcoal/40 mt-1">Facial mapping to balance cheekbones, chin, and temples</p>
                  </div>
                </motion.div>
              )}

              {step === "result" && detectedShape && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 border-b border-beige-100 pb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-base font-bold text-charcoal uppercase -wider">
                      Analysis Completed
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm text-charcoal/40 uppercase font-bold -widest">
                        Detected Shape
                      </span>
                      <h4 className="text-2xl  font-semibold text-charcoal mt-1">
                        {detectedShape.name} Shape
                      </h4>
                      <p className="text-sm text-charcoal/60 mt-2 font-light leading-relaxed">
                        {detectedShape.description}
                      </p>
                    </div>

                    <div className="bg-beige-50/50 p-4 border border-beige-100 flex flex-col justify-between">
                      <div>
                        <span className="text-sm text-charcoal/40 uppercase font-bold -widest">
                          Ideal Frame Silhouette
                        </span>
                        <p className="text-sm font-semibold text-charcoal mt-1">
                          {detectedShape.recommended}
                        </p>
                      </div>
                      <Link
                        href={detectedShape.shapesLink}
                        className="text-sm font-bold uppercase -widest text-charcoal flex items-center gap-1 hover:opacity-75 transition-opacity pt-4 mt-2"
                      >
                        <span>View recommended frames</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

