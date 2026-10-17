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
    const asaGrade = document.getElementById("asaGrade").value;
    const emergency = document.getElementById("emergency").value;

    function calculate() {
      const g = asaGrade;
      const isE = emergency === "1";
      const displayClass = "ASA " + g + (isE ? "E" : "");
      let riskDesc = ""; let color = "#2e7d32";
      if (g === "1") { riskDesc = "Rischio anestesiologico basale minimo (mortalità perioperatoria < 0.1%)"; }
      else if (g === "2") { riskDesc = "Rischio lieve aumentato (mortalità perioperatoria ~0.2%)"; color = "#2e7d32"; }
      else if (g === "3") { riskDesc = "Rischio moderato-significativo (mortalità perioperatoria ~1.8%)"; color = "#d97706"; }
      else if (g === "4") { riskDesc = "Alto rischio perioperatorio (mortalità perioperatoria ~7.8%)"; color = "#ea580c"; }
      else if (g === "5") { riskDesc = "Rischio estremo (mortalità perioperatoria ~9.4%)"; color = "#c62828"; }
      else { riskDesc = "Donatore di organi a cuore battente"; color = "#475569"; }
      return {
        mainValue: displayClass,
        mainLabel: "Classe ASA Attribuita",
        metrics: [
          { label: "Mortalità Perioperatoria Indicativa", val: riskDesc, color: color },
          { label: "Contesto", val: isE ? "Chirurgia d'Emergenza (Suffisso E applicato)" : "Elezione" }
        ],
        note: "American Society of Anesthesiologists (ASA) Physical Status Classification System."
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