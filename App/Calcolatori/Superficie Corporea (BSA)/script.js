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
    const height = parseFloat(document.getElementById("height").value);

    function calculate() {
      const bsaMosteller = Math.sqrt((weight * height) / 3600);
      const bsaDubois = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
      const bsaHaycock = 0.024265 * Math.pow(weight, 0.5378) * Math.pow(height, 0.3964);
      return {
        mainValue: bsaMosteller.toFixed(2) + " m²",
        mainLabel: "Superficie Corporea (Mosteller)",
        metrics: [
          { label: "Formula DuBois & DuBois", val: bsaDubois.toFixed(2) + " m²" },
          { label: "Formula di Haycock", val: bsaHaycock.toFixed(2) + " m²" },
          { label: "Valore Medio Adulto Rif.", val: "1.7 - 1.9 m²" }
        ],
        note: "La formula di Mosteller (sqrt[peso*altezza/3600]) è la più impiegata in oncologia clinica e terapia intensiva."
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