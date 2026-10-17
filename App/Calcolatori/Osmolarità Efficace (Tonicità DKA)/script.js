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
    const na = parseFloat(document.getElementById("na").value);
    const glu = parseFloat(document.getElementById("glu").value);

    function calculate() {
      const tonicity = (2 * na) + (glu / 18);
      let interp = "Normale (275 - 295 mOsm/kg)"; let color = "#2e7d32";
      if (tonicity > 320) {
        interp = "Iperosmolarità Grave (> 320 mOsm/kg) - Criterio diagnostico di Stato Iperosmolare Iperglicemico (HHS)";
        color = "#c62828";
      } else if (tonicity > 295) {
        interp = "Ipertonicità Moderata (296 - 320 mOsm/kg)";
        color = "#d97706";
      }
      return {
        mainValue: Math.round(tonicity) + " mOsm/kg",
        mainLabel: "Osmolarità Efficace (Tonicità)",
        metrics: [
          { label: "Quadro Clinico Osmotico", val: interp, color: color },
          { label: "Formula Esclude l'Urea", val: "2*Na + Glucosio/18 (l'urea è un soluto inefficace diffusibile)" }
        ],
        note: "Linee Guida ADA per le emergenze iperglicemiche."
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