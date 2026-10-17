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
    const fev1 = document.getElementById("fev1").value;
    const walk = document.getElementById("walk").value;
    const mmrc = document.getElementById("mmrc").value;
    const bmi = document.getElementById("bmi").value;

    function calculate() {
      const score = parseInt(fev1) + parseInt(walk) + parseInt(mmrc) + parseInt(bmi);
      let sur4 = ""; let quartile = ""; let color = "#2e7d32";
      if (score <= 2) { quartile = "Quartile 1 (0-2 punti)"; sur4 = "82% sopravvivenza a 4 anni"; }
      else if (score <= 4) { quartile = "Quartile 2 (3-4 punti)"; sur4 = "67% sopravvivenza a 4 anni"; color = "#d97706"; }
      else if (score <= 6) { quartile = "Quartile 3 (5-6 punti)"; sur4 = "57% sopravvivenza a 4 anni"; color = "#ea580c"; }
      else { quartile = "Quartile 4 (7-10 punti)"; sur4 = "18% sopravvivenza a 4 anni (Alto Rischio)"; color = "#c62828"; }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Punteggio Indice BODE",
        metrics: [
          { label: "Quartile Prognostico", val: quartile, color: color },
          { label: "Sopravvivenza a 4 Anni Stimata", val: sur4 }
        ],
        note: "Celli BR et al. (NEJM 2004). Acronimo BODE: Body mass index, Obstruction, Dyspnea, Exercise."
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