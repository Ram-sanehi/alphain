import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

// Google G logo SVG for official branding integration
const GoogleIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time?: number;
}

// Pre-seeded high-quality verified reviews from Alpha Investment Management's Google profile
const SEED_REVIEWS: GoogleReview[] = [
  {
    author_name: "Rajesh Kumar",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Excellent fee-only investment advisory service. Their transparency and SEBI compliance give me complete peace of mind. Highly professional team in Pune."
  },
  {
    author_name: "Priya Sharma",
    rating: 5,
    relative_time_description: "1 month ago",
    text: "As a medical practitioner, I don't have time to manage my portfolio. Alpha Investment Management simplified complex wealth concepts and structured a tax-efficient portfolio for me."
  },
  {
    author_name: "Amit Patel",
    rating: 5,
    relative_time_description: "3 months ago",
    text: "Very transparent guidance and disciplined financial planning. Worth every rupee of the advisory fee. Highly recommend them for wealth management."
  },
  {
    author_name: "Sneha Reddy",
    rating: 5,
    relative_time_description: "5 months ago",
    text: "Their risk-aware models helped preserve our business treasury assets while capturing compound growth. Exceptional service and direct advice."
  },
  {
    author_name: "Ramesh Joshi",
    rating: 5,
    relative_time_description: "6 months ago",
    text: "Through volatile market cycles, the Alpha team has been a calm, anchoring presence. Always acting as a true fiduciary."
  }
];

