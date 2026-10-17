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
    const hbCurr = parseFloat(document.getElementById("hbCurr").value);
    const hbTarget = parseFloat(document.getElementById("hbTarget").value);
    const depot = parseFloat(document.getElementById("depot").value);

    function calculate() {
      const deltaHb = Math.max(0, hbTarget - hbCurr);
      const totalIron = (weight * deltaHb * 2.4) + depot;
      return {
        mainValue: Math.round(totalIron) + " mg di Ferro Elementare",
        mainLabel: "Dose Totale di Ferro EV Necessaria",
        metrics: [
          { label: "Formula di Ganzoni", val: "Peso * (Hb_target - Hb_attuale) * 2.4 + Depositi" },
          { label: "Fabbisogno per la sola Massa Emoglobinica", val: Math.round(weight * deltaHb * 2.4) + " mg" },
          { label: "Riserva di Deposito Reintegrata", val: depot + " mg" }
        ],
        note: "Ganzoni AM (Schweiz Med Wochenschr 1970). Utilizzata per la prescrizione di ferro carbossimaltosio o saccarato EV."
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