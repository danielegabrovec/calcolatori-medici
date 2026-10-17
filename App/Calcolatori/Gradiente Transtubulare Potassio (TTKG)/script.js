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
    const uk = parseFloat(document.getElementById("uk").value);
    const sk = parseFloat(document.getElementById("sk").value);
    const uosm = parseFloat(document.getElementById("uosm").value);
    const sosm = parseFloat(document.getElementById("sosm").value);

    function calculate() {
      const ttkg = (uk * sosm) / (sk * uosm);
      let interp = "Normale (6 - 12 con dieta standard)"; let color = "#2e7d32";
      if (sk > 5.0 && ttkg < 7) {
        interp = "TTKG < 7 in iperkaliemia: Inappropriata risposta aldosteronica (es. Ipoaldosteronismo, farmaci ACEi/Sartani/Spironolattone)";
        color = "#c62828";
      } else if (sk < 3.5 && ttkg > 3) {
        interp = "TTKG > 3 in ipokaliemia: Perdita renale inappropriata di potassio (Iperaldosteronismo)";
        color = "#ea580c";
      }
      return {
        mainValue: ttkg.toFixed(1),
        mainLabel: "Gradiente TTKG",
        metrics: [
          { label: "Interpretazione Risposta Renale", val: interp, color: color },
          { label: "Validità del Test", val: uosm >= sosm ? "Valido (Urine ipertoniche)" : "Non valido (Urina ipotonica)" }
        ],
        note: "Formula: (U-K * S-Osm) / (S-K * U-Osm). Valido solo se U-Osm > S-Osm e U-Na > 25 mEq/L."
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