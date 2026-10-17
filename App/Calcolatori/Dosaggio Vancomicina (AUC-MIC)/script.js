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
    const weight = parseFloat(document.getElementById("weight").value);
    const crcl = parseFloat(document.getElementById("crcl").value);
    const severity = document.getElementById("severity").value;

    function calculate() {
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