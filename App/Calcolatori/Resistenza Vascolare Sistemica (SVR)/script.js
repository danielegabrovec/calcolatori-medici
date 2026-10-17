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
    const map = parseFloat(document.getElementById("map").value);
    const cvp = parseFloat(document.getElementById("cvp").value);
    const co = parseFloat(document.getElementById("co").value);

    function calculate() {
      const svr = (80 * (map - cvp)) / co;
      let interp = "Normale (800 - 1200 dyne·s/cm⁵)"; let color = "#2e7d32";
      if (svr < 800) { interp = "Vasodilatazione periferica (es. Shock Distributivo/Settico, Anafilassi)"; color = "#ea580c"; }
      else if (svr > 1200) { interp = "Vasocostrizione elevata (es. Shock Ipovolemico, Shock Cardiogeno)"; color = "#d97706"; }
      return {
        mainValue: Math.round(svr) + " dyne·s/cm⁵",
        mainLabel: "Resistenza Vascolare Sistemica",
        metrics: [
          { label: "In Unità Wood (mmHg·min/L)", val: ((map - cvp) / co).toFixed(1) + " Wood Units" },
          { label: "Quadro Emodinamico", val: interp, color: color }
        ],
        note: "SVR = 80 * (MAP - CVP) / CO. Range fisiologico normale: 800 - 1200 dyne·s/cm⁵."
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