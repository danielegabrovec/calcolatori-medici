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
    const alt = parseFloat(document.getElementById("alt").value);

    function calculate() {
      const ratio = ast / alt;
      let interp = "Rapporto AST/ALT < 1: Tipico di NAFLD/MASLD, epatite virale cronica o danno epatico precoce"; let color = "#2e7d32";
      if (ratio >= 2.0) {
        interp = "Rapporto AST/ALT ≥ 2.0: Altamente suggestivo di Epatopatia Alcolica o Cirrosi avanzata";
        color = "#c62828";
      } else if (ratio > 1.0) {
        interp = "Rapporto AST/ALT 1.0 - 2.0: Possibile progressione verso fibrosi avanzata o cirrosi";
        color = "#d97706";
      }
      return {
        mainValue: ratio.toFixed(2),
        mainLabel: "Rapporto AST / ALT",
        metrics: [
          { label: "Quadro Eziologico", val: interp, color: color },
          { label: "Valore Fisiologico Normale", val: "~ 0.8" }
        ],
        note: "De Ritis F et al. (Minerva Med 1957). Nei mitocondri la frazione AST è predominante, da cui il rilascio massivo nel danno etilico necrotico."
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