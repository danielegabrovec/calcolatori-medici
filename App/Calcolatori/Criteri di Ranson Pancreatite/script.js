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
    const wbc = document.getElementById("wbc").value;
    const glu = document.getElementById("glu").value;
    const ldh = document.getElementById("ldh").value;
    const ast = document.getElementById("ast").value;
    const hct = document.getElementById("hct").value;
    const bun = document.getElementById("bun").value;
    const ca = document.getElementById("ca").value;
    const pao2 = document.getElementById("pao2").value;

    function calculate() {
      const score = parseInt(age) + parseInt(wbc) + parseInt(glu) + parseInt(ldh) + parseInt(ast) + parseInt(hct) + parseInt(bun) + parseInt(ca) + parseInt(pao2);
      let mort = "< 3% mortalità"; let color = "#2e7d32";
      if (score >= 6) { mort = "≥ 40 - 50% mortalità (Pancreatite Severa necrotizzante)"; color = "#c62828"; }
      else if (score >= 3) { mort = "15% mortalità (Pancreatite Moderata/Severa)"; color = "#ea580c"; }
      return {
        mainValue: score + " / 11 Criteri",
        mainLabel: "Score di Ranson",
        metrics: [
          { label: "Mortalità Stimata", val: mort, color: color },
          { label: "Valutazione", val: score >= 3 ? "Pancreatite severa: indicata terapia intensiva" : "Pancreatite lieve-moderata" }
        ],
        note: "Ranson JH et al. (Surg Gynecol Obstet 1974)."
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