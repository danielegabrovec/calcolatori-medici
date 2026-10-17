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
    const bp = document.getElementById("bp").value;
    const clin = document.getElementById("clin").value;
    const dur = document.getElementById("dur").value;
    const dm = document.getElementById("dm").value;

    function calculate() {
      const score = parseInt(age) + parseInt(bp) + parseInt(clin) + parseInt(dur) + parseInt(dm);
      let risk = "Rischio Basso (0-3)"; let risk2d = "1.0% a 2 gg"; let color = "#2e7d32";
      if (score >= 6) { risk = "Alto Rischio (6-7)"; risk2d = "8.1% a 2 gg, 18% a 90 gg"; color = "#c62828"; }
      else if (score >= 4) { risk = "Rischio Moderato (4-5)"; risk2d = "4.1% a 2 gg"; color = "#d97706"; }
      return {
        mainValue: score + " / 7 Punti",
        mainLabel: "Score ABCD²",
        metrics: [
          { label: "Categoria di Rischio", val: risk, color: color },
          { label: "Rischio Ictus a 48 ore", val: risk2d }
        ],
        note: "Johnston SC et al. (Lancet 2007)."
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