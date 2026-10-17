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
    const age = document.getElementById("age").value;
    const sbp = document.getElementById("sbp").value;
    const hr = document.getElementById("hr").value;
    const killip = document.getElementById("killip").value;
    const ant = document.getElementById("ant").value;
    const dm = document.getElementById("dm").value;
    const wt = document.getElementById("wt").value;
    const time = document.getElementById("time").value;

    function calculate() {
      const score = parseInt(age) + parseInt(sbp) + parseInt(hr) + parseInt(killip) + parseInt(ant) + parseInt(dm) + parseInt(wt) + parseInt(time);
      let mort = "0.8 - 1.6% a 30 giorni"; let color = "#2e7d32";
      if (score >= 8) { mort = "27 - 36% mortalità a 30 giorni (Rischio Altissimo)"; color = "#c62828"; }
      else if (score >= 5) { mort = "7.3 - 12.4% mortalità a 30 giorni"; color = "#ea580c"; }
      else if (score >= 3) { mort = "4.4% mortalità a 30 giorni"; color = "#d97706"; }
      return {
        mainValue: score + " / 14 Punti",
        mainLabel: "Score TIMI STEMI",
        metrics: [
          { label: "Mortalità a 30 Giorni Stimata", val: mort, color: color },
          { label: "Azione", val: "Angioplastica primaria immediata (PCI)" }
        ],
        note: "Morrow DA et al. (Circulation 2000)."
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