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
    const chest = document.getElementById("chest").value;
    const inter = document.getElementById("inter").value;
    const xyph = document.getElementById("xyph").value;
    const nose = document.getElementById("nose").value;
    const grunt = document.getElementById("grunt").value;

    function calculate() {
      const score = parseInt(chest) + parseInt(inter) + parseInt(xyph) + parseInt(nose) + parseInt(grunt);
      let interp = "Nessun distress respiratorio (0 pt)"; let color = "#2e7d32";
      if (score >= 7) { interp = "Distress Respiratorio Grave (Score ≥ 7) - Rischio arresto respiratorio imminente"; color = "#c62828"; }
      else if (score >= 4) { interp = "Distress Respiratorio Moderato (Score 4-6)"; color = "#ea580c"; }
      else if (score >= 1) { interp = "Distress Lieve (Score 1-3)"; color = "#d97706"; }
      return {
        mainValue: score + " / 10",
        mainLabel: "Score Silverman-Andersen",
        metrics: [
          { label: "Severità Clinica", val: interp, color: color },
          { label: "Punteggio 0", val: "Assenza di distress respiratorio" }
        ],
        note: "Silverman WA & Andersen DH (Pediatrics 1956)."
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