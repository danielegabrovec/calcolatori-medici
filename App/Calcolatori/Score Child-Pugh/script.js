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
    const bili = document.getElementById("bili").value;
    const alb = document.getElementById("alb").value;
    const inr = document.getElementById("inr").value;
    const asc = document.getElementById("asc").value;
    const enc = document.getElementById("enc").value;

    function calculate() {
      const score = parseInt(bili) + parseInt(alb) + parseInt(inr) + parseInt(asc) + parseInt(enc);
      let classe = ""; let sur1 = ""; let color = "#2e7d32";
      if (score <= 6) { classe = "Classe A (Compensata)"; sur1 = "100% a 1 anno"; }
      else if (score <= 9) { classe = "Classe B (Compromesso funzionale)"; sur1 = "80% a 1 anno"; color = "#d97706"; }
      else { classe = "Classe C (Scompensata)"; sur1 = "45% a 1 anno"; color = "#c62828"; }
      return {
        mainValue: score + " Punti (" + classe + ")",
        mainLabel: "Punteggio Child-Pugh",
        metrics: [
          { label: "Sopravvivenza a 1 Anno Stimata", val: sur1, color: color }
        ],
        note: "Pugh RN et al. (1973)."
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