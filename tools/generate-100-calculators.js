const fs = require('fs');
const path = require('path');

// Categorie mediche
const CATEGORIES = [
  { id: "all", name: "Tutti i calcolatori (100+)", icon: "🏥" },
  { id: "nutrizione", name: "Nutrizione & Metabolismo", icon: "🥗" },
  { id: "cardiologia", name: "Cardiologia & Emodinamica", icon: "❤️" },
  { id: "nefrologia", name: "Nefrologia & Elettroliti", icon: "💧" },
  { id: "rianimazione", name: "Urgenza, Rianimazione & Trauma", icon: "⚡" },
  { id: "pneumologia", name: "Pneumologia & Gasometria", icon: "🫁" },
  { id: "gastro", name: "Gastroenterologia & Epatologia", icon: "🩺" },
  { id: "endocrinologia", name: "Endocrinologia & Diabete", icon: "🔬" },
  { id: "ematologia", name: "Ematologia & Oncologia", icon: "🩸" },
  { id: "pediatria", name: "Pediatria & Neonatologia", icon: "👶" },
  { id: "neurologia", name: "Neurologia & Ictus", icon: "🧠" },
  { id: "chirurgia", name: "Chirurgia & Perioperatorio", icon: "🔪" },
  { id: "infettivologia", name: "Infettivologia & Antibiotici", icon: "🦠" }
];

