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
    const creat = parseFloat(document.getElementById("creat").value);
    const bili = parseFloat(document.getElementById("bili").value);
    const inr = parseFloat(document.getElementById("inr").value);
    const dial = document.getElementById("dial").value;

    function calculate() {
      let cr = dial === "1" ? 4.0 : creat;
      cr = Math.max(1.0, Math.min(4.0, cr));
      const bi = Math.max(1.0, bili);
      const inVal = Math.max(1.0, inr);
      const meld = 9.57 * Math.log(cr) + 3.78 * Math.log(bi) + 11.2 * Math.log(inVal) + 6.43;
      const rounded = Math.round(meld);
      let mort = ""; let color = "#2e7d32";
      if (rounded <= 9) mort = "1.9% mortalità a 3 mesi";
      else if (rounded <= 19) { mort = "6.0% mortalità a 3 mesi"; color = "#d97706"; }
      else if (rounded <= 29) { mort = "19.6% mortalità a 3 mesi"; color = "#ea580c"; }
      else { mort = "52 - 71% mortalità a 3 mesi"; color = "#c62828"; }
      return {
        mainValue: rounded + " Punti",
        mainLabel: "Score MELD",
        metrics: [
          { label: "Mortalità a 3 Mesi", val: mort, color: color },
          { label: "Priorità Trapiantologica", val: rounded >= 15 ? "Paziente idoneo a valutazione per lista attiva" : "Follow-up periodico" }
        ],
        note: "Kamath PS et al. (Hepatology 2001)."
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