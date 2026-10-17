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
    const sAlb = parseFloat(document.getElementById("sAlb").value);
    const aAlb = parseFloat(document.getElementById("aAlb").value);

    function calculate() {
      const saag = sAlb - aAlb;
      let interp = ""; let color = "#2e7d32";
      if (saag >= 1.1) {
        interp = "SAAG ≥ 1.1 g/dL: Presenza di Ipertensione Portale (accuratezza > 97%). Es. Cirrosi, Scompenso Cardiaco, Sindrome di Budd-Chiari.";
        color = "#0277bd";
      } else {
        interp = "SAAG < 1.1 g/dL: Assenza di Ipertensione Portale. Es. Carcinomatosi Peritoneale, Peritonite Tubercolare, Sindrome Nefrosica, Pancreatite.";
        color = "#d97706";
      }
      return {
        mainValue: saag.toFixed(1) + " g/dL",
        mainLabel: "Gradiente SAAG (Siero - Ascite)",
        metrics: [
          { label: "Diagnosi Eziologica", val: interp, color: color },
          { label: "Soglia Clinica", val: "1.1 g/dL (Runyon BA, Hepatology)" }
        ],
        note: "SAAG = Albumina Sierica - Albumina Liquido Ascitico. Ha sostituito la distinzione trasudato/essudato nell'ascite."
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