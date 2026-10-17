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
    const pmf = parseFloat(document.getElementById("pmf").value);
    const culture = document.getElementById("culture").value;
    const sCr = parseFloat(document.getElementById("sCr").value);
    const sBili = parseFloat(document.getElementById("sBili").value);

    function calculate() {
      const isSbp = pmf >= 250;
      let diag = isSbp ? "SBP CONFERMATA (PMN ≥ 250/µL)" : "SBP non presente (PMN < 250/µL)";
      let color = isSbp ? "#c62828" : "#2e7d32";
      let therapy = isSbp ? "Avviare immediatamente Cefalosporina di 3ª generazione (es. Cefotaxime 2g x3/die EV o Ceftriaxone 2g/die EV)" : "Nessuna terapia antibiotica empirica necessaria";
      
      const needAlbumin = isSbp && (sCr > 1.0 || sBili > 4.0);
      let albTherapy = needAlbumin ? "INDICATA ALBUMINA EV: 1.5 g/kg entro 6h dalla diagnosi, seguita da 1.0 g/kg al giorno 3 (previene la sindrome epatorenale e riduce la mortalità)" : "Albumina EV non mandatoria ma raccomandata se compromissione renale";

      return {
        mainValue: isSbp ? "SBP POSITIVA (≥ 250 PMN)" : "NEGATIVA",
        mainLabel: "Esito Diagnostico Paracentesi",
        metrics: [
          { label: "Diagnosi", val: diag, color: color },
          { label: "Terapia Antibiotica Empirica", val: therapy },
          { label: "Protocollo Albumina EV (Sort et al.)", val: albTherapy, color: needAlbumin ? "#0277bd" : "#475569" }
        ],
        note: "Linee Guida EASL/AASLD Ascite e SBP. Conta PMN ≥ 250/µL pone indicazione mandatoria al trattamento senza attendere l'esito colturale."
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