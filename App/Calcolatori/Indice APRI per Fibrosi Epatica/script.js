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
    const ast = parseFloat(document.getElementById("ast").value);
    const astUln = parseFloat(document.getElementById("astUln").value);
    const plt = parseFloat(document.getElementById("plt").value);

    function calculate() {
      const apri = ((ast / astUln) / plt) * 100;
      let interp = "Bassa probabilità di fibrosi avanzata (APRI < 0.5)"; let color = "#2e7d32";
      if (apri > 1.5) {
        interp = "APRI > 1.5: Forte probabilità di cirrosi epatica (F4)";
        color = "#c62828";
      } else if (apri > 1.0) {
        interp = "APRI > 1.0: Probabile fibrosi significativa / avanzata (≥ F2)";
        color = "#d97706";
      }
      return {
        mainValue: apri.toFixed(2),
        mainLabel: "Indice APRI",
        metrics: [
          { label: "Interpretazione Clinica", val: interp, color: color },
          { label: "Formula", val: "[(AST / ULN) / Piastrine (10^9/L)] * 100" }
        ],
        note: "Wai CT et al. (Hepatology 2003). Raccomandato dall'OMS come test non invasivo a basso costo."
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