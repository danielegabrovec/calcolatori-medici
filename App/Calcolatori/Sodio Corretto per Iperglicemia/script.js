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
    const na = parseFloat(document.getElementById("na").value);
    const glu = parseFloat(document.getElementById("glu").value);

    function calculate() {
      const excess100 = Math.max(0, (glu - 100) / 100);
      const naKatz = na + (1.6 * excess100);
      const naHillier = na + (2.4 * excess100);
      return {
        mainValue: naHillier.toFixed(1) + " mEq/L",
        mainLabel: "Sodio Corretto (Formula Hillier 2.4)",
        metrics: [
          { label: "Formula di Katz (1.6)", val: naKatz.toFixed(1) + " mEq/L" },
          { label: "Differenza Osmotica", val: "+" + (2.4 * excess100).toFixed(1) + " mEq/L" }
        ],
        note: "Hillier et al. (1999) hanno dimostrato che il fattore di correzione più fedele nell'iperglicemia marcata (>400 mg/dL) è 2.4 mEq/L ogni 100 mg/dL di glucosio sopra 100."
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

  // Calcolo automatico iniziale per presentare subito i risultati
  compute();
});