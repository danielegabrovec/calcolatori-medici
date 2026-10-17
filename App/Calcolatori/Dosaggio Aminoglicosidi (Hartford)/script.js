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
    const drug = document.getElementById("drug").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const crcl = parseFloat(document.getElementById("crcl").value);

    function calculate() {
      const isAmika = drug === "amika";
      const mgPerKg = isAmika ? 15 : 7;
      let totalDose = Math.round(weight * mgPerKg);
      totalDose = Math.round(totalDose / 50) * 50;

      let interval = 24;
      let interp = "Intervallo standard ogni 24 ore";
      let color = "#2e7d32";

      if (crcl < 20) {
        interp = "CrCl < 20 mL/min: Metodo dose singola estesa NON raccomandato (usare dosaggio tradizionale con monitoraggio picco/valle)";
        color = "#c62828";
      } else if (crcl < 40) {
        interval = 48;
        interp = "CrCl 20-39 mL/min: Intervallo esteso ogni 48 ore";
        color = "#ea580c";
      } else if (crcl < 60) {
        interval = 36;
        interp = "CrCl 40-59 mL/min: Intervallo esteso ogni 36 ore";
        color = "#d97706";
      }

      return {
        mainValue: totalDose + " mg ogni " + interval + "h",
        mainLabel: "Dose Aminoglicoside Hartford",
        metrics: [
          { label: "Dose Totale Calcolata", val: totalDose + " mg (" + mgPerKg + " mg/kg)" },
          { label: "Intervallo di Somministrazione", val: "Ogni " + interval + " ore", color: color },
          { label: "Timing Monitoraggio Plasmatico", val: "Dosare la concentrazione sierica tra 6 e 14 ore dopo la fine dell'infusione" },
          { label: "Nomogramma", val: interp }
        ],
        note: "Nicolau DP et al. (Antimicrob Agents Chemother 1995). Massimizza l'effetto battericida concentrazione-dipendente e minimizza la nefrotossicità."
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