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
    const head = parseFloat(document.getElementById("head").value);
    const antTrunk = parseFloat(document.getElementById("antTrunk").value);
    const postTrunk = parseFloat(document.getElementById("postTrunk").value);
    const armR = parseFloat(document.getElementById("armR").value);
    const armL = parseFloat(document.getElementById("armL").value);
    const legR = parseFloat(document.getElementById("legR").value);
    const legL = parseFloat(document.getElementById("legL").value);
    const genit = parseFloat(document.getElementById("genit").value);

    function calculate() {
      const total = head + antTrunk + postTrunk + armR + armL + legR + legL + genit;
      let gravita = "Ustione di modesta estensione (< 15%)"; let color = "#2e7d32";
      if (total >= 20) {
        gravita = "Grande Ustionato (≥ 20% TBSA) - Indicazione mandatoria alla formula di Parkland e Centro Ustioni";
        color = "#c62828";
      } else if (total >= 15) {
        gravita = "Ustione Moderata (15-19% TBSA)";
        color = "#d97706";
      }
      return {
        mainValue: total + " % TBSA",
        mainLabel: "Superficie Corporea Ustionata Totale",
        metrics: [
          { label: "Giudizio di Gravità", val: gravita, color: color },
          { label: "Uso Immediato", val: "Inserire questo valore nella Formula di Parkland per il calcolo dei liquidi" }
        ],
        note: "Wallace AB (Lancet 1951). Valido per pazienti adulti."
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