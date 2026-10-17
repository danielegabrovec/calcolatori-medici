const fs = require('fs');
const path = require('path');

const MACROAREAS = [
  {
    id: "all",
    name: "Tutti i Calcolatori",
    icon: "🏥",
    subareas: []
  },
  {
    id: "nutrizione",
    name: "Nutrizione & Metabolismo",
    icon: "🥗",
    subareas: [
      { id: "nutri-bmr", name: "Dispendio Energetico & BMR" },
      { id: "nutri-antropo", name: "Antropometria & Composizione Corporea" },
      { id: "nutri-clinica", name: "Nutrizione Clinica & Fabbisogni" }
    ]
  },
  {
    id: "cardiologia",
    name: "Cardiologia & Vascolare",
    icon: "❤️",
    subareas: [
      { id: "cardio-fa", name: "Fibrillazione Atriale & Rischio Tromboembolico" },
      { id: "cardio-sca", name: "Sindromi Coronariche Acute & Ischemia" },
      { id: "cardio-ecg", name: "Elettrocardiografia & Aritmie" },
      { id: "cardio-emodinamica", name: "Emodinamica & Pressioni" }
    ]
  },
  {
    id: "nefrologia",
    name: "Nefrologia & Idroelettrolitico",
    icon: "💧",
    subareas: [
      { id: "nefro-gfr", name: "Filtrato Glomerulare & Clearance" },
      { id: "nefro-ab", name: "Equilibrio Acido-Base & Anion Gap" },
      { id: "nefro-idro", name: "Idratazione, Osmolarità & Elettroliti" },
      { id: "nefro-urine", name: "Diagnostica Urinaria & Proteinuria" }
    ]
  },
  {
    id: "rianimazione",
    name: "Urgenza, Intensiva & Trauma",
    icon: "⚡",
    subareas: [
      { id: "urgenza-triage", name: "Early Warning & Triage (NEWS2, SIRS, RTS)" },
      { id: "urgenza-sepsi", name: "Sepsi, Shock & Infezione Critica" },
      { id: "urgenza-neuro", name: "Stato di Coscienza (Glasgow GCS)" },
      { id: "urgenza-ustioni", name: "Ustioni & Fluidoterapia (Parkland)" }
    ]
  },
  {
    id: "pneumologia",
    name: "Pneumologia & Gasometria",
    icon: "🫁",
    subareas: [
      { id: "pneumo-resp", name: "Insufficienza Respiratoria, ARDS & Alti Flussi" },
      { id: "pneumo-infezioni", name: "Polmoniti (CURB-65, PSI/PORT)" },
      { id: "pneumo-bpco", name: "BPCO & Pleura (BODE, Criteri di Light)" },
      { id: "pneumo-ep", name: "Tromboembolismo Polmonare (Wells EP)" }
    ]
  },
  {
    id: "gastro",
    name: "Gastroenterologia & Epatologia",
    icon: "🩺",
    subareas: [
      { id: "gastro-fegato", name: "Cirrosi & Funzione Epatica (Child, MELD)" },
      { id: "gastro-fibrosi", name: "Fibrosi & Transaminasi (FIB-4, APRI, De Ritis)" },
      { id: "gastro-urgenze", name: "Pancreatite Acuta & Emorragie (BISAP, Ranson, Rockall)" },
      { id: "gastro-intestino", name: "Liquidi & Fisiologia Intestinale (SAAG, Gap Fecale)" }
    ]
  },
  {
    id: "endocrinologia",
    name: "Endocrinologia & Diabete",
    icon: "🔬",
    subareas: [
      { id: "endo-insulina", name: "Insulino-Resistenza & Diabete (HOMA, QUICKI, eAG)" },
      { id: "endo-terapia", name: "Terapia Insulinica (ISF) & Emergenze (DKA)" },
      { id: "endo-tiroide", name: "Tiroide & Ormoni (Levotiroxina)" }
    ]
  },
  {
    id: "ematologia",
    name: "Ematologia & Oncologia",
    icon: "🩸",
    subareas: [
      { id: "emato-anemie", name: "Anemie & Assetto Marziale (Mentzer, Ganzoni)" },
      { id: "emato-onco", name: "Valutazione Oncologica (ECOG, Karnofsky, Calvert)" },
      { id: "emato-coag", name: "Coagulazione & Plasma (Score 4Ts, Volume Plasmatico)" }
    ]
  },
  {
    id: "pediatria",
    name: "Pediatria & Neonatologia",
    icon: "👶",
    subareas: [
      { id: "ped-neonato", name: "Adattamento Neonatale (APGAR, Silverman)" },
      { id: "ped-farmaci", name: "Posologia & Fabbisogni Pediatrici (Clark)" },
      { id: "ped-infezioni", name: "Vie Aeree & Infezioni (Downes, McIsaac)" }
    ]
  },
  {
    id: "neurologia",
    name: "Neurologia & Ictus",
    icon: "🧠",
    subareas: [
      { id: "neuro-ictus", name: "Ictus & Ischemia Cerebrale (ABCD², mRS)" },
      { id: "neuro-urgenze", name: "Emorragie & Traumi (Hunt & Hess, CCHR Ottawa)" }
    ]
  },
  {
    id: "chirurgia",
    name: "Chirurgia & Perioperatorio",
    icon: "🔪",
    subareas: [
      { id: "chir-anestesia", name: "Rischio Anestesiologico & Vie Aeree (ASA, Lee, Mallampati)" },
      { id: "chir-trombosi", name: "Tromboprofilassi Chirurgica (Caprini, Wells TVP)" },
      { id: "chir-addome", name: "Addome Acuto Chirurgico (Alvarado)" }
    ]
  },
  {
    id: "infettivologia",
    name: "Infettivologia & Antimicrobici",
    icon: "🦠",
    subareas: [
      { id: "inf-tdm", name: "Monitoraggio TDM Antibiotici (Vancomicina, Aminoglicosidi)" },
      { id: "inf-infezioni", name: "Infezioni Cliniche (Clostridioides, SBP, Eron, Duke, Centor)" }
    ]
  }
];

