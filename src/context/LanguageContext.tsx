import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "en" | "hi" | "mr";

interface Translations {
  navHome: string;
  navAbout: string;
  navServices: string;
  navCalculators: string;
  navRiskProfile: string;
  navInsights: string;
  navDownloads: string;
  navContact: string;
  clientLogin: string;
  bookConsultation: string;
  sebiTagline: string;
  feeOnlyMandate: string;
  allRightsReserved: string;
}

const DICTIONARIES: Record<Locale, Translations> = {
  en: {
    navHome: "Home",
    navAbout: "About",
    navServices: "Services",
    navCalculators: "Calculators",
    navRiskProfile: "Risk Profile",
    navInsights: "Insights",
    navDownloads: "Downloads",
    navContact: "Contact",
    clientLogin: "Client Login",
    bookConsultation: "Book a Consultation",
    sebiTagline: "SEBI Registered Investment Adviser · INA000017348",
    feeOnlyMandate: "Pure Fee-Only · 0% Commissions",
    allRightsReserved: "All rights reserved.",
  },
  hi: {
    navHome: "होम",
    navAbout: "परिचय",
    navServices: "सेवाएं",
    navCalculators: "कैलकुलेटर",
    navRiskProfile: "जोखिम प्रोफाइल",
    navInsights: "दृष्टिकोण",
    navDownloads: "फॉर्म व डाउनलोड",
    navContact: "संपर्क करें",
    clientLogin: "क्लाइंट लॉगिन",
    bookConsultation: "परामर्श बुक करें",
    sebiTagline: "सेबी पंजीकृत निवेश सलाहकार · INA000017348",
    feeOnlyMandate: "विशुद्ध शुल्क-आधारित · शून्य कमीशन",
    allRightsReserved: "सर्वाधिकार सुरक्षित।",
  },
  mr: {
    navHome: "मुख्यपृष्ठ",
    navAbout: "आमच्याबद्दल",
    navServices: "सेवा",
    navCalculators: "कॅल्क्युलेटर",
    navRiskProfile: "जोखीम प्रोफाइल",
    navInsights: "आर्थिक दृष्टिकोन",
    navDownloads: "फॉर्म आणि डाउनलोड",
    navContact: "संपर्क",
    clientLogin: "क्लायंट लॉगिन",
    bookConsultation: "सल्लामसलत बुक करा",
    sebiTagline: "सेबी नोंदणीकृत गुंतवणूक सल्लागार · INA000017348",
    feeOnlyMandate: "फक्त-फी सल्लागार · ०% कमिशन",
    allRightsReserved: "सर्व हक्क राखीव.",
  },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => DICTIONARIES.en[key] || "",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("aim_user_locale") as Locale;
    if (saved && (saved === "en" || saved === "hi" || saved === "mr")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("aim_user_locale", newLocale);
  };

  const t = (key: keyof Translations): string => {
    return DICTIONARIES[locale]?.[key] || DICTIONARIES.en[key] || "";
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
