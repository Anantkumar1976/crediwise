import type { Locale } from "@/lib/i18n/config";
import {
  dashboardEn,
  dashboardHi,
  dashboardMr,
  type DashboardDictionary,
} from "@/lib/i18n/dashboard";

export type ContactMessageCode =
  | "received"
  | "invalidName"
  | "invalidPhone"
  | "invalidEmail"
  | "invalidLoan"
  | "notesTooLong"
  | "notConfigured"
  | "sendFailed";

export type HeroSlideId = "journey" | "home" | "car" | "personal";

export interface Dictionary {
  meta: {
    description: string;
  };
  language: {
    label: string;
  };
  nav: {
    about: string;
    why: string;
    how: string;
    services: string;
    contact: string;
    signIn: string;
    signUp: string;
    homeAria: string;
    primary: string;
    mobile: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    carouselLabel: string;
    previousSlide: string;
    nextSlide: string;
    chooseSlide: string;
    showSlide: string;
    liveSlide: string;
    slides: Record<
      HeroSlideId,
      {
        alt: string;
        headline: string;
        description: string;
        ctaLabel: string;
        ctaAriaLabel: string;
      }
    >;
  };
  services: {
    heading: string;
    subheading: string;
    items: {
      home: { title: string; description: string; cta: string };
      car: { title: string; description: string; cta: string };
      personal: { title: string; description: string; cta: string };
      business: { title: string; description: string; cta: string };
    };
  };
  howItWorks: {
    heading: string;
    subheading: string;
    steps: {
      compare: { title: string; text: string };
      apply: { title: string; text: string };
      track: { title: string; text: string };
      approved: { title: string; text: string };
    };
  };
  tools: {
    heading: string;
    body: string;
    cta: string;
  };
  why: {
    heading: string;
    subheading: string;
    items: {
      lenders: { title: string; text: string };
      comparison: { title: string; text: string };
      approvals: { title: string; text: string };
      guidance: { title: string; text: string };
      secure: { title: string; text: string };
    };
  };
  testimonial: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    quote: string;
    name: string;
    role: string;
    starsLabel: string;
    photoAlt: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    headingLine1: string;
    headingLine2: string;
    body: string;
    button: string;
    photoAlt: string;
  };
  contact: {
    heading: string;
    subheading: string;
    fullName: string;
    phone: string;
    email: string;
    loanType: string;
    loanTypePlaceholder: string;
    notes: string;
    submit: string;
    sending: string;
    loanOptions: {
      home: string;
      car: string;
      personal: string;
      business: string;
      unsure: string;
    };
    messages: Record<ContactMessageCode, string>;
  };
  footer: {
    copyright: string;
    about: string;
    contact: string;
    signIn: string;
  };
  auth: {
    signInSubtitle: string;
    signUpSubtitle: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    signUp: string;
    creating: string;
    noAccount: string;
    hasAccount: string;
    continueToSignIn: string;
    missingConfig: string;
    missingConfigBanner: string;
    verifyEmail: string;
  };
  dashboard: DashboardDictionary;
}

