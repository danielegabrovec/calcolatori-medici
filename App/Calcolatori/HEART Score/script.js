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
    const h = document.getElementById("h").value;
    const e = document.getElementById("e").value;
    const a = document.getElementById("a").value;
    const r = document.getElementById("r").value;
    const t = document.getElementById("t").value;

    function calculate() {
      const score = parseInt(h) + parseInt(e) + parseInt(a) + parseInt(r) + parseInt(t);
      let risk = ""; let mace = ""; let color = "#2e7d32";
      if (score <= 3) {
        risk = "Basso Rischio (0-3)"; mace = "0.9 - 1.7% MACE a 6 settimane";
      } else if (score <= 6) {
        risk = "Rischio Intermedio (4-6)"; mace = "12 - 16.6% MACE a 6 settimane"; color = "#d97706";
      } else {
        risk = "Alto Rischio (7-10)"; mace = "50 - 65% MACE a 6 settimane"; color = "#c62828";
      }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Score HEART",
        metrics: [
          { label: "Stratificazione del Rischio", val: risk, color: color },
          { label: "Rischio MACE a 6 Settimane", val: mace },
          { label: "Gestione", val: score <= 3 ? "Dimissione precoce sicura valutabile" : "Ricovero o coronarografia precoce" }
        ],
        note: "Six AJ et al. (Neth Heart J 2008)."
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