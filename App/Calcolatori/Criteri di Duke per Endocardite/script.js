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
    const majBact = document.getElementById("majBact").value;
    const majEcho = document.getElementById("majEcho").value;
    const minPred = document.getElementById("minPred").value;
    const minFev = document.getElementById("minFev").value;
    const minVasc = document.getElementById("minVasc").value;
    const minImm = document.getElementById("minImm").value;

    function calculate() {
      const nMaj = parseInt(majBact) + parseInt(majEcho);
      const nMin = parseInt(minPred) + parseInt(minFev) + parseInt(minVasc) + parseInt(minImm);
      let dx = "Endocardite Rigettata / Improbabile"; let color = "#2e7d32";
      if (nMaj === 2 || (nMaj === 1 && nMin >= 3) || (nMin >= 5)) {
        dx = "ENDOCARDITE DEFINITIVA (Criteri Soddisfatti)";
        color = "#c62828";
      } else if (nMaj === 1 || nMin >= 1) {
        dx = "ENDOCARDITE POSSIBILE";
        color = "#d97706";
      }
      return {
        mainValue: dx,
        mainLabel: "Diagnosi secondo Criteri di Duke",
        metrics: [
          { label: "Criteri Maggiori Soddisfatti", val: nMaj + " / 2" },
          { label: "Criteri Minori Soddisfatti", val: nMin + " / 5" }
        ],
        note: "Li JS et al. (Clin Infect Dis 2000) e Linee Guida ESC 2023 per l'Endocardite Infettiva."
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