// Helper per determinare la sottoarea specifica di ciascun calcolatore
function assignSubarea(calc) {
  const id = calc.id.toLowerCase();
  const cat = calc.category;

  // Nutrizione
  if (cat === "nutrizione") {
    if (id.includes("metabolismo") || id.includes("bmr")) return { macroId: "nutrizione", subId: "nutri-bmr" };
    if (id.includes("bmi") || id.includes("bsa") || id.includes("whr") || id.includes("grassa") || id.includes("vita")) return { macroId: "nutrizione", subId: "nutri-antropo" };
    return { macroId: "nutrizione", subId: "nutri-clinica" };
  }

  // Cardiologia
  if (cat === "cardiologia") {
    if (id.includes("cha2ds2") || id.includes("has-bled") || id.includes("ddimero")) return { macroId: "cardiologia", subId: "cardio-fa" };
    if (id.includes("timi") || id.includes("grace") || id.includes("heart") || id.includes("framingham")) return { macroId: "cardiologia", subId: "cardio-sca" };
    if (id.includes("qt") || id.includes("duke-treadmill")) return { macroId: "cardiologia", subId: "cardio-ecg" };
    return { macroId: "cardiologia", subId: "cardio-emodinamica" };
  }

  // Nefrologia
  if (cat === "nefrologia") {
    if (id.includes("egfr") || id.includes("cockcroft") || id.includes("mdrd")) return { macroId: "nefrologia", subId: "nefro-gfr" };
    if (id.includes("anion-gap") || id.includes("bicarbonato")) return { macroId: "nefrologia", subId: "nefro-ab" };
    if (id.includes("osmolarita") || id.includes("sodio") || id.includes("calcio") || id.includes("acqua") || id.includes("potassio") || id.includes("ttkg")) return { macroId: "nefrologia", subId: "nefro-idro" };
    return { macroId: "nefrologia", subId: "nefro-urine" };
  }

  // Urgenza & Rianimazione
  if (cat === "rianimazione") {
    if (id.includes("news2") || id.includes("sirs") || id.includes("rts")) return { macroId: "rianimazione", subId: "urgenza-triage" };
    if (id.includes("sofa") || id.includes("shock")) return { macroId: "rianimazione", subId: "urgenza-sepsi" };
    if (id.includes("glasgow") || id.includes("gcs")) return { macroId: "rianimazione", subId: "urgenza-neuro" };
    return { macroId: "rianimazione", subId: "urgenza-ustioni" };
  }

  // Pneumologia
  if (cat === "pneumologia") {
    if (id.includes("horowitz") || id.includes("alveolo") || id.includes("rox")) return { macroId: "pneumologia", subId: "pneumo-resp" };
    if (id.includes("curb") || id.includes("psi") || id.includes("port")) return { macroId: "pneumologia", subId: "pneumo-infezioni" };
    if (id.includes("bode") || id.includes("light")) return { macroId: "pneumologia", subId: "pneumo-bpco" };
    return { macroId: "pneumologia", subId: "pneumo-ep" };
  }

  // Gastroenterologia
  if (cat === "gastro") {
    if (id.includes("child") || id.includes("meld") || id.includes("maddrey")) return { macroId: "gastro", subId: "gastro-fegato" };
    if (id.includes("fib-4") || id.includes("apri") || id.includes("de-ritis")) return { macroId: "gastro", subId: "gastro-fibrosi" };
    if (id.includes("bisap") || id.includes("ranson") || id.includes("blatchford") || id.includes("rockall")) return { macroId: "gastro", subId: "gastro-urgenze" };
    return { macroId: "gastro", subId: "gastro-intestino" };
  }

  // Endocrinologia
  if (cat === "endocrinologia") {
    if (id.includes("homa") || id.includes("quicki") || id.includes("eag")) return { macroId: "endocrinologia", subId: "endo-insulina" };
    if (id.includes("isf") || id.includes("dka")) return { macroId: "endocrinologia", subId: "endo-terapia" };
    return { macroId: "endocrinologia", subId: "endo-tiroide" };
  }

  // Ematologia
  if (cat === "ematologia") {
    if (id.includes("mentzer") || id.includes("ferro")) return { macroId: "ematologia", subId: "emato-anemie" };
    if (id.includes("ecog") || id.includes("karnofsky") || id.includes("calvert") || id.includes("neutrofili")) return { macroId: "ematologia", subId: "emato-onco" };
    return { macroId: "ematologia", subId: "emato-coag" };
  }

  // Pediatria
  if (cat === "pediatria") {
    if (id.includes("apgar") || id.includes("silverman")) return { macroId: "pediatria", subId: "ped-neonato" };
    if (id.includes("clark")) return { macroId: "pediatria", subId: "ped-farmaci" };
    return { macroId: "pediatria", subId: "ped-infezioni" };
  }

  // Neurologia
  if (cat === "neurologia") {
    if (id.includes("abcd2") || id.includes("rankin")) return { macroId: "neurologia", subId: "neuro-ictus" };
    return { macroId: "neurologia", subId: "neuro-urgenze" };
  }

  // Chirurgia
  if (cat === "chirurgia") {
    if (id.includes("asa") || id.includes("lee") || id.includes("mallampati")) return { macroId: "chirurgia", subId: "chir-anestesia" };
    if (id.includes("alvarado")) return { macroId: "chirurgia", subId: "chir-addome" };
    return { macroId: "chirurgia", subId: "chir-trombosi" };
  }

  // Infettivologia
  if (cat === "infettivologia") {
    if (id.includes("vancomicina") || id.includes("hartford")) return { macroId: "infettivologia", subId: "inf-tdm" };
    return { macroId: "infettivologia", subId: "inf-infezioni" };
  }

  return { macroId: cat, subId: "generale" };
}

