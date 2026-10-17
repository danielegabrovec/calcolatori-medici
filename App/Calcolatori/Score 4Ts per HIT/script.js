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
    const t1 = document.getElementById("t1").value;
    const t2 = document.getElementById("t2").value;
    const t3 = document.getElementById("t3").value;
    const t4 = document.getElementById("t4").value;

    function calculate() {
      const score = parseInt(t1) + parseInt(t2) + parseInt(t3) + parseInt(t4);
      let prob = "Bassa probabilità (Score 0-3)"; let act = "Non necessaria sospensione immediata dell'eparina (NPV ~99%)"; let color = "#2e7d32";
      if (score >= 6) {
        prob = "Alta probabilità di HIT (Score 6-8)"; act = "SOSPENDERE IMMEDIATAMENTE ogni forma di eparina e avviare anticoagulante alternativo (Fondaparinux / Argatroban / DOAC)"; color = "#c62828";
      } else if (score >= 4) {
        prob = "Probabilità Intermedia (Score 4-5)"; act = "Eseguire dosaggio anticorpi anti-PF4/eparina e valutare sospensione eparina"; color = "#d97706";
      }
      return {
        mainValue: score + " / 8 Punti",
        mainLabel: "Score 4Ts",
        metrics: [
          { label: "Probabilità Clinica di HIT", val: prob, color: color },
          { label: "Condotta Terapeutica", val: act }
        ],
        note: "Warkentin TE et al. (J Thromb Haemost 2003)."
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