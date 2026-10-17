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
    const grade = document.getElementById("grade").value;

    function calculate() {
      const g = parseInt(grade);
      let interp = "Idoneo alla maggior parte dei trattamenti chemioterapici standard"; let color = "#2e7d32";
      if (g >= 3) {
        interp = "Forte limitazione ai trattamenti antiblastici standard per elevato rischio di tossicità (indicata terapia di supporto/palliativa)";
        color = "#c62828";
      } else if (g === 2) {
        interp = "Borderline: valutare con cautela chemioterapia a dosi ridotte o schemi meno tossici";
        color = "#d97706";
      }
      return {
        mainValue: "ECOG " + g,
        mainLabel: "Punteggio ECOG",
        metrics: [
          { label: "Idoneità Terapeutica Oncologica", val: interp, color: color },
          { label: "Corrispondente Karnofsky", val: g === 0 ? "100%" : g === 1 ? "80-90%" : g === 2 ? "60-70%" : g === 3 ? "40-50%" : g === 4 ? "10-30%" : "0%" }
        ],
        note: "Eastern Cooperative Oncology Group (Oken MM et al., Am J Clin Oncol 1982)."
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