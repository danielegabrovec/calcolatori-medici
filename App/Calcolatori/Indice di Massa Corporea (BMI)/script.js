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
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);

    function calculate() {
      const hM = height / 100;
      const bmi = weight / (hM * hM);
      let cat = ""; let color = "#2e7d32";
      if (bmi < 18.5) { cat = "Sottopeso"; color = "#d97706"; }
      else if (bmi < 25) { cat = "Normopeso"; color = "#2e7d32"; }
      else if (bmi < 30) { cat = "Sovrappeso"; color = "#d97706"; }
      else if (bmi < 35) { cat = "Obesità di Classe I"; color = "#c62828"; }
      else if (bmi < 40) { cat = "Obesità di Classe II"; color = "#c62828"; }
      else { cat = "Obesità di Classe III"; color = "#7f1d1d"; }
      const pLorentz = gender === "m" ? (height - 100) - ((height - 150) / 4) : (height - 100) - ((height - 150) / 2);
      const inchesOver5ft = Math.max(0, (height / 2.54) - 60);
      const pDevine = gender === "m" ? 50 + (2.3 * inchesOver5ft) : 45.5 + (2.3 * inchesOver5ft);
      return {
        mainValue: bmi.toFixed(1) + " kg/m²",
        mainLabel: "Indice di Massa Corporea",
        metrics: [
          { label: "Classificazione OMS", val: cat, color: color },
          { label: "Peso Ideale (Lorentz)", val: pLorentz.toFixed(1) + " kg" },
          { label: "Peso Ideale (Devine)", val: pDevine.toFixed(1) + " kg" },
          { label: "Range Normopeso", val: (18.5*hM*hM).toFixed(1) + " - " + (24.9*hM*hM).toFixed(1) + " kg" }
        ],
        note: "Formula BMI = Peso (kg) / [Altezza (m)]². Classificazione secondo standard OMS."
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