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
    const htn = document.getElementById("htn").value;
    const renal = document.getElementById("renal").value;
    const liver = document.getElementById("liver").value;
    const stroke = document.getElementById("stroke").value;
    const bleeding = document.getElementById("bleeding").value;
    const inr = document.getElementById("inr").value;
    const elderly = document.getElementById("elderly").value;
    const drugs = document.getElementById("drugs").value;
    const alcohol = document.getElementById("alcohol").value;

    function calculate() {
      const score = parseInt(htn) + parseInt(renal) + parseInt(liver) + parseInt(stroke) + parseInt(bleeding) + parseInt(inr) + parseInt(elderly) + parseInt(drugs) + parseInt(alcohol);
      let risk = "Rischio Basso"; let color = "#2e7d32";
      if (score >= 3) { risk = "Alto Rischio di Sanguinamento (Score ≥ 3)"; color = "#c62828"; }
      else if (score >= 2) { risk = "Rischio Moderato"; color = "#d97706"; }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score HAS-BLED",
        metrics: [
          { label: "Livello di Rischio", val: risk, color: color },
          { label: "Approccio Clinico", val: score >= 3 ? "Correggere i fattori modificabili e monitorare strettamente" : "Rischio accettabile per anticoagulazione" }
        ],
        note: "Un punteggio ≥3 non controindica l'anticoagulazione ma impone la correzione dei fattori di rischio reversibili."
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