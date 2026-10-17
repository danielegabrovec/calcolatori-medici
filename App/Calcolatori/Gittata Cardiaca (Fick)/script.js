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
    const vo2 = parseFloat(document.getElementById("vo2").value);
    const cao2 = parseFloat(document.getElementById("cao2").value);
    const cvo2 = parseFloat(document.getElementById("cvo2").value);
    const bsa = parseFloat(document.getElementById("bsa").value);

    function calculate() {
      const diffAv = cao2 - cvo2;
      const co = (vo2 / (diffAv * 10)); // L/min
      const ci = co / bsa;
      let interp = "Normale (CI 2.5 - 4.0 L/min/m²)";
      let color = "#2e7d32";
      if (ci < 2.2) { interp = "Shock Cardiogeno / Bassa Portata (CI < 2.2)"; color = "#c62828"; }
      return {
        mainValue: co.toFixed(2) + " L / min",
        mainLabel: "Gittata Cardiaca (CO)",
        metrics: [
          { label: "Indice Cardiaco (CI)", val: ci.toFixed(2) + " L/min/m²", color: color },
          { label: "Stato Clinico", val: interp }
        ],
        note: "Principio di Fick: CO = VO2 / (CaO2 - CvO2)."
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