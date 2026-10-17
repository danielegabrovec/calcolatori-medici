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
    const mpap = parseFloat(document.getElementById("mpap").value);
    const pcwp = parseFloat(document.getElementById("pcwp").value);
    const co = parseFloat(document.getElementById("co").value);

    function calculate() {
      const pvrWood = (mpap - pcwp) / co;
      const pvrDyne = pvrWood * 80;
      let interp = "Normale (< 2 Wood Units)"; let color = "#2e7d32";
      if (pvrWood > 2.0 && mpap > 20) {
        interp = "Ipertensione Polmonare Precapillare (mPAP > 20 mmHg e PVR > 2 WU con PCWP ≤ 15 mmHg)";
        color = "#c62828";
      }
      return {
        mainValue: pvrWood.toFixed(2) + " Wood Units",
        mainLabel: "Resistenza Vascolare Polmonare (PVR)",
        metrics: [
          { label: "In dyne·s·cm⁻⁵", val: Math.round(pvrDyne) + " dyne·s·cm⁻⁵" },
          { label: "Criteri ESC/ERS 2022", val: interp, color: color }
        ],
        note: "Linee Guida ESC/ERS 2022 per l'Ipertensione Polmonare: PVR = (mPAP - PCWP) / CO."
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