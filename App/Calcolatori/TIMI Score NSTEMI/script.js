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
    const age = document.getElementById("age").value;
    const rf = document.getElementById("rf").value;
    const cad = document.getElementById("cad").value;
    const asa = document.getElementById("asa").value;
    const angina = document.getElementById("angina").value;
    const st = document.getElementById("st").value;
    const biomarkers = document.getElementById("biomarkers").value;

    function calculate() {
      const score = parseInt(age) + parseInt(rf) + parseInt(cad) + parseInt(asa) + parseInt(angina) + parseInt(st) + parseInt(biomarkers);
      let risk = "Rischio Basso (0-2)"; let rate = "5 - 8% eventi a 14 gg"; let color = "#2e7d32";
      if (score >= 5) { risk = "Alto Rischio (5-7)"; rate = "26 - 41% eventi a 14 gg"; color = "#c62828"; }
      else if (score >= 3) { risk = "Rischio Intermedio (3-4)"; rate = "13 - 20% eventi a 14 gg"; color = "#d97706"; }
      return {
        mainValue: score + " / 7 Punti",
        mainLabel: "Score TIMI NSTEMI",
        metrics: [
          { label: "Gruppo di Rischio", val: risk, color: color },
          { label: "Mortalità / Re-IMA a 14 Giorni", val: rate }
        ],
        note: "Antman EM et al. (JAMA 2000)."
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