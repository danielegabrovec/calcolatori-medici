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
    const color = document.getElementById("color").value;
    const hr = document.getElementById("hr").value;
    const reflex = document.getElementById("reflex").value;
    const tone = document.getElementById("tone").value;
    const resp = document.getElementById("resp").value;

    function calculate() {
      const score = parseInt(color) + parseInt(hr) + parseInt(reflex) + parseInt(tone) + parseInt(resp);
      let cond = "Ottime condizioni neonatali (7-10)"; let colorR = "#2e7d32";
      if (score <= 3) { cond = "Grave depressione neonatale (0-3) - Rianimazione immediata"; colorR = "#c62828"; }
      else if (score <= 6) { cond = "Moderata depressione (4-6) - Supporto O2 e stimolazione"; colorR = "#d97706"; }
      return {
        mainValue: score + " / 10",
        mainLabel: "Score di APGAR",
        metrics: [
          { label: "Giudizio Clinico", val: cond, color: colorR }
        ],
        note: "Virginia Apgar (1953)."
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