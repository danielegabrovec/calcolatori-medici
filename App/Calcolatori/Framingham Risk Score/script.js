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
    const gender = document.getElementById("gender").value;
    const age = parseFloat(document.getElementById("age").value);
    const chol = parseFloat(document.getElementById("chol").value);
    const hdl = parseFloat(document.getElementById("hdl").value);
    const sbp = parseFloat(document.getElementById("sbp").value);
    const smoker = document.getElementById("smoker").value;

    function calculate() {
      let pts = 0;
      if (gender === "m") {
        if (age >= 70) pts += 14; else if (age >= 60) pts += 11; else if (age >= 50) pts += 8; else pts += 5;
        if (chol >= 240) pts += 3; else if (chol >= 200) pts += 2;
        if (hdl < 40) pts += 2; else if (hdl >= 60) pts -= 1;
        if (sbp >= 140) pts += 2; else if (sbp >= 130) pts += 1;
        if (smoker === "1") pts += 3;
      } else {
        if (age >= 70) pts += 16; else if (age >= 60) pts += 12; else if (age >= 50) pts += 8; else pts += 4;
        if (chol >= 240) pts += 4; else if (chol >= 200) pts += 2;
        if (hdl < 40) pts += 2; else if (hdl >= 60) pts -= 1;
        if (sbp >= 140) pts += 3; else if (sbp >= 130) pts += 1;
        if (smoker === "1") pts += 3;
      }
      let riskPct = Math.min(30, Math.max(1, pts * 1.8));
      let cat = "Rischio Basso (< 10%)"; let color = "#2e7d32";
      if (riskPct >= 20) { cat = "Rischio Elevato (≥ 20% a 10 anni)"; color = "#c62828"; }
      else if (riskPct >= 10) { cat = "Rischio Intermedio (10-19%)"; color = "#d97706"; }
      return {
        mainValue: riskPct.toFixed(1) + " % a 10 anni",
        mainLabel: "Rischio Cardiovascolare Framingham",
        metrics: [
          { label: "Categoria di Rischio", val: cat, color: color },
          { label: "Punteggio Cumulativo", val: pts + " Punti" }
        ],
        note: "Adult Treatment Panel III (ATP III) / Framingham Heart Study."
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