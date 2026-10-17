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
    const alb = parseFloat(document.getElementById("alb").value);
    const lym = parseFloat(document.getElementById("lym").value);

    function calculate() {
      const pni = (10 * alb) + (0.005 * lym);
      let risk = "Buono stato nutrizionale (PNI > 45)";
      let color = "#2e7d32";
      if (pni < 40) {
        risk = "Grave malnutrizione / Alto rischio complicanze post-operatorie (PNI < 40)";
        color = "#c62828";
      } else if (pni <= 45) {
        risk = "Moderata malnutrizione (PNI 40-45)";
        color = "#d97706";
      }
      return {
        mainValue: pni.toFixed(1) + " Punti",
        mainLabel: "Indice PNI",
        metrics: [
          { label: "Rischio Clinico Post-operatorio", val: risk, color: color },
          { label: "Formula di Onodera", val: "10 * Alb(g/dL) + 0.005 * Linfociti(/µL)" }
        ],
        note: "Onodera T et al. (1984). PNI < 40 correla con aumento significativo di deiscenze anastomotiche e mortalità."
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