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
    const gcs = document.getElementById("gcs").value;
    const fracture = document.getElementById("fracture").value;
    const basilar = document.getElementById("basilar").value;
    const vomit = document.getElementById("vomit").value;
    const age = document.getElementById("age").value;
    const amnesia = document.getElementById("amnesia").value;
    const mech = document.getElementById("mech").value;

    function calculate() {
      const isHighRisk = (gcs === "1" || fracture === "1" || basilar === "1" || vomit === "1" || age === "1");
      const isMedRisk = (amnesia === "1" || mech === "1");
      let interp = "Nessun criterio presente: TC encefalo non necessaria (Sensibilità 100% per lesioni neurochirurgiche)"; let color = "#2e7d32";
      if (isHighRisk) {
        interp = "ALTO RISCHIO di intervento neurochirurgico: TC ENCEFALO URGENTE MANDATORIA";
        color = "#c62828";
      } else if (isMedRisk) {
        interp = "RISCHIO MEDIO di lesione cerebrale significativa: TC Encefalo indicata";
        color = "#ea580c";
      }
      return {
        mainValue: (isHighRisk || isMedRisk) ? "TC ENCEFALO INDICATA" : "TC NON INDICATA",
        mainLabel: "Esito Regola CCHR di Ottawa",
        metrics: [
          { label: "Indicazione Radiologica", val: interp, color: color }
        ],
        note: "Stiell IG et al. (Lancet 2001). CCHR: Canadian CT Head Rule."
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