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
    const uk = parseFloat(document.getElementById("uk").value);
    const sk = parseFloat(document.getElementById("sk").value);
    const ucr = parseFloat(document.getElementById("ucr").value);
    const scr = parseFloat(document.getElementById("scr").value);

    function calculate() {
      const fek = ((uk * scr) / (sk * ucr)) * 100;
      let interp = "Normale (10 - 20% con funzione renale integra)"; let color = "#2e7d32";
      if (sk < 3.5 && fek > 10) {
        interp = "FEK > 10% in ipokaliemia: Perdita renale inappropriata di potassio (es. diuretici, iperaldosteronismo, Bartter/Gitelman)";
        color = "#c62828";
      } else if (sk < 3.5 && fek < 6) {
        interp = "FEK < 6% in ipokaliemia: Risposta renale conservativa appropriata (perdite extra-renali gastrointestinali)";
      }
      return {
        mainValue: fek.toFixed(1) + " %",
        mainLabel: "Escrezione Frazionata Potassio",
        metrics: [
          { label: "Interpretazione Clinica", val: interp, color: color }
        ],
        note: "FEK = (U-K * S-Cr) / (S-K * U-Cr) * 100."
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