export const en: Dictionary = {
  meta: {
    description: "Smarter Loans. Better Decisions.",
  },
  language: {
    label: "Language",
  },
  nav: {
    about: "About",
    why: "Why CrediWise",
    how: "How it works",
    services: "Services",
    contact: "Contact",
    signIn: "Sign in",
    signUp: "Sign up",
    homeAria: "CrediWise home",
    primary: "Primary",
    mobile: "Mobile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    carouselLabel: "CrediWise loan highlights",
    previousSlide: "Previous slide",
    nextSlide: "Next slide",
    chooseSlide: "Choose slide",
    showSlide: "Show slide {n}: {headline}",
    liveSlide: "Slide {n} of {total}: {headline}",
    slides: {
      journey: {
        alt: "A young professional reviews options on a phone at a laptop, with a compare-apply-track path illustrated beside him.",
        headline: "Your Financial Journey Made Simple",
        description: "Compare. Apply. Track. All in one place.",
        ctaLabel: "Get Started",
        ctaAriaLabel: "Get started with CrediWise",
      },
      home: {
        alt: "A smiling Indian family sitting together in a sunlit living room after moving into a new home.",
        headline: "Home Loans for a Brighter Future",
        description:
          "Compare top lenders, get the best rates, and make your dream home a reality.",
        ctaLabel: "Explore Home Loans",
        ctaAriaLabel: "Explore home loans and create an account",
      },
      car: {
        alt: "A confident young man leaning on a car against a bright city skyline.",
        headline: "Car Loans That Move You Forward",
        description: "Compare offers, get better rates, and hit the road with confidence.",
        ctaLabel: "Explore Car Loans",
        ctaAriaLabel: "Explore car loans and create an account",
      },
      personal: {
        alt: "A smiling young woman holding a laptop outdoors, with icons for education, healthcare, travel, and shopping.",
        headline: "Personal Loans for Life’s Possibilities",
        description:
          "For education, healthcare, travel, weddings and more. Find the right loan, right now.",
        ctaLabel: "Explore Personal Loans",
        ctaAriaLabel: "Explore personal loans and create an account",
      },
    },
  },
  services: {
    heading: "Loan options for every goal",
    subheading: "Purpose-built offerings for home, vehicle, personal, and business needs.",
    items: {
      home: {
        title: "Home loans",
        description:
          "Find a suitable home loan with competitive rates and flexible repayment options.",
        cta: "Explore home loans",
      },
      car: {
        title: "Car loans",
        description: "Compare offers and move forward with a loan that fits your vehicle plans.",
        cta: "Explore car loans",
      },
      personal: {
        title: "Personal loans",
        description: "Support education, healthcare, travel, weddings, and other life goals.",
        cta: "Explore personal loans",
      },
      business: {
        title: "Business loans",
        description: "Working capital, MSME financing, and growth funding in one place.",
        cta: "Explore business loans",
      },
    },
  },
  howItWorks: {
    heading: "How It Works",
    subheading: "A few simple steps to get your loan.",
    steps: {
      compare: { title: "Compare", text: "Explore multiple loan options." },
      apply: { title: "Apply", text: "Submit a simple application." },
      track: { title: "Track", text: "Check your application status in real time." },
      approved: { title: "Get Approved", text: "Receive approval and move forward." },
    },
  },
  tools: {
    heading: "Stay in control after approval",
    body: "Track EMIs, view repayment schedules, and manage your loan from one dashboard once your application is approved.",
    cta: "Open your dashboard",
  },
  why: {
    heading: "Why Choose CrediWise",
    subheading: "Smarter choices. Greater confidence.",
    items: {
      lenders: {
        title: "Multiple Lenders",
        text: "Compare options from multiple lending partners.",
      },
      comparison: {
        title: "Transparent Comparison",
        text: "Understand rates and options clearly.",
      },
      approvals: {
        title: "Faster Approvals",
        text: "A simpler process designed to move quickly.",
      },
      guidance: {
        title: "Expert Guidance",
        text: "Get help when you need it.",
      },
      secure: {
        title: "Secure & Reliable",
        text: "Your information and application journey are handled securely.",
      },
    },
  },
  testimonial: {
    eyebrow: "CUSTOMER STORIES",
    headingLine1: "Trusted by People Making",
    headingLine2: "Smarter Financial Choices",
    quote:
      "CrediWise helped me compare my options clearly and made the loan process feel much simpler.",
    name: "Priya S., Pune",
    role: "Home Loan Customer",
    starsLabel: "5 out of 5 stars",
    photoAlt: "CrediWise customer sharing her loan experience",
  },
  cta: {
    eyebrow: "YOUR NEXT MOVE",
    heading: "Take the Next Step Towards Your Goals",
    headingLine1: "Take the Next Step",
    headingLine2: "Towards Your Goals",
    body: "Join thousands who trust CrediWise for smarter loan decisions.",
    button: "Get Started →",
    photoAlt: "A young man with a backpack looking toward a city skyline at sunrise",
  },
  contact: {
    heading: "Contact",
    subheading: "Tell us a little about what you need. We'll get back to you at the details you share.",
    fullName: "Full name",
    phone: "Phone",
    email: "Email ID",
    loanType: "Type of loan",
    loanTypePlaceholder: "Select type of loan",
    notes: "Additional notes",
    submit: "Send message",
    sending: "Sending...",
    loanOptions: {
      home: "Home Loan",
      car: "Car Loan",
      personal: "Personal Loan",
      business: "Business Loan",
      unsure: "Not sure yet",
    },
    messages: {
      received: "Thanks — we have received your message and will get back to you shortly.",
      invalidName: "Please enter your full name.",
      invalidPhone: "Please enter a valid phone number.",
      invalidEmail: "Please enter a valid email address.",
      invalidLoan: "Please select a type of loan.",
      notesTooLong: "Additional notes must be 2000 characters or fewer.",
      notConfigured:
        "Contact email is not configured yet. Please write to support@crediwise.co.in directly.",
      sendFailed:
        "We could not send your message just now. Please try again or email support@crediwise.co.in.",
    },
  },
  footer: {
    copyright: "© {year} CrediWise. All rights reserved.",
    about: "About",
    contact: "Contact",
    signIn: "Sign in",
  },
  auth: {
    signInSubtitle: "Sign in to continue",
    signUpSubtitle: "Create your account",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    signUp: "Sign Up",
    creating: "Creating...",
    noAccount: "Don’t have an account?",
    hasAccount: "Already have an account?",
    continueToSignIn: "Continue to Sign In",
    missingConfig:
      "Supabase environment variables are missing. Please configure .env.local and restart the dev server.",
    missingConfigBanner:
      "Missing Supabase config. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then restart `npm run dev`.",
    verifyEmail: "Check your email for a verification link. After verifying, you can sign in.",
  },
  dashboard: dashboardEn,
};

