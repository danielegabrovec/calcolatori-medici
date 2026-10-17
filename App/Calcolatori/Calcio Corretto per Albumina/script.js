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
    const ca = parseFloat(document.getElementById("ca").value);
    const alb = parseFloat(document.getElementById("alb").value);

    function calculate() {
      const caCorr = ca + 0.8 * (4.0 - alb);
      let interp = "Normocalcemia (8.5 - 10.5 mg/dL)"; let color = "#2e7d32";
      if (caCorr < 8.5) { interp = "Ipocalcemia (< 8.5 mg/dL)"; color = "#d97706"; }
      else if (caCorr > 10.5) { interp = "Ipercalcemia (> 10.5 mg/dL)"; color = "#c62828"; }
      return {
        mainValue: caCorr.toFixed(1) + " mg/dL",
        mainLabel: "Calcio Sierico Corretto",
        metrics: [
          { label: "Calcio Misurato Non Corretto", val: ca.toFixed(1) + " mg/dL" },
          { label: "Stato Clinico", val: interp, color: color }
        ],
        note: "Formula di Payne: CaCorr = CaMisurato + 0.8 * (4.0 - Albumina)."
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