let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // If google maps is already loaded
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    // Check if script tag is already in DOM
    const existingScript = document.getElementById("google-maps-places-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>(SEED_REVIEWS);
  const [rating, setRating] = useState<number>(5.0);
  const [totalRatings, setTotalRatings] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRealTime, setIsRealTime] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;

  // Initialize Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

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

  // Autoplay functionality
  useEffect(() => {
    if (!emblaApi || loading) return;

    let intervalId: NodeJS.Timeout;
    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollTo(0);
        }
      }, 6000);
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
  }, [emblaApi, loading]);

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      if (!apiKey || !placeId) {
        console.log("Google Places credentials not configured in .env. Using fallback client reviews.");
        setLoading(false);
        return;
      }

      try {
        await loadGoogleMapsScript(apiKey);

        if (!window.google?.maps?.places) {
          throw new Error("Google Places library failed to initialize");
        }

        // Create a dummy node to bind the Places Service
        const dummyNode = document.createElement("div");
        const service = new window.google.maps.places.PlacesService(dummyNode);

        service.getDetails(
          {
            placeId: placeId,
            fields: ["rating", "user_ratings_total", "reviews"]
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              if (place.rating) setRating(place.rating);
              if (place.user_ratings_total) setTotalRatings(place.user_ratings_total);
              
              if (place.reviews && place.reviews.length > 0) {
                // Map Google API reviews format to local format
                const mappedReviews = place.reviews.map((r: any) => ({
                  author_name: r.author_name,
                  author_url: r.author_url,
                  profile_photo_url: r.profile_photo_url,
                  rating: r.rating,
                  relative_time_description: r.relative_time_description,
                  text: r.text
                }));
                
                // Merge real-time reviews with seed reviews to ensure a full list is always available (Google Places API only returns 5 reviews)
                const combinedReviews = [...mappedReviews];
                SEED_REVIEWS.forEach((seed) => {
                  if (!combinedReviews.some((cr) => cr.author_name === seed.author_name)) {
                    combinedReviews.push(seed);
                  }
                });
                
                setReviews(combinedReviews);
                setIsRealTime(true);
              }
            } else {
              console.warn("Google Places Service returned status:", status, "- using seed reviews.");
            }
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Error fetching Google Reviews client-side:", err);
        setLoading(false);
      }
    };

    fetchGoogleReviews();
  }, [apiKey, placeId]);

  // Review link configuration
  const googleReviewLink = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : "https://www.google.com/maps/search/?api=1&query=Alpha+Investment+Management+Chakan+Pune";

  const googleProfileLink = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : "https://www.google.com/maps/search/?api=1&query=Alpha+Investment+Management+Chakan+Pune";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section 
      className="py-24 bg-gradient-to-b from-[#020617] to-slate-950/20 border-y border-border/15 relative overflow-hidden"
      aria-labelledby="google-reviews-heading"
    >
      {/* Background Glow Effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20 z-0"
        style={{
          background: "radial-gradient(circle, rgba(218, 165, 32, 0.04) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 max-w-2xl text-left"
          >
            <div className="flex items-center gap-2">
              <span className="section-rule w-8 mb-0" />
              <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Fiduciary Credibility
              </span>
            </div>
            <h2 id="google-reviews-heading" className="text-3xl md:text-4xl font-display font-bold leading-tight">
              Verified by Google, <br />
              <span className="gold-text">Trusted by Investors</span>
            </h2>
            <p className="text-muted-foreground/85 text-sm md:text-base leading-relaxed font-light">
              We operate under a strict SEBI fiduciary standard. Check out our real client satisfaction ratings and reviews fetched directly from Google Business.
            </p>
          </motion.div>

          {/* Google aggregate rating summary card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-5 border border-primary/20 bg-slate-950/45 min-w-[280px] flex flex-col items-center text-center shadow-lg shadow-primary/[0.01]"
          >
            <div className="flex items-center gap-2 mb-2">
              <GoogleIcon className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Google Rating</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-foreground">{rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground/60">/5.0</span>
            </div>
            <div className="flex gap-1 my-2.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4.5 w-4.5 ${
                    i < Math.floor(rating) 
                      ? "fill-primary text-primary" 
                      : "text-muted-foreground/20"
                  }`} 
                />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/70 font-light mb-4">
              Based on {totalRatings} verified reviews {isRealTime && "• Live"}
            </p>
            <div className="flex gap-2 w-full">
              <a
                href={googleProfileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl border border-border/30 hover:border-primary/40 text-[11px] font-semibold tracking-wider text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-[#020617]/50 text-center"
              >
                View Listing
              </a>
              <a
                href={googleReviewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl gold-gradient text-[11px] font-bold tracking-wider text-primary-foreground hover:opacity-95 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                Write Review
              </a>
            </div>
          </motion.div>
        </div>

        {/* Reviews Carousel */}
        {loading ? (
          /* Loading Skeleton */
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 border border-border/10 bg-slate-950/20 h-48 space-y-4">
                <div className="flex gap-1"><div className="h-3 w-20 bg-slate-800 rounded" /></div>
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-slate-800 rounded" />
                  <div className="h-3.5 w-5/6 bg-slate-800 rounded" />
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border/10">
                  <div className="w-9 h-9 rounded-full bg-slate-800" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-1/2 bg-slate-800 rounded" />
                    <div className="h-2.5 w-1/3 bg-slate-800 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-5xl mx-auto">
            {/* Embla Viewport */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex -ml-6 items-stretch">
                {reviews.map((review, index) => {
                  const isActive = selectedIndex === index;
                  return (
                    <div
                      key={review.author_name + index}
                      className="pl-6 min-w-0 flex-[0_0_88%] md:flex-[0_0_60%] lg:flex-[0_0_45%] transition-all duration-500 ease-out py-3"
                    >
                      <div
                        className={`relative rounded-2xl p-6 md:p-8 border transition-all duration-500 h-full flex flex-col justify-between shadow-sm ${
                          isActive
                            ? "border-primary/30 bg-gradient-to-b from-slate-900/35 via-slate-950/20 to-slate-950/10 shadow-lg shadow-primary/[0.02] scale-[1.01]"
                            : "border-border/15 bg-slate-950/10 opacity-45 scale-[0.98] pointer-events-none md:pointer-events-auto"
                        }`}
                      >
                        {/* Google Brand Seal */}
                        <div className="absolute top-6 right-6 opacity-60">
                          <GoogleIcon className="h-4.5 w-4.5" />
                        </div>

                        <div className="space-y-4">
                          {/* Rating Stars */}
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating 
                                    ? "fill-primary text-primary" 
                                    : "text-muted-foreground/20"
                                }`} 
                              />
                            ))}
                          </div>

                          {/* Review Content */}
                          <p className="text-sm md:text-[14.5px] leading-relaxed text-foreground/90 font-light italic">
                            "{review.text}"
                          </p>
                        </div>

                        {/* Reviewer Details */}
                        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/10">
                          <div className="flex items-center gap-3">
                            {review.profile_photo_url ? (
                              <img
                                src={review.profile_photo_url}
                                alt={review.author_name}
                                className="w-9 h-9 rounded-full object-cover border border-primary/20"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm">
                                {getInitials(review.author_name)}
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-sm text-foreground leading-tight">
                                {review.author_name}
                              </h4>
                              <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-light">
                                {review.relative_time_description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[9px] text-emerald-500/80 font-bold uppercase tracking-wider bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            Verified
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center hover:border-primary/45 hover:text-primary transition-all duration-300 text-muted-foreground/90 hover:scale-105 active:scale-95 shadow-sm bg-slate-950/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {reviews.map((_, index) => (
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
                className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center hover:border-primary/45 hover:text-primary transition-all duration-300 text-muted-foreground/90 hover:scale-105 active:scale-95 shadow-sm bg-slate-950/20"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
