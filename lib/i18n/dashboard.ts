export interface DashboardDictionary {
  nav: {
    dashboard: string;
    loans: string;
    applications: string;
    documents: string;
    advisory: string;
    profile: string;
    customerNav: string;
    closeSidebar: string;
    toggleMenu: string;
    search: string;
    searchPlaceholder: string;
    account: string;
    signOut: string;
    adminPanel: string;
  };
  common: {
    open: string;
    view: string;
    submit: string;
    homeLoan: string;
    businessLoan: string;
    loanTypes: { home: string; business: string };
    appStatus: {
      Draft: string;
      Submitted: string;
      Verified: string;
      Processing: string;
      Approved: string;
      Disbursed: string;
    };
    docStatus: {
      Uploaded: string;
      "Under Review": string;
      Approved: string;
      "Re-upload": string;
    };
    docTypes: {
      id_proof: string;
      income_proof: string;
      bank_statement: string;
      property_docs: string;
      business_registration: string;
      other: string;
    };
    emiStatus: {
      scheduled: string;
      paid: string;
      partial: string;
      waived: string;
    };
    advisoryStatus: {
      open: string;
      in_progress: string;
      resolved: string;
      closed: string;
    };
    advisoryCategories: {
      general: string;
      loan: string;
      documents: string;
      payments: string;
      other: string;
    };
    fields: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
    };
  };
  home: {
    title: string;
    subtitle: string;
    applications: string;
    inProgress: string;
    activeLoans: string;
    documents: string;
    draftOne: string;
    draftMany: string;
    inProgressSub: string;
    loansSub: string;
    documentsSub: string;
    profileAlertTitle: string;
    profileAlertMissing: string;
    profileAlertCta: string;
    quickActions: string;
    startApplication: string;
    viewDocuments: string;
    advisorySupport: string;
    openCount: string;
    accountProfile: string;
    needHelp: string;
    needHelpBody: string;
    openAdvisory: string;
  };
  applications: {
    title: string;
    subtitle: string;
    profileAlertTitle: string;
    profileAlertCta: string;
    startTitle: string;
    startBody: string;
    newHome: string;
    newBusiness: string;
    completeProfileTitle: string;
    completeProfileSubmitTitle: string;
    listTitle: string;
    loadError: string;
    empty: string;
    colLoan: string;
    colStatus: string;
    colCreated: string;
    colActions: string;
    idPrefix: string;
  };
  loans: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    viewApplications: string;
    loanLabel: string;
    cardBody: string;
    viewLoan: string;
  };
  documentsPage: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    goApplications: string;
    colDocument: string;
    colApplication: string;
    colStatus: string;
    colUploaded: string;
    colOpen: string;
  };
  advisory: {
    title: string;
    subtitle: string;
    raiseTitle: string;
    subject: string;
    subjectPlaceholder: string;
    category: string;
    relatedApplication: string;
    none: string;
    details: string;
    detailsPlaceholder: string;
    submit: string;
    listTitle: string;
    loadError: string;
    empty: string;
    teamResponse: string;
    submitted: string;
    linkedApplication: string;
  };
  profile: {
    title: string;
    subtitle: string;
    schemaTitle: string;
    requiredTitle: string;
    requiredBody: string;
    completeBadge: string;
    incompleteBadge: string;
    contactDetails: string;
    signInEmail: string;
    noAccountEmail: string;
    altPhone: string;
    altPhoneHint: string;
    save: string;
    account: string;
    userId: string;
    role: string;
    session: string;
    sessionBody: string;
  };
  applicationDetail: {
    notFound: string;
    back: string;
    heading: string;
    applicationId: string;
    status: string;
    loadDetailsError: string;
    loadDocumentsError: string;
    propertyAddress: string;
    propertyValue: string;
    downPayment: string;
    loanAmount: string;
    applicantCount: string;
    employmentTitle: string;
    employmentBody: string;
    occupation: string;
    occupationSelect: string;
    occupationService: string;
    occupationBusiness: string;
    annualSalary: string;
    annualSalaryPlaceholder: string;
    businessName: string;
    purpose: string;
    workingCapital: string;
    businessDetailsTitle: string;
    businessDetailsBody: string;
    yearOfIncorporation: string;
    yearPlaceholder: string;
    annualRevenue: string;
    annualRevenuePlaceholder: string;
    saveDraft: string;
    saveAndSubmit: string;
  };
  docs: {
    checklistTitle: string;
    checklistHome: string;
    checklistBusiness: string;
    approvedCount: string;
    receivedCount: string;
    notUploaded: string;
    reuploadHint: string;
    checklistFooter: string;
    title: string;
    body: string;
    replaceTitle: string;
    replaceBody: string;
    previous: string;
    replaceFile: string;
    uploading: string;
    addTitle: string;
    documentType: string;
    file: string;
    upload: string;
    uploadsClosed: string;
    allFiles: string;
    empty: string;
    download: string;
    supabaseMissing: string;
    chooseFile: string;
    fileTooLarge: string;
    fileType: string;
    chooseType: string;
    signedIn: string;
    downloadLink: string;
    bucketMissing: string;
    uploaded: string;
    chooseReplacement: string;
    replaced: string;
  };
  repayment: {
    title: string;
    loadError: string;
    body: string;
    colNum: string;
    colDue: string;
    colEmi: string;
    colPrincipal: string;
    colInterest: string;
    colBalance: string;
    colStatus: string;
    colPaid: string;
    colNotes: string;
  };
}

