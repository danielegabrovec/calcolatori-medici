document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const btnReset = document.getElementById('btnReset');
  const placeholderBox = document.getElementById('placeholderBox');
  const resultBox = document.getElementById('resultBox');
  const resHeroLabel = document.getElementById('resHeroLabel');
  const resHeroValue = document.getElementById('resHeroValue');
  const metricsList = document.getElementById('metricsList');
  const calcNote = document.getElementById('calcNote');

  function compute() {
    const wbc = parseFloat(document.getElementById("wbc").value);
    const creat = parseFloat(document.getElementById("creat").value);
    const creatBase = parseFloat(document.getElementById("creatBase").value);
    const fulminant = document.getElementById("fulminant").value;

    function calculate() {
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

        item.innerHTML = `
          <span style="font-size: 13px; color: #475569; font-weight: 500;">${m.label}</span>
          <span style="font-size: 14px; font-weight: 700; color: ${m.color || '#1e293b'}; text-align: right; max-width: 60%;">${m.val}</span>
        `;
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
});