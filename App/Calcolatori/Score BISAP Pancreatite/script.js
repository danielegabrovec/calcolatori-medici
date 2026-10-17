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
    const b = document.getElementById("b").value;
    const i = document.getElementById("i").value;
    const s = document.getElementById("s").value;
    const a = document.getElementById("a").value;
    const p = document.getElementById("p").value;

    function calculate() {
      const score = parseInt(b) + parseInt(i) + parseInt(s) + parseInt(a) + parseInt(p);
      let mort = "< 1% mortalità"; let color = "#2e7d32";
      if (score >= 3) {
        mort = "Mortalità elevata (≥ 5-20%) - Alto rischio di insufficienza d'organo e necrosi pancreatica";
        color = "#c62828";
      } else if (score === 2) {
        mort = "Mortalità ~ 2%";
        color = "#d97706";
      }
      return {
        mainValue: score + " / 5 Punti",
        mainLabel: "Score BISAP",
        metrics: [
          { label: "Mortalità Ospedaliera Stimata", val: mort, color: color },
          { label: "Indicazione", val: score >= 3 ? "Richiede monitoraggio intensivo o semi-intensivo e idratazione idonea" : "Monitoraggio clinico ordinario" }
        ],
        note: "Wu BU et al. (Gut 2008)."
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