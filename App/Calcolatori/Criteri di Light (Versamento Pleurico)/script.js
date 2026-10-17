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
    const pProt = parseFloat(document.getElementById("pProt").value);
    const sProt = parseFloat(document.getElementById("sProt").value);
    const pLdh = parseFloat(document.getElementById("pLdh").value);
    const sLdh = parseFloat(document.getElementById("sLdh").value);
    const ldhUln = parseFloat(document.getElementById("ldhUln").value);

    function calculate() {
      const rProt = pProt / sProt;
      const rLdh = pLdh / sLdh;
      const ldh23 = (2 / 3) * ldhUln;
      const isExudate = (rProt > 0.5) || (rLdh > 0.6) || (pLdh > ldh23);
      let interp = isExudate ? "ESSUDATO: Almeno 1 criterio soddisfatto (es. Polmonite, Neoplasia, Embolia, TBC, Malattie autoimmuni)" : "TRASUDATO: Nessun criterio soddisfatto (es. Scompenso cardiaco, Cirrosi, Sindrome nefrosica)";
      let color = isExudate ? "#c62828" : "#0277bd";
      return {
        mainValue: isExudate ? "ESSUDATO" : "TRASUDATO",
        mainLabel: "Natura del Versamento Pleurico",
        metrics: [
          { label: "Rapporto Proteine Pleura / Siero (> 0.5)", val: rProt.toFixed(2) + (rProt > 0.5 ? " (Soddisfatto)" : "") },
          { label: "Rapporto LDH Pleura / Siero (> 0.6)", val: rLdh.toFixed(2) + (rLdh > 0.6 ? " (Soddisfatto)" : "") },
          { label: "LDH Pleurico > 2/3 del limite normale", val: pLdh + " vs soglia " + Math.round(ldh23) + (pLdh > ldh23 ? " (Soddisfatto)" : "") },
          { label: "Diagnosi", val: interp, color: color }
        ],
        note: "Light RW et al. (Ann Intern Med 1972). Sensibilità per essudato > 98%."
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