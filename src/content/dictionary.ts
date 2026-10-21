import homeContent from "./home.json";
import type { Locale } from "./site";

const el = {
  nav: {
    home: "Αρχική",
    doctor: "Ο Ιατρός",
    services: "Υπηρεσίες",
    articles: "Άρθρα",
    contact: "Επικοινωνία",
  },
  cta: {
    call: "Κλήση",
    callNow: "Καλέστε τώρα",
    directions: "Οδηγίες",
    bookAppointment: "Κλείστε ραντεβού",
    learnMore: "Περισσότερα",
    allServices: "Όλες οι υπηρεσίες",
    allArticles: "Όλα τα άρθρα",
    aboutDoctor: "Γνωρίστε τον ιατρό",
    readArticle: "Διαβάστε",
  },
  menu: { open: "Άνοιγμα μενού", close: "Κλείσιμο μενού" },
  language: { label: "Γλώσσα" },
  hours: {
    title: "Ωράριο ιατρείου",
    byAppointment: "Κατόπιν ραντεβού",
    closed: "Κλειστά",
    openNow: "Ανοιχτά τώρα",
    closedNow: "Κλειστά τώρα",
    today: "Σήμερα",
    emergencies: "Για επείγοντα και ραντεβού καλέστε στο",
  },
  home: homeContent.el,
  services: {
    title: "Υπηρεσίες",
    intro: "Στο ιατρείο παρέχονται οι παρακάτω Ω.Ρ.Λ. υπηρεσίες.",
    conditions: "Συχνές παθήσεις",
    procedures: "Εξετάσεις & πράξεις στο ιατρείο",
    other: "Άλλες υπηρεσίες",
  },
  doctor: {
    title: "Ο Ιατρός",
    education: "Σπουδές & εκπαίδευση",
    memberships: "Μέλος του",
  },
  articles: {
    title: "Άρθρα",
    intro: "Απλά λόγια για συχνά ζητήματα Ωτορινολαρυγγολογίας.",
    disclaimer:
      "Το κείμενο αυτό έχει ως σκοπό να ενημερώσει γενικά για ιατρικά θέματα και δεν υποκαθιστά σε καμία περίπτωση την εξέταση από τον γιατρό σας.",
    greekOnly: "",
    notTranslated: { el: "", en: "" },
    photoCredit: "Φωτογραφία",
  },
  contact: {
    title: "Επικοινωνία",
    intro: "Για ραντεβού και πληροφορίες καλέστε μας στο ιατρείο ή στο κινητό.",
    address: "Διεύθυνση",
    phone: "Τηλέφωνο",
    mobile: "Κινητό",
    office: "Ιατρείο",
    email: "Email",
    map: "Χάρτης",
  },
  footer: {
    rights: "Με την επιφύλαξη παντός δικαιώματος.",
    terms: "Όροι χρήσης",
  },
  notFound: { title: "Η σελίδα δεν βρέθηκε", back: "Επιστροφή στην αρχική" },
};

export type Dictionary = typeof el;

const en: Dictionary = {
  nav: {
    home: "Home",
    doctor: "The Doctor",
    services: "Services",
    articles: "Articles",
    contact: "Contact",
  },
  cta: {
    call: "Call",
    callNow: "Call now",
    directions: "Directions",
    bookAppointment: "Book an appointment",
    learnMore: "Learn more",
    allServices: "All services",
    allArticles: "All articles",
    aboutDoctor: "Meet the doctor",
    readArticle: "Read",
  },
  menu: { open: "Open menu", close: "Close menu" },
  language: { label: "Language" },
  hours: {
    title: "Office hours",
    byAppointment: "By appointment",
    closed: "Closed",
    openNow: "Open now",
    closedNow: "Closed now",
    today: "Today",
    emergencies: "For emergencies and appointments call",
  },
  home: homeContent.en,
  services: {
    title: "Services",
    intro: "The following ENT services are provided at the clinic.",
    conditions: "Common conditions",
    procedures: "Examinations & procedures in the clinic",
    other: "Other services",
  },
  doctor: {
    title: "The Doctor",
    education: "Education & training",
    memberships: "Member of",
  },
  articles: {
    title: "Articles",
    intro: "Plain-language information on common ENT topics.",
    disclaimer:
      "This text is intended for general information on medical topics and in no way replaces an examination by your doctor.",
    greekOnly: "These articles are currently available in Greek only.",
    notTranslated: { el: "This article is currently available in Greek only.", en: "" },
    photoCredit: "Photo",
  },
  contact: {
    title: "Contact",
    intro: "For appointments and information, call the clinic or the mobile number.",
    address: "Address",
    phone: "Phone",
    mobile: "Mobile",
    office: "Office",
    email: "Email",
    map: "Map",
  },
  footer: {
    rights: "All rights reserved.",
    terms: "Terms of use",
  },
  notFound: { title: "Page not found", back: "Back to home" },
};

const de: Dictionary = {
  nav: {
    home: "Startseite",
    doctor: "Der Arzt",
    services: "Leistungen",
    articles: "Artikel",
    contact: "Kontakt",
  },
  cta: {
    call: "Anrufen",
    callNow: "Jetzt anrufen",
    directions: "Route",
    bookAppointment: "Termin vereinbaren",
    learnMore: "Mehr erfahren",
    allServices: "Alle Leistungen",
    allArticles: "Alle Artikel",
    aboutDoctor: "Den Arzt kennenlernen",
    readArticle: "Lesen",
  },
  menu: { open: "Menü öffnen", close: "Menü schließen" },
  language: { label: "Sprache" },
  hours: {
    title: "Sprechzeiten",
    byAppointment: "Nach Vereinbarung",
    closed: "Geschlossen",
    openNow: "Jetzt geöffnet",
    closedNow: "Jetzt geschlossen",
    today: "Heute",
    emergencies: "Für Notfälle und Termine rufen Sie an unter",
  },
  home: homeContent.de,
  services: {
    title: "Leistungen",
    intro: "In der Praxis werden die folgenden HNO-Leistungen angeboten.",
    conditions: "Häufige Erkrankungen",
    procedures: "Untersuchungen & Eingriffe in der Praxis",
    other: "Weitere Leistungen",
  },
  doctor: {
    title: "Der Arzt",
    education: "Studium & Ausbildung",
    memberships: "Mitglied der",
  },
  articles: {
    title: "Artikel",
    intro: "Verständliche Informationen zu häufigen HNO-Themen.",
    disclaimer:
      "Dieser Text dient der allgemeinen Information über medizinische Themen und ersetzt in keinem Fall die Untersuchung durch Ihren Arzt.",
    greekOnly: "Die Artikel sind derzeit nur auf Griechisch bzw. Englisch verfügbar.",
    notTranslated: {
      el: "Dieser Artikel ist derzeit nur auf Griechisch verfügbar.",
      en: "Dieser Artikel ist derzeit nur auf Englisch verfügbar.",
    },
    photoCredit: "Foto",
  },
  contact: {
    title: "Kontakt",
    intro: "Für Termine und Auskünfte rufen Sie bitte in der Praxis oder auf dem Mobiltelefon an.",
    address: "Adresse",
    phone: "Telefon",
    mobile: "Mobil",
    office: "Praxis",
    email: "E-Mail",
    map: "Karte",
  },
  footer: {
    rights: "Alle Rechte vorbehalten.",
    terms: "Nutzungsbedingungen",
  },
  notFound: { title: "Seite nicht gefunden", back: "Zur Startseite" },
};

const dictionaries: Record<Locale, Dictionary> = { el, en, de };

export const getDictionary = (locale: Locale) => dictionaries[locale];
