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
    const spo2 = parseFloat(document.getElementById("spo2").value);
    const fio2 = parseFloat(document.getElementById("fio2").value);
    const rr = parseFloat(document.getElementById("rr").value);

    function calculate() {
      const fDecimal = fio2 / 100;
      const rox = (spo2 / fDecimal) / rr;
      let interp = ""; let color = "#2e7d32";
      if (rox >= 4.88) {
        interp = "Basso rischio di fallimento HFNC (Score ≥ 4.88) - Continuare HFNC";
      } else if (rox <= 3.85) {
        interp = "Alto rischio di fallimento HFNC (Score < 3.85) - Valutare tempestiva intubazione";
        color = "#c62828";
      } else {
        interp = "Zona intermedia (3.85 - 4.87) - Monitoraggio clinico ravvicinato entro 2 ore";
        color = "#d97706";
      }
      return {
        mainValue: rox.toFixed(2),
        mainLabel: "Indice ROX",
        metrics: [
          { label: "Valutazione Clinica", val: interp, color: color },
          { label: "Soglia di Sicurezza Validata", val: "≥ 4.88 a 2, 6 e 12 ore" }
        ],
        note: "Roca O et al. (J Crit Care 2016). Formula: (SpO2 / FiO2) / RR."
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