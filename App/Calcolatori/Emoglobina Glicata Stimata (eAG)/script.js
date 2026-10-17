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
    const hba1c = parseFloat(document.getElementById("hba1c").value);

    function calculate() {
      const eag = 28.7 * hba1c - 46.7;
      let target = ""; let color = "#2e7d32";
      if (hba1c < 5.7) target = "Normale / Non diabetico (< 5.7%)";
      else if (hba1c <= 6.4) { target = "Prediabete (5.7 - 6.4%)"; color = "#d97706"; }
      else if (hba1c <= 7.0) { target = "Target ottimale ADA (≤ 7.0%)"; color = "#2e7d32"; }
      else { target = "Controllo subottimale (> 7.0%)"; color = "#c62828"; }
      return {
        mainValue: Math.round(eag) + " mg/dL",
        mainLabel: "Glicemia Media Stimata (eAG)",
        metrics: [
          { label: "Equivalente in mmol/L", val: (eag / 18.018).toFixed(1) + " mmol/L" },
          { label: "Classificazione ADA", val: target, color: color }
        ],
        note: "Trial ADAG (Nathan DM et al., Diabetes Care 2008)."
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