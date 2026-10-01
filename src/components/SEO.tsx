import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
}

export function SEO({
  title = "Alpha Investment Management | SEBI Registered Investment Adviser (INA000017348) Pune",
  description = "Pure fee-only fiduciary wealth management and financial advisory based in Chakan, Pune. Comprehensive portfolio management, tax planning, and goal allocation with 0% distributor kickbacks.",
  canonicalUrl,
  ogImage = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85",
  ogType = "website",
}: SeoProps) {
  let pathname = "/";
  try {
    const loc = useLocation();
    pathname = loc.pathname;
  } catch {
    if (typeof window !== "undefined") {
      pathname = window.location.pathname;
    }
  }

  const currentUrl = canonicalUrl || `https://alphaaim.in${pathname}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", description);

    // 3. OpenGraph Tags
    const ogTags: Record<string, string> = {
      "og:title": title,
      "og:description": description,
      "og:url": currentUrl,
      "og:image": ogImage,
      "og:type": ogType,
      "og:site_name": "Alpha Investment Management",
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": ogImage,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(property.startsWith("twitter:") ? "name" : "property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 4. LocalBusiness + FinancialService Structured Data (JSON-LD)
    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["FinancialService", "LocalBusiness"],
          "@id": "https://alphaaim.in/#organization",
          "name": "Alpha Investment Management",
          "legalName": "Alpha Investment Management Services",
          "url": "https://alphaaim.in",
          "logo": "https://alphaaim.in/logo.png",
          "image": ogImage,
          "telephone": "+919607509586",
          "email": "info@alphaaim.in",
          "priceRange": "₹₹₹",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Shop no 2, First Floor, Mahalungeker Complex, Chakan-Talegaon Highway, Mahalunge Ingale Kaman",
            "addressLocality": "Chakan, Pune",
            "addressRegion": "Maharashtra",
            "postalCode": "410501",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 18.7599,
            "longitude": 73.8340
          },
          "areaServed": [
            { "@type": "City", "name": "Pune" },
            { "@type": "City", "name": "Chakan" },
            { "@type": "City", "name": "Pimpri-Chinchwad" },
            { "@type": "City", "name": "Mumbai" },
            { "@type": "Country", "name": "India" }
          ],
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday"],
              "opens": "10:00",
              "closes": "14:00"
            }
          ],
          "sameAs": [
            "https://x.com/alphaaim_in",
            "https://www.facebook.com/shalini.malhotra.50767984/",
            "https://www.instagram.com/alphainvestmentmanagement",
            "https://medium.com/@mcp"
          ],
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "name": "SEBI Registered Investment Adviser",
              "credentialCategory": "Regulatory License",
              "recognizedBy": {
                "@type": "GovernmentOrganization",
                "name": "Securities and Exchange Board of India (SEBI)"
              },
              "identifier": "INA000017348"
            }
          ]
        }
      ]
    };

    let script = document.getElementById("local-business-jsonld") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "local-business-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(jsonLdData);
  }, [title, description, currentUrl, ogImage, ogType]);

  return null;
}
