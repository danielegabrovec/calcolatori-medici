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
    const gender = document.getElementById("gender").value;
    const height = parseFloat(document.getElementById("height").value);
    const neck = parseFloat(document.getElementById("neck").value);
    const waist = parseFloat(document.getElementById("waist").value);
    const hip = parseFloat(document.getElementById("hip").value);

    function calculate() {
      let bf = 0;
      if (gender === "m") {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      }
      bf = Math.max(3, Math.min(65, bf));
      let cat = "Normale / Fitness";
      let col = "#2e7d32";
      if (gender === "m") {
        if (bf > 25) { cat = "Eccesso adiposo"; col = "#c62828"; }
        else if (bf > 18) { cat = "Media"; col = "#d97706"; }
      } else {
        if (bf > 32) { cat = "Eccesso adiposo"; col = "#c62828"; }
        else if (bf > 25) { cat = "Media"; col = "#d97706"; }
      }
      return {
        mainValue: bf.toFixed(1) + " %",
        mainLabel: "Percentuale di Massa Grassa",
        metrics: [
          { label: "Categoria Composizione Corporea", val: cat, color: col },
          { label: "Massa Magra Stimata", val: (100 - bf).toFixed(1) + " %" }
        ],
        note: "Metodo antropometrico US Navy standard Hodgdon & Beckett."
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