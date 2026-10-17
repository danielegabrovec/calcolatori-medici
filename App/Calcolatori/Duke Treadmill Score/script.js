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
    const time = parseFloat(document.getElementById("time").value);
    const st = parseFloat(document.getElementById("st").value);
    const angina = document.getElementById("angina").value;

    function calculate() {
      const dts = time - (5 * st) - (4 * parseFloat(angina));
      let risk = "Rischio Basso (≥ +5): Sopravvivenza a 5 anni 97%"; let color = "#2e7d32";
      if (dts < -10) {
        risk = "Alto Rischio (≤ -10): Sopravvivenza a 5 anni 65% - Indicata coronarografia urgente";
        color = "#c62828";
      } else if (dts < 5) {
        risk = "Rischio Moderato (-10 to +4): Sopravvivenza a 5 anni 90%";
        color = "#d97706";
      }
      return {
        mainValue: dts.toFixed(1) + " Punti",
        mainLabel: "Duke Treadmill Score (DTS)",
        metrics: [
          { label: "Stratificazione di Rischio", val: risk, color: color },
          { label: "Formula", val: "Tempo - (5 * ST_mm) - (4 * Indice_Angina)" }
        ],
        note: "Mark DB et al. (NEJM 1991)."
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