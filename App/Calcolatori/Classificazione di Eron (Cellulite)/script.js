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
    const classVal = document.getElementById("classVal").value;

    function calculate() {
      const cl = classVal;
      let setting = ""; let therapy = ""; let color = "#2e7d32";
      if (cl === "1") {
        setting = "Trattamento Ambulatoriale / Domiciliare";
        therapy = "Antibiotico orale attivo su streptococchi e stafilococchi (es. Amoxicillina/Clavulanico, Cefalexina o Clindamicina)";
      } else if (cl === "2") {
        setting = "Ambulatoriale protetto / Breve osservazione";
        therapy = "Terapia orale o dose iniziale EV singola (es. Ceftriaxone) con stretto follow-up a 24-48 ore";
        color = "#d97706";
      } else if (cl === "3") {
        setting = "RICOVERO OSPEDALIERO";
        therapy = "Antibioticoterapia endovenosa ad ampio spettro (es. Cefazolina, Amoxicillina/Clavulanico EV, o Vancomicina se sospetto MRSA)";
        color = "#ea580c";
      } else {
        setting = "EMERGENZA / TERAPIA INTENSIVA & CHIRURGIA";
        therapy = "CONSULENZA CHIRURGICA URGENTE per sbrigliamento (debridement) immediato + Antibiotici EV ad ampissimo spettro con blocco tossinico (Meropenem + Vancomicina + Clindamicina)";
        color = "#c62828";
      }

      return {
        mainValue: "Classe Eron " + cl,
        mainLabel: "Grado di Gravità Eron SSTI",
        metrics: [
          { label: "Setting di Cura Raccomandato", val: setting, color: color },
          { label: "Strategia Antibiotica", val: therapy }
        ],
        note: "Eron LJ et al. (J Antimicrob Chemother 2003). Standard di riferimento per il triage delle infezioni cutanee."
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