export const hi: Dictionary = {
  meta: {
    description: "स्मार्ट लोन। बेहतर फैसले।",
  },
  language: {
    label: "भाषा",
  },
  nav: {
    about: "हमारे बारे में",
    why: "क्रेडीवाइज़ क्यों",
    how: "कैसे काम करता है",
    services: "सेवाएँ",
    contact: "संपर्क",
    signIn: "साइन इन",
    signUp: "साइन अप",
    homeAria: "क्रेडीवाइज़ होम",
    primary: "मुख्य",
    mobile: "मोबाइल",
    openMenu: "मेनू खोलें",
    closeMenu: "मेनू बंद करें",
  },
  hero: {
    carouselLabel: "क्रेडीवाइज़ लोन हाइलाइट्स",
    previousSlide: "पिछली स्लाइड",
    nextSlide: "अगली स्लाइड",
    chooseSlide: "स्लाइड चुनें",
    showSlide: "स्लाइड {n} दिखाएँ: {headline}",
    liveSlide: "स्लाइड {n} / {total}: {headline}",
    slides: {
      journey: {
        alt: "एक युवा प्रोफेशनल लैपटॉप पर फोन से विकल्प देख रहे हैं, साथ में तुलना-आवेदन-ट्रैक का रास्ता दिखाया गया है।",
        headline: "आपकी वित्तीय यात्रा अब आसान",
        description: "तुलना करें। आवेदन करें। ट्रैक करें। सब एक जगह।",
        ctaLabel: "शुरू करें",
        ctaAriaLabel: "क्रेडीवाइज़ के साथ शुरू करें",
      },
      home: {
        alt: "एक मुस्कुराता भारतीय परिवार नए घर के धूप भरे लिविंग रूम में साथ बैठा है।",
        headline: "उज्जवल भविष्य के लिए होम लोन",
        description:
          "शीर्ष ऋणदाताओं की तुलना करें, बेहतर दरें पाएँ, और अपने सपनों का घर बनाएँ।",
        ctaLabel: "होम लोन देखें",
        ctaAriaLabel: "होम लोन देखें और खाता बनाएँ",
      },
      car: {
        alt: "एक आत्मविश्वासी युवा व्यक्ति शहर की चमकती स्काईलाइन के सामने कार पर टिका है।",
        headline: "कार लोन जो आपको आगे बढ़ाए",
        description: "ऑफ़र तुलना करें, बेहतर दरें पाएँ, और भरोसे के साथ सड़क पर निकलें।",
        ctaLabel: "कार लोन देखें",
        ctaAriaLabel: "कार लोन देखें और खाता बनाएँ",
      },
      personal: {
        alt: "एक मुस्कुराती युवा महिला बाहर लैपटॉप पकड़े हुए है, साथ में शिक्षा, स्वास्थ्य, यात्रा और खरीदारी के आइकन हैं।",
        headline: "जीवन की संभावनाओं के लिए पर्सनल लोन",
        description:
          "शिक्षा, स्वास्थ्य, यात्रा, शादी और और भी बहुत कुछ। सही लोन अभी पाएँ।",
        ctaLabel: "पर्सनल लोन देखें",
        ctaAriaLabel: "पर्सनल लोन देखें और खाता बनाएँ",
      },
    },
  },
  services: {
    heading: "हर लक्ष्य के लिए लोन विकल्प",
    subheading: "घर, वाहन, व्यक्तिगत और व्यापारिक ज़रूरतों के लिए तैयार विकल्प।",
    items: {
      home: {
        title: "होम लोन",
        description: "प्रतिस्पर्धी दरों और लचीले पुनर्भुगतान के साथ उपयुक्त होम लोन पाएँ।",
        cta: "होम लोन देखें",
      },
      car: {
        title: "कार लोन",
        description: "ऑफ़र तुलना करें और अपने वाहन प्लान के हिसाब से आगे बढ़ें।",
        cta: "कार लोन देखें",
      },
      personal: {
        title: "पर्सनल लोन",
        description: "शिक्षा, स्वास्थ्य, यात्रा, शादी और अन्य जीवन लक्ष्यों के लिए सहयोग।",
        cta: "पर्सनल लोन देखें",
      },
      business: {
        title: "बिजनेस लोन",
        description: "कार्यशील पूंजी, MSME वित्त और विकास फंडिंग एक ही जगह।",
        cta: "बिजनेस लोन देखें",
      },
    },
  },
  howItWorks: {
    heading: "कैसे काम करता है",
    subheading: "अपना लोन पाने के कुछ आसान चरण।",
    steps: {
      compare: { title: "तुलना करें", text: "कई लोन विकल्प देखें।" },
      apply: { title: "आवेदन करें", text: "एक सरल आवेदन जमा करें।" },
      track: { title: "ट्रैक करें", text: "अपने आवेदन की स्थिति रियल टाइम में देखें।" },
      approved: { title: "स्वीकृति पाएँ", text: "मंज़ूरी मिलने पर आगे बढ़ें।" },
    },
  },
  tools: {
    heading: "मंज़ूरी के बाद भी नियंत्रण आपके हाथ में",
    body: "आवेदन स्वीकृत होने पर EMI ट्रैक करें, पुनर्भुगतान शेड्यूल देखें, और अपना लोन एक डैशबोर्ड से संभालें।",
    cta: "अपना डैशबोर्ड खोलें",
  },
  why: {
    heading: "क्रेडीवाइज़ क्यों चुनें",
    subheading: "समझदारी से चुनाव। ज़्यादा भरोसा।",
    items: {
      lenders: {
        title: "कई ऋणदाता",
        text: "कई लेंडिंग पार्टनर के विकल्पों की तुलना करें।",
      },
      comparison: {
        title: "पारदर्शी तुलना",
        text: "दरें और विकल्प साफ़-साफ़ समझें।",
      },
      approvals: {
        title: "तेज़ मंज़ूरी",
        text: "एक सरल प्रक्रिया, तेज़ी से आगे बढ़ने के लिए।",
      },
      guidance: {
        title: "विशेषज्ञ मार्गदर्शन",
        text: "जब ज़रूरत हो, मदद पाएँ।",
      },
      secure: {
        title: "सुरक्षित और विश्वसनीय",
        text: "आपकी जानकारी और आवेदन यात्रा सुरक्षित तरीके से संभाली जाती है।",
      },
    },
  },
  testimonial: {
    eyebrow: "ग्राहक कहानियाँ",
    headingLine1: "समझदारी से वित्तीय फैसले",
    headingLine2: "लेने वाले लोगों का भरोसा",
    quote:
      "क्रेडीवाइज़ ने मेरे विकल्प साफ़-साफ़ तुलना करने में मदद की और लोन प्रक्रिया बहुत आसान लगी।",
    name: "प्रिया एस., पुणे",
    role: "होम लोन ग्राहक",
    starsLabel: "5 में से 5 स्टार",
    photoAlt: "क्रेडीवाइज़ ग्राहक अपना लोन अनुभव साझा करती हुई",
  },
  cta: {
    eyebrow: "आपका अगला कदम",
    heading: "अपने लक्ष्यों की ओर अगला कदम बढ़ाएँ",
    headingLine1: "अपने लक्ष्यों की ओर",
    headingLine2: "अगला कदम बढ़ाएँ",
    body: "हज़ारों लोग स्मार्ट लोन फैसलों के लिए क्रेडीवाइज़ पर भरोसा करते हैं।",
    button: "शुरू करें →",
    photoAlt: "बैकपैक वाला एक युवा व्यक्ति सूर्योदय पर शहर की स्काईलाइन की ओर देख रहा है",
  },
  contact: {
    heading: "संपर्क",
    subheading: "बताएँ आपको क्या चाहिए। आप दिए गए विवरण पर हम आपसे संपर्क करेंगे।",
    fullName: "पूरा नाम",
    phone: "फ़ोन",
    email: "ईमेल आईडी",
    loanType: "लोन का प्रकार",
    loanTypePlaceholder: "लोन का प्रकार चुनें",
    notes: "अतिरिक्त जानकारी",
    submit: "संदेश भेजें",
    sending: "भेजा जा रहा है...",
    loanOptions: {
      home: "होम लोन",
      car: "कार लोन",
      personal: "पर्सनल लोन",
      business: "बिजनेस लोन",
      unsure: "अभी तय नहीं",
    },
    messages: {
      received: "धन्यवाद — आपका संदेश मिल गया है। हम जल्द संपर्क करेंगे।",
      invalidName: "कृपया अपना पूरा नाम लिखें।",
      invalidPhone: "कृपया एक मान्य फ़ोन नंबर लिखें।",
      invalidEmail: "कृपया एक मान्य ईमेल पता लिखें।",
      invalidLoan: "कृपया लोन का प्रकार चुनें।",
      notesTooLong: "अतिरिक्त जानकारी 2000 अक्षरों से अधिक नहीं होनी चाहिए।",
      notConfigured:
        "संपर्क ईमेल अभी सेट नहीं है। कृपया सीधे support@crediwise.co.in पर लिखें।",
      sendFailed:
        "अभी संदेश नहीं भेज सके। कृपया फिर कोशिश करें या support@crediwise.co.in पर ईमेल करें।",
    },
  },
  footer: {
    copyright: "© {year} CrediWise. सर्वाधिकार सुरक्षित।",
    about: "हमारे बारे में",
    contact: "संपर्क",
    signIn: "साइन इन",
  },
  auth: {
    signInSubtitle: "जारी रखने के लिए साइन इन करें",
    signUpSubtitle: "अपना खाता बनाएँ",
    email: "ईमेल",
    password: "पासवर्ड",
    signIn: "साइन इन",
    signingIn: "साइन इन हो रहा है...",
    signUp: "साइन अप",
    creating: "बनाया जा रहा है...",
    noAccount: "खाता नहीं है?",
    hasAccount: "पहले से खाता है?",
    continueToSignIn: "साइन इन पर जाएँ",
    missingConfig:
      "Supabase एनवायरनमेंट वेरिएबल गायब हैं। कृपया .env.local सेट करें और डेव सर्वर फिर शुरू करें।",
    missingConfigBanner:
      "Supabase कॉन्फ़िग गायब है। `.env.local` में `NEXT_PUBLIC_SUPABASE_URL` और `NEXT_PUBLIC_SUPABASE_ANON_KEY` जोड़ें, फिर `npm run dev` फिर शुरू करें।",
    verifyEmail: "ईमेल में वेरिफिकेशन लिंक देखें। पुष्टि के बाद आप साइन इन कर सकते हैं।",
  },
  dashboard: dashboardHi,
};

