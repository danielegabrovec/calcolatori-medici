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
    const classVal = document.getElementById("classVal").value;

    function calculate() {
      const cl = classVal;
      let diff = "Intubazione verosimilmente agevole"; let color = "#2e7d32";
      if (cl === "3") { diff = "Intubazione potenzialmente difficoltosa (Classe III)"; color = "#d97706"; }
      else if (cl === "4") { diff = "Alto rischio di Intubazione Difficile (Classe IV) - Preparare videolaringoscopio/fibroscopio"; color = "#c62828"; }
      return {
        mainValue: "Classe " + cl,
        mainLabel: "Grado Mallampati",
        metrics: [
          { label: "Predizione Difficoltà Laringoscopica", val: diff, color: color },
          { label: "Posizione di Valutazione", val: "Paziente seduto, testa neutra, bocca spalancata e lingua protrusa senza fonazione" }
        ],
        note: "Mallampati SR et al. (Can Anaesth Soc J 1985)."
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