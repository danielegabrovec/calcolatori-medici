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
    const age = parseFloat(document.getElementById("age").value);
    const hr = parseFloat(document.getElementById("hr").value);
    const sbp = parseFloat(document.getElementById("sbp").value);
    const creat = parseFloat(document.getElementById("creat").value);
    const arrest = document.getElementById("arrest").value;
    const st = document.getElementById("st").value;
    const enzymes = document.getElementById("enzymes").value;

    function calculate() {
      let pts = Math.round(age * 1.5) + Math.round(hr * 0.4) + Math.round((200 - sbp) * 0.2) + Math.round(creat * 12) + parseInt(arrest) + parseInt(st) + parseInt(enzymes);
      let risk = "Rischio Basso (GRACE < 109)"; let color = "#2e7d32";
      if (pts > 140) { risk = "Alto Rischio (GRACE > 140) - Indicata coronarografia invasiva precoce (< 24h)"; color = "#c62828"; }
      else if (pts >= 109) { risk = "Rischio Intermedio (GRACE 109-140)"; color = "#d97706"; }
      return {
        mainValue: pts + " Punti",
        mainLabel: "Score GRACE 2.0",
        metrics: [
          { label: "Categoria di Rischio", val: risk, color: color },
          { label: "Timing Coronarografia (Linee Guida ESC)", val: pts > 140 ? "Strategia Invasiva Precoce entro 24 ore" : "Strategia Invasiva Selettiva" }
        ],
        note: "Fox KA et al. (BMJ 2006). Parametro cardine delle linee guida ESC NSTE-ACS."
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