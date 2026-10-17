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
    const c = document.getElementById("c").value;
    const u = document.getElementById("u").value;
    const r = document.getElementById("r").value;
    const b = document.getElementById("b").value;
    const age = document.getElementById("age").value;

    function calculate() {
      const score = parseInt(c) + parseInt(u) + parseInt(r) + parseInt(b) + parseInt(age);
      let mortality = ""; let setting = ""; let color = "#2e7d32";
      if (score <= 1) { mortality = "Basso rischio (< 3%)"; setting = "Trattamento ambulatoriale domiciliare"; }
      else if (score === 2) { mortality = "Rischio intermedio (~ 9%)"; setting = "Ospedalizzazione raccomandata"; color = "#d97706"; }
      else { mortality = "Alto rischio (15 - 40%)"; setting = "Ricovero ospedaliero urgente (valutare Terapia Intensiva se 4-5)"; color = "#c62828"; }
      return {
        mainValue: score + " / 5 Punti",
        mainLabel: "Score CURB-65",
        metrics: [
          { label: "Mortalità a 30 Giorni", val: mortality, color: color },
          { label: "Setting di Cura Raccomandato", val: setting }
        ],
        note: "British Thoracic Society (Lim WS et al., Thorax 2003)."
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