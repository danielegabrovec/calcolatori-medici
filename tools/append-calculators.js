const fs = require('fs');
const path = require('path');

const MORE_CALCS = [
  // 1. CARDIOLOGIA AGGIUNTIVI
  {
    id: "framingham-risk-score",
    folder: "Framingham Risk Score",
    title: "Framingham Risk Score (Rischio Coronarico a 10 Anni)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Stima della probabilità a 10 anni di sviluppare eventi coronarici maggiori (infarto o morte coronarica).",
    tags: ["framingham", "rischio cv", "colesterolo", "hdl", "ipertensione", "fumo"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Uomo"}, {val: "f", label: "Donna"}] },
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "20", max: "79", def: "55" },
      { id: "chol", label: "Colesterolo Totale", unit: "mg/dL", type: "number", step: "5", min: "100", max: "450", def: "220" },
      { id: "hdl", label: "Colesterolo HDL", unit: "mg/dL", type: "number", step: "1", min: "15", max: "120", def: "45" },
      { id: "sbp", label: "Pressione Sistolica", unit: "mmHg", type: "number", step: "1", min: "90", max: "220", def: "135" },
      { id: "smoker", label: "Fumatore attivo", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] }
    ],
    calcLogic: `
      let pts = 0;
      if (gender === "m") {
        if (age >= 70) pts += 14; else if (age >= 60) pts += 11; else if (age >= 50) pts += 8; else pts += 5;
        if (chol >= 240) pts += 3; else if (chol >= 200) pts += 2;
        if (hdl < 40) pts += 2; else if (hdl >= 60) pts -= 1;
        if (sbp >= 140) pts += 2; else if (sbp >= 130) pts += 1;
        if (smoker === "1") pts += 3;
      } else {
        if (age >= 70) pts += 16; else if (age >= 60) pts += 12; else if (age >= 50) pts += 8; else pts += 4;
        if (chol >= 240) pts += 4; else if (chol >= 200) pts += 2;
        if (hdl < 40) pts += 2; else if (hdl >= 60) pts -= 1;
        if (sbp >= 140) pts += 3; else if (sbp >= 130) pts += 1;
        if (smoker === "1") pts += 3;
      }
      let riskPct = Math.min(30, Math.max(1, pts * 1.8));
      let cat = "Rischio Basso (< 10%)"; let color = "#2e7d32";
      if (riskPct >= 20) { cat = "Rischio Elevato (≥ 20% a 10 anni)"; color = "#c62828"; }
      else if (riskPct >= 10) { cat = "Rischio Intermedio (10-19%)"; color = "#d97706"; }
      return {
        mainValue: riskPct.toFixed(1) + " % a 10 anni",
        mainLabel: "Rischio Cardiovascolare Framingham",
        metrics: [
          { label: "Categoria di Rischio", val: cat, color: color },
          { label: "Punteggio Cumulativo", val: pts + " Punti" }
        ],
        note: "Adult Treatment Panel III (ATP III) / Framingham Heart Study."
      };
    `
  },
  {
    id: "resistenza-vascolare-polmonare-pvr",
    folder: "Resistenza Vascolare Polmonare (PVR)",
    title: "Resistenza Vascolare Polmonare (PVR)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Diagnosi emodinamica dell'ipertensione polmonare precapillare mediante cateterismo cardiaco destro.",
    tags: ["pvr", "ipertensione polmonare", "cateterismo", "pcwp", "pap", "wood"],
    inputs: [
      { id: "mpap", label: "Pressione Arteriosa Polmonare Media (mPAP)", unit: "mmHg", type: "number", step: "1", min: "8", max: "90", def: "32" },
      { id: "pcwp", label: "Pressione di Incuneamento Polmonare (PCWP / PAOP)", unit: "mmHg", type: "number", step: "1", min: "2", max: "40", def: "12" },
      { id: "co", label: "Gittata Cardiaca (CO)", unit: "L/min", type: "number", step: "0.1", min: "1", max: "15", def: "4.5" }
    ],
    calcLogic: `
      const pvrWood = (mpap - pcwp) / co;
      const pvrDyne = pvrWood * 80;
      let interp = "Normale (< 2 Wood Units)"; let color = "#2e7d32";
      if (pvrWood > 2.0 && mpap > 20) {
        interp = "Ipertensione Polmonare Precapillare (mPAP > 20 mmHg e PVR > 2 WU con PCWP ≤ 15 mmHg)";
        color = "#c62828";
      }
      return {
        mainValue: pvrWood.toFixed(2) + " Wood Units",
        mainLabel: "Resistenza Vascolare Polmonare (PVR)",
        metrics: [
          { label: "In dyne·s·cm⁻⁵", val: Math.round(pvrDyne) + " dyne·s·cm⁻⁵" },
          { label: "Criteri ESC/ERS 2022", val: interp, color: color }
        ],
        note: "Linee Guida ESC/ERS 2022 per l'Ipertensione Polmonare: PVR = (mPAP - PCWP) / CO."
      };
    `
  },
  {
    id: "duke-treadmill-score",
    folder: "Duke Treadmill Score",
    title: "Duke Treadmill Score (Test da Sforzo al Cicloergometro)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Stratificazione prognostica e predizione di sopravvivenza a 5 anni dopo test ergometrico massimale.",
    tags: ["duke", "treadmill", "test da sforzo", "ergometria", "st", "angina"],
    inputs: [
      { id: "time", label: "Tempo di Esercizio (Protocollo di Bruce)", unit: "minuti", type: "number", step: "0.5", min: "1", max: "25", def: "8.5" },
      { id: "st", label: "Massima Deviazione ST (sottoslivellamento)", unit: "mm", type: "number", step: "0.5", min: "0", max: "10", def: "1.0" },
      { id: "angina", label: "Indice di Angina durante il test", type: "select", options: [
        {val: "0", label: "Nessuna angina (0)"},
        {val: "1", label: "Angina non limitante l'esercizio (1)"},
        {val: "2", label: "Angina che ha causato l'interruzione del test (2)"}
      ]}
    ],
    calcLogic: `
      const dts = time - (5 * st) - (4 * parseFloat(angina));
      let risk = "Rischio Basso (≥ +5): Sopravvivenza a 5 anni 97%"; let color = "#2e7d32";
      if (dts < -10) {
        risk = "Alto Rischio (≤ -10): Sopravvivenza a 5 anni 65% - Indicata coronarografia urgente";
        color = "#c62828";
      } else if (dts < 5) {
        risk = "Rischio Moderato (-10 to +4): Sopravvivenza a 5 anni 90%";
        color = "#d97706";
      }
      return {
        mainValue: dts.toFixed(1) + " Punti",
        mainLabel: "Duke Treadmill Score (DTS)",
        metrics: [
          { label: "Stratificazione di Rischio", val: risk, color: color },
          { label: "Formula", val: "Tempo - (5 * ST_mm) - (4 * Indice_Angina)" }
        ],
        note: "Mark DB et al. (NEJM 1991)."
      };
    `
  },

  // 2. NEFROLOGIA AGGIUNTIVI
  {
    id: "anion-gap-urinario",
    folder: "Anion Gap Urinario",
    title: "Anion Gap Urinario (UAG)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Diagnosi differenziale dell'acidosi metabolica a normale anion gap (acidosi tubulare renale vs perdita gastrointestinale).",
    tags: ["uag", "anion gap urinario", "acidosi tubulare", "diarrea", "ammoniuria"],
    inputs: [
      { id: "una", label: "Sodio Urinario (U-Na)", unit: "mEq/L", type: "number", step: "1", min: "5", max: "200", def: "45" },
      { id: "uk", label: "Potassio Urinario (U-K)", unit: "mEq/L", type: "number", step: "1", min: "5", max: "150", def: "30" },
      { id: "ucl", label: "Cloro Urinario (U-Cl)", unit: "mEq/L", type: "number", step: "1", min: "5", max: "250", def: "95" }
    ],
    calcLogic: `
      const uag = (una + uk) - ucl;
      let interp = ""; let color = "#2e7d32";
      if (uag < 0) {
        interp = "UAG Negativo (< 0): Escrezione di ammonio intatta. Tipico di cause gastrointestinali (Diarrea, Lassativi).";
      } else {
        interp = "UAG Positivo (> 0): Difetto di acidificazione renale ed escrezione di ammonio. Tipico di Acidosi Tubulare Renale (RTA distale di tipo 1 o 4).";
        color = "#c62828";
      }
      return {
        mainValue: uag + " mEq/L",
        mainLabel: "Anion Gap Urinario (U-Na + U-K - U-Cl)",
        metrics: [
          { label: "Diagnosi Eziologica", val: interp, color: color },
          { label: "Surrogato di Ammoniuria (NH4+)", val: uag < 0 ? "Elevata (Attesa)" : "Inappropriatamente ridotta" }
        ],
        note: "Battle DC et al. (NEJM 1988)."
      };
    `
  },
  {
    id: "gradiente-transtubulare-potassio-ttkg",
    folder: "Gradiente Transtubulare Potassio (TTKG)",
    title: "Gradiente Transtubulare di Potassio (TTKG)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Valutazione dell'attività dell'aldosterone nel dotto collettore corticale renale nell'ipo/iperkaliemia.",
    tags: ["ttkg", "potassio", "aldosterone", "kaliemia", "tubulo"],
    inputs: [
      { id: "uk", label: "Potassio Urinario (U-K)", unit: "mEq/L", type: "number", step: "1", min: "5", max: "200", def: "60" },
      { id: "sk", label: "Potassio Sierico (S-K)", unit: "mEq/L", type: "number", step: "0.1", min: "1.5", max: "8.5", def: "5.8" },
      { id: "uosm", label: "Osmolalità Urinaria", unit: "mOsm/kg", type: "number", step: "10", min: "250", max: "1200", def: "550" },
      { id: "sosm", label: "Osmolalità Sierica", unit: "mOsm/kg", type: "number", step: "5", min: "250", max: "350", def: "290" }
    ],
    calcLogic: `
      const ttkg = (uk * sosm) / (sk * uosm);
      let interp = "Normale (6 - 12 con dieta standard)"; let color = "#2e7d32";
      if (sk > 5.0 && ttkg < 7) {
        interp = "TTKG < 7 in iperkaliemia: Inappropriata risposta aldosteronica (es. Ipoaldosteronismo, farmaci ACEi/Sartani/Spironolattone)";
        color = "#c62828";
      } else if (sk < 3.5 && ttkg > 3) {
        interp = "TTKG > 3 in ipokaliemia: Perdita renale inappropriata di potassio (Iperaldosteronismo)";
        color = "#ea580c";
      }
      return {
        mainValue: ttkg.toFixed(1),
        mainLabel: "Gradiente TTKG",
        metrics: [
          { label: "Interpretazione Risposta Renale", val: interp, color: color },
          { label: "Validità del Test", val: uosm >= sosm ? "Valido (Urine ipertoniche)" : "Non valido (Urina ipotonica)" }
        ],
        note: "Formula: (U-K * S-Osm) / (S-K * U-Osm). Valido solo se U-Osm > S-Osm e U-Na > 25 mEq/L."
      };
    `
  },
  {
    id: "rapporto-proteine-creatinina-upcr",
    folder: "Rapporto Proteine-Creatinina (UPCR)",
    title: "Rapporto Proteine / Creatinina Urinaria (UPCR)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Stima rapida della proteinuria delle 24 ore su singolo campione estemporaneo di urina.",
    tags: ["upcr", "proteinuria", "rene", "sindrome nefrosica", "glomerulonefrite"],
    inputs: [
      { id: "uprot", label: "Proteine Totali Urinarie", unit: "mg/dL", type: "number", step: "5", min: "5", max: "2000", def: "80" },
      { id: "ucreat", label: "Creatinina Urinaria", unit: "mg/dL", type: "number", step: "5", min: "10", max: "500", def: "100" }
    ],
    calcLogic: `
      const upcr = uprot / ucreat;
      const prot24h = upcr; // 1 mg/mg approssima 1 g/24h
      let interp = "Proteinuria nei limiti fisiologici (< 0.2 g/die)"; let color = "#2e7d32";
      if (upcr >= 3.5) {
        interp = "Range Nefrosico (≥ 3.5 g/24h) - Sospetta sindrome nefrosica";
        color = "#c62828";
      } else if (upcr >= 0.2) {
        interp = "Proteinuria Clinica Significativa (0.2 - 3.4 g/24h)";
        color = "#d97706";
      }
      return {
        mainValue: upcr.toFixed(2) + " mg/mg (g/g)",
        mainLabel: "Rapporto UPCR",
        metrics: [
          { label: "Stima Proteinuria delle 24h", val: "~ " + prot24h.toFixed(1) + " g / 24 ore" },
          { label: "Classificazione", val: interp, color: color }
        ],
        note: "Linee Guida KDIGO. Il rapporto UPCR (mg/mg) corrisponde all'incirca all'escrezione proteica in grammi nelle 24 ore."
      };
    `
  },

  // 3. PNEUMOLOGIA AGGIUNTIVI
  {
    id: "criteri-light-versamento-pleurico",
    folder: "Criteri di Light (Versamento Pleurico)",
    title: "Criteri di Light per Versamento Pleurico",
    category: "pneumologia",
    categoryLabel: "Pneumologia & Gasometria",
    description: "Differenziazione tra essudato (processo infiammatorio/neoplastico locale) e trasudato (squilibrio idrostatico/oncotico).",
    tags: ["light", "pleura", "toracentesi", "essudato", "trasudato", "ldh", "proteine"],
    inputs: [
      { id: "pProt", label: "Proteine nel Liquido Pleurico", unit: "g/dL", type: "number", step: "0.1", min: "0.5", max: "8", def: "3.5" },
      { id: "sProt", label: "Proteine Totali Sieriche", unit: "g/dL", type: "number", step: "0.1", min: "3", max: "10", def: "6.5" },
      { id: "pLdh", label: "LDH nel Liquido Pleurico", unit: "U/L", type: "number", step: "10", min: "20", max: "3000", def: "280" },
      { id: "sLdh", label: "LDH Sierico", unit: "U/L", type: "number", step: "10", min: "50", max: "2000", def: "320" },
      { id: "ldhUln", label: "Limite Superiore Normale (ULN) LDH Sierico del laboratorio", unit: "U/L", type: "number", step: "10", min: "150", max: "400", def: "250" }
    ],
    calcLogic: `
      const rProt = pProt / sProt;
      const rLdh = pLdh / sLdh;
      const ldh23 = (2 / 3) * ldhUln;
      const isExudate = (rProt > 0.5) || (rLdh > 0.6) || (pLdh > ldh23);
      let interp = isExudate ? "ESSUDATO: Almeno 1 criterio soddisfatto (es. Polmonite, Neoplasia, Embolia, TBC, Malattie autoimmuni)" : "TRASUDATO: Nessun criterio soddisfatto (es. Scompenso cardiaco, Cirrosi, Sindrome nefrosica)";
      let color = isExudate ? "#c62828" : "#0277bd";
      return {
        mainValue: isExudate ? "ESSUDATO" : "TRASUDATO",
        mainLabel: "Natura del Versamento Pleurico",
        metrics: [
          { label: "Rapporto Proteine Pleura / Siero (> 0.5)", val: rProt.toFixed(2) + (rProt > 0.5 ? " (Soddisfatto)" : "") },
          { label: "Rapporto LDH Pleura / Siero (> 0.6)", val: rLdh.toFixed(2) + (rLdh > 0.6 ? " (Soddisfatto)" : "") },
          { label: "LDH Pleurico > 2/3 del limite normale", val: pLdh + " vs soglia " + Math.round(ldh23) + (pLdh > ldh23 ? " (Soddisfatto)" : "") },
          { label: "Diagnosi", val: interp, color: color }
        ],
        note: "Light RW et al. (Ann Intern Med 1972). Sensibilità per essudato > 98%."
      };
    `
  },
  {
    id: "indice-bode-bpco",
    folder: "Indice BODE per BPCO",
    title: "Indice BODE per Broncopneumopatia Cronica Ostruttiva (BPCO)",
    category: "pneumologia",
    categoryLabel: "Pneumologia & Gasometria",
    description: "Score multidimensionale per la predizione di sopravvivenza a 4 anni nei pazienti con BPCO.",
    tags: ["bode", "bpco", "fev1", "6mwd", "dispnea", "mmrc", "bmi"],
    inputs: [
      { id: "fev1", label: "FEV₁ % del teorico post-broncodilatatore", type: "select", options: [
        {val: "0", label: "≥ 65% (0 pt)"},
        {val: "1", label: "50 - 64% (+1 pt)"},
        {val: "2", label: "36 - 49% (+2 pt)"},
        {val: "3", label: "≤ 35% (+3 pt)"}
      ]},
      { id: "walk", label: "Test del Cammino in 6 Minuti (6MWD)", type: "select", options: [
        {val: "0", label: "≥ 350 metri (0 pt)"},
        {val: "1", label: "250 - 349 metri (+1 pt)"},
        {val: "2", label: "150 - 249 metri (+2 pt)"},
        {val: "3", label: "≤ 149 metri (+3 pt)"}
      ]},
      { id: "mmrc", label: "Scala di Dispnea mMRC", type: "select", options: [
        {val: "0", label: "Grado 0 - 1 (0 pt)"},
        {val: "1", label: "Grado 2: cammina più piano dei coetanei (+1 pt)"},
        {val: "2", label: "Grado 3: si ferma per respirare dopo 100 metri (+2 pt)"},
        {val: "3", label: "Grado 4: dispnea per vestirsi / uscire (+3 pt)"}
      ]},
      { id: "bmi", label: "BMI (Indice di Massa Corporea)", type: "select", options: [
        {val: "0", label: "> 21 kg/m² (0 pt)"},
        {val: "1", label: "≤ 21 kg/m² (+1 pt)"}
      ]}
    ],
    calcLogic: `
      const score = parseInt(fev1) + parseInt(walk) + parseInt(mmrc) + parseInt(bmi);
      let sur4 = ""; let quartile = ""; let color = "#2e7d32";
      if (score <= 2) { quartile = "Quartile 1 (0-2 punti)"; sur4 = "82% sopravvivenza a 4 anni"; }
      else if (score <= 4) { quartile = "Quartile 2 (3-4 punti)"; sur4 = "67% sopravvivenza a 4 anni"; color = "#d97706"; }
      else if (score <= 6) { quartile = "Quartile 3 (5-6 punti)"; sur4 = "57% sopravvivenza a 4 anni"; color = "#ea580c"; }
      else { quartile = "Quartile 4 (7-10 punti)"; sur4 = "18% sopravvivenza a 4 anni (Alto Rischio)"; color = "#c62828"; }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Punteggio Indice BODE",
        metrics: [
          { label: "Quartile Prognostico", val: quartile, color: color },
          { label: "Sopravvivenza a 4 Anni Stimata", val: sur4 }
        ],
        note: "Celli BR et al. (NEJM 2004). Acronimo BODE: Body mass index, Obstruction, Dyspnea, Exercise."
      };
    `
  },

  // 4. GASTROENTEROLOGIA AGGIUNTIVI
  {
    id: "bisap-pancreatite-acuta",
    folder: "Score BISAP Pancreatite",
    title: "Score BISAP (Bedside Index for Severity in Acute Pancreatitis)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Identificazione precoce entro 24 ore dal ricovero dei pazienti con pancreatite acuta a rischio di mortalità e insufficienza d'organo.",
    tags: ["bisap", "pancreatite", "amilasi", "lipasi", "addome", "rianimazione"],
    inputs: [
      { id: "b", label: "BUN > 25 mg/dL (Azotemia)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "i", label: "Stato mentale alterato (GCS < 15)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "s", label: "SIRS presente (≥ 2 criteri di risposta infiammatoria)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "a", label: "Età > 60 anni", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "p", label: "Versamento Pleurico documentato (rx o eco)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(b) + parseInt(i) + parseInt(s) + parseInt(a) + parseInt(p);
      let mort = "< 1% mortalità"; let color = "#2e7d32";
      if (score >= 3) {
        mort = "Mortalità elevata (≥ 5-20%) - Alto rischio di insufficienza d'organo e necrosi pancreatica";
        color = "#c62828";
      } else if (score === 2) {
        mort = "Mortalità ~ 2%";
        color = "#d97706";
      }
      return {
        mainValue: score + " / 5 Punti",
        mainLabel: "Score BISAP",
        metrics: [
          { label: "Mortalità Ospedaliera Stimata", val: mort, color: color },
          { label: "Indicazione", val: score >= 3 richiede monitoraggio intensivo o semi-intensivo e idratazione idonea." }
        ],
        note: "Wu BU et al. (Gut 2008)."
      };
    `
  },
  {
    id: "indice-maddrey-epatite-alcolica",
    folder: "Indice di Maddrey",
    title: "Indice Discriminante di Maddrey (Epatite Alcolica Grave)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Identificazione dei pazienti con epatite alcolica severa candidati al trattamento corticosteroideo.",
    tags: ["maddrey", "epatite alcolica", "bilirubina", "tempo di protrombina", "corticosteroidi"],
    inputs: [
      { id: "ptPaz", label: "Tempo di Protrombina del Paziente (PT)", unit: "secondi", type: "number", step: "0.1", min: "10", max: "100", def: "19.5" },
      { id: "ptCtrl", label: "Tempo di Protrombina di Controllo (Normale)", unit: "secondi", type: "number", step: "0.1", min: "10", max: "16", def: "12.0" },
      { id: "bili", label: "Bilirubina Sierica Totale", unit: "mg/dL", type: "number", step: "0.1", min: "0.5", max: "50", def: "12.5" }
    ],
    calcLogic: `
      const diffPt = Math.max(0, ptPaz - ptCtrl);
      const df = (4.6 * diffPt) + bili;
      let interp = ""; let color = "#2e7d32";
      if (df >= 32) {
        interp = "Maddrey DF ≥ 32: Epatite Alcolica Grave (Mortalità a 1 mese ~ 35-50%). Indicata terapia steroidea con Prednisolone 40 mg/die (se non controindicato).";
        color = "#c62828";
      } else {
        interp = "Maddrey DF < 32: Epatite Alcolica Non Grave (bassa mortalità a breve termine). Non indicati corticosteroidi.";
      }
      return {
        mainValue: df.toFixed(1),
        mainLabel: "Indice Discriminante di Maddrey",
        metrics: [
          { label: "Gravità e Indicazione Terapeutica", val: interp, color: color },
          { label: "Soglia Decisionale Standard", val: "DF = 32" }
        ],
        note: "Maddrey WC et al. (Gastroenterology 1978): DF = 4.6 * [PT_paziente - PT_controllo] + Bilirubina (mg/dL)."
      };
    `
  },

  // 5. CHIRURGIA & TRAUMA AGGIUNTIVI
  {
    id: "punteggio-mallampati-intubazione",
    folder: "Punteggio Mallampati",
    title: "Classificazione di Mallampati (Valutazione Vie Aeree)",
    category: "chirurgia",
    categoryLabel: "Chirurgia & Perioperatorio",
    description: "Predittore visivo anatomico di intubazione orotracheale difficile in anestesia e rianimazione.",
    tags: ["mallampati", "intubazione", "anestesia", "vie aeree", "laringoscopia"],
    inputs: [
      { id: "classVal", label: "Strutture Anatomiche Orofaringee Visibili a Bocca Aperta", type: "select", options: [
        {val: "1", label: "Classe I: Palato molle, fauci, ugola e pilastri tonsillari completamente visibili"},
        {val: "2", label: "Classe II: Palato molle, fauci e porzione superiore dell'ugola visibili"},
        {val: "3", label: "Classe III: Palato molle e base dell'ugola visibili"},
        {val: "4", label: "Classe IV: Solo il palato duro è visibile (palato molle completamente non visibile)"}
      ]}
    ],
    calcLogic: `
      const cl = classVal;
      let diff = "Intubazione verosimilmente agevole"; let color = "#2e7d32";
      if (cl === "3") { diff = "Intubazione potenzialmente difficoltosa (Classe III)"; color = "#d97706"; }
      else if (cl === "4") { diff = "Alto rischio di Intubazione Difficile (Classe IV) - Preparare videolaringoscopio/fibroscopio"; color = "#c62828"; }
      return {
        mainValue: "Classe " + cl,
        mainLabel: "Grado Mallampati",
        metrics: [
          { label: "Predizione Difficoltà Laringoscopica", val: diff, color: color },
          { label: "Posizione di Valutazione", val: "Paziente seduto, testa neutra, bocca spalancata e lingua protrusa senza fonazione" }
        ],
        note: "Mallampati SR et al. (Can Anaesth Soc J 1985)."
      };
    `
  },
  {
    id: "criteri-sirs-risposta-infiammatoria",
    folder: "Criteri SIRS",
    title: "Criteri SIRS (Sindrome da Risposta Infiammatoria Sistemica)",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Screening della risposta infiammatoria sistemica a infezioni, traumi, pancreatiti o ustioni.",
    tags: ["sirs", "infiammazione", "febbre", "sepsi", "tachicardia", "leucocitosi"],
    inputs: [
      { id: "temp", label: "Temperatura Corporea > 38.0°C oppure < 36.0°C", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "hr", label: "Frequenza Cardiaca > 90 bpm", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "rr", label: "Frequenza Respiratoria > 20 atti/min o PaCO₂ < 32 mmHg", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "wbc", label: "Leucociti > 12.000 /µL, < 4.000 /µL o forme immature > 10%", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(temp) + parseInt(hr) + parseInt(rr) + parseInt(wbc);
      const isSirs = score >= 2;
      return {
        mainValue: score + " / 4 Criteri",
        mainLabel: "Punteggio SIRS",
        metrics: [
          { label: "Presenza di SIRS", val: isSirs ? "CRITERI SIRS SODDISFATTI (≥ 2)" : "SIRS non presente (< 2)", color: isSirs ? "#c62828" : "#2e7d32" },
          { label: "Correlazione Sepsi", val: isSirs ? "Se associata a sospetta o documentata infezione, definisce quadro di sepsi (criteri classici ACCP/SCCM)" : "Quadro infiammatorio sistemico non attivo" }
        ],
        note: "Bone RC et al. (Chest 1992)."
      };
    `
  },
  {
    id: "regola-dei-nove-wallace-ustioni",
    folder: "Regola dei Nove (Wallace)",
    title: "Regola dei Nove di Wallace (Superficie Ustionata TBSA)",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Stima rapida dell'estensione percentuale delle ustioni nell'adulto per il calcolo della fluidoterapia.",
    tags: ["wallace", "regola dei nove", "ustioni", "tbsa", "emergenza"],
    inputs: [
      { id: "head", label: "Testa e Collo (fronte + retro = 9%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "9", def: "0" },
      { id: "antTrunk", label: "Torace e Addome Anteriore (18%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "18", def: "9" },
      { id: "postTrunk", label: "Dorso e Regione Lombare (18%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "18", def: "0" },
      { id: "armR", label: "Arto Superiore Destro (9%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "9", def: "9" },
      { id: "armL", label: "Arto Superiore Sinistro (9%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "9", def: "0" },
      { id: "legR", label: "Arto Inferiore Destro (18%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "18", def: "9" },
      { id: "legL", label: "Arto Inferiore Sinistro (18%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "18", def: "0" },
      { id: "genit", label: "Genitali ed Area Perineale (1%)", unit: "% ustionata", type: "number", step: "1", min: "0", max: "1", def: "0" }
    ],
    calcLogic: `
      const total = head + antTrunk + postTrunk + armR + armL + legR + legL + genit;
      let gravita = "Ustione di modesta estensione (< 15%)"; let color = "#2e7d32";
      if (total >= 20) {
        gravita = "Grande Ustionato (≥ 20% TBSA) - Indicazione mandatoria alla formula di Parkland e Centro Ustioni";
        color = "#c62828";
      } else if (total >= 15) {
        gravita = "Ustione Moderata (15-19% TBSA)";
        color = "#d97706";
      }
      return {
        mainValue: total + " % TBSA",
        mainLabel: "Superficie Corporea Ustionata Totale",
        metrics: [
          { label: "Giudizio di Gravità", val: gravita, color: color },
          { label: "Uso Immediato", val: "Inserire questo valore nella Formula di Parkland per il calcolo dei liquidi" }
        ],
        note: "Wallace AB (Lancet 1951). Valido per pazienti adulti."
      };
    `
  },
  {
    id: "ecog-performance-status",
    folder: "Performance Status ECOG",
    title: "Scala ECOG / WHO Performance Status",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Quantificazione della capacità funzionale del paziente oncologico e idoneità ai trattamenti chemioterapici.",
    tags: ["ecog", "performance status", "oncologia", "chemioterapia", "autonomia"],
    inputs: [
      { id: "grade", label: "Grado di Autonomia e Attività Quotidiana", type: "select", options: [
        {val: "0", label: "ECOG 0: Completamente attivo, in grado di svolgere tutte le attività pre-malattia senza restrizioni"},
        {val: "1", label: "ECOG 1: Limitato in attività fisiche pesanti ma deambulante e in grado di svolgere lavori leggeri"},
        {val: "2", label: "ECOG 2: Deambulante e autonomo nella cura della persona ma incapace di lavorare; a letto per meno del 50% delle ore di veglia"},
        {val: "3", label: "ECOG 3: Capace di limitata cura personale; confinato a letto o sedia per più del 50% delle ore di veglia"},
        {val: "4", label: "ECOG 4: Completamente disabile; non può compiere alcuna cura personale; totalmente confinato a letto/sedia"},
        {val: "5", label: "ECOG 5: Deceduto"}
      ]}
    ],
    calcLogic: `
      const g = parseInt(grade);
      let interp = "Idoneo alla maggior parte dei trattamenti chemioterapici standard"; let color = "#2e7d32";
      if (g >= 3) {
        interp = "Forte limitazione ai trattamenti antiblastici standard per elevato rischio di tossicità (indicata terapia di supporto/palliativa)";
        color = "#c62828";
      } else if (g === 2) {
        interp = "Borderline: valutare con cautela chemioterapia a dosi ridotte o schemi meno tossici";
        color = "#d97706";
      }
      return {
        mainValue: "ECOG " + g,
        mainLabel: "Punteggio ECOG",
        metrics: [
          { label: "Idoneità Terapeutica Oncologica", val: interp, color: color },
          { label: "Corrispondente Karnofsky", val: g === 0 ? "100%" : g === 1 ? "80-90%" : g === 2 ? "60-70%" : g === 3 ? "40-50%" : g === 4 ? "10-30%" : "0%" }
        ],
        note: "Eastern Cooperative Oncology Group (Oken MM et al., Am J Clin Oncol 1982)."
      };
    `
  }
];

// Procedi alla generazione dei file
const calcolatoriDir = path.join(__dirname, 'App', 'Calcolatori');

let count = 0;
MORE_CALCS.forEach(calc => {
  const targetDir = path.join(calcolatoriDir, calc.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Genera HTML
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

  const html = `<!DOCTYPE html>
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

  // Genera Script
  const readInputs = calc.inputs.map(inp => {
    if (inp.type === "select") {
      return `const ${inp.id} = document.getElementById("${inp.id}").value;`;
    } else {
      return `const ${inp.id} = parseFloat(document.getElementById("${inp.id}").value);`;
    }
  }).join('\n    ');

  const js = `document.addEventListener('DOMContentLoaded', () => {
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

  const css = `.calc-grid-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
}
@media (max-width: 860px) {
  .calc-grid-layout { grid-template-columns: 1fr; }
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

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'script.js'), js, 'utf8');
  fs.writeFileSync(path.join(targetDir, 'style.css'), css, 'utf8');
  count++;
});

console.log(`Generati ulteriori ${count} calcolatori!`);

// Aggiorna il catalogo in calculators-data.js aggiungendo i nuovi
const sharedDataFile = path.join(__dirname, 'App', 'shared', 'calculators-data.js');
const sharedData = require(sharedDataFile);

const existingIds = new Set(sharedData.CALCULATORS.map(c => c.id));

MORE_CALCS.forEach(calc => {
  if (!existingIds.has(calc.id)) {
    sharedData.CALCULATORS.push({
      id: calc.id,
      title: calc.title,
      category: calc.category,
      categoryLabel: calc.categoryLabel,
      description: calc.description,
      path: `../Calcolatori/${calc.folder}/index.html`,
      isReady: true,
      tags: calc.tags
    });
  }
});

const updatedFile = `// Registro Centrale dei Calcolatori Medici
// Catalogo unico per oltre 100 calcolatori clinici.

const CATEGORIES = ${JSON.stringify(sharedData.CATEGORIES, null, 2)};

const CALCULATORS = ${JSON.stringify(sharedData.CALCULATORS, null, 2)};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIES, CALCULATORS };
}
`;

fs.writeFileSync(sharedDataFile, updatedFile, 'utf8');
console.log(`Totale calcolatori nel catalogo: ${sharedData.CALCULATORS.length}`);
