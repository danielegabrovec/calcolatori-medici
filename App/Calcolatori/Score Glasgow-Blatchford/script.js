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
    const bun = document.getElementById("bun").value;
    const hb = document.getElementById("hb").value;
    const sbp = document.getElementById("sbp").value;
    const hr = document.getElementById("hr").value;
    const melena = document.getElementById("melena").value;
    const syncope = document.getElementById("syncope").value;
    const liver = document.getElementById("liver").value;
    const chf = document.getElementById("chf").value;

    function calculate() {
      const score = parseInt(bun) + parseInt(hb) + parseInt(sbp) + parseInt(hr) + parseInt(melena) + parseInt(syncope) + parseInt(liver) + parseInt(chf);
      let risk = ""; let color = "#2e7d32";
      if (score === 0) {
        risk = "Score 0: Bassissimo rischio. Il paziente può essere candidato a gestione ambulatoriale senza ricovero urgente.";
      } else {
        risk = "Score ≥ 1: Rischio aumentato di necessità di trasfusione, emostasi endoscopica urgente o reintervento.";
        color = score >= 6 ? "#c62828" : "#d97706";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score Glasgow-Blatchford",
        metrics: [
          { label: "Giudizio di Rischio", val: risk, color: color },
          { label: "Indicazione", val: score > 1 ? "Ricovero e/o endoscopia digestiva entro 24h" : "Possibile gestione protetta" }
        ],
        note: "Blatchford O et al. (Lancet 2000)."
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