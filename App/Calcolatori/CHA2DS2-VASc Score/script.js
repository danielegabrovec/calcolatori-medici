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
    const gender = document.getElementById("gender").value;
    const chf = document.getElementById("chf").value;
    const htn = document.getElementById("htn").value;
    const stroke = document.getElementById("stroke").value;
    const vasc = document.getElementById("vasc").value;
    const dm = document.getElementById("dm").value;

    function calculate() {
      const score = parseInt(age) + parseInt(gender) + parseInt(chf) + parseInt(htn) + parseInt(stroke) + parseInt(vasc) + parseInt(dm);
      const isFemale = gender === "1";
      let raccomandazione = ""; let riskRate = ""; let color = "#2e7d32";
      const adjustedScore = isFemale ? score - 1 : score;
      if (adjustedScore === 0) {
        raccomandazione = "Rischio basso: Nessuna terapia antitrombotica raccomandata.";
        riskRate = "0.2% - 0.6% / anno";
      } else if (adjustedScore === 1) {
        raccomandazione = "Rischio intermedio: Terapia anticoagulante orale (DOAC) da considerare (Classe IIa).";
        riskRate = "1.3% / anno"; color = "#d97706";
      } else {
        raccomandazione = "Rischio elevato: Terapia anticoagulante orale (DOAC) fortemente raccomandata (Classe I).";
        riskRate = "2.2% - 15.2% / anno"; color = "#c62828";
      }
      return {
        mainValue: score + " Punti",
        mainLabel: "Score CHA₂DS₂-VASc",
        metrics: [
          { label: "Tasso Annuale di Ictus Stimato", val: riskRate },
          { label: "Indicazione Terapeutica ESC", val: raccomandazione, color: color }
        ],
        note: "Linee Guida ESC Fibrillazione Atriale. Nei maschi punteggio ≥1 e nelle femmine ≥2 pongono indicazione all'anticoagulazione."
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