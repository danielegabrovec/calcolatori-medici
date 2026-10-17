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
    const cancer = document.getElementById("cancer").value;
    const paralysis = document.getElementById("paralysis").value;
    const bedridden = document.getElementById("bedridden").value;
    const tenderness = document.getElementById("tenderness").value;
    const entireleg = document.getElementById("entireleg").value;
    const calf = document.getElementById("calf").value;
    const pitting = document.getElementById("pitting").value;
    const collateral = document.getElementById("collateral").value;
    const prevdvt = document.getElementById("prevdvt").value;
    const altdiag = document.getElementById("altdiag").value;

    function calculate() {
      const score = parseInt(cancer) + parseInt(paralysis) + parseInt(bedridden) + parseInt(tenderness) + parseInt(entireleg) + parseInt(calf) + parseInt(pitting) + parseInt(collateral) + parseInt(prevdvt) + parseInt(altdiag);
      let prob = score >= 2 ? "TVP Probabile (Score ≥ 2) - Indicato Ecocolordoppler" : "TVP Improbabile (Score < 2) - Eseguire D-Dimero";
      let color = score >= 2 ? "#c62828" : "#2e7d32";
      return {
        mainValue: score + " Punti",
        mainLabel: "Score di Wells TVP",
        metrics: [
          { label: "Probabilità Clinica", val: prob, color: color }
        ],
        note: "Wells PS et al. (NEJM 2003)."
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