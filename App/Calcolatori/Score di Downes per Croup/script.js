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
    const stridor = document.getElementById("stridor").value;
    const cough = document.getElementById("cough").value;
    const retract = document.getElementById("retract").value;
    const air = document.getElementById("air").value;
    const cyan = document.getElementById("cyan").value;

    function calculate() {
      const score = parseInt(stridor) + parseInt(cough) + parseInt(retract) + parseInt(air) + parseInt(cyan);
      let gravita = "Croup Lieve (0-3)"; let therapy = "Desametasone orale singolo (0.15 - 0.6 mg/kg) e dimissione protetta"; let color = "#2e7d32";
      if (score >= 7) {
        gravita = "Croup Grave (≥ 7) - Rischio insufficienza respiratoria acuta";
        therapy = "Adrenalina aerosolica (L-adrenalina 1:1000, 2-5 mL) + Desametasone EV/IM + O₂ + Ospedalizzazione";
        color = "#c62828";
      } else if (score >= 4) {
        gravita = "Croup Moderato (4-6)";
        therapy = "Desametasone orale/EV + aerosol di adrenalina; osservazione per almeno 3-4 ore";
        color = "#ea580c";
      }
      return {
        mainValue: score + " / 10 Punti",
        mainLabel: "Score di Downes",
        metrics: [
          { label: "Gravità Clinica", val: gravita, color: color },
          { label: "Terapia Raccomandata", val: therapy }
        ],
        note: "Downes JJ et al. (Pediatr Clin North Am 1972)."
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