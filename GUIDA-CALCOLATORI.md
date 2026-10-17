# Suite Calcolatori Medici Clinici (100+ Calcolatori Operativi)

Questa applicazione desktop Electron è strutturata in modo modulare con oltre **100 calcolatori clinici** operativi, ciascuno isolato nella propria sottocartella all'interno di `App/Calcolatori/`.

---

## 📁 Struttura del Progetto

```
Calcolatori-medici/
├── package.json
├── main.js                          # Processo principale Electron (avvia Home/index.html)
├── preload.js                       # Preload sicuro di Electron
├── GUIDA-CALCOLATORI.md
└── App/
    ├── shared/                      # Risorse e stili globali condivisi
    │   ├── shared.css               # Design system clinico comune (palette, card, pulsanti, badge)
    │   └── calculators-data.js      # Registro e catalogo indicizzato di tutti i 100+ calcolatori
    ├── Home/                        # Dashboard principale
    │   ├── index.html               # Schermata principale con ricerca in tempo reale e filtri
    │   ├── home.css                 # Stili per la griglia delle card
    │   └── home.js                  # Logica di ricerca, filtri e apertura dinamica
    └── Calcolatori/                 # 📁 100+ calcolatori, ciascuno nella propria cartella
        ├── Calcolo metabolismo/
        ├── Indice di Massa Corporea (BMI)/
        ├── Superficie Corporea (BSA)/
        ├── CHA2DS2-VASc Score/
        ├── HAS-BLED Score/
        ├── Glasgow Coma Scale (GCS)/
        ├── Quick SOFA (qSOFA)/
        ├── eGFR CKD-EPI (2021)/
        ├── Score CURB-65/
        ├── Criteri di Wells per Embolia Polmonare/
        ├── Score Child-Pugh/
        ├── Score MELD/
        ├── ... (100+ cartelle autonome)
```

---

## 🚀 Come Aggiungere un Nuovo Calcolatore in 3 Passaggi

### 1. Crea la nuova cartella dentro `App/Calcolatori/`
Esempio: `App/Calcolatori/Calcolo BMI/` con:
- `index.html` (copiando la struttura con header e pulsante `← Torna alla Home`)
- `script.js` (logica e formule validate)
- `style.css` (eventuali stili specifici, estendendo `../../shared/shared.css`)

### 2. Registra il calcolatore in `App/shared/calculators-data.js`
Aggiungi un oggetto all'array `CALCULATORS`:
```javascript
{
  id: "bmi",
  title: "Indice di Massa Corporea (BMI)",
  category: "nutrizione", // 'nutrizione', 'cardiologia', 'nefrologia', 'rianimazione', ecc.
  categoryLabel: "Nutrizione",
  description: "Calcolo del BMI e classe di peso OMS.",
  path: "../Calcolatori/Calcolo BMI/index.html",
  isReady: true, // Diventa attivo con pulsante "Apri Calcolatore"
  tags: ["bmi", "peso", "altezza", "obesita", "sottopeso"]
}
```

### 3. Fatto!
La **Home** riconoscerà automaticamente il nuovo calcolatore, aggiornerà il conteggio, lo mostrerà nella griglia filtrabile e lo renderà ricercabile istantaneamente.

---

## 👨‍⚕️ Autore & Proprietà Intellettuale

- **Autore, Ideatore e Sviluppatore**: **Daniele Gabrovec**
- **Copyright**: © 2026 Daniele Gabrovec. Tutti i diritti riservati (*All Rights Reserved*).
- **Licenza**: Proprietary (Uso esclusivo). È vietata la copia, ridistribuzione non autorizzata, de-compilazione o uso commerciale del codice senza esplicita autorizzazione scritta di Daniele Gabrovec.

### ⚠️ Disclaimer Medico-Legale
Questa applicazione è destinata a scopo puramente didattico, informativo e di supporto decisionale per personale sanitario qualificato. Le stime fornite non sostituiscono la valutazione diagnostica, la perizia medica o la prescrizione terapeutica del medico curante. L'autore Daniele Gabrovec declina ogni responsabilità per decisioni cliniche intraprese sulla base dei calcoli eseguiti dal software.


