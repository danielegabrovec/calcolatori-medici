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
    const scoreVal = document.getElementById("scoreVal").value;

    function calculate() {
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