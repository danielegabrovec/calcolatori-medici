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
    const gender = document.getElementById("gender").value;
    const waist = parseFloat(document.getElementById("waist").value);
    const hip = parseFloat(document.getElementById("hip").value);

    function calculate() {
      const whr = waist / hip;
      let risk = "Basso"; let color = "#2e7d32";
      if (gender === "m") {
        if (whr >= 0.90 && whr < 1.0) { risk = "Moderato"; color = "#d97706"; }
        else if (whr >= 1.0) { risk = "Elevato (Adiposità Androide)"; color = "#c62828"; }
      } else {
        if (whr >= 0.80 && whr < 0.85) { risk = "Moderato"; color = "#d97706"; }
        else if (whr >= 0.85) { risk = "Elevato (Adiposità Androide)"; color = "#c62828"; }
      }
      return {
        mainValue: whr.toFixed(2),
        mainLabel: "Rapporto Vita / Fianchi (WHR)",
        metrics: [
          { label: "Rischio Cardiovascolare", val: risk, color: color },
          { label: "Soglia Rischio Uomo", val: "≥ 0.90" },
          { label: "Soglia Rischio Donna", val: "≥ 0.85" }
        ],
        note: "Linee guida OMS per l'obesità addominale e la sindrome metabolica."
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