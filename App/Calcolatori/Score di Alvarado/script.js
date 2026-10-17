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
    const migr = document.getElementById("migr").value;
    const anorex = document.getElementById("anorex").value;
    const nausea = document.getElementById("nausea").value;
    const tender = document.getElementById("tender").value;
    const rebound = document.getElementById("rebound").value;
    const elev = document.getElementById("elev").value;
    const leuko = document.getElementById("leuko").value;
    const shift = document.getElementById("shift").value;

    function calculate() {
      const score = parseInt(migr) + parseInt(anorex) + parseInt(nausea) + parseInt(tender) + parseInt(rebound) + parseInt(elev) + parseInt(leuko) + parseInt(shift);
      let prob = "Appendicite molto improbabile (1-4)"; let color = "#2e7d32";
      if (score >= 7) { prob = "Appendicite altamente probabile (7-10) - Indicata chirurgia"; color = "#c62828"; }
      else if (score >= 5) { prob = "Appendicite possibile (5-6) - Indicata ecografia addome"; color = "#d97706"; }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Score di Alvarado",
        metrics: [
          { label: "Probabilità Clinica", val: prob, color: color }
        ],
        note: "Alvarado A (Ann Emerg Med 1986)."
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