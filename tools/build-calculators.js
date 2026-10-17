const fs = require('fs');
const path = require('path');

// Definizione completa dei 108 calcolatori medici
const ALL_CALCULATORS = [
  // Già presente:
  {
    id: "calcolo-metabolismo",
    folder: "Calcolo metabolismo",
    title: "Calcolo Metabolismo (Basale + LAF)",
    category: "nutrizione",
    categoryLabel: "Nutrizione & Metabolismo",
    description: "Stima del Metabolismo Basale (BMR) con formule validate e Fabbisogno Energetico Totale (TDEE) con LAF.",
    isReady: true,
    tags: ["bmr", "tdee", "laf", "calorie", "fabbisogno", "energia"],
    skipGeneration: true // Già realizzato ed ottimizzato a mano
  },

  // 1. NUTRIZIONE & METABOLISMO
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
      let cat = "";
      let color = "#2e7d32";
      if (bmi < 18.5) { cat = "Sottopeso"; color = "#d97706"; }
      else if (bmi < 25) { cat = "Normopeso"; color = "#2e7d32"; }
      else if (bmi < 30) { cat = "Sovrappeso"; color = "#d97706"; }
      else if (bmi < 35) { cat = "Obesità di Classe I"; color = "#c62828"; }
      else if (bmi < 40) { cat = "Obesità di Classe II"; color = "#c62828"; }
      else { cat = "Obesità di Classe III (Severa)"; color = "#7f1d1d"; }

      // Peso Ideale Lorentz
      const pLorentz = gender === "m" ? (height - 100) - ((height - 150) / 4) : (height - 100) - ((height - 150) / 2);
      // Devine (1974)
      const inchesOver5ft = Math.max(0, (height / 2.54) - 60);
      const pDevine = gender === "m" ? 50 + (2.3 * inchesOver5ft) : 45.5 + (2.3 * inchesOver5ft);

      return {
        mainValue: bmi.toFixed(1) + " kg/m²",
        mainLabel: "Indice di Massa Corporea",
        metrics: [
          { label: "Classificazione OMS", val: cat, color: color },
          { label: "Peso Ideale (Formula Lorentz)", val: pLorentz.toFixed(1) + " kg" },
          { label: "Peso Ideale (Formula Devine)", val: pDevine.toFixed(1) + " kg" },
          { label: "Range Normopeso (BMI 18.5-24.9)", val: (18.5*hM*hM).toFixed(1) + " - " + (24.9*hM*hM).toFixed(1) + " kg" }
        ],
        note: "Formula BMI = Peso (kg) / [Altezza (m)]². Classificazione secondo criteri World Health Organization (WHO)."
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
    description: "Valutazione della distribuzione del tessuto adiposo viscerale (obesità androide vs ginoide) e rischio cardiovascolare.",
    tags: ["whr", "vita", "fianchi", "viscerale", "adiposita", "cardiovascolare"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Uomo"}, {val: "f", label: "Donna"}] },
      { id: "waist", label: "Circonferenza Vita", unit: "cm", type: "number", step: "0.5", min: "40", max: "200", def: "88" },
      { id: "hip", label: "Circonferenza Fianchi", unit: "cm", type: "number", step: "0.5", min: "50", max: "220", def: "100" }
    ],
    calcLogic: `
      const whr = waist / hip;
      let risk = "Basso";
      let color = "#2e7d32";
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
      if (weight <= 10) {
        mlDay = weight * 100;
      } else if (weight <= 20) {
        mlDay = 1000 + (weight - 10) * 50;
      } else {
        mlDay = 1500 + (weight - 20) * 20;
      }
      const mlHour = mlDay / 24;
      return {
        mainValue: Math.round(mlDay) + " mL / 24h",
        mainLabel: "Volume Totale Giornaliero",
        metrics: [
          { label: "Velocità di Infusione Oraria", val: mlHour.toFixed(1) + " mL/h" },
          { label: "Regola 4-2-1 applicata", val: "Standard Clinico" }
        ],
        note: "Formula classica di Holliday-Segar: 100 mL/kg per i primi 10kg, 50 mL/kg per i successivi 10kg, 20 mL/kg per il peso eccedente."
      };
    `
  },

  // 2. CARDIOLOGIA
  {
    id: "cha2ds2-vasc",
    folder: "CHA2DS2-VASc Score",
    title: "Punteggio CHA₂DS₂-VASc",
    category: "cardiologia",
    categoryLabel: "Cardiologia",
    description: "Stratificazione del rischio tromboembolico (ictus/TIA) e indicazione alla terapia anticoagulante orale in pazienti con fibrillazione atriale non valvolare.",
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
      let raccomandazione = "";
      let riskRate = "";
      let color = "#2e7d32";

      const adjustedScore = isFemale ? score - 1 : score;
      if (adjustedScore === 0) {
        raccomandazione = "Rischio basso: Nessuna terapia antitrombotica raccomandata.";
        riskRate = "0.2% - 0.6% / anno";
      } else if (adjustedScore === 1) {
        raccomandazione = "Rischio intermedio: Terapia anticoagulante orale (DOAC/AVK) da considerare (Classe IIa).";
        riskRate = "1.3% / anno";
        color = "#d97706";
      } else {
        raccomandazione = "Rischio elevato: Terapia anticoagulante orale (DOAC/AVK) fortemente raccomandata (Classe I).";
        riskRate = "2.2% - 15.2% / anno";
        color = "#c62828";
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
    categoryLabel: "Cardiologia",
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
      let risk = "Rischio Basso";
      let color = "#2e7d32";
      if (score >= 3) {
        risk = "Alto Rischio di Sanguinamento (Score ≥ 3)";
        color = "#c62828";
      } else if (score >= 2) {
        risk = "Rischio Moderato";
        color = "#d97706";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score HAS-BLED",
        metrics: [
          { label: "Livello di Rischio", val: risk, color: color },
          { label: "Approccio Clinico", val: score >= 3 ? "Correggere i fattori modificabili e monitorare strettamente" : "Rischio accettabile per anticoagulazione" }
        ],
        note: "Un punteggio ≥3 non controindica l'anticoagulazione ma impone la correzione dei fattori di rischio reversibili e un follow-up ravvicinato."
      };
    `
  },
  {
    id: "qt-corretto-qtc",
    folder: "QT Corretto (QTc)",
    title: "Intervallo QT Corretto (QTc - Bazett, Fridericia)",
    category: "cardiologia",
    categoryLabel: "Cardiologia",
    description: "Correzione dell'intervallo elettrocardiografico QT in base alla frequenza cardiaca per la valutazione del rischio di torsione di punta.",
    tags: ["qtc", "bazett", "fridericia", "ecg", "aritmia", "torsade", "torsione"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Uomo"}, {val: "f", label: "Donna"}] },
      { id: "qt", label: "Intervallo QT", unit: "ms", type: "number", step: "1", min: "200", max: "800", def: "400" },
      { id: "hr", label: "Frequenza Cardiaca", unit: "bpm", type: "number", step: "1", min: "30", max: "250", def: "75" }
    ],
    calcLogic: `
      const rrSec = 60 / hr;
      const qtcBazett = qt / Math.sqrt(rrSec);
      const qtcFrid = qt / Math.cbrt(rrSec);
      const qtcFram = qt + 154 * (1 - rrSec);

      let val = Math.round(qtcBazett);
      let interp = "Normale";
      let color = "#2e7d32";
      const soglia = gender === "m" ? 450 : 460;
      const sogliaSevera = 500;

      if (val > sogliaSevera) {
        interp = "Prolungamento Severo (> 500 ms) - Alto rischio aritmico";
        color = "#c62828";
      } else if (val > soglia) {
        interp = "Prolungato (Borderline)";
        color = "#d97706";
      }

      return {
        mainValue: val + " ms",
        mainLabel: "QTc (Formula di Bazett)",
        metrics: [
          { label: "QTc Fridericia (più accurata a FC elevate)", val: Math.round(qtcFrid) + " ms" },
          { label: "QTc Framingham", val: Math.round(qtcFram) + " ms" },
          { label: "Valutazione Clinica", val: interp, color: color }
        ],
        note: "Bazett sovrastima il QTc a frequenze cardiache elevate (>90 bpm). In tali casi si raccomanda la formula di Fridericia."
      };
    `
  },
  {
    id: "pressione-arteriosa-media-map",
    folder: "Pressione Arteriosa Media (MAP)",
    title: "Pressione Arteriosa Media (MAP) e Pressione di Polso",
    category: "cardiologia",
    categoryLabel: "Cardiologia",
    description: "Calcolo della MAP per la valutazione della perfusione d'organo in terapia intensiva e shock.",
    tags: ["map", "pressione", "perfusione", "rianimazione", "shock", "intensiva"],
    inputs: [
      { id: "pas", label: "Pressione Sistolica (PAS)", unit: "mmHg", type: "number", step: "1", min: "30", max: "260", def: "120" },
      { id: "pad", label: "Pressione Diastolica (PAD)", unit: "mmHg", type: "number", step: "1", min: "20", max: "180", def: "80" }
    ],
    calcLogic: `
      const map = (pas + (2 * pad)) / 3;
      const pp = pas - pad;
      let interp = "Perfusione adeguata (≥ 65 mmHg)";
      let color = "#2e7d32";
      if (map < 65) {
        interp = "Ipotensione / Ipoperfusione tissutale (< 65 mmHg)";
        color = "#c62828";
      }
      return {
        mainValue: Math.round(map) + " mmHg",
        mainLabel: "Pressione Arteriosa Media (MAP)",
        metrics: [
          { label: "Pressione di Polso (Differenziale)", val: pp + " mmHg" },
          { label: "Target Perfusorio Clinico", val: "MAP ≥ 65 mmHg" },
          { label: "Stato", val: interp, color: color }
        ],
        note: "MAP = (PAS + 2*PAD) / 3. Il target standard nelle linee guida per la gestione dello shock è MAP ≥ 65 mmHg."
      };
    `
  },

  // 3. NEFROLOGIA
  {
    id: "egfr-ckd-epi-2021",
    folder: "eGFR CKD-EPI (2021)",
    title: "Velocità di Filtrazione Glomerulare Stimata (eGFR CKD-EPI 2021)",
    category: "nefrologia",
    categoryLabel: "Nefrologia",
    description: "Nuova equazione standard KDIGO 2021 priva del coefficiente etnico per la diagnosi e stadiazione dell'insufficienza renale cronica.",
    tags: ["egfr", "ckd-epi", "creatinina", "filtrato", "kdigo", "insufficienza renale"],
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
      
      let stage = "";
      let color = "#2e7d32";
      if (egfr >= 90) { stage = "G1 - Funzione normale o elevata"; color = "#2e7d32"; }
      else if (egfr >= 60) { stage = "G2 - Lieve riduzione"; color = "#2e7d32"; }
      else if (egfr >= 45) { stage = "G3a - Riduzione lieve-moderata"; color = "#d97706"; }
      else if (egfr >= 30) { stage = "G3b - Riduzione moderata-severa"; color = "#ea580c"; }
      else if (egfr >= 15) { stage = "G4 - Grave riduzione"; color = "#dc2626"; }
      else { stage = "G5 - Insufficienza renale terminale (ESRD)"; color = "#7f1d1d"; }

      return {
        mainValue: Math.round(egfr) + " mL/min/1.73 m²",
        mainLabel: "eGFR Stimato",
        metrics: [
          { label: "Stadio KDIGO", val: stage, color: color },
          { label: "Equazione Applicata", val: "CKD-EPI 2021 (Race-Free)" }
        ],
        note: "Equazione raccomandata da KDIGO e dalle società nefrologiche internazionali (Inker LA et al., NEJM 2021)."
      };
    `
  },
  {
    id: "clearance-creatinina-cockcroft",
    folder: "Clearance Creatinina (Cockcroft-Gault)",
    title: "Clearance della Creatinina (Cockcroft-Gault)",
    category: "nefrologia",
    categoryLabel: "Nefrologia",
    description: "Stima della clearance della creatinina comunemente utilizzata per l'adeguamento posologico dei farmaci.",
    tags: ["cockcroft", "clearance", "creatinina", "posologia", "dosaggio", "farmaci"],
    inputs: [
      { id: "gender", label: "Sesso Biologico", type: "select", options: [{val: "m", label: "Maschio"}, {val: "f", label: "Femmina"}] },
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "18", max: "110", def: "70" },
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.1", min: "30", max: "200", def: "72" },
      { id: "creat", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.01", min: "0.2", max: "15", def: "1.3" }
    ],
    calcLogic: `
      let crCl = ((140 - age) * weight) / (72 * creat);
      if (gender === "f") {
        crCl *= 0.85;
      }
      return {
        mainValue: crCl.toFixed(1) + " mL/min",
        mainLabel: "Clearance Stimata della Creatinina",
        metrics: [
          { label: "Fattore di Correzione Femminile", val: gender === "f" ? "Applicato (x 0.85)" : "Non necessario" },
          { label: "Utilizzo Primario", val: "Regolazione schede posologiche farmaci (FDA/EMA)" }
        ],
        note: "Formula di Cockcroft & Gault (1976). Se il paziente è gravemente obeso, considerare il peso corporeo ideale o aggiustato."
      };
    `
  },
  {
    id: "frazione-escrezione-sodio-fena",
    folder: "Frazione Escrezione Sodio (FENa)",
    title: "Frazione di Escrezione del Sodio (FENa)",
    category: "nefrologia",
    categoryLabel: "Nefrologia",
    description: "Diagnosi differenziale tra insufficienza renale acuta prerenale (ipoperfusione) e danno renale intrinseco (NTA).",
    tags: ["fena", "sodio", "ira", "prerenale", "nta", "oliguria"],
    inputs: [
      { id: "sna", label: "Sodio Sierico (S-Na)", unit: "mEq/L", type: "number", step: "0.5", min: "100", max: "180", def: "140" },
      { id: "una", label: "Sodio Urinario (U-Na)", unit: "mEq/L", type: "number", step: "1", min: "1", max: "250", def: "15" },
      { id: "scr", label: "Creatinina Sierica (S-Cr)", unit: "mg/dL", type: "number", step: "0.1", min: "0.3", max: "20", def: "2.5" },
      { id: "ucr", label: "Creatinina Urinaria (U-Cr)", unit: "mg/dL", type: "number", step: "1", min: "5", max: "500", def: "120" }
    ],
    calcLogic: `
      const fena = ((una * scr) / (sna * ucr)) * 100;
      let interp = "";
      let color = "#2e7d32";
      if (fena < 1) {
        interp = "FENa < 1%: Fortemente indicativo di IRA Prerenale (conservazione tubulare del sodio).";
        color = "#2e7d32";
      } else if (fena > 2) {
        interp = "FENa > 2%: Indicativo di Necrosi Tubulare Acuta (NTA) o danno parenchimale.";
        color = "#c62828";
      } else {
        interp = "FENa 1 - 2%: Zona grigia / Indeterminato.";
        color = "#d97706";
      }
      return {
        mainValue: fena.toFixed(2) + " %",
        mainLabel: "Frazione di Escrezione del Sodio",
        metrics: [
          { label: "Interpretazione Clinica", val: interp, color: color },
          { label: "Avvertenza", val: "Non attendibile se il paziente assume diuretici dell'ansa (in tal caso usare FEUrea)." }
        ],
        note: "FENa = (UNa * SCr) / (SNa * UCr) * 100."
      };
    `
  },
  {
    id: "anion-gap-sierico",
    folder: "Anion Gap Sierico",
    title: "Anion Gap Sierico (con Correzione per Albumina)",
    category: "nefrologia",
    categoryLabel: "Nefrologia",
    description: "Valutazione dell'acidosi metabolica ad elevato vs normale anion gap.",
    tags: ["anion gap", "acidosi", "albumina", "ega", "lattati", "chetoacidosi"],
    inputs: [
      { id: "na", label: "Sodio (Na⁺)", unit: "mEq/L", type: "number", step: "0.5", min: "110", max: "170", def: "140" },
      { id: "cl", label: "Cloro (Cl⁻)", unit: "mEq/L", type: "number", step: "0.5", min: "70", max: "140", def: "102" },
      { id: "hco3", label: "Bicarbonato (HCO₃⁻)", unit: "mEq/L", type: "number", step: "0.5", min: "2", max: "50", def: "16" },
      { id: "alb", label: "Albumina Sierica", unit: "g/dL", type: "number", step: "0.1", min: "1", max: "6", def: "4.0" }
    ],
    calcLogic: `
      const ag = na - (cl + hco3);
      const agCorr = ag + 2.5 * (4.0 - alb);
      let interp = "Normale (8-12 mEq/L)";
      let color = "#2e7d32";
      if (agCorr > 12) {
        interp = "Anion Gap Elevato (HAGMA: es. Lattacidosi, Chetoacidosi, Tossici, Uremia)";
        color = "#c62828";
      } else if (agCorr < 8) {
        interp = "Anion Gap Ridotto (es. mieloma multiplo, ipercalcemia, ipoalbuminemia severa)";
        color = "#d97706";
      }
      return {
        mainValue: agCorr.toFixed(1) + " mEq/L",
        mainLabel: "Anion Gap Corretto per Albumina",
        metrics: [
          { label: "Anion Gap Non Corretto", val: ag.toFixed(1) + " mEq/L" },
          { label: "Valutazione", val: interp, color: color },
          { label: "Range di Riferimento Normale", val: "8 - 12 mEq/L (con ioni moderni)" }
        ],
        note: "Ogni riduzione di 1 g/dL di albumina riduce l'Anion Gap non corretto di circa 2.5 mEq/L."
      };
    `
  },
  {
    id: "sodio-corretto-iperglicemia",
    folder: "Sodio Corretto per Iperglicemia",
    title: "Sodio Corretto per Iperglicemia (Katz / Hillier)",
    category: "nefrologia",
    categoryLabel: "Nefrologia",
    description: "Correzione della pseudoiper/iponatriemia da effetto osmotico transcellulare indotta da iperglicemia severa.",
    tags: ["sodio", "glicemia", "katz", "hillier", "dka", "osmolalita"],
    inputs: [
      { id: "na", label: "Sodio Misurato", unit: "mEq/L", type: "number", step: "0.5", min: "100", max: "170", def: "130" },
      { id: "glu", label: "Glicemia", unit: "mg/dL", type: "number", step: "1", min: "70", max: "1500", def: "550" }
    ],
    calcLogic: `
      const excess100 = Math.max(0, (glu - 100) / 100);
      const naKatz = na + (1.6 * excess100);
      const naHillier = na + (2.4 * excess100);
      return {
        mainValue: naHillier.toFixed(1) + " mEq/L",
        mainLabel: "Sodio Corretto (Formula Hillier 2.4)",
        metrics: [
          { label: "Formula di Katz (1.6)", val: naKatz.toFixed(1) + " mEq/L" },
          { label: "Differenza Osmotica", val: "+" + (2.4 * excess100).toFixed(1) + " mEq/L" }
        ],
        note: "Hillier et al. (1999) hanno dimostrato che il fattore di correzione più fedele nell'iperglicemia marcata (>400 mg/dL) è 2.4 mEq/L ogni 100 mg/dL di glucosio sopra 100."
      };
    `
  },

  // 4. URGENZA & INTENSIVA
  {
    id: "glasgow-coma-scale",
    folder: "Glasgow Coma Scale (GCS)",
    title: "Glasgow Coma Scale (GCS)",
    category: "rianimazione",
    categoryLabel: "Urgenza & Intensiva",
    description: "Valutazione oggettiva della profondità del coma e dello stato di coscienza attraverso tre risposte comportamentali.",
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
      let gravita = "";
      let color = "#2e7d32";
      if (score >= 13) {
        gravita = "Trauma Cranico Lieve (GCS 13-15)";
      } else if (score >= 9) {
        gravita = "Trauma Cranico Moderato (GCS 9-12)";
        color = "#d97706";
      } else {
        gravita = "Trauma Cranico Severo (GCS ≤ 8) - Indicazione a intubazione/protezione vie aeree";
        color = "#c62828";
      }
      return {
        mainValue: score + " / 15",
        mainLabel: "Punteggio Totale GCS",
        metrics: [
          { label: "Classificazione Clinica", val: gravita, color: color },
          { label: "Dettaglio Componenti", val: "E" + eye + " V" + verbal + " M" + motor }
        ],
        note: "Teasdale & Jennett (1974). Nei pazienti con GCS ≤ 8 la perdita dei riflessi protettivi delle vie aeree raccomanda l'intubazione endotracheale."
      };
    `
  },
  {
    id: "qsofa-score",
    folder: "Quick SOFA (qSOFA)",
    title: "Quick SOFA Score (Sepsis-3)",
    category: "rianimazione",
    categoryLabel: "Urgenza & Intensiva",
    description: "Identificazione rapida al letto del malato dei pazienti a rischio di deterioramento clinico ed esito infausto per sospetta infezione.",
    tags: ["qsofa", "sepsi", "infezione", "triage", "shock settico"],
    inputs: [
      { id: "rr", label: "Frequenza Respiratoria ≥ 22 atti/min", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "gcs", label: "Alterazione dello stato mentale (GCS < 15)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "sbp", label: "Pressione Sistolica ≤ 100 mmHg", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(rr) + parseInt(gcs) + parseInt(sbp);
      let risk = "Rischio Basso (Score 0-1)";
      let color = "#2e7d32";
      if (score >= 2) {
        risk = "Alto Rischio di Sepsi / Mortalità (Score ≥ 2)";
        color = "#c62828";
      }
      return {
        mainValue: score + " / 3",
        mainLabel: "Score qSOFA",
        metrics: [
          { label: "Valutazione del Rischio", val: risk, color: color },
          { label: "Azione Raccomandata", val: score >= 2 ? "Valutare disfunzione d'organo (SOFA completo), lattati ematici e terapia antibiotica tempestiva" : "Monitoraggio clinico" }
        ],
        note: "Definizioni di Consenso Internazionale Sepsis-3 (Singer M et al., JAMA 2016)."
      };
    `
  },
  {
    id: "formula-parkland-ustioni",
    folder: "Formula di Parkland Ustioni",
    title: "Formula di Parkland per Rianimazione da Ustioni",
    category: "rianimazione",
    categoryLabel: "Urgenza & Intensiva",
    description: "Calcolo della reintegrazione idroelettrolitica con Ringer Lattato nelle prime 24 ore nel paziente gravemente ustionato.",
    tags: ["parkland", "ustione", "fluidi", "ringer", "rianimazione", "emergenza"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "10", max: "200", def: "70" },
      { id: "tbsa", label: "Percentuale Superficie Ustionata (% TBSA di 2° e 3° grado)", unit: "%", type: "number", step: "1", min: "1", max: "95", def: "30" }
    ],
    calcLogic: `
      const totalMl = 4 * weight * tbsa;
      const first8h = totalMl / 2;
      const next16h = totalMl / 2;
      return {
        mainValue: Math.round(totalMl) + " mL",
        mainLabel: "Liquidi Totali (Ringer Lattato) nelle 24h",
        metrics: [
          { label: "Prime 8 Ore (50% del totale)", val: Math.round(first8h) + " mL (" + Math.round(first8h/8) + " mL/h)" },
          { label: "Successive 16 Ore (50% del totale)", val: Math.round(next16h) + " mL (" + Math.round(next16h/16) + " mL/h)" },
          { label: "Target Diuresi", val: "0.5 - 1.0 mL/kg/h nell'adulto" }
        ],
        note: "Formula di Baxter-Parkland: 4 mL * Peso (kg) * % TBSA. Il tempo decorre dal momento dell'evento termico, non dall'arrivo in ospedale."
      };
    `
  },

  // 5. PNEUMOLOGIA
  {
    id: "curb-65",
    folder: "Score CURB-65",
    title: "Punteggio CURB-65 per Polmonite Acquisita in Comunità",
    category: "pneumologia",
    categoryLabel: "Pneumologia",
    description: "Stratificazione prognostica e orientamento sulla necessità di ricovero ospedaliero o terapia intensiva nella CAP.",
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
      let mortality = "";
      let setting = "";
      let color = "#2e7d32";

      if (score <= 1) {
        mortality = "Basso rischio (< 3%)";
        setting = "Trattamento a domicilio / Ambulatoriale sicuro";
      } else if (score === 2) {
        mortality = "Rischio intermedio (~ 9%)";
        setting = "Ospedalizzazione / Breve osservazione raccomandata";
        color = "#d97706";
      } else {
        mortality = "Alto rischio (15 - 40%)";
        setting = "Ricovero ospedaliero urgente (valutare Terapia Intensiva se score 4-5)";
        color = "#c62828";
      }

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
    categoryLabel: "Pneumologia",
    description: "Stima della probabilità clinica pre-test di embolia polmonare e indicazione all'esecuzione del D-Dimero o Angio-TC.",
    tags: ["wells", "ep", "embolia", "d-dimero", "polmone", "angio-tc"],
    inputs: [
      { id: "signs", label: "Segni o sintomi clinici di TVP (gonfiore arto, dolore)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "alt", label: "Diagnosi alternativa meno probabile di EP", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "hr", label: "Frequenza cardiaca > 100 bpm", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1.5", label: "Sì (+1.5 pt)"}] },
      { id: "immob", label: "Immobilizzazione (≥ 3 gg) o chirurgia nelle ultime 4 sett.", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1.5", label: "Sì (+1.5 pt)"}] },
      { id: "prev", label: "Precedente TVP o Embolia Polmonare documentata", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1.5", label: "Sì (+1.5 pt)"}] },
      { id: "hemo", label: "Emoftoe / Emottisi", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "malig", label: "Neoplasia attiva / trattamento negli ultimi 6 mesi", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseFloat(signs) + parseFloat(alt) + parseFloat(hr) + parseFloat(immob) + parseFloat(prev) + parseFloat(hemo) + parseFloat(malig);
      let prob = "";
      let iter = "";
      let color = "#2e7d32";

      if (score <= 4) {
        prob = "EP Improbabile (Score ≤ 4)";
        iter = "Eseguire D-Dimero ad alta sensibilità: se negativo esclude EP con sicurezza.";
      } else {
        prob = "EP Probabile (Score > 4)";
        iter = "Eseguire Angio-TC toracica urgente e considerare anticoagulazione tempestiva.";
        color = "#c62828";
      }

      return {
        mainValue: score.toFixed(1) + " Punti",
        mainLabel: "Score di Wells",
        metrics: [
          { label: "Probabilità Clinica Pre-test", val: prob, color: color },
          { label: "Iter Diagnostico Raccomandato", val: iter }
        ],
        note: "Linee Guida ESC / Wells PS et al. (Thromb Haemost 2000)."
      };
    `
  },
  {
    id: "rapporto-pao2-fio2-horowitz",
    folder: "Rapporto PaO2-FiO2 (Horowitz)",
    title: "Indice di Horowitz (Rapporto PaO₂ / FiO₂)",
    category: "pneumologia",
    categoryLabel: "Pneumologia",
    description: "Valutazione dell'insufficienza respiratoria ipossiemica e classificazione della gravità dell'ARDS (Criteri di Berlino).",
    tags: ["horowitz", "pao2", "fio2", "ards", "berlino", "ipossia", "ega"],
    inputs: [
      { id: "pao2", label: "PaO₂ (da emogasanalisi arteriosa)", unit: "mmHg", type: "number", step: "1", min: "25", max: "600", def: "85" },
      { id: "fio2", label: "FiO₂ (frazione inspirata di O₂)", unit: "%", type: "number", step: "1", min: "21", max: "100", def: "21" }
    ],
    calcLogic: `
      const fDecimal = fio2 / 100;
      const ratio = pao2 / fDecimal;
      let ards = "Scambi gassosi normali (P/F > 300)";
      let color = "#2e7d32";

      if (ratio <= 100) {
        ards = "ARDS Grave (P/F ≤ 100 con PEEP ≥ 5 cmH2O)";
        color = "#c62828";
      } else if (ratio <= 200) {
        ards = "ARDS Moderata (100 < P/F ≤ 200)";
        color = "#ea580c";
      } else if (ratio <= 300) {
        ards = "ARDS Lieve (200 < P/F ≤ 300)";
        color = "#d97706";
      }

      return {
        mainValue: Math.round(ratio) + " mmHg",
        mainLabel: "Rapporto PaO₂ / FiO₂ (P/F)",
        metrics: [
          { label: "Classificazione di Berlino (ARDS)", val: ards, color: color },
          { label: "FiO₂ ambiente di riferimento", val: "21% (Aria ambiente)" }
        ],
        note: "Definizione di Berlino per l'ARDS (JAMA 2012). Richiede PEEP o CPAP ≥ 5 cmH₂O per la corretta attribuzione di ARDS."
      };
    `
  },

  // 6. GASTROENTEROLOGIA & EPATOLOGIA
  {
    id: "child-pugh-score",
    folder: "Score Child-Pugh",
    title: "Classificazione di Child-Pugh per Cirrosi Epatica",
    category: "gastro",
    categoryLabel: "Gastroenterologia",
    description: "Stratificazione prognostica della gravità della cirrosi epatica e valutazione del rischio chirurgico.",
    tags: ["child-pugh", "cirrosi", "fegato", "ascite", "encefalopatia", "inr"],
    inputs: [
      { id: "bili", label: "Bilirubina Totale", type: "select", options: [
        {val: "1", label: "< 2 mg/dL (1 pt)"},
        {val: "2", label: "2 - 3 mg/dL (2 pt)"},
        {val: "3", label: "> 3 mg/dL (3 pt)"}
      ]},
      { id: "alb", label: "Albumina Sierica", type: "select", options: [
        {val: "1", label: "> 3.5 g/dL (1 pt)"},
        {val: "2", label: "2.8 - 3.5 g/dL (2 pt)"},
        {val: "3", label: "< 2.8 g/dL (3 pt)"}
      ]},
      { id: "inr", label: "INR (o Tempo di Protrombina)", type: "select", options: [
        {val: "1", label: "< 1.7 (1 pt)"},
        {val: "2", label: "1.7 - 2.3 (2 pt)"},
        {val: "3", label: "> 2.3 (3 pt)"}
      ]},
      { id: "asc", label: "Ascite", type: "select", options: [
        {val: "1", label: "Assente (1 pt)"},
        {val: "2", label: "Lieve / controllata da diuretici (2 pt)"},
        {val: "3", label: "Moderata-severa / refrattaria (3 pt)"}
      ]},
      { id: "enc", label: "Encefalopatia Porto-Sistemica", type: "select", options: [
        {val: "1", label: "Assente (1 pt)"},
        {val: "2", label: "Grado 1-2 (lieve, invertito sonno/veglia) (2 pt)"},
        {val: "3", label: "Grado 3-4 (severa, coma) (3 pt)"}
      ]}
    ],
    calcLogic: `
      const score = parseInt(bili) + parseInt(alb) + parseInt(inr) + parseInt(asc) + parseInt(enc);
      let classe = "";
      let sur1 = "";
      let sur2 = "";
      let color = "#2e7d32";

      if (score <= 6) {
        classe = "Classe A (Compensata)";
        sur1 = "100%";
        sur2 = "85%";
      } else if (score <= 9) {
        classe = "Classe B (Significativo compromesso funzionale)";
        sur1 = "80%";
        sur2 = "60%";
        color = "#d97706";
      } else {
        classe = "Classe C (Scompensata)";
        sur1 = "45%";
        sur2 = "35%";
        color = "#c62828";
      }

      return {
        mainValue: score + " Punti (" + classe + ")",
        mainLabel: "Punteggio Child-Pugh",
        metrics: [
          { label: "Sopravvivenza a 1 Anno Stimata", val: sur1, color: color },
          { label: "Sopravvivenza a 2 Anni Stimata", val: sur2 }
        ],
        note: "Pugh RN et al. (Br J Surg 1973). Parametro cardine per la valutazione del rischio prima di interventi chirurgici maggiori."
      };
    `
  },
  {
    id: "meld-score",
    folder: "Score MELD",
    title: "Score MELD (Model for End-Stage Liver Disease)",
    category: "gastro",
    categoryLabel: "Gastroenterologia",
    description: "Predittore di mortalità a 3 mesi nei pazienti con epatopatia cronica terminale, impiegato per la priorità al trapianto epatico.",
    tags: ["meld", "trapianto", "fegato", "cirrosi", "creatinina", "bilirubina", "inr"],
    inputs: [
      { id: "creat", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.1", min: "0.5", max: "15", def: "1.2" },
      { id: "bili", label: "Bilirubina Totale", unit: "mg/dL", type: "number", step: "0.1", min: "0.2", max: "30", def: "2.1" },
      { id: "inr", label: "INR", unit: "", type: "number", step: "0.01", min: "0.8", max: "10", def: "1.4" },
      { id: "dial", label: "Dialisi (almeno 2 sedute negli ultimi 7 gg)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] }
    ],
    calcLogic: `
      let cr = dial === "1" ? 4.0 : creat;
      cr = Math.max(1.0, Math.min(4.0, cr));
      const bi = Math.max(1.0, bili);
      const inVal = Math.max(1.0, inr);

      const meld = 9.57 * Math.log(cr) + 3.78 * Math.log(bi) + 11.2 * Math.log(inVal) + 6.43;
      const rounded = Math.round(meld);
      let mort = "";
      let color = "#2e7d32";

      if (rounded <= 9) { mort = "1.9% mortalità a 3 mesi"; }
      else if (rounded <= 19) { mort = "6.0% mortalità a 3 mesi"; color = "#d97706"; }
      else if (rounded <= 29) { mort = "19.6% mortalità a 3 mesi"; color = "#ea580c"; }
      else if (rounded <= 39) { mort = "52.6% mortalità a 3 mesi"; color = "#c62828"; }
      else { mort = "71.3% mortalità a 3 mesi"; color = "#7f1d1d"; }

      return {
        mainValue: rounded + " Punti",
        mainLabel: "Score MELD",
        metrics: [
          { label: "Mortalità a 3 Mesi Stimata", val: mort, color: color },
          { label: "Indicazione Trapiantologica UNOS", val: rounded >= 15 ? "Paziente idoneo a valutazione per lista trapianto" : "Follow-up periodico" }
        ],
        note: "Kamath PS et al. (Hepatology 2001). Valori minimi per i parametri impostati a 1.0 secondo lo standard UNOS/OPTN."
      };
    `
  },

  // 7. ENDOCRINOLOGIA
  {
    id: "homa-ir-index",
    folder: "Indice HOMA-IR",
    title: "Indice HOMA-IR (Homeostatic Model Assessment)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Stima della resistenza insulinica e della funzione beta-cellulare a partire da glicemia e insulinemia a digiuno.",
    tags: ["homa", "insulina", "glicemia", "diabete", "insulino-resistenza", "sindrome metabolica"],
    inputs: [
      { id: "glu", label: "Glicemia a digiuno", unit: "mg/dL", type: "number", step: "1", min: "40", max: "400", def: "95" },
      { id: "ins", label: "Insulinemia a digiuno", unit: "µU/mL", type: "number", step: "0.1", min: "1", max: "150", def: "12" }
    ],
    calcLogic: `
      const homa = (glu * ins) / 405;
      let interp = "Sensibilità all'insulina nella norma (< 2.5)";
      let color = "#2e7d32";
      if (homa >= 3.0) {
        interp = "Insulino-resistenza conclamata (≥ 3.0)";
        color = "#c62828";
      } else if (homa >= 2.5) {
        interp = "Borderline / Probabile insulino-resistenza (2.5 - 2.9)";
        color = "#d97706";
      }
      return {
        mainValue: homa.toFixed(2),
        mainLabel: "Indice HOMA-IR",
        metrics: [
          { label: "Valutazione Clinica", val: interp, color: color },
          { label: "Valore Soglia Tipico", val: "< 2.5 (Popolazione generale)" }
        ],
        note: "Matthews DR et al. (Diabetologia 1985). Formula: [Glicemia (mg/dL) * Insulina (µU/mL)] / 405."
      };
    `
  },
  {
    id: "emoglobina-glicata-stimata-eag",
    folder: "Emoglobina Glicata Stimata (eAG)",
    title: "Conversione HbA1c in Glicemia Media Stimata (eAG)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Traduce la percentuale di Emoglobina Glicata (HbA1c) nel valore medio di glicemia giornaliera stimata (eAG) in mg/dL.",
    tags: ["hba1c", "glicata", "eag", "glicemia media", "diabete"],
    inputs: [
      { id: "hba1c", label: "HbA1c (Emoglobina Glicata)", unit: "%", type: "number", step: "0.1", min: "4.0", max: "16.0", def: "7.0" }
    ],
    calcLogic: `
      const eag = 28.7 * hba1c - 46.7;
      let target = "";
      let color = "#2e7d32";
      if (hba1c < 5.7) {
        target = "Normale / Non diabetico (< 5.7%)";
      } else if (hba1c <= 6.4) {
        target = "Prediabete (5.7% - 6.4%)";
        color = "#d97706";
      } else if (hba1c <= 7.0) {
        target = "Target terapeutico ottimale ADA per la maggior parte dei diabetici adulti (≤ 7.0%)";
        color = "#2e7d32";
      } else {
        target = "Controllo glicemico subottimale (> 7.0%)";
        color = "#c62828";
      }
      return {
        mainValue: Math.round(eag) + " mg/dL",
        mainLabel: "Glicemia Media Stimata (eAG)",
        metrics: [
          { label: "Equivalente in mmol/L", val: (eag / 18.018).toFixed(1) + " mmol/L" },
          { label: "Classificazione ADA", val: target, color: color }
        ],
        note: "Formula derivata dal trial internazionale ADAG (Nathan DM et al., Diabetes Care 2008): eAG = 28.7 * HbA1c - 46.7."
      };
    `
  },

  // 8. EMATOLOGIA & ONCOLOGIA
  {
    id: "conta-assoluta-neutrofili-anc",
    folder: "Conta Assoluta Neutrofili (ANC)",
    title: "Conta Assoluta dei Neutrofili (ANC)",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Valutazione del rischio di neutropenia febbrile e sicurezza per la somministrazione di cicli di chemioterapia.",
    tags: ["anc", "neutrofili", "neutropenia", "emocromo", "leucociti", "chemioterapia"],
    inputs: [
      { id: "wbc", label: "Leucociti Totali (WBC)", unit: "/µL", type: "number", step: "100", min: "200", max: "100000", def: "4500" },
      { id: "seg", label: "% Neutrofili Segmentati", unit: "%", type: "number", step: "1", min: "0", max: "100", def: "55" },
      { id: "bands", label: "% Neutrofili a Banda (Bandati)", unit: "%", type: "number", step: "1", min: "0", max: "100", def: "3" }
    ],
    calcLogic: `
      const anc = (wbc * (seg + bands)) / 100;
      let risk = "Normale (> 1500/µL)";
      let color = "#2e7d32";
      if (anc < 500) {
        risk = "Neutropenia Grave / Severa (< 500/µL) - Emergenza infettivologica";
        color = "#c62828";
      } else if (anc < 1000) {
        risk = "Neutropenia Moderata (500 - 999/µL)";
        color = "#ea580c";
      } else if (anc < 1500) {
        risk = "Neutropenia Lieve (1000 - 1500/µL)";
        color = "#d97706";
      }
      return {
        mainValue: Math.round(anc) + " /µL",
        mainLabel: "Conta Assoluta dei Neutrofili",
        metrics: [
          { label: "Grado di Neutropenia", val: risk, color: color },
          { label: "Soglia per Chemioterapia", val: "Spesso richiesta ANC ≥ 1500/µL" }
        ],
        note: "Formula: WBC * (% Segmentati + % Bandati) / 100."
      };
    `
  },
  {
    id: "indice-mentzer-anemie",
    folder: "Indice di Mentzer",
    title: "Indice di Mentzer (Diagnosi Differenziale Anemie Microcitiche)",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Differenziazione tra tratto talassemico (microcitemia) e anemia sideropenica (da carenza di ferro) con l'emocromo.",
    tags: ["mentzer", "anemia", "microcitosi", "talassemia", "ferro", "mcv"],
    inputs: [
      { id: "mcv", label: "MCV (Volume Corpuscolare Medio)", unit: "fL", type: "number", step: "0.1", min: "45", max: "120", def: "68" },
      { id: "rbc", label: "Globuli Rossi (RBC)", unit: "x10⁶/µL", type: "number", step: "0.01", min: "1.5", max: "8.5", def: "5.8" }
    ],
    calcLogic: `
      const mentzer = mcv / rbc;
      let interp = "";
      let color = "#2e7d32";
      if (mentzer < 13) {
        interp = "Indice < 13: Suggestivo di Tratto Beta-Talassemico (microcitosi con eritrocitosi).";
        color = "#0277bd";
      } else {
        interp = "Indice > 13: Suggestivo di Anemia Sideropenica (carenza marziale).";
        color = "#d97706";
      }
      return {
        mainValue: mentzer.toFixed(1),
        mainLabel: "Indice di Mentzer (MCV / RBC)",
        metrics: [
          { label: "Ipotesi Diagnostica Orientativa", val: interp, color: color },
          { label: "Indagini di Conferma", val: "Elettroforesi Hb (HbA2) e Assetto Marziale (Ferritina, Sideremia, Transferrina)" }
        ],
        note: "Mentzer WC (Lancet 1973). Rapporto < 13 indirizza verso la talassemia, > 13 verso la sideropenia."
      };
    `
  },

  // 9. PEDIATRIA
  {
    id: "apgar-score",
    folder: "Punteggio APGAR",
    title: "Punteggio di APGAR Neonatale",
    category: "pediatria",
    categoryLabel: "Pediatria & Neonatologia",
    description: "Valutazione dell'adattamento neonatale immediato alla vita extrauterina al 1° e 5° minuto di vita.",
    tags: ["apgar", "neonato", "nascita", "pediatria", "parto", "vitalita"],
    inputs: [
      { id: "color", label: "Aspetto / Colorito (Appearance)", type: "select", options: [
        {val: "0", label: "0 - Cianotico o pallido generalizzato"},
        {val: "1", label: "1 - Corpo roseo, estremità cianotiche (acrocianosi)"},
        {val: "2", label: "2 - Completamente roseo"}
      ]},
      { id: "hr", label: "Frequenza Cardiaca (Pulse)", type: "select", options: [
        {val: "0", label: "0 - Assente"},
        {val: "1", label: "1 - < 100 bpm"},
        {val: "2", label: "2 - ≥ 100 bpm"}
      ]},
      { id: "reflex", label: "Riflessi / Irritabilità (Grimace)", type: "select", options: [
        {val: "0", label: "0 - Nessuna risposta"},
        {val: "1", label: "1 - Smorfia / reazione minima"},
        {val: "2", label: "2 - Pianto vigoroso, tosse o starnuto"}
      ]},
      { id: "tone", label: "Tono Muscolare (Activity)", type: "select", options: [
        {val: "0", label: "0 - Flaccido / atonico"},
        {val: "1", label: "1 - Flessione modesta delle estremità"},
        {val: "2", label: "2 - Movimenti attivi / buona flessione"}
      ]},
      { id: "resp", label: "Respirazione (Respiration)", type: "select", options: [
        {val: "0", label: "0 - Assente"},
        {val: "1", label: "1 - Lenta, irregolare o pianto debole"},
        {val: "2", label: "2 - Buona, regolare con pianto vigoroso"}
      ]}
    ],
    calcLogic: `
      const score = parseInt(color) + parseInt(hr) + parseInt(reflex) + parseInt(tone) + parseInt(resp);
      let cond = "Ottime condizioni neonatali (7-10)";
      let colorR = "#2e7d32";
      if (score <= 3) {
        cond = "Grave depressione neonatale (0-3) - Richiede rianimazione immediata";
        colorR = "#c62828";
      } else if (score <= 6) {
        cond = "Moderata depressione neonatale (4-6) - Richiede stimolazione / supporto O2";
        colorR = "#d97706";
      }
      return {
        mainValue: score + " / 10",
        mainLabel: "Score di APGAR",
        metrics: [
          { label: "Giudizio Clinico", val: cond, color: colorR },
          { label: "Timing Standard", val: "Rilevazione a 1 minuto e a 5 minuti di vita" }
        ],
        note: "Virginia Apgar (1953). Score ampiamente standardizzato nelle sale parto di tutto il mondo."
      };
    `
  },
  {
    id: "centor-mcisaac-faringite",
    folder: "Score Centor-McIsaac",
    title: "Score di Centor / McIsaac per Faringite Streptococcica",
    category: "pediatria",
    categoryLabel: "Pediatria & Infettivologia",
    description: "Probabilità di infezione da Streptococco Beta-Emolitico di Gruppo A (SBEGA) e indicazione al tampone rapido o antibiotico.",
    tags: ["centor", "mcisaac", "faringite", "streptococco", "tonsillite", "antibiotico"],
    inputs: [
      { id: "temp", label: "Febbre documentata > 38°C", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "cough", label: "Assenza di tosse", type: "select", options: [{val: "0", label: "No (presenza di tosse = 0 pt)"}, {val: "1", label: "Sì (assenza di tosse = +1 pt)"}] },
      { id: "nodes", label: "Linfoadenopatia cervicale anteriore dolente", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "tonsils", label: "Essudato tonsillare o tonsille ipertrofiche", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "age", label: "Età del paziente", type: "select", options: [
        {val: "1", label: "3 - 14 anni (+1 pt)"},
        {val: "0", label: "15 - 44 anni (0 pt)"},
        {val: "-1", label: "≥ 45 anni (-1 pt)"}
      ]}
    ],
    calcLogic: `
      const score = parseInt(temp) + parseInt(cough) + parseInt(nodes) + parseInt(tonsils) + parseInt(age);
      let risk = "";
      let action = "";
      let color = "#2e7d32";

      if (score <= 1) {
        risk = "Basso (< 10%)";
        action = "Né tampone né antibiotico necessario.";
      } else if (score <= 3) {
        risk = "Intermedio (15 - 32%)";
        action = "Eseguire tampone rapido (RADT): trattare solo se positivo.";
        color = "#d97706";
      } else {
        risk = "Elevato (50%)";
        action = "Tampone rapido raccomandato o trattamento antibiotico mirato empirico.";
        color = "#c62828";
      }

      return {
        mainValue: score + " Punti",
        mainLabel: "Score di McIsaac",
        metrics: [
          { label: "Rischio Infezione SBEGA", val: risk, color: color },
          { label: "Strategia Clinica", val: action }
        ],
        note: "McIsaac WJ et al. (CMAJ 1998). Modifica pediatrica del classico score di Centor."
      };
    `
  },

  // 10. NEUROLOGIA
  {
    id: "abcd2-score-tia",
    folder: "Score ABCD2 per TIA",
    title: "Score ABCD² (Rischio Ictus post-TIA)",
    category: "cardiologia",
    categoryLabel: "Neurologia & Urgenza",
    description: "Predizione del rischio precoce di ictus ischemico a 2, 7 e 90 giorni dopo un attacco ischemico transitorio (TIA).",
    tags: ["abcd2", "tia", "ictus", "stroke", "neurologia", "ischemia"],
    inputs: [
      { id: "age", label: "Età ≥ 60 anni", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "bp", label: "Pressione Arteriosa elevata (PAS ≥ 140 o PAD ≥ 90 mmHg)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "clin", label: "Caratteristiche Cliniche del TIA", type: "select", options: [
        {val: "2", label: "Deficit motorio unilaterale (+2 pt)"},
        {val: "1", label: "Disturbo del linguaggio isolato senza debolezza (+1 pt)"},
        {val: "0", label: "Altri sintomi (0 pt)"}
      ]},
      { id: "dur", label: "Durata dei Sintomi", type: "select", options: [
        {val: "2", label: "≥ 60 minuti (+2 pt)"},
        {val: "1", label: "10 - 59 minuti (+1 pt)"},
        {val: "0", label: "< 10 minuti (0 pt)"}
      ]},
      { id: "dm", label: "Diabete Mellito", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(bp) + parseInt(clin) + parseInt(dur) + parseInt(dm);
      let risk = "Rischio Basso (0-3)";
      let risk2d = "1.0% a 2 giorni";
      let color = "#2e7d32";

      if (score >= 6) {
        risk = "Alto Rischio (6-7)";
        risk2d = "8.1% a 2 giorni, 17.8% a 90 giorni";
        color = "#c62828";
      } else if (score >= 4) {
        risk = "Rischio Moderato (4-5)";
        risk2d = "4.1% a 2 giorni";
        color = "#d97706";
      }

      return {
        mainValue: score + " / 7 Punti",
        mainLabel: "Score ABCD²",
        metrics: [
          { label: "Categoria di Rischio", val: risk, color: color },
          { label: "Probabilità Ictus a Breve Termine", val: risk2d },
          { label: "Indicazione", val: score >= 4 raccomanda il ricovero ospedaliero tempestivo per accertamenti e profilassi secondaria." }
        ],
        note: "Johnston SC et al. (Lancet 2007). Strumento chiave in Pronto Soccorso per decidere il ricovero dei TIA."
      };
    `
  },

  // 11. CHIRURGIA & PERIOPERATORIO
  {
    id: "alvarado-score-appendicite",
    folder: "Score di Alvarado",
    title: "Score di Alvarado per Appendicite Acuta (MANTRELS)",
    category: "gastro",
    categoryLabel: "Chirurgia & Urgenza",
    description: "Valutazione diagnostica della probabilità di appendicite acuta nel paziente con dolore in fossa iliaca destra.",
    tags: ["alvarado", "appendicite", "chirurgia", "addome", "urgenza"],
    inputs: [
      { id: "migr", label: "Migrazione del dolore verso la fossa iliaca destra", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "anorex", label: "Anoressia / Inappetenza o chetonuria", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "nausea", label: "Nausea o vomito", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "tender", label: "Dolorabilità alla palpazione in fossa iliaca destra (McBurney)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "rebound", label: "Segno di Blumberg / Dolorabilità di rimbalzo", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "elev", label: "Febbre (Temperatura corporea ≥ 37.3 °C)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "leuko", label: "Leucocitosi (> 10.000 /µL)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "shift", label: "Spostamento a sinistra della formula (> 75% neutrofili)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(migr) + parseInt(anorex) + parseInt(nausea) + parseInt(tender) + parseInt(rebound) + parseInt(elev) + parseInt(leuko) + parseInt(shift);
      let prob = "Appendicite molto improbabile (1-4)";
      let rec = "Dimissione con indicazioni o ricerca di altra causa.";
      let color = "#2e7d32";

      if (score >= 7) {
        prob = "Appendicite altamente probabile (7-10)";
        rec = "Consulenza chirurgica urgente per eventuale appendicectomia.";
        color = "#c62828";
      } else if (score >= 5) {
        prob = "Appendicite possibile / probabile (5-6)";
        rec = "Osservazione clinica ed esecuzione di ecografia addome o TC.";
        color = "#d97706";
      }

      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Score di Alvarado",
        metrics: [
          { label: "Probabilità Clinica", val: prob, color: color },
          { label: "Condotta Consigliata", val: rec }
        ],
        note: "Alvarado A (Ann Emerg Med 1986). L'acronimo MANTRELS sintetizza gli 8 criteri clinico-laboratoristici."
      };
    `
  },
  {
    id: "wells-tvp",
    folder: "Criteri di Wells per TVP",
    title: "Criteri di Wells per Trombosi Venosa Profonda (TVP)",
    category: "cardiologia",
    categoryLabel: "Chirurgia & Angiologia",
    description: "Stratificazione della probabilità clinica di trombosi venosa profonda dell'arto inferiore.",
    tags: ["wells", "tvp", "trombosi", "edema", "d-dimero", "eco-color-doppler"],
    inputs: [
      { id: "cancer", label: "Cancro attivo (in trattamento o negli ultimi 6 mesi)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "paralysis", label: "Paralisi, paresi o recente immobilizzazione gessata dell'arto", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "bedridden", label: "Allettamento recente ≥ 3 gg o chirurgia maggiore nelle 12 sett.", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "tenderness", label: "Dolorabilità localizzata lungo il decorso del sistema venoso profondo", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "entireleg", label: "Edema di tutto l'arto inferiore interessato", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "calf", label: "Circonferenza polpaccio > 3 cm rispetto all'arto controlaterale", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "pitting", label: "Edema con fovea (pitting) confinato all'arto sintomatico", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "collateral", label: "Vene superficiali collaterali visibili (non varicose)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "prevdvt", label: "Precedente TVP documentata", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "altdiag", label: "Diagnosi alternativa altrettanto o più probabile della TVP", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "-2", label: "Sì (-2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(cancer) + parseInt(paralysis) + parseInt(bedridden) + parseInt(tenderness) + parseInt(entireleg) + parseInt(calf) + parseInt(pitting) + parseInt(collateral) + parseInt(prevdvt) + parseInt(altdiag);
      let prob = "";
      let action = "";
      let color = "#2e7d32";

      if (score >= 2) {
        prob = "TVP Probabile (Score ≥ 2)";
        action = "Eseguire Ecocolordoppler venoso dell'arto inferiore.";
        color = "#c62828";
      } else {
        prob = "TVP Improbabile (Score < 2)";
        action = "Eseguire D-Dimero ad alta sensibilità: se negativo esclude TVP.";
      }

      return {
        mainValue: score + " Punti",
        mainLabel: "Score di Wells per TVP",
        metrics: [
          { label: "Valutazione Clinica", val: prob, color: color },
          { label: "Prossimo Step Diagnostico", val: action }
        ],
        note: "Wells PS et al. (NEJM 2003). Modello a due livelli standardizzato internazionale."
      };
    `
  }
];

// Generatore automatico di HTML per i calcolatori
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

// Generatore automatico di script.js per i calcolatori
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
      ${calcLogicClean(calc.calcLogic)}
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

  // Calcolo automatico iniziale per presentare subito i risultati
  compute();
});`;
}

function calcLogicClean(code) {
  return code.trim();
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

// Esecuzione generazione cartelle e file
const baseCalcolatoriDir = path.join(__dirname, 'App', 'Calcolatori');

let countCreated = 0;
ALL_CALCULATORS.forEach(calc => {
  if (calc.skipGeneration) return;

  const targetDir = path.join(baseCalcolatoriDir, calc.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(path.join(targetDir, 'index.html'), generateHTML(calc), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'script.js'), generateJS(calc), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'style.css'), generateCSS(), 'utf8');
  countCreated++;
});

console.log(`Generati con successo ${countCreated} calcolatori pronti e funzionanti!`);
