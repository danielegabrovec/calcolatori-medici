document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('metabolismForm');
  const btnReset = document.getElementById('btnReset');
  const resultsContainer = document.getElementById('resultsContainer');
  const placeholderContainer = document.getElementById('placeholderContainer');

  // Risultati DOM
  const bmrValue = document.getElementById('bmrValue');
  const bmrKj = document.getElementById('bmrKj');
  const tdeeValue = document.getElementById('tdeeValue');
  const tdeeKj = document.getElementById('tdeeKj');
  const bmiValue = document.getElementById('bmiValue');
  const bmiCategory = document.getElementById('bmiCategory');
  const lafDisplay = document.getElementById('lafDisplay');
  const targetDeficit = document.getElementById('targetDeficit');
  const targetMaintenance = document.getElementById('targetMaintenance');
  const targetSurplus = document.getElementById('targetSurplus');

  // Toggle campo massa grassa se si seleziona formula Katch-McArdle
  const formulaSelect = document.getElementById('formula');
  const bodyFatGroup = document.getElementById('bodyFatGroup');

  formulaSelect.addEventListener('change', () => {
    if (formulaSelect.value === 'katch') {
      bodyFatGroup.style.display = 'flex';
      document.getElementById('bodyFat').required = true;
    } else {
      bodyFatGroup.style.display = 'none';
      document.getElementById('bodyFat').required = false;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const gender = document.querySelector('input[name="gender"]:checked').value;
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const laf = parseFloat(document.getElementById('laf').value);
    const formula = formulaSelect.value;
    const bodyFat = parseFloat(document.getElementById('bodyFat').value) || 0;

    if (!weight || !height || !age || !laf) {
      alert('Per favore compila tutti i campi obbligatori.');
      return;
    }

    let bmr = 0;

    // Calcolo BMR in base alla formula selezionata
    switch (formula) {
      case 'mifflin':
        // Mifflin-St Jeor
        if (gender === 'male') {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        break;

      case 'harris-roza':
        // Harris-Benedict (Revisione Roza & Shizgal 1984)
        if (gender === 'male') {
          bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        } else {
          bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
        }
        break;

      case 'katch':
        // Katch-McArdle (basata su Lean Body Mass / Massa Magra)
        const ffm = weight * (1 - bodyFat / 100);
        bmr = 370 + 21.6 * ffm;
        break;

      case 'who':
        // FAO/WHO/UNU
        if (gender === 'male') {
          if (age < 30) bmr = 15.057 * weight + 692.2;
          else if (age < 60) bmr = 11.472 * weight + 873.1;
          else bmr = 11.711 * weight + 587.7;
        } else {
          if (age < 30) bmr = 14.818 * weight + 486.6;
          else if (age < 60) bmr = 8.126 * weight + 845.6;
          else bmr = 9.082 * weight + 658.5;
        }
        break;

      default:
        bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
    }

    // TDEE = BMR * LAF
    const tdee = bmr * laf;

    // Conversioni in kJ (1 kcal = 4.184 kJ)
    const bmrJ = bmr * 4.184;
    const tdeeJ = tdee * 4.184;

    // BMI
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let bmiCatText = 'Normopeso';
    let bmiCatColor = '#2e7d32';
    if (bmi < 18.5) {
      bmiCatText = 'Sottopeso';
      bmiCatColor = '#d97706';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCatText = 'Sovrappeso';
      bmiCatColor = '#d97706';
    } else if (bmi >= 30) {
      bmiCatText = 'Obesità';
      bmiCatColor = '#c62828';
    }

    // Mostra risultati
    bmrValue.textContent = Math.round(bmr).toLocaleString('it-IT');
    bmrKj.textContent = `${Math.round(bmrJ).toLocaleString('it-IT')} kJ/die`;

    tdeeValue.textContent = Math.round(tdee).toLocaleString('it-IT');
    tdeeKj.textContent = `${Math.round(tdeeJ).toLocaleString('it-IT')} kJ/die`;

    bmiValue.textContent = bmi.toFixed(1);
    bmiCategory.textContent = bmiCatText;
    bmiCategory.style.color = bmiCatColor;

    lafDisplay.textContent = laf.toFixed(2);

    // Target calorici
    targetMaintenance.textContent = `${Math.round(tdee).toLocaleString('it-IT')} kcal`;
    targetDeficit.textContent = `${Math.round(tdee * 0.8).toLocaleString('it-IT')} kcal (-20%)`;
    targetSurplus.textContent = `${Math.round(tdee * 1.15).toLocaleString('it-IT')} kcal (+15%)`;

    placeholderContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
  });

  btnReset.addEventListener('click', () => {
    form.reset();
    bodyFatGroup.style.display = 'none';
    placeholderContainer.style.display = 'block';
    resultsContainer.style.display = 'none';
  });
});

