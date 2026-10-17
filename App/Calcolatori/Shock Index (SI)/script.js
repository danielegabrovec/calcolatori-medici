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
    const hr = parseFloat(document.getElementById("hr").value);
    const sbp = parseFloat(document.getElementById("sbp").value);
    const dbp = parseFloat(document.getElementById("dbp").value);

    function calculate() {
      const si = hr / sbp;
      const map = (sbp + 2 * dbp) / 3;
      const msi = hr / map;
      let interp = "Normale (SI 0.5 - 0.7)"; let color = "#2e7d32";
      if (si >= 1.0) {
        interp = "Shock Marcato (SI ≥ 1.0): Alto rischio di trasfusione massiva e arresto cardiaco";
        color = "#c62828";
      } else if (si >= 0.7) {
        interp = "Shock Lieve / Allarme Precoce (SI 0.7 - 0.9)";
        color = "#d97706";
      }
      return {
        mainValue: si.toFixed(2),
        mainLabel: "Shock Index (FC / PAS)",
        metrics: [
          { label: "Stato Clinico", val: interp, color: color },
          { label: "Modified Shock Index (FC / MAP)", val: msi.toFixed(2) + " (Normale 0.7-1.3)" }
        ],
        note: "Allgöwer M & Burri C (1967). SI > 0.9 predice emotrasfusione e ricovero in terapia intensiva anche con PA apparentemente conservata."
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