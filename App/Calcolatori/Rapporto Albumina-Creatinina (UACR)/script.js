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
    const creat = parseFloat(document.getElementById("creat").value);

    function calculate() {
      const uacr = (alb / (creat / 100)); // mg/g
      let stage = "A1: Normale / Lieve aumento (< 30 mg/g)";
      let color = "#2e7d32";
      if (uacr >= 300) {
        stage = "A3: Severamente aumentata / Macroalbuminuria (≥ 300 mg/g)";
        color = "#c62828";
      } else if (uacr >= 30) {
        stage = "A2: Moderatamente aumentata / Microalbuminuria (30 - 299 mg/g)";
        color = "#d97706";
      }
      return {
        mainValue: uacr.toFixed(1) + " mg/g",
        mainLabel: "Rapporto UACR",
        metrics: [
          { label: "Stadio Albuminuria KDIGO", val: stage, color: color },
          { label: "Equivalente in mg/mmol", val: (uacr * 0.113).toFixed(1) + " mg/mmol" }
        ],
        note: "Linee guida KDIGO 2024. Evita la necessità della raccolta urine delle 24 ore."
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