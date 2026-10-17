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
    const weight = parseFloat(document.getElementById("weight").value);
    const naCurr = parseFloat(document.getElementById("naCurr").value);
    const naTarget = parseFloat(document.getElementById("naTarget").value);

    function calculate() {
      const tbw = weight * parseFloat(gender);
      const deltaNa = Math.max(0, naTarget - naCurr);
      const deficit = tbw * deltaNa;
      const mlSalina3 = (deficit / 513) * 1000;
      return {
        mainValue: Math.round(deficit) + " mEq di Na⁺",
        mainLabel: "Deficit di Sodio Calcolato",
        metrics: [
          { label: "Equivalente in NaCl 3% (ipertonica)", val: Math.round(mlSalina3) + " mL" },
          { label: "Limite di Sicurezza Correzione", val: "Massimo 8-10 mEq/L nelle prime 24h per prevenire la mielinolisi pontina centrale" }
        ],
        note: "Deficit Na = TBW * (NaTarget - NaAttuale). Salina ipertonica 3% = 513 mEq/L."
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