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
    const symptoms = document.getElementById("symptoms").value;
    const diffCalf = document.getElementById("diffCalf").value;
    const trimester = document.getElementById("trimester").value;

    function calculate() {
      const score = parseInt(symptoms) + parseInt(diffCalf) + parseInt(trimester);
      let interp = score >= 1 ? "Presenza di predittori LEFt: Alto sospetto di TVP - Procedere a Ecocolordoppler venoso completo immediato" : "Bassa probabilità clinica";
      let color = score >= 1 ? "#c62828" : "#2e7d32";
      return {
        mainValue: score + " Criteri LEFt",
        mainLabel: "Regola Clinica LEFt per TVP in Gravidanza",
        metrics: [
          { label: "Indicazione Diagnostica", val: interp, color: color },
          { label: "Sicurezza", val: "L'Ecocolordoppler è sicuro e privo di radiazioni sia per la madre che per il feto" }
        ],
        note: "Chan WS et al. (BMJ 2009). Regola clinica LEFt validata per la gestante."
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