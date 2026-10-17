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
    const surg = document.getElementById("surg").value;
    const immob = document.getElementById("immob").value;
    const prevtev = document.getElementById("prevtev").value;
    const malig = document.getElementById("malig").value;

    function calculate() {
      const score = parseInt(age) + parseInt(surg) + parseInt(immob) + parseInt(prevtev) + parseInt(malig);
      let risk = "Rischio Basso (Score 1-2)"; let action = "Deambulazione precoce o calze elastiche"; let color = "#2e7d32";
      if (score >= 5) {
        risk = "Altissimo Rischio (Score ≥ 5)"; action = "Tromboprofilassi farmacologica (EBPM) combinata a profilassi meccanica (IPC/calze)"; color = "#c62828";
      } else if (score >= 3) {
        risk = "Alto Rischio (Score 3-4)"; action = "Tromboprofilassi con EBPM raccomandata"; color = "#d97706";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score di Caprini",
        metrics: [
          { label: "Categoria di Rischio TEV", val: risk, color: color },
          { label: "Profilassi Raccomandata", val: action }
        ],
        note: "Caprini JA (Dis Mon 2005)."
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