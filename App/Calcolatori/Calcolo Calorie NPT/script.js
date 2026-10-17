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
    const dextrose = parseFloat(document.getElementById("dextrose").value);
    const lipids = parseFloat(document.getElementById("lipids").value);
    const amino = parseFloat(document.getElementById("amino").value);

    function calculate() {
      const kcalDex = dextrose * 3.4; // Glucosio monoidrato endovena = 3.4 kcal/g
      const kcalLip = lipids * 10.0;   // Emulsioni lipidiche commerciali tipiche ~10 kcal/g
      const kcalAa = amino * 4.0;
      const total = kcalDex + kcalLip + kcalAa;
      return {
        mainValue: Math.round(total) + " kcal / die",
        mainLabel: "Calorie Totali Fornite da NPT",
        metrics: [
          { label: "Da Glucosio (3.4 kcal/g)", val: Math.round(kcalDex) + " kcal (" + Math.round((kcalDex/total)*100) + "%)" },
          { label: "Da Lipidi (10 kcal/g)", val: Math.round(kcalLip) + " kcal (" + Math.round((kcalLip/total)*100) + "%)" },
          { label: "Da Aminoacidi (4.0 kcal/g)", val: Math.round(kcalAa) + " kcal (" + Math.round((kcalAa/total)*100) + "%)" }
        ],
        note: "Il destrosio monoidrato idrato fornisce 3.4 kcal/g (non 4.0 come i carboidrati enterici)."
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