// Carica e aggiorna calculators-data.js
const sharedPath = path.join(__dirname, 'App', 'shared', 'calculators-data.js');
const shared = require(sharedPath);

shared.CALCULATORS.forEach(calc => {
  const { macroId, subId } = assignSubarea(calc);
  calc.macroId = macroId;
  calc.subId = subId;
  const macroObj = MACROAREAS.find(m => m.id === macroId);
  calc.macroName = macroObj ? macroObj.name : calc.categoryLabel;
  if (macroObj && macroObj.subareas) {
    const subObj = macroObj.subareas.find(s => s.id === subId);
    calc.subName = subObj ? subObj.name : "Generale";
  } else {
    calc.subName = "Generale";
  }
});

const content = `// Registro Centrale dei Calcolatori Medici
// Architettura Gerarchica: Macroaree -> Sottoaree -> Calcolatori

const MACROAREAS = ${JSON.stringify(MACROAREAS, null, 2)};
const CATEGORIES = MACROAREAS; // Compatibilità

const CALCULATORS = ${JSON.stringify(shared.CALCULATORS, null, 2)};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { MACROAREAS, CATEGORIES, CALCULATORS };
}
`;

fs.writeFileSync(sharedPath, content, 'utf8');
console.log('Struttura gerarchica (Macroaree e Sottoaree) applicata con successo a tutti i calcolatori!');
