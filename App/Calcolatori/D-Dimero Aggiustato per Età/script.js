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
    const age = parseFloat(document.getElementById("age").value);
    const ddimer = parseFloat(document.getElementById("ddimer").value);

    function calculate() {
      const cutoff = age > 50 ? age * 10 : 500;
      const isNeg = ddimer < cutoff;
      let interp = isNeg ? "D-Dimero NEGATIVO (inferiore al cutoff corretto per età): TVP ed EP escluse con sicurezza se probabilità clinica bassa/intermedia" : "D-Dimero POSITIVO (superiore al cutoff per età): Richiede approfondimento radiologico (Angio-TC o Ecocolordoppler)";
      let color = isNeg ? "#2e7d32" : "#c62828";
      return {
        mainValue: cutoff + " ng/mL",
        mainLabel: "Cut-Off Corretto per l'Età",
        metrics: [
          { label: "D-Dimero Riscontrato", val: ddimer + " ng/mL" },
          { label: "Esito Valutazione", val: interp, color: color },
          { label: "Regola", val: age > 50 ? "Età * 10 ng/mL (FEU)" : "Standard 500 ng/mL" }
        ],
        note: "Trial ADJUST-PE (Righini M et al., JAMA 2014). Riduce del 30% le Angio-TC inutili nell'anziano."
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