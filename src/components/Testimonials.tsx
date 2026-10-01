import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Business Executive",
    rating: 5,
    content: "I appreciate their strict fee transparency. There are no conflicts of interest—just solid, fiduciary advice aligned with our objectives.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Medical Practitioner",
    rating: 5,
    content: "They simplified complex wealth concepts and customized a tax-efficient portfolio that fits my long-term timeline.",
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Technology Professional",
    rating: 5,
    content: "Transparent guidance and disciplined planning gave me far more confidence in my family's financial future.",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Entrepreneur",
    rating: 5,
    content: "Their risk-aware models helped preserve our business treasury assets while capturing disciplined, compound growth.",
  },
  {
    id: 5,
    name: "Meera Joshi",
    role: "Senior Consultant",
    rating: 5,
    content: "Through market cycles, their advisory team has been a calm, anchoring presence keeping my investments aligned.",
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay implementation with pause on hover
  useEffect(() => {
    if (!emblaApi) return;

    let intervalId: NodeJS.Timeout;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 5000);
    };

    const stopAutoplay = () => {
      if (intervalId) clearInterval(intervalId);
    };

    startAutoplay();

    const emblaNode = emblaApi.containerNode();
    emblaNode.addEventListener("mouseenter", stopAutoplay);
    emblaNode.addEventListener("mouseleave", startAutoplay);

    return () => {
      stopAutoplay();
      emblaNode.removeEventListener("mouseenter", stopAutoplay);
      emblaNode.removeEventListener("mouseleave", startAutoplay);
    };
  }, [emblaApi]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section className="py-28 relative overflow-hidden bg-gradient-to-b from-secondary/15 to-transparent border-b border-border/10">
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20 z-0"
        style={{
          background: "radial-gradient(circle, rgba(218, 165, 32, 0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="text-primary font-semibold text-xs tracking-wider uppercase">Client Reviews</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Trusted Financial Guidance, <br className="hidden md:inline" />
            <span className="gold-text">Backed by Real Relationships</span>
          </h2>
          <div className="h-[2px] w-16 bg-primary/40 mx-auto" />
          <p className="text-muted-foreground/90 text-sm md:text-base leading-relaxed font-light max-w-2xl mx-auto">
            Real experiences from individuals and families who trust Alpha Investment Management for long-term financial guidance and disciplined wealth growth.
          </p>
        </motion.div>

        {/* Carousel Wrapper */}
        <div className="relative max-w-5xl mx-auto px-4">
          
          {/* Embla Viewport */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-6 items-stretch">
              {testimonials.map((testimonial, index) => {
                const isActive = selectedIndex === index;
                return (
                  <div
                    key={testimonial.id}
                    className="pl-6 min-w-0 flex-[0_0_88%] md:flex-[0_0_60%] lg:flex-[0_0_45%] transition-all duration-500 ease-out py-4"
                  >
                    <div
                      className={`relative glass-card rounded-2xl p-6 md:p-8 border transition-all duration-500 h-full flex flex-col justify-between shadow-sm ${
                        isActive
                          ? "border-primary/30 bg-gradient-to-b from-slate-900/35 via-slate-950/20 to-slate-950/10 shadow-lg shadow-primary/[0.02] scale-[1.01] opacity-100"
                          : "border-border/20 bg-slate-950/15 opacity-40 scale-[0.98] pointer-events-none md:pointer-events-auto"
                      }`}
                    >
                      {/* Quote Watermark Icon */}
                      <Quote className="absolute bottom-6 right-6 h-12 w-12 text-primary/[0.04] pointer-events-none" />

                      <div className="space-y-4">
                        {/* Rating Stars */}
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                          ))}
                        </div>

                        {/* Testimonial Review */}
                        <p className="text-sm md:text-base leading-relaxed text-foreground/90 font-light italic">
                          "{testimonial.content}"
                        </p>
                      </div>

                      {/* Client Identity details */}
                      <div className="flex items-center gap-4 mt-8 pt-4 border-t border-border/10">
                        {/* Circle avatar frame */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm">
                          {getInitials(testimonial.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm md:text-base text-foreground leading-tight">
                            {testimonial.name}
                          </h4>
                          <p className="text-xs text-muted-foreground/80 mt-1 font-light">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Navigation and Pagination Indicators */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center hover:border-primary/45 hover:text-primary transition-all duration-300 text-muted-foreground/90 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedIndex === index ? "w-6 bg-primary" : "w-1.5 bg-border/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center hover:border-primary/45 hover:text-primary transition-all duration-300 text-muted-foreground/90 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
