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
    const signs = document.getElementById("signs").value;
    const alt = document.getElementById("alt").value;
    const hr = document.getElementById("hr").value;
    const immob = document.getElementById("immob").value;
    const prev = document.getElementById("prev").value;
    const hemo = document.getElementById("hemo").value;
    const malig = document.getElementById("malig").value;

    function calculate() {
      const score = parseFloat(signs) + parseFloat(alt) + parseFloat(hr) + parseFloat(immob) + parseFloat(prev) + parseFloat(hemo) + parseFloat(malig);
      let prob = ""; let iter = ""; let color = "#2e7d32";
      if (score <= 4) { prob = "EP Improbabile (Score ≤ 4)"; iter = "Eseguire D-Dimero ad alta sensibilità."; }
      else { prob = "EP Probabile (Score > 4)"; iter = "Eseguire Angio-TC toracica urgente."; color = "#c62828"; }
      return {
        mainValue: score.toFixed(1) + " Punti",
        mainLabel: "Score di Wells per EP",
        metrics: [
          { label: "Probabilità Clinica", val: prob, color: color },
          { label: "Strategia Diagnostica", val: iter }
        ],
        note: "Wells PS et al. (Thromb Haemost 2000)."
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