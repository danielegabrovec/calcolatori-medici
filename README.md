# 🩺 MedCalc Suite - Calcolatori Medici Clinici

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows%20x64-informational.svg)](#)
[![Version](https://img.shields.io/badge/Version-1.2.0-success.svg)](#)
[![Calculators](https://img.shields.io/badge/Calcolatori-107%20Disponibili-red.svg)](#)

> **Suite desktop offline di oltre 100 calcolatori clinici, formule diagnostiche, score prognostici ed equazioni predittive.**  
> Ideata e sviluppata da **Daniele Gabrovec**.

---

## 🌟 Caratteristiche Principali

- 🏥 **Oltre 100 Calcolatori Specialistici**: formule validate dalla letteratura scientifica internazionale (AHA, ESC, KDIGO, NICE, GOLD, BTS, ecc.).
- 📂 **Navigazione Gerarchica ad Albero**: macroaree e sottoaree con menu a fisarmonica (*accordion*) animato.
- ⚡ **Ricerca Istantanea Intelligente**: ricerca per nome, sigla o sintomo (insensibile agli accenti, punteggiatura e maiuscole).
- 📶 **100% Offline First**: tutti i calcoli avvengono in locale sul PC senza connessione internet né trasmissione di dati dei pazienti.
- 🎨 **Interfaccia Desktop Moderna**: animazioni fluide, palette clinica differenziata per specialità e visualizzazione ad alto contrasto.

---

## 🩺 Macroaree Specialistiche Incluse (107 Calcolatori)

1. **🥗 Nutrizione & Metabolismo**: Metabolismo Basale (BMR Harris-Benedict, Mifflin-St Jeor, Katch-McArdle) + Livello di Attività Fisica (LAF/TDEE), BMI, BSA (Mosteller, DuBois), Fabbisogno Idrico (Holliday-Segar), WHR, Circonferenza Vita, Peso Ideale (Lorenz, Devine).
2. **❤️ Cardiologia & Vascolare**: CHA2DS2-VASc, HAS-BLED, TIMI Score (NSTEMI / STEMI), GRACE 2.0, Score HEART, Calcolo QTc (Bazett, Fridericia, Framingham), MAP, CPP, Indice Caviglia-Braccio (ABI).
3. **💧 Nefrologia & Idroelettrolitico**: eGFR CKD-EPI (2021) & MDRD, Clearance Creatinina (Cockcroft-Gault), FENa, FEUrea, Anion Gap sierico ed urinario, Deficit di Sodio e Acqua Libera, Calcio corretto per albumina, Osmolarità sierica, Rapporto Albuminuria/Creatinuria (ACR).
4. **⚡ Urgenza, Intensiva & Trauma**: Glasgow Coma Scale (GCS), Quick SOFA (qSOFA), SOFA Score completo, SIRS, NEWS2, Score APACHE II, Trauma Score Revisionato (RTS), Formula di Parkland per le ustioni.
5. **🫁 Pneumologia & Gasometria**: Rapporto PaO2/FiO2 (Indice di Horowitz), Criteri di Wells e Score di Ginevra per Embolia Polmonare, Score CURB-65 per polmonite, Indice BODE per BPCO, Gradiente Alveolo-Arterioso A-a O2.
6. **🔬 Gastroenterologia & Epatologia**: Score Child-Pugh, Score MELD & MELD-Na, Fibrosi Epatica (FIB-4 e APRI), Score di Maddrey per epatite alcolica, Score Glasgow-Blatchford e Rockall per emorragia digestiva, Score di Ranson e BISAP per pancreatite acuta.
7. **🩸 Endocrinologia & Diabete**: HOMA-IR (Insulino-resistenza), Indice QUICKI, Fabbisogno Insulinico Totale (TDD) e Rapporto Insulina/Carboidrati (ICR), Fattore di Correzione/Sensibilità Insulinica (ISF), Conversione HbA1c (DCCT % ⇄ IFCC mmol/mol), Volume Tiroideo Ecografico.
8. **🧪 Ematologia & Oncologia**: Indice di Mentzer per anemie microcitiche, Deficit Totale di Ferro (Formula di Ganzoni), Conta Assoluta Neutrofili (ANC), Score 4T per piastrinopenia da eparina (HIT), Score di Khorana per rischio TEV oncologico, ECOG Performance Status e Karnofsky Scale.
9. **👶 Pediatria & Neonatologia**: Punteggio Apgar a 1 e 5 minuti, Fototerapia e Iperbilirubinemia neonatale, Dosaggi pediatrici per peso (Clark, Young), Centili di crescita e Score di Silverman-Anderson per distress respiratorio.
10. **🧠 Neurologia & Ictus**: NIHSS (National Institutes of Health Stroke Scale), Score ABCD2 per TIA, mRS (Modified Rankin Scale) per disabilità, Punteggio di Hunt-Hess per emorragia subaracnoidea.
11. **🩺 Chirurgia & Perioperatorio**: Scala ASA per rischio anestesiologico, Score di Caprini per profilassi TVP, Score di Goldman per rischio cardiaco cardiaco, Score Alvarado per appendicite acuta.
12. **🦠 Infettivologia & Antimicrobici**: Monitoraggio TDM Vancomicina (AUC24/MIC) e Aminoglicosidi, Score Centor/McIsaac per faringotonsillite, Criteri di Duke per endocardite infettiva, Classificazione Eron per infezioni cute e tessuti molli, ATLAS Score per infezione da *C. difficile*.

---

## 💻 Installazione ed Esecuzione

### Download Eseguibile (Installer Windows)
Scarica l'ultimo installer `.exe` dalla sezione [**Releases**](../../releases) ed eseguilo. L'app si installerà automaticamente sul desktop.

### Esecuzione dai Sorgenti
Requisiti: [Node.js](https://nodejs.org/) (versione 18 o superiore).

```bash
# Clona il repository
git clone https://github.com/danielegabrovec/calcolatori-medici.git

# Accedi alla cartella
cd calcolatori-medici

# Installa le dipendenze
npm install

# Avvia l'applicazione
npm start
```

---

## 👨‍⚕️ Autore & Copyright

- **Autore e Sviluppatore**: **Daniele Gabrovec**
- **Copyright**: © 2026 Daniele Gabrovec. Tutti i diritti riservati.

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Consulta il file [`LICENSE`](LICENSE) per ulteriori informazioni.

---

## ⚠️ Disclaimer Medico-Legale

Questo software è destinato esclusivamente a scopo didattico, informativo e di supporto decisionale per medici e professionisti sanitari. Non formula diagnosi né prescrive terapie mediche. Le decisioni cliniche e terapeutiche restano di esclusiva competenza e responsabilità del personale medico curante.
