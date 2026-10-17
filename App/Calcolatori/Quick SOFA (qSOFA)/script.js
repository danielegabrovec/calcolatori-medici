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
    const rr = document.getElementById("rr").value;
    const gcs = document.getElementById("gcs").value;
    const sbp = document.getElementById("sbp").value;

    function calculate() {
      const score = parseInt(rr) + parseInt(gcs) + parseInt(sbp);
      let risk = "Rischio Basso (Score 0-1)"; let color = "#2e7d32";
      if (score >= 2) { risk = "Alto Rischio di Sepsi / Mortalità (Score ≥ 2)"; color = "#c62828"; }
      return {
        mainValue: score + " / 3",
        mainLabel: "Score qSOFA",
        metrics: [
          { label: "Valutazione del Rischio", val: risk, color: color },
          { label: "Azione", val: score >= 2 ? "Valutare disfunzione d'organo (SOFA completo), lattati ematici e terapia antibiotica" : "Monitoraggio clinico" }
        ],
        note: "Consenso Sepsis-3 (Singer M et al., JAMA 2016)."
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