// Lista completa di oltre 100 calcolatori medici
const CALCS = [
  // -------------------------------------------------------------
  // NUTRIZIONE & METABOLISMO (1-10)
  // -------------------------------------------------------------
  {
    id: "calcolo-metabolismo",
    folder: "Calcolo metabolismo",
    title: "Calcolo Metabolismo (Basale + LAF)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Stima del Metabolismo Basale (BMR) con formule validate e Fabbisogno Energetico Totale (TDEE) con LAF.",
    tags: ["bmr", "tdee", "laf", "calorie", "fabbisogno", "energia"],
    skipGeneration: true
  },
  {
    id: "calcolo-bmi",
    folder: "Indice di Massa Corporea (BMI)",
    title: "Indice di Massa Corporea (BMI) e Peso Ideale",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Calcolo del BMI (OMS) con intervalli di peso ideale secondo formule di Lorentz, Devine e Robinson.",
    tags: ["bmi", "peso", "altezza", "obesita", "sottopeso", "lorentz", "devine"],
    inputs: [
      { id: "gender", label: "Sesso Biologico", type: "select", options: [{val: "m", label: "Maschio"}, {val: "f", label: "Femmina"}] },
      { id: "weight", label: "Peso", unit: "kg", type: "number", step: "0.1", min: "20", max: "300", def: "70" },
      { id: "height", label: "Altezza", unit: "cm", type: "number", step: "0.5", min: "50", max: "250", def: "175" }
    ],
    calcLogic: `
      const hM = height / 100;
      const bmi = weight / (hM * hM);
      let cat = ""; let color = "#2e7d32";
      if (bmi < 18.5) { cat = "Sottopeso"; color = "#d97706"; }
      else if (bmi < 25) { cat = "Normopeso"; color = "#2e7d32"; }
      else if (bmi < 30) { cat = "Sovrappeso"; color = "#d97706"; }
      else if (bmi < 35) { cat = "Obesità di Classe I"; color = "#c62828"; }
      else if (bmi < 40) { cat = "Obesità di Classe II"; color = "#c62828"; }
      else { cat = "Obesità di Classe III"; color = "#7f1d1d"; }
      const pLorentz = gender === "m" ? (height - 100) - ((height - 150) / 4) : (height - 100) - ((height - 150) / 2);
      const inchesOver5ft = Math.max(0, (height / 2.54) - 60);
      const pDevine = gender === "m" ? 50 + (2.3 * inchesOver5ft) : 45.5 + (2.3 * inchesOver5ft);
      return {
        mainValue: bmi.toFixed(1) + " kg/m²",
        mainLabel: "Indice di Massa Corporea",
        metrics: [
          { label: "Classificazione OMS", val: cat, color: color },
          { label: "Peso Ideale (Lorentz)", val: pLorentz.toFixed(1) + " kg" },
          { label: "Peso Ideale (Devine)", val: pDevine.toFixed(1) + " kg" },
          { label: "Range Normopeso", val: (18.5*hM*hM).toFixed(1) + " - " + (24.9*hM*hM).toFixed(1) + " kg" }
        ],
        note: "Formula BMI = Peso (kg) / [Altezza (m)]². Classificazione secondo standard OMS."
      };
    `
  },
  {
    id: "superficie-corporea-bsa",
    folder: "Superficie Corporea (BSA)",
    title: "Superficie Corporea (BSA - DuBois, Mosteller)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Calcolo della Body Surface Area (BSA) per la calibrazione posologica di chemioterapici e indici emodinamici.",
    tags: ["bsa", "superficie", "mosteller", "dubois", "oncologia", "chemioterapia"],
    inputs: [
      { id: "weight", label: "Peso", unit: "kg", type: "number", step: "0.1", min: "2", max: "250", def: "70" },
      { id: "height", label: "Altezza", unit: "cm", type: "number", step: "0.5", min: "30", max: "250", def: "175" }
    ],
    calcLogic: `
      const bsaMosteller = Math.sqrt((weight * height) / 3600);
      const bsaDubois = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
      const bsaHaycock = 0.024265 * Math.pow(weight, 0.5378) * Math.pow(height, 0.3964);
      return {
        mainValue: bsaMosteller.toFixed(2) + " m²",
        mainLabel: "Superficie Corporea (Mosteller)",
        metrics: [
          { label: "Formula DuBois & DuBois", val: bsaDubois.toFixed(2) + " m²" },
          { label: "Formula di Haycock", val: bsaHaycock.toFixed(2) + " m²" },
          { label: "Valore Medio Adulto Rif.", val: "1.7 - 1.9 m²" }
        ],
        note: "La formula di Mosteller (sqrt[peso*altezza/3600]) è la più impiegata in oncologia clinica e terapia intensiva."
      };
    `
  },
  {
    id: "rapporto-vita-fianchi-whr",
    folder: "Rapporto Vita-Fianchi (WHR)",
    title: "Rapporto Vita / Fianchi (WHR)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Valutazione dell'adiposità viscerale (obesità androide vs ginoide) e rischio cardiovascolare.",
    tags: ["whr", "vita", "fianchi", "viscerale", "adiposita", "cardiovascolare"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Uomo"}, {val: "f", label: "Donna"}] },
      { id: "waist", label: "Circonferenza Vita", unit: "cm", type: "number", step: "0.5", min: "40", max: "200", def: "88" },
      { id: "hip", label: "Circonferenza Fianchi", unit: "cm", type: "number", step: "0.5", min: "50", max: "220", def: "100" }
    ],
    calcLogic: `
      const whr = waist / hip;
      let risk = "Basso"; let color = "#2e7d32";
      if (gender === "m") {
        if (whr >= 0.90 && whr < 1.0) { risk = "Moderato"; color = "#d97706"; }
        else if (whr >= 1.0) { risk = "Elevato (Adiposità Androide)"; color = "#c62828"; }
      } else {
        if (whr >= 0.80 && whr < 0.85) { risk = "Moderato"; color = "#d97706"; }
        else if (whr >= 0.85) { risk = "Elevato (Adiposità Androide)"; color = "#c62828"; }
      }
      return {
        mainValue: whr.toFixed(2),
        mainLabel: "Rapporto Vita / Fianchi (WHR)",
        metrics: [
          { label: "Rischio Cardiovascolare", val: risk, color: color },
          { label: "Soglia Rischio Uomo", val: "≥ 0.90" },
          { label: "Soglia Rischio Donna", val: "≥ 0.85" }
        ],
        note: "Linee guida OMS per l'obesità addominale e la sindrome metabolica."
      };
    `
  },
  {
    id: "fabbisogno-idrico-holliday",
    folder: "Fabbisogno Idrico (Holliday-Segar)",
    title: "Fabbisogno Idrico di Mantenimento (Holliday-Segar)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Stima dei liquidi endovenosi o orali di mantenimento per 24 ore in pazienti pediatrici e adulti.",
    tags: ["liquidi", "idratazione", "holliday-segar", "infusione", "mantenimento"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.1", min: "2", max: "200", def: "25" }
    ],
    calcLogic: `
      let mlDay = 0;
      if (weight <= 10) mlDay = weight * 100;
      else if (weight <= 20) mlDay = 1000 + (weight - 10) * 50;
      else mlDay = 1500 + (weight - 20) * 20;
      const mlHour = mlDay / 24;
      return {
        mainValue: Math.round(mlDay) + " mL / 24h",
        mainLabel: "Volume Totale Giornaliero",
        metrics: [
          { label: "Velocità di Infusione Oraria", val: mlHour.toFixed(1) + " mL/h" },
          { label: "Regola 4-2-1", val: "Applicata con successo" }
        ],
        note: "Formula di Holliday-Segar: 100 mL/kg per i primi 10kg, 50 mL/kg per i successivi 10kg, 20 mL/kg per il rimanente."
      };
    `
  },
  {
    id: "massa-grassa-us-navy",
    folder: "Percentuale Massa Grassa (US Navy)",
    title: "Stima Massa Grassa (% Body Fat - Formula US Navy)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Calcolo della percentuale di massa grassa e massa magra a partire dalle circonferenze corporee.",
    tags: ["massa grassa", "body fat", "composizione corporea", "navy", "massa magra"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Maschio"}, {val: "f", label: "Femmina"}] },
      { id: "height", label: "Altezza", unit: "cm", type: "number", step: "0.5", min: "100", max: "250", def: "175" },
      { id: "neck", label: "Circonferenza Collo", unit: "cm", type: "number", step: "0.5", min: "25", max: "60", def: "38" },
      { id: "waist", label: "Circonferenza Vita", unit: "cm", type: "number", step: "0.5", min: "40", max: "180", def: "84" },
      { id: "hip", label: "Circonferenza Fianchi (solo per donne)", unit: "cm", type: "number", step: "0.5", min: "40", max: "200", def: "95" }
    ],
    calcLogic: `
      let bf = 0;
      if (gender === "m") {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      }
      bf = Math.max(3, Math.min(65, bf));
      let cat = "Normale / Fitness";
      let col = "#2e7d32";
      if (gender === "m") {
        if (bf > 25) { cat = "Eccesso adiposo"; col = "#c62828"; }
        else if (bf > 18) { cat = "Media"; col = "#d97706"; }
      } else {
        if (bf > 32) { cat = "Eccesso adiposo"; col = "#c62828"; }
        else if (bf > 25) { cat = "Media"; col = "#d97706"; }
      }
      return {
        mainValue: bf.toFixed(1) + " %",
        mainLabel: "Percentuale di Massa Grassa",
        metrics: [
          { label: "Categoria Composizione Corporea", val: cat, color: col },
          { label: "Massa Magra Stimata", val: (100 - bf).toFixed(1) + " %" }
        ],
        note: "Metodo antropometrico US Navy standard Hodgdon & Beckett."
      };
    `
  },
  {
    id: "indice-nutrizionale-prognostico-pni",
    folder: "Indice Nutrizionale Prognostico (PNI)",
    title: "Indice Nutrizionale Prognostico (PNI di Onodera)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Valutazione dello stato nutrizionale e del rischio immunologico perioperatorio nel paziente chirurgico.",
    tags: ["pni", "onodera", "malnutrizione", "albumina", "linfociti", "chirurgia"],
    inputs: [
      { id: "alb", label: "Albumina Sierica", unit: "g/dL", type: "number", step: "0.1", min: "1", max: "6", def: "3.8" },
      { id: "lym", label: "Linfociti Totali", unit: "/µL", type: "number", step: "50", min: "100", max: "10000", def: "1800" }
    ],
    calcLogic: `
      const pni = (10 * alb) + (0.005 * lym);
      let risk = "Buono stato nutrizionale (PNI > 45)";
      let color = "#2e7d32";
      if (pni < 40) {
        risk = "Grave malnutrizione / Alto rischio complicanze post-operatorie (PNI < 40)";
        color = "#c62828";
      } else if (pni <= 45) {
        risk = "Moderata malnutrizione (PNI 40-45)";
        color = "#d97706";
      }
      return {
        mainValue: pni.toFixed(1) + " Punti",
        mainLabel: "Indice PNI",
        metrics: [
          { label: "Rischio Clinico Post-operatorio", val: risk, color: color },
          { label: "Formula di Onodera", val: "10 * Alb(g/dL) + 0.005 * Linfociti(/µL)" }
        ],
        note: "Onodera T et al. (1984). PNI < 40 correla con aumento significativo di deiscenze anastomotiche e mortalità."
      };
    `
  },
  {
    id: "fabbisogno-proteico-clinico",
    folder: "Fabbisogno Proteico Giornaliero",
    title: "Fabbisogno Proteico Giornaliero Clinico",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Calcolo della quota proteica giornaliera raccomandata in base al quadro clinico (normale, ipercatabolico, sarcopenia, dialisi).",
    tags: ["proteine", "nutrizione clinica", "fabbisogno", "catabolismo", "dialisi", "sarcopenia"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.1", min: "20", max: "200", def: "70" },
      { id: "clinical", label: "Condizione Clinica", type: "select", options: [
        {val: "0.8", label: "Adulto Sano Sedentario (0.8 g/kg)"},
        {val: "1.2", label: "Anziano / Sarcopenia / Attività moderata (1.2 g/kg)"},
        {val: "1.5", label: "Paziente Ospedalizzato / Ipercatabolico / Traumatizzato (1.5 g/kg)"},
        {val: "2.0", label: "Ustione Severa / Politrauma / Sepsi Grave (2.0 g/kg)"},
        {val: "1.3", label: "Paziente in Emodialisi (1.2 - 1.4 g/kg)"},
        {val: "0.6", label: "Insufficienza Renale Avanzata non dialitica - Dieta Ipoproteica (0.6 g/kg)"}
      ]}
    ],
    calcLogic: `
      const factor = parseFloat(clinical);
      const totalProt = weight * factor;
      const totalKcalProt = totalProt * 4;
      return {
        mainValue: Math.round(totalProt) + " g / die",
        mainLabel: "Fabbisogno Proteico Totale",
        metrics: [
          { label: "Apporto Relativo", val: factor + " g / kg / die" },
          { label: "Calorie Fornite dalle Proteine", val: Math.round(totalKcalProt) + " kcal/die (4 kcal/g)" }
        ],
        note: "Linee guida ESPEN per la nutrizione clinica e metabolismo."
      };
    `
  },
  {
    id: "calorie-npt-glucosio-lipidi",
    folder: "Calcolo Calorie NPT",
    title: "Calcolo Calorie da Nutrizione Parenterale (NPT)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Computo delle kilocalorie effettive fornite da glucosio monoidrato (3.4 kcal/g), lipidi ed aminoacidi.",
    tags: ["npt", "nutrizione parenterale", "glucosio", "lipidi", "aminoacidi", "rianimazione"],
    inputs: [
      { id: "dextrose", label: "Glucosio Endovena (destrosio)", unit: "g", type: "number", step: "10", min: "0", max: "800", def: "200" },
      { id: "lipids", label: "Emulsione Lipidica", unit: "g", type: "number", step: "5", min: "0", max: "200", def: "50" },
      { id: "amino", label: "Aminoacidi", unit: "g", type: "number", step: "5", min: "0", max: "250", def: "70" }
    ],
    calcLogic: `
      const kcalDex = dextrose * 3.4; // Glucosio monoidrato endovena = 3.4 kcal/g
      const kcalLip = lipids * 10.0;   // Emulsioni lipidiche commerciali tipiche ~10 kcal/g
      const kcalAa = amino * 4.0;
      const total = kcalDex + kcalLip + kcalAa;
      return {
        mainValue: Math.round(total) + " kcal / die",
        mainLabel: "Calorie Totali Fornite da NPT",
        metrics: [
          { label: "Da Glucosio (3.4 kcal/g)", val: Math.round(kcalDex) + " kcal (" + Math.round((kcalDex/total)*100) + "%)" },
          { label: "Da Lipidi (10 kcal/g)", val: Math.round(kcalLip) + " kcal (" + Math.round((kcalLip/total)*100) + "%)" },
          { label: "Da Aminoacidi (4.0 kcal/g)", val: Math.round(kcalAa) + " kcal (" + Math.round((kcalAa/total)*100) + "%)" }
        ],
        note: "Il destrosio monoidrato idrato fornisce 3.4 kcal/g (non 4.0 come i carboidrati enterici)."
      };
    `
  },
  {
    id: "circonferenza-vita-cardio",
    folder: "Circonferenza Vita e Rischio Metabolico",
    title: "Circonferenza Vita e Sindrome Metabolica",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Criteri NCEP-ATP III e IDF per l'obesità viscerale nella sindrome metabolica.",
    tags: ["circonferenza vita", "sindrome metabolica", "atp iii", "idf", "diabete"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Uomo"}, {val: "f", label: "Donna"}] },
      { id: "waist", label: "Circonferenza Vita", unit: "cm", type: "number", step: "0.5", min: "40", max: "180", def: "98" }
    ],
    calcLogic: `
      const thresholdIdf = gender === "m" ? 94 : 80;
      const thresholdNcep = gender === "m" ? 102 : 88;
      let interp = "Normale";
      let col = "#2e7d32";
      if (waist >= thresholdNcep) {
        interp = "Criterio NCEP-ATP III Soddisfatto (Rischio Elevato)";
        col = "#c62828";
      } else if (waist >= thresholdIdf) {
        interp = "Criterio IDF Soddisfatto (Rischio Aumentato)";
        col = "#d97706";
      }
      return {
        mainValue: waist + " cm",
        mainLabel: "Circonferenza Vita Rilevata",
        metrics: [
          { label: "Valutazione Rischio Obesità Viscerale", val: interp, color: col },
          { label: "Soglia IDF Uomo / Donna", val: "≥ 94 cm / ≥ 80 cm" },
          { label: "Soglia NCEP-ATP III Uomo / Donna", val: "≥ 102 cm / ≥ 88 cm" }
        ],
        note: "La misurazione corretta va effettuata a metà tra l'ultima costa palpabile e la cresta iliaca al termine di un'espirazione normale."
      };
    `
  },

  // -------------------------------------------------------------
  // CARDIOLOGIA & EMODINAMICA (11-24)
  // -------------------------------------------------------------
  {
    id: "cha2ds2-vasc",
    folder: "CHA2DS2-VASc Score",
    title: "Punteggio CHA₂DS₂-VASc",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Stratificazione del rischio tromboembolico e indicazione ad anticoagulanti nella fibrillazione atriale.",
    tags: ["cha2ds2", "vasc", "fa", "fibrillazione", "anticoagulante", "ictus", "tromboembolismo"],
    inputs: [
      { id: "age", label: "Età", type: "select", options: [{val: "0", label: "< 65 anni (0 pt)"}, {val: "1", label: "65 - 74 anni (+1 pt)"}, {val: "2", label: "≥ 75 anni (+2 pt)"}] },
      { id: "gender", label: "Sesso Biologico", type: "select", options: [{val: "0", label: "Maschio (0 pt)"}, {val: "1", label: "Femmina (+1 pt)"}] },
      { id: "chf", label: "Scompenso Cardiaco / Disfunzione Ventricolare Sn", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "htn", label: "Ipertensione Arteriosa", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "stroke", label: "Pregresso Ictus / TIA / Tromboembolismo", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "vasc", label: "Malattia Vascolare (pregresso IMA, PAD, placca aortica)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "dm", label: "Diabete Mellito", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(gender) + parseInt(chf) + parseInt(htn) + parseInt(stroke) + parseInt(vasc) + parseInt(dm);
      const isFemale = gender === "1";
      let raccomandazione = ""; let riskRate = ""; let color = "#2e7d32";
      const adjustedScore = isFemale ? score - 1 : score;
      if (adjustedScore === 0) {
        raccomandazione = "Rischio basso: Nessuna terapia antitrombotica raccomandata.";
        riskRate = "0.2% - 0.6% / anno";
      } else if (adjustedScore === 1) {
        raccomandazione = "Rischio intermedio: Terapia anticoagulante orale (DOAC) da considerare (Classe IIa).";
        riskRate = "1.3% / anno"; color = "#d97706";
      } else {
        raccomandazione = "Rischio elevato: Terapia anticoagulante orale (DOAC) fortemente raccomandata (Classe I).";
        riskRate = "2.2% - 15.2% / anno"; color = "#c62828";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score CHA₂DS₂-VASc",
        metrics: [
          { label: "Tasso Annuale di Ictus Stimato", val: riskRate },
          { label: "Indicazione Terapeutica ESC", val: raccomandazione, color: color }
        ],
        note: "Linee Guida ESC Fibrillazione Atriale. Nei maschi punteggio ≥1 e nelle femmine ≥2 pongono indicazione all'anticoagulazione."
      };
    `
  },
  {
    id: "has-bled",
    folder: "HAS-BLED Score",
    title: "Score HAS-BLED (Rischio Emorragico)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Stima del rischio di sanguinamento maggiore a 1 anno nei pazienti in terapia anticoagulante orale.",
    tags: ["has-bled", "emorragia", "anticoagulante", "fa", "bleeding"],
    inputs: [
      { id: "htn", label: "Ipertensione incontrollata (PAS > 160 mmHg)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "renal", label: "Insufficienza Renale Cronica / Dialisi", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "liver", label: "Epatopatia severa / Cirrosi", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "stroke", label: "Pregresso Ictus", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "bleeding", label: "Storia di sanguinamento maggiore o diatesi", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "inr", label: "INR labile (TTR < 60% se in terapia con AVK)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "elderly", label: "Età > 65 anni", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "drugs", label: "Uso di FANS / Antiaggreganti", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "alcohol", label: "Abuso di Alcol (≥ 8 drink/sett)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(htn) + parseInt(renal) + parseInt(liver) + parseInt(stroke) + parseInt(bleeding) + parseInt(inr) + parseInt(elderly) + parseInt(drugs) + parseInt(alcohol);
      let risk = "Rischio Basso"; let color = "#2e7d32";
      if (score >= 3) { risk = "Alto Rischio di Sanguinamento (Score ≥ 3)"; color = "#c62828"; }
      else if (score >= 2) { risk = "Rischio Moderato"; color = "#d97706"; }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score HAS-BLED",
        metrics: [
          { label: "Livello di Rischio", val: risk, color: color },
          { label: "Approccio Clinico", val: score >= 3 ? "Correggere i fattori modificabili e monitorare strettamente" : "Rischio accettabile per anticoagulazione" }
        ],
        note: "Un punteggio ≥3 non controindica l'anticoagulazione ma impone la correzione dei fattori di rischio reversibili."
      };
    `
  },
  {
    id: "qt-corretto-qtc",
    folder: "QT Corretto (QTc)",
    title: "Intervallo QT Corretto (QTc - Bazett, Fridericia)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Correzione dell'intervallo elettrocardiografico QT per la valutazione del rischio di torsione di punta.",
    tags: ["qtc", "bazett", "fridericia", "ecg", "aritmia", "torsade"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Uomo"}, {val: "f", label: "Donna"}] },
      { id: "qt", label: "Intervallo QT", unit: "ms", type: "number", step: "1", min: "200", max: "800", def: "400" },
      { id: "hr", label: "Frequenza Cardiaca", unit: "bpm", type: "number", step: "1", min: "30", max: "250", def: "75" }
    ],
    calcLogic: `
      const rrSec = 60 / hr;
      const qtcBazett = qt / Math.sqrt(rrSec);
      const qtcFrid = qt / Math.cbrt(rrSec);
      let val = Math.round(qtcBazett);
      let interp = "Normale"; let color = "#2e7d32";
      const soglia = gender === "m" ? 450 : 460;
      if (val > 500) { interp = "Prolungamento Severo (> 500 ms) - Alto rischio aritmico"; color = "#c62828"; }
      else if (val > soglia) { interp = "Prolungato (Borderline)"; color = "#d97706"; }
      return {
        mainValue: val + " ms",
        mainLabel: "QTc (Formula di Bazett)",
        metrics: [
          { label: "QTc Fridericia", val: Math.round(qtcFrid) + " ms" },
          { label: "Valutazione Clinica", val: interp, color: color }
        ],
        note: "A frequenze cardiache elevate (>90 bpm) preferire la formula di Fridericia."
      };
    `
  },
  {
    id: "pressione-arteriosa-media-map",
    folder: "Pressione Arteriosa Media (MAP)",
    title: "Pressione Arteriosa Media (MAP) e Pressione di Polso",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Calcolo della MAP per la valutazione della perfusione d'organo in terapia intensiva e shock.",
    tags: ["map", "pressione", "perfusione", "rianimazione", "shock"],
    inputs: [
      { id: "pas", label: "Pressione Sistolica (PAS)", unit: "mmHg", type: "number", step: "1", min: "30", max: "260", def: "120" },
      { id: "pad", label: "Pressione Diastolica (PAD)", unit: "mmHg", type: "number", step: "1", min: "20", max: "180", def: "80" }
    ],
    calcLogic: `
      const map = (pas + (2 * pad)) / 3;
      const pp = pas - pad;
      let interp = "Perfusione adeguata (≥ 65 mmHg)"; let color = "#2e7d32";
      if (map < 65) { interp = "Ipotensione / Ipoperfusione (< 65 mmHg)"; color = "#c62828"; }
      return {
        mainValue: Math.round(map) + " mmHg",
        mainLabel: "Pressione Arteriosa Media (MAP)",
        metrics: [
          { label: "Pressione di Polso (Differenziale)", val: pp + " mmHg" },
          { label: "Target Perfusorio", val: "MAP ≥ 65 mmHg" },
          { label: "Stato", val: interp, color: color }
        ],
        note: "MAP = (PAS + 2*PAD) / 3."
      };
    `
  },
  {
    id: "heart-score-dolore-toracico",
    folder: "HEART Score",
    title: "HEART Score per Dolore Toracico in Pronto Soccorso",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Stratificazione del rischio di eventi avversi cardiaci maggiori (MACE) a 6 settimane.",
    tags: ["heart", "troponina", "dolore toracico", "mace", "pronto soccorso", "triage"],
    inputs: [
      { id: "h", label: "Storia clinica (History)", type: "select", options: [{val: "0", label: "Lievemente sospetta (0 pt)"}, {val: "1", label: "Moderatamente sospetta (+1 pt)"}, {val: "2", label: "Altamente sospetta (+2 pt)"}] },
      { id: "e", label: "ECG", type: "select", options: [{val: "0", label: "Normale (0 pt)"}, {val: "1", label: "Ripolarizzazione aspecifica / BBS noto (+1 pt)"}, {val: "2", label: "Sottoslivellamento ST / inversione T significativa (+2 pt)"}] },
      { id: "a", label: "Età (Age)", type: "select", options: [{val: "0", label: "< 45 anni (0 pt)"}, {val: "1", label: "45 - 64 anni (+1 pt)"}, {val: "2", label: "≥ 65 anni (+2 pt)"}] },
      { id: "r", label: "Fattori di Rischio CV (Risk Factors)", type: "select", options: [{val: "0", label: "Nessun fattore noto (0 pt)"}, {val: "1", label: "1 - 2 fattori di rischio (+1 pt)"}, {val: "2", label: "≥ 3 fattori o vasculopatia aterosclerotica (+2 pt)"}] },
      { id: "t", label: "Troponina Iniziale", type: "select", options: [{val: "0", label: "≤ Limite Normale (0 pt)"}, {val: "1", label: "1 - 3 volte il limite normale (+1 pt)"}, {val: "2", label: "> 3 volte il limite normale (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(h) + parseInt(e) + parseInt(a) + parseInt(r) + parseInt(t);
      let risk = ""; let mace = ""; let color = "#2e7d32";
      if (score <= 3) {
        risk = "Basso Rischio (0-3)"; mace = "0.9 - 1.7% MACE a 6 settimane";
      } else if (score <= 6) {
        risk = "Rischio Intermedio (4-6)"; mace = "12 - 16.6% MACE a 6 settimane"; color = "#d97706";
      } else {
        risk = "Alto Rischio (7-10)"; mace = "50 - 65% MACE a 6 settimane"; color = "#c62828";
      }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Score HEART",
        metrics: [
          { label: "Stratificazione del Rischio", val: risk, color: color },
          { label: "Rischio MACE a 6 Settimane", val: mace },
          { label: "Gestione", val: score <= 3 ? "Dimissione precoce sicura valutabile" : "Ricovero o coronarografia precoce" }
        ],
        note: "Six AJ et al. (Neth Heart J 2008)."
      };
    `
  },
  {
    id: "timi-risk-nste-acs",
    folder: "TIMI Score NSTEMI",
    title: "Punteggio TIMI per NSTEMI / Angina Instabile",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Predizione di mortalità, re-IMA e ischemia ricorrente a 14 giorni in sindrome coronarica senza sopraslivellamento ST.",
    tags: ["timi", "nstemi", "angina", "morte", "coronaria"],
    inputs: [
      { id: "age", label: "Età ≥ 65 anni", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "rf", label: "≥ 3 Fattori di Rischio CAD (fumo, ipertensione, diabete, familiarità, dislipidemia)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "cad", label: "Coronaropatia nota con stenosi ≥ 50%", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "asa", label: "Uso di aspirina negli ultimi 7 giorni", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "angina", label: "≥ 2 episodi di angina a riposo nelle ultime 24 ore", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "st", label: "Deviazione del tratto ST ≥ 0.5 mm all'ECG", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "biomarkers", label: "Markers cardiaci elevati (Troponina/CK-MB)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(rf) + parseInt(cad) + parseInt(asa) + parseInt(angina) + parseInt(st) + parseInt(biomarkers);
      let risk = "Rischio Basso (0-2)"; let rate = "5 - 8% eventi a 14 gg"; let color = "#2e7d32";
      if (score >= 5) { risk = "Alto Rischio (5-7)"; rate = "26 - 41% eventi a 14 gg"; color = "#c62828"; }
      else if (score >= 3) { risk = "Rischio Intermedio (3-4)"; rate = "13 - 20% eventi a 14 gg"; color = "#d97706"; }
      return {
        mainValue: score + " / 7 Punti",
        mainLabel: "Score TIMI NSTEMI",
        metrics: [
          { label: "Gruppo di Rischio", val: risk, color: color },
          { label: "Mortalità / Re-IMA a 14 Giorni", val: rate }
        ],
        note: "Antman EM et al. (JAMA 2000)."
      };
    `
  },
  {
    id: "gittata-cardiaca-fick",
    folder: "Gittata Cardiaca (Fick)",
    title: "Gittata Cardiaca (Principio di Fick)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Misurazione emodinamica gold standard della portata cardiaca e indice cardiaco.",
    tags: ["fick", "gittata", "portata", "emodinamica", "indice cardiaco", "cateterismo"],
    inputs: [
      { id: "vo2", label: "Consumo di Ossigeno (VO₂)", unit: "mL/min", type: "number", step: "5", min: "50", max: "600", def: "250" },
      { id: "cao2", label: "Contenuto Arterioso O₂ (CaO₂)", unit: "mL/dL", type: "number", step: "0.1", min: "5", max: "30", def: "19.0" },
      { id: "cvo2", label: "Contenuto Venoso Misto O₂ (CvO₂)", unit: "mL/dL", type: "number", step: "0.1", min: "3", max: "25", def: "14.0" },
      { id: "bsa", label: "Superficie Corporea Paziente (BSA)", unit: "m²", type: "number", step: "0.05", min: "1", max: "3", def: "1.8" }
    ],
    calcLogic: `
      const diffAv = cao2 - cvo2;
      const co = (vo2 / (diffAv * 10)); // L/min
      const ci = co / bsa;
      let interp = "Normale (CI 2.5 - 4.0 L/min/m²)";
      let color = "#2e7d32";
      if (ci < 2.2) { interp = "Shock Cardiogeno / Bassa Portata (CI < 2.2)"; color = "#c62828"; }
      return {
        mainValue: co.toFixed(2) + " L / min",
        mainLabel: "Gittata Cardiaca (CO)",
        metrics: [
          { label: "Indice Cardiaco (CI)", val: ci.toFixed(2) + " L/min/m²", color: color },
          { label: "Stato Clinico", val: interp }
        ],
        note: "Principio di Fick: CO = VO2 / (CaO2 - CvO2)."
      };
    `
  },
  {
    id: "resistenza-vascolare-sistemica-svr",
    folder: "Resistenza Vascolare Sistemica (SVR)",
    title: "Resistenza Vascolare Sistemica (SVR)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Valutazione del postcarico vascolare periferico e diagnosi differenziale del tipo di shock.",
    tags: ["svr", "postcarico", "vasocostrizione", "shock", "terapia intensiva"],
    inputs: [
      { id: "map", label: "Pressione Arteriosa Media (MAP)", unit: "mmHg", type: "number", step: "1", min: "30", max: "200", def: "85" },
      { id: "cvp", label: "Pressione Venosa Centrale (CVP)", unit: "mmHg", type: "number", step: "1", min: "0", max: "40", def: "6" },
      { id: "co", label: "Gittata Cardiaca (CO)", unit: "L/min", type: "number", step: "0.1", min: "1", max: "20", def: "5.0" }
    ],
    calcLogic: `
      const svr = (80 * (map - cvp)) / co;
      let interp = "Normale (800 - 1200 dyne·s/cm⁵)"; let color = "#2e7d32";
      if (svr < 800) { interp = "Vasodilatazione periferica (es. Shock Distributivo/Settico, Anafilassi)"; color = "#ea580c"; }
      else if (svr > 1200) { interp = "Vasocostrizione elevata (es. Shock Ipovolemico, Shock Cardiogeno)"; color = "#d97706"; }
      return {
        mainValue: Math.round(svr) + " dyne·s/cm⁵",
        mainLabel: "Resistenza Vascolare Sistemica",
        metrics: [
          { label: "In Unità Wood (mmHg·min/L)", val: ((map - cvp) / co).toFixed(1) + " Wood Units" },
          { label: "Quadro Emodinamico", val: interp, color: color }
        ],
        note: "SVR = 80 * (MAP - CVP) / CO. Range fisiologico normale: 800 - 1200 dyne·s/cm⁵."
      };
    `
  },

  // -------------------------------------------------------------
  // NEFROLOGIA & ELETTROLITI (25-40)
  // -------------------------------------------------------------
  {
    id: "egfr-ckd-epi-2021",
    folder: "eGFR CKD-EPI (2021)",
    title: "eGFR CKD-EPI 2021 (Filtrato Glomerulare)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Nuova equazione standard KDIGO 2021 race-free per la stadiazione dell'insufficienza renale cronica.",
    tags: ["egfr", "ckd-epi", "creatinina", "filtrato", "kdigo", "rene"],
    inputs: [
      { id: "gender", label: "Sesso Biologico", type: "select", options: [{val: "m", label: "Maschio"}, {val: "f", label: "Femmina"}] },
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "18", max: "110", def: "65" },
      { id: "creat", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.01", min: "0.2", max: "15", def: "1.1" }
    ],
    calcLogic: `
      const isM = gender === "m";
      const kappa = isM ? 0.9 : 0.7;
      const alpha = isM ? -0.302 : -0.241;
      const genderMult = isM ? 1.0 : 1.012;
      const crRatio = creat / kappa;
      const minVal = Math.min(crRatio, 1);
      const maxVal = Math.max(crRatio, 1);
      const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * genderMult;
      let stage = ""; let color = "#2e7d32";
      if (egfr >= 90) { stage = "G1 - Normale"; color = "#2e7d32"; }
      else if (egfr >= 60) { stage = "G2 - Lieve riduzione"; color = "#2e7d32"; }
      else if (egfr >= 45) { stage = "G3a - Riduzione lieve-moderata"; color = "#d97706"; }
      else if (egfr >= 30) { stage = "G3b - Riduzione moderata-severa"; color = "#ea580c"; }
      else if (egfr >= 15) { stage = "G4 - Grave riduzione"; color = "#dc2626"; }
      else { stage = "G5 - Terminale (ESRD)"; color = "#7f1d1d"; }
      return {
        mainValue: Math.round(egfr) + " mL/min/1.73 m²",
        mainLabel: "eGFR Stimato",
        metrics: [
          { label: "Stadio KDIGO", val: stage, color: color },
          { label: "Standard", val: "CKD-EPI 2021 Race-Free" }
        ],
        note: "Inker LA et al. (NEJM 2021). Equazione priva di termine etnico."
      };
    `
  },
  {
    id: "clearance-creatinina-cockcroft",
    folder: "Clearance Creatinina (Cockcroft-Gault)",
    title: "Clearance Creatinina (Cockcroft-Gault)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Stima della clearance della creatinina per l'adeguamento posologico dei farmaci.",
    tags: ["cockcroft", "clearance", "creatinina", "posologia", "dosaggio", "farmaci"],
    inputs: [
      { id: "gender", label: "Sesso Biologico", type: "select", options: [{val: "m", label: "Maschio"}, {val: "f", label: "Femmina"}] },
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "18", max: "110", def: "70" },
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.1", min: "30", max: "200", def: "72" },
      { id: "creat", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.01", min: "0.2", max: "15", def: "1.3" }
    ],
    calcLogic: `
      let crCl = ((140 - age) * weight) / (72 * creat);
      if (gender === "f") crCl *= 0.85;
      return {
        mainValue: crCl.toFixed(1) + " mL/min",
        mainLabel: "Clearance Stimata della Creatinina",
        metrics: [
          { label: "Fattore Femminile", val: gender === "f" ? "Applicato (x 0.85)" : "Non necessario" },
          { label: "Applicazione", val: "Adeguamento posologie da foglietto illustrativo" }
        ],
        note: "Formula di Cockcroft & Gault (1976)."
      };
    `
  },
  {
    id: "frazione-escrezione-sodio-fena",
    folder: "Frazione Escrezione Sodio (FENa)",
    title: "Frazione di Escrezione del Sodio (FENa)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Diagnosi differenziale tra IRA prerenale (ipoperfusione) e necrosi tubulare acuta (NTA).",
    tags: ["fena", "sodio", "ira", "prerenale", "nta", "oliguria"],
    inputs: [
      { id: "sna", label: "Sodio Sierico (S-Na)", unit: "mEq/L", type: "number", step: "0.5", min: "100", max: "180", def: "140" },
      { id: "una", label: "Sodio Urinario (U-Na)", unit: "mEq/L", type: "number", step: "1", min: "1", max: "250", def: "15" },
      { id: "scr", label: "Creatinina Sierica (S-Cr)", unit: "mg/dL", type: "number", step: "0.1", min: "0.3", max: "20", def: "2.5" },
      { id: "ucr", label: "Creatinina Urinaria (U-Cr)", unit: "mg/dL", type: "number", step: "1", min: "5", max: "500", def: "120" }
    ],
    calcLogic: `
      const fena = ((una * scr) / (sna * ucr)) * 100;
      let interp = ""; let color = "#2e7d32";
      if (fena < 1) { interp = "FENa < 1%: Suggerisce IRA Prerenale (riassorbimento conservato)"; }
      else if (fena > 2) { interp = "FENa > 2%: Suggerisce Necrosi Tubulare Acuta (NTA)"; color = "#c62828"; }
      else { interp = "FENa 1 - 2%: Indeterminato / Zona Grigia"; color = "#d97706"; }
      return {
        mainValue: fena.toFixed(2) + " %",
        mainLabel: "Frazione Escrezione Sodio",
        metrics: [
          { label: "Diagnosi Differenziale", val: interp, color: color },
          { label: "Nota Diuretici", val: "Se in terapia con diuretici dell'ansa, usare FEUrea" }
        ],
        note: "FENa = (UNa * SCr) / (SNa * UCr) * 100."
      };
    `
  },
  {
    id: "frazione-escrezione-urea-feurea",
    folder: "Frazione Escrezione Urea (FEUrea)",
    title: "Frazione di Escrezione dell'Urea (FEUrea)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Diagnosi differenziale dell'IRA quando il paziente assume diuretici dell'ansa.",
    tags: ["feurea", "urea", "azotemia", "diuretici", "furosemide", "prerenale"],
    inputs: [
      { id: "sbun", label: "Azotemia / Urea Sierica", unit: "mg/dL", type: "number", step: "1", min: "10", max: "300", def: "80" },
      { id: "ubun", label: "Urea Urinaria", unit: "mg/dL", type: "number", step: "10", min: "50", max: "3000", def: "800" },
      { id: "scr", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.1", min: "0.3", max: "20", def: "2.4" },
      { id: "ucr", label: "Creatinina Urinaria", unit: "mg/dL", type: "number", step: "1", min: "10", max: "500", def: "90" }
    ],
    calcLogic: `
      const feurea = ((ubun * scr) / (sbun * ucr)) * 100;
      let interp = ""; let color = "#2e7d32";
      if (feurea < 35) { interp = "FEUrea < 35%: Fortemente suggestivo di IRA Prerenale"; }
      else { interp = "FEUrea > 35%: Suggestivo di danno parenchimale (NTA)"; color = "#c62828"; }
      return {
        mainValue: feurea.toFixed(1) + " %",
        mainLabel: "Frazione Escrezione Urea",
        metrics: [
          { label: "Interpretazione Clinica", val: interp, color: color },
          { label: "Vantaggio Clinico", val: "Non influenzata dai diuretici dell'ansa" }
        ],
        note: "Carvounis CP et al. (Kidney Int 2002)."
      };
    `
  },
  {
    id: "anion-gap-sierico",
    folder: "Anion Gap Sierico",
    title: "Anion Gap Sierico (con Correzione per Albumina)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Valutazione dell'acidosi metabolica ad elevato vs normale anion gap.",
    tags: ["anion gap", "acidosi", "albumina", "ega", "lattati"],
    inputs: [
      { id: "na", label: "Sodio (Na⁺)", unit: "mEq/L", type: "number", step: "0.5", min: "110", max: "170", def: "140" },
      { id: "cl", label: "Cloro (Cl⁻)", unit: "mEq/L", type: "number", step: "0.5", min: "70", max: "140", def: "102" },
      { id: "hco3", label: "Bicarbonato (HCO₃⁻)", unit: "mEq/L", type: "number", step: "0.5", min: "2", max: "50", def: "16" },
      { id: "alb", label: "Albumina Sierica", unit: "g/dL", type: "number", step: "0.1", min: "1", max: "6", def: "4.0" }
    ],
    calcLogic: `
      const ag = na - (cl + hco3);
      const agCorr = ag + 2.5 * (4.0 - alb);
      let interp = "Normale (8-12 mEq/L)"; let color = "#2e7d32";
      if (agCorr > 12) { interp = "Anion Gap Elevato (HAGMA: es. Lattacidosi, Chetoacidosi, Tossici)"; color = "#c62828"; }
      return {
        mainValue: agCorr.toFixed(1) + " mEq/L",
        mainLabel: "Anion Gap Corretto",
        metrics: [
          { label: "Anion Gap Non Corretto", val: ag.toFixed(1) + " mEq/L" },
          { label: "Valutazione", val: interp, color: color }
        ],
        note: "Correzione di Figge: AGcorr = AG + 2.5 * (4.0 - Albumina)."
      };
    `
  },
  {
    id: "osmolarita-sierica-calcolata",
    folder: "Osmolarità Sierica Calcolata",
    title: "Osmolarità Sierica Calcolata & Osmolal Gap",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Calcolo dell'osmolarità sierica teorica e stima del gap osmolare per intossicazioni da alcoli tossici.",
    tags: ["osmolarita", "osmolal gap", "metanolo", "glicole", "tossicologia", "coma"],
    inputs: [
      { id: "na", label: "Sodio Sierico (Na)", unit: "mEq/L", type: "number", step: "0.5", min: "100", max: "180", def: "140" },
      { id: "glu", label: "Glicemia", unit: "mg/dL", type: "number", step: "1", min: "30", max: "1200", def: "95" },
      { id: "bun", label: "Azotemia (BUN)", unit: "mg/dL", type: "number", step: "1", min: "5", max: "200", def: "14" },
      { id: "osmMeas", label: "Osmolalità Misurata (crioscopica)", unit: "mOsm/kg", type: "number", step: "1", min: "200", max: "500", def: "295" }
    ],
    calcLogic: `
      const osmCalc = (2 * na) + (glu / 18) + (bun / 2.8);
      const gap = osmMeas - osmCalc;
      let interp = "Gap Osmolare Normale (≤ 10 mOsm/kg)"; let color = "#2e7d32";
      if (gap > 10) {
        interp = "Gap Osmolare Elevato (> 10): Sospetta presenza di sostanze osmoticamente attive (Metanolo, Glicole Etilenico, Etanolo, Mannitolo)";
        color = "#c62828";
      }
      return {
        mainValue: Math.round(osmCalc) + " mOsm/kg",
        mainLabel: "Osmolarità Calcolata",
        metrics: [
          { label: "Osmolal Gap Rilevato", val: gap.toFixed(1) + " mOsm/kg", color: color },
          { label: "Interpretazione", val: interp }
        ],
        note: "Formula: 2*Na + Glucosio/18 + BUN/2.8."
      };
    `
  },
  {
    id: "calcio-corretto-albumina",
    folder: "Calcio Corretto per Albumina",
    title: "Calcio Totale Corretto per Albumina (Formula di Payne)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Stima della vera calcemia in presenza di ipoalbuminemia o iperalbuminemia.",
    tags: ["calcio", "calcemia", "albumina", "payne", "ipercalcemia", "ipocalcemia"],
    inputs: [
      { id: "ca", label: "Calcio Totale Sierico", unit: "mg/dL", type: "number", step: "0.1", min: "3", max: "20", def: "8.2" },
      { id: "alb", label: "Albumina Sierica", unit: "g/dL", type: "number", step: "0.1", min: "1", max: "6", def: "2.6" }
    ],
    calcLogic: `
      const caCorr = ca + 0.8 * (4.0 - alb);
      let interp = "Normocalcemia (8.5 - 10.5 mg/dL)"; let color = "#2e7d32";
      if (caCorr < 8.5) { interp = "Ipocalcemia (< 8.5 mg/dL)"; color = "#d97706"; }
      else if (caCorr > 10.5) { interp = "Ipercalcemia (> 10.5 mg/dL)"; color = "#c62828"; }
      return {
        mainValue: caCorr.toFixed(1) + " mg/dL",
        mainLabel: "Calcio Sierico Corretto",
        metrics: [
          { label: "Calcio Misurato Non Corretto", val: ca.toFixed(1) + " mg/dL" },
          { label: "Stato Clinico", val: interp, color: color }
        ],
        note: "Formula di Payne: CaCorr = CaMisurato + 0.8 * (4.0 - Albumina)."
      };
    `
  },
  {
    id: "deficit-acqua-libera-ipernatriemia",
    folder: "Deficit Acqua Libera",
    title: "Deficit di Acqua Libera (Ipernatriemia)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Volume d'acqua pura necessario per correggere l'ipernatriemia grave verso il target di 140 mEq/L.",
    tags: ["ipernatriemia", "acqua libera", "deficit", "sodio", "disidratazione"],
    inputs: [
      { id: "gender", label: "Sesso / Età", type: "select", options: [
        {val: "0.6", label: "Uomo Giovane / Adulto (TBW = 60%)"},
        {val: "0.5", label: "Uomo Anziano o Donna Giovane (TBW = 50%)"},
        {val: "0.45", label: "Donna Anziana (TBW = 45%)"}
      ]},
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "20", max: "200", def: "70" },
      { id: "na", label: "Sodio Sierico Attuale", unit: "mEq/L", type: "number", step: "1", min: "145", max: "190", def: "158" }
    ],
    calcLogic: `
      const tbwCoeff = parseFloat(gender);
      const tbw = weight * tbwCoeff;
      const deficit = tbw * ((na / 140) - 1);
      return {
        mainValue: deficit.toFixed(1) + " Litri",
        mainLabel: "Deficit di Acqua Libera",
        metrics: [
          { label: "Acqua Corporea Totale (TBW)", val: tbw.toFixed(1) + " L" },
          { label: "Velocità Massima Correzione", val: "Non superare 10-12 mEq/L nelle 24h (rischio edema cerebrale)" }
        ],
        note: "Deficit Acqua = TBW * [(Na / 140) - 1]."
      };
    `
  },
  {
    id: "deficit-sodio-iponatriemia",
    folder: "Deficit di Sodio",
    title: "Deficit di Sodio (Iponatriemia Sintomatica)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Calcolo della quantità totale di sodio necessaria per elevare la natriemia fino al valore target.",
    tags: ["iponatriemia", "sodio", "deficit", "salina ipertonica", "coma"],
    inputs: [
      { id: "gender", label: "Sesso / Età", type: "select", options: [
        {val: "0.6", label: "Uomo Adulto (TBW 60%)"},
        {val: "0.5", label: "Donna Adulta / Uomo Anziano (TBW 50%)"},
        {val: "0.45", label: "Donna Anziana (TBW 45%)"}
      ]},
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "20", max: "200", def: "70" },
      { id: "naCurr", label: "Sodio Sierico Attuale", unit: "mEq/L", type: "number", step: "1", min: "90", max: "135", def: "118" },
      { id: "naTarget", label: "Sodio Target Desiderato", unit: "mEq/L", type: "number", step: "1", min: "115", max: "140", def: "128" }
    ],
    calcLogic: `
      const tbw = weight * parseFloat(gender);
      const deltaNa = Math.max(0, naTarget - naCurr);
      const deficit = tbw * deltaNa;
      const mlSalina3 = (deficit / 513) * 1000;
      return {
        mainValue: Math.round(deficit) + " mEq di Na⁺",
        mainLabel: "Deficit di Sodio Calcolato",
        metrics: [
          { label: "Equivalente in NaCl 3% (ipertonica)", val: Math.round(mlSalina3) + " mL" },
          { label: "Limite di Sicurezza Correzione", val: "Massimo 8-10 mEq/L nelle prime 24h per prevenire la mielinolisi pontina centrale" }
        ],
        note: "Deficit Na = TBW * (NaTarget - NaAttuale). Salina ipertonica 3% = 513 mEq/L."
      };
    `
  },
  {
    id: "deficit-bicarbonato",
    folder: "Deficit di Bicarbonato",
    title: "Deficit di Bicarbonato (Acidosi Metabolica Grave)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Stima della quantità di NaHCO₃ necessaria per correggere acidosi metaboliche critiche (pH < 7.15, HCO₃ < 10).",
    tags: ["bicarbonato", "acidosi", "ega", "rianimazione", "hco3"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "20", max: "200", def: "70" },
      { id: "hco3Curr", label: "HCO₃⁻ Attuale (da EGA)", unit: "mEq/L", type: "number", step: "0.5", min: "2", max: "20", def: "8" },
      { id: "hco3Target", label: "HCO₃⁻ Target", unit: "mEq/L", type: "number", step: "0.5", min: "10", max: "24", def: "14" }
    ],
    calcLogic: `
      const delta = Math.max(0, hco3Target - hco3Curr);
      const deficit = 0.5 * weight * delta;
      return {
        mainValue: Math.round(deficit) + " mEq di HCO₃⁻",
        mainLabel: "Deficit Totale di Bicarbonato",
        metrics: [
          { label: "Spazio di Distribuzione Bicarbonato", val: "50% del peso corporeo (0.5 * Peso)" },
          { label: "Strategia Infusionale", val: "Somministrare metà dose nelle prime 2-4 ore e rivalutare l'EGA" }
        ],
        note: "Deficit = 0.5 * Peso (kg) * (HCO3_target - HCO3_attuale)."
      };
    `
  },
  {
    id: "rapporto-albumina-creatinina-uacr",
    folder: "Rapporto Albumina-Creatinina (UACR)",
    title: "Rapporto Albumina / Creatinina Urinaria (UACR)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Screening e stadiazione della nefropatia diabetica e albuminuria KDIGO su campione estemporaneo di urine del mattino.",
    tags: ["uacr", "albuminuria", "microalbuminuria", "diabete", "rene", "kdigo"],
    inputs: [
      { id: "alb", label: "Microalbumina Urinaria", unit: "mg/L", type: "number", step: "0.1", min: "1", max: "5000", def: "45" },
      { id: "creat", label: "Creatinina Urinaria", unit: "mg/dL", type: "number", step: "1", min: "5", max: "500", def: "110" }
    ],
    calcLogic: `
      const uacr = (alb / (creat / 100)); // mg/g
      let stage = "A1: Normale / Lieve aumento (< 30 mg/g)";
      let color = "#2e7d32";
      if (uacr >= 300) {
        stage = "A3: Severamente aumentata / Macroalbuminuria (≥ 300 mg/g)";
        color = "#c62828";
      } else if (uacr >= 30) {
        stage = "A2: Moderatamente aumentata / Microalbuminuria (30 - 299 mg/g)";
        color = "#d97706";
      }
      return {
        mainValue: uacr.toFixed(1) + " mg/g",
        mainLabel: "Rapporto UACR",
        metrics: [
          { label: "Stadio Albuminuria KDIGO", val: stage, color: color },
          { label: "Equivalente in mg/mmol", val: (uacr * 0.113).toFixed(1) + " mg/mmol" }
        ],
        note: "Linee guida KDIGO 2024. Evita la necessità della raccolta urine delle 24 ore."
      };
    `
  },

  // -------------------------------------------------------------
  // URGENZA, TERAPIA INTENSIVA & TRAUMA (41-54)
  // -------------------------------------------------------------
  {
    id: "glasgow-coma-scale",
    folder: "Glasgow Coma Scale (GCS)",
    title: "Glasgow Coma Scale (GCS)",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Valutazione oggettiva dello stato di coscienza attraverso tre risposte comportamentali.",
    tags: ["gcs", "glasgow", "coma", "coscienza", "triage", "trauma cranico"],
    inputs: [
      { id: "eye", label: "Apertura degli Occhi (E)", type: "select", options: [
        {val: "4", label: "4 - Spontanea"},
        {val: "3", label: "3 - Al comando verbale / voce"},
        {val: "2", label: "2 - Allo stimolo doloroso"},
        {val: "1", label: "1 - Nessuna risposta"}
      ]},
      { id: "verbal", label: "Risposta Verbale (V)", type: "select", options: [
        {val: "5", label: "5 - Orientata e appropriata"},
        {val: "4", label: "4 - Frasi confuse / disorientata"},
        {val: "3", label: "3 - Parole inappropriate"},
        {val: "2", label: "2 - Suoni incomprensibili / gemiti"},
        {val: "1", label: "1 - Nessuna risposta"}
      ]},
      { id: "motor", label: "Risposta Motoria (M)", type: "select", options: [
        {val: "6", label: "6 - Esegue i comandi"},
        {val: "5", label: "5 - Localizza lo stimolo doloroso"},
        {val: "4", label: "4 - Flessione / retrazione al dolore"},
        {val: "3", label: "3 - Flessione anomala (decorticazione)"},
        {val: "2", label: "2 - Estensione anomala (decerebrazione)"},
        {val: "1", label: "1 - Nessuna risposta"}
      ]}
    ],
    calcLogic: `
      const score = parseInt(eye) + parseInt(verbal) + parseInt(motor);
      let gravita = ""; let color = "#2e7d32";
      if (score >= 13) gravita = "Trauma Lieve (GCS 13-15)";
      else if (score >= 9) { gravita = "Trauma Moderato (GCS 9-12)"; color = "#d97706"; }
      else { gravita = "Trauma Grave (GCS ≤ 8) - Indicazione a intubazione/protezione vie aeree"; color = "#c62828"; }
      return {
        mainValue: score + " / 15",
        mainLabel: "Punteggio Totale GCS",
        metrics: [
          { label: "Classificazione Clinica", val: gravita, color: color },
          { label: "Dettaglio Componenti", val: "E" + eye + " V" + verbal + " M" + motor }
        ],
        note: "Teasdale & Jennett (1974)."
      };
    `
  },
  {
    id: "qsofa-score",
    folder: "Quick SOFA (qSOFA)",
    title: "Quick SOFA Score (Sepsis-3)",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Identificazione rapida dei pazienti con sospetta infezione ad alto rischio di deterioramento clinico.",
    tags: ["qsofa", "sepsi", "infezione", "triage", "shock settico"],
    inputs: [
      { id: "rr", label: "Frequenza Respiratoria ≥ 22 atti/min", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "gcs", label: "Alterazione dello stato mentale (GCS < 15)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "sbp", label: "Pressione Sistolica ≤ 100 mmHg", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(rr) + parseInt(gcs) + parseInt(sbp);
      let risk = "Rischio Basso (Score 0-1)"; let color = "#2e7d32";
      if (score >= 2) { risk = "Alto Rischio di Sepsi / Mortalità (Score ≥ 2)"; color = "#c62828"; }
      return {
        mainValue: score + " / 3",
        mainLabel: "Score qSOFA",
        metrics: [
          { label: "Valutazione del Rischio", val: risk, color: color },
          { label: "Azione", val: score >= 2 ? "Valutare disfunzione d'organo (SOFA completo), lattati ematici e terapia antibiotica" : "Monitoraggio clinico" }
        ],
        note: "Consenso Sepsis-3 (Singer M et al., JAMA 2016)."
      };
    `
  },
  {
    id: "formula-parkland-ustioni",
    folder: "Formula di Parkland Ustioni",
    title: "Formula di Parkland per Rianimazione da Ustioni",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Calcolo della reintegrazione idroelettrolitica con Ringer Lattato nelle prime 24 ore nell'ustionato.",
    tags: ["parkland", "ustione", "fluidi", "ringer", "rianimazione", "emergenza"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "10", max: "200", def: "70" },
      { id: "tbsa", label: "Percentuale Superficie Ustionata (% TBSA)", unit: "%", type: "number", step: "1", min: "1", max: "95", def: "30" }
    ],
    calcLogic: `
      const totalMl = 4 * weight * tbsa;
      const first8h = totalMl / 2;
      const next16h = totalMl / 2;
      return {
        mainValue: Math.round(totalMl) + " mL",
        mainLabel: "Liquidi Totali (Ringer Lattato) nelle 24h",
        metrics: [
          { label: "Prime 8 Ore (50%)", val: Math.round(first8h) + " mL (" + Math.round(first8h/8) + " mL/h)" },
          { label: "Successive 16 Ore (50%)", val: Math.round(next16h) + " mL (" + Math.round(next16h/16) + " mL/h)" },
          { label: "Target Diuresi", val: "0.5 - 1.0 mL/kg/h" }
        ],
        note: "Formula di Baxter-Parkland: 4 mL * Peso * % TBSA."
      };
    `
  },
  {
    id: "shock-index",
    folder: "Shock Index (SI)",
    title: "Shock Index & Modified Shock Index",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Predittore precoce di shock ipovolemico/emorragico nascosto, emotrasfusione massiva e mortalità.",
    tags: ["shock index", "emorragia", "trauma", "trasfusione", "pressione", "fc"],
    inputs: [
      { id: "hr", label: "Frequenza Cardiaca", unit: "bpm", type: "number", step: "1", min: "30", max: "250", def: "115" },
      { id: "sbp", label: "Pressione Sistolica (PAS)", unit: "mmHg", type: "number", step: "1", min: "40", max: "240", def: "95" },
      { id: "dbp", label: "Pressione Diastolica (PAD)", unit: "mmHg", type: "number", step: "1", min: "20", max: "150", def: "60" }
    ],
    calcLogic: `
      const si = hr / sbp;
      const map = (sbp + 2 * dbp) / 3;
      const msi = hr / map;
      let interp = "Normale (SI 0.5 - 0.7)"; let color = "#2e7d32";
      if (si >= 1.0) {
        interp = "Shock Marcato (SI ≥ 1.0): Alto rischio di trasfusione massiva e arresto cardiaco";
        color = "#c62828";
      } else if (si >= 0.7) {
        interp = "Shock Lieve / Allarme Precoce (SI 0.7 - 0.9)";
        color = "#d97706";
      }
      return {
        mainValue: si.toFixed(2),
        mainLabel: "Shock Index (FC / PAS)",
        metrics: [
          { label: "Stato Clinico", val: interp, color: color },
          { label: "Modified Shock Index (FC / MAP)", val: msi.toFixed(2) + " (Normale 0.7-1.3)" }
        ],
        note: "Allgöwer M & Burri C (1967). SI > 0.9 predice emotrasfusione e ricovero in terapia intensiva anche con PA apparentemente conservata."
      };
    `
  },
  {
    id: "news2-score",
    folder: "Punteggio NEWS2",
    title: "NEWS2 (National Early Warning Score)",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Standard internazionale per l'identificazione precoce e la risposta al deterioramento clinico acuto nei reparti di degenza.",
    tags: ["news2", "early warning", "deterioramento", "rianimazione", "triage"],
    inputs: [
      { id: "rr", label: "Frequenza Respiratoria", type: "select", options: [{val: "3", label: "≤ 8 atti/min (+3 pt)"}, {val: "1", label: "9 - 11 atti/min (+1 pt)"}, {val: "0", label: "12 - 20 atti/min (0 pt)"}, {val: "2", label: "21 - 24 atti/min (+2 pt)"}, {val: "3", label: "≥ 25 atti/min (+3 pt)"}] },
      { id: "spo2", label: "Saturazione O₂ (SpO₂ - Scala 1 standard)", type: "select", options: [{val: "3", label: "≤ 91% (+3 pt)"}, {val: "2", label: "92 - 93% (+2 pt)"}, {val: "1", label: "94 - 95% (+1 pt)"}, {val: "0", label: "≥ 96% (0 pt)"}] },
      { id: "o2", label: "Ossigenoterapia supplementare", type: "select", options: [{val: "0", label: "No (Aria ambiente, 0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "sbp", label: "Pressione Sistolica (PAS)", type: "select", options: [{val: "3", label: "≤ 90 mmHg (+3 pt)"}, {val: "2", label: "91 - 100 mmHg (+2 pt)"}, {val: "1", label: "101 - 110 mmHg (+1 pt)"}, {val: "0", label: "111 - 219 mmHg (0 pt)"}, {val: "3", label: "≥ 220 mmHg (+3 pt)"}] },
      { id: "hr", label: "Frequenza Cardiaca", type: "select", options: [{val: "3", label: "≤ 40 bpm (+3 pt)"}, {val: "1", label: "41 - 50 bpm (+1 pt)"}, {val: "0", label: "51 - 90 bpm (0 pt)"}, {val: "1", label: "91 - 110 bpm (+1 pt)"}, {val: "2", label: "111 - 130 bpm (+2 pt)"}, {val: "3", label: "≥ 131 bpm (+3 pt)"}] },
      { id: "cons", label: "Livello di Coscienza", type: "select", options: [{val: "0", label: "Alert / Sveglio (0 pt)"}, {val: "3", label: "Confuso / Risponde solo a Voce, Dolore o Incosciente (+3 pt)"}] },
      { id: "temp", label: "Temperatura Corporea", type: "select", options: [{val: "3", label: "≤ 35.0 °C (+3 pt)"}, {val: "1", label: "35.1 - 36.0 °C (+1 pt)"}, {val: "0", label: "36.1 - 38.0 °C (0 pt)"}, {val: "1", label: "38.1 - 39.0 °C (+1 pt)"}, {val: "2", label: "≥ 39.1 °C (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(rr) + parseInt(spo2) + parseInt(o2) + parseInt(sbp) + parseInt(hr) + parseInt(cons) + parseInt(temp);
      let risk = "Rischio Basso (0-4)"; let action = "Valutazione infermieristica ordinaria"; let color = "#2e7d32";
      if (score >= 7) {
        risk = "Alto Rischio Clinico (Score ≥ 7)"; action = "Attivazione immediata Team di Rianimazione / MET urgente"; color = "#c62828";
      } else if (score >= 5) {
        risk = "Rischio Medio (Score 5-6)"; action = "Valutazione medica urgente di reparto"; color = "#ea580c";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score NEWS2",
        metrics: [
          { label: "Livello di Rischio", val: risk, color: color },
          { label: "Risposta Clinica Raccomandata", val: action }
        ],
        note: "Royal College of Physicians (2017)."
      };
    `
  },

  // -------------------------------------------------------------
  // PNEUMOLOGIA & GASOMETRIA (55-64)
  // -------------------------------------------------------------
  {
    id: "curb-65",
    folder: "Score CURB-65",
    title: "Punteggio CURB-65 per Polmonite",
    category: "pneumologia",
    categoryLabel: "Pneumologia & Gasometria",
    description: "Stratificazione prognostica e orientamento del setting di cura per polmonite acquisita in comunità (CAP).",
    tags: ["curb65", "polmonite", "cap", "infezione", "respiro", "ricovero"],
    inputs: [
      { id: "c", label: "Confusione mentale (nuova insorgenza)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "u", label: "Azotemia (BUN > 19 mg/dL oppure Urea > 7 mmol/L)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "r", label: "Frequenza Respiratoria ≥ 30 atti/min", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "b", label: "Pressione Arteriosa Bassa (PAS < 90 o PAD ≤ 60 mmHg)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "age", label: "Età ≥ 65 anni", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(c) + parseInt(u) + parseInt(r) + parseInt(b) + parseInt(age);
      let mortality = ""; let setting = ""; let color = "#2e7d32";
      if (score <= 1) { mortality = "Basso rischio (< 3%)"; setting = "Trattamento ambulatoriale domiciliare"; }
      else if (score === 2) { mortality = "Rischio intermedio (~ 9%)"; setting = "Ospedalizzazione raccomandata"; color = "#d97706"; }
      else { mortality = "Alto rischio (15 - 40%)"; setting = "Ricovero ospedaliero urgente (valutare Terapia Intensiva se 4-5)"; color = "#c62828"; }
      return {
        mainValue: score + " / 5 Punti",
        mainLabel: "Score CURB-65",
        metrics: [
          { label: "Mortalità a 30 Giorni", val: mortality, color: color },
          { label: "Setting di Cura Raccomandato", val: setting }
        ],
        note: "British Thoracic Society (Lim WS et al., Thorax 2003)."
      };
    `
  },
  {
    id: "criteri-wells-ep",
    folder: "Criteri di Wells per Embolia Polmonare",
    title: "Criteri di Wells per Embolia Polmonare (EP)",
    category: "pneumologia",
    categoryLabel: "Pneumologia & Gasometria",
    description: "Stima della probabilità clinica pre-test di embolia polmonare e guida all'uso di D-Dimero o Angio-TC.",
    tags: ["wells", "ep", "embolia", "d-dimero", "polmone", "angio-tc"],
    inputs: [
      { id: "signs", label: "Segni o sintomi clinici di TVP", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "alt", label: "Diagnosi alternativa meno probabile di EP", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "hr", label: "Frequenza cardiaca > 100 bpm", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1.5", label: "Sì (+1.5 pt)"}] },
      { id: "immob", label: "Immobilizzazione (≥ 3 gg) o chirurgia nelle ultime 4 sett.", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1.5", label: "Sì (+1.5 pt)"}] },
      { id: "prev", label: "Precedente TVP o Embolia Polmonare", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1.5", label: "Sì (+1.5 pt)"}] },
      { id: "hemo", label: "Emoftoe / Emottisi", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "malig", label: "Neoplasia attiva", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseFloat(signs) + parseFloat(alt) + parseFloat(hr) + parseFloat(immob) + parseFloat(prev) + parseFloat(hemo) + parseFloat(malig);
      let prob = ""; let iter = ""; let color = "#2e7d32";
      if (score <= 4) { prob = "EP Improbabile (Score ≤ 4)"; iter = "Eseguire D-Dimero ad alta sensibilità."; }
      else { prob = "EP Probabile (Score > 4)"; iter = "Eseguire Angio-TC toracica urgente."; color = "#c62828"; }
      return {
        mainValue: score.toFixed(1) + " Punti",
        mainLabel: "Score di Wells per EP",
        metrics: [
          { label: "Probabilità Clinica", val: prob, color: color },
          { label: "Strategia Diagnostica", val: iter }
        ],
        note: "Wells PS et al. (Thromb Haemost 2000)."
      };
    `
  },
  {
    id: "rapporto-pao2-fio2-horowitz",
    folder: "Rapporto PaO2-FiO2 (Horowitz)",
    title: "Indice di Horowitz (Rapporto PaO₂ / FiO₂)",
    category: "pneumologia",
    categoryLabel: "Pneumologia & Gasometria",
    description: "Valutazione dell'insufficienza respiratoria e gravità dell'ARDS (Criteri di Berlino).",
    tags: ["horowitz", "pao2", "fio2", "ards", "berlino", "ipossia", "ega"],
    inputs: [
      { id: "pao2", label: "PaO₂ (da EGA arterioso)", unit: "mmHg", type: "number", step: "1", min: "25", max: "600", def: "85" },
      { id: "fio2", label: "FiO₂ (frazione inspirata O₂)", unit: "%", type: "number", step: "1", min: "21", max: "100", def: "21" }
    ],
    calcLogic: `
      const fDecimal = fio2 / 100;
      const ratio = pao2 / fDecimal;
      let ards = "Normale (P/F > 300)"; let color = "#2e7d32";
      if (ratio <= 100) { ards = "ARDS Grave (P/F ≤ 100)"; color = "#c62828"; }
      else if (ratio <= 200) { ards = "ARDS Moderata (100 < P/F ≤ 200)"; color = "#ea580c"; }
      else if (ratio <= 300) { ards = "ARDS Lieve (200 < P/F ≤ 300)"; color = "#d97706"; }
      return {
        mainValue: Math.round(ratio) + " mmHg",
        mainLabel: "Rapporto PaO₂ / FiO₂",
        metrics: [
          { label: "Criteri di Berlino (ARDS)", val: ards, color: color },
          { label: "FiO₂ ambiente", val: "21%" }
        ],
        note: "Definizione di Berlino per l'ARDS (JAMA 2012)."
      };
    `
  },
  {
    id: "gradiente-alveolo-arterioso-aa",
    folder: "Gradiente Alveolo-Arterioso O2",
    title: "Gradiente Alveolo-Arterioso di Ossigeno (P[A-a]O₂)",
    category: "pneumologia",
    categoryLabel: "Pneumologia & Gasometria",
    description: "Differenziazione tra ipoventilazione pura e patologie con alterazione del rapporto V/Q o shunt intrapolmonare.",
    tags: ["alveolo arterioso", "pao2", "paco2", "ega", "ipossia", "shunt"],
    inputs: [
      { id: "pao2", label: "PaO₂ misurata", unit: "mmHg", type: "number", step: "1", min: "30", max: "400", def: "75" },
      { id: "paco2", label: "PaCO₂ misurata", unit: "mmHg", type: "number", step: "1", min: "15", max: "120", def: "40" },
      { id: "age", label: "Età del paziente", unit: "anni", type: "number", step: "1", min: "10", max: "105", def: "60" },
      { id: "fio2", label: "FiO₂ (Aria ambiente = 21%)", unit: "%", type: "number", step: "1", min: "21", max: "100", def: "21" }
    ],
    calcLogic: `
      const patm = 760;
      const ph2o = 47;
      const r = 0.8;
      const pio2 = (fio2 / 100) * (patm - ph2o);
      const pao2Alveolar = pio2 - (paco2 / r);
      const aagrad = pao2Alveolar - pao2;
      const normalGrad = (age / 4) + 4;
      let interp = "Gradiente Normale (suggerisce ipoventilazione o alta quota)";
      let color = "#2e7d32";
      if (aagrad > normalGrad + 5) {
        interp = "Gradiente Aumentato: Difetto di diffusione, Shunt o Disparità V/Q (es. EP, Polmonite, BPCO, ARDS)";
        color = "#c62828";
      }
      return {
        mainValue: Math.round(aagrad) + " mmHg",
        mainLabel: "Gradiente P(A-a)O₂",
        metrics: [
          { label: "Gradiente Atteso per l'Età", val: "< " + Math.round(normalGrad) + " mmHg" },
          { label: "Valutazione Clinica", val: interp, color: color }
        ],
        note: "Equazione dei gas alveolari: PAO2 = PiO2 - (PaCO2 / 0.8)."
      };
    `
  },
  {
    id: "indice-rox-alti-flussi",
    folder: "Indice ROX (HFNC)",
    title: "Indice ROX (Ossigenoterapia ad Alti Flussi - HFNC)",
    category: "pneumologia",
    categoryLabel: "Pneumologia & Gasometria",
    description: "Predittore di successo o fallimento della ventilazione ad alti flussi (HFNC) e tempestività di intubazione.",
    tags: ["rox", "hfnc", "alti flussi", "intubazione", "respiro", "ipossiemia"],
    inputs: [
      { id: "spo2", label: "SpO₂ (Saturazione O₂)", unit: "%", type: "number", step: "1", min: "60", max: "100", def: "94" },
      { id: "fio2", label: "FiO₂ impostata sugli Alti Flussi", unit: "%", type: "number", step: "1", min: "21", max: "100", def: "50" },
      { id: "rr", label: "Frequenza Respiratoria", unit: "atti/min", type: "number", step: "1", min: "8", max: "60", def: "24" }
    ],
    calcLogic: `
      const fDecimal = fio2 / 100;
      const rox = (spo2 / fDecimal) / rr;
      let interp = ""; let color = "#2e7d32";
      if (rox >= 4.88) {
        interp = "Basso rischio di fallimento HFNC (Score ≥ 4.88) - Continuare HFNC";
      } else if (rox <= 3.85) {
        interp = "Alto rischio di fallimento HFNC (Score < 3.85) - Valutare tempestiva intubazione";
        color = "#c62828";
      } else {
        interp = "Zona intermedia (3.85 - 4.87) - Monitoraggio clinico ravvicinato entro 2 ore";
        color = "#d97706";
      }
      return {
        mainValue: rox.toFixed(2),
        mainLabel: "Indice ROX",
        metrics: [
          { label: "Valutazione Clinica", val: interp, color: color },
          { label: "Soglia di Sicurezza Validata", val: "≥ 4.88 a 2, 6 e 12 ore" }
        ],
        note: "Roca O et al. (J Crit Care 2016). Formula: (SpO2 / FiO2) / RR."
      };
    `
  },

  // -------------------------------------------------------------
  // GASTROENTEROLOGIA & EPATOLOGIA (65-74)
  // -------------------------------------------------------------
  {
    id: "child-pugh-score",
    folder: "Score Child-Pugh",
    title: "Score di Child-Pugh per Cirrosi Epatica",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Classificazione prognostica della gravità della cirrosi epatica e valutazione del rischio chirurgico.",
    tags: ["child-pugh", "cirrosi", "fegato", "ascite", "encefalopatia", "inr"],
    inputs: [
      { id: "bili", label: "Bilirubina Totale", type: "select", options: [{val: "1", label: "< 2 mg/dL (1 pt)"}, {val: "2", label: "2 - 3 mg/dL (2 pt)"}, {val: "3", label: "> 3 mg/dL (3 pt)"}] },
      { id: "alb", label: "Albumina Sierica", type: "select", options: [{val: "1", label: "> 3.5 g/dL (1 pt)"}, {val: "2", label: "2.8 - 3.5 g/dL (2 pt)"}, {val: "3", label: "< 2.8 g/dL (3 pt)"}] },
      { id: "inr", label: "INR", type: "select", options: [{val: "1", label: "< 1.7 (1 pt)"}, {val: "2", label: "1.7 - 2.3 (2 pt)"}, {val: "3", label: "> 2.3 (3 pt)"}] },
      { id: "asc", label: "Ascite", type: "select", options: [{val: "1", label: "Assente (1 pt)"}, {val: "2", label: "Lieve / controllata (2 pt)"}, {val: "3", label: "Moderata-severa (3 pt)"}] },
      { id: "enc", label: "Encefalopatia", type: "select", options: [{val: "1", label: "Assente (1 pt)"}, {val: "2", label: "Grado 1-2 (2 pt)"}, {val: "3", label: "Grado 3-4 (3 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(bili) + parseInt(alb) + parseInt(inr) + parseInt(asc) + parseInt(enc);
      let classe = ""; let sur1 = ""; let color = "#2e7d32";
      if (score <= 6) { classe = "Classe A (Compensata)"; sur1 = "100% a 1 anno"; }
      else if (score <= 9) { classe = "Classe B (Compromesso funzionale)"; sur1 = "80% a 1 anno"; color = "#d97706"; }
      else { classe = "Classe C (Scompensata)"; sur1 = "45% a 1 anno"; color = "#c62828"; }
      return {
        mainValue: score + " Punti (" + classe + ")",
        mainLabel: "Punteggio Child-Pugh",
        metrics: [
          { label: "Sopravvivenza a 1 Anno Stimata", val: sur1, color: color }
        ],
        note: "Pugh RN et al. (1973)."
      };
    `
  },
  {
    id: "meld-score",
    folder: "Score MELD",
    title: "Score MELD (Model for End-Stage Liver Disease)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Predittore di mortalità a 3 mesi ed elemento cardine per la lista trapianto fegato.",
    tags: ["meld", "trapianto", "fegato", "cirrosi", "creatinina", "bilirubina", "inr"],
    inputs: [
      { id: "creat", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.1", min: "0.5", max: "15", def: "1.2" },
      { id: "bili", label: "Bilirubina Totale", unit: "mg/dL", type: "number", step: "0.1", min: "0.2", max: "30", def: "2.1" },
      { id: "inr", label: "INR", unit: "", type: "number", step: "0.01", min: "0.8", max: "10", def: "1.4" },
      { id: "dial", label: "Dialisi (≥ 2 sedute negli ultimi 7 gg)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] }
    ],
    calcLogic: `
      let cr = dial === "1" ? 4.0 : creat;
      cr = Math.max(1.0, Math.min(4.0, cr));
      const bi = Math.max(1.0, bili);
      const inVal = Math.max(1.0, inr);
      const meld = 9.57 * Math.log(cr) + 3.78 * Math.log(bi) + 11.2 * Math.log(inVal) + 6.43;
      const rounded = Math.round(meld);
      let mort = ""; let color = "#2e7d32";
      if (rounded <= 9) mort = "1.9% mortalità a 3 mesi";
      else if (rounded <= 19) { mort = "6.0% mortalità a 3 mesi"; color = "#d97706"; }
      else if (rounded <= 29) { mort = "19.6% mortalità a 3 mesi"; color = "#ea580c"; }
      else { mort = "52 - 71% mortalità a 3 mesi"; color = "#c62828"; }
      return {
        mainValue: rounded + " Punti",
        mainLabel: "Score MELD",
        metrics: [
          { label: "Mortalità a 3 Mesi", val: mort, color: color },
          { label: "Priorità Trapiantologica", val: rounded >= 15 ? "Paziente idoneo a valutazione per lista attiva" : "Follow-up periodico" }
        ],
        note: "Kamath PS et al. (Hepatology 2001)."
      };
    `
  },
  {
    id: "fib-4-fibrosi-epatica",
    folder: "Indice FIB-4",
    title: "Indice FIB-4 (Fibrosi Epatica Non Invasiva)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Biomarcatore non invasivo per escludere o confermare fibrosi epatica avanzata / cirrosi in NAFLD/MASLD ed epatite virale.",
    tags: ["fib4", "fibrosi", "nafld", "masld", "fegato", "piastrine", "ast", "alt"],
    inputs: [
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "18", max: "95", def: "52" },
      { id: "ast", label: "AST (GOT)", unit: "U/L", type: "number", step: "1", min: "5", max: "1000", def: "45" },
      { id: "alt", label: "ALT (GPT)", unit: "U/L", type: "number", step: "1", min: "5", max: "1000", def: "55" },
      { id: "plt", label: "Piastrine (PLT)", unit: "x10³/µL", type: "number", step: "1", min: "10", max: "800", def: "210" }
    ],
    calcLogic: `
      const fib4 = (age * ast) / (plt * Math.sqrt(alt));
      let interp = ""; let color = "#2e7d32";
      if (fib4 < 1.30) {
        interp = "FIB-4 < 1.30: Bassa probabilità di fibrosi avanzata (F0-F1, NPV > 90%)";
      } else if (fib4 > 2.67) {
        interp = "FIB-4 > 2.67: Alta probabilità di fibrosi avanzata (F3-F4) - Indicata elastografia (FibroScan)";
        color = "#c62828";
      } else {
        interp = "FIB-4 1.30 - 2.67: Zona indeterminata - Necessario secondo livello (es. FibroScan)";
        color = "#d97706";
      }
      return {
        mainValue: fib4.toFixed(2),
        mainLabel: "Indice FIB-4",
        metrics: [
          { label: "Stratificazione Fibrosi Epatica", val: interp, color: color },
          { label: "Linee Guida EASL/AASLD", val: "Raccomandato come test non invasivo di primo livello" }
        ],
        note: "Sterling RK et al. (Hepatology 2006): FIB-4 = [Età * AST] / [Piastrine * sqrt(ALT)]."
      };
    `
  },
  {
    id: "gradiente-saag-ascite",
    folder: "Gradiente SAAG Ascite",
    title: "Gradiente Albumina Siero-Ascite (SAAG)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Diagnosi dell'ascite da ipertensione portale (cirrosi, scompenso) vs cause peritoneali (carcinomatosi, tubercolosi).",
    tags: ["saag", "ascite", "paracentesi", "albumina", "cirrosi", "ipertensione portale"],
    inputs: [
      { id: "sAlb", label: "Albumina Sierica", unit: "g/dL", type: "number", step: "0.1", min: "1", max: "6", def: "3.2" },
      { id: "aAlb", label: "Albumina nel Liquido Ascitico", unit: "g/dL", type: "number", step: "0.1", min: "0.1", max: "5", def: "1.2" }
    ],
    calcLogic: `
      const saag = sAlb - aAlb;
      let interp = ""; let color = "#2e7d32";
      if (saag >= 1.1) {
        interp = "SAAG ≥ 1.1 g/dL: Presenza di Ipertensione Portale (accuratezza > 97%). Es. Cirrosi, Scompenso Cardiaco, Sindrome di Budd-Chiari.";
        color = "#0277bd";
      } else {
        interp = "SAAG < 1.1 g/dL: Assenza di Ipertensione Portale. Es. Carcinomatosi Peritoneale, Peritonite Tubercolare, Sindrome Nefrosica, Pancreatite.";
        color = "#d97706";
      }
      return {
        mainValue: saag.toFixed(1) + " g/dL",
        mainLabel: "Gradiente SAAG (Siero - Ascite)",
        metrics: [
          { label: "Diagnosi Eziologica", val: interp, color: color },
          { label: "Soglia Clinica", val: "1.1 g/dL (Runyon BA, Hepatology)" }
        ],
        note: "SAAG = Albumina Sierica - Albumina Liquido Ascitico. Ha sostituito la distinzione trasudato/essudato nell'ascite."
      };
    `
  },
  {
    id: "glasgow-blatchford-emorragia",
    folder: "Score Glasgow-Blatchford",
    title: "Glasgow-Blatchford Bleeding Score (GBS)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Valutazione del rischio di sanguinamento digestivo superiore (GIB) e identificazione dei pazienti a bassissimo rischio dimissibili.",
    tags: ["blatchford", "gbs", "emorragia", "ematemesi", "melena", "endoscopia"],
    inputs: [
      { id: "bun", label: "Azotemia (BUN)", type: "select", options: [
        {val: "0", label: "< 18 mg/dL (0 pt)"},
        {val: "2", label: "18 - 22 mg/dL (+2 pt)"},
        {val: "3", label: "23 - 28 mg/dL (+3 pt)"},
        {val: "4", label: "29 - 69 mg/dL (+4 pt)"},
        {val: "6", label: "≥ 70 mg/dL (+6 pt)"}
      ]},
      { id: "hb", label: "Emoglobina (Hb)", type: "select", options: [
        {val: "0", label: "Normale (Uomo ≥ 13, Donna ≥ 12 g/dL, 0 pt)"},
        {val: "1", label: "Uomo 12-12.9 / Donna 10-11.9 g/dL (+1 pt)"},
        {val: "3", label: "Uomo 10-11.9 g/dL (+3 pt)"},
        {val: "6", label: "Uomo o Donna < 10.0 g/dL (+6 pt)"}
      ]},
      { id: "sbp", label: "Pressione Sistolica (PAS)", type: "select", options: [
        {val: "0", label: "≥ 110 mmHg (0 pt)"},
        {val: "1", label: "100 - 109 mmHg (+1 pt)"},
        {val: "2", label: "90 - 99 mmHg (+2 pt)"},
        {val: "3", label: "< 90 mmHg (+3 pt)"}
      ]},
      { id: "hr", label: "Frequenza Cardiaca ≥ 100 bpm", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "melena", label: "Presenza di Melena", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "syncope", label: "Presenza di Sincope", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "liver", label: "Epatopatia nota", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "chf", label: "Scompenso cardiaco noto", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(bun) + parseInt(hb) + parseInt(sbp) + parseInt(hr) + parseInt(melena) + parseInt(syncope) + parseInt(liver) + parseInt(chf);
      let risk = ""; let color = "#2e7d32";
      if (score === 0) {
        risk = "Score 0: Bassissimo rischio. Il paziente può essere candidato a gestione ambulatoriale senza ricovero urgente.";
      } else {
        risk = "Score ≥ 1: Rischio aumentato di necessità di trasfusione, emostasi endoscopica urgente o reintervento.";
        color = score >= 6 ? "#c62828" : "#d97706";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score Glasgow-Blatchford",
        metrics: [
          { label: "Giudizio di Rischio", val: risk, color: color },
          { label: "Indicazione", val: score > 1 ? "Ricovero e/o endoscopia digestiva entro 24h" : "Possibile gestione protetta" }
        ],
        note: "Blatchford O et al. (Lancet 2000)."
      };
    `
  },

  // -------------------------------------------------------------
  // ENDOCRINOLOGIA & DIABETE (75-81)
  // -------------------------------------------------------------
  {
    id: "homa-ir-index",
    folder: "Indice HOMA-IR",
    title: "Indice HOMA-IR (Insulino-Resistenza)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Stima della resistenza insulinica a partire da glicemia e insulinemia a digiuno.",
    tags: ["homa", "insulina", "glicemia", "diabete", "insulino-resistenza"],
    inputs: [
      { id: "glu", label: "Glicemia a digiuno", unit: "mg/dL", type: "number", step: "1", min: "40", max: "400", def: "95" },
      { id: "ins", label: "Insulinemia a digiuno", unit: "µU/mL", type: "number", step: "0.1", min: "1", max: "150", def: "12" }
    ],
    calcLogic: `
      const homa = (glu * ins) / 405;
      let interp = "Normale (< 2.5)"; let color = "#2e7d32";
      if (homa >= 3.0) { interp = "Insulino-resistenza conclamata (≥ 3.0)"; color = "#c62828"; }
      else if (homa >= 2.5) { interp = "Borderline (2.5 - 2.9)"; color = "#d97706"; }
      return {
        mainValue: homa.toFixed(2),
        mainLabel: "Indice HOMA-IR",
        metrics: [
          { label: "Valutazione Clinica", val: interp, color: color },
          { label: "Formula", val: "[Glicemia * Insulina] / 405" }
        ],
        note: "Matthews DR et al. (Diabetologia 1985)."
      };
    `
  },
  {
    id: "emoglobina-glicata-stimata-eag",
    folder: "Emoglobina Glicata Stimata (eAG)",
    title: "Glicemia Media Stimata da HbA1c (eAG)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Conversione tra percentuale di HbA1c e media glicemica stimata giornaliera (eAG).",
    tags: ["hba1c", "glicata", "eag", "glicemia media", "diabete"],
    inputs: [
      { id: "hba1c", label: "HbA1c (Emoglobina Glicata)", unit: "%", type: "number", step: "0.1", min: "4.0", max: "16.0", def: "7.0" }
    ],
    calcLogic: `
      const eag = 28.7 * hba1c - 46.7;
      let target = ""; let color = "#2e7d32";
      if (hba1c < 5.7) target = "Normale / Non diabetico (< 5.7%)";
      else if (hba1c <= 6.4) { target = "Prediabete (5.7 - 6.4%)"; color = "#d97706"; }
      else if (hba1c <= 7.0) { target = "Target ottimale ADA (≤ 7.0%)"; color = "#2e7d32"; }
      else { target = "Controllo subottimale (> 7.0%)"; color = "#c62828"; }
      return {
        mainValue: Math.round(eag) + " mg/dL",
        mainLabel: "Glicemia Media Stimata (eAG)",
        metrics: [
          { label: "Equivalente in mmol/L", val: (eag / 18.018).toFixed(1) + " mmol/L" },
          { label: "Classificazione ADA", val: target, color: color }
        ],
        note: "Trial ADAG (Nathan DM et al., Diabetes Care 2008)."
      };
    `
  },
  {
    id: "fattore-sensibilita-insulinica-isf",
    folder: "Fattore Sensibilità Insulinica (ISF)",
    title: "Fattore di Sensibilità Insulinica (Regola del 1500 / 1800)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Stima di quanti mg/dL di glicemia vengono abbattuti da 1 unità di insulina rapida.",
    tags: ["isf", "sensibilita insulina", "regola 1800", "bolo correttivo", "diabete tipo 1"],
    inputs: [
      { id: "tdd", label: "Dose Giornaliera Totale Insulina (TDD)", unit: "Unità/die", type: "number", step: "1", min: "5", max: "250", def: "45" },
      { id: "type", label: "Tipo di Insulina Rapida Usata", type: "select", options: [
        {val: "1800", label: "Analogo Rapido moderno (Aspart, Lispro, Glulisina - Regola 1800)"},
        {val: "1500", label: "Insulina Regolare Umana (Regola 1500)"}
      ]}
    ],
    calcLogic: `
      const rule = parseFloat(type);
      const isf = rule / tdd;
      return {
        mainValue: Math.round(isf) + " mg/dL per 1 Unità",
        mainLabel: "Fattore di Sensibilità Insulinica (ISF)",
        metrics: [
          { label: "Regola Applicata", val: "Regola del " + rule },
          { label: "Uso Clinico", val: "Calcolo del bolo di correzione: (Glicemia Attuale - Target) / ISF" }
        ],
        note: "Fattore di correzione standard per terapia intensiva insulinica nel diabete."
      };
    `
  },

  // -------------------------------------------------------------
  // EMATOLOGIA & ONCOLOGIA (82-90)
  // -------------------------------------------------------------
  {
    id: "conta-assoluta-neutrofili-anc",
    folder: "Conta Assoluta Neutrofili (ANC)",
    title: "Conta Assoluta dei Neutrofili (ANC)",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Valutazione del rischio di neutropenia febbrile e sicurezza dei cicli chemioterapici.",
    tags: ["anc", "neutrofili", "neutropenia", "emocromo", "leucociti", "chemioterapia"],
    inputs: [
      { id: "wbc", label: "Leucociti Totali (WBC)", unit: "/µL", type: "number", step: "100", min: "200", max: "100000", def: "4500" },
      { id: "seg", label: "% Neutrofili Segmentati", unit: "%", type: "number", step: "1", min: "0", max: "100", def: "55" },
      { id: "bands", label: "% Neutrofili Bandati", unit: "%", type: "number", step: "1", min: "0", max: "100", def: "3" }
    ],
    calcLogic: `
      const anc = (wbc * (seg + bands)) / 100;
      let risk = "Normale (> 1500/µL)"; let color = "#2e7d32";
      if (anc < 500) { risk = "Neutropenia Grave (< 500/µL)"; color = "#c62828"; }
      else if (anc < 1000) { risk = "Neutropenia Moderata (500-999/µL)"; color = "#ea580c"; }
      else if (anc < 1500) { risk = "Neutropenia Lieve (1000-1500/µL)"; color = "#d97706"; }
      return {
        mainValue: Math.round(anc) + " /µL",
        mainLabel: "Conta Assoluta Neutrofili",
        metrics: [
          { label: "Grado di Neutropenia", val: risk, color: color }
        ],
        note: "Formula: WBC * (% Segmentati + % Bandati) / 100."
      };
    `
  },
  {
    id: "indice-mentzer-anemie",
    folder: "Indice di Mentzer",
    title: "Indice di Mentzer per Anemia Microcitica",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Differenziazione tra tratto beta-talassemico e anemia da carenza marziale.",
    tags: ["mentzer", "anemia", "microcitosi", "talassemia", "ferro", "mcv"],
    inputs: [
      { id: "mcv", label: "MCV", unit: "fL", type: "number", step: "0.1", min: "45", max: "120", def: "68" },
      { id: "rbc", label: "Eritrociti (RBC)", unit: "x10⁶/µL", type: "number", step: "0.01", min: "1.5", max: "8.5", def: "5.8" }
    ],
    calcLogic: `
      const mentzer = mcv / rbc;
      let interp = mentzer < 13 ? "Indice < 13: Suggestivo di Tratto Talassemico" : "Indice > 13: Suggestivo di Carenza Marziale (Sideropenia)";
      let color = mentzer < 13 ? "#0277bd" : "#d97706";
      return {
        mainValue: mentzer.toFixed(1),
        mainLabel: "Indice di Mentzer (MCV / RBC)",
        metrics: [
          { label: "Ipotesi Diagnostica", val: interp, color: color }
        ],
        note: "Mentzer WC (Lancet 1973)."
      };
    `
  },
  {
    id: "score-4ts-hit",
    folder: "Score 4Ts per HIT",
    title: "Score 4Ts per Trombocitopenia Indotta da Eparina (HIT)",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Probabilità pre-test di HIT di tipo II e indicazione all'immediata sospensione dell'eparina.",
    tags: ["4ts", "hit", "eparina", "piastrine", "trombocitopenia", "trombosi"],
    inputs: [
      { id: "t1", label: "Grado di Trombocitopenia", type: "select", options: [
        {val: "2", label: "Calo piastrine > 50% e nadir ≥ 20.000/µL (+2 pt)"},
        {val: "1", label: "Calo piastrine 30-50% o nadir 10.000-19.000/µL (+1 pt)"},
        {val: "0", label: "Calo piastrine < 30% o nadir < 10.000/µL (0 pt)"}
      ]},
      { id: "t2", label: "Tempistica del calo (Timing)", type: "select", options: [
        {val: "2", label: "Esordio netto tra giorno 5 e 10, o ≤ 1 giorno se eparina negli ultimi 30 gg (+2 pt)"},
        {val: "1", label: "Esordio dopo giorno 10, o esordio rapido con eparina 30-100 gg fa (+1 pt)"},
        {val: "0", label: "Esordio prima del giorno 4 senza recente esposizione ad eparina (0 pt)"}
      ]},
      { id: "t3", label: "Trombosi o altre manifestazioni", type: "select", options: [
        {val: "2", label: "Nuova trombosi documentata o necrosi cutanea o reazione anafilattoide (+2 pt)"},
        {val: "1", label: "Trombosi progressiva/ricorrente o lesioni cutanee eritematose (+1 pt)"},
        {val: "0", label: "Nessuna trombosi (0 pt)"}
      ]},
      { id: "t4", label: "Altre cause di trombocitopenia", type: "select", options: [
        {val: "2", label: "Nessun'altra causa evidente (+2 pt)"},
        {val: "1", label: "Altra causa possibile (+1 pt)"},
        {val: "0", label: "Altra causa certa presente (sepsi, DIC, chemio) (0 pt)"}
      ]}
    ],
    calcLogic: `
      const score = parseInt(t1) + parseInt(t2) + parseInt(t3) + parseInt(t4);
      let prob = "Bassa probabilità (Score 0-3)"; let act = "Non necessaria sospensione immediata dell'eparina (NPV ~99%)"; let color = "#2e7d32";
      if (score >= 6) {
        prob = "Alta probabilità di HIT (Score 6-8)"; act = "SOSPENDERE IMMEDIATAMENTE ogni forma di eparina e avviare anticoagulante alternativo (Fondaparinux / Argatroban / DOAC)"; color = "#c62828";
      } else if (score >= 4) {
        prob = "Probabilità Intermedia (Score 4-5)"; act = "Eseguire dosaggio anticorpi anti-PF4/eparina e valutare sospensione eparina"; color = "#d97706";
      }
      return {
        mainValue: score + " / 8 Punti",
        mainLabel: "Score 4Ts",
        metrics: [
          { label: "Probabilità Clinica di HIT", val: prob, color: color },
          { label: "Condotta Terapeutica", val: act }
        ],
        note: "Warkentin TE et al. (J Thromb Haemost 2003)."
      };
    `
  },
  {
    id: "formula-calvert-carboplatino",
    folder: "Formula di Calvert (Carboplatino)",
    title: "Formula di Calvert per Dosaggio del Carboplatino",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Calcolo della dose di Carboplatino in milligrammi basata sulla clearance renale e target AUC.",
    tags: ["calvert", "carboplatino", "oncologia", "auc", "chemioterapia", "clearance"],
    inputs: [
      { id: "auc", label: "Target AUC desiderato", unit: "mg/mL·min", type: "number", step: "0.5", min: "2", max: "8", def: "5" },
      { id: "gfr", label: "Clearance Creatinina (o GFR)", unit: "mL/min", type: "number", step: "1", min: "10", max: "180", def: "80" }
    ],
    calcLogic: `
      const cappedGfr = Math.min(125, gfr); // Cappato a 125 mL/min secondo linee guida ASCO
      const dose = auc * (cappedGfr + 25);
      return {
        mainValue: Math.round(dose) + " mg",
        mainLabel: "Dose Totale di Carboplatino",
        metrics: [
          { label: "Formula di Calvert", val: "Dose = Target AUC * (GFR + 25)" },
          { label: "GFR impiegato (cappato a max 125)", val: cappedGfr + " mL/min" }
        ],
        note: "Calvert AH et al. (J Clin Oncol 1989). ASCO raccomanda il tetto massimo di GFR a 125 mL/min per evitare tossicità."
      };
    `
  },

  // -------------------------------------------------------------
  // PEDIATRIA & NEONATOLOGIA (91-97)
  // -------------------------------------------------------------
  {
    id: "apgar-score",
    folder: "Punteggio APGAR",
    title: "Punteggio di APGAR Neonatale",
    category: "pediatria",
    categoryLabel: "Pediatria & Neonatologia",
    description: "Valutazione dell'adattamento neonatale al 1° e 5° minuto di vita.",
    tags: ["apgar", "neonato", "nascita", "pediatria", "parto"],
    inputs: [
      { id: "color", label: "Colorito (Appearance)", type: "select", options: [{val: "0", label: "Cianotico/pallido (0 pt)"}, {val: "1", label: "Corpo roseo, acrocianosi (+1 pt)"}, {val: "2", label: "Completamente roseo (+2 pt)"}] },
      { id: "hr", label: "Frequenza Cardiaca (Pulse)", type: "select", options: [{val: "0", label: "Assente (0 pt)"}, {val: "1", label: "< 100 bpm (+1 pt)"}, {val: "2", label: "≥ 100 bpm (+2 pt)"}] },
      { id: "reflex", label: "Riflessi (Grimace)", type: "select", options: [{val: "0", label: "Nessuna risposta (0 pt)"}, {val: "1", label: "Smorfia / reazione debole (+1 pt)"}, {val: "2", label: "Pianto vivace / tosse (+2 pt)"}] },
      { id: "tone", label: "Tono Muscolare (Activity)", type: "select", options: [{val: "0", label: "Atonico (0 pt)"}, {val: "1", label: "Flessione lieve (+1 pt)"}, {val: "2", label: "Movimenti attivi (+2 pt)"}] },
      { id: "resp", label: "Respirazione (Respiration)", type: "select", options: [{val: "0", label: "Assente (0 pt)"}, {val: "1", label: "Debole / irregolare (+1 pt)"}, {val: "2", label: "Buona, pianto vigoroso (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(color) + parseInt(hr) + parseInt(reflex) + parseInt(tone) + parseInt(resp);
      let cond = "Ottime condizioni neonatali (7-10)"; let colorR = "#2e7d32";
      if (score <= 3) { cond = "Grave depressione neonatale (0-3) - Rianimazione immediata"; colorR = "#c62828"; }
      else if (score <= 6) { cond = "Moderata depressione (4-6) - Supporto O2 e stimolazione"; colorR = "#d97706"; }
      return {
        mainValue: score + " / 10",
        mainLabel: "Score di APGAR",
        metrics: [
          { label: "Giudizio Clinico", val: cond, color: colorR }
        ],
        note: "Virginia Apgar (1953)."
      };
    `
  },
  {
    id: "centor-mcisaac-faringite",
    folder: "Score Centor-McIsaac",
    title: "Score di Centor / McIsaac per Faringite Streptococcica",
    category: "pediatria",
    categoryLabel: "Pediatria & Neonatologia",
    description: "Probabilità di infezione da Streptococco di Gruppo A e indicazione al tampone rapido.",
    tags: ["centor", "mcisaac", "faringite", "streptococco", "tonsillite"],
    inputs: [
      { id: "temp", label: "Febbre > 38°C", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "cough", label: "Assenza di tosse", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "nodes", label: "Linfoadenopatia cervicale anteriore dolente", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "tonsils", label: "Essudato tonsillare", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "age", label: "Età", type: "select", options: [{val: "1", label: "3 - 14 anni (+1 pt)"}, {val: "0", label: "15 - 44 anni (0 pt)"}, {val: "-1", label: "≥ 45 anni (-1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(temp) + parseInt(cough) + parseInt(nodes) + parseInt(tonsils) + parseInt(age);
      let risk = "Basso (< 10%)"; let action = "Né tampone né antibiotico"; let color = "#2e7d32";
      if (score >= 4) { risk = "Elevato (50%)"; action = "Tampone rapido o antibiotico"; color = "#c62828"; }
      else if (score >= 2) { risk = "Intermedio (15-32%)"; action = "Eseguire tampone rapido"; color = "#d97706"; }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score di McIsaac",
        metrics: [
          { label: "Rischio Streptococco", val: risk, color: color },
          { label: "Azione", val: action }
        ],
        note: "McIsaac WJ et al. (CMAJ 1998)."
      };
    `
  },
  {
    id: "silverman-andersen-distress",
    folder: "Punteggio Silverman-Andersen",
    title: "Score di Silverman-Andersen (Distress Respiratorio Neonatale)",
    category: "pediatria",
    categoryLabel: "Pediatria & Neonatologia",
    description: "Quantificazione della gravità del distress respiratorio nel neonato (a differenza del GCS, più alto è il punteggio più grave è il distress).",
    tags: ["silverman", "distress", "neonato", "gemito", "rientramenti", "respiro"],
    inputs: [
      { id: "chest", label: "Movimenti Toraco-Addominali", type: "select", options: [{val: "0", label: "Sincroni (0 pt)"}, {val: "1", label: "Ritardo inspiratorio del torace (+1 pt)"}, {val: "2", label: "Respirazione paradosso / altalena (+2 pt)"}] },
      { id: "inter", label: "Rientramenti Intercostali", type: "select", options: [{val: "0", label: "Assenti (0 pt)"}, {val: "1", label: "Lievemente visibili (+1 pt)"}, {val: "2", label: "Marcati (+2 pt)"}] },
      { id: "xyph", label: "Rientramento Xifoideo", type: "select", options: [{val: "0", label: "Assente (0 pt)"}, {val: "1", label: "Lievemente visibile (+1 pt)"}, {val: "2", label: "Marcato (+2 pt)"}] },
      { id: "nose", label: "Alitamento delle Pinne Nasali", type: "select", options: [{val: "0", label: "Assente (0 pt)"}, {val: "1", label: "Minimo (+1 pt)"}, {val: "2", label: "Evidente (+2 pt)"}] },
      { id: "grunt", label: "Gemito Espiratorio (Grunting)", type: "select", options: [{val: "0", label: "Assente (0 pt)"}, {val: "1", label: "Udibile solo con stetoscopio (+1 pt)"}, {val: "2", label: "Udibile a distanza a orecchio nudo (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(chest) + parseInt(inter) + parseInt(xyph) + parseInt(nose) + parseInt(grunt);
      let interp = "Nessun distress respiratorio (0 pt)"; let color = "#2e7d32";
      if (score >= 7) { interp = "Distress Respiratorio Grave (Score ≥ 7) - Rischio arresto respiratorio imminente"; color = "#c62828"; }
      else if (score >= 4) { interp = "Distress Respiratorio Moderato (Score 4-6)"; color = "#ea580c"; }
      else if (score >= 1) { interp = "Distress Lieve (Score 1-3)"; color = "#d97706"; }
      return {
        mainValue: score + " / 10",
        mainLabel: "Score Silverman-Andersen",
        metrics: [
          { label: "Severità Clinica", val: interp, color: color },
          { label: "Punteggio 0", val: "Assenza di distress respiratorio" }
        ],
        note: "Silverman WA & Andersen DH (Pediatrics 1956)."
      };
    `
  },

  // -------------------------------------------------------------
  // NEUROLOGIA & ICTUS (98-102)
  // -------------------------------------------------------------
  {
    id: "abcd2-score-tia",
    folder: "Score ABCD2 per TIA",
    title: "Score ABCD² (Rischio Ictus post-TIA)",
    category: "neurologia",
    categoryLabel: "Neurologia & Ictus",
    description: "Predizione del rischio precoce di ictus ischemico dopo un attacco ischemico transitorio.",
    tags: ["abcd2", "tia", "ictus", "stroke", "neurologia"],
    inputs: [
      { id: "age", label: "Età ≥ 60 anni", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "bp", label: "Pressione Arteriosa elevata (PAS ≥ 140 o PAD ≥ 90)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "clin", label: "Caratteristiche Cliniche del TIA", type: "select", options: [{val: "2", label: "Deficit motorio unilaterale (+2 pt)"}, {val: "1", label: "Disturbo del linguaggio senza deficit motorio (+1 pt)"}, {val: "0", label: "Altri sintomi (0 pt)"}] },
      { id: "dur", label: "Durata Sintomi", type: "select", options: [{val: "2", label: "≥ 60 minuti (+2 pt)"}, {val: "1", label: "10 - 59 minuti (+1 pt)"}, {val: "0", label: "< 10 minuti (0 pt)"}] },
      { id: "dm", label: "Diabete Mellito", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(bp) + parseInt(clin) + parseInt(dur) + parseInt(dm);
      let risk = "Rischio Basso (0-3)"; let risk2d = "1.0% a 2 gg"; let color = "#2e7d32";
      if (score >= 6) { risk = "Alto Rischio (6-7)"; risk2d = "8.1% a 2 gg, 18% a 90 gg"; color = "#c62828"; }
      else if (score >= 4) { risk = "Rischio Moderato (4-5)"; risk2d = "4.1% a 2 gg"; color = "#d97706"; }
      return {
        mainValue: score + " / 7 Punti",
        mainLabel: "Score ABCD²",
        metrics: [
          { label: "Categoria di Rischio", val: risk, color: color },
          { label: "Rischio Ictus a 48 ore", val: risk2d }
        ],
        note: "Johnston SC et al. (Lancet 2007)."
      };
    `
  },
  {
    id: "hunt-hess-emorragia-subaracnoidea",
    folder: "Scala Hunt e Hess",
    title: "Scala di Hunt e Hess per Emorragia Subaracnoidea (ESA)",
    category: "neurologia",
    categoryLabel: "Neurologia & Ictus",
    description: "Classificazione clinica della gravità del sanguinamento da rottura aneurismatica intracranica.",
    tags: ["hunt hess", "esa", "emorragia subaracnoidea", "aneurisma", "cefalea"],
    inputs: [
      { id: "grade", label: "Quadro Clinico alla Presentazione", type: "select", options: [
        {val: "1", label: "Grado 1: Asintomatico, o lieve cefalea con modesta rigidità nucale (Mortalità ~30%)"},
        {val: "2", label: "Grado 2: Cefalea moderata-severa, rigidità nucale, nessun deficit neurologico oltre paralisi nervi cranici (Mortalità ~40%)"},
        {val: "3", label: "Grado 3: Letargia, confusione, o lieve deficit focale (Mortalità ~50%)"},
        {val: "4", label: "Grado 4: Stupor, emiparesi moderata-severa, possibile decerebrazione precoce (Mortalità ~80%)"},
        {val: "5", label: "Grado 5: Coma profondo, postura decerebrata, moribondo (Mortalità ~90%)"}
      ]}
    ],
    calcLogic: `
      const g = parseInt(grade);
      let mort = ""; let col = "#2e7d32";
      if (g >= 4) { mort = "Prognosi grave (mortalità 80-90%)"; col = "#c62828"; }
      else if (g === 3) { mort = "Prognosi riservata (mortalità ~50%)"; col = "#ea580c"; }
      else { mort = "Favorevole se trattato precocemente (mortalità 30-40%)"; col = "#0277bd"; }
      return {
        mainValue: "Grado " + g,
        mainLabel: "Grado Clinico Hunt & Hess",
        metrics: [
          { label: "Stima Prognostica", val: mort, color: col },
          { label: "Indicazione", val: "Angio-TC cerebrale e consulenza neurochirurgica/interventistica urgente" }
        ],
        note: "Hunt WE & Hess RM (J Neurosurg 1968)."
      };
    `
  },

  // -------------------------------------------------------------
  // CHIRURGIA & PERIOPERATORIO (103-108)
  // -------------------------------------------------------------
  {
    id: "alvarado-score-appendicite",
    folder: "Score di Alvarado",
    title: "Score di Alvarado per Appendicite Acuta",
    category: "chirurgia",
    categoryLabel: "Chirurgia & Perioperatorio",
    description: "Probabilità di appendicite acuta nel dolore in fossa iliaca destra.",
    tags: ["alvarado", "appendicite", "chirurgia", "addome", "urgenza"],
    inputs: [
      { id: "migr", label: "Migrazione dolore a fossa iliaca destra", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "anorex", label: "Inappetenza / Anoressia", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "nausea", label: "Nausea o vomito", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "tender", label: "Dolorabilità fossa iliaca destra (McBurney)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "rebound", label: "Segno di Blumberg positivo", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "elev", label: "Temperatura ≥ 37.3 °C", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "leuko", label: "Leucocitosi (> 10.000 /µL)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "shift", label: "Neutrofilia (> 75%)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(migr) + parseInt(anorex) + parseInt(nausea) + parseInt(tender) + parseInt(rebound) + parseInt(elev) + parseInt(leuko) + parseInt(shift);
      let prob = "Appendicite molto improbabile (1-4)"; let color = "#2e7d32";
      if (score >= 7) { prob = "Appendicite altamente probabile (7-10) - Indicata chirurgia"; color = "#c62828"; }
      else if (score >= 5) { prob = "Appendicite possibile (5-6) - Indicata ecografia addome"; color = "#d97706"; }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Score di Alvarado",
        metrics: [
          { label: "Probabilità Clinica", val: prob, color: color }
        ],
        note: "Alvarado A (Ann Emerg Med 1986)."
      };
    `
  },
  {
    id: "wells-tvp",
    folder: "Criteri di Wells per TVP",
    title: "Criteri di Wells per Trombosi Venosa Profonda",
    category: "chirurgia",
    categoryLabel: "Chirurgia & Perioperatorio",
    description: "Stratificazione della probabilità di TVP dell'arto inferiore.",
    tags: ["wells", "tvp", "trombosi", "edema", "d-dimero"],
    inputs: [
      { id: "cancer", label: "Cancro attivo", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "paralysis", label: "Paralisi, paresi o immobilizzazione arto", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "bedridden", label: "Allettamento recente ≥ 3 gg o chirurgia nelle 12 sett.", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "tenderness", label: "Dolorabilità lungo il decorso venoso profondo", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "entireleg", label: "Edema di tutto l'arto", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "calf", label: "Circonferenza polpaccio > 3 cm rispetto al controlaterale", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "pitting", label: "Edema con fovea confinato all'arto sintomatico", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "collateral", label: "Vene collaterali superficiali visibili", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "prevdvt", label: "Precedente TVP documentata", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "altdiag", label: "Diagnosi alternativa più probabile della TVP", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "-2", label: "Sì (-2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(cancer) + parseInt(paralysis) + parseInt(bedridden) + parseInt(tenderness) + parseInt(entireleg) + parseInt(calf) + parseInt(pitting) + parseInt(collateral) + parseInt(prevdvt) + parseInt(altdiag);
      let prob = score >= 2 ? "TVP Probabile (Score ≥ 2) - Indicato Ecocolordoppler" : "TVP Improbabile (Score < 2) - Eseguire D-Dimero";
      let color = score >= 2 ? "#c62828" : "#2e7d32";
      return {
        mainValue: score + " Punti",
        mainLabel: "Score di Wells TVP",
        metrics: [
          { label: "Probabilità Clinica", val: prob, color: color }
        ],
        note: "Wells PS et al. (NEJM 2003)."
      };
    `
  },
  {
    id: "classificazione-asa-ps",
    folder: "Classificazione ASA",
    title: "Classificazione dello Stato Fisico ASA (ASA-PS)",
    category: "chirurgia",
    categoryLabel: "Chirurgia & Perioperatorio",
    description: "Stratificazione del rischio anestesiologico preoperatorio globale dell'American Society of Anesthesiologists.",
    tags: ["asa", "anestesia", "preoperatorio", "rischio chirurgico", "sala operatoria"],
    inputs: [
      { id: "asaGrade", label: "Condizione Sistemica del Paziente", type: "select", options: [
        {val: "1", label: "ASA I: Paziente normale e sano, non fumatore, uso minimo o nullo di alcol"},
        {val: "2", label: "ASA II: Paziente con patologia sistemica lieve (es. ipertensione ben controllata, diabete senza complicanze, fumatore, gravidanza, BMI 30-40)"},
        {val: "3", label: "ASA III: Paziente con patologia sistemica severa che limita l'attività ma non è invalidante (es. CAD stabile, BPCO moderata, BMI ≥ 40, dialisi regolare)"},
        {val: "4", label: "ASA IV: Paziente con patologia sistemica severa che costituisce una minaccia costante per la vita (es. IMA recente < 3 mesi, TIA recente, insufficienza d'organo scompensata)"},
        {val: "5", label: "ASA V: Paziente moribondo che non sopravvivrà senza l'intervento chirurgico (es. rottura di aneurisma aortico, politrauma massivo)"},
        {val: "6", label: "ASA VI: Paziente dichiarato cerebralmente morto i cui organi vengono prelevati a scopo di trapianto"}
      ]},
      { id: "emergency", label: "Intervento in Emergenza / Urgenza", type: "select", options: [
        {val: "0", label: "Intervento di elezione (programmato)"},
        {val: "1", label: "Intervento in Emergenza (suffisso 'E')"}
      ]}
    ],
    calcLogic: `
      const g = asaGrade;
      const isE = emergency === "1";
      const displayClass = "ASA " + g + (isE ? "E" : "");
      let riskDesc = ""; let color = "#2e7d32";
      if (g === "1") { riskDesc = "Rischio anestesiologico basale minimo (mortalità perioperatoria < 0.1%)"; }
      else if (g === "2") { riskDesc = "Rischio lieve aumentato (mortalità perioperatoria ~0.2%)"; color = "#2e7d32"; }
      else if (g === "3") { riskDesc = "Rischio moderato-significativo (mortalità perioperatoria ~1.8%)"; color = "#d97706"; }
      else if (g === "4") { riskDesc = "Alto rischio perioperatorio (mortalità perioperatoria ~7.8%)"; color = "#ea580c"; }
      else if (g === "5") { riskDesc = "Rischio estremo (mortalità perioperatoria ~9.4%)"; color = "#c62828"; }
      else { riskDesc = "Donatore di organi a cuore battente"; color = "#475569"; }
      return {
        mainValue: displayClass,
        mainLabel: "Classe ASA Attribuita",
        metrics: [
          { label: "Mortalità Perioperatoria Indicativa", val: riskDesc, color: color },
          { label: "Contesto", val: isE ? "Chirurgia d'Emergenza (Suffisso E applicato)" : "Elezione" }
        ],
        note: "American Society of Anesthesiologists (ASA) Physical Status Classification System."
      };
    `
  },
  {
    id: "score-rcri-lee",
    folder: "Score di Lee (RCRI)",
    title: "Revised Cardiac Risk Index di Lee (RCRI)",
    category: "chirurgia",
    categoryLabel: "Chirurgia & Perioperatorio",
    description: "Stima del rischio di complicanze cardiache maggiori (infarto miocardico, arresto cardiaco, edema polmonare) in chirurgia non cardiaca.",
    tags: ["rcri", "lee", "rischio cardiaco", "preoperatorio", "mace", "chirurgia"],
    inputs: [
      { id: "highrisk", label: "Chirurgia ad alto rischio (intratoracica, intra-addominale, soprainguinale vascolare)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "cad", label: "Cardiopatia ischemica nota (pregresso IMA, angina, uso nitrati)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "chf", label: "Storia di scompenso cardiaco congestizio", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "cva", label: "Storia di patologia cerebrovascolare (pregresso ictus o TIA)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "insulin", label: "Trattamento insulinico per diabete preoperatorio", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "creat", label: "Creatinina sierica preoperatoria > 2.0 mg/dL", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(highrisk) + parseInt(cad) + parseInt(chf) + parseInt(cva) + parseInt(insulin) + parseInt(creat);
      let riskRate = ""; let classe = ""; let color = "#2e7d32";
      if (score === 0) { classe = "Classe I"; riskRate = "0.4% complicanze cardiache maggiori"; }
      else if (score === 1) { classe = "Classe II"; riskRate = "0.9% complicanze cardiache maggiori"; color = "#2e7d32"; }
      else if (score === 2) { classe = "Classe III"; riskRate = "6.6% complicanze cardiache maggiori"; color = "#d97706"; }
      else { classe = "Classe IV"; riskRate = "≥ 11.0% complicanze cardiache maggiori"; color = "#c62828"; }
      return {
        mainValue: score + " Punti (" + classe + ")",
        mainLabel: "Score RCRI di Lee",
        metrics: [
          { label: "Rischio Cardiaco Perioperatorio MACE", val: riskRate, color: color },
          { label: "Raccomandazione ESC/AHA", val: score >= 2 ? "Valutazione cardiologica ed ecocardiogramma preoperatorio raccomandati" : "Procedibilità chirurgica sicura dal punto di vista cardiologico" }
        ],
        note: "Lee TH et al. (Circulation 1999)."
      };
    `
  }
];

// Generazione file
const calcolatoriDir = path.join(__dirname, 'App', 'Calcolatori');
if (!fs.existsSync(calcolatoriDir)) {
  fs.mkdirSync(calcolatoriDir, { recursive: true });
}

function generateHTML(calc) {
  const inputsHTML = calc.inputs.map(inp => {
    if (inp.type === "select") {
      const opts = inp.options.map(o => `<option value="${o.val}">${o.label}</option>`).join('');
      return `
        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" for="${inp.id}">${inp.label} *</label>
          <select id="${inp.id}" class="form-select">${opts}</select>
        </div>
      `;
    } else {
      return `
        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" for="${inp.id}">${inp.label} ${inp.unit ? `<span class="unit">(${inp.unit})</span>` : ''} *</label>
          <input type="number" id="${inp.id}" class="form-control" step="${inp.step || '1'}" min="${inp.min || '0'}" max="${inp.max || '1000'}" value="${inp.def || ''}" required>
        </div>
      `;
    }
  }).join('');

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${calc.title} - Calcolatori Medici</title>
  <link rel="stylesheet" href="../../shared/shared.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="app-header">
    <div class="header-left">
      <a href="../../Home/index.html" class="btn-back">← Torna alla Home</a>
      <div class="header-title-block">
        <h1>${calc.title}</h1>
        <div class="subtitle">${calc.description}</div>
      </div>
    </div>
    <span class="category-badge badge-${calc.category}">${calc.categoryLabel}</span>
  </header>

  <main class="main-layout">
    <div class="calc-grid-layout">
      <!-- Form Input -->
      <section class="med-card">
        <h2 class="med-card-title"><span>📋</span> Parametri del Paziente</h2>
        <p class="med-card-subtitle">Compila i campi richiesti per visualizzare il calcolo e la stratificazione clinica.</p>
        <form id="calcForm">
          ${inputsHTML}
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" class="btn-primary" style="flex: 2;">⚡ Calcola</button>
            <button type="button" id="btnReset" class="btn-secondary" style="flex: 1;">Resetta</button>
          </div>
        </form>
      </section>

      <!-- Risultati -->
      <section class="med-card" style="display: flex; flex-direction: column;">
        <h2 class="med-card-title"><span>📊</span> Esito & Stratificazione</h2>
        
        <div id="placeholderBox" style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 10px;">🩺</div>
          <p>Inserisci i parametri e premi su <strong>Calcola</strong>.</p>
        </div>

        <div id="resultBox" style="display: none;">
          <div class="result-hero">
            <div class="res-label" id="resHeroLabel">Risultato</div>
            <div class="res-val" id="resHeroValue">0</div>
          </div>
          <div id="metricsList" style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px;"></div>
          <div class="clinical-note" id="calcNote" style="margin-top: 18px;"></div>
        </div>
      </section>
    </div>
  </main>

  <script src="script.js"></script>
</body>
</html>`;
}

function generateJS(calc) {
  const readInputs = calc.inputs.map(inp => {
    if (inp.type === "select") {
      return `const ${inp.id} = document.getElementById("${inp.id}").value;`;
    } else {
      return `const ${inp.id} = parseFloat(document.getElementById("${inp.id}").value);`;
    }
  }).join('\n    ');

  return `document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const btnReset = document.getElementById('btnReset');
  const placeholderBox = document.getElementById('placeholderBox');
  const resultBox = document.getElementById('resultBox');
  const resHeroLabel = document.getElementById('resHeroLabel');
  const resHeroValue = document.getElementById('resHeroValue');
  const metricsList = document.getElementById('metricsList');
  const calcNote = document.getElementById('calcNote');

  function compute() {
    ${readInputs}

    function calculate() {
      ${calc.calcLogic.trim()}
    }

    const res = calculate();
    if (!res) return;

    resHeroLabel.textContent = res.mainLabel;
    resHeroValue.textContent = res.mainValue;

    metricsList.innerHTML = '';
    if (res.metrics) {
      res.metrics.forEach(m => {
        const item = document.createElement('div');
        item.style.padding = '10px 14px';
        item.style.background = '#f8fafc';
        item.style.border = '1px solid #e2e8f0';
        item.style.borderRadius = '6px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';

        item.innerHTML = \`
          <span style="font-size: 13px; color: #475569; font-weight: 500;">\${m.label}</span>
          <span style="font-size: 14px; font-weight: 700; color: \${m.color || '#1e293b'}; text-align: right; max-width: 60%;">\${m.val}</span>
        \`;
        metricsList.appendChild(item);
      });
    }

    if (res.note) {
      calcNote.innerHTML = '<strong>Nota Clinica & Bibliografia:</strong><br>' + res.note;
      calcNote.style.display = 'block';
    } else {
      calcNote.style.display = 'none';
    }

    placeholderBox.style.display = 'none';
    resultBox.style.display = 'block';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    compute();
  });

  btnReset.addEventListener('click', () => {
    form.reset();
    resultBox.style.display = 'none';
    placeholderBox.style.display = 'block';
  });

  compute();
});`;
}

function generateCSS() {
  return `.calc-grid-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
}

@media (max-width: 860px) {
  .calc-grid-layout {
    grid-template-columns: 1fr;
  }
}

.result-hero {
  background: linear-gradient(135deg, #eef5fc, #e2effd);
  border: 1px solid #b8dafc;
  border-radius: var(--radius-md);
  padding: 20px;
  text-align: center;
}

.res-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #2b6cb0;
  font-weight: 600;
}

.res-val {
  font-size: 32px;
  font-weight: 800;
  color: var(--primary);
  margin-top: 4px;
}`;
}

// 1. Genera tutte le cartelle e i file dei calcolatori
let generatedCount = 0;
CALCS.forEach(calc => {
  if (calc.skipGeneration) return;

  const targetDir = path.join(calcolatoriDir, calc.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(path.join(targetDir, 'index.html'), generateHTML(calc), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'script.js'), generateJS(calc), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'style.css'), generateCSS(), 'utf8');
  generatedCount++;
});

console.log(`Cartelle e file generati per ${generatedCount} calcolatori!`);

// 2. Genera il catalogo globale completo di tutti i calcolatori
const registryCalculators = CALCS.map(calc => ({
  id: calc.id,
  title: calc.title,
  category: calc.category,
  categoryLabel: calc.categoryLabel,
  description: calc.description,
  path: `../Calcolatori/${calc.folder}/index.html`,
  isReady: true,
  tags: calc.tags
}));

const registryContent = `// Registro Centrale dei Calcolatori Medici
// Catalogo unico per oltre 100 calcolatori clinici.

const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

const CALCULATORS = ${JSON.stringify(registryCalculators, null, 2)};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIES, CALCULATORS };
}
`;

fs.writeFileSync(path.join(__dirname, 'App', 'shared', 'calculators-data.js'), registryContent, 'utf8');
console.log('App/shared/calculators-data.js aggiornato con successo!');
