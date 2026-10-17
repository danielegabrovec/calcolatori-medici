// Registro Centrale dei Calcolatori Medici
// Architettura Gerarchica: Macroaree -> Sottoaree -> Calcolatori

const MACROAREAS = [
  {
    "id": "all",
    "name": "Tutti i Calcolatori",
    "icon": "🏥",
    "subareas": []
  },
  {
    "id": "nutrizione",
    "name": "Nutrizione & Metabolismo",
    "icon": "🥗",
    "subareas": [
      {
        "id": "nutri-bmr",
        "name": "Dispendio Energetico & BMR"
      },
      {
        "id": "nutri-antropo",
        "name": "Antropometria & Composizione Corporea"
      },
      {
        "id": "nutri-clinica",
        "name": "Nutrizione Clinica & Fabbisogni"
      }
    ]
  },
  {
    "id": "cardiologia",
    "name": "Cardiologia & Vascolare",
    "icon": "❤️",
    "subareas": [
      {
        "id": "cardio-fa",
        "name": "Fibrillazione Atriale & Rischio Tromboembolico"
      },
      {
        "id": "cardio-sca",
        "name": "Sindromi Coronariche Acute & Ischemia"
      },
      {
        "id": "cardio-ecg",
        "name": "Elettrocardiografia & Aritmie"
      },
      {
        "id": "cardio-emodinamica",
        "name": "Emodinamica & Pressioni"
      }
    ]
  },
  {
    "id": "nefrologia",
    "name": "Nefrologia & Idroelettrolitico",
    "icon": "💧",
    "subareas": [
      {
        "id": "nefro-gfr",
        "name": "Filtrato Glomerulare & Clearance"
      },
      {
        "id": "nefro-ab",
        "name": "Equilibrio Acido-Base & Anion Gap"
      },
      {
        "id": "nefro-idro",
        "name": "Idratazione, Osmolarità & Elettroliti"
      },
      {
        "id": "nefro-urine",
        "name": "Diagnostica Urinaria & Proteinuria"
      }
    ]
  },
  {
    "id": "rianimazione",
    "name": "Urgenza, Intensiva & Trauma",
    "icon": "⚡",
    "subareas": [
      {
        "id": "urgenza-triage",
        "name": "Early Warning & Triage (NEWS2, SIRS, RTS)"
      },
      {
        "id": "urgenza-sepsi",
        "name": "Sepsi, Shock & Infezione Critica"
      },
      {
        "id": "urgenza-neuro",
        "name": "Stato di Coscienza (Glasgow GCS)"
      },
      {
        "id": "urgenza-ustioni",
        "name": "Ustioni & Fluidoterapia (Parkland)"
      }
    ]
  },
  {
    "id": "pneumologia",
    "name": "Pneumologia & Gasometria",
    "icon": "🫁",
    "subareas": [
      {
        "id": "pneumo-resp",
        "name": "Insufficienza Respiratoria, ARDS & Alti Flussi"
      },
      {
        "id": "pneumo-infezioni",
        "name": "Polmoniti (CURB-65, PSI/PORT)"
      },
      {
        "id": "pneumo-bpco",
        "name": "BPCO & Pleura (BODE, Criteri di Light)"
      },
      {
        "id": "pneumo-ep",
        "name": "Tromboembolismo Polmonare (Wells EP)"
      }
    ]
  },
  {
    "id": "gastro",
    "name": "Gastroenterologia & Epatologia",
    "icon": "🩺",
    "subareas": [
      {
        "id": "gastro-fegato",
        "name": "Cirrosi & Funzione Epatica (Child, MELD)"
      },
      {
        "id": "gastro-fibrosi",
        "name": "Fibrosi & Transaminasi (FIB-4, APRI, De Ritis)"
      },
      {
        "id": "gastro-urgenze",
        "name": "Pancreatite Acuta & Emorragie (BISAP, Ranson, Rockall)"
      },
      {
        "id": "gastro-intestino",
        "name": "Liquidi & Fisiologia Intestinale (SAAG, Gap Fecale)"
      }
    ]
  },
  {
    "id": "endocrinologia",
    "name": "Endocrinologia & Diabete",
    "icon": "🔬",
    "subareas": [
      {
        "id": "endo-insulina",
        "name": "Insulino-Resistenza & Diabete (HOMA, QUICKI, eAG)"
      },
      {
        "id": "endo-terapia",
        "name": "Terapia Insulinica (ISF) & Emergenze (DKA)"
      },
      {
        "id": "endo-tiroide",
        "name": "Tiroide & Ormoni (Levotiroxina)"
      }
    ]
  },
  {
    "id": "ematologia",
    "name": "Ematologia & Oncologia",
    "icon": "🩸",
    "subareas": [
      {
        "id": "emato-anemie",
        "name": "Anemie & Assetto Marziale (Mentzer, Ganzoni)"
      },
      {
        "id": "emato-onco",
        "name": "Valutazione Oncologica (ECOG, Karnofsky, Calvert)"
      },
      {
        "id": "emato-coag",
        "name": "Coagulazione & Plasma (Score 4Ts, Volume Plasmatico)"
      }
    ]
  },
  {
    "id": "pediatria",
    "name": "Pediatria & Neonatologia",
    "icon": "👶",
    "subareas": [
      {
        "id": "ped-neonato",
        "name": "Adattamento Neonatale (APGAR, Silverman)"
      },
      {
        "id": "ped-farmaci",
        "name": "Posologia & Fabbisogni Pediatrici (Clark)"
      },
      {
        "id": "ped-infezioni",
        "name": "Vie Aeree & Infezioni (Downes, McIsaac)"
      }
    ]
  },
  {
    "id": "neurologia",
    "name": "Neurologia & Ictus",
    "icon": "🧠",
    "subareas": [
      {
        "id": "neuro-ictus",
        "name": "Ictus & Ischemia Cerebrale (ABCD², mRS)"
      },
      {
        "id": "neuro-urgenze",
        "name": "Emorragie & Traumi (Hunt & Hess, CCHR Ottawa)"
      }
    ]
  },
  {
    "id": "chirurgia",
    "name": "Chirurgia & Perioperatorio",
    "icon": "🔪",
    "subareas": [
      {
        "id": "chir-anestesia",
        "name": "Rischio Anestesiologico & Vie Aeree (ASA, Lee, Mallampati)"
      },
      {
        "id": "chir-trombosi",
        "name": "Tromboprofilassi Chirurgica (Caprini, Wells TVP)"
      },
      {
        "id": "chir-addome",
        "name": "Addome Acuto Chirurgico (Alvarado)"
      }
    ]
  },
  {
    "id": "infettivologia",
    "name": "Infettivologia & Antimicrobici",
    "icon": "🦠",
    "subareas": [
      {
        "id": "inf-tdm",
        "name": "Monitoraggio TDM Antibiotici (Vancomicina, Aminoglicosidi)"
      },
      {
        "id": "inf-infezioni",
        "name": "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)"
      }
    ]
  }
];
const CATEGORIES = MACROAREAS; // Compatibilità

