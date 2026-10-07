import type { Localized } from "./site";

export type ServiceIcon = "child" | "ear" | "nose" | "throat" | "scalpel" | "rx" | "home" | "wave";

export type Service = {
  slug: string;
  icon: ServiceIcon;
  title: Localized;
  summary: Localized;
  intro: Localized<string[]>;
  conditions?: Localized<string[]>;
  procedures?: Localized<{ title: string; text?: string }[]>;
  note?: Localized;
  images?: { src: string; alt: Localized; width: number; height: number }[];
};

export const services: Service[] = [
  {
    slug: "paediatric-ent",
    icon: "child",
    title: { el: "Παιδο-Ω.Ρ.Λ.", en: "Paediatric ENT" },
    summary: {
      el: "Αναπνευστικά προβλήματα, «κρεατάκια», ακοή και υποτροπιάζουσες λοιμώξεις στα παιδιά.",
      en: "Breathing problems, adenoids, hearing and recurrent infections in children.",
    },
    intro: {
      el: [
        "Η Ωτορινολαρυγγολογία των παιδιατρικών ασθενών αφορά συχνά προβλήματα που εμφανίζονται μόνο στα παιδιά και μπορεί να σχετίζονται με δυσχέρεια αναπνοής λόγω υπερτροφίας αμυγδαλών ή αδενοειδών εκβλαστήσεων («κρεατάκια»), με προβλήματα ακοής, με υποτροπιάζουσες λοιμώξεις της περιοχής Ω.Ρ.Λ. ή και μορφώματα της περιοχής.",
        "Οι παιδιατρικοί ασθενείς αποτελούν μια ιδιαίτερα ευαίσθητη ομάδα, της οποίας η εξέταση απαιτεί υπομονή και μια πιο ευαίσθητη προσέγγιση στις ανάγκες των παιδιών.",
        "Με τις ωτοακουστικές εκπομπές (DPOAE και TEOAE) που διαθέτει το ιατρείο γίνεται ο νεογνικός έλεγχος της ακοής, ενώ είναι χρήσιμο εργαλείο και για παιδιά που δεν μπορούν να συνεργαστούν σε άλλες ακοολογικές εξετάσεις.",
      ],
      en: [
        "Paediatric otolaryngology often concerns problems seen only in children, such as breathing difficulties caused by enlarged tonsils or adenoids, hearing problems, recurrent ENT infections or lumps in the head and neck area.",
        "Children are a particularly sensitive group of patients: their examination calls for patience and a gentle approach to each child’s needs.",
        "Using otoacoustic emissions (DPOAE and TEOAE), available at the clinic, newborn hearing screening can be performed. They are also a useful tool for children who cannot cooperate with other hearing tests.",
      ],
    },
    procedures: {
      el: [
        { title: "Τυμπανόγραμμα", text: "Γίνεται σύντομα, αποσπώντας την προσοχή του παιδιού, και δίνει πολύτιμες πληροφορίες." },
        { title: "Ωτοακουστικές εκπομπές", text: "Νεογνικός έλεγχος ακοής." },
      ],
      en: [
        { title: "Tympanometry", text: "Quick to perform while keeping the child distracted, and gives valuable information." },
        { title: "Otoacoustic emissions", text: "Newborn hearing screening." },
      ],
    },
    images: [
      {
        src: "/images/tympanometry-child.jpg",
        alt: { el: "Τυμπανόγραμμα σε παιδί", en: "Tympanometry in a child" },
        width: 1800,
        height: 1350,
      },
    ],
  },
  {
    slug: "newborn-hearing-screening",
    icon: "wave",
    title: { el: "Νεογνικός έλεγχος ακοής", en: "Newborn hearing screening" },
    summary: {
      el: "Ωτοακουστικές εκπομπές DPOAE & TEOAE — σύντομη, ανώδυνη και ακίνδυνη εξέταση.",
      en: "DPOAE & TEOAE otoacoustic emissions — a quick, painless and safe test.",
    },
    intro: {
      el: [
        "Στο ιατρείο πραγματοποιούνται ωτοακουστικές εκπομπές: DPOAE (Ωτοακουστικές Εκπομπές Προϊόντων Ακουστικής Παραμόρφωσης) και TEOAE (Παροδικές Ωτοακουστικές Εκπομπές).",
        "Οι Ωτοακουστικές Εκπομπές (ΩΑΕ) είναι ήχοι που παράγονται από τον κοχλία του υγιούς αυτιού ως απάντηση σε ακουστικά ερεθίσματα που χορηγούνται με ειδική συσκευή. Είναι εξέταση σύντομη, ανώδυνη και ακίνδυνη και το αποτέλεσμά της είναι σαφές. Αν δεν ανιχνευθούν ωτοακουστικές εκπομπές, ίσως χρειαστεί περαιτέρω έλεγχος της ακοής.",
      ],
      en: [
        "The clinic performs otoacoustic emission testing: DPOAE (Distortion Product Otoacoustic Emissions) and TEOAE (Transient Evoked Otoacoustic Emissions).",
        "Otoacoustic emissions (OAE) are sounds produced by the cochlea of a healthy ear in response to sound stimuli delivered by a special device. The test is quick, painless and safe, and the result is clear. If no emissions are detected, further hearing tests may be needed.",
      ],
    },
    procedures: {
      el: [
        { title: "Προληπτικός έλεγχος ακοής νεογνών", text: "Η βασική εξέταση ελέγχου της ακοής σε νεογέννητα και βρέφη, καθώς είναι αντικειμενική και δεν απαιτεί συνεργασία." },
        { title: "Διαγνωστικό βοήθημα", text: "Βοηθά στη διάγνωση του είδους της βαρηκοΐας, σε συνδυασμό με άλλες εξετάσεις." },
        { title: "Αξιολόγηση λειτουργίας κοχλία", text: "Η παρουσία ΩΑΕ σημαίνει ότι ο κοχλίας λειτουργεί και η ακοή είναι φυσιολογική ή σχεδόν φυσιολογική." },
        { title: "Δύσκολα συνεργάσιμοι ασθενείς", text: "Για παιδιά ή ενήλικες που δεν μπορούν να συνεργαστούν σε άλλες μεθόδους μέτρησης της ακοής." },
      ],
      en: [
        { title: "Newborn hearing screening", text: "The main hearing screening test for newborns and infants, as it is objective and needs no cooperation." },
        { title: "Diagnostic aid", text: "Helps identify the type of hearing loss, together with other tests." },
        { title: "Cochlear function", text: "Present emissions mean the cochlea works and hearing is normal or near-normal." },
        { title: "Patients who can’t cooperate", text: "For children or adults who cannot take part in other hearing tests." },
      ],
    },
  },
  {
    slug: "pharyngology-laryngology",
    icon: "throat",
    title: { el: "Φαρυγγολογία – Λαρυγγολογία", en: "Throat & Larynx" },
    summary: {
      el: "Φαρυγγίτιδα, αμυγδαλίτιδα, λαρυγγίτιδα, παλινδρόμηση, σιελογόνοι αδένες.",
      en: "Pharyngitis, tonsillitis, laryngitis, reflux, salivary glands.",
    },
    intro: {
      el: ["Για τη διάγνωση και θεραπεία των παθήσεων του φάρυγγα και του λάρυγγα το ιατρείο διαθέτει άκαμπτα ενδοσκόπια και εύκαμπτο ρινο-φαρυγγο-λαρυγγοσκόπιο με βίντεο."],
      en: ["For the diagnosis and treatment of throat and larynx conditions, the clinic uses rigid endoscopes and a flexible video naso-pharyngo-laryngoscope."],
    },
    conditions: {
      el: ["Φαρυγγίτιδα ιογενής ή μικροβιακή", "Στοματίτιδα", "Αμυγδαλίτιδα", "Φλεγμονή σιελογόνων αδένων", "Λαρυγγίτιδα", "Λαρυγγοφαρυγγική παλινδρόμηση"],
      en: ["Viral or bacterial pharyngitis", "Mouth infections", "Tonsillitis", "Salivary gland inflammation", "Laryngitis", "Laryngopharyngeal reflux"],
    },
    procedures: {
      el: [
        { title: "Επισκόπηση φάρυγγα με μετωπιαίο κάτοπτρο ψυχρού φωτισμού" },
        { title: "Έμμεση λαρυγγοσκόπηση με κάτοπτρο λάρυγγα" },
        { title: "Λαρυγγοσκόπηση με άκαμπτο ή εύκαμπτο ενδοσκόπιο" },
        { title: "Ενδοσκόπηση με βίντεο-εύκαμπτο ενδοσκόπιο ρινός–λάρυγγα" },
        { title: "Βιοψίες με τοπική αναισθησία από τον στοματοφάρυγγα" },
        { title: "Strep-test για τη διάγνωση στρεπτοκοκκικής αμυγδαλίτιδας" },
      ],
      en: [
        { title: "Pharyngeal examination with head lamp" },
        { title: "Indirect laryngoscopy with laryngeal mirror" },
        { title: "Laryngoscopy with rigid or flexible endoscope" },
        { title: "Flexible video-laryngoscopy" },
        { title: "Biopsies of the oropharynx under local anaesthesia" },
        { title: "Strep test for streptococcal tonsillitis" },
      ],
    },
    images: [
      {
        src: "/images/endoscopes.jpg",
        alt: { el: "Άκαμπτα και εύκαμπτα ενδοσκόπια", en: "Rigid and flexible endoscopes" },
        width: 1800,
        height: 1280,
      },
    ],
  },
  {
    slug: "rhinology",
    icon: "nose",
    title: { el: "Ρινολογία", en: "Rhinology" },
    summary: {
      el: "Δυσχέρεια ρινικής αναπνοής, σκολίωση διαφράγματος, ρινοκολπίτιδες, ρινορραγίες.",
      en: "Blocked nose, deviated septum, sinusitis, nosebleeds.",
    },
    intro: {
      el: ["Στο ιατρείο διατίθεται κατάλληλος ενδοσκοπικός εξοπλισμός για τη διάγνωση των ρινολογικών παθήσεων."],
      en: ["The clinic is equipped with modern endoscopes for the diagnosis of nasal conditions."],
    },
    conditions: {
      el: ["Δυσχέρεια ρινικής αναπνοής", "Σκολίωση ρινικού διαφράγματος", "Υπερτροφία ρινικών κογχών", "Ρινορραγίες", "Ξένα σώματα ρινός σε παιδιά", "Ρινοκολπίτιδες", "Μείωση της όσφρησης", "Πολύποδες ρινός"],
      en: ["Nasal breathing difficulty", "Deviated nasal septum", "Turbinate hypertrophy", "Nosebleeds", "Nasal foreign bodies in children", "Sinusitis", "Reduced sense of smell", "Nasal polyps"],
    },
    procedures: {
      el: [
        { title: "Πρόσθια ρινοσκόπηση με μετωπιαίο κάτοπτρο" },
        { title: "Ενδοσκοπικός έλεγχος ρινός–ρινοφάρυγγα με άκαμπτο και εύκαμπτο ενδοσκόπιο" },
        { title: "Ενδοσκόπηση ρινός με βίντεο-εύκαμπτο ενδοσκόπιο" },
        { title: "Βιοψίες από τη μύτη με τοπική αναισθησία υπό ενδοσκοπικό έλεγχο" },
        { title: "Έλεγχος ρινορραγίας με ηλεκτροκαυτηρίαση, χημική καυτηρίαση ή επιπωματισμό" },
      ],
      en: [
        { title: "Anterior rhinoscopy with head lamp" },
        { title: "Endoscopy of the nose and nasopharynx with rigid and flexible endoscope" },
        { title: "Flexible video-endoscopy of the nose" },
        { title: "Endoscopically guided nasal biopsies under local anaesthesia" },
        { title: "Nosebleed control by electrocautery, chemical cautery or packing" },
      ],
    },
    images: [
      {
        src: "/images/endoscopes.jpg",
        alt: { el: "Ενδοσκόπια ρινός", en: "Nasal endoscopes" },
        width: 1800,
        height: 1280,
      },
    ],
  },
  {
    slug: "audiology-otology",
    icon: "ear",
    title: { el: "Ακοολογία – Ωτολογία", en: "Audiology & Otology" },
    summary: {
      el: "Βαρηκοΐα, εμβοές, ίλιγγος, ωτίτιδες, βύσμα κυψελίδας.",
      en: "Hearing loss, tinnitus, vertigo, ear infections, ear wax.",
    },
    intro: {
      el: ["Στο ιατρείο, στο πλαίσιο του ωτολογικού–ακοολογικού ελέγχου, διερευνώνται και αντιμετωπίζονται παθήσεις της ακοής και του αυτιού με ακοογράφο, τυμπανογράφο και ωτομικροσκόπιο."],
      en: ["The clinic investigates and treats hearing and ear conditions using an audiometer, tympanometer and ear microscope."],
    },
    conditions: {
      el: ["Αιφνίδια βαρηκοΐα", "Χρόνια βαρηκοΐα", "Πρεσβυακουσία", "Εμβοές ώτων", "Ίλιγγος", "Απόφραξη ακουστικού πόρου από βύσμα κυψελίδας ή ξένα σώματα", "Εξωτερική ή μέση ωτίτιδα", "Χρόνια ωτίτιδα με ρήξη τυμπανικού υμένα", "Κύστες και μορφώματα πτερυγίου", "Τραύματα του ωτός"],
      en: ["Sudden hearing loss", "Chronic hearing loss", "Presbycusis", "Tinnitus", "Vertigo", "Blocked ear canal (wax or foreign body)", "Outer or middle ear infection", "Chronic otitis with perforated eardrum", "Ear barotrauma", "Cysts and lumps of the ear", "Ear injuries"],
    },
    procedures: {
      el: [
        { title: "Τονική ακοομετρία", text: "Έλεγχος της ακοής, συνήθως από την ηλικία των 4–4,5 ετών." },
        { title: "Τυμπανόγραμμα", text: "Ανώδυνη εξέταση της κινητικότητας του τυμπάνου." },
        { title: "Ακουστικά αντανακλαστικά", text: "Έμμεσες πληροφορίες για την τυμπανική κοιλότητα." },
        { title: "Ωτοακουστικές εκπομπές (DPOAE / TEOAE)" },
        { title: "Έλεγχος νυσταγμού με γυαλιά Frenzel" },
        { title: "Ωτομικροσκόπηση" },
        { title: "Χειρισμοί ιλίγγου θέσεως", text: "Διαγνωστικοί και θεραπευτικοί." },
        { title: "Επεμβάσεις στο αυτί με τοπική αναισθησία υπό ωτομικροσκόπιο" },
      ],
      en: [
        { title: "Pure-tone audiometry", text: "Hearing test, usually from age 4–4.5." },
        { title: "Tympanometry", text: "Painless test of eardrum mobility." },
        { title: "Acoustic reflexes", text: "Indirect information about the middle ear." },
        { title: "Otoacoustic emissions (DPOAE / TEOAE)" },
        { title: "Nystagmus assessment with Frenzel goggles" },
        { title: "Ear microscopy and rigid ear endoscopy" },
        { title: "BPPV (positional vertigo) manoeuvres", text: "Diagnostic and therapeutic." },
        { title: "Minor ear procedures under local anaesthesia" },
      ],
    },
    images: [
      {
        src: "/images/audiometer.jpg",
        alt: { el: "Ακοογράφος – τυμπανογράφος", en: "Audiometer and tympanometer" },
        width: 1800,
        height: 1350,
      },
      {
        src: "/images/ear-microscope.jpg",
        alt: { el: "Ωτομικροσκόπιο", en: "Ear microscope" },
        width: 1800,
        height: 1350,
      },
    ],
  },
  {
    slug: "surgical-procedures",
    icon: "scalpel",
    title: { el: "Επεμβάσεις", en: "Surgical procedures" },
    summary: {
      el: "Μικροεπεμβάσεις στο ιατρείο και χειρουργεία σε ιδιωτική κλινική του Ηρακλείου.",
      en: "Minor procedures in the clinic and operations at a private clinic in Heraklion.",
    },
    intro: {
      el: [
        "Μικροεπεμβάσεις στο ιατρείο, με τοπική αναισθησία εφόσον απαιτείται και ενδείκνυται.",
        "Χειρουργικές επεμβάσεις σε ιδιωτική κλινική του Ηρακλείου, με τοπική ή γενική αναισθησία ανάλογα με την επέμβαση. Για τις επεμβάσεις στο ιατρείο χρησιμοποιείται διαθερμία και ραδιοσυχνότητες.",
      ],
      en: [
        "Minor procedures in the clinic, under local anaesthesia where needed and indicated.",
        "Operations at a private clinic in Heraklion, under local or general anaesthesia depending on the procedure and the patient’s condition. Diathermy and radiofrequency are used for in-office procedures.",
      ],
    },
    procedures: {
      el: [
        { title: "Καθαρισμός βύσματος κυψελίδας ώτων" },
        { title: "Χημικός καυτηριασμός ρινικής επίσταξης / ηλεκτροκαυτηρίαση" },
        { title: "Αφαίρεση–βιοψία μικρών μορφωμάτων κεφαλής–τραχήλου" },
        { title: "Αφαίρεση ξένων σωμάτων ωτός, ρινός, φάρυγγα, λάρυγγα" },
        { title: "Ανάταξη πρόσφατου ρινικού κατάγματος" },
        { title: "Συρραφή θλαστικών τραυμάτων" },
      ],
      en: [
        { title: "Ear wax removal with suction or forceps" },
        { title: "Nosebleed control by cautery or electrocautery" },
        { title: "Removal and biopsy of small head & neck lumps" },
        { title: "Removal of foreign bodies from ear, nose, pharynx, larynx" },
        { title: "Reduction of recent nasal fracture" },
        { title: "Suturing of lacerations" },
      ],
    },
    images: [
      {
        src: "/images/surgical-instruments.jpg",
        alt: { el: "Χειρουργικά εργαλεία", en: "Surgical instruments" },
        width: 1800,
        height: 1350,
      },
    ],
  },
  {
    slug: "e-prescriptions",
    icon: "rx",
    title: { el: "Ηλεκτρονική συνταγογράφηση", en: "E-prescriptions" },
    summary: {
      el: "Φάρμακα, εξετάσεις και ακουστικά βαρηκοΐας.",
      en: "Medication, tests and hearing aids.",
    },
    intro: {
      el: ["Ο ιατρός είναι πιστοποιημένος για ηλεκτρονική συνταγογράφηση."],
      en: ["The doctor is certified for electronic prescribing."],
    },
    procedures: {
      el: [{ title: "Φαρμάκων" }, { title: "Εξετάσεων (αιματολογικές, απεικονιστικές κ.ά.)" }, { title: "Ακουστικών βαρηκοΐας" }],
      en: [{ title: "Medication" }, { title: "Laboratory and imaging tests" }, { title: "Hearing aids" }],
    },
  },
  {
    slug: "home-visits",
    icon: "home",
    title: { el: "Επισκέψεις κατ’ οίκον", en: "Home visits" },
    summary: {
      el: "Για ηλικιωμένους ή ασθενείς που δεν μπορούν να μετακινηθούν.",
      en: "For elderly patients or those who cannot travel.",
    },
    intro: {
      el: ["Με φορητό εξοπλισμό υπάρχει δυνατότητα κατ’ οίκον επισκέψεων για την εξυπηρέτηση ηλικιωμένων ασθενών ή ασθενών που δεν μπορούν να μετακινηθούν λόγω κινητικών ή άλλων προβλημάτων."],
      en: ["With portable equipment, home visits are available for elderly patients or patients who cannot travel due to mobility or other problems."],
    },
    procedures: {
      el: [
        { title: "Βασική Ω.Ρ.Λ. εξέταση" },
        { title: "Επισκόπηση ώτων, ρινός, φάρυγγα με μετωπιαίο κάτοπτρο" },
        { title: "Ωτοσκόπηση και καθαρισμός ακουστικού πόρου από βύσμα κυψελίδας", text: "Με φορητή αναρρόφηση ή ειδικά άγκιστρα και χειρουργικά εργαλεία ώτων." },
        { title: "Ενδοσκόπηση ρινός, ρινοφάρυγγα, λάρυγγα", text: "Με εύκαμπτο ή άκαμπτο ενδοσκόπιο και φορητή πηγή φωτός." },
      ],
      en: [
        { title: "Basic ENT examination" },
        { title: "Examination of ears, nose and throat with head lamp" },
        { title: "Otoscopy and ear wax removal", text: "With portable suction or special hooks and ear instruments." },
        { title: "Endoscopy of nose, nasopharynx and larynx", text: "With flexible or rigid endoscope and portable light source." },
      ],
    },
    note: {
      el: "Κατά τον προγραμματισμό της επίσκεψης ενημερώστε τον ιατρό για το είδος του προβλήματος, ώστε να έχει μαζί του τον κατάλληλο εξοπλισμό.",
      en: "When booking a visit, please describe the problem so the doctor can bring the right equipment.",
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
