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
    const paco2 = parseFloat(document.getElementById("paco2").value);
    const age = parseFloat(document.getElementById("age").value);
    const fio2 = parseFloat(document.getElementById("fio2").value);

    function calculate() {
      const patm = 760;
      const ph2o = 47;
      const r = 0.8;
      const pio2 = (fio2 / 100) * (patm - ph2o);
      const pao2Alveolar = pio2 - (paco2 / r);
      const aagrad = pao2Alveolar - pao2;
      const normalGrad = (age / 4) + 4;
      let interp = "Gradiente Normale (suggerisce ipoventilazione o alta quota)";
      let color = "#2e7d32";
      if (aagrad > normalGrad + 5) {
        interp = "Gradiente Aumentato: Difetto di diffusione, Shunt o Disparità V/Q (es. EP, Polmonite, BPCO, ARDS)";
        color = "#c62828";
      }
      return {
        mainValue: Math.round(aagrad) + " mmHg",
        mainLabel: "Gradiente P(A-a)O₂",
        metrics: [
          { label: "Gradiente Atteso per l'Età", val: "< " + Math.round(normalGrad) + " mmHg" },
          { label: "Valutazione Clinica", val: interp, color: color }
        ],
        note: "Equazione dei gas alveolari: PAO2 = PiO2 - (PaCO2 / 0.8)."
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