export const dashboardEn: DashboardDictionary = {
  nav: {
    dashboard: "Dashboard",
    loans: "My Loans",
    applications: "My Applications",
    documents: "My Documents",
    advisory: "Advisory",
    profile: "My Profile",
    customerNav: "Customer navigation",
    closeSidebar: "Close sidebar",
    toggleMenu: "Toggle menu",
    search: "Search",
    searchPlaceholder: "Search (coming soon)",
    account: "Account",
    signOut: "Sign out",
    adminPanel: "Admin panel",
  },
  common: {
    open: "Open",
    view: "View",
    submit: "Submit",
    homeLoan: "Home loan",
    businessLoan: "Business loan",
    loanTypes: { home: "Home", business: "Business" },
    appStatus: {
      Draft: "Draft",
      Submitted: "Submitted",
      Verified: "Verified",
      Processing: "Processing",
      Approved: "Approved",
      Disbursed: "Disbursed",
    },
    docStatus: {
      Uploaded: "Uploaded",
      "Under Review": "Under Review",
      Approved: "Approved",
      "Re-upload": "Re-upload",
    },
    docTypes: {
      id_proof: "ID Proof",
      income_proof: "Income Proof",
      bank_statement: "Bank Statement",
      property_docs: "Property Documents",
      business_registration: "Business Registration",
      other: "Other",
    },
    emiStatus: {
      scheduled: "Scheduled",
      paid: "Paid",
      partial: "Partial",
      waived: "Waived",
    },
    advisoryStatus: {
      open: "Open",
      in_progress: "In progress",
      resolved: "Resolved",
      closed: "Closed",
    },
    advisoryCategories: {
      general: "General",
      loan: "Loan / application",
      documents: "Documents",
      payments: "Payments / EMI",
      other: "Other",
    },
    fields: {
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      address: "Address",
    },
  },
  home: {
    title: "Dashboard",
    subtitle: "Overview of your applications, loans, and requests.",
    applications: "Applications",
    inProgress: "In progress",
    activeLoans: "Active loans",
    documents: "Documents",
    draftOne: "{n} draft",
    draftMany: "{n} drafts",
    inProgressSub: "Submitted → processing",
    loansSub: "Approved or disbursed",
    documentsSub: "Files uploaded",
    profileAlertTitle: "Complete your profile to apply for a loan",
    profileAlertMissing: "Missing: {items}.",
    profileAlertCta: "Go to My Profile →",
    quickActions: "Quick actions",
    startApplication: "Start or continue an application",
    viewDocuments: "View all uploaded documents",
    advisorySupport: "Advisory support",
    openCount: "{n} open",
    accountProfile: "Account & profile",
    needHelp: "Need help?",
    needHelpBody: "Send a message to our team — we'll reply in your advisory thread.",
    openAdvisory: "Open advisory",
  },
  applications: {
    title: "My Applications",
    subtitle: "Create drafts, complete your details, and submit when you're ready.",
    profileAlertTitle: "Complete your profile before applying for a loan",
    profileAlertCta: "Go to My Profile →",
    startTitle: "Start a new application",
    startBody:
      "Choose a loan type to open a draft. You can submit from the application page when the status is Draft.",
    newHome: "New home loan",
    newBusiness: "New business loan",
    completeProfileTitle: "Complete My Profile before starting an application",
    completeProfileSubmitTitle: "Complete My Profile before submitting",
    listTitle: "Your applications",
    loadError: "We could not load applications: {error}",
    empty: "No applications yet. Create a draft above.",
    colLoan: "Loan",
    colStatus: "Status",
    colCreated: "Created",
    colActions: "Actions",
    idPrefix: "ID {id}…",
  },
  loans: {
    title: "My Loans",
    subtitle:
      "Approved and disbursed applications — open a case for documents, EMI schedule, and details.",
    emptyTitle: "No active loans yet",
    emptyBody: "When an application reaches Approved or Disbursed, it will appear here.",
    viewApplications: "View applications",
    loanLabel: "{type} loan",
    cardBody:
      "Open the application to see documents, repayment schedule (when available), and loan details.",
    viewLoan: "View loan",
  },
  documentsPage: {
    title: "My Documents",
    subtitle: "All files uploaded across your applications, newest first.",
    emptyTitle: "No documents uploaded yet",
    emptyBody: "Open an application and upload from the documents section.",
    goApplications: "Go to applications",
    colDocument: "Document",
    colApplication: "Application",
    colStatus: "Status",
    colUploaded: "Uploaded",
    colOpen: "Open",
  },
  advisory: {
    title: "Advisory",
    subtitle: "Ask our team a question or flag an issue. We'll respond here when the request is updated.",
    raiseTitle: "Raise a new request",
    subject: "Subject",
    subjectPlaceholder: "Short summary",
    category: "Category",
    relatedApplication: "Related application (optional)",
    none: "— None —",
    details: "Details",
    detailsPlaceholder: "Describe what you need help with.",
    submit: "Submit request",
    listTitle: "Your requests",
    loadError: "Could not load requests: {error}",
    empty: "No requests yet.",
    teamResponse: "Team response",
    submitted: "Submitted {when}",
    linkedApplication: "Linked application",
  },
  profile: {
    title: "My Profile",
    subtitle:
      "Keep your contact details up to date. A complete profile is required before you can start a loan application.",
    schemaTitle: "Database setup required",
    requiredTitle: "Complete your profile first",
    requiredBody: "Please fill in: {items}. Then you can create or submit loan applications.",
    completeBadge: "Profile complete — you can apply for loans",
    incompleteBadge: "Profile incomplete — finish the form below to apply",
    contactDetails: "Contact details",
    signInEmail:
      "Your sign-in email is {email}. You can store a contact email here too; at least one is required.",
    noAccountEmail: "No email on your account yet — enter a contact email so we can reach you.",
    altPhone: "Alt phone",
    altPhoneHint: "Optional secondary number.",
    save: "Save profile",
    account: "Account",
    userId: "User ID",
    role: "Role",
    session: "Session",
    sessionBody: "Sign out on this device when you're done, especially on a shared computer.",
  },
  applicationDetail: {
    notFound: "Application not found or you do not have access.",
    back: "Back to applications",
    heading: "{type} loan application form",
    applicationId: "Application ID: {id}",
    status: "Status: {status}",
    loadDetailsError: "Could not load existing details: {error}",
    loadDocumentsError: "Documents could not be loaded: {error}",
    propertyAddress: "Property Address",
    propertyValue: "Property Value",
    downPayment: "Down Payment",
    loanAmount: "Loan Amount",
    applicantCount: "Applicant Count",
    employmentTitle: "Employment details",
    employmentBody:
      "Tell us whether you earn through salaried service or business income, and the annual figure we should use for assessment.",
    occupation: "Occupation",
    occupationSelect: "Select…",
    occupationService: "Service (salaried)",
    occupationBusiness: "Business (self-employed / business)",
    annualSalary: "Annual salary / business revenue",
    annualSalaryPlaceholder: "Amount per year",
    businessName: "Business Name",
    purpose: "Loan Purpose",
    workingCapital: "Working Capital Requirement",
    businessDetailsTitle: "Business details",
    businessDetailsBody:
      "Annual business revenue: attach your last year ITR-V under Income proof in the document checklist below for income verification.",
    yearOfIncorporation: "Year of incorporation",
    yearPlaceholder: "e.g. 2018",
    annualRevenue: "Annual business revenue (last year)",
    annualRevenuePlaceholder: "Per last year ITR",
    saveDraft: "Save Draft",
    saveAndSubmit: "Save and Submit",
  },
  docs: {
    checklistTitle: "Required document checklist",
    checklistHome: "Home loan: upload ID, income, bank statements, and property-related documents.",
    checklistBusiness: "Business loan: upload ID, income, bank statements, and business registration.",
    approvedCount: "{n}/{total} approved",
    receivedCount: "{n}/{total} received",
    notUploaded: "Not uploaded",
    reuploadHint: "Ops requested a new file — use “Replace file” below.",
    checklistFooter:
      "Use Add another document for each required type (and optional Other extras). Status changes after operations reviews your files.",
    title: "Documents",
    body: "Upload PDF, PNG, or JPG up to 10 MB. Status updates appear after operations review.",
    replaceTitle: "Replace files (re-upload requested)",
    replaceBody: "Operations marked these documents for a new upload. Replace each one with a corrected file.",
    previous: "Previous: {name}",
    replaceFile: "Replace file",
    uploading: "Uploading…",
    addTitle: "Add another document",
    documentType: "Document type",
    file: "File",
    upload: "Upload",
    uploadsClosed: "Uploads are closed for this application status.",
    allFiles: "All uploaded files",
    empty: "No documents yet.",
    download: "View / Download",
    supabaseMissing: "Supabase client not configured.",
    chooseFile: "Please choose a file.",
    fileTooLarge: "File must be 10 MB or smaller.",
    fileType: "Only PDF, PNG, and JPG files are allowed.",
    chooseType: "Please select a document type.",
    signedIn: "You must be signed in.",
    downloadLink: "Could not create download link.",
    bucketMissing:
      "Document storage is not set up yet. Please contact support, or try again after storage is configured.",
    uploaded: "Document uploaded.",
    chooseReplacement: "Please choose a replacement file.",
    replaced: "Document replaced. Our team will review the new file.",
  },
  repayment: {
    title: "Repayment schedule",
    loadError: "Could not load schedule: {error}",
    body: "Your EMI plan as shared by the team. For questions, contact support through your application.",
    colNum: "#",
    colDue: "Due",
    colEmi: "EMI",
    colPrincipal: "Principal",
    colInterest: "Interest",
    colBalance: "Balance",
    colStatus: "Status",
    colPaid: "Paid",
    colNotes: "Notes",
  },
};

