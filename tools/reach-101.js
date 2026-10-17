const fs = require('fs');
const path = require('path');

const EXTRA_10 = [
  {
    id: "formula-ganzoni-deficit-ferro",
    folder: "Deficit di Ferro (Formula di Ganzoni)",
    title: "Deficit Totale di Ferro (Formula di Ganzoni)",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Calcolo del ferro elementare endovenoso totale (mg) per correggere l'anemia sideropenica e ripristinare i depositi.",
    tags: ["ganzoni", "ferro", "sideropenia", "anemia", "ferritina", "carbossimaltosio"],
    inputs: [
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "20", max: "200", def: "65" },
      { id: "hbCurr", label: "Emoglobina Attuale (Hb)", unit: "g/dL", type: "number", step: "0.1", min: "3", max: "15", def: "8.5" },
      { id: "hbTarget", label: "Emoglobina Target", unit: "g/dL", type: "number", step: "0.5", min: "10", max: "16", def: "14" },
      { id: "depot", label: "Quota Deposito di Ferro", unit: "mg", type: "number", step: "50", min: "100", max: "1000", def: "500" }
    ],
    calcLogic: `
      const deltaHb = Math.max(0, hbTarget - hbCurr);
      const totalIron = (weight * deltaHb * 2.4) + depot;
      return {
        mainValue: Math.round(totalIron) + " mg di Ferro Elementare",
        mainLabel: "Dose Totale di Ferro EV Necessaria",
        metrics: [
          { label: "Formula di Ganzoni", val: "Peso * (Hb_target - Hb_attuale) * 2.4 + Depositi" },
          { label: "Fabbisogno per la sola Massa Emoglobinica", val: Math.round(weight * deltaHb * 2.4) + " mg" },
          { label: "Riserva di Deposito Reintegrata", val: depot + " mg" }
        ],
        note: "Ganzoni AM (Schweiz Med Wochenschr 1970). Utilizzata per la prescrizione di ferro carbossimaltosio o saccarato EV."
      };
    `
  },
  {
    id: "indice-de-ritis-ast-alt",
    folder: "Rapporto AST-ALT (Indice di De Ritis)",
    title: "Rapporto AST / ALT (Indice di De Ritis)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Diagnosi differenziale delle epatopatie acute e croniche (alcolica vs non alcolica / virale).",
    tags: ["de ritis", "ast", "alt", "transaminasi", "epatite", "alcol", "cirrosi"],
    inputs: [
      { id: "ast", label: "AST (GOT)", unit: "U/L", type: "number", step: "1", min: "5", max: "5000", def: "120" },
      { id: "alt", label: "ALT (GPT)", unit: "U/L", type: "number", step: "1", min: "5", max: "5000", def: "55" }
    ],
    calcLogic: `
      const ratio = ast / alt;
      let interp = "Rapporto AST/ALT < 1: Tipico di NAFLD/MASLD, epatite virale cronica o danno epatico precoce"; let color = "#2e7d32";
      if (ratio >= 2.0) {
        interp = "Rapporto AST/ALT ≥ 2.0: Altamente suggestivo di Epatopatia Alcolica o Cirrosi avanzata";
        color = "#c62828";
      } else if (ratio > 1.0) {
        interp = "Rapporto AST/ALT 1.0 - 2.0: Possibile progressione verso fibrosi avanzata o cirrosi";
        color = "#d97706";
      }
      return {
        mainValue: ratio.toFixed(2),
        mainLabel: "Rapporto AST / ALT",
        metrics: [
          { label: "Quadro Eziologico", val: interp, color: color },
          { label: "Valore Fisiologico Normale", val: "~ 0.8" }
        ],
        note: "De Ritis F et al. (Minerva Med 1957). Nei mitocondri la frazione AST è predominante, da cui il rilascio massivo nel danno etilico necrotico."
      };
    `
  },
  {
    id: "gap-osmotico-fecale-diarrea",
    folder: "Gap Osmotico Fecale",
    title: "Gap Osmotico Fecale (Diarrea Osmotica vs Secretoria)",
    category: "gastro",
    categoryLabel: "Gastroenterologia & Epatologia",
    description: "Differenziazione etiopatogenetica della diarrea cronica.",
    tags: ["diarrea", "gap osmotico", "feci", "malassorbimento", "lassativi"],
    inputs: [
      { id: "fNa", label: "Sodio nel Liquido Fecale", unit: "mEq/L", type: "number", step: "1", min: "5", max: "150", def: "30" },
      { id: "fK", label: "Potassio nel Liquido Fecale", unit: "mEq/L", type: "number", step: "1", min: "5", max: "150", def: "20" }
    ],
    calcLogic: `
      const gap = 290 - (2 * (fNa + fK));
      let interp = ""; let color = "#2e7d32";
      if (gap > 100) {
        interp = "Diarrea OSMOTICA (Gap > 100 mOsm/kg): Presenza di soluti non assorbiti nel lume (es. deficit di lattasi/lattosio, celiachia, lassativi osmotici). La diarrea cessa con il digiuno.";
        color = "#0277bd";
      } else if (gap < 50) {
        interp = "Diarrea SECRETORIA (Gap < 50 mOsm/kg): Secrezione attiva di elettroliti (es. tossine batteriche, VIPoma, sindrome da carcinoide, acidi biliari). La diarrea persiste anche a digiuno.";
        color = "#c62828";
      } else {
        interp = "Gap Intermedio (50 - 100 mOsm/kg): Quadro misto.";
        color = "#d97706";
      }
      return {
        mainValue: Math.round(gap) + " mOsm/kg",
        mainLabel: "Gap Osmotico Fecale",
        metrics: [
          { label: "Classificazione Eziologica", val: interp, color: color },
          { label: "Osmolarità Fecale Presunta", val: "290 mOsm/kg (Isotonica al plasma)" }
        ],
        note: "Gap = 290 - 2 * (Na_fecale + K_fecale)."
      };
    `
  },
  {
    id: "indice-mehran-nefropatia-contrasto",
    folder: "Score di Mehran (Nefropatia da Contrasto)",
    title: "Score di Mehran per Nefropatia da Mezzo di Contrasto (CIN)",
    category: "nefrologia",
    categoryLabel: "Nefrologia & Elettroliti",
    description: "Stratificazione del rischio di danno renale acuto (CIN) e dialisi dopo procedura coronarica percutanea.",
    tags: ["mehran", "cin", "contrasto", "angioplastica", "insufficienza renale"],
    inputs: [
      { id: "hypo", label: "Ipotensione periprocedurale (PAS < 90 mmHg con supporto inotropo/IABP)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "5", label: "Sì (+5 pt)"}] },
      { id: "iabp", label: "Uso di contropulsatore aortico (IABP)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "5", label: "Sì (+5 pt)"}] },
      { id: "chf", label: "Scompenso cardiaco NYHA III/IV o edema polmonare", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "5", label: "Sì (+5 pt)"}] },
      { id: "age", label: "Età > 75 anni", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "4", label: "Sì (+4 pt)"}] },
      { id: "anemia", label: "Anemia pre-procedura (Ht < 39% uomo, < 36% donna)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "dm", label: "Diabete Mellito", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "3", label: "Sì (+3 pt)"}] },
      { id: "vol", label: "Volume Mezzo di Contrasto somministrato (1 pt ogni 100 mL)", type: "select", options: [{val: "1", label: "100 mL (+1 pt)"}, {val: "2", label: "200 mL (+2 pt)"}, {val: "3", label: "300 mL (+3 pt)"}, {val: "4", label: "≥ 400 mL (+4 pt)"}] },
      { id: "egfr", label: "eGFR basale", type: "select", options: [{val: "0", label: "> 60 mL/min (0 pt)"}, {val: "2", label: "40 - 60 mL/min (+2 pt)"}, {val: "4", label: "20 - 39 mL/min (+4 pt)"}, {val: "6", label: "< 20 mL/min (+6 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(hypo) + parseInt(iabp) + parseInt(chf) + parseInt(age) + parseInt(anemia) + parseInt(dm) + parseInt(vol) + parseInt(egfr);
      let riskCin = ""; let riskDial = ""; let color = "#2e7d32";
      if (score <= 5) { riskCin = "7.5% rischio CIN"; riskDial = "0.04% rischio dialisi"; }
      else if (score <= 10) { riskCin = "14.0% rischio CIN"; riskDial = "0.12% rischio dialisi"; color = "#d97706"; }
      else if (score <= 15) { riskCin = "26.1% rischio CIN"; riskDial = "1.09% rischio dialisi"; color = "#ea580c"; }
      else { riskCin = "57.3% rischio CIN"; riskDial = "12.6% rischio dialisi (Altissimo)"; color = "#c62828"; }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score di Mehran",
        metrics: [
          { label: "Rischio di Danno Renale da Mezzo di Contrasto", val: riskCin, color: color },
          { label: "Rischio di Necessità di Dialisi", val: riskDial }
        ],
        note: "Mehran R et al. (J Am Coll Cardiol 2004)."
      };
    `
  },
  {
    id: "karnofsky-performance-scale",
    folder: "Scala di Karnofsky (KPS)",
    title: "Scala di Karnofsky Performance Status (KPS)",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Scala percentuale (0-100%) di quantificazione dell'autonomia funzionale e prognosi del paziente.",
    tags: ["karnofsky", "kps", "performance status", "oncologia", "cure palliative"],
    inputs: [
      { id: "scoreVal", label: "Livello di Capacità Funzionale", type: "select", options: [
        {val: "100", label: "100%: Normale, nessun sintomo o evidenza di malattia"},
        {val: "90", label: "90%: In grado di svolgere attività normali con lievi sintomi"},
        {val: "80", label: "80%: Attività normale con sforzo; qualche sintomo"},
        {val: "70", label: "70%: Si prende cura di sé; incapace di attività lavorativa normale"},
        {val: "60", label: "60%: Richiede assistenza occasionale, ma provvede ai bisogni personali"},
        {val: "50", label: "50%: Richiede notevole assistenza e frequenti cure mediche"},
        {val: "40", label: "40%: Disabile; richiede cure e assistenza speciale continua"},
        {val: "30", label: "30%: Gravemente disabile; ospedalizzazione indicata"},
        {val: "20", label: "20%: Molto grave; necessario ricovero per supporto attivo"},
        {val: "10", label: "10%: Moribondo"},
        {val: "0", label: "0%: Deceduto"}
      ]}
    ],
    calcLogic: `
      const k = parseInt(scoreVal);
      let interp = "Autonomia completa / Capace di lavorare (80-100%)"; let color = "#2e7d32";
      if (k < 50) { interp = "Incapace di badare a se stesso / Ospedalizzazione (10-40%)"; color = "#c62828"; }
      else if (k <= 70) { interp = "Incapace di lavorare; autonomia personale parziale (50-70%)"; color = "#d97706"; }
      return {
        mainValue: k + " %",
        mainLabel: "Punteggio Karnofsky (KPS)",
        metrics: [
          { label: "Livello di Autonomia Clinica", val: interp, color: color },
          { label: "Equivalente ECOG Stimato", val: k >= 90 ? "ECOG 0-1" : k >= 70 ? "ECOG 1-2" : k >= 50 ? "ECOG 2-3" : "ECOG 3-4" }
        ],
        note: "Karnofsky DA & Burchenal JH (1949)."
      };
    `
  },
  {
    id: "volume-plasmatico-totale",
    folder: "Volume Plasmatico Totale",
    title: "Volume Plasmatico & Ematico Totale Stimato (Kaplan)",
    category: "ematologia",
    categoryLabel: "Ematologia & Oncologia",
    description: "Stima del volume plasmatico per il calcolo delle sedute di plasmaferesi e scambio plasmatico terapeutico (TPE).",
    tags: ["volume plasmatico", "plasmaferesi", "ematocrito", "aferesi", "sangue"],
    inputs: [
      { id: "gender", label: "Sesso", type: "select", options: [{val: "m", label: "Uomo"}, {val: "f", label: "Donna"}] },
      { id: "weight", label: "Peso Corporeo", unit: "kg", type: "number", step: "0.5", min: "20", max: "200", def: "70" },
      { id: "hct", label: "Ematocrito (Hct)", unit: "%", type: "number", step: "1", min: "15", max: "65", def: "42" }
    ],
    calcLogic: `
      const volEmaticoMlKg = gender === "m" ? 70 : 65;
      const volEmaticoTotale = weight * volEmaticoMlKg; // mL
      const volPlasmatico = volEmaticoTotale * (1 - (hct / 100));
      return {
        mainValue: (volPlasmatico / 1000).toFixed(2) + " Litri",
        mainLabel: "Volume Plasmatico Stimato",
        metrics: [
          { label: "Volume Plasmatico in mL", val: Math.round(volPlasmatico) + " mL" },
          { label: "Volume Ematico Totale (TBV)", val: (volEmaticoTotale / 1000).toFixed(2) + " Litri (" + volEmaticoMlKg + " mL/kg)" },
          { label: "Volume per 1 Plasma Exchange (1.0-1.5 volumi)", val: Math.round(volPlasmatico) + " - " + Math.round(volPlasmatico * 1.5) + " mL" }
        ],
        note: "Formula di Kaplan per procedure di Plasmaferesi (ASFA Guidelines)."
      };
    `
  },
  {
    id: "criteri-ottawa-trauma-cranico",
    folder: "Criteri di Ottawa Trauma Cranico",
    title: "Criteri di Ottawa per Trauma Cranico (CCHR)",
    category: "neurologia",
    categoryLabel: "Neurologia & Urgenza",
    description: "Regola clinica predittiva validata per decidere la necessità di eseguire la TC encefalo nel trauma cranico lieve.",
    tags: ["ottawa", "cchr", "trauma cranico", "tc encefalo", "vomito", "amnesia"],
    inputs: [
      { id: "gcs", label: "GCS < 15 a 2 ore dal trauma", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "fracture", label: "Sospetto di frattura cranica aperta o depressa", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "basilar", label: "Segni di frattura della base cranica (emotimpano, occhi da procione, Battle sign, liquorrea)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "vomit", label: "≥ 2 episodi di vomito", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "age", label: "Età ≥ 65 anni", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "amnesia", label: "Amnesia retrograda per gli eventi > 30 minuti prima del trauma", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "mech", label: "Dinamica traumatica pericolosa (investimento pedone, espulsione da veicolo, caduta > 1 metro o > 5 gradini)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] }
    ],
    calcLogic: `
      const isHighRisk = (gcs === "1" || fracture === "1" || basilar === "1" || vomit === "1" || age === "1");
      const isMedRisk = (amnesia === "1" || mech === "1");
      let interp = "Nessun criterio presente: TC encefalo non necessaria (Sensibilità 100% per lesioni neurochirurgiche)"; let color = "#2e7d32";
      if (isHighRisk) {
        interp = "ALTO RISCHIO di intervento neurochirurgico: TC ENCEFALO URGENTE MANDATORIA";
        color = "#c62828";
      } else if (isMedRisk) {
        interp = "RISCHIO MEDIO di lesione cerebrale significativa: TC Encefalo indicata";
        color = "#ea580c";
      }
      return {
        mainValue: (isHighRisk || isMedRisk) ? "TC ENCEFALO INDICATA" : "TC NON INDICATA",
        mainLabel: "Esito Regola CCHR di Ottawa",
        metrics: [
          { label: "Indicazione Radiologica", val: interp, color: color }
        ],
        note: "Stiell IG et al. (Lancet 2001). CCHR: Canadian CT Head Rule."
      };
    `
  },
  {
    id: "score-downes-croup",
    folder: "Score di Downes per Croup",
    title: "Score di Downes per Croup e Laringotracheite",
    category: "pediatria",
    categoryLabel: "Pediatria & Neonatologia",
    description: "Valutazione clinica dell'ostruzione laringea acuta e indicazione all'adrenalina aerosolica e cortisonico.",
    tags: ["downes", "croup", "laringite", "stridore", "pediatria", "adrenalina"],
    inputs: [
      { id: "stridor", label: "Stridore Inspiratorio", type: "select", options: [{val: "0", label: "Assente (0 pt)"}, {val: "1", label: "Udibile con stetoscopio (+1 pt)"}, {val: "2", label: "Udibile a distanza a riposo (+2 pt)"}] },
      { id: "cough", label: "Tosse abbaiante", type: "select", options: [{val: "0", label: "Assente (0 pt)"}, {val: "1", label: "Rara o lieve (+1 pt)"}, {val: "2", label: "Severa e continua (+2 pt)"}] },
      { id: "retract", label: "Rientramenti (tirage)", type: "select", options: [{val: "0", label: "Assenti (0 pt)"}, {val: "1", label: "Lieve giugulare/intercostale (+1 pt)"}, {val: "2", label: "Marcati con uso muscoli accessori (+2 pt)"}] },
      { id: "air", label: "Entrata d'aria polmonare (murmure)", type: "select", options: [{val: "0", label: "Normale (0 pt)"}, {val: "1", label: "Lievemente ridotta (+1 pt)"}, {val: "2", label: "Marcatamente ridotta (+2 pt)"}] },
      { id: "cyan", label: "Colorito / Cianosi", type: "select", options: [{val: "0", label: "Roseo (0 pt)"}, {val: "1", label: "Cianosi solo sotto agitazione (+1 pt)"}, {val: "2", label: "Cianosi a riposo in aria ambiente (+2 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(stridor) + parseInt(cough) + parseInt(retract) + parseInt(air) + parseInt(cyan);
      let gravita = "Croup Lieve (0-3)"; let therapy = "Desametasone orale singolo (0.15 - 0.6 mg/kg) e dimissione protetta"; let color = "#2e7d32";
      if (score >= 7) {
        gravita = "Croup Grave (≥ 7) - Rischio insufficienza respiratoria acuta";
        therapy = "Adrenalina aerosolica (L-adrenalina 1:1000, 2-5 mL) + Desametasone EV/IM + O₂ + Ospedalizzazione";
        color = "#c62828";
      } else if (score >= 4) {
        gravita = "Croup Moderato (4-6)";
        therapy = "Desametasone orale/EV + aerosol di adrenalina; osservazione per almeno 3-4 ore";
        color = "#ea580c";
      }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Score di Downes",
        metrics: [
          { label: "Gravità Clinica", val: gravita, color: color },
          { label: "Terapia Raccomandata", val: therapy }
        ],
        note: "Downes JJ et al. (Pediatr Clin North Am 1972)."
      };
    `
  },
  {
    id: "score-wells-tvp-gravidanza",
    folder: "Criteri Wells TEV Gravidanza",
    title: "Criteri di Wells Adattati per TEV in Gravidanza",
    category: "chirurgia",
    categoryLabel: "Ostetricia & Chirurgia",
    description: "Stratificazione clinica del rischio di trombosi venosa profonda ed embolia polmonare durante la gestazione e puerperio.",
    tags: ["gravidanza", "tvp", "parto", "puerperio", "wells", "eparina"],
    inputs: [
      { id: "symptoms", label: "Sintomi all'arto inferiore sinistro (sede più frequente nel 90% dei casi)", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "diffCalf", label: "Differenza circonferenza polpaccio > 2 cm", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] },
      { id: "trimester", label: "Primo trimestre di gestazione al momento dei sintomi", type: "select", options: [{val: "0", label: "No (0 pt)"}, {val: "1", label: "Sì (+1 pt)"}] }
    ],
    calcLogic: `
      const score = parseInt(symptoms) + parseInt(diffCalf) + parseInt(trimester);
      let interp = score >= 1 ? "Presenza di predittori LEFt: Alto sospetto di TVP - Procedere a Ecocolordoppler venoso completo immediato" : "Bassa probabilità clinica";
      let color = score >= 1 ? "#c62828" : "#2e7d32";
      return {
        mainValue: score + " Criteri LEFt",
        mainLabel: "Regola Clinica LEFt per TVP in Gravidanza",
        metrics: [
          { label: "Indicazione Diagnostica", val: interp, color: color },
          { label: "Sicurezza", val: "L'Ecocolordoppler è sicuro e privo di radiazioni sia per la madre che per il feto" }
        ],
        note: "Chan WS et al. (BMJ 2009). Regola clinica LEFt validata per la gestante."
      };
    `
  },
  {
    id: "criteri-duke-endocardite",
    folder: "Criteri di Duke per Endocardite",
    title: "Criteri di Duke Modificati per Endocardite Infettiva",
    category: "cardiologia",
    categoryLabel: "Cardiologia & Infettivologia",
    description: "Diagnosi clinica, microbiologica ed ecocardiografica standardizzata di endocardite infettiva (ESC/AHA).",
    tags: ["duke", "endocardite", "emocolture", "ecocardiogramma", "vegetazione", "soffio"],
    inputs: [
      { id: "majBact", label: "Criterio Maggiore Microbiologico: Emocolture positive tipiche persistenti", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "majEcho", label: "Criterio Maggiore Imaging: Ecocardiogramma positivo per vegetazione, ascesso o deiscenza protesica", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "minPred", label: "Minore: Predisposizione (cardiopatia nota, protesi o uso sostanze EV)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "minFev", label: "Minore: Febbre > 38.0 °C", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "minVasc", label: "Minore: Fenomeni Vascolari (emboli settici, lesioni di Janeway, emorragie congiuntivali)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] },
      { id: "minImm", label: "Minore: Fenomeni Immunologici (glomerulonefrite, noduli di Osler, macchie di Roth, fattore reumatoide)", type: "select", options: [{val: "0", label: "No"}, {val: "1", label: "Sì"}] }
    ],
    calcLogic: `
      const nMaj = parseInt(majBact) + parseInt(majEcho);
      const nMin = parseInt(minPred) + parseInt(minFev) + parseInt(minVasc) + parseInt(minImm);
      let dx = "Endocardite Rigettata / Improbabile"; let color = "#2e7d32";
      if (nMaj === 2 || (nMaj === 1 && nMin >= 3) || (nMin >= 5)) {
        dx = "ENDOCARDITE DEFINITIVA (Criteri Soddisfatti)";
        color = "#c62828";
      } else if (nMaj === 1 || nMin >= 1) {
        dx = "ENDOCARDITE POSSIBILE";
        color = "#d97706";
      }
      return {
        mainValue: dx,
        mainLabel: "Diagnosi secondo Criteri di Duke",
        metrics: [
          { label: "Criteri Maggiori Soddisfatti", val: nMaj + " / 2" },
          { label: "Criteri Minori Soddisfatti", val: nMin + " / 5" }
        ],
        note: "Li JS et al. (Clin Infect Dis 2000) e Linee Guida ESC 2023 per l'Endocardite Infettiva."
      };
    `
  }
];

// Generazione file
const calcolatoriDir = path.join(__dirname, 'App', 'Calcolatori');

let count = 0;
EXTRA_10.forEach(calc => {
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

// Aggiorna catalogo
const sharedDataFile = path.join(__dirname, 'App', 'shared', 'calculators-data.js');
const sharedData = require(sharedDataFile);
const existingIds = new Set(sharedData.CALCULATORS.map(c => c.id));

EXTRA_10.forEach(calc => {
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
console.log(`🎉 SUPERATA QUOTA 100! Totale calcolatori complessivi nel catalogo: ${sharedData.CALCULATORS.length}`);
