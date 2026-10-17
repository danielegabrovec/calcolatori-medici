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
    const hypo = document.getElementById("hypo").value;
    const iabp = document.getElementById("iabp").value;
    const chf = document.getElementById("chf").value;
    const age = document.getElementById("age").value;
    const anemia = document.getElementById("anemia").value;
    const dm = document.getElementById("dm").value;
    const vol = document.getElementById("vol").value;
    const egfr = document.getElementById("egfr").value;

    function calculate() {
      const score = parseInt(hypo) + parseInt(iabp) + parseInt(chf) + parseInt(age) + parseInt(anemia) + parseInt(dm) + parseInt(vol) + parseInt(egfr);
      let riskCin = ""; let riskDial = ""; let color = "#2e7d32";
      if (score <= 5) { riskCin = "7.5% rischio CIN"; riskDial = "0.04% rischio dialisi"; }
      else if (score <= 10) { riskCin = "14.0% rischio CIN"; riskDial = "0.12% rischio dialisi"; color = "#d97706"; }
      else if (score <= 15) { riskCin = "26.1% rischio CIN"; riskDial = "1.09% rischio dialisi"; color = "#ea580c"; }
      else { riskCin = "57.3% rischio CIN"; riskDial = "12.6% rischio dialisi (Altissimo)"; color = "#c62828"; }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score di Mehran",
        metrics: [
          { label: "Rischio di Danno Renale da Mezzo di Contrasto", val: riskCin, color: color },
          { label: "Rischio di Necessità di Dialisi", val: riskDial }
        ],
        note: "Mehran R et al. (J Am Coll Cardiol 2004)."
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