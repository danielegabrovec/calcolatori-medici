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
    const uprot = parseFloat(document.getElementById("uprot").value);
    const ucreat = parseFloat(document.getElementById("ucreat").value);

    function calculate() {
      const upcr = uprot / ucreat;
      const prot24h = upcr; // 1 mg/mg approssima 1 g/24h
      let interp = "Proteinuria nei limiti fisiologici (< 0.2 g/die)"; let color = "#2e7d32";
      if (upcr >= 3.5) {
        interp = "Range Nefrosico (≥ 3.5 g/24h) - Sospetta sindrome nefrosica";
        color = "#c62828";
      } else if (upcr >= 0.2) {
        interp = "Proteinuria Clinica Significativa (0.2 - 3.4 g/24h)";
        color = "#d97706";
      }
      return {
        mainValue: upcr.toFixed(2) + " mg/mg (g/g)",
        mainLabel: "Rapporto UPCR",
        metrics: [
          { label: "Stima Proteinuria delle 24h", val: "~ " + prot24h.toFixed(1) + " g / 24 ore" },
          { label: "Classificazione", val: interp, color: color }
        ],
        note: "Linee Guida KDIGO. Il rapporto UPCR (mg/mg) corrisponde all'incirca all'escrezione proteica in grammi nelle 24 ore."
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