const fs = require('fs');
const path = require('path');

const INFECT_CALCS = [
  {
    id: "dosaggio-vancomicina-auc",
    folder: "Dosaggio Vancomicina (AUC-MIC)",
    title: "Dosaggio Vancomicina & Target Trough / AUC/MIC",
    category: "infettivologia",
    categoryLabel: "Infettivologia & Antibiotici",
    description: "Calcolo della dose di carico e di mantenimento di vancomicina EV e monitoraggio del livello di valle (trough) e AUC/MIC (target 400-600).",
    tags: ["vancomicina", "antibiotici", "auc", "trough", "mrsa", "farmacocinetica", "creatinina"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "30", max: "200", def: "70" },
      { id: "crcl", label: "Clearance Creatinina (CrCl)", unit: "mL/min", type: "number", step: "1", min: "10", max: "160", def: "75" },
      { id: "severity", label: "Gravità dell'Infezione", type: "select", options: [
        {val: "severe", label: "Infezione Grave (Sepsi, Polmonite MRSA, Endocardite, Osteomielite, Meningite)"},
        {val: "mild", label: "Infezione Lieve-Moderata (Infezione cutanea/tessuti molli non complicata, IVU)"}
      ]}
    ],
    calcLogic: `
      const isSevere = severity === "severe";
      const loadingDose = Math.min(3000, Math.round(weight * (isSevere ? 25 : 20))); // 20-25 mg/kg fino a max 3000 mg
      
      let intervalHours = 12;
      let maintenanceMg = Math.round(weight * 15); // 15-20 mg/kg
      if (crcl < 20) { intervalHours = 48; }
      else if (crcl < 50) { intervalHours = 24; }
      else if (crcl < 90) { intervalHours = 12; }
      else { intervalHours = 8; }

      // Arrotonda ai 250 mg più vicini
      maintenanceMg = Math.round(maintenanceMg / 250) * 250;
      if (maintenanceMg < 500) maintenanceMg = 500;
      if (maintenanceMg > 2000) maintenanceMg = 2000;

      const targetTrough = isSevere ? "15 - 20 mcg/mL" : "10 - 15 mcg/mL";
      const targetAuc = "AUC/MIC = 400 - 600 mg·h/L (con MIC presunta = 1 mg/L)";

      return {
        mainValue: loadingDose + " mg Carico / " + maintenanceMg + " mg q" + intervalHours + "h",
        mainLabel: "Schema Posologico Vancomicina",
        metrics: [
          { label: "Dose di Carico Iniziale (Loading)", val: loadingDose + " mg EV (in almeno 2 ore)", color: "#0277bd" },
          { label: "Dose di Mantenimento", val: maintenanceMg + " mg ogni " + intervalHours + " ore", color: "#2e7d32" },
          { label: "Target Trough (Livello di Valle)", val: targetTrough },
          { label: "Target Farmacocinetico IDSA", val: targetAuc },
          { label: "Timing Prelievo Trough", val: "Subito prima della 4ª o 5ª somministrazione (allo steady-state)" }
        ],
        note: "Linee Guida di Consenso IDSA/ASHP/SIDP 2020 per il monitoraggio terapeutico della vancomicina."
      };
    `
  },
  {
    id: "dosaggio-aminoglicosidi-hartford",
    folder: "Dosaggio Aminoglicosidi (Hartford)",
    title: "Dosaggio Aminoglicosidi a Somministrazione Giornaliera Singola (Hartford)",
    category: "infettivologia",
    categoryLabel: "Infettivologia & Antibiotici",
    description: "Metodo a dose estesa una volta al giorno per Gentamicina e Tobramicina (7 mg/kg) o Amikacina (15 mg/kg).",
    tags: ["aminoglicosidi", "gentamicina", "tobramicina", "amikacina", "hartford", "antibiotici"],
    inputs: [
      { id: "drug", label: "Aminoglicoside Selezionato", type: "select", options: [
        {val: "genta", label: "Gentamicina / Tobramicina (7 mg/kg/die)"},
        {val: "amika", label: "Amikacina (15 mg/kg/die)"}
      ]},
      { id: "weight", label: "Peso Corporeo (o Peso Aggiustato se obeso)", unit: "kg", type: "number", step: "0.5", min: "30", max: "200", def: "70" },
      { id: "crcl", label: "Clearance Creatinina (CrCl)", unit: "mL/min", type: "number", step: "1", min: "15", max: "150", def: "80" }
    ],
    calcLogic: `
      const isAmika = drug === "amika";
      const mgPerKg = isAmika ? 15 : 7;
      let totalDose = Math.round(weight * mgPerKg);
      totalDose = Math.round(totalDose / 50) * 50;

      let interval = 24;
      let interp = "Intervallo standard ogni 24 ore";
      let color = "#2e7d32";

      if (crcl < 20) {
        interp = "CrCl < 20 mL/min: Metodo dose singola estesa NON raccomandato (usare dosaggio tradizionale con monitoraggio picco/valle)";
        color = "#c62828";
      } else if (crcl < 40) {
        interval = 48;
        interp = "CrCl 20-39 mL/min: Intervallo esteso ogni 48 ore";
        color = "#ea580c";
      } else if (crcl < 60) {
        interval = 36;
        interp = "CrCl 40-59 mL/min: Intervallo esteso ogni 36 ore";
        color = "#d97706";
      }

      return {
        mainValue: totalDose + " mg ogni " + interval + "h",
        mainLabel: "Dose Aminoglicoside Hartford",
        metrics: [
          { label: "Dose Totale Calcolata", val: totalDose + " mg (" + mgPerKg + " mg/kg)" },
          { label: "Intervallo di Somministrazione", val: "Ogni " + interval + " ore", color: color },
          { label: "Timing Monitoraggio Plasmatico", val: "Dosare la concentrazione sierica tra 6 e 14 ore dopo la fine dell'infusione" },
          { label: "Nomogramma", val: interp }
        ],
        note: "Nicolau DP et al. (Antimicrob Agents Chemother 1995). Massimizza l'effetto battericida concentrazione-dipendente e minimizza la nefrotossicità."
      };
    `
  },
  {
    id: "clostridioides-difficile-idsa",
    folder: "Gravità Clostridioides Difficile",
    title: "Classificazione di Gravità Infezione da C. difficile (IDSA / SHEA)",
    category: "infettivologia",
    categoryLabel: "Infettivologia & Antibiotici",
    description: "Stratificazione di gravità dell'infezione da Clostridioides difficile per la scelta della terapia (Fidaxomicina vs Vancomicina orale).",
    tags: ["clostridioides", "difficile", "colite", "vancomicina", "fidaxomicina", "diarrea"],
    inputs: [
      { id: "wbc", label: "Leucociti Ematici (WBC)", unit: "/µL", type: "number", step: "100", min: "1000", max: "80000", def: "12500" },
      { id: "creat", label: "Creatinina Sierica Attuale", unit: "mg/dL", type: "number", step: "0.1", min: "0.4", max: "15", def: "1.2" },
      { id: "creatBase", label: "Creatinina Sierica Basale del Paziente", unit: "mg/dL", type: "number", step: "0.1", min: "0.4", max: "15", def: "0.9" },
      { id: "fulminant", label: "Presenza di Ipotensione, Shock, Ileo o Megacolon Tossico", type: "select", options: [
        {val: "0", label: "No"},
        {val: "1", label: "Sì"}
      ]}
    ],
    calcLogic: `
      const isSevere = (wbc >= 15000) || (creat >= 1.5 * creatBase) || (creat >= 1.5);
      const isFulminant = fulminant === "1";

      let classe = "NON SEVERA (Lieve - Moderata)";
      let therapy = "Fidaxomicina 200 mg x2/die per 10 giorni (prima scelta) OPPURE Vancomicina orale 125 mg x4/die per 10 giorni";
      let color = "#2e7d32";

      if (isFulminant) {
        classe = "FULMINANTE";
        therapy = "Vancomicina orale 500 mg x4/die (via SNG o clisteri se ileo) + Metronidazolo 500 mg x3/die EV + Valutazione Chirurgica urgente";
        color = "#c62828";
      } else if (isSevere) {
        classe = "SEVERA";
        therapy = "Fidaxomicina 200 mg x2/die per 10 giorni (prima scelta) OPPURE Vancomicina orale 125 mg x4/die per 10 giorni";
        color = "#ea580c";
      }

      return {
        mainValue: classe,
        mainLabel: "Gravità Infezione C. difficile",
        metrics: [
          { label: "Criteri Laboratorio", val: "WBC: " + wbc + "/µL | Creatinina: " + creat + " mg/dL" },
          { label: "Terapia Raccomandata IDSA 2021", val: therapy, color: color },
          { label: "Avvertenza Metronidazolo", val: "Metronidazolo orale non è più raccomandato come prima linea se disponibili vancomicina o fidaxomicina." }
        ],
        note: "Linee Guida IDSA/SHEA 2021 per l'infezione da Clostridioides difficile negli adulti."
      };
    `
  },
  {
    id: "peritonite-batterica-spontanea-sbp",
    folder: "Peritonite Batterica Spontanea (SBP)",
    title: "Diagnosi di Peritonite Batterica Spontanea (SBP)",
    category: "infettivologia",
    categoryLabel: "Infettivologia & Antibiotici",
    description: "Criterio citologico cardine per l'infezione del liquido ascitico nel paziente cirrotico e indicazione ad antibiotico ed albumina EV.",
    tags: ["sbp", "ascite", "peritonite", "cirrosi", "albumina", "cefotaxime", "neutrofili"],
    inputs: [
      { id: "pmf", label: "Neutrofili Polimorfonucleati (PMN) nel Liquido Ascitico", unit: "cellule/µL (o mm³)", type: "number", step: "10", min: "5", max: "20000", def: "320" },
      { id: "culture", label: "Esito Esame Colturale Liquido Ascitico", type: "select", options: [
        {val: "pending", label: "In corso / Non ancora disponibile"},
        {val: "pos", label: "Positivo (Monocinetica tipica)"},
        {val: "neg", label: "Negativo"}
      ]},
      { id: "sCr", label: "Creatinina Sierica", unit: "mg/dL", type: "number", step: "0.1", min: "0.4", max: "10", def: "1.3" },
      { id: "sBili", label: "Bilirubina Totale", unit: "mg/dL", type: "number", step: "0.1", min: "0.2", max: "30", def: "3.5" }
    ],
    calcLogic: `
      const isSbp = pmf >= 250;
      let diag = isSbp ? "SBP CONFERMATA (PMN ≥ 250/µL)" : "SBP non presente (PMN < 250/µL)";
      let color = isSbp ? "#c62828" : "#2e7d32";
      let therapy = isSbp ? "Avviare immediatamente Cefalosporina di 3ª generazione (es. Cefotaxime 2g x3/die EV o Ceftriaxone 2g/die EV)" : "Nessuna terapia antibiotica empirica necessaria";
      
      const needAlbumin = isSbp && (sCr > 1.0 || sBili > 4.0);
      let albTherapy = needAlbumin ? "INDICATA ALBUMINA EV: 1.5 g/kg entro 6h dalla diagnosi, seguita da 1.0 g/kg al giorno 3 (previene la sindrome epatorenale e riduce la mortalità)" : "Albumina EV non mandatoria ma raccomandata se compromissione renale";

      return {
        mainValue: isSbp ? "SBP POSITIVA (≥ 250 PMN)" : "NEGATIVA",
        mainLabel: "Esito Diagnostico Paracentesi",
        metrics: [
          { label: "Diagnosi", val: diag, color: color },
          { label: "Terapia Antibiotica Empirica", val: therapy },
          { label: "Protocollo Albumina EV (Sort et al.)", val: albTherapy, color: needAlbumin ? "#0277bd" : "#475569" }
        ],
        note: "Linee Guida EASL/AASLD Ascite e SBP. Conta PMN ≥ 250/µL pone indicazione mandatoria al trattamento senza attendere l'esito colturale."
      };
    `
  },
  {
    id: "classificazione-eron-infezioni-cutanee",
    folder: "Classificazione di Eron (Cellulite)",
    title: "Classificazione di Eron per Infezioni Cutanee e dei Tessuti Molli (SSTI)",
    category: "infettivologia",
    categoryLabel: "Infettivologia & Antibiotici",
    description: "Guida clinica per la scelta del setting di cura (ambulatoriale orale vs ricovero EV) nella cellulite ed erisipela.",
    tags: ["eron", "cellulite", "erisipela", "infezione cutanea", "ssti", "antibiotico"],
    inputs: [
      { id: "classVal", label: "Quadro Clinico e Sistemico del Paziente", type: "select", options: [
        {val: "1", label: "Classe I: Infezione localizzata, nessun segno di tossicità sistemica, nessuna comorbilità instabile"},
        {val: "2", label: "Classe II: Tossicità sistemica lieve (febbre isolata) OPPURE comorbilità controllata che può complicare la guarigione (es. diabete, obesità, insufficienza venosa)"},
        {val: "3", label: "Classe III: Tossicità sistemica significativa (febbre elevata, tachicardia, tachipnea, confusione) OPPURE comorbilità instabile/scompensata"},
        {val: "4", label: "Classe IV: Sepsi / Shock settico OPPURE sospetta infezione necrotizzante dei tessuti molli (fascite necrotizzante, bolle emorragiche, crepitio, dolore sproporzionato)"}
      ]}
    ],
    calcLogic: `
      const cl = classVal;
      let setting = ""; let therapy = ""; let color = "#2e7d32";
      if (cl === "1") {
        setting = "Trattamento Ambulatoriale / Domiciliare";
        therapy = "Antibiotico orale attivo su streptococchi e stafilococchi (es. Amoxicillina/Clavulanico, Cefalexina o Clindamicina)";
      } else if (cl === "2") {
        setting = "Ambulatoriale protetto / Breve osservazione";
        therapy = "Terapia orale o dose iniziale EV singola (es. Ceftriaxone) con stretto follow-up a 24-48 ore";
        color = "#d97706";
      } else if (cl === "3") {
        setting = "RICOVERO OSPEDALIERO";
        therapy = "Antibioticoterapia endovenosa ad ampio spettro (es. Cefazolina, Amoxicillina/Clavulanico EV, o Vancomicina se sospetto MRSA)";
        color = "#ea580c";
      } else {
        setting = "EMERGENZA / TERAPIA INTENSIVA & CHIRURGIA";
        therapy = "CONSULENZA CHIRURGICA URGENTE per sbrigliamento (debridement) immediato + Antibiotici EV ad ampissimo spettro con blocco tossinico (Meropenem + Vancomicina + Clindamicina)";
        color = "#c62828";
      }

      return {
        mainValue: "Classe Eron " + cl,
        mainLabel: "Grado di Gravità Eron SSTI",
        metrics: [
          { label: "Setting di Cura Raccomandato", val: setting, color: color },
          { label: "Strategia Antibiotica", val: therapy }
        ],
        note: "Eron LJ et al. (J Antimicrob Chemother 2003). Standard di riferimento per il triage delle infezioni cutanee."
      };
    `
  },
  {
    id: "psi-port-score-polmonite",
    folder: "Pneumonia Severity Index (PSI-PORT)",
    title: "Pneumonia Severity Index (Score PSI / PORT)",
    category: "infettivologia",
    categoryLabel: "Infettivologia & Antibiotici",
    description: "Stratificazione prognostica a 5 classi di rischio di mortalità a 30 giorni per polmonite acquisita in comunità.",
    tags: ["psi", "port", "polmonite", "cap", "infezione", "antibiotico", "ospedale"],
    inputs: [
      { id: "age", label: "Età", unit: "anni", type: "number", step: "1", min: "18", max: "105", def: "65" },
      { id: "gender", label: "Sesso", type: "select", options: [{val: "0", label: "Maschio"}, {val: "-10", label: "Femmina (-10 pt)"}] },
      { id: "nursing", label: "Residente in RSA / Casa di riposo", type: "select", options: [{val: "0", label: "No"}, {val: "10", label: "Sì (+10 pt)"}] },
      { id: "neoplasm", label: "Neoplasia attiva", type: "select", options: [{val: "0", label: "No"}, {val: "30", label: "Sì (+30 pt)"}] },
      { id: "liver", label: "Epatopatia nota", type: "select", options: [{val: "0", label: "No"}, {val: "20", label: "Sì (+20 pt)"}] },
      { id: "chf", label: "Scompenso cardiaco noto", type: "select", options: [{val: "0", label: "No"}, {val: "10", label: "Sì (+10 pt)"}] },
      { id: "cva", label: "Pregresso ictus / vasculopatia cerebrale", type: "select", options: [{val: "0", label: "No"}, {val: "10", label: "Sì (+10 pt)"}] },
      { id: "renal", label: "Nefropatia cronica", type: "select", options: [{val: "0", label: "No"}, {val: "10", label: "Sì (+10 pt)"}] },
      { id: "rr", label: "Frequenza Respiratoria ≥ 30 atti/min", type: "select", options: [{val: "0", label: "No"}, {val: "20", label: "Sì (+20 pt)"}] },
      { id: "sbp", label: "Pressione Sistolica < 90 mmHg", type: "select", options: [{val: "0", label: "No"}, {val: "20", label: "Sì (+20 pt)"}] },
      { id: "temp", label: "Temperatura < 35°C o ≥ 40°C", type: "select", options: [{val: "0", label: "No"}, {val: "15", label: "Sì (+15 pt)"}] },
      { id: "hr", label: "Frequenza Cardiaca ≥ 125 bpm", type: "select", options: [{val: "0", label: "No"}, {val: "10", label: "Sì (+10 pt)"}] }
    ],
    calcLogic: `
      let pts = age + parseInt(gender) + parseInt(nursing) + parseInt(neoplasm) + parseInt(liver) + parseInt(chf) + parseInt(cva) + parseInt(renal) + parseInt(rr) + parseInt(sbp) + parseInt(temp) + parseInt(hr);
      let classe = ""; let mort = ""; let setting = ""; let color = "#2e7d32";
      if (pts <= 70) {
        classe = "Classe II (Punteggio ≤ 70)"; mort = "0.6% mortalità"; setting = "Trattamento ambulatoriale sicuro";
      } else if (pts <= 90) {
        classe = "Classe III (Punteggio 71 - 90)"; mort = "0.9 - 2.8% mortalità"; setting = "Osservazione breve o ricovero breve"; color = "#d97706";
      } else if (pts <= 130) {
        classe = "Classe IV (Punteggio 91 - 130)"; mort = "8.2 - 9.3% mortalità"; setting = "Ricovero ospedaliero ordinario"; color = "#ea580c";
      } else {
        classe = "Classe V (Punteggio > 130)"; mort = "27 - 31% mortalità"; setting = "Ricovero ospedaliero urgente (valutare Terapia Intensiva)"; color = "#c62828";
      }
      return {
        mainValue: pts + " Punti (" + classe + ")",
        mainLabel: "Score PSI / PORT",
        metrics: [
          { label: "Mortalità a 30 Giorni", val: mort, color: color },
          { label: "Setting di Cura Raccomandato", val: setting }
        ],
        note: "Fine MJ et al. (NEJM 1997). Pneumonia Severity Index raccomandato dalle linee guida ATS/IDSA."
      };
    `
  }
];

// Genera i file
const calcolatoriDir = path.join(__dirname, 'App', 'Calcolatori');

INFECT_CALCS.forEach(calc => {
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
});

console.log('Calcolatori infettivologici generati con successo!');

// Aggiorna calculators-data.js
const sharedDataFile = path.join(__dirname, 'App', 'shared', 'calculators-data.js');
const sharedData = require(sharedDataFile);

// Inoltre colleghiamo anche i calcolatori pertinenti già creati (es. Centor e Duke) alla categoria infettivologia se utile
sharedData.CALCULATORS.forEach(c => {
  if (c.id === 'criteri-duke-endocardite' || c.id === 'criteri-centor-originali') {
    c.category = 'infettivologia';
    c.categoryLabel = 'Infettivologia & Antibiotici';
  }
});

const existingIds = new Set(sharedData.CALCULATORS.map(c => c.id));

INFECT_CALCS.forEach(calc => {
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
console.log(`Aggiornato catalogo! Calcolatori con categoria infettivologia: ${sharedData.CALCULATORS.filter(c => c.category === 'infettivologia').length}`);
