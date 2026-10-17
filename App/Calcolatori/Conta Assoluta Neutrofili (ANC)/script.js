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
    const wbc = parseFloat(document.getElementById("wbc").value);
    const seg = parseFloat(document.getElementById("seg").value);
    const bands = parseFloat(document.getElementById("bands").value);

    function calculate() {
      const anc = (wbc * (seg + bands)) / 100;
      let risk = "Normale (> 1500/µL)"; let color = "#2e7d32";
      if (anc < 500) { risk = "Neutropenia Grave (< 500/µL)"; color = "#c62828"; }
      else if (anc < 1000) { risk = "Neutropenia Moderata (500-999/µL)"; color = "#ea580c"; }
      else if (anc < 1500) { risk = "Neutropenia Lieve (1000-1500/µL)"; color = "#d97706"; }
      return {
        mainValue: Math.round(anc) + " /µL",
        mainLabel: "Conta Assoluta Neutrofili",
        metrics: [
          { label: "Grado di Neutropenia", val: risk, color: color }
        ],
        note: "Formula: WBC * (% Segmentati + % Bandati) / 100."
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