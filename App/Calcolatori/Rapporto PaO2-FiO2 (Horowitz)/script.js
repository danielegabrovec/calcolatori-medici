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
    const pao2 = parseFloat(document.getElementById("pao2").value);
    const fio2 = parseFloat(document.getElementById("fio2").value);

    function calculate() {
      const fDecimal = fio2 / 100;
      const ratio = pao2 / fDecimal;
      let ards = "Normale (P/F > 300)"; let color = "#2e7d32";
      if (ratio <= 100) { ards = "ARDS Grave (P/F ≤ 100)"; color = "#c62828"; }
      else if (ratio <= 200) { ards = "ARDS Moderata (100 < P/F ≤ 200)"; color = "#ea580c"; }
      else if (ratio <= 300) { ards = "ARDS Lieve (200 < P/F ≤ 300)"; color = "#d97706"; }
      return {
        mainValue: Math.round(ratio) + " mmHg",
        mainLabel: "Rapporto PaO₂ / FiO₂",
        metrics: [
          { label: "Criteri di Berlino (ARDS)", val: ards, color: color },
          { label: "FiO₂ ambiente", val: "21%" }
        ],
        note: "Definizione di Berlino per l'ARDS (JAMA 2012)."
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