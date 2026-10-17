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
    const spo2 = document.getElementById("spo2").value;
    const o2 = document.getElementById("o2").value;
    const sbp = document.getElementById("sbp").value;
    const hr = document.getElementById("hr").value;
    const cons = document.getElementById("cons").value;
    const temp = document.getElementById("temp").value;

    function calculate() {
      const score = parseInt(rr) + parseInt(spo2) + parseInt(o2) + parseInt(sbp) + parseInt(hr) + parseInt(cons) + parseInt(temp);
      let risk = "Rischio Basso (0-4)"; let action = "Valutazione infermieristica ordinaria"; let color = "#2e7d32";
      if (score >= 7) {
        risk = "Alto Rischio Clinico (Score ≥ 7)"; action = "Attivazione immediata Team di Rianimazione / MET urgente"; color = "#c62828";
      } else if (score >= 5) {
        risk = "Rischio Medio (Score 5-6)"; action = "Valutazione medica urgente di reparto"; color = "#ea580c";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score NEWS2",
        metrics: [
          { label: "Livello di Rischio", val: risk, color: color },
          { label: "Risposta Clinica Raccomandata", val: action }
        ],
        note: "Royal College of Physicians (2017)."
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