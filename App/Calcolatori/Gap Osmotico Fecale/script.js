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
    const fNa = parseFloat(document.getElementById("fNa").value);
    const fK = parseFloat(document.getElementById("fK").value);

    function calculate() {
      const gap = 290 - (2 * (fNa + fK));
      let interp = ""; let color = "#2e7d32";
      if (gap > 100) {
        interp = "Diarrea OSMOTICA (Gap > 100 mOsm/kg): Presenza di soluti non assorbiti nel lume (es. deficit di lattasi/lattosio, celiachia, lassativi osmotici). La diarrea cessa con il digiuno.";
        color = "#0277bd";
      } else if (gap < 50) {
        interp = "Diarrea SECRETORIA (Gap < 50 mOsm/kg): Secrezione attiva di elettroliti (es. tossine batteriche, VIPoma, sindrome da carcinoide, acidi biliari). La diarrea persiste anche a digiuno.";
        color = "#c62828";
      } else {
        interp = "Gap Intermedio (50 - 100 mOsm/kg): Quadro misto.";
        color = "#d97706";
      }
      return {
        mainValue: Math.round(gap) + " mOsm/kg",
        mainLabel: "Gap Osmotico Fecale",
        metrics: [
          { label: "Classificazione Eziologica", val: interp, color: color },
          { label: "Osmolarità Fecale Presunta", val: "290 mOsm/kg (Isotonica al plasma)" }
        ],
        note: "Gap = 290 - 2 * (Na_fecale + K_fecale)."
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