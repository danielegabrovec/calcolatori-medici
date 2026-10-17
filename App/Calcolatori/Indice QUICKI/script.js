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
    const glu = parseFloat(document.getElementById("glu").value);
    const ins = parseFloat(document.getElementById("ins").value);

    function calculate() {
      const quicki = 1 / (Math.log10(glu) + Math.log10(ins));
      let interp = "Normale sensibilità insulinica (> 0.339)"; let color = "#2e7d32";
      if (quicki < 0.339) {
        interp = "Insulino-resistenza marcata (QUICKI < 0.339)";
        color = "#c62828";
      }
      return {
        mainValue: quicki.toFixed(3),
        mainLabel: "Indice QUICKI",
        metrics: [
          { label: "Stato della Sensibilità Insulinica", val: interp, color: color },
          { label: "Formula", val: "1 / [log10(Glicemia) + log10(Insulina)]" }
        ],
        note: "Katz A et al. (J Clin Endocrinol Metab 2000). Correlazione elevata con il clamp euglicemico-iperinsulinemico."
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