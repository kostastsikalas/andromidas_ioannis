import type { Localized } from "./site";

export const doctor = {
  bio: {
    el: [
      "Ο Ιωάννης Ανδρομιδάς είναι Χειρουργός Ωτορινολαρυγγολόγος ενηλίκων και παίδων και διατηρεί ιατρείο στον Λιμένα Χερσονήσου του Ηρακλείου Κρήτης.",
      "Ο ιατρός παρακολουθεί ανελλιπώς τις ιατρικές εξελίξεις και συμμετέχει σε ιατρικά σεμινάρια και συνέδρια.",
    ],
    en: [
      "Dr. Ioannis N. Andromidas is an Ear, Nose & Throat surgeon (Otolaryngologist) for adults and children, practising in Limenas Hersonissos, Heraklion.",
      "The doctor attends medical congresses every year and keeps up to date with medical progress.",
    ],
  } satisfies Localized<string[]>,
  education: {
    el: [
      { title: "Ιατρική Σχολή Πανεπιστημίου Κρήτης", text: "Πτυχίο Ιατρικής" },
      {
        title: "Ειδικότητα Ωτορινολαρυγγολογίας – Χειρουργικής Κεφαλής & Τραχήλου",
        text: "Νοσοκομείο Παίδων «Π&Α Κυριακού» και Γενικό Κρατικό Νοσοκομείο Νίκαιας, με πληθώρα περιστατικών παίδων και ενηλίκων.",
      },
      { title: "Νευροχειρουργική (6 μήνες)", text: "Γενικό Κρατικό Νοσοκομείο Νίκαιας" },
      { title: "Πλαστική Χειρουργική (6 μήνες)", text: "Νοσοκομείο «Άγιοι Ανάργυροι»" },
      {
        title: "Μεταπτυχιακό Δίπλωμα «Παθήσεις σιελογόνων αδένων» (2023)",
        text: "Αριστοτέλειο Πανεπιστήμιο Θεσσαλονίκης",
      },
    ],
    en: [
      { title: "University of Crete Medical School", text: "Degree in Medicine" },
      {
        title: "Specialty training in Otolaryngology – Head & Neck Surgery",
        text: "“P&A Kyriakou” Children’s Hospital and General State Hospital of Nikea, Athens, treating a large adult and paediatric population.",
      },
      { title: "Neurosurgery (6 months)", text: "General State Hospital of Nikea" },
      { title: "Plastic Surgery (6 months)", text: "“Agioi Anargyroi” Hospital" },
      {
        title: "MSc “Diseases of the salivary glands” (2023)",
        text: "Aristotle University of Thessaloniki",
      },
    ],
  } satisfies Localized<{ title: string; text: string }[]>,
  memberships: {
    el: [
      "Ιατρικός Σύλλογος Ηρακλείου",
      "Πανελλήνια Εταιρεία Ωτορινολαρυγγολογίας – Χειρουργικής Κεφαλής και Τραχήλου",
      "Ελληνική Εταιρεία Ογκολογίας Κεφαλής και Τραχήλου",
    ],
    en: [
      "Medical Association of Heraklion",
      "Panhellenic Society of Otolaryngology – Head & Neck Surgery",
      "Hellenic Society of Head & Neck Oncology",
    ],
  } satisfies Localized<string[]>,
};
