import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaceShapeFinder from "@/components/FaceShapeFinder";
import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const shapes = [
  {
    name: "Oval",
    description: "Slightly wider cheekbones with a gentle taper to the forehead and jaw.",
    frames: "Rectangular, Geometric, Aviator, Wayfarer",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    link: "/shop?shape=Rectangle"
  },
  {
    name: "Round",
    description: "Curved lines, soft angles, and equal width/length dimensions.",
    frames: "Square, Rectangular, Hexagonal",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
    link: "/shop?shape=Square"
  },
  {
    name: "Square",
    description: "Strong chin, broad forehead, and straight cheek-to-jaw lines.",
    frames: "Round, Oval, Cat-Eye, Butterfly",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
    link: "/shop?shape=Round"
  },
  {
    name: "Heart",
    description: "Widest at the brow, gradually narrowing to a prominent chin point.",
    frames: "Aviator, Clubmaster, Oval, Rounded Square",
    img: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=400",
    link: "/shop?shape=Oval"
  },
  {
    name: "Diamond",
    description: "Highly defined high cheekbones tapering to a narrow chin and forehead.",
    frames: "Cat-Eye, Oval, Rimless, Semirimless",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400",
    link: "/shop?shape=Round"
  }
];

export default function FaceShapePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        
        {/* Banner */}
        <div className="bg-beige-50/50 py-12 border-b border-beige-100 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <span className="text-[14px] font-semibold uppercase -widest text-charcoal/60 block mb-2">
              Fit Companion
            </span>
            <h1 className=" text-3xl md:text-4xl text-charcoal font-medium uppercase">
              Shop by Face Shape
            </h1>
            <p className="text-sm text-charcoal/50 font-light mt-2">
              Discover which frames balance and complement your specific facial architecture.
            </p>
          </div>
        </div>

        {/* AI Scanner block */}
        <FaceShapeFinder />

        {/* Catalog grid */}
        <section className="py-20 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[14px] uppercase font-bold -widest text-charcoal/40">Reference</span>
            <h2 className=" text-2xl md:text-3xl text-charcoal mt-1">Our Face Shape Guide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {shapes.map((s) => (
              <div key={s.name} className="border border-beige-100 p-4 bg-white flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden bg-beige-50 border border-beige-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div>
                    <h3 className=" text-lg font-medium text-charcoal">{s.name}</h3>
                    <p className="text-[14px] text-charcoal/50 font-light mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-beige-50 text-[14px]">
                    <span className="font-bold text-charcoal/70 uppercase">Recommended:</span>
                    <p className="text-charcoal font-semibold mt-0.5">{s.frames}</p>
                  </div>
                </div>

                <Link
                  href={s.link}
                  className="mt-6 pt-4 border-t border-beige-100 text-[14px] uppercase font-bold -widest text-charcoal hover:opacity-75 transition-opacity flex items-center justify-between"
                >
                  <span>View Frames</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
      <SearchModal />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}

