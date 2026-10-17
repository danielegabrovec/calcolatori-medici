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
    const highrisk = document.getElementById("highrisk").value;
    const cad = document.getElementById("cad").value;
    const chf = document.getElementById("chf").value;
    const cva = document.getElementById("cva").value;
    const insulin = document.getElementById("insulin").value;
    const creat = document.getElementById("creat").value;

    function calculate() {
      const score = parseInt(highrisk) + parseInt(cad) + parseInt(chf) + parseInt(cva) + parseInt(insulin) + parseInt(creat);
      let riskRate = ""; let classe = ""; let color = "#2e7d32";
      if (score === 0) { classe = "Classe I"; riskRate = "0.4% complicanze cardiache maggiori"; }
      else if (score === 1) { classe = "Classe II"; riskRate = "0.9% complicanze cardiache maggiori"; color = "#2e7d32"; }
      else if (score === 2) { classe = "Classe III"; riskRate = "6.6% complicanze cardiache maggiori"; color = "#d97706"; }
      else { classe = "Classe IV"; riskRate = "≥ 11.0% complicanze cardiache maggiori"; color = "#c62828"; }
      return {
        mainValue: score + " Punti (" + classe + ")",
        mainLabel: "Score RCRI di Lee",
        metrics: [
          { label: "Rischio Cardiaco Perioperatorio MACE", val: riskRate, color: color },
          { label: "Raccomandazione ESC/AHA", val: score >= 2 ? "Valutazione cardiologica ed ecocardiogramma preoperatorio raccomandati" : "Procedibilità chirurgica sicura dal punto di vista cardiologico" }
        ],
        note: "Lee TH et al. (Circulation 1999)."
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