const CALCULATORS = [
  {
    "id": "calcolo-metabolismo",
    "title": "Calcolo Metabolismo (Basale + LAF)",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Stima del Metabolismo Basale (BMR) con formule validate e Fabbisogno Energetico Totale (TDEE) con LAF.",
    "path": "../Calcolatori/Calcolo metabolismo/index.html",
    "isReady": true,
    "tags": [
      "bmr",
      "tdee",
      "laf",
      "calorie",
      "fabbisogno",
      "energia"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-bmr",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Dispendio Energetico & BMR"
  },
  {
    "id": "calcolo-bmi",
    "title": "Indice di Massa Corporea (BMI) e Peso Ideale",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Calcolo del BMI (OMS) con intervalli di peso ideale secondo formule di Lorentz, Devine e Robinson.",
    "path": "../Calcolatori/Indice di Massa Corporea (BMI)/index.html",
    "isReady": true,
    "tags": [
      "bmi",
      "peso",
      "altezza",
      "obesita",
      "sottopeso",
      "lorentz",
      "devine"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-antropo",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Antropometria & Composizione Corporea"
  },
  {
    "id": "superficie-corporea-bsa",
    "title": "Superficie Corporea (BSA - DuBois, Mosteller)",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Calcolo della Body Surface Area (BSA) per la calibrazione posologica di chemioterapici e indici emodinamici.",
    "path": "../Calcolatori/Superficie Corporea (BSA)/index.html",
    "isReady": true,
    "tags": [
      "bsa",
      "superficie",
      "mosteller",
      "dubois",
      "oncologia",
      "chemioterapia"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-antropo",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Antropometria & Composizione Corporea"
  },
  {
    "id": "rapporto-vita-fianchi-whr",
    "title": "Rapporto Vita / Fianchi (WHR)",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Valutazione dell'adiposità viscerale (obesità androide vs ginoide) e rischio cardiovascolare.",
    "path": "../Calcolatori/Rapporto Vita-Fianchi (WHR)/index.html",
    "isReady": true,
    "tags": [
      "whr",
      "vita",
      "fianchi",
      "viscerale",
      "adiposita",
      "cardiovascolare"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-antropo",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Antropometria & Composizione Corporea"
  },
  {
    "id": "fabbisogno-idrico-holliday",
    "title": "Fabbisogno Idrico di Mantenimento (Holliday-Segar)",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Stima dei liquidi endovenosi o orali di mantenimento per 24 ore in pazienti pediatrici e adulti.",
    "path": "../Calcolatori/Fabbisogno Idrico (Holliday-Segar)/index.html",
    "isReady": true,
    "tags": [
      "liquidi",
      "idratazione",
      "holliday-segar",
      "infusione",
      "mantenimento"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-clinica",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Nutrizione Clinica & Fabbisogni"
  },
  {
    "id": "massa-grassa-us-navy",
    "title": "Stima Massa Grassa (% Body Fat - Formula US Navy)",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Calcolo della percentuale di massa grassa e massa magra a partire dalle circonferenze corporee.",
    "path": "../Calcolatori/Percentuale Massa Grassa (US Navy)/index.html",
    "isReady": true,
    "tags": [
      "massa grassa",
      "body fat",
      "composizione corporea",
      "navy",
      "massa magra"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-antropo",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Antropometria & Composizione Corporea"
  },
  {
    "id": "indice-nutrizionale-prognostico-pni",
    "title": "Indice Nutrizionale Prognostico (PNI di Onodera)",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Valutazione dello stato nutrizionale e del rischio immunologico perioperatorio nel paziente chirurgico.",
    "path": "../Calcolatori/Indice Nutrizionale Prognostico (PNI)/index.html",
    "isReady": true,
    "tags": [
      "pni",
      "onodera",
      "malnutrizione",
      "albumina",
      "linfociti",
      "chirurgia"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-clinica",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Nutrizione Clinica & Fabbisogni"
  },
  {
    "id": "fabbisogno-proteico-clinico",
    "title": "Fabbisogno Proteico Giornaliero Clinico",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Calcolo della quota proteica giornaliera raccomandata in base al quadro clinico (normale, ipercatabolico, sarcopenia, dialisi).",
    "path": "../Calcolatori/Fabbisogno Proteico Giornaliero/index.html",
    "isReady": true,
    "tags": [
      "proteine",
      "nutrizione clinica",
      "fabbisogno",
      "catabolismo",
      "dialisi",
      "sarcopenia"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-clinica",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Nutrizione Clinica & Fabbisogni"
  },
  {
    "id": "calorie-npt-glucosio-lipidi",
    "title": "Calcolo Calorie da Nutrizione Parenterale (NPT)",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Computo delle kilocalorie effettive fornite da glucosio monoidrato (3.4 kcal/g), lipidi ed aminoacidi.",
    "path": "../Calcolatori/Calcolo Calorie NPT/index.html",
    "isReady": true,
    "tags": [
      "npt",
      "nutrizione parenterale",
      "glucosio",
      "lipidi",
      "aminoacidi",
      "rianimazione"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-clinica",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Nutrizione Clinica & Fabbisogni"
  },
  {
    "id": "circonferenza-vita-cardio",
    "title": "Circonferenza Vita e Sindrome Metabolica",
    "category": "nutrizione",
    "categoryLabel": "Nutrizione & Metabolismo",
    "description": "Criteri NCEP-ATP III e IDF per l'obesità viscerale nella sindrome metabolica.",
    "path": "../Calcolatori/Circonferenza Vita e Rischio Metabolico/index.html",
    "isReady": true,
    "tags": [
      "circonferenza vita",
      "sindrome metabolica",
      "atp iii",
      "idf",
      "diabete"
    ],
    "macroId": "nutrizione",
    "subId": "nutri-antropo",
    "macroName": "Nutrizione & Metabolismo",
    "subName": "Antropometria & Composizione Corporea"
  },
  {
    "id": "cha2ds2-vasc",
    "title": "Punteggio CHA₂DS₂-VASc",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Stratificazione del rischio tromboembolico e indicazione ad anticoagulanti nella fibrillazione atriale.",
    "path": "../Calcolatori/CHA2DS2-VASc Score/index.html",
    "isReady": true,
    "tags": [
      "cha2ds2",
      "vasc",
      "fa",
      "fibrillazione",
      "anticoagulante",
      "ictus",
      "tromboembolismo"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-fa",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Fibrillazione Atriale & Rischio Tromboembolico"
  },
  {
    "id": "has-bled",
    "title": "Score HAS-BLED (Rischio Emorragico)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Stima del rischio di sanguinamento maggiore a 1 anno nei pazienti in terapia anticoagulante orale.",
    "path": "../Calcolatori/HAS-BLED Score/index.html",
    "isReady": true,
    "tags": [
      "has-bled",
      "emorragia",
      "anticoagulante",
      "fa",
      "bleeding"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-fa",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Fibrillazione Atriale & Rischio Tromboembolico"
  },
  {
    "id": "qt-corretto-qtc",
    "title": "Intervallo QT Corretto (QTc - Bazett, Fridericia)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Correzione dell'intervallo elettrocardiografico QT per la valutazione del rischio di torsione di punta.",
    "path": "../Calcolatori/QT Corretto (QTc)/index.html",
    "isReady": true,
    "tags": [
      "qtc",
      "bazett",
      "fridericia",
      "ecg",
      "aritmia",
      "torsade"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-ecg",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Elettrocardiografia & Aritmie"
  },
  {
    "id": "pressione-arteriosa-media-map",
    "title": "Pressione Arteriosa Media (MAP) e Pressione di Polso",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Calcolo della MAP per la valutazione della perfusione d'organo in terapia intensiva e shock.",
    "path": "../Calcolatori/Pressione Arteriosa Media (MAP)/index.html",
    "isReady": true,
    "tags": [
      "map",
      "pressione",
      "perfusione",
      "rianimazione",
      "shock"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-emodinamica",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Emodinamica & Pressioni"
  },
  {
    "id": "heart-score-dolore-toracico",
    "title": "HEART Score per Dolore Toracico in Pronto Soccorso",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Stratificazione del rischio di eventi avversi cardiaci maggiori (MACE) a 6 settimane.",
    "path": "../Calcolatori/HEART Score/index.html",
    "isReady": true,
    "tags": [
      "heart",
      "troponina",
      "dolore toracico",
      "mace",
      "pronto soccorso",
      "triage"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-sca",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Sindromi Coronariche Acute & Ischemia"
  },
  {
    "id": "timi-risk-nste-acs",
    "title": "Punteggio TIMI per NSTEMI / Angina Instabile",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Predizione di mortalità, re-IMA e ischemia ricorrente a 14 giorni in sindrome coronarica senza sopraslivellamento ST.",
    "path": "../Calcolatori/TIMI Score NSTEMI/index.html",
    "isReady": true,
    "tags": [
      "timi",
      "nstemi",
      "angina",
      "morte",
      "coronaria"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-sca",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Sindromi Coronariche Acute & Ischemia"
  },
  {
    "id": "gittata-cardiaca-fick",
    "title": "Gittata Cardiaca (Principio di Fick)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Misurazione emodinamica gold standard della portata cardiaca e indice cardiaco.",
    "path": "../Calcolatori/Gittata Cardiaca (Fick)/index.html",
    "isReady": true,
    "tags": [
      "fick",
      "gittata",
      "portata",
      "emodinamica",
      "indice cardiaco",
      "cateterismo"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-emodinamica",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Emodinamica & Pressioni"
  },
  {
    "id": "resistenza-vascolare-sistemica-svr",
    "title": "Resistenza Vascolare Sistemica (SVR)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Valutazione del postcarico vascolare periferico e diagnosi differenziale del tipo di shock.",
    "path": "../Calcolatori/Resistenza Vascolare Sistemica (SVR)/index.html",
    "isReady": true,
    "tags": [
      "svr",
      "postcarico",
      "vasocostrizione",
      "shock",
      "terapia intensiva"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-emodinamica",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Emodinamica & Pressioni"
  },
  {
    "id": "egfr-ckd-epi-2021",
    "title": "eGFR CKD-EPI 2021 (Filtrato Glomerulare)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Nuova equazione standard KDIGO 2021 race-free per la stadiazione dell'insufficienza renale cronica.",
    "path": "../Calcolatori/eGFR CKD-EPI (2021)/index.html",
    "isReady": true,
    "tags": [
      "egfr",
      "ckd-epi",
      "creatinina",
      "filtrato",
      "kdigo",
      "rene"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-gfr",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Filtrato Glomerulare & Clearance"
  },
  {
    "id": "clearance-creatinina-cockcroft",
    "title": "Clearance Creatinina (Cockcroft-Gault)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Stima della clearance della creatinina per l'adeguamento posologico dei farmaci.",
    "path": "../Calcolatori/Clearance Creatinina (Cockcroft-Gault)/index.html",
    "isReady": true,
    "tags": [
      "cockcroft",
      "clearance",
      "creatinina",
      "posologia",
      "dosaggio",
      "farmaci"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-gfr",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Filtrato Glomerulare & Clearance"
  },
  {
    "id": "frazione-escrezione-sodio-fena",
    "title": "Frazione di Escrezione del Sodio (FENa)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Diagnosi differenziale tra IRA prerenale (ipoperfusione) e necrosi tubulare acuta (NTA).",
    "path": "../Calcolatori/Frazione Escrezione Sodio (FENa)/index.html",
    "isReady": true,
    "tags": [
      "fena",
      "sodio",
      "ira",
      "prerenale",
      "nta",
      "oliguria"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "frazione-escrezione-urea-feurea",
    "title": "Frazione di Escrezione dell'Urea (FEUrea)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Diagnosi differenziale dell'IRA quando il paziente assume diuretici dell'ansa.",
    "path": "../Calcolatori/Frazione Escrezione Urea (FEUrea)/index.html",
    "isReady": true,
    "tags": [
      "feurea",
      "urea",
      "azotemia",
      "diuretici",
      "furosemide",
      "prerenale"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-urine",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Diagnostica Urinaria & Proteinuria"
  },
  {
    "id": "anion-gap-sierico",
    "title": "Anion Gap Sierico (con Correzione per Albumina)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Valutazione dell'acidosi metabolica ad elevato vs normale anion gap.",
    "path": "../Calcolatori/Anion Gap Sierico/index.html",
    "isReady": true,
    "tags": [
      "anion gap",
      "acidosi",
      "albumina",
      "ega",
      "lattati"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-ab",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Equilibrio Acido-Base & Anion Gap"
  },
  {
    "id": "osmolarita-sierica-calcolata",
    "title": "Osmolarità Sierica Calcolata & Osmolal Gap",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Calcolo dell'osmolarità sierica teorica e stima del gap osmolare per intossicazioni da alcoli tossici.",
    "path": "../Calcolatori/Osmolarità Sierica Calcolata/index.html",
    "isReady": true,
    "tags": [
      "osmolarita",
      "osmolal gap",
      "metanolo",
      "glicole",
      "tossicologia",
      "coma"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "calcio-corretto-albumina",
    "title": "Calcio Totale Corretto per Albumina (Formula di Payne)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Stima della vera calcemia in presenza di ipoalbuminemia o iperalbuminemia.",
    "path": "../Calcolatori/Calcio Corretto per Albumina/index.html",
    "isReady": true,
    "tags": [
      "calcio",
      "calcemia",
      "albumina",
      "payne",
      "ipercalcemia",
      "ipocalcemia"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "deficit-acqua-libera-ipernatriemia",
    "title": "Deficit di Acqua Libera (Ipernatriemia)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Volume d'acqua pura necessario per correggere l'ipernatriemia grave verso il target di 140 mEq/L.",
    "path": "../Calcolatori/Deficit Acqua Libera/index.html",
    "isReady": true,
    "tags": [
      "ipernatriemia",
      "acqua libera",
      "deficit",
      "sodio",
      "disidratazione"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "deficit-sodio-iponatriemia",
    "title": "Deficit di Sodio (Iponatriemia Sintomatica)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Calcolo della quantità totale di sodio necessaria per elevare la natriemia fino al valore target.",
    "path": "../Calcolatori/Deficit di Sodio/index.html",
    "isReady": true,
    "tags": [
      "iponatriemia",
      "sodio",
      "deficit",
      "salina ipertonica",
      "coma"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "deficit-bicarbonato",
    "title": "Deficit di Bicarbonato (Acidosi Metabolica Grave)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Stima della quantità di NaHCO₃ necessaria per correggere acidosi metaboliche critiche (pH < 7.15, HCO₃ < 10).",
    "path": "../Calcolatori/Deficit di Bicarbonato/index.html",
    "isReady": true,
    "tags": [
      "bicarbonato",
      "acidosi",
      "ega",
      "rianimazione",
      "hco3"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-ab",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Equilibrio Acido-Base & Anion Gap"
  },
  {
    "id": "rapporto-albumina-creatinina-uacr",
    "title": "Rapporto Albumina / Creatinina Urinaria (UACR)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Screening e stadiazione della nefropatia diabetica e albuminuria KDIGO su campione estemporaneo di urine del mattino.",
    "path": "../Calcolatori/Rapporto Albumina-Creatinina (UACR)/index.html",
    "isReady": true,
    "tags": [
      "uacr",
      "albuminuria",
      "microalbuminuria",
      "diabete",
      "rene",
      "kdigo"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-urine",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Diagnostica Urinaria & Proteinuria"
  },
  {
    "id": "glasgow-coma-scale",
    "title": "Glasgow Coma Scale (GCS)",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Valutazione oggettiva dello stato di coscienza attraverso tre risposte comportamentali.",
    "path": "../Calcolatori/Glasgow Coma Scale (GCS)/index.html",
    "isReady": true,
    "tags": [
      "gcs",
      "glasgow",
      "coma",
      "coscienza",
      "triage",
      "trauma cranico"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-neuro",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Stato di Coscienza (Glasgow GCS)"
  },
  {
    "id": "qsofa-score",
    "title": "Quick SOFA Score (Sepsis-3)",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Identificazione rapida dei pazienti con sospetta infezione ad alto rischio di deterioramento clinico.",
    "path": "../Calcolatori/Quick SOFA (qSOFA)/index.html",
    "isReady": true,
    "tags": [
      "qsofa",
      "sepsi",
      "infezione",
      "triage",
      "shock settico"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-sepsi",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Sepsi, Shock & Infezione Critica"
  },
  {
    "id": "formula-parkland-ustioni",
    "title": "Formula di Parkland per Rianimazione da Ustioni",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Calcolo della reintegrazione idroelettrolitica con Ringer Lattato nelle prime 24 ore nell'ustionato.",
    "path": "../Calcolatori/Formula di Parkland Ustioni/index.html",
    "isReady": true,
    "tags": [
      "parkland",
      "ustione",
      "fluidi",
      "ringer",
      "rianimazione",
      "emergenza"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-ustioni",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Ustioni & Fluidoterapia (Parkland)"
  },
  {
    "id": "shock-index",
    "title": "Shock Index & Modified Shock Index",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Predittore precoce di shock ipovolemico/emorragico nascosto, emotrasfusione massiva e mortalità.",
    "path": "../Calcolatori/Shock Index (SI)/index.html",
    "isReady": true,
    "tags": [
      "shock index",
      "emorragia",
      "trauma",
      "trasfusione",
      "pressione",
      "fc"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-sepsi",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Sepsi, Shock & Infezione Critica"
  },
  {
    "id": "news2-score",
    "title": "NEWS2 (National Early Warning Score)",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Standard internazionale per l'identificazione precoce e la risposta al deterioramento clinico acuto nei reparti di degenza.",
    "path": "../Calcolatori/Punteggio NEWS2/index.html",
    "isReady": true,
    "tags": [
      "news2",
      "early warning",
      "deterioramento",
      "rianimazione",
      "triage"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-triage",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Early Warning & Triage (NEWS2, SIRS, RTS)"
  },
  {
    "id": "curb-65",
    "title": "Punteggio CURB-65 per Polmonite",
    "category": "pneumologia",
    "categoryLabel": "Pneumologia & Gasometria",
    "description": "Stratificazione prognostica e orientamento del setting di cura per polmonite acquisita in comunità (CAP).",
    "path": "../Calcolatori/Score CURB-65/index.html",
    "isReady": true,
    "tags": [
      "curb65",
      "polmonite",
      "cap",
      "infezione",
      "respiro",
      "ricovero"
    ],
    "macroId": "pneumologia",
    "subId": "pneumo-infezioni",
    "macroName": "Pneumologia & Gasometria",
    "subName": "Polmoniti (CURB-65, PSI/PORT)"
  },
  {
    "id": "criteri-wells-ep",
    "title": "Criteri di Wells per Embolia Polmonare (EP)",
    "category": "pneumologia",
    "categoryLabel": "Pneumologia & Gasometria",
    "description": "Stima della probabilità clinica pre-test di embolia polmonare e guida all'uso di D-Dimero o Angio-TC.",
    "path": "../Calcolatori/Criteri di Wells per Embolia Polmonare/index.html",
    "isReady": true,
    "tags": [
      "wells",
      "ep",
      "embolia",
      "d-dimero",
      "polmone",
      "angio-tc"
    ],
    "macroId": "pneumologia",
    "subId": "pneumo-ep",
    "macroName": "Pneumologia & Gasometria",
    "subName": "Tromboembolismo Polmonare (Wells EP)"
  },
  {
    "id": "rapporto-pao2-fio2-horowitz",
    "title": "Indice di Horowitz (Rapporto PaO₂ / FiO₂)",
    "category": "pneumologia",
    "categoryLabel": "Pneumologia & Gasometria",
    "description": "Valutazione dell'insufficienza respiratoria e gravità dell'ARDS (Criteri di Berlino).",
    "path": "../Calcolatori/Rapporto PaO2-FiO2 (Horowitz)/index.html",
    "isReady": true,
    "tags": [
      "horowitz",
      "pao2",
      "fio2",
      "ards",
      "berlino",
      "ipossia",
      "ega"
    ],
    "macroId": "pneumologia",
    "subId": "pneumo-resp",
    "macroName": "Pneumologia & Gasometria",
    "subName": "Insufficienza Respiratoria, ARDS & Alti Flussi"
  },
  {
    "id": "gradiente-alveolo-arterioso-aa",
    "title": "Gradiente Alveolo-Arterioso di Ossigeno (P[A-a]O₂)",
    "category": "pneumologia",
    "categoryLabel": "Pneumologia & Gasometria",
    "description": "Differenziazione tra ipoventilazione pura e patologie con alterazione del rapporto V/Q o shunt intrapolmonare.",
    "path": "../Calcolatori/Gradiente Alveolo-Arterioso O2/index.html",
    "isReady": true,
    "tags": [
      "alveolo arterioso",
      "pao2",
      "paco2",
      "ega",
      "ipossia",
      "shunt"
    ],
    "macroId": "pneumologia",
    "subId": "pneumo-resp",
    "macroName": "Pneumologia & Gasometria",
    "subName": "Insufficienza Respiratoria, ARDS & Alti Flussi"
  },
  {
    "id": "indice-rox-alti-flussi",
    "title": "Indice ROX (Ossigenoterapia ad Alti Flussi - HFNC)",
    "category": "pneumologia",
    "categoryLabel": "Pneumologia & Gasometria",
    "description": "Predittore di successo o fallimento della ventilazione ad alti flussi (HFNC) e tempestività di intubazione.",
    "path": "../Calcolatori/Indice ROX (HFNC)/index.html",
    "isReady": true,
    "tags": [
      "rox",
      "hfnc",
      "alti flussi",
      "intubazione",
      "respiro",
      "ipossiemia"
    ],
    "macroId": "pneumologia",
    "subId": "pneumo-resp",
    "macroName": "Pneumologia & Gasometria",
    "subName": "Insufficienza Respiratoria, ARDS & Alti Flussi"
  },
  {
    "id": "child-pugh-score",
    "title": "Score di Child-Pugh per Cirrosi Epatica",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Classificazione prognostica della gravità della cirrosi epatica e valutazione del rischio chirurgico.",
    "path": "../Calcolatori/Score Child-Pugh/index.html",
    "isReady": true,
    "tags": [
      "child-pugh",
      "cirrosi",
      "fegato",
      "ascite",
      "encefalopatia",
      "inr"
    ],
    "macroId": "gastro",
    "subId": "gastro-fegato",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Cirrosi & Funzione Epatica (Child, MELD)"
  },
  {
    "id": "meld-score",
    "title": "Score MELD (Model for End-Stage Liver Disease)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Predittore di mortalità a 3 mesi ed elemento cardine per la lista trapianto fegato.",
    "path": "../Calcolatori/Score MELD/index.html",
    "isReady": true,
    "tags": [
      "meld",
      "trapianto",
      "fegato",
      "cirrosi",
      "creatinina",
      "bilirubina",
      "inr"
    ],
    "macroId": "gastro",
    "subId": "gastro-fegato",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Cirrosi & Funzione Epatica (Child, MELD)"
  },
  {
    "id": "fib-4-fibrosi-epatica",
    "title": "Indice FIB-4 (Fibrosi Epatica Non Invasiva)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Biomarcatore non invasivo per escludere o confermare fibrosi epatica avanzata / cirrosi in NAFLD/MASLD ed epatite virale.",
    "path": "../Calcolatori/Indice FIB-4/index.html",
    "isReady": true,
    "tags": [
      "fib4",
      "fibrosi",
      "nafld",
      "masld",
      "fegato",
      "piastrine",
      "ast",
      "alt"
    ],
    "macroId": "gastro",
    "subId": "gastro-fibrosi",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Fibrosi & Transaminasi (FIB-4, APRI, De Ritis)"
  },
  {
    "id": "gradiente-saag-ascite",
    "title": "Gradiente Albumina Siero-Ascite (SAAG)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Diagnosi dell'ascite da ipertensione portale (cirrosi, scompenso) vs cause peritoneali (carcinomatosi, tubercolosi).",
    "path": "../Calcolatori/Gradiente SAAG Ascite/index.html",
    "isReady": true,
    "tags": [
      "saag",
      "ascite",
      "paracentesi",
      "albumina",
      "cirrosi",
      "ipertensione portale"
    ],
    "macroId": "gastro",
    "subId": "gastro-intestino",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Liquidi & Fisiologia Intestinale (SAAG, Gap Fecale)"
  },
  {
    "id": "glasgow-blatchford-emorragia",
    "title": "Glasgow-Blatchford Bleeding Score (GBS)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Valutazione del rischio di sanguinamento digestivo superiore (GIB) e identificazione dei pazienti a bassissimo rischio dimissibili.",
    "path": "../Calcolatori/Score Glasgow-Blatchford/index.html",
    "isReady": true,
    "tags": [
      "blatchford",
      "gbs",
      "emorragia",
      "ematemesi",
      "melena",
      "endoscopia"
    ],
    "macroId": "gastro",
    "subId": "gastro-urgenze",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Pancreatite Acuta & Emorragie (BISAP, Ranson, Rockall)"
  },
  {
    "id": "homa-ir-index",
    "title": "Indice HOMA-IR (Insulino-Resistenza)",
    "category": "endocrinologia",
    "categoryLabel": "Endocrinologia & Diabete",
    "description": "Stima della resistenza insulinica a partire da glicemia e insulinemia a digiuno.",
    "path": "../Calcolatori/Indice HOMA-IR/index.html",
    "isReady": true,
    "tags": [
      "homa",
      "insulina",
      "glicemia",
      "diabete",
      "insulino-resistenza"
    ],
    "macroId": "endocrinologia",
    "subId": "endo-insulina",
    "macroName": "Endocrinologia & Diabete",
    "subName": "Insulino-Resistenza & Diabete (HOMA, QUICKI, eAG)"
  },
  {
    "id": "emoglobina-glicata-stimata-eag",
    "title": "Glicemia Media Stimata da HbA1c (eAG)",
    "category": "endocrinologia",
    "categoryLabel": "Endocrinologia & Diabete",
    "description": "Conversione tra percentuale di HbA1c e media glicemica stimata giornaliera (eAG).",
    "path": "../Calcolatori/Emoglobina Glicata Stimata (eAG)/index.html",
    "isReady": true,
    "tags": [
      "hba1c",
      "glicata",
      "eag",
      "glicemia media",
      "diabete"
    ],
    "macroId": "endocrinologia",
    "subId": "endo-insulina",
    "macroName": "Endocrinologia & Diabete",
    "subName": "Insulino-Resistenza & Diabete (HOMA, QUICKI, eAG)"
  },
  {
    "id": "fattore-sensibilita-insulinica-isf",
    "title": "Fattore di Sensibilità Insulinica (Regola del 1500 / 1800)",
    "category": "endocrinologia",
    "categoryLabel": "Endocrinologia & Diabete",
    "description": "Stima di quanti mg/dL di glicemia vengono abbattuti da 1 unità di insulina rapida.",
    "path": "../Calcolatori/Fattore Sensibilità Insulinica (ISF)/index.html",
    "isReady": true,
    "tags": [
      "isf",
      "sensibilita insulina",
      "regola 1800",
      "bolo correttivo",
      "diabete tipo 1"
    ],
    "macroId": "endocrinologia",
    "subId": "endo-terapia",
    "macroName": "Endocrinologia & Diabete",
    "subName": "Terapia Insulinica (ISF) & Emergenze (DKA)"
  },
  {
    "id": "conta-assoluta-neutrofili-anc",
    "title": "Conta Assoluta dei Neutrofili (ANC)",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Valutazione del rischio di neutropenia febbrile e sicurezza dei cicli chemioterapici.",
    "path": "../Calcolatori/Conta Assoluta Neutrofili (ANC)/index.html",
    "isReady": true,
    "tags": [
      "anc",
      "neutrofili",
      "neutropenia",
      "emocromo",
      "leucociti",
      "chemioterapia"
    ],
    "macroId": "ematologia",
    "subId": "emato-onco",
    "macroName": "Ematologia & Oncologia",
    "subName": "Valutazione Oncologica (ECOG, Karnofsky, Calvert)"
  },
  {
    "id": "indice-mentzer-anemie",
    "title": "Indice di Mentzer per Anemia Microcitica",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Differenziazione tra tratto beta-talassemico e anemia da carenza marziale.",
    "path": "../Calcolatori/Indice di Mentzer/index.html",
    "isReady": true,
    "tags": [
      "mentzer",
      "anemia",
      "microcitosi",
      "talassemia",
      "ferro",
      "mcv"
    ],
    "macroId": "ematologia",
    "subId": "emato-anemie",
    "macroName": "Ematologia & Oncologia",
    "subName": "Anemie & Assetto Marziale (Mentzer, Ganzoni)"
  },
  {
    "id": "score-4ts-hit",
    "title": "Score 4Ts per Trombocitopenia Indotta da Eparina (HIT)",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Probabilità pre-test di HIT di tipo II e indicazione all'immediata sospensione dell'eparina.",
    "path": "../Calcolatori/Score 4Ts per HIT/index.html",
    "isReady": true,
    "tags": [
      "4ts",
      "hit",
      "eparina",
      "piastrine",
      "trombocitopenia",
      "trombosi"
    ],
    "macroId": "ematologia",
    "subId": "emato-coag",
    "macroName": "Ematologia & Oncologia",
    "subName": "Coagulazione & Plasma (Score 4Ts, Volume Plasmatico)"
  },
  {
    "id": "formula-calvert-carboplatino",
    "title": "Formula di Calvert per Dosaggio del Carboplatino",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Calcolo della dose di Carboplatino in milligrammi basata sulla clearance renale e target AUC.",
    "path": "../Calcolatori/Formula di Calvert (Carboplatino)/index.html",
    "isReady": true,
    "tags": [
      "calvert",
      "carboplatino",
      "oncologia",
      "auc",
      "chemioterapia",
      "clearance"
    ],
    "macroId": "ematologia",
    "subId": "emato-onco",
    "macroName": "Ematologia & Oncologia",
    "subName": "Valutazione Oncologica (ECOG, Karnofsky, Calvert)"
  },
  {
    "id": "apgar-score",
    "title": "Punteggio di APGAR Neonatale",
    "category": "pediatria",
    "categoryLabel": "Pediatria & Neonatologia",
    "description": "Valutazione dell'adattamento neonatale al 1° e 5° minuto di vita.",
    "path": "../Calcolatori/Punteggio APGAR/index.html",
    "isReady": true,
    "tags": [
      "apgar",
      "neonato",
      "nascita",
      "pediatria",
      "parto"
    ],
    "macroId": "pediatria",
    "subId": "ped-neonato",
    "macroName": "Pediatria & Neonatologia",
    "subName": "Adattamento Neonatale (APGAR, Silverman)"
  },
  {
    "id": "centor-mcisaac-faringite",
    "title": "Score di Centor / McIsaac per Faringite Streptococcica",
    "category": "pediatria",
    "categoryLabel": "Pediatria & Neonatologia",
    "description": "Probabilità di infezione da Streptococco di Gruppo A e indicazione al tampone rapido.",
    "path": "../Calcolatori/Score Centor-McIsaac/index.html",
    "isReady": true,
    "tags": [
      "centor",
      "mcisaac",
      "faringite",
      "streptococco",
      "tonsillite"
    ],
    "macroId": "pediatria",
    "subId": "ped-infezioni",
    "macroName": "Pediatria & Neonatologia",
    "subName": "Vie Aeree & Infezioni (Downes, McIsaac)"
  },
  {
    "id": "silverman-andersen-distress",
    "title": "Score di Silverman-Andersen (Distress Respiratorio Neonatale)",
    "category": "pediatria",
    "categoryLabel": "Pediatria & Neonatologia",
    "description": "Quantificazione della gravità del distress respiratorio nel neonato (a differenza del GCS, più alto è il punteggio più grave è il distress).",
    "path": "../Calcolatori/Punteggio Silverman-Andersen/index.html",
    "isReady": true,
    "tags": [
      "silverman",
      "distress",
      "neonato",
      "gemito",
      "rientramenti",
      "respiro"
    ],
    "macroId": "pediatria",
    "subId": "ped-neonato",
    "macroName": "Pediatria & Neonatologia",
    "subName": "Adattamento Neonatale (APGAR, Silverman)"
  },
  {
    "id": "abcd2-score-tia",
    "title": "Score ABCD² (Rischio Ictus post-TIA)",
    "category": "neurologia",
    "categoryLabel": "Neurologia & Ictus",
    "description": "Predizione del rischio precoce di ictus ischemico dopo un attacco ischemico transitorio.",
    "path": "../Calcolatori/Score ABCD2 per TIA/index.html",
    "isReady": true,
    "tags": [
      "abcd2",
      "tia",
      "ictus",
      "stroke",
      "neurologia"
    ],
    "macroId": "neurologia",
    "subId": "neuro-ictus",
    "macroName": "Neurologia & Ictus",
    "subName": "Ictus & Ischemia Cerebrale (ABCD², mRS)"
  },
  {
    "id": "hunt-hess-emorragia-subaracnoidea",
    "title": "Scala di Hunt e Hess per Emorragia Subaracnoidea (ESA)",
    "category": "neurologia",
    "categoryLabel": "Neurologia & Ictus",
    "description": "Classificazione clinica della gravità del sanguinamento da rottura aneurismatica intracranica.",
    "path": "../Calcolatori/Scala Hunt e Hess/index.html",
    "isReady": true,
    "tags": [
      "hunt hess",
      "esa",
      "emorragia subaracnoidea",
      "aneurisma",
      "cefalea"
    ],
    "macroId": "neurologia",
    "subId": "neuro-urgenze",
    "macroName": "Neurologia & Ictus",
    "subName": "Emorragie & Traumi (Hunt & Hess, CCHR Ottawa)"
  },
  {
    "id": "alvarado-score-appendicite",
    "title": "Score di Alvarado per Appendicite Acuta",
    "category": "chirurgia",
    "categoryLabel": "Chirurgia & Perioperatorio",
    "description": "Probabilità di appendicite acuta nel dolore in fossa iliaca destra.",
    "path": "../Calcolatori/Score di Alvarado/index.html",
    "isReady": true,
    "tags": [
      "alvarado",
      "appendicite",
      "chirurgia",
      "addome",
      "urgenza"
    ],
    "macroId": "chirurgia",
    "subId": "chir-addome",
    "macroName": "Chirurgia & Perioperatorio",
    "subName": "Addome Acuto Chirurgico (Alvarado)"
  },
  {
    "id": "wells-tvp",
    "title": "Criteri di Wells per Trombosi Venosa Profonda",
    "category": "chirurgia",
    "categoryLabel": "Chirurgia & Perioperatorio",
    "description": "Stratificazione della probabilità di TVP dell'arto inferiore.",
    "path": "../Calcolatori/Criteri di Wells per TVP/index.html",
    "isReady": true,
    "tags": [
      "wells",
      "tvp",
      "trombosi",
      "edema",
      "d-dimero"
    ],
    "macroId": "chirurgia",
    "subId": "chir-trombosi",
    "macroName": "Chirurgia & Perioperatorio",
    "subName": "Tromboprofilassi Chirurgica (Caprini, Wells TVP)"
  },
  {
    "id": "classificazione-asa-ps",
    "title": "Classificazione dello Stato Fisico ASA (ASA-PS)",
    "category": "chirurgia",
    "categoryLabel": "Chirurgia & Perioperatorio",
    "description": "Stratificazione del rischio anestesiologico preoperatorio globale dell'American Society of Anesthesiologists.",
    "path": "../Calcolatori/Classificazione ASA/index.html",
    "isReady": true,
    "tags": [
      "asa",
      "anestesia",
      "preoperatorio",
      "rischio chirurgico",
      "sala operatoria"
    ],
    "macroId": "chirurgia",
    "subId": "chir-anestesia",
    "macroName": "Chirurgia & Perioperatorio",
    "subName": "Rischio Anestesiologico & Vie Aeree (ASA, Lee, Mallampati)"
  },
  {
    "id": "score-rcri-lee",
    "title": "Revised Cardiac Risk Index di Lee (RCRI)",
    "category": "chirurgia",
    "categoryLabel": "Chirurgia & Perioperatorio",
    "description": "Stima del rischio di complicanze cardiache maggiori (infarto miocardico, arresto cardiaco, edema polmonare) in chirurgia non cardiaca.",
    "path": "../Calcolatori/Score di Lee (RCRI)/index.html",
    "isReady": true,
    "tags": [
      "rcri",
      "lee",
      "rischio cardiaco",
      "preoperatorio",
      "mace",
      "chirurgia"
    ],
    "macroId": "chirurgia",
    "subId": "chir-anestesia",
    "macroName": "Chirurgia & Perioperatorio",
    "subName": "Rischio Anestesiologico & Vie Aeree (ASA, Lee, Mallampati)"
  },
  {
    "id": "framingham-risk-score",
    "title": "Framingham Risk Score (Rischio Coronarico a 10 Anni)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Stima della probabilità a 10 anni di sviluppare eventi coronarici maggiori (infarto o morte coronarica).",
    "path": "../Calcolatori/Framingham Risk Score/index.html",
    "isReady": true,
    "tags": [
      "framingham",
      "rischio cv",
      "colesterolo",
      "hdl",
      "ipertensione",
      "fumo"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-sca",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Sindromi Coronariche Acute & Ischemia"
  },
  {
    "id": "resistenza-vascolare-polmonare-pvr",
    "title": "Resistenza Vascolare Polmonare (PVR)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Diagnosi emodinamica dell'ipertensione polmonare precapillare mediante cateterismo cardiaco destro.",
    "path": "../Calcolatori/Resistenza Vascolare Polmonare (PVR)/index.html",
    "isReady": true,
    "tags": [
      "pvr",
      "ipertensione polmonare",
      "cateterismo",
      "pcwp",
      "pap",
      "wood"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-emodinamica",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Emodinamica & Pressioni"
  },
  {
    "id": "duke-treadmill-score",
    "title": "Duke Treadmill Score (Test da Sforzo al Cicloergometro)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Stratificazione prognostica e predizione di sopravvivenza a 5 anni dopo test ergometrico massimale.",
    "path": "../Calcolatori/Duke Treadmill Score/index.html",
    "isReady": true,
    "tags": [
      "duke",
      "treadmill",
      "test da sforzo",
      "ergometria",
      "st",
      "angina"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-ecg",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Elettrocardiografia & Aritmie"
  },
  {
    "id": "anion-gap-urinario",
    "title": "Anion Gap Urinario (UAG)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Diagnosi differenziale dell'acidosi metabolica a normale anion gap (acidosi tubulare renale vs perdita gastrointestinale).",
    "path": "../Calcolatori/Anion Gap Urinario/index.html",
    "isReady": true,
    "tags": [
      "uag",
      "anion gap urinario",
      "acidosi tubulare",
      "diarrea",
      "ammoniuria"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-ab",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Equilibrio Acido-Base & Anion Gap"
  },
  {
    "id": "gradiente-transtubulare-potassio-ttkg",
    "title": "Gradiente Transtubulare di Potassio (TTKG)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Valutazione dell'attività dell'aldosterone nel dotto collettore corticale renale nell'ipo/iperkaliemia.",
    "path": "../Calcolatori/Gradiente Transtubulare Potassio (TTKG)/index.html",
    "isReady": true,
    "tags": [
      "ttkg",
      "potassio",
      "aldosterone",
      "kaliemia",
      "tubulo"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "rapporto-proteine-creatinina-upcr",
    "title": "Rapporto Proteine / Creatinina Urinaria (UPCR)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Stima rapida della proteinuria delle 24 ore su singolo campione estemporaneo di urina.",
    "path": "../Calcolatori/Rapporto Proteine-Creatinina (UPCR)/index.html",
    "isReady": true,
    "tags": [
      "upcr",
      "proteinuria",
      "rene",
      "sindrome nefrosica",
      "glomerulonefrite"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-urine",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Diagnostica Urinaria & Proteinuria"
  },
  {
    "id": "criteri-light-versamento-pleurico",
    "title": "Criteri di Light per Versamento Pleurico",
    "category": "pneumologia",
    "categoryLabel": "Pneumologia & Gasometria",
    "description": "Differenziazione tra essudato (processo infiammatorio/neoplastico locale) e trasudato (squilibrio idrostatico/oncotico).",
    "path": "../Calcolatori/Criteri di Light (Versamento Pleurico)/index.html",
    "isReady": true,
    "tags": [
      "light",
      "pleura",
      "toracentesi",
      "essudato",
      "trasudato",
      "ldh",
      "proteine"
    ],
    "macroId": "pneumologia",
    "subId": "pneumo-bpco",
    "macroName": "Pneumologia & Gasometria",
    "subName": "BPCO & Pleura (BODE, Criteri di Light)"
  },
  {
    "id": "indice-bode-bpco",
    "title": "Indice BODE per Broncopneumopatia Cronica Ostruttiva (BPCO)",
    "category": "pneumologia",
    "categoryLabel": "Pneumologia & Gasometria",
    "description": "Score multidimensionale per la predizione di sopravvivenza a 4 anni nei pazienti con BPCO.",
    "path": "../Calcolatori/Indice BODE per BPCO/index.html",
    "isReady": true,
    "tags": [
      "bode",
      "bpco",
      "fev1",
      "6mwd",
      "dispnea",
      "mmrc",
      "bmi"
    ],
    "macroId": "pneumologia",
    "subId": "pneumo-bpco",
    "macroName": "Pneumologia & Gasometria",
    "subName": "BPCO & Pleura (BODE, Criteri di Light)"
  },
  {
    "id": "bisap-pancreatite-acuta",
    "title": "Score BISAP (Bedside Index for Severity in Acute Pancreatitis)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Identificazione precoce entro 24 ore dal ricovero dei pazienti con pancreatite acuta a rischio di mortalità e insufficienza d'organo.",
    "path": "../Calcolatori/Score BISAP Pancreatite/index.html",
    "isReady": true,
    "tags": [
      "bisap",
      "pancreatite",
      "amilasi",
      "lipasi",
      "addome",
      "rianimazione"
    ],
    "macroId": "gastro",
    "subId": "gastro-urgenze",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Pancreatite Acuta & Emorragie (BISAP, Ranson, Rockall)"
  },
  {
    "id": "indice-maddrey-epatite-alcolica",
    "title": "Indice Discriminante di Maddrey (Epatite Alcolica Grave)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Identificazione dei pazienti con epatite alcolica severa candidati al trattamento corticosteroideo.",
    "path": "../Calcolatori/Indice di Maddrey/index.html",
    "isReady": true,
    "tags": [
      "maddrey",
      "epatite alcolica",
      "bilirubina",
      "tempo di protrombina",
      "corticosteroidi"
    ],
    "macroId": "gastro",
    "subId": "gastro-fegato",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Cirrosi & Funzione Epatica (Child, MELD)"
  },
  {
    "id": "punteggio-mallampati-intubazione",
    "title": "Classificazione di Mallampati (Valutazione Vie Aeree)",
    "category": "chirurgia",
    "categoryLabel": "Chirurgia & Perioperatorio",
    "description": "Predittore visivo anatomico di intubazione orotracheale difficile in anestesia e rianimazione.",
    "path": "../Calcolatori/Punteggio Mallampati/index.html",
    "isReady": true,
    "tags": [
      "mallampati",
      "intubazione",
      "anestesia",
      "vie aeree",
      "laringoscopia"
    ],
    "macroId": "chirurgia",
    "subId": "chir-anestesia",
    "macroName": "Chirurgia & Perioperatorio",
    "subName": "Rischio Anestesiologico & Vie Aeree (ASA, Lee, Mallampati)"
  },
  {
    "id": "criteri-sirs-risposta-infiammatoria",
    "title": "Criteri SIRS (Sindrome da Risposta Infiammatoria Sistemica)",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Screening della risposta infiammatoria sistemica a infezioni, traumi, pancreatiti o ustioni.",
    "path": "../Calcolatori/Criteri SIRS/index.html",
    "isReady": true,
    "tags": [
      "sirs",
      "infiammazione",
      "febbre",
      "sepsi",
      "tachicardia",
      "leucocitosi"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-triage",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Early Warning & Triage (NEWS2, SIRS, RTS)"
  },
  {
    "id": "regola-dei-nove-wallace-ustioni",
    "title": "Regola dei Nove di Wallace (Superficie Ustionata TBSA)",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Stima rapida dell'estensione percentuale delle ustioni nell'adulto per il calcolo della fluidoterapia.",
    "path": "../Calcolatori/Regola dei Nove (Wallace)/index.html",
    "isReady": true,
    "tags": [
      "wallace",
      "regola dei nove",
      "ustioni",
      "tbsa",
      "emergenza"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-ustioni",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Ustioni & Fluidoterapia (Parkland)"
  },
  {
    "id": "ecog-performance-status",
    "title": "Scala ECOG / WHO Performance Status",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Quantificazione della capacità funzionale del paziente oncologico e idoneità ai trattamenti chemioterapici.",
    "path": "../Calcolatori/Performance Status ECOG/index.html",
    "isReady": true,
    "tags": [
      "ecog",
      "performance status",
      "oncologia",
      "chemioterapia",
      "autonomia"
    ],
    "macroId": "ematologia",
    "subId": "emato-onco",
    "macroName": "Ematologia & Oncologia",
    "subName": "Valutazione Oncologica (ECOG, Karnofsky, Calvert)"
  },
  {
    "id": "clearance-acqua-libera",
    "title": "Clearance dell'Acqua Libera (CH₂O)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Quantificazione della capacità renale di diluire o concentrare le urine.",
    "path": "../Calcolatori/Clearance Acqua Libera (CH2O)/index.html",
    "isReady": true,
    "tags": [
      "ch2o",
      "acqua libera",
      "clearance",
      "osmolarita",
      "diabete insipido"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "escrezione-frazionata-potassio-fek",
    "title": "Escrezione Frazionata del Potassio (FEK)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Differenziazione tra cause renali ed extrarenali di ipokaliemia o iperkaliemia.",
    "path": "../Calcolatori/Frazione Escrezione Potassio (FEK)/index.html",
    "isReady": true,
    "tags": [
      "fek",
      "potassio",
      "escrezione",
      "kaliuria",
      "aldosterone"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-idro",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Idratazione, Osmolarità & Elettroliti"
  },
  {
    "id": "egfr-mdrd-4",
    "title": "eGFR Formula MDRD (4 Variabili)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Equazione storica Modification of Diet in Renal Disease (MDRD) per la stima del filtrato glomerulare.",
    "path": "../Calcolatori/eGFR Equazione MDRD/index.html",
    "isReady": true,
    "tags": [
      "mdrd",
      "egfr",
      "creatinina",
      "filtrato",
      "rene"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-gfr",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Filtrato Glomerulare & Clearance"
  },
  {
    "id": "timi-stemi-score",
    "title": "Score TIMI per Infarto Miocardico STEMI",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Predizione della mortalità a 30 giorni nei pazienti con infarto miocardico acuto con sopraslivellamento del tratto ST.",
    "path": "../Calcolatori/TIMI Score STEMI/index.html",
    "isReady": true,
    "tags": [
      "timi",
      "stemi",
      "infarto",
      "angioplastica",
      "morte",
      "coronaria"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-sca",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Sindromi Coronariche Acute & Ischemia"
  },
  {
    "id": "grace-2-acs",
    "title": "Punteggio GRACE 2.0 (Sindrome Coronarica Acuta)",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Emodinamica",
    "description": "Stratificazione prognostica di mortalità intraospedaliera e a 6 mesi nelle sindromi coronariche acute.",
    "path": "../Calcolatori/Punteggio GRACE 2.0/index.html",
    "isReady": true,
    "tags": [
      "grace",
      "sca",
      "stemi",
      "nstemi",
      "coronarografia",
      "mortalita"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-sca",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Sindromi Coronariche Acute & Ischemia"
  },
  {
    "id": "cutoff-ddimero-eta",
    "title": "Valore Soglia del D-Dimero Aggiustato per l'Età",
    "category": "cardiologia",
    "categoryLabel": "Cardiologia & Angiologia",
    "description": "Aumento della specificità del D-Dimero nei pazienti con età > 50 anni per l'esclusione di TVP ed Embolia Polmonare.",
    "path": "../Calcolatori/D-Dimero Aggiustato per Età/index.html",
    "isReady": true,
    "tags": [
      "d-dimero",
      "cutoff",
      "eta",
      "embolia",
      "tvp",
      "trombosi"
    ],
    "macroId": "cardiologia",
    "subId": "cardio-fa",
    "macroName": "Cardiologia & Vascolare",
    "subName": "Fibrillazione Atriale & Rischio Tromboembolico"
  },
  {
    "id": "criteri-ranson-pancreatite",
    "title": "Criteri di Ranson per la Gravità della Pancreatite Acuta",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Stratificazione prognostica della pancreatite acuta non biliare all'ammissione e a 48 ore.",
    "path": "../Calcolatori/Criteri di Ranson Pancreatite/index.html",
    "isReady": true,
    "tags": [
      "ranson",
      "pancreatite",
      "amilasi",
      "addome",
      "rianimazione"
    ],
    "macroId": "gastro",
    "subId": "gastro-urgenze",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Pancreatite Acuta & Emorragie (BISAP, Ranson, Rockall)"
  },
  {
    "id": "indice-apri-fibrosi",
    "title": "Indice APRI (AST to Platelet Ratio Index)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Stima rapida non invasiva del grado di fibrosi epatica e cirrosi a partire da AST e piastrine.",
    "path": "../Calcolatori/Indice APRI per Fibrosi Epatica/index.html",
    "isReady": true,
    "tags": [
      "apri",
      "fibrosi",
      "cirrosi",
      "ast",
      "piastrine",
      "fegato"
    ],
    "macroId": "gastro",
    "subId": "gastro-fibrosi",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Fibrosi & Transaminasi (FIB-4, APRI, De Ritis)"
  },
  {
    "id": "score-rockall-emorragia",
    "title": "Score di Rockall per Emorragia Digestiva Superiore",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Predizione del rischio di recidiva emorragica e mortalità dopo endoscopia per sanguinamento digestivo alto.",
    "path": "../Calcolatori/Score di Rockall/index.html",
    "isReady": true,
    "tags": [
      "rockall",
      "emorragia",
      "endoscopia",
      "forrest",
      "ulcera"
    ],
    "macroId": "gastro",
    "subId": "gastro-urgenze",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Pancreatite Acuta & Emorragie (BISAP, Ranson, Rockall)"
  },
  {
    "id": "indice-quicki-insulina",
    "title": "Indice QUICKI (Quantitative Insulin Sensitivity Check Index)",
    "category": "endocrinologia",
    "categoryLabel": "Endocrinologia & Diabete",
    "description": "Valutazione logaritmica della sensibilità insulinica periferica a partire da glicemia e insulinemia basali.",
    "path": "../Calcolatori/Indice QUICKI/index.html",
    "isReady": true,
    "tags": [
      "quicki",
      "insulina",
      "insulino-resistenza",
      "glicemia",
      "homa"
    ],
    "macroId": "endocrinologia",
    "subId": "endo-insulina",
    "macroName": "Endocrinologia & Diabete",
    "subName": "Insulino-Resistenza & Diabete (HOMA, QUICKI, eAG)"
  },
  {
    "id": "dosaggio-levotiroxina-ipotiroidismo",
    "title": "Dosaggio Sostitutivo di Levotiroxina (L-T4)",
    "category": "endocrinologia",
    "categoryLabel": "Endocrinologia & Diabete",
    "description": "Stima della dose piena iniziale di L-Tiroxina per ipotiroidismo primario franco o post-tiroidectomia.",
    "path": "../Calcolatori/Dosaggio Levotiroxina/index.html",
    "isReady": true,
    "tags": [
      "levotiroxina",
      "t4",
      "tsh",
      "tiroide",
      "ipotiroidismo",
      "dosaggio"
    ],
    "macroId": "endocrinologia",
    "subId": "endo-tiroide",
    "macroName": "Endocrinologia & Diabete",
    "subName": "Tiroide & Ormoni (Levotiroxina)"
  },
  {
    "id": "osmolarita-efficace-dka",
    "title": "Osmolarità Sierica Efficace (Tonicità nella DKA/HHS)",
    "category": "endocrinologia",
    "categoryLabel": "Endocrinologia & Diabete",
    "description": "Calcolo della pressione osmotica effettiva dei fluidi che determina lo shift di acqua dalle cellule nella chetoacidosi e stato iperosmolare.",
    "path": "../Calcolatori/Osmolarità Efficace (Tonicità DKA)/index.html",
    "isReady": true,
    "tags": [
      "tonicità",
      "dka",
      "hhs",
      "chetoacidosi",
      "diabete",
      "osmolarita efficace"
    ],
    "macroId": "endocrinologia",
    "subId": "endo-terapia",
    "macroName": "Endocrinologia & Diabete",
    "subName": "Terapia Insulinica (ISF) & Emergenze (DKA)"
  },
  {
    "id": "mrs-modified-rankin-scale",
    "title": "Scala di Rankin Modificata (mRS per Disabilità post-Ictus)",
    "category": "neurologia",
    "categoryLabel": "Neurologia & Ictus",
    "description": "Standard per misurare il grado di disabilità o dipendenza nelle attività quotidiane dopo un ictus cerebrale.",
    "path": "../Calcolatori/Scala di Rankin Modificata (mRS)/index.html",
    "isReady": true,
    "tags": [
      "mrs",
      "rankin",
      "ictus",
      "disabilita",
      "trombolisi",
      "trombectomia"
    ],
    "macroId": "neurologia",
    "subId": "neuro-ictus",
    "macroName": "Neurologia & Ictus",
    "subName": "Ictus & Ischemia Cerebrale (ABCD², mRS)"
  },
  {
    "id": "revised-trauma-score-rts",
    "title": "Revised Trauma Score (RTS Fisiologico)",
    "category": "rianimazione",
    "categoryLabel": "Urgenza, Rianimazione & Trauma",
    "description": "Punteggio fisiologico per il triage sul campo e la predizione di sopravvivenza nel politraumatizzato.",
    "path": "../Calcolatori/Revised Trauma Score (RTS)/index.html",
    "isReady": true,
    "tags": [
      "rts",
      "trauma",
      "politrauma",
      "triage",
      "pronto soccorso",
      "emergenza"
    ],
    "macroId": "rianimazione",
    "subId": "urgenza-triage",
    "macroName": "Urgenza, Intensiva & Trauma",
    "subName": "Early Warning & Triage (NEWS2, SIRS, RTS)"
  },
  {
    "id": "score-caprini-tev-chirurgico",
    "title": "Score di Caprini per Rischio Tromboembolico Chirurgico",
    "category": "chirurgia",
    "categoryLabel": "Chirurgia & Perioperatorio",
    "description": "Stratificazione del rischio di trombosi venosa profonda ed embolia polmonare e guida alla tromboprofilassi.",
    "path": "../Calcolatori/Score di Caprini/index.html",
    "isReady": true,
    "tags": [
      "caprini",
      "tev",
      "tvp",
      "profilassi",
      "eparina",
      "chirurgia"
    ],
    "macroId": "chirurgia",
    "subId": "chir-trombosi",
    "macroName": "Chirurgia & Perioperatorio",
    "subName": "Tromboprofilassi Chirurgica (Caprini, Wells TVP)"
  },
  {
    "id": "formula-clark-dosaggio-pediatrico",
    "title": "Formula di Clark per Dosaggio Farmaci Pediatrici",
    "category": "pediatria",
    "categoryLabel": "Pediatria & Neonatologia",
    "description": "Calcolo della dose pediatrica sicura proporzionata al peso corporeo a partire dalla dose standard dell'adulto.",
    "path": "../Calcolatori/Formula di Clark (Farmaci Pediatrici)/index.html",
    "isReady": true,
    "tags": [
      "clark",
      "pediatria",
      "dosaggio",
      "farmaci",
      "posologia"
    ],
    "macroId": "pediatria",
    "subId": "ped-farmaci",
    "macroName": "Pediatria & Neonatologia",
    "subName": "Posologia & Fabbisogni Pediatrici (Clark)"
  },
  {
    "id": "criteri-centor-originali",
    "title": "Criteri di Centor Classici per Faringite",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Score originale a 4 elementi per la stima della probabilità di faringite da streptococco beta-emolitico nell'adulto.",
    "path": "../Calcolatori/Criteri di Centor Classici/index.html",
    "isReady": true,
    "tags": [
      "centor",
      "faringite",
      "gola",
      "tonsille",
      "streptococco"
    ],
    "macroId": "infettivologia",
    "subId": "inf-infezioni",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)"
  },
  {
    "id": "formula-ganzoni-deficit-ferro",
    "title": "Deficit Totale di Ferro (Formula di Ganzoni)",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Calcolo del ferro elementare endovenoso totale (mg) per correggere l'anemia sideropenica e ripristinare i depositi.",
    "path": "../Calcolatori/Deficit di Ferro (Formula di Ganzoni)/index.html",
    "isReady": true,
    "tags": [
      "ganzoni",
      "ferro",
      "sideropenia",
      "anemia",
      "ferritina",
      "carbossimaltosio"
    ],
    "macroId": "ematologia",
    "subId": "emato-anemie",
    "macroName": "Ematologia & Oncologia",
    "subName": "Anemie & Assetto Marziale (Mentzer, Ganzoni)"
  },
  {
    "id": "indice-de-ritis-ast-alt",
    "title": "Rapporto AST / ALT (Indice di De Ritis)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Diagnosi differenziale delle epatopatie acute e croniche (alcolica vs non alcolica / virale).",
    "path": "../Calcolatori/Rapporto AST-ALT (Indice di De Ritis)/index.html",
    "isReady": true,
    "tags": [
      "de ritis",
      "ast",
      "alt",
      "transaminasi",
      "epatite",
      "alcol",
      "cirrosi"
    ],
    "macroId": "gastro",
    "subId": "gastro-fibrosi",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Fibrosi & Transaminasi (FIB-4, APRI, De Ritis)"
  },
  {
    "id": "gap-osmotico-fecale-diarrea",
    "title": "Gap Osmotico Fecale (Diarrea Osmotica vs Secretoria)",
    "category": "gastro",
    "categoryLabel": "Gastroenterologia & Epatologia",
    "description": "Differenziazione etiopatogenetica della diarrea cronica.",
    "path": "../Calcolatori/Gap Osmotico Fecale/index.html",
    "isReady": true,
    "tags": [
      "diarrea",
      "gap osmotico",
      "feci",
      "malassorbimento",
      "lassativi"
    ],
    "macroId": "gastro",
    "subId": "gastro-intestino",
    "macroName": "Gastroenterologia & Epatologia",
    "subName": "Liquidi & Fisiologia Intestinale (SAAG, Gap Fecale)"
  },
  {
    "id": "indice-mehran-nefropatia-contrasto",
    "title": "Score di Mehran per Nefropatia da Mezzo di Contrasto (CIN)",
    "category": "nefrologia",
    "categoryLabel": "Nefrologia & Elettroliti",
    "description": "Stratificazione del rischio di danno renale acuto (CIN) e dialisi dopo procedura coronarica percutanea.",
    "path": "../Calcolatori/Score di Mehran (Nefropatia da Contrasto)/index.html",
    "isReady": true,
    "tags": [
      "mehran",
      "cin",
      "contrasto",
      "angioplastica",
      "insufficienza renale"
    ],
    "macroId": "nefrologia",
    "subId": "nefro-urine",
    "macroName": "Nefrologia & Idroelettrolitico",
    "subName": "Diagnostica Urinaria & Proteinuria"
  },
  {
    "id": "karnofsky-performance-scale",
    "title": "Scala di Karnofsky Performance Status (KPS)",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Scala percentuale (0-100%) di quantificazione dell'autonomia funzionale e prognosi del paziente.",
    "path": "../Calcolatori/Scala di Karnofsky (KPS)/index.html",
    "isReady": true,
    "tags": [
      "karnofsky",
      "kps",
      "performance status",
      "oncologia",
      "cure palliative"
    ],
    "macroId": "ematologia",
    "subId": "emato-onco",
    "macroName": "Ematologia & Oncologia",
    "subName": "Valutazione Oncologica (ECOG, Karnofsky, Calvert)"
  },
  {
    "id": "volume-plasmatico-totale",
    "title": "Volume Plasmatico & Ematico Totale Stimato (Kaplan)",
    "category": "ematologia",
    "categoryLabel": "Ematologia & Oncologia",
    "description": "Stima del volume plasmatico per il calcolo delle sedute di plasmaferesi e scambio plasmatico terapeutico (TPE).",
    "path": "../Calcolatori/Volume Plasmatico Totale/index.html",
    "isReady": true,
    "tags": [
      "volume plasmatico",
      "plasmaferesi",
      "ematocrito",
      "aferesi",
      "sangue"
    ],
    "macroId": "ematologia",
    "subId": "emato-coag",
    "macroName": "Ematologia & Oncologia",
    "subName": "Coagulazione & Plasma (Score 4Ts, Volume Plasmatico)"
  },
  {
    "id": "criteri-ottawa-trauma-cranico",
    "title": "Criteri di Ottawa per Trauma Cranico (CCHR)",
    "category": "neurologia",
    "categoryLabel": "Neurologia & Urgenza",
    "description": "Regola clinica predittiva validata per decidere la necessità di eseguire la TC encefalo nel trauma cranico lieve.",
    "path": "../Calcolatori/Criteri di Ottawa Trauma Cranico/index.html",
    "isReady": true,
    "tags": [
      "ottawa",
      "cchr",
      "trauma cranico",
      "tc encefalo",
      "vomito",
      "amnesia"
    ],
    "macroId": "neurologia",
    "subId": "neuro-urgenze",
    "macroName": "Neurologia & Ictus",
    "subName": "Emorragie & Traumi (Hunt & Hess, CCHR Ottawa)"
  },
  {
    "id": "score-downes-croup",
    "title": "Score di Downes per Croup e Laringotracheite",
    "category": "pediatria",
    "categoryLabel": "Pediatria & Neonatologia",
    "description": "Valutazione clinica dell'ostruzione laringea acuta e indicazione all'adrenalina aerosolica e cortisonico.",
    "path": "../Calcolatori/Score di Downes per Croup/index.html",
    "isReady": true,
    "tags": [
      "downes",
      "croup",
      "laringite",
      "stridore",
      "pediatria",
      "adrenalina"
    ],
    "macroId": "pediatria",
    "subId": "ped-infezioni",
    "macroName": "Pediatria & Neonatologia",
    "subName": "Vie Aeree & Infezioni (Downes, McIsaac)"
  },
  {
    "id": "score-wells-tvp-gravidanza",
    "title": "Criteri di Wells Adattati per TEV in Gravidanza",
    "category": "chirurgia",
    "categoryLabel": "Ostetricia & Chirurgia",
    "description": "Stratificazione clinica del rischio di trombosi venosa profonda ed embolia polmonare durante la gestazione e puerperio.",
    "path": "../Calcolatori/Criteri Wells TEV Gravidanza/index.html",
    "isReady": true,
    "tags": [
      "gravidanza",
      "tvp",
      "parto",
      "puerperio",
      "wells",
      "eparina"
    ],
    "macroId": "chirurgia",
    "subId": "chir-trombosi",
    "macroName": "Chirurgia & Perioperatorio",
    "subName": "Tromboprofilassi Chirurgica (Caprini, Wells TVP)"
  },
  {
    "id": "criteri-duke-endocardite",
    "title": "Criteri di Duke Modificati per Endocardite Infettiva",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Diagnosi clinica, microbiologica ed ecocardiografica standardizzata di endocardite infettiva (ESC/AHA).",
    "path": "../Calcolatori/Criteri di Duke per Endocardite/index.html",
    "isReady": true,
    "tags": [
      "duke",
      "endocardite",
      "emocolture",
      "ecocardiogramma",
      "vegetazione",
      "soffio"
    ],
    "macroId": "infettivologia",
    "subId": "inf-infezioni",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)"
  },
  {
    "id": "dosaggio-vancomicina-auc",
    "title": "Dosaggio Vancomicina & Target Trough / AUC/MIC",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Calcolo della dose di carico e di mantenimento di vancomicina EV e monitoraggio del livello di valle (trough) e AUC/MIC (target 400-600).",
    "path": "../Calcolatori/Dosaggio Vancomicina (AUC-MIC)/index.html",
    "isReady": true,
    "tags": [
      "vancomicina",
      "antibiotici",
      "auc",
      "trough",
      "mrsa",
      "farmacocinetica",
      "creatinina"
    ],
    "macroId": "infettivologia",
    "subId": "inf-tdm",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Monitoraggio TDM Antibiotici (Vancomicina, Aminoglicosidi)"
  },
  {
    "id": "dosaggio-aminoglicosidi-hartford",
    "title": "Dosaggio Aminoglicosidi a Somministrazione Giornaliera Singola (Hartford)",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Metodo a dose estesa una volta al giorno per Gentamicina e Tobramicina (7 mg/kg) o Amikacina (15 mg/kg).",
    "path": "../Calcolatori/Dosaggio Aminoglicosidi (Hartford)/index.html",
    "isReady": true,
    "tags": [
      "aminoglicosidi",
      "gentamicina",
      "tobramicina",
      "amikacina",
      "hartford",
      "antibiotici"
    ],
    "macroId": "infettivologia",
    "subId": "inf-tdm",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Monitoraggio TDM Antibiotici (Vancomicina, Aminoglicosidi)"
  },
  {
    "id": "clostridioides-difficile-idsa",
    "title": "Classificazione di Gravità Infezione da C. difficile (IDSA / SHEA)",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Stratificazione di gravità dell'infezione da Clostridioides difficile per la scelta della terapia (Fidaxomicina vs Vancomicina orale).",
    "path": "../Calcolatori/Gravità Clostridioides Difficile/index.html",
    "isReady": true,
    "tags": [
      "clostridioides",
      "difficile",
      "colite",
      "vancomicina",
      "fidaxomicina",
      "diarrea"
    ],
    "macroId": "infettivologia",
    "subId": "inf-infezioni",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)"
  },
  {
    "id": "peritonite-batterica-spontanea-sbp",
    "title": "Diagnosi di Peritonite Batterica Spontanea (SBP)",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Criterio citologico cardine per l'infezione del liquido ascitico nel paziente cirrotico e indicazione ad antibiotico ed albumina EV.",
    "path": "../Calcolatori/Peritonite Batterica Spontanea (SBP)/index.html",
    "isReady": true,
    "tags": [
      "sbp",
      "ascite",
      "peritonite",
      "cirrosi",
      "albumina",
      "cefotaxime",
      "neutrofili"
    ],
    "macroId": "infettivologia",
    "subId": "inf-infezioni",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)"
  },
  {
    "id": "classificazione-eron-infezioni-cutanee",
    "title": "Classificazione di Eron per Infezioni Cutanee e dei Tessuti Molli (SSTI)",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Guida clinica per la scelta del setting di cura (ambulatoriale orale vs ricovero EV) nella cellulite ed erisipela.",
    "path": "../Calcolatori/Classificazione di Eron (Cellulite)/index.html",
    "isReady": true,
    "tags": [
      "eron",
      "cellulite",
      "erisipela",
      "infezione cutanea",
      "ssti",
      "antibiotico"
    ],
    "macroId": "infettivologia",
    "subId": "inf-infezioni",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)"
  },
  {
    "id": "psi-port-score-polmonite",
    "title": "Pneumonia Severity Index (Score PSI / PORT)",
    "category": "infettivologia",
    "categoryLabel": "Infettivologia & Antibiotici",
    "description": "Stratificazione prognostica a 5 classi di rischio di mortalità a 30 giorni per polmonite acquisita in comunità.",
    "path": "../Calcolatori/Pneumonia Severity Index (PSI-PORT)/index.html",
    "isReady": true,
    "tags": [
      "psi",
      "port",
      "polmonite",
      "cap",
      "infezione",
      "antibiotico",
      "ospedale"
    ],
    "macroId": "infettivologia",
    "subId": "inf-infezioni",
    "macroName": "Infettivologia & Antimicrobici",
    "subName": "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MACROAREAS, CATEGORIES, CALCULATORS };
}
