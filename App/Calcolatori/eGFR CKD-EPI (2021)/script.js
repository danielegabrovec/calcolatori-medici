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
    const gender = document.getElementById("gender").value;
    const age = parseFloat(document.getElementById("age").value);
    const creat = parseFloat(document.getElementById("creat").value);

    function calculate() {
      const isM = gender === "m";
      const kappa = isM ? 0.9 : 0.7;
      const alpha = isM ? -0.302 : -0.241;
      const genderMult = isM ? 1.0 : 1.012;
      const crRatio = creat / kappa;
      const minVal = Math.min(crRatio, 1);
      const maxVal = Math.max(crRatio, 1);
      const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * genderMult;
      let stage = ""; let color = "#2e7d32";
      if (egfr >= 90) { stage = "G1 - Normale"; color = "#2e7d32"; }
      else if (egfr >= 60) { stage = "G2 - Lieve riduzione"; color = "#2e7d32"; }
      else if (egfr >= 45) { stage = "G3a - Riduzione lieve-moderata"; color = "#d97706"; }
      else if (egfr >= 30) { stage = "G3b - Riduzione moderata-severa"; color = "#ea580c"; }
      else if (egfr >= 15) { stage = "G4 - Grave riduzione"; color = "#dc2626"; }
      else { stage = "G5 - Terminale (ESRD)"; color = "#7f1d1d"; }
      return {
        mainValue: Math.round(egfr) + " mL/min/1.73 m²",
        mainLabel: "eGFR Stimato",
        metrics: [
          { label: "Stadio KDIGO", val: stage, color: color },
          { label: "Standard", val: "CKD-EPI 2021 Race-Free" }
        ],
        note: "Inker LA et al. (NEJM 2021). Equazione priva di termine etnico."
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