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
    const age = parseFloat(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const nursing = document.getElementById("nursing").value;
    const neoplasm = document.getElementById("neoplasm").value;
    const liver = document.getElementById("liver").value;
    const chf = document.getElementById("chf").value;
    const cva = document.getElementById("cva").value;
    const renal = document.getElementById("renal").value;
    const rr = document.getElementById("rr").value;
    const sbp = document.getElementById("sbp").value;
    const temp = document.getElementById("temp").value;
    const hr = document.getElementById("hr").value;

    function calculate() {
      let pts = age + parseInt(gender) + parseInt(nursing) + parseInt(neoplasm) + parseInt(liver) + parseInt(chf) + parseInt(cva) + parseInt(renal) + parseInt(rr) + parseInt(sbp) + parseInt(temp) + parseInt(hr);
      let classe = ""; let mort = ""; let setting = ""; let color = "#2e7d32";
      if (pts <= 70) {
        classe = "Classe II (Punteggio ≤ 70)"; mort = "0.6% mortalità"; setting = "Trattamento ambulatoriale sicuro";
      } else if (pts <= 90) {
        classe = "Classe III (Punteggio 71 - 90)"; mort = "0.9 - 2.8% mortalità"; setting = "Osservazione breve o ricovero breve"; color = "#d97706";
      } else if (pts <= 130) {
        classe = "Classe IV (Punteggio 91 - 130)"; mort = "8.2 - 9.3% mortalità"; setting = "Ricovero ospedaliero ordinario"; color = "#ea580c";
      } else {
        classe = "Classe V (Punteggio > 130)"; mort = "27 - 31% mortalità"; setting = "Ricovero ospedaliero urgente (valutare Terapia Intensiva)"; color = "#c62828";
      }
      return {
        mainValue: pts + " Punti (" + classe + ")",
        mainLabel: "Score PSI / PORT",
        metrics: [
          { label: "Mortalità a 30 Giorni", val: mort, color: color },
          { label: "Setting di Cura Raccomandato", val: setting }
        ],
        note: "Fine MJ et al. (NEJM 1997). Pneumonia Severity Index raccomandato dalle linee guida ATS/IDSA."
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