export const dashboardHi: DashboardDictionary = {
  nav: {
    dashboard: "डैशबोर्ड",
    loans: "मेरे लोन",
    applications: "मेरे आवेदन",
    documents: "मेरे दस्तावेज़",
    advisory: "सलाह",
    profile: "मेरी प्रोफ़ाइल",
    customerNav: "ग्राहक नेविगेशन",
    closeSidebar: "साइडबार बंद करें",
    toggleMenu: "मेनू खोलें या बंद करें",
    search: "खोज",
    searchPlaceholder: "खोज (जल्द आ रहा है)",
    account: "खाता",
    signOut: "साइन आउट",
    adminPanel: "एडमिन पैनल",
  },
  common: {
    open: "खोलें",
    view: "देखें",
    submit: "जमा करें",
    homeLoan: "होम लोन",
    businessLoan: "बिजनेस लोन",
    loanTypes: { home: "होम", business: "बिजनेस" },
    appStatus: {
      Draft: "ड्राफ्ट",
      Submitted: "जमा किया गया",
      Verified: "सत्यापित",
      Processing: "प्रक्रिया में",
      Approved: "स्वीकृत",
      Disbursed: "वितरित",
    },
    docStatus: {
      Uploaded: "अपलोड हुआ",
      "Under Review": "समीक्षा में",
      Approved: "स्वीकृत",
      "Re-upload": "फिर अपलोड करें",
    },
    docTypes: {
      id_proof: "पहचान प्रमाण",
      income_proof: "आय प्रमाण",
      bank_statement: "बैंक स्टेटमेंट",
      property_docs: "संपत्ति दस्तावेज़",
      business_registration: "व्यवसाय पंजीकरण",
      other: "अन्य",
    },
    emiStatus: {
      scheduled: "निर्धारित",
      paid: "भुगतान हुआ",
      partial: "आंशिक",
      waived: "माफ़",
    },
    advisoryStatus: {
      open: "खुला",
      in_progress: "प्रगति में",
      resolved: "हल हुआ",
      closed: "बंद",
    },
    advisoryCategories: {
      general: "सामान्य",
      loan: "लोन / आवेदन",
      documents: "दस्तावेज़",
      payments: "भुगतान / EMI",
      other: "अन्य",
    },
    fields: {
      fullName: "पूरा नाम",
      email: "ईमेल",
      phone: "फ़ोन",
      address: "पता",
    },
  },
  home: {
    title: "डैशबोर्ड",
    subtitle: "आपके आवेदनों, लोन और अनुरोधों का सारांश।",
    applications: "आवेदन",
    inProgress: "प्रगति में",
    activeLoans: "सक्रिय लोन",
    documents: "दस्तावेज़",
    draftOne: "{n} ड्राफ्ट",
    draftMany: "{n} ड्राफ्ट",
    inProgressSub: "जमा → प्रक्रिया में",
    loansSub: "स्वीकृत या वितरित",
    documentsSub: "अपलोड की गई फ़ाइलें",
    profileAlertTitle: "लोन आवेदन के लिए अपनी प्रोफ़ाइल पूरी करें",
    profileAlertMissing: "अधूरा: {items}।",
    profileAlertCta: "मेरी प्रोफ़ाइल पर जाएँ →",
    quickActions: "त्वरित क्रियाएँ",
    startApplication: "आवेदन शुरू करें या जारी रखें",
    viewDocuments: "सभी अपलोड दस्तावेज़ देखें",
    advisorySupport: "सलाह सहायता",
    openCount: "{n} खुले",
    accountProfile: "खाता और प्रोफ़ाइल",
    needHelp: "मदद चाहिए?",
    needHelpBody: "हमारी टीम को संदेश भेजें — हम आपके सलाह थ्रेड में जवाब देंगे।",
    openAdvisory: "सलाह खोलें",
  },
  applications: {
    title: "मेरे आवेदन",
    subtitle: "ड्राफ्ट बनाएँ, विवरण पूरा करें, और तैयार होने पर जमा करें।",
    profileAlertTitle: "लोन आवेदन से पहले अपनी प्रोफ़ाइल पूरी करें",
    profileAlertCta: "मेरी प्रोफ़ाइल पर जाएँ →",
    startTitle: "नया आवेदन शुरू करें",
    startBody: "ड्राफ्ट खोलने के लिए लोन प्रकार चुनें। स्थिति ड्राफ्ट होने पर आप आवेदन पृष्ठ से जमा कर सकते हैं।",
    newHome: "नया होम लोन",
    newBusiness: "नया बिजनेस लोन",
    completeProfileTitle: "आवेदन शुरू करने से पहले प्रोफ़ाइल पूरी करें",
    completeProfileSubmitTitle: "जमा करने से पहले प्रोफ़ाइल पूरी करें",
    listTitle: "आपके आवेदन",
    loadError: "आवेदन लोड नहीं हो सके: {error}",
    empty: "अभी कोई आवेदन नहीं। ऊपर ड्राफ्ट बनाएँ।",
    colLoan: "लोन",
    colStatus: "स्थिति",
    colCreated: "बनाया गया",
    colActions: "क्रियाएँ",
    idPrefix: "आईडी {id}…",
  },
  loans: {
    title: "मेरे लोन",
    subtitle: "स्वीकृत और वितरित आवेदन — दस्तावेज़, EMI शेड्यूल और विवरण के लिए केस खोलें।",
    emptyTitle: "अभी कोई सक्रिय लोन नहीं",
    emptyBody: "जब आवेदन स्वीकृत या वितरित होगा, वह यहाँ दिखेगा।",
    viewApplications: "आवेदन देखें",
    loanLabel: "{type} लोन",
    cardBody: "दस्तावेज़, पुनर्भुगतान शेड्यूल (जब उपलब्ध हो) और लोन विवरण देखने के लिए आवेदन खोलें।",
    viewLoan: "लोन देखें",
  },
  documentsPage: {
    title: "मेरे दस्तावेज़",
    subtitle: "आपके सभी आवेदनों की अपलोड फ़ाइलें, नई सबसे ऊपर।",
    emptyTitle: "अभी कोई दस्तावेज़ अपलोड नहीं",
    emptyBody: "कोई आवेदन खोलें और दस्तावेज़ अनुभाग से अपलोड करें।",
    goApplications: "आवेदनों पर जाएँ",
    colDocument: "दस्तावेज़",
    colApplication: "आवेदन",
    colStatus: "स्थिति",
    colUploaded: "अपलोड समय",
    colOpen: "खोलें",
  },
  advisory: {
    title: "सलाह",
    subtitle: "टीम से प्रश्न पूछें या समस्या बताएँ। अपडेट होने पर जवाब यहीं दिखेगा।",
    raiseTitle: "नया अनुरोध भेजें",
    subject: "विषय",
    subjectPlaceholder: "संक्षिप्त सारांश",
    category: "श्रेणी",
    relatedApplication: "संबंधित आवेदन (वैकल्पिक)",
    none: "— कोई नहीं —",
    details: "विवरण",
    detailsPlaceholder: "बताएँ कि आपको किसमें मदद चाहिए।",
    submit: "अनुरोध जमा करें",
    listTitle: "आपके अनुरोध",
    loadError: "अनुरोध लोड नहीं हो सके: {error}",
    empty: "अभी कोई अनुरोध नहीं।",
    teamResponse: "टीम का जवाब",
    submitted: "जमा किया गया {when}",
    linkedApplication: "जुड़ा आवेदन",
  },
  profile: {
    title: "मेरी प्रोफ़ाइल",
    subtitle: "संपर्क विवरण अपडेट रखें। लोन आवेदन शुरू करने से पहले पूरी प्रोफ़ाइल आवश्यक है।",
    schemaTitle: "डेटाबेस सेटअप आवश्यक",
    requiredTitle: "पहले अपनी प्रोफ़ाइल पूरी करें",
    requiredBody: "कृपया भरें: {items}। उसके बाद आप लोन आवेदन बना या जमा कर सकते हैं।",
    completeBadge: "प्रोफ़ाइल पूरी है — आप लोन के लिए आवेदन कर सकते हैं",
    incompleteBadge: "प्रोफ़ाइल अधूरी है — आवेदन के लिए नीचे फ़ॉर्म पूरा करें",
    contactDetails: "संपर्क विवरण",
    signInEmail:
      "आपका साइन-इन ईमेल {email} है। यहाँ संपर्क ईमेल भी रख सकते हैं; कम से कम एक आवश्यक है।",
    noAccountEmail: "खाते पर अभी ईमेल नहीं है — संपर्क के लिए ईमेल लिखें।",
    altPhone: "अन्य फ़ोन",
    altPhoneHint: "वैकल्पिक दूसरा नंबर।",
    save: "प्रोफ़ाइल सहेजें",
    account: "खाता",
    userId: "यूज़र आईडी",
    role: "भूमिका",
    session: "सेशन",
    sessionBody: "काम पूरा होने पर इस डिवाइस से साइन आउट करें, खासकर साझा कंप्यूटर पर।",
  },
  applicationDetail: {
    notFound: "आवेदन नहीं मिला या आपके पास पहुँच नहीं है।",
    back: "आवेदनों पर वापस जाएँ",
    heading: "{type} लोन आवेदन फ़ॉर्म",
    applicationId: "आवेदन आईडी: {id}",
    status: "स्थिति: {status}",
    loadDetailsError: "मौजूदा विवरण लोड नहीं हो सके: {error}",
    loadDocumentsError: "दस्तावेज़ लोड नहीं हो सके: {error}",
    propertyAddress: "संपत्ति का पता",
    propertyValue: "संपत्ति मूल्य",
    downPayment: "डाउन पेमेंट",
    loanAmount: "लोन राशि",
    applicantCount: "आवेदकों की संख्या",
    employmentTitle: "रोज़गार विवरण",
    employmentBody:
      "बताएँ कि आपकी आय सेवा (वेतन) से है या व्यवसाय से, और आकलन के लिए वार्षिक राशि लिखें।",
    occupation: "व्यवसाय / रोज़गार",
    occupationSelect: "चुनें…",
    occupationService: "सेवा (वेतनभोगी)",
    occupationBusiness: "व्यवसाय (स्व-रोज़गार / व्यापार)",
    annualSalary: "वार्षिक वेतन / व्यावसायिक आय",
    annualSalaryPlaceholder: "प्रति वर्ष राशि",
    businessName: "व्यवसाय का नाम",
    purpose: "लोन का उद्देश्य",
    workingCapital: "कार्यशील पूंजी की आवश्यकता",
    businessDetailsTitle: "व्यवसाय विवरण",
    businessDetailsBody:
      "वार्षिक व्यावसायिक आय: आय सत्यापन के लिए नीचे दस्तावेज़ सूची में आय प्रमाण के अंतर्गत पिछले वर्ष का ITR-V जोड़ें।",
    yearOfIncorporation: "स्थापना वर्ष",
    yearPlaceholder: "जैसे 2018",
    annualRevenue: "वार्षिक व्यावसायिक आय (पिछला वर्ष)",
    annualRevenuePlaceholder: "पिछले वर्ष ITR के अनुसार",
    saveDraft: "ड्राफ्ट सहेजें",
    saveAndSubmit: "सहेजें और जमा करें",
  },
  docs: {
    checklistTitle: "आवश्यक दस्तावेज़ सूची",
    checklistHome: "होम लोन: पहचान, आय, बैंक स्टेटमेंट और संपत्ति संबंधी दस्तावेज़ अपलोड करें।",
    checklistBusiness: "बिजनेस लोन: पहचान, आय, बैंक स्टेटमेंट और व्यवसाय पंजीकरण अपलोड करें।",
    approvedCount: "{n}/{total} स्वीकृत",
    receivedCount: "{n}/{total} प्राप्त",
    notUploaded: "अपलोड नहीं",
    reuploadHint: "ऑप्स ने नई फ़ाइल माँगी है — नीचे “फ़ाइल बदलें” का उपयोग करें।",
    checklistFooter:
      "हर आवश्यक प्रकार के लिए दूसरा दस्तावेज़ जोड़ें (और वैकल्पिक अन्य फ़ाइलें)। समीक्षा के बाद स्थिति बदलेगी।",
    title: "दस्तावेज़",
    body: "PDF, PNG या JPG, अधिकतम 10 MB। समीक्षा के बाद स्थिति अपडेट होगी।",
    replaceTitle: "फ़ाइलें बदलें (फिर अपलोड का अनुरोध)",
    replaceBody: "ऑप्स ने इन दस्तावेज़ों के लिए नई अपलोड माँगी है। प्रत्येक को सही फ़ाइल से बदलें।",
    previous: "पिछली: {name}",
    replaceFile: "फ़ाइल बदलें",
    uploading: "अपलोड हो रहा है…",
    addTitle: "दूसरा दस्तावेज़ जोड़ें",
    documentType: "दस्तावेज़ प्रकार",
    file: "फ़ाइल",
    upload: "अपलोड करें",
    uploadsClosed: "इस आवेदन स्थिति पर अपलोड बंद हैं।",
    allFiles: "सभी अपलोड फ़ाइलें",
    empty: "अभी कोई दस्तावेज़ नहीं।",
    download: "देखें / डाउनलोड",
    supabaseMissing: "Supabase क्लाइंट सेट नहीं है।",
    chooseFile: "कृपया एक फ़ाइल चुनें।",
    fileTooLarge: "फ़ाइल 10 MB या उससे छोटी होनी चाहिए।",
    fileType: "केवल PDF, PNG और JPG फ़ाइलें मान्य हैं।",
    chooseType: "कृपया दस्तावेज़ प्रकार चुनें।",
    signedIn: "आपको साइन इन होना चाहिए।",
    downloadLink: "डाउनलोड लिंक नहीं बन सका।",
    bucketMissing: "दस्तावेज़ स्टोरेज अभी सेट नहीं है। कृपया सहायता से संपर्क करें।",
    uploaded: "दस्तावेज़ अपलोड हो गया।",
    chooseReplacement: "कृपया नई फ़ाइल चुनें।",
    replaced: "दस्तावेज़ बदल दिया गया। टीम नई फ़ाइल की समीक्षा करेगी।",
  },
  repayment: {
    title: "पुनर्भुगतान शेड्यूल",
    loadError: "शेड्यूल लोड नहीं हो सका: {error}",
    body: "टीम द्वारा साझा किया गया आपका EMI प्लान। प्रश्न हो तो आवेदन के माध्यम से सहायता लें।",
    colNum: "#",
    colDue: "देय तिथि",
    colEmi: "EMI",
    colPrincipal: "मूलधन",
    colInterest: "ब्याज",
    colBalance: "शेष",
    colStatus: "स्थिति",
    colPaid: "भुगतान",
    colNotes: "नोट्स",
  },
};

