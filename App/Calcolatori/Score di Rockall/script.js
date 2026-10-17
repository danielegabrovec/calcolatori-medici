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
    const age = document.getElementById("age").value;
    const shock = document.getElementById("shock").value;
    const comorb = document.getElementById("comorb").value;
    const diag = document.getElementById("diag").value;
    const stigmata = document.getElementById("stigmata").value;

    function calculate() {
      const score = parseInt(age) + parseInt(shock) + parseInt(comorb) + parseInt(diag) + parseInt(stigmata);
      let mort = "< 1% mortalità, < 5% risanguinamento"; let color = "#2e7d32";
      if (score >= 8) { mort = "41% mortalità, 40% risanguinamento (Rischio Altissimo)"; color = "#c62828"; }
      else if (score >= 5) { mort = "11% mortalità, 25% risanguinamento"; color = "#ea580c"; }
      else if (score >= 3) { mort = "3% mortalità, 10% risanguinamento"; color = "#d97706"; }
      return {
        mainValue: score + " / 11 Punti",
        mainLabel: "Score di Rockall Completo",
        metrics: [
          { label: "Mortalità & Rischio Risanguinamento", val: mort, color: color }
        ],
        note: "Rockall TA et al. (Gut 1996)."
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