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

    function calculate() {
      const thresholdIdf = gender === "m" ? 94 : 80;
      const thresholdNcep = gender === "m" ? 102 : 88;
      let interp = "Normale";
      let col = "#2e7d32";
      if (waist >= thresholdNcep) {
        interp = "Criterio NCEP-ATP III Soddisfatto (Rischio Elevato)";
        col = "#c62828";
      } else if (waist >= thresholdIdf) {
        interp = "Criterio IDF Soddisfatto (Rischio Aumentato)";
        col = "#d97706";
      }
      return {
        mainValue: waist + " cm",
        mainLabel: "Circonferenza Vita Rilevata",
        metrics: [
          { label: "Valutazione Rischio Obesità Viscerale", val: interp, color: col },
          { label: "Soglia IDF Uomo / Donna", val: "≥ 94 cm / ≥ 80 cm" },
          { label: "Soglia NCEP-ATP III Uomo / Donna", val: "≥ 102 cm / ≥ 88 cm" }
        ],
        note: "La misurazione corretta va effettuata a metà tra l'ultima costa palpabile e la cresta iliaca al termine di un'espirazione normale."
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