export const dashboardMr: DashboardDictionary = {
  nav: {
    dashboard: "डॅशबोर्ड",
    loans: "माझे लोन",
    applications: "माझे अर्ज",
    documents: "माझी कागदपत्रे",
    advisory: "सल्ला",
    profile: "माझी प्रोफाइल",
    customerNav: "ग्राहक नेव्हिगेशन",
    closeSidebar: "साइडबार बंद करा",
    toggleMenu: "मेनू उघडा किंवा बंद करा",
    search: "शोध",
    searchPlaceholder: "शोध (लवकरच)",
    account: "खाते",
    signOut: "साइन आउट",
    adminPanel: "अॅडमिन पॅनेल",
  },
  common: {
    open: "उघडा",
    view: "पहा",
    submit: "सादर करा",
    homeLoan: "होम लोन",
    businessLoan: "बिझनेस लोन",
    loanTypes: { home: "होम", business: "बिझनेस" },
    appStatus: {
      Draft: "मसुदा",
      Submitted: "सादर केले",
      Verified: "सत्यापित",
      Processing: "प्रक्रियेत",
      Approved: "मंजूर",
      Disbursed: "वितरित",
    },
    docStatus: {
      Uploaded: "अपलोड झाले",
      "Under Review": "तपासणीत",
      Approved: "मंजूर",
      "Re-upload": "पुन्हा अपलोड",
    },
    docTypes: {
      id_proof: "ओळख पुरावा",
      income_proof: "उत्पन्न पुरावा",
      bank_statement: "बँक स्टेटमेंट",
      property_docs: "मालमत्ता कागदपत्रे",
      business_registration: "व्यवसाय नोंदणी",
      other: "इतर",
    },
    emiStatus: {
      scheduled: "नियोजित",
      paid: "भरले",
      partial: "अंशतः",
      waived: "माफ",
    },
    advisoryStatus: {
      open: "खुले",
      in_progress: "प्रगतीत",
      resolved: "निकाली",
      closed: "बंद",
    },
    advisoryCategories: {
      general: "सामान्य",
      loan: "लोन / अर्ज",
      documents: "कागदपत्रे",
      payments: "पेमेंट / EMI",
      other: "इतर",
    },
    fields: {
      fullName: "पूर्ण नाव",
      email: "ईमेल",
      phone: "फोन",
      address: "पत्ता",
    },
  },
  home: {
    title: "डॅशबोर्ड",
    subtitle: "तुमचे अर्ज, लोन आणि विनंत्यांचे विहंगावलोकन.",
    applications: "अर्ज",
    inProgress: "प्रगतीत",
    activeLoans: "सक्रिय लोन",
    documents: "कागदपत्रे",
    draftOne: "{n} मसुदा",
    draftMany: "{n} मसुदे",
    inProgressSub: "सादर → प्रक्रियेत",
    loansSub: "मंजूर किंवा वितरित",
    documentsSub: "अपलोड केलेल्या फाइल्स",
    profileAlertTitle: "लोन अर्जासाठी तुमची प्रोफाइल पूर्ण करा",
    profileAlertMissing: "अपुरे: {items}.",
    profileAlertCta: "माझ्या प्रोफाइलवर जा →",
    quickActions: "त्वरित कृती",
    startApplication: "अर्ज सुरू करा किंवा पुढे चालू ठेवा",
    viewDocuments: "सर्व अपलोड कागदपत्रे पहा",
    advisorySupport: "सल्ला मदत",
    openCount: "{n} खुली",
    accountProfile: "खाते आणि प्रोफाइल",
    needHelp: "मदत हवी आहे?",
    needHelpBody: "आमच्या टीमला संदेश पाठवा — आम्ही तुमच्या सल्ला थ्रेडमध्ये उत्तर देऊ.",
    openAdvisory: "सल्ला उघडा",
  },
  applications: {
    title: "माझे अर्ज",
    subtitle: "मसुदे तयार करा, तपशील पूर्ण करा आणि तयार झाल्यावर सादर करा.",
    profileAlertTitle: "लोन अर्ज करण्यापूर्वी प्रोफाइल पूर्ण करा",
    profileAlertCta: "माझ्या प्रोफाइलवर जा →",
    startTitle: "नवा अर्ज सुरू करा",
    startBody: "मसुदा उघडण्यासाठी लोनाचा प्रकार निवडा. स्थिती मसुदा असेल तेव्हा अर्ज पृष्ठावरून सादर करू शकता.",
    newHome: "नवे होम लोन",
    newBusiness: "नवे बिझनेस लोन",
    completeProfileTitle: "अर्ज सुरू करण्यापूर्वी प्रोफाइल पूर्ण करा",
    completeProfileSubmitTitle: "सादर करण्यापूर्वी प्रोफाइल पूर्ण करा",
    listTitle: "तुमचे अर्ज",
    loadError: "अर्ज लोड करता आले नाहीत: {error}",
    empty: "अजून अर्ज नाहीत. वर मसुदा तयार करा.",
    colLoan: "लोन",
    colStatus: "स्थिती",
    colCreated: "तयार केले",
    colActions: "कृती",
    idPrefix: "आयडी {id}…",
  },
  loans: {
    title: "माझे लोन",
    subtitle: "मंजूर आणि वितरित अर्ज — कागदपत्रे, EMI वेळापत्रक आणि तपशीलासाठी केस उघडा.",
    emptyTitle: "अजून सक्रिय लोन नाही",
    emptyBody: "अर्ज मंजूर किंवा वितरित झाल्यावर तो येथे दिसेल.",
    viewApplications: "अर्ज पहा",
    loanLabel: "{type} लोन",
    cardBody: "कागदपत्रे, परतफेडीचे वेळापत्रक (उपलब्ध असल्यास) आणि लोन तपशील पाहण्यासाठी अर्ज उघडा.",
    viewLoan: "लोन पहा",
  },
  documentsPage: {
    title: "माझी कागदपत्रे",
    subtitle: "तुमच्या सर्व अर्जांवरील अपलोड फाइल्स, नवीन प्रथम.",
    emptyTitle: "अजून कागदपत्रे अपलोड नाहीत",
    emptyBody: "अर्ज उघडा आणि कागदपत्रे विभागातून अपलोड करा.",
    goApplications: "अर्जांकडे जा",
    colDocument: "कागदपत्र",
    colApplication: "अर्ज",
    colStatus: "स्थिती",
    colUploaded: "अपलोड वेळ",
    colOpen: "उघडा",
  },
  advisory: {
    title: "सल्ला",
    subtitle: "टीमला प्रश्न विचारा किंवा समस्या कळवा. अपडेट झाल्यावर उत्तर येथे दिसेल.",
    raiseTitle: "नवी विनंती पाठवा",
    subject: "विषय",
    subjectPlaceholder: "थोडक्यात सारांश",
    category: "श्रेणी",
    relatedApplication: "संबंधित अर्ज (पर्यायी)",
    none: "— काही नाही —",
    details: "तपशील",
    detailsPlaceholder: "तुम्हाला कशात मदत हवी ते सांगा.",
    submit: "विनंती सादर करा",
    listTitle: "तुमच्या विनंत्या",
    loadError: "विनंत्या लोड करता आल्या नाहीत: {error}",
    empty: "अजून विनंत्या नाहीत.",
    teamResponse: "टीमचे उत्तर",
    submitted: "सादर केले {when}",
    linkedApplication: "जोडलेला अर्ज",
  },
  profile: {
    title: "माझी प्रोफाइल",
    subtitle: "संपर्क तपशील अद्ययावत ठेवा. लोन अर्ज सुरू करण्यापूर्वी पूर्ण प्रोफाइल आवश्यक आहे.",
    schemaTitle: "डेटाबेस सेटअप आवश्यक",
    requiredTitle: "आधी प्रोफाइल पूर्ण करा",
    requiredBody: "कृपया भरा: {items}. त्यानंतर तुम्ही लोन अर्ज तयार किंवा सादर करू शकता.",
    completeBadge: "प्रोफाइल पूर्ण आहे — तुम्ही लोनसाठी अर्ज करू शकता",
    incompleteBadge: "प्रोफाइल अपूर्ण आहे — अर्जासाठी खालील फॉर्म पूर्ण करा",
    contactDetails: "संपर्क तपशील",
    signInEmail:
      "तुमचा साइन-इन ईमेल {email} आहे. येथे संपर्क ईमेलही ठेवू शकता; किमान एक आवश्यक आहे.",
    noAccountEmail: "खात्यावर अद्याप ईमेल नाही — संपर्कसाठी ईमेल लिहा.",
    altPhone: "इतर फोन",
    altPhoneHint: "पर्यायी दुसरा क्रमांक.",
    save: "प्रोफाइल जतन करा",
    account: "खाते",
    userId: "यूजर आयडी",
    role: "भूमिका",
    session: "सेशन",
    sessionBody: "काम झाल्यावर या डिव्हाइसवरून साइन आउट करा, विशेषतः सामायिक संगणकावर.",
  },
  applicationDetail: {
    notFound: "अर्ज सापडला नाही किंवा तुम्हाला प्रवेश नाही.",
    back: "अर्जांकडे परत जा",
    heading: "{type} लोन अर्ज फॉर्म",
    applicationId: "अर्ज आयडी: {id}",
    status: "स्थिती: {status}",
    loadDetailsError: "विद्यमान तपशील लोड करता आले नाहीत: {error}",
    loadDocumentsError: "कागदपत्रे लोड करता आली नाहीत: {error}",
    propertyAddress: "मालमत्तेचा पत्ता",
    propertyValue: "मालमत्तेचे मूल्य",
    downPayment: "डाउन पेमेंट",
    loanAmount: "लोन रक्कम",
    applicantCount: "अर्जदारांची संख्या",
    employmentTitle: "रोजगार तपशील",
    employmentBody:
      "तुमचे उत्पन्न नोकरीतून आहे की व्यवसायातून ते सांगा, आणि मूल्यांकनासाठी वार्षिक रक्कम लिहा.",
    occupation: "व्यवसाय / रोजगार",
    occupationSelect: "निवडा…",
    occupationService: "नोकरी (पगारदार)",
    occupationBusiness: "व्यवसाय (स्वयंरोजगार / व्यापार)",
    annualSalary: "वार्षिक पगार / व्यावसायिक उत्पन्न",
    annualSalaryPlaceholder: "दरवर्षी रक्कम",
    businessName: "व्यवसायाचे नाव",
    purpose: "लोनाचा उद्देश",
    workingCapital: "कार्यशील भांडवलाची गरज",
    businessDetailsTitle: "व्यवसाय तपशील",
    businessDetailsBody:
      "वार्षिक व्यावसायिक उत्पन्न: उत्पन्न पडताळणीसाठी खालील यादीत उत्पन्न पुराव्याखाली गेल्या वर्षीचा ITR-V जोडा.",
    yearOfIncorporation: "स्थापना वर्ष",
    yearPlaceholder: "उदा. 2018",
    annualRevenue: "वार्षिक व्यावसायिक उत्पन्न (मागील वर्ष)",
    annualRevenuePlaceholder: "मागील वर्ष ITR नुसार",
    saveDraft: "मसुदा जतन करा",
    saveAndSubmit: "जतन करा आणि सादर करा",
  },
  docs: {
    checklistTitle: "आवश्यक कागदपत्रांची यादी",
    checklistHome: "होम लोन: ओळख, उत्पन्न, बँक स्टेटमेंट आणि मालमत्ता कागदपत्रे अपलोड करा.",
    checklistBusiness: "बिझनेस लोन: ओळख, उत्पन्न, बँक स्टेटमेंट आणि व्यवसाय नोंदणी अपलोड करा.",
    approvedCount: "{n}/{total} मंजूर",
    receivedCount: "{n}/{total} प्राप्त",
    notUploaded: "अपलोड नाही",
    reuploadHint: "ऑप्सने नवी फाइल मागितली आहे — खाली “फाइल बदला” वापरा.",
    checklistFooter:
      "प्रत्येक आवश्यक प्रकारासाठी आणखी कागदपत्र जोडा (आणि पर्यायी इतर फाइल्स). तपासणीनंतर स्थिती बदलेल.",
    title: "कागदपत्रे",
    body: "PDF, PNG किंवा JPG, कमाल 10 MB. तपासणीनंतर स्थिती अपडेट होते.",
    replaceTitle: "फाइल्स बदला (पुन्हा अपलोड विनंती)",
    replaceBody: "ऑप्सने या कागदपत्रांसाठी नवी अपलोड मागितली आहे. प्रत्येक योग्य फाइलने बदला.",
    previous: "मागील: {name}",
    replaceFile: "फाइल बदला",
    uploading: "अपलोड होत आहे…",
    addTitle: "आणखी कागदपत्र जोडा",
    documentType: "कागदपत्राचा प्रकार",
    file: "फाइल",
    upload: "अपलोड करा",
    uploadsClosed: "या अर्ज स्थितीसाठी अपलोड बंद आहेत.",
    allFiles: "सर्व अपलोड फाइल्स",
    empty: "अजून कागदपत्रे नाहीत.",
    download: "पहा / डाउनलोड",
    supabaseMissing: "Supabase क्लायंट सेट नाही.",
    chooseFile: "कृपया फाइल निवडा.",
    fileTooLarge: "फाइल 10 MB किंवा त्याहून छोटी असावी.",
    fileType: "फक्त PDF, PNG आणि JPG फाइल्स चालतात.",
    chooseType: "कृपया कागदपत्राचा प्रकार निवडा.",
    signedIn: "तुम्ही साइन इन असणे आवश्यक आहे.",
    downloadLink: "डाउनलोड लिंक तयार करता आली नाही.",
    bucketMissing: "कागदपत्र स्टोरेज अद्याप सेट नाही. कृपया सपोर्टशी संपर्क करा.",
    uploaded: "कागदपत्र अपलोड झाले.",
    chooseReplacement: "कृपया नवी फाइल निवडा.",
    replaced: "कागदपत्र बदलले. टीम नवी फाइल तपासेल.",
  },
  repayment: {
    title: "परतफेडीचे वेळापत्रक",
    loadError: "वेळापत्रक लोड करता आले नाही: {error}",
    body: "टीमने शेअर केलेली तुमची EMI योजना. प्रश्न असल्यास अर्जाद्वारे सपोर्टशी संपर्क करा.",
    colNum: "#",
    colDue: "देय तारीख",
    colEmi: "EMI",
    colPrincipal: "मुद्दल",
    colInterest: "व्याज",
    colBalance: "शिल्लक",
    colStatus: "स्थिती",
    colPaid: "भरले",
    colNotes: "नोंदी",
  },
};
