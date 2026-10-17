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
    const weight = parseFloat(document.getElementById("weight").value);
    const hco3Curr = parseFloat(document.getElementById("hco3Curr").value);
    const hco3Target = parseFloat(document.getElementById("hco3Target").value);

    function calculate() {
      const delta = Math.max(0, hco3Target - hco3Curr);
      const deficit = 0.5 * weight * delta;
      return {
        mainValue: Math.round(deficit) + " mEq di HCO₃⁻",
        mainLabel: "Deficit Totale di Bicarbonato",
        metrics: [
          { label: "Spazio di Distribuzione Bicarbonato", val: "50% del peso corporeo (0.5 * Peso)" },
          { label: "Strategia Infusionale", val: "Somministrare metà dose nelle prime 2-4 ore e rivalutare l'EGA" }
        ],
        note: "Deficit = 0.5 * Peso (kg) * (HCO3_target - HCO3_attuale)."
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