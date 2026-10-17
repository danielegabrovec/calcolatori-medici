const fs = require('fs');
const path = require('path');

const FINAL_BATCH = [
  // 1. NEFROLOGIA & METABOLISMO
  {
    id: "clearance-acqua-libera",
    folder: "Clearance Acqua Libera (CH2O)",
    title: "Clearance dell'Acqua Libera (CH₂O)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Quantificazione della capacità renale di diluire o concentrare le urine.",
    tags: ["ch2o", "acqua libera", "clearance", "osmolarita", "diabete insipido"],
    inputs: [
      { id: "uvol", label: "Volume Urinario Giornaliero (V)", unit: "mL/24h", type: "number", step: "50", min: "200", max: "10000", def: "2000" },
      { id: "uosm", label: "Osmolalità Urinaria", unit: "mOsm/kg", type: "number", step: "10", min: "50", max: "1200", def: "450" },
      { id: "sosm", label: "Osmolalità Sierica", unit: "mOsm/kg", type: "number", step: "5", min: "250", max: "350", def: "290" }
    ],
    calcLogic: `
      const cosm = (uosm * uvol) / sosm;
      const ch2o = uvol - cosm;
      let interp = ch2o > 0 ? "CH₂O Positiva: Escrezione netta di acqua libera (diluizione urinaria attiva)" : "CH₂O Negativa: Riassorbimento netto di acqua libera (concentrazione urinaria attiva)";
      let color = ch2o > 0 ? "#0277bd" : "#d97706";
      return {
        mainValue: Math.round(ch2o) + " mL / 24h",
        mainLabel: "Clearance Acqua Libera (CH₂O)",
        metrics: [
          { label: "Clearance Osmolare (Cosm)", val: Math.round(cosm) + " mL/24h" },
          { label: "Stato di Concentrazione Renale", val: interp, color: color }
        ],
        note: "CH2O = V - (U-Osm * V / S-Osm)."
      };
    `
  },
  {
    id: "escrezione-frazionata-potassio-fek",
    folder: "Frazione Escrezione Potassio (FEK)",
    title: "Escrezione Frazionata del Potassio (FEK)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Differenziazione tra cause renali ed extrarenali di ipokaliemia o iperkaliemia.",
    tags: ["fek", "potassio", "escrezione", "kaliuria", "aldosterone"],
    inputs: [
      { id: "uk", label: "Potassio Urinario", unit: "mEq/L", type: "number", step: "1", min: "2", max: "150", def: "25" },
      { id: "sk", label: "Potassio Sierico", unit: "mEq/L", type: "number", step: "0.1", min: "1.5", max: "8", def: "3.2" },
      { id: "ucr", label: "Creatinina Urinaria", unit: "mg/dL", type: "number", step: "1", min: "10", max: "400", def: "80" },
      { id: "scr", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.1", min: "0.4", max: "15", def: "1.0" }
    ],
    calcLogic: `
      const fek = ((uk * scr) / (sk * ucr)) * 100;
      let interp = "Normale (10 - 20% con funzione renale integra)"; let color = "#2e7d32";
      if (sk < 3.5 && fek > 10) {
        interp = "FEK > 10% in ipokaliemia: Perdita renale inappropriata di potassio (es. diuretici, iperaldosteronismo, Bartter/Gitelman)";
        color = "#c62828";
      } else if (sk < 3.5 && fek < 6) {
        interp = "FEK < 6% in ipokaliemia: Risposta renale conservativa appropriata (perdite extra-renali gastrointestinali)";
      }
      return {
        mainValue: fek.toFixed(1) + " %",
        mainLabel: "Escrezione Frazionata Potassio",
        metrics: [
          { label: "Interpretazione Clinica", val: interp, color: color }
        ],
        note: "FEK = (U-K * S-Cr) / (S-K * U-Cr) * 100."
      };
    `
  },
  {
    id: "egfr-mdrd-4",
    folder: "eGFR Equazione MDRD",
    title: "eGFR Formula MDRD (4 Variabili)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Equazione storica Modification of Diet in Renal Disease (MDRD) per la stima del filtrato glomerulare.",
    tags: ["mdrd", "egfr", "creatinina", "filtrato", "rene"],
    inputs: [
      { id: "gender", label: "Sesso Biologico", type: "select", options: [{val: "m", label: "Maschio"}, {val: "f", label: "Femmina"}] },
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "18", max: "105", def: "65" },
      { id: "creat", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.01", min: "0.3", max: "15", def: "1.2" }
    ],
    calcLogic: `
      let mdrd = 175 * Math.pow(creat, -1.154) * Math.pow(age, -0.203);
      if (gender === "f") mdrd *= 0.742;
      return {
        mainValue: Math.round(mdrd) + " mL/min/1.73 m²",
        mainLabel: "eGFR Stimato (MDRD-4)",
        metrics: [
          { label: "Formula Utilizzata", val: "MDRD standard a 4 variabili IDMS-tracciabile" },
          { label: "Nota Comparativa", val: "Nei valori > 60 mL/min la nuova CKD-EPI è più accurata" }
        ],
        note: "Levey AS et al. (Ann Intern Med 2006)."
      };
    `
  },

  // 2. CARDIOLOGIA AGGIUNTIVI
  {
    id: "timi-stemi-score",
    folder: "TIMI Score STEMI",
    title: "Score TIMI per Infarto Miocardico STEMI",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Predizione della mortalità a 30 giorni nei pazienti con infarto miocardico acuto con sopraslivellamento del tratto ST.",
    tags: ["timi", "stemi", "infarto", "angioplastica", "morte", "coronaria"],
    inputs: [
      { id: "age", label: "Età", type: "select", options: [
        {val: "0", label: "< 65 anni (0 pt)"},
        {val: "2", label: "65 - 74 anni (+2 pt)"},
        {val: "3", label: "≥ 75 anni (+3 pt)"}
      ]},
      { id: "sbp", label: "Pressione Sistolica < 100 mmHg", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "hr", label: "Frequenza Cardiaca > 100 bpm", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "killip", label: "Classe Killip II - IV (segni di scompenso / rantoli)", type: "select", options: [{val: "0", label: "No (Killip I, 0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "ant", label: "Sede Infarto Anteriore o BBS sinistro", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "dm", label: "Storia di Diabete, Ipertensione o Angina", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "wt", label: "Peso corporeo < 67 kg", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "time", label: "Tempo al trattamento > 4 ore dall'esordio", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(sbp) + parseInt(hr) + parseInt(killip) + parseInt(ant) + parseInt(dm) + parseInt(wt) + parseInt(time);
      let mort = "0.8 - 1.6% a 30 giorni"; let color = "#2e7d32";
      if (score >= 8) { mort = "27 - 36% mortalità a 30 giorni (Rischio Altissimo)"; color = "#c62828"; }
      else if (score >= 5) { mort = "7.3 - 12.4% mortalità a 30 giorni"; color = "#ea580c"; }
      else if (score >= 3) { mort = "4.4% mortalità a 30 giorni"; color = "#d97706"; }
      return {
        mainValue: score + " / 14 Punti",
        mainLabel: "Score TIMI STEMI",
        metrics: [
          { label: "Mortalità a 30 Giorni Stimata", val: mort, color: color },
          { label: "Azione", val: "Angioplastica primaria immediata (PCI)" }
        ],
        note: "Morrow DA et al. (Circulation 2000)."
      };
    `
  },
  {
    id: "grace-2-acs",
    folder: "Punteggio GRACE 2.0",
    title: "Punteggio GRACE 2.0 (Sindrome Coronarica Acuta)",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Emodinamica",
    description: "Stratificazione prognostica di mortalità intraospedaliera e a 6 mesi nelle sindromi coronariche acute.",
    tags: ["grace", "sca", "stemi", "nstemi", "coronarografia", "mortalita"],
    inputs: [
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "20", max: "100", def: "65" },
      { id: "hr", label: "Frequenza Cardiaca", unit: "bpm", type: "number", step: "1", min: "30", max: "220", def: "82" },
      { id: "sbp", label: "Pressione Sistolica", unit: "mmHg", type: "number", step: "1", min: "50", max: "240", def: "125" },
      { id: "creat", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.1", min: "0.4", max: "10", def: "1.1" },
      { id: "arrest", label: "Arresto cardiaco all'ammissione", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "39", label: "Sì (+39 pt)"}] },
      { id: "st", label: "Deviazione segmento ST", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "28", label: "Sì (+28 pt)"}] },
      { id: "enzymes", label: "Enzimi cardiaci elevati", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "14", label: "Sì (+14 pt)"}] }
    ],
    calcLogic: `
      let pts = Math.round(age * 1.5) + Math.round(hr * 0.4) + Math.round((200 - sbp) * 0.2) + Math.round(creat * 12) + parseInt(arrest) + parseInt(st) + parseInt(enzymes);
      let risk = "Rischio Basso (GRACE < 109)"; let color = "#2e7d32";
      if (pts > 140) { risk = "Alto Rischio (GRACE > 140) - Indicata coronarografia invasiva precoce (< 24h)"; color = "#c62828"; }
      else if (pts >= 109) { risk = "Rischio Intermedio (GRACE 109-140)"; color = "#d97706"; }
      return {
        mainValue: pts + " Punti",
        mainLabel: "Score GRACE 2.0",
        metrics: [
          { label: "Categoria di Rischio", val: risk, color: color },
          { label: "Timing Coronarografia (Linee Guida ESC)", val: pts > 140 ? "Strategia Invasiva Precoce entro 24 ore" : "Strategia Invasiva Selettiva" }
        ],
        note: "Fox KA et al. (BMJ 2006). Parametro cardine delle linee guida ESC NSTE-ACS."
      };
    `
  },
  {
    id: "cutoff-ddimero-eta",
    folder: "D-Dimero Aggiustato per Età",
    title: "Valore Soglia del D-Dimero Aggiustato per l'Età",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Angiologia",
    description: "Aumento della specificità del D-Dimero nei pazienti con età > 50 anni per l'esclusione di TVP ed Embolia Polmonare.",
    tags: ["d-dimero", "cutoff", "eta", "embolia", "tvp", "trombosi"],
    inputs: [
      { id: "age", label: "Età del Paziente", unit: "anni", type: "number", step: "1", min: "18", max: "110", def: "72" },
      { id: "ddimer", label: "Valore di D-Dimero Misurato", unit: "ng/mL (FEU)", type: "number", step: "10", min: "50", max: "10000", def: "650" }
    ],
    calcLogic: `
      const cutoff = age > 50 ? age * 10 : 500;
      const isNeg = ddimer < cutoff;
      let interp = isNeg ? "D-Dimero NEGATIVO (inferiore al cutoff corretto per età): TVP ed EP escluse con sicurezza se probabilità clinica bassa/intermedia" : "D-Dimero POSITIVO (superiore al cutoff per età): Richiede approfondimento radiologico (Angio-TC o Ecocolordoppler)";
      let color = isNeg ? "#2e7d32" : "#c62828";
      return {
        mainValue: cutoff + " ng/mL",
        mainLabel: "Cut-Off Corretto per l'Età",
        metrics: [
          { label: "D-Dimero Riscontrato", val: ddimer + " ng/mL" },
          { label: "Esito Valutazione", val: interp, color: color },
          { label: "Regola", val: age > 50 ? "Età * 10 ng/mL (FEU)" : "Standard 500 ng/mL" }
        ],
        note: "Trial ADJUST-PE (Righini M et al., JAMA 2014). Riduce del 30% le Angio-TC inutili nell'anziano."
      };
    `
  },

  // 3. GASTROENTEROLOGIA AGGIUNTIVI
  {
    id: "criteri-ranson-pancreatite",
    folder: "Criteri di Ranson Pancreatite",
    title: "Criteri di Ranson per la Gravità della Pancreatite Acuta",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Stratificazione prognostica della pancreatite acuta non biliare all'ammissione e a 48 ore.",
    tags: ["ranson", "pancreatite", "amilasi", "addome", "rianimazione"],
    inputs: [
      { id: "age", label: "Età > 55 anni", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "wbc", label: "Leucociti > 16.000 /µL", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "glu", label: "Glicemia > 200 mg/dL", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "ldh", label: "LDH > 350 U/L", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "ast", label: "AST > 250 U/L", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "hct", label: "Calo Ematocrito > 10% a 48h", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "bun", label: "Aumento BUN > 5 mg/dL a 48h", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "ca", label: "Calcio sierico < 8.0 mg/dL a 48h", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "pao2", label: "PaO₂ < 60 mmHg a 48h", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(wbc) + parseInt(glu) + parseInt(ldh) + parseInt(ast) + parseInt(hct) + parseInt(bun) + parseInt(ca) + parseInt(pao2);
      let mort = "< 3% mortalità"; let color = "#2e7d32";
      if (score >= 6) { mort = "≥ 40 - 50% mortalità (Pancreatite Severa necrotizzante)"; color = "#c62828"; }
      else if (score >= 3) { mort = "15% mortalità (Pancreatite Moderata/Severa)"; color = "#ea580c"; }
      return {
        mainValue: score + " / 11 Criteri",
        mainLabel: "Score di Ranson",
        metrics: [
          { label: "Mortalità Stimata", val: mort, color: color },
          { label: "Valutazione", val: score >= 3 definisce pancreatite acuta severa con indicazione a cure intensive. }
        ],
        note: "Ranson JH et al. (Surg Gynecol Obstet 1974)."
      };
    `
  },
  {
    id: "indice-apri-fibrosi",
    folder: "Indice APRI per Fibrosi Epatica",
    title: "Indice APRI (AST to Platelet Ratio Index)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Stima rapida non invasiva del grado di fibrosi epatica e cirrosi a partire da AST e piastrine.",
    tags: ["apri", "fibrosi", "cirrosi", "ast", "piastrine", "fegato"],
    inputs: [
      { id: "ast", label: "AST Sierica (GOT)", unit: "U/L", type: "number", step: "1", min: "5", max: "1000", def: "65" },
      { id: "astUln", label: "Limite Superiore Normale (ULN) AST", unit: "U/L", type: "number", step: "1", min: "20", max: "60", def: "35" },
      { id: "plt", label: "Piastrine", unit: "x10³/µL", type: "number", step: "1", min: "10", max: "600", def: "140" }
    ],
    calcLogic: `
      const apri = ((ast / astUln) / plt) * 100;
      let interp = "Bassa probabilità di fibrosi avanzata (APRI < 0.5)"; let color = "#2e7d32";
      if (apri > 1.5) {
        interp = "APRI > 1.5: Forte probabilità di cirrosi epatica (F4)";
        color = "#c62828";
      } else if (apri > 1.0) {
        interp = "APRI > 1.0: Probabile fibrosi significativa / avanzata (≥ F2)";
        color = "#d97706";
      }
      return {
        mainValue: apri.toFixed(2),
        mainLabel: "Indice APRI",
        metrics: [
          { label: "Interpretazione Clinica", val: interp, color: color },
          { label: "Formula", val: "[(AST / ULN) / Piastrine (10^9/L)] * 100" }
        ],
        note: "Wai CT et al. (Hepatology 2003). Raccomandato dall'OMS come test non invasivo a basso costo."
      };
    `
  },
  {
    id: "score-rockall-emorragia",
    folder: "Score di Rockall",
    title: "Score di Rockall per Emorragia Digestiva Superiore",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Predizione del rischio di recidiva emorragica e mortalità dopo endoscopia per sanguinamento digestivo alto.",
    tags: ["rockall", "emorragia", "endoscopia", "forrest", "ulcera"],
    inputs: [
      { id: "age", label: "Età", type: "select", options: [{val: "0", label: "< 60 anni (0 pt)"}, {val: "1", label: "60 - 79 anni (+1 pt)"}, {val: "2", label: "≥ 80 anni (+2 pt)"}] },
      { id: "shock", label: "Stato Emodinamico", type: "select", options: [{val: "0", label: "Nessuno shock: PAS ≥ 100 e FC < 100 (0 pt)"}, {val: "1", label: "Tachicardia: FC ≥ 100 e PAS ≥ 100 (+1 pt)"}, {val: "2", label: "Ipotensione: PAS < 100 mmHg (+2 pt)"}] },
      { id: "comorb", label: "Comorbilità Maggiori", type: "select", options: [{val: "0", label: "Nessuna comorbilità maggiore (0 pt)"}, {val: "2", label: "Cardiopatia ischemica, scompenso, altre malattie (+2 pt)"}, {val: "3", label: "Insufficienza renale, insufficienza epatica o neoplasia disseminata (+3 pt)"}] },
      { id: "diag", label: "Diagnosi Endoscopica", type: "select", options: [{val: "0", label: "Mallory-Weiss o nessuna lesione identificata (0 pt)"}, {val: "1", label: "Tutte le altre diagnosi (es. ulcera peptica, gastrite) (+1 pt)"}, {val: "2", label: "Neoplasia maligna del tratto GI superiore (+2 pt)"}] },
      { id: "stigmata", label: "Stigmate di Recente Sanguinamento (Forrest)", type: "select", options: [{val: "0", label: "Nessuna o base pulita (Forrest III) (0 pt)"}, {val: "2", label: "Sangue fresco nel lume, coagulo adeso o vaso visibile (Forrest I-II) (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(shock) + parseInt(comorb) + parseInt(diag) + parseInt(stigmata);
      let mort = "< 1% mortalità, < 5% risanguinamento"; let color = "#2e7d32";
      if (score >= 8) { mort = "41% mortalità, 40% risanguinamento (Rischio Altissimo)"; color = "#c62828"; }
      else if (score >= 5) { mort = "11% mortalità, 25% risanguinamento"; color = "#ea580c"; }
      else if (score >= 3) { mort = "3% mortalità, 10% risanguinamento"; color = "#d97706"; }
      return {
        mainValue: score + " / 11 Punti",
        mainLabel: "Score di Rockall Completo",
        metrics: [
          { label: "Mortalità & Rischio Risanguinamento", val: mort, color: color }
        ],
        note: "Rockall TA et al. (Gut 1996)."
      };
    `
  },

  // 4. ENDOCRINOLOGIA AGGIUNTIVI
  {
    id: "indice-quicki-insulina",
    folder: "Indice QUICKI",
    title: "Indice QUICKI (Quantitative Insulin Sensitivity Check Index)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Valutazione logaritmica della sensibilità insulinica periferica a partire da glicemia e insulinemia basali.",
    tags: ["quicki", "insulina", "insulino-resistenza", "glicemia", "homa"],
    inputs: [
      { id: "glu", label: "Glicemia a digiuno", unit: "mg/dL", type: "number", step: "1", min: "40", max: "300", def: "92" },
      { id: "ins", label: "Insulinemia a digiuno", unit: "µU/mL", type: "number", step: "0.1", min: "1", max: "150", def: "8.5" }
    ],
    calcLogic: `
      const quicki = 1 / (Math.log10(glu) + Math.log10(ins));
      let interp = "Normale sensibilità insulinica (> 0.339)"; let color = "#2e7d32";
      if (quicki < 0.339) {
        interp = "Insulino-resistenza marcata (QUICKI < 0.339)";
        color = "#c62828";
      }
      return {
        mainValue: quicki.toFixed(3),
        mainLabel: "Indice QUICKI",
        metrics: [
          { label: "Stato della Sensibilità Insulinica", val: interp, color: color },
          { label: "Formula", val: "1 / [log10(Glicemia) + log10(Insulina)]" }
        ],
        note: "Katz A et al. (J Clin Endocrinol Metab 2000). Correlazione elevata con il clamp euglicemico-iperinsulinemico."
      };
    `
  },
  {
    id: "dosaggio-levotiroxina-ipotiroidismo",
    folder: "Dosaggio Levotiroxina",
    title: "Dosaggio Sostitutivo di Levotiroxina (L-T4)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Stima della dose piena iniziale di L-Tiroxina per ipotiroidismo primario franco o post-tiroidectomia.",
    tags: ["levotiroxina", "t4", "tsh", "tiroide", "ipotiroidismo", "dosaggio"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "30", max: "200", def: "70" },
      { id: "profile", label: "Profilo Paziente & Obiettivo", type: "select", options: [
        {val: "1.6", label: "Piena sostituzione / Post-tiroidectomia totale (1.6 mcg/kg/die)"},
        {val: "1.0", label: "Ipotiroidismo lieve / Anziano senza coronaropatia (1.0 mcg/kg/die)"},
        {val: "0.5", label: "Anziano fragile o con Cardiopatia Ischemica nota (avvio prudente 25-50 mcg/die)"}
      ]}
    ],
    calcLogic: `
      const doseMcg = weight * parseFloat(profile);
      return {
        mainValue: Math.round(doseMcg) + " mcg / die",
        mainLabel: "Dose Giornaliera Stimata di Levotiroxina",
        metrics: [
          { label: "Dosaggio Relativo Applicato", val: profile + " mcg / kg / die" },
          { label: "Controllo TSH", val: "Dosare il TSH a distanza di 6 - 8 settimane per titolazione" }
        ],
        note: "Linee guida ATA (American Thyroid Association) per l'ipotiroidismo nell'adulto."
      };
    `
  },
  {
    id: "osmolarita-efficace-dka",
    folder: "Osmolarità Efficace (Tonicità DKA)",
    title: "Osmolarità Sierica Efficace (Tonicità nella DKA/HHS)",
    category: "endocrinologia",
    categoryLabel: "Endocrinologia & Diabete",
    description: "Calcolo della pressione osmotica effettiva dei fluidi che determina lo shift di acqua dalle cellule nella chetoacidosi e stato iperosmolare.",
    tags: ["tonicità", "dka", "hhs", "chetoacidosi", "diabete", "osmolarita efficace"],
    inputs: [
      { id: "na", label: "Sodio Sierico (Na)", unit: "mEq/L", type: "number", step: "0.5", min: "100", max: "180", def: "135" },
      { id: "glu", label: "Glicemia", unit: "mg/dL", type: "number", step: "1", min: "70", max: "1800", def: "650" }
    ],
    calcLogic: `
      const tonicity = (2 * na) + (glu / 18);
      let interp = "Normale (275 - 295 mOsm/kg)"; let color = "#2e7d32";
      if (tonicity > 320) {
        interp = "Iperosmolarità Grave (> 320 mOsm/kg) - Criterio diagnostico di Stato Iperosmolare Iperglicemico (HHS)";
        color = "#c62828";
      } else if (tonicity > 295) {
        interp = "Ipertonicità Moderata (296 - 320 mOsm/kg)";
        color = "#d97706";
      }
      return {
        mainValue: Math.round(tonicity) + " mOsm/kg",
        mainLabel: "Osmolarità Efficace (Tonicità)",
        metrics: [
          { label: "Quadro Clinico Osmotico", val: interp, color: color },
          { label: "Formula Esclude l'Urea", val: "2*Na + Glucosio/18 (l'urea è un soluto inefficace diffusibile)" }
        ],
        note: "Linee Guida ADA per le emergenze iperglicemiche."
      };
    `
  },

  // 5. NEUROLOGIA AGGIUNTIVI
  {
    id: "mrs-modified-rankin-scale",
    folder: "Scala di Rankin Modificata (mRS)",
    title: "Scala di Rankin Modificata (mRS per Disabilità post-Ictus)",
    category: "neurologia",
    categoryLabel: "Neurologia & Ictus",
    description: "Standard per misurare il grado di disabilità o dipendenza nelle attività quotidiane dopo un ictus cerebrale.",
    tags: ["mrs", "rankin", "ictus", "disabilita", "trombolisi", "trombectomia"],
    inputs: [
      { id: "grade", label: "Grado di Autonomia Funzionale", type: "select", options: [
        {val: "0", label: "0: Nessun sintomo residuo"},
        {val: "1", label: "1: Nessuna disabilità significativa; compie tutte le attività consuete nonostante lievi sintomi"},
        {val: "2", label: "2: Lieve disabilità; non può compiere tutte le attività precedenti ma bada a se stesso senza assistenza"},
        {val: "3", label: "3: Moderata disabilità; richiede qualche aiuto ma deambula senza assistenza"},
        {val: "4", label: "4: Moderatamente grave; incapace di camminare e provvedere alle necessità corporali senza aiuto"},
        {val: "5", label: "5: Grave disabilità; costretto a letto, incontinente, richiede assistenza infermieristica continua"},
        {val: "6", label: "6: Deceduto"}
      ]}
    ],
    calcLogic: `
      const g = parseInt(grade);
      let interp = "Outcome Favorevole / Buona Autonomia (mRS 0-2)"; let color = "#2e7d32";
      if (g >= 5) { interp = "Disabilità Severa / Dipendenza Totale o Decesso"; color = "#c62828"; }
      else if (g >= 3) { interp = "Perdita di Autonomia (mRS 3-4)"; color = "#ea580c"; }
      return {
        mainValue: "mRS " + g,
        mainLabel: "Punteggio Rankin Modificato",
        metrics: [
          { label: "Giudizio di Autonomia", val: interp, color: color },
          { label: "Endpoint Primario Trial Ictus", val: "mRS 0-2 definisce l'indipendenza funzionale a 90 giorni" }
        ],
        note: "van Swieten JC et al. (Stroke 1988)."
      };
    `
  },

  // 6. CHIRURGIA & TRAUMA AGGIUNTIVI
  {
    id: "revised-trauma-score-rts",
    folder: "Revised Trauma Score (RTS)",
    title: "Revised Trauma Score (RTS Fisiologico)",
    category: "rianimazione",
    categoryLabel: "Urgenza, Rianimazione & Trauma",
    description: "Punteggio fisiologico per il triage sul campo e la predizione di sopravvivenza nel politraumatizzato.",
    tags: ["rts", "trauma", "politrauma", "triage", "pronto soccorso", "emergenza"],
    inputs: [
      { id: "gcs", label: "Glasgow Coma Scale", type: "select", options: [{val: "4", label: "GCS 13 - 15 (4 pt)"}, {val: "3", label: "GCS 9 - 12 (3 pt)"}, {val: "2", label: "GCS 6 - 8 (2 pt)"}, {val: "1", label: "GCS 4 - 5 (1 pt)"}, {val: "0", label: "GCS 3 (0 pt)"}] },
      { id: "sbp", label: "Pressione Sistolica", type: "select", options: [{val: "4", label: "> 89 mmHg (4 pt)"}, {val: "3", label: "76 - 89 mmHg (3 pt)"}, {val: "2", label: "50 - 75 mmHg (2 pt)"}, {val: "1", label: "1 - 49 mmHg (1 pt)"}, {val: "0", label: "0 mmHg (0 pt)"}] },
      { id: "rr", label: "Frequenza Respiratoria", type: "select", options: [{val: "4", label: "10 - 29 atti/min (4 pt)"}, {val: "3", label: "> 29 atti/min (3 pt)"}, {val: "2", label: "6 - 9 atti/min (2 pt)"}, {val: "1", label: "1 - 5 atti/min (1 pt)"}, {val: "0", label: "0 atti/min (0 pt)"}] }
    ],
    calcLogic: `
      const triageScore = parseInt(gcs) + parseInt(sbp) + parseInt(rr);
      const rtsPhysio = (0.9368 * parseInt(gcs)) + (0.7326 * parseInt(sbp)) + (0.2908 * parseInt(rr));
      let interp = "RTS Triage = 12: Basso rischio"; let color = "#2e7d32";
      if (triageScore <= 10) {
        interp = "RTS Triage ≤ 10: Trauma Grave / Indicazione al trasferimento in Trauma Center di 2° livello";
        color = "#c62828";
      }
      return {
        mainValue: triageScore + " / 12",
        mainLabel: "Triage RTS Score",
        metrics: [
          { label: "RTS Fisiologico Ponderato", val: rtsPhysio.toFixed(3) + " / 7.84" },
          { label: "Destinazione Triage", val: interp, color: color }
        ],
        note: "Champion HR et al. (J Trauma 1989)."
      };
    `
  },
  {
    id: "score-caprini-tev-chirurgico",
    folder: "Score di Caprini",
    title: "Score di Caprini per Rischio Tromboembolico Chirurgico",
    category: "chirurgia",
    categoryLabel: "Chirurgia & Perioperatorio",
    description: "Stratificazione del rischio di trombosi venosa profonda ed embolia polmonare e guida alla tromboprofilassi.",
    tags: ["caprini", "tev", "tvp", "profilassi", "eparina", "chirurgia"],
    inputs: [
      { id: "age", label: "Età", type: "select", options: [{val: "0", label: "< 41 anni (0 pt)"}, {val: "1", label: "41 - 60 anni (+1 pt)"}, {val: "2", label: "61 - 74 anni (+2 pt)"}, {val: "3", label: "≥ 75 anni (+3 pt)"}] },
      { id: "surg", label: "Tipo di Chirurgia", type: "select", options: [
        {val: "1", label: "Chirurgia minore pianificata (+1 pt)"},
        {val: "2", label: "Chirurgia maggiore (> 45 min o laparotomica) (+2 pt)"},
        {val: "5", label: "Chirurgia ortopedica maggiore (artroprotesi anca/ginocchio, frattura femore) (+5 pt)"}
      ]},
      { id: "immob", label: "Paziente allettato > 72 ore", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] },
      { id: "prevtev", label: "Precedente episodio di TVP / EP", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "malig", label: "Neoplasia maligna attiva o presente", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "2", label: "Sì (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(age) + parseInt(surg) + parseInt(immob) + parseInt(prevtev) + parseInt(malig);
      let risk = "Rischio Basso (Score 1-2)"; let action = "Deambulazione precoce o calze elastiche"; let color = "#2e7d32";
      if (score >= 5) {
        risk = "Altissimo Rischio (Score ≥ 5)"; action = "Tromboprofilassi farmacologica (EBPM) combinata a profilassi meccanica (IPC/calze)"; color = "#c62828";
      } else if (score >= 3) {
        risk = "Alto Rischio (Score 3-4)"; action = "Tromboprofilassi con EBPM raccomandata"; color = "#d97706";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score di Caprini",
        metrics: [
          { label: "Categoria di Rischio TEV", val: risk, color: color },
          { label: "Profilassi Raccomandata", val: action }
        ],
        note: "Caprini JA (Dis Mon 2005)."
      };
    `
  },

  // 7. PEDIATRIA AGGIUNTIVI
  {
    id: "formula-clark-dosaggio-pediatrico",
    folder: "Formula di Clark (Farmaci Pediatrici)",
    title: "Formula di Clark per Dosaggio Farmaci Pediatrici",
    category: "pediatria",
    categoryLabel: "Pediatria & Neonatologia",
    description: "Calcolo della dose pediatrica sicura proporzionata al peso corporeo a partire dalla dose standard dell'adulto.",
    tags: ["clark", "pediatria", "dosaggio", "farmaci", "posologia"],
    inputs: [
      { id: "adultDose", label: "Dose Standard per Adulto", unit: "mg", type: "number", step: "5", min: "1", max: "2000", def: "500" },
      { id: "weight", label: "Peso del Bambino", unit: "kg", type: "number", step: "0.5", min: "2", max: "60", def: "18" }
    ],
    calcLogic: `
      const weightLbs = weight * 2.20462;
      const childDose = (weightLbs / 150) * adultDose;
      return {
        mainValue: Math.round(childDose) + " mg",
        mainLabel: "Dose Pediatrica Calcolata (Clark)",
        metrics: [
          { label: "Rapporto Ponderale", val: (weight / 70 * 100).toFixed(1) + "% della dose per adulto" },
          { label: "Formula di Clark", val: "[Peso (lbs) / 150] * Dose Adulto" }
        ],
        note: "Regola di Clark. Se disponibile il dosaggio specifico in mg/kg/die del foglietto illustrativo, privilegiare sempre quest'ultimo."
      };
    `
  },
  {
    id: "criteri-centor-originali",
    folder: "Criteri di Centor Classici",
    title: "Criteri di Centor Classici per Faringite",
    category: "pediatria",
    categoryLabel: "Pediatria & Infettivologia",
    description: "Score originale a 4 elementi per la stima della probabilità di faringite da streptococco beta-emolitico nell'adulto.",
    tags: ["centor", "faringite", "gola", "tonsille", "streptococco"],
    inputs: [
      { id: "fever", label: "Febbre riferita o misurata > 38°C", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "exudate", label: "Essudato o placche tonsillari", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "nodes", label: "Linfoadenopatia cervicale anteriore dolente", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "nocough", label: "Assenza di tosse", type: "select", options: [{val: "0", label: "No (tosse presente = 0 pt)"}, {val: "1", label: "Sì (assenza tosse = +1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(fever) + parseInt(exudate) + parseInt(nodes) + parseInt(nocough);
      let prob = "Bassa probabilità (2 - 6%)"; let color = "#2e7d32";
      if (score === 4) { prob = "Probabilità Elevata (39 - 56%) - Trattamento o test rapido raccomandato"; color = "#c62828"; }
      else if (score === 3) { prob = "Probabilità Moderata (28 - 35%)"; color = "#d97706"; }
      else if (score === 2) { prob = "Probabilità 11 - 17%"; }
      return {
        mainValue: score + " / 4 Criteri",
        mainLabel: "Score di Centor Originale",
        metrics: [
          { label: "Probabilità Infezione Streptococcica", val: prob, color: color }
        ],
        note: "Centor RM et al. (Med Decis Making 1981)."
      };
    `
  }
];

// Generazione file
const calcolatoriDir = path.join(__dirname, 'App', 'Calcolatori');

let count = 0;
FINAL_BATCH.forEach(calc => {
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

console.log(`Generati ulteriori ${count} calcolatori finali!`);

// Aggiorna catalogo
const sharedDataFile = path.join(__dirname, 'App', 'shared', 'calculators-data.js');
const sharedData = require(sharedDataFile);
const existingIds = new Set(sharedData.CALCULATORS.map(c => c.id));

FINAL_BATCH.forEach(calc => {
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
console.log(`🎉 OBIETTIVO RAGGIUNTO! Totale complessivo calcolatori nel catalogo: ${sharedData.CALCULATORS.length}`);
