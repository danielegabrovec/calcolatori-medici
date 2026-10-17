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
    const fever = document.getElementById("fever").value;
    const exudate = document.getElementById("exudate").value;
    const nodes = document.getElementById("nodes").value;
    const nocough = document.getElementById("nocough").value;

    function calculate() {
      const score = parseInt(fever) + parseInt(exudate) + parseInt(nodes) + parseInt(nocough);
      let prob = "Bassa probabilità (2 - 6%)"; let color = "#2e7d32";
      if (score === 4) { prob = "Probabilità Elevata (39 - 56%) - Trattamento o test rapido raccomandato"; color = "#c62828"; }
      else if (score === 3) { prob = "Probabilità Moderata (28 - 35%)"; color = "#d97706"; }
      else if (score === 2) { prob = "Probabilità 11 - 17%"; }
      return {
        mainValue: score + " / 4 Criteri",
        mainLabel: "Score di Centor Originale",
        metrics: [
          { label: "Probabilità Infezione Streptococcica", val: prob, color: color }
        ],
        note: "Centor RM et al. (Med Decis Making 1981)."
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