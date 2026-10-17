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
    const age = parseFloat(document.getElementById("age").value);
    const ast = parseFloat(document.getElementById("ast").value);
    const alt = parseFloat(document.getElementById("alt").value);
    const plt = parseFloat(document.getElementById("plt").value);

    function calculate() {
      const fib4 = (age * ast) / (plt * Math.sqrt(alt));
      let interp = ""; let color = "#2e7d32";
      if (fib4 < 1.30) {
        interp = "FIB-4 < 1.30: Bassa probabilità di fibrosi avanzata (F0-F1, NPV > 90%)";
      } else if (fib4 > 2.67) {
        interp = "FIB-4 > 2.67: Alta probabilità di fibrosi avanzata (F3-F4) - Indicata elastografia (FibroScan)";
        color = "#c62828";
      } else {
        interp = "FIB-4 1.30 - 2.67: Zona indeterminata - Necessario secondo livello (es. FibroScan)";
        color = "#d97706";
      }
      return {
        mainValue: fib4.toFixed(2),
        mainLabel: "Indice FIB-4",
        metrics: [
          { label: "Stratificazione Fibrosi Epatica", val: interp, color: color },
          { label: "Linee Guida EASL/AASLD", val: "Raccomandato come test non invasivo di primo livello" }
        ],
        note: "Sterling RK et al. (Hepatology 2006): FIB-4 = [Età * AST] / [Piastrine * sqrt(ALT)]."
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