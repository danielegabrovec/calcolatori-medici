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
    const ptPaz = parseFloat(document.getElementById("ptPaz").value);
    const ptCtrl = parseFloat(document.getElementById("ptCtrl").value);
    const bili = parseFloat(document.getElementById("bili").value);

    function calculate() {
      const diffPt = Math.max(0, ptPaz - ptCtrl);
      const df = (4.6 * diffPt) + bili;
      let interp = ""; let color = "#2e7d32";
      if (df >= 32) {
        interp = "Maddrey DF ≥ 32: Epatite Alcolica Grave (Mortalità a 1 mese ~ 35-50%). Indicata terapia steroidea con Prednisolone 40 mg/die (se non controindicato).";
        color = "#c62828";
      } else {
        interp = "Maddrey DF < 32: Epatite Alcolica Non Grave (bassa mortalità a breve termine). Non indicati corticosteroidi.";
      }
      return {
        mainValue: df.toFixed(1),
        mainLabel: "Indice Discriminante di Maddrey",
        metrics: [
          { label: "Gravità e Indicazione Terapeutica", val: interp, color: color },
          { label: "Soglia Decisionale Standard", val: "DF = 32" }
        ],
        note: "Maddrey WC et al. (Gastroenterology 1978): DF = 4.6 * [PT_paziente - PT_controllo] + Bilirubina (mg/dL)."
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