export const mr: Dictionary = {
  meta: {
    description: "स्मार्ट लोन. चांगले निर्णय.",
  },
  language: {
    label: "भाषा",
  },
  nav: {
    about: "आमच्याबद्दल",
    why: "क्रेडीवाइज का",
    how: "कसे काम करते",
    services: "सेवा",
    contact: "संपर्क",
    signIn: "साइन इन",
    signUp: "साइन अप",
    homeAria: "क्रेडीवाइज होम",
    primary: "मुख्य",
    mobile: "मोबाइल",
    openMenu: "मेनू उघडा",
    closeMenu: "मेनू बंद करा",
  },
  hero: {
    carouselLabel: "क्रेडीवाइज लोन हायलाइट्स",
    previousSlide: "मागील स्लाइड",
    nextSlide: "पुढील स्लाइड",
    chooseSlide: "स्लाइड निवडा",
    showSlide: "स्लाइड {n} दाखवा: {headline}",
    liveSlide: "स्लाइड {n} / {total}: {headline}",
    slides: {
      journey: {
        alt: "एक तरुण प्रोफेशनल लॅपटॉपसमोर फोनवर पर्याय पाहत आहे, शेजारी तुलना-अर्ज-ट्रॅकचा मार्ग दाखवला आहे.",
        headline: "तुमचा आर्थिक प्रवास आता सोपा",
        description: "तुलना करा. अर्ज करा. ट्रॅक करा. सगळं एकाच ठिकाणी.",
        ctaLabel: "सुरुवात करा",
        ctaAriaLabel: "क्रेडीवाइजसोबत सुरुवात करा",
      },
      home: {
        alt: "नव्या घराच्या सूर्यप्रकाशित लिव्हिंग रूममध्ये हसरा भारतीय कुटुंब एकत्र बसले आहे.",
        headline: "उज्ज्वल भविष्यासाठी होम लोन",
        description:
          "उत्तम ऋणदात्यांची तुलना करा, चांगले दर मिळवा आणि स्वप्नातील घर पूर्ण करा.",
        ctaLabel: "होम लोन पहा",
        ctaAriaLabel: "होम लोन पहा आणि खाते तयार करा",
      },
      car: {
        alt: "शहराच्या तेजस्वी स्कायलाइनसमोर कारला टेकून उभा आत्मविश्वासी तरुण.",
        headline: "तुम्हाला पुढे नेणारे कार लोन",
        description: "ऑफर तुलना करा, चांगले दर मिळवा आणि विश्वासाने रस्त्यावर निघा.",
        ctaLabel: "कार लोन पहा",
        ctaAriaLabel: "कार लोन पहा आणि खाते तयार करा",
      },
      personal: {
        alt: "बाहेर लॅपटॉप धरलेली हसणारी तरुण महिला, शेजारी शिक्षण, आरोग्य, प्रवास आणि खरेदीचे आयकन.",
        headline: "जीवनाच्या संधींसाठी पर्सनल लोन",
        description:
          "शिक्षण, आरोग्य, प्रवास, लग्न आणि आणखी कितीतरी गोष्टींसाठी. योग्य लोन आताच शोधा.",
        ctaLabel: "पर्सनल लोन पहा",
        ctaAriaLabel: "पर्सनल लोन पहा आणि खाते तयार करा",
      },
    },
  },
  services: {
    heading: "प्रत्येक ध्येयासाठी लोन पर्याय",
    subheading: "घर, वाहन, वैयक्तिक आणि व्यावसायिक गरजांसाठी तयार केलेले पर्याय.",
    items: {
      home: {
        title: "होम लोन",
        description: "स्पर्धात्मक दर आणि लवचिक परतफेडीसह योग्य होम लोन शोधा.",
        cta: "होम लोन पहा",
      },
      car: {
        title: "कार लोन",
        description: "ऑफर तुलना करा आणि तुमच्या वाहन योजनेनुसार पुढे जा.",
        cta: "कार लोन पहा",
      },
      personal: {
        title: "पर्सनल लोन",
        description: "शिक्षण, आरोग्य, प्रवास, लग्न आणि इतर जीवनध्याय पूर्ण करण्यास मदत.",
        cta: "पर्सनल लोन पहा",
      },
      business: {
        title: "बिझनेस लोन",
        description: "कार्यशील भांडवल, MSME वित्त आणि वाढीसाठी निधी एकाच ठिकाणी.",
        cta: "बिझनेस लोन पहा",
      },
    },
  },
  howItWorks: {
    heading: "कसे काम करते",
    subheading: "तुमचे लोन मिळवण्यासाठी काही सोप्या पायऱ्या.",
    steps: {
      compare: { title: "तुलना करा", text: "अनेक लोन पर्याय पाहा." },
      apply: { title: "अर्ज करा", text: "सोपा अर्ज सादर करा." },
      track: { title: "ट्रॅक करा", text: "अर्जाची स्थिती रिअल टाइममध्ये पाहा." },
      approved: { title: "मंजुरी मिळवा", text: "मंजुरी मिळाल्यावर पुढे जा." },
    },
  },
  tools: {
    heading: "मंजुरीनंतरही नियंत्रण तुमच्याकडे",
    body: "अर्ज मंजूर झाल्यावर EMI ट्रॅक करा, परतफेडीचे वेळापत्रक पाहा आणि एका डॅशबोर्डवरून लोन व्यवस्थापित करा.",
    cta: "तुमचा डॅशबोर्ड उघडा",
  },
  why: {
    heading: "क्रेडीवाइज का निवडावे",
    subheading: "हुशार निवडी. अधिक विश्वास.",
    items: {
      lenders: {
        title: "अनेक ऋणदाते",
        text: "अनेक लेंडिंग पार्टनरच्या पर्यायांची तुलना करा.",
      },
      comparison: {
        title: "पारदर्शक तुलना",
        text: "दर आणि पर्याय स्पष्टपणे समजाून घ्या.",
      },
      approvals: {
        title: "जलद मंजुरी",
        text: "वेगाने पुढे जाण्यासाठी सोपी प्रक्रिया.",
      },
      guidance: {
        title: "तज्ज्ञ मार्गदर्शन",
        text: "गरज असेल तेव्हा मदत मिळवा.",
      },
      secure: {
        title: "सुरक्षित आणि विश्वासार्ह",
        text: "तुमची माहिती आणि अर्जाचा प्रवास सुरक्षितपणे हाताळला जातो.",
      },
    },
  },
  testimonial: {
    eyebrow: "ग्राहक कथा",
    headingLine1: "हुशार आर्थिक निर्णय",
    headingLine2: "घेणाऱ्यांचा विश्वास",
    quote:
      "क्रेडीवाइजमुळे पर्याय स्पष्ट तुलना करता आले आणि लोन प्रक्रिया खूप सोपी वाटली.",
    name: "प्रिया एस., पुणे",
    role: "होम लोन ग्राहक",
    starsLabel: "५ पैकी ५ तारे",
    photoAlt: "क्रेडीवाइज ग्राहक तिचा लोन अनुभव सांगताना",
  },
  cta: {
    eyebrow: "तुमची पुढची पाऊलवाट",
    heading: "तुमच्या ध्येयांकडे पुढचे पाऊल टाका",
    headingLine1: "तुमच्या ध्येयांकडे",
    headingLine2: "पुढचे पाऊल टाका",
    body: "हजारो लोक हुशार लोन निर्णयांसाठी क्रेडीवाइजवर विश्वास ठेवतात.",
    button: "सुरुवात करा →",
    photoAlt: "बॅकपॅक असलेला तरुण सूर्योदयाच्या वेळी शहराच्या स्कायलाइनकडे पाहत आहे",
  },
  contact: {
    heading: "संपर्क",
    subheading: "तुम्हाला काय हवे ते थोडक्यात सांगा. तुम्ही दिलेल्या तपशीलांवर आम्ही संपर्क करू.",
    fullName: "पूर्ण नाव",
    phone: "फोन",
    email: "ईमेल आयडी",
    loanType: "लोनाचा प्रकार",
    loanTypePlaceholder: "लोनाचा प्रकार निवडा",
    notes: "अतिरिक्त माहिती",
    submit: "संदेश पाठवा",
    sending: "पाठवत आहे...",
    loanOptions: {
      home: "होम लोन",
      car: "कार लोन",
      personal: "पर्सनल लोन",
      business: "बिझनेस लोन",
      unsure: "अजून निश्चित नाही",
    },
    messages: {
      received: "धन्यवाद — तुमचा संदेश मिळाला आहे. आम्ही लवकरच संपर्क करू.",
      invalidName: "कृपया तुमचे पूर्ण नाव लिहा.",
      invalidPhone: "कृपया वैध फोन नंबर लिहा.",
      invalidEmail: "कृपया वैध ईमेल पत्ता लिहा.",
      invalidLoan: "कृपया लोनाचा प्रकार निवडा.",
      notesTooLong: "अतिरिक्त माहिती २००० अक्षरांपेक्षा जास्त नसावी.",
      notConfigured:
        "संपर्क ईमेल अद्याप सेट नाही. कृपया थेट support@crediwise.co.in वर लिहा.",
      sendFailed:
        "आत्ता संदेश पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा किंवा support@crediwise.co.in वर ईमेल करा.",
    },
  },
  footer: {
    copyright: "© {year} CrediWise. सर्व हक्क राखीव.",
    about: "आमच्याबद्दल",
    contact: "संपर्क",
    signIn: "साइन इन",
  },
  auth: {
    signInSubtitle: "पुढे जाण्यासाठी साइन इन करा",
    signUpSubtitle: "तुमचे खाते तयार करा",
    email: "ईमेल",
    password: "पासवर्ड",
    signIn: "साइन इन",
    signingIn: "साइन इन होत आहे...",
    signUp: "साइन अप",
    creating: "तयार होत आहे...",
    noAccount: "खाते नाही?",
    hasAccount: "आधीच खाते आहे?",
    continueToSignIn: "साइन इनवर जा",
    missingConfig:
      "Supabase एनवायर्नमेंट व्हेरिएबल्स गहाळ आहेत. कृपया .env.local सेट करा आणि डेव्हलपमेंट सर्व्हर पुन्हा सुरू करा.",
    missingConfigBanner:
      "Supabase कॉन्फिग गहाळ आहे. `.env.local` मध्ये `NEXT_PUBLIC_SUPABASE_URL` आणि `NEXT_PUBLIC_SUPABASE_ANON_KEY` जोडा, नंतर `npm run dev` पुन्हा सुरू करा.",
    verifyEmail: "ईमेलमधील पडताळणी लिंक तपासा. पडताळणीनंतर तुम्ही साइन इन करू शकता.",
  },
  dashboard: dashboardMr,
};

const dictionaries: Record<Locale, Dictionary> = { en, hi, mr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
