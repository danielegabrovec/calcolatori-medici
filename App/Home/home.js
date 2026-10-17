document.addEventListener('DOMContentLoaded', () => {
  // Riferimenti DOM
  const sidebarNav = document.getElementById('sidebarNav');
  const calculatorsGrid = document.getElementById('calculatorsGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  
  // Hero & Breadcrumbs
  const crumbMacro = document.getElementById('crumbMacro');
  const crumbSep = document.getElementById('crumbSep');
  const crumbSub = document.getElementById('crumbSub');
  const heroBadge = document.getElementById('heroBadge');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const statsCount = document.getElementById('statsCount');
  const subareaPillsBar = document.getElementById('subareaPillsBar');

  // Stato dell'applicazione
  let activeMacroId = 'all';
  let activeSubId = null;
  let searchTerm = '';
  const openAccordions = new Set(); // tiene traccia dei macro-item aperti

  // Funzione di normalizzazione testo per ricerca avanzata (rimuove accenti e caratteri speciali)
  function normalize(str) {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // rimuove diacritici/accenti
      .replace(/[^\w\s]/gi, ' ')       // converte caratteri speciali e trattini in spazi
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Prepara l'indice di ricerca per ogni calcolatore
  CALCULATORS.forEach(calc => {
    const rawIndex = [
      calc.title,
      calc.description,
      calc.macroName,
      calc.subName,
      calc.categoryLabel,
      calc.id,
      (calc.tags || []).join(' ')
    ].join(' ');
    calc._searchIndex = normalize(rawIndex);
  });

  // Funzione matcher: tutte le parole della query devono essere presenti
  function matchCalculator(calc, queryTokens) {
    if (!queryTokens || queryTokens.length === 0) return true;
    return queryTokens.every(token => calc._searchIndex.includes(token));
  }

  // Helper per ottenere conteggio calcolatori per macroarea
  function getMacroCount(macroId) {
    if (macroId === 'all') return CALCULATORS.length;
    return CALCULATORS.filter(c => c.macroId === macroId).length;
  }

  // Helper per ottenere conteggio calcolatori per sottoarea
  function getSubareaCount(subId) {
    return CALCULATORS.filter(c => c.subId === subId).length;
  }

  // Trova oggetto macroarea
  function getMacro(macroId) {
    return MACROAREAS.find(m => m.id === macroId) || MACROAREAS[0];
  }

  // Trova oggetto sottoarea
  function getSubarea(macroId, subId) {
    const macro = getMacro(macroId);
    if (!macro || !macro.subareas) return null;
    return macro.subareas.find(s => s.id === subId) || null;
  }

  // Render della Sidebar con Macroaree e Sottoaree (Accordion)
  function renderSidebar() {
    sidebarNav.innerHTML = '';

    MACROAREAS.forEach(macro => {
      const isAll = macro.id === 'all';
      const hasSubareas = macro.subareas && macro.subareas.length > 0;
      const count = getMacroCount(macro.id);
      const isOpen = openAccordions.has(macro.id);
      const isActive = activeMacroId === macro.id && (isAll || !activeSubId);

      const macroItem = document.createElement('div');
      macroItem.className = `macro-item ${isOpen ? 'open' : ''} ${activeMacroId === macro.id ? 'selected' : ''}`;
      macroItem.id = `macro-${macro.id}`;

      // Header della Macroarea
      const header = document.createElement('div');
      header.className = `macro-header ${isActive ? 'active' : ''}`;
      header.innerHTML = `
        <div class="macro-left">
          <span class="macro-icon">${macro.icon}</span>
          <span class="macro-title" title="${macro.name}">${macro.name}</span>
        </div>
        <div class="macro-right">
          <span class="macro-count">${count}</span>
          ${hasSubareas ? `<span class="chevron">›</span>` : ''}
        </div>
      `;

      // Click sulla Macroarea
      header.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isAll) {
          activeMacroId = 'all';
          activeSubId = null;
          openAccordions.clear();
        } else {
          // Se la macroarea ha sottoaree, facciamo toggle dell'accordion
          if (hasSubareas) {
            if (openAccordions.has(macro.id)) {
              if (activeMacroId === macro.id && !activeSubId) {
                // Se è già attiva senza sottoarea, permettiamo di chiudere l'accordion
                openAccordions.delete(macro.id);
              } else {
                // Se c'era una sottoarea selezionata, cliccando sulla macroarea torniamo alla vista d'insieme
                activeMacroId = macro.id;
                activeSubId = null;
              }
            } else {
              // Apri questo accordion e chiudi gli altri per ordine pulito
              openAccordions.clear();
              openAccordions.add(macro.id);
              activeMacroId = macro.id;
              activeSubId = null;
            }
          } else {
            activeMacroId = macro.id;
            activeSubId = null;
          }
        }

        updateUI();
      });

      macroItem.appendChild(header);

      // Sottoaree (Accordion Body)
      if (hasSubareas) {
        const subList = document.createElement('div');
        subList.className = 'subareas-list';

        macro.subareas.forEach(sub => {
          const subCount = getSubareaCount(sub.id);
          const isSubActive = activeMacroId === macro.id && activeSubId === sub.id;

          const subItem = document.createElement('div');
          subItem.className = `subarea-item ${isSubActive ? 'active' : ''}`;
          subItem.innerHTML = `
            <div style="display: flex; align-items: center; min-width: 0; gap: 8px;">
              <span class="subarea-dot"></span>
              <span class="subarea-name" title="${sub.name}">${sub.name}</span>
            </div>
            <span class="subarea-count">${subCount}</span>
          `;

          subItem.addEventListener('click', (e) => {
            e.stopPropagation();
            activeMacroId = macro.id;
            activeSubId = sub.id;
            openAccordions.add(macro.id);
            updateUI();
          });

          subList.appendChild(subItem);
        });

        macroItem.appendChild(subList);
      }

      sidebarNav.appendChild(macroItem);
    });
  }

  // Render delle Pills delle Sottoaree sopra la griglia
  function renderSubareaPills() {
    const macro = getMacro(activeMacroId);

    if (activeMacroId === 'all' || !macro || !macro.subareas || macro.subareas.length === 0) {
      subareaPillsBar.style.display = 'none';
      subareaPillsBar.innerHTML = '';
      return;
    }

    subareaPillsBar.style.display = 'flex';
    subareaPillsBar.innerHTML = '';

    // Pill per "Tutti i calcolatori dell'area"
    const allPill = document.createElement('button');
    allPill.className = `sub-pill ${!activeSubId ? 'active' : ''}`;
    allPill.innerHTML = `<span>Tutte le sottoaree</span> <span class="macro-count" style="font-size:10px; margin-left:4px;">${getMacroCount(macro.id)}</span>`;
    allPill.addEventListener('click', () => {
      activeSubId = null;
      updateUI();
    });
    subareaPillsBar.appendChild(allPill);

    // Pill per ciascuna sottoarea
    macro.subareas.forEach(sub => {
      const count = getSubareaCount(sub.id);
      const pill = document.createElement('button');
      pill.className = `sub-pill ${activeSubId === sub.id ? 'active' : ''}`;
      pill.innerHTML = `<span>${sub.name}</span> <span class="macro-count" style="font-size:10px; margin-left:4px;">${count}</span>`;
      pill.addEventListener('click', () => {
        activeSubId = sub.id;
        updateUI();
      });
      subareaPillsBar.appendChild(pill);
    });
  }

  // Aggiorna l'Hero Banner e Breadcrumbs in base all'area attiva
  function updateHeroAndBreadcrumbs(currentDisplayedCount) {
    const macro = getMacro(activeMacroId);
    const sub = activeSubId ? getSubarea(activeMacroId, activeSubId) : null;

    if (activeMacroId === 'all') {
      crumbMacro.textContent = 'Tutti i Calcolatori';
      crumbMacro.className = 'crumb active';
      crumbSep.style.display = 'none';
      crumbSub.style.display = 'none';

      heroBadge.textContent = 'CATALOGO COMPLETO';
      heroTitle.textContent = 'Tutti i Calcolatori Medici';
      heroDesc.textContent = 'Esplora la suite completa di 107 calcolatori clinici, equazioni fisiologiche e score diagnostici.';
    } else if (sub) {
      crumbMacro.textContent = macro.name;
      crumbMacro.className = 'crumb clickable';
      crumbMacro.onclick = () => {
        activeSubId = null;
        updateUI();
      };

      crumbSep.style.display = 'inline';
      crumbSub.style.display = 'inline';
      crumbSub.textContent = sub.name;
      crumbSub.className = 'crumb active';

      heroBadge.textContent = `${macro.name.toUpperCase()}`;
      heroTitle.textContent = sub.name;
      heroDesc.textContent = `Strumenti diagnostici e calcolatori specialistici dedicati a ${sub.name}.`;
    } else {
      crumbMacro.textContent = macro.name;
      crumbMacro.className = 'crumb active';
      crumbMacro.onclick = null;
      crumbSep.style.display = 'none';
      crumbSub.style.display = 'none';

      heroBadge.textContent = 'AREA SPECIALISTICA';
      heroTitle.textContent = `${macro.icon} ${macro.name}`;
      heroDesc.textContent = `Seleziona una sottoarea per filtrare gli strumenti o consulta l'elenco completo dei ${getMacroCount(macro.id)} calcolatori dell'area.`;
    }

    statsCount.textContent = currentDisplayedCount;
  }

  // Render delle Card dei Calcolatori con animazioni a cascata
  function renderCalculators() {
    calculatorsGrid.innerHTML = '';

    const normalizedQuery = normalize(searchTerm);
    const queryTokens = normalizedQuery ? normalizedQuery.split(' ').filter(Boolean) : [];

    // Filtra calcolatori in base allo stato attuale (macro/subarea + ricerca)
    const inCurrentScope = CALCULATORS.filter(calc => {
      // Filtro Macroarea
      if (activeMacroId !== 'all' && calc.macroId !== activeMacroId) {
        return false;
      }
      // Filtro Sottoarea
      if (activeSubId && calc.subId !== activeSubId) {
        return false;
      }
      // Filtro Ricerca
      return matchCalculator(calc, queryTokens);
    });

    // Risultati globali su tutti i 107 calcolatori (per suggerimento cross-sezione)
    const inGlobalScope = queryTokens.length > 0
      ? CALCULATORS.filter(calc => matchCalculator(calc, queryTokens))
      : inCurrentScope;

    // Gestione visibilità pulsante clear ricerca
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchTerm.trim().length > 0 ? 'flex' : 'none';
    }

    // Aggiorna Hero e Breadcrumb
    updateHeroAndBreadcrumbs(inCurrentScope.length);

    // CASO 1: Nessun risultato nell'area attiva, ma ci sono riscontri in altre specialità
    if (inCurrentScope.length === 0 && inGlobalScope.length > 0 && activeMacroId !== 'all') {
      const macro = getMacro(activeMacroId);
      const scopeLabel = activeSubId ? (getSubarea(activeMacroId, activeSubId) || {}).name : macro.name;

      const banner = document.createElement('div');
      banner.className = 'empty-results';
      banner.innerHTML = `
        <div style="font-size: 38px; margin-bottom: 10px;">🔍</div>
        <h3 style="color: #0f172a; margin-bottom: 8px; font-size: 18px;">Nessun risultato in "${scopeLabel}"</h3>
        <p style="color: #64748b; margin-bottom: 18px; font-size: 14px;">
          Trovati invece <strong>${inGlobalScope.length}</strong> calcolatori pertinenti in altre specialità cliniche.
        </p>
        <button id="showAllResultsBtn" class="btn-open" style="margin: 0 auto; padding: 10px 20px; font-size: 14px; cursor: pointer; border: none;">
          Mostra tutti i ${inGlobalScope.length} calcolatori trovati →
        </button>
      `;
      calculatorsGrid.appendChild(banner);

      document.getElementById('showAllResultsBtn').addEventListener('click', () => {
        activeMacroId = 'all';
        activeSubId = null;
        updateUI();
      });
      return;
    }

    // CASO 2: Nessun calcolatore trovato in assoluto
    if (inCurrentScope.length === 0) {
      calculatorsGrid.innerHTML = `
        <div class="empty-results">
          <div style="font-size: 42px; margin-bottom: 12px;">🩺</div>
          <h3 style="color: #0f172a; margin-bottom: 8px; font-size: 18px;">Nessun calcolatore trovato per "${searchTerm.trim()}"</h3>
          <p style="color: #64748b; font-size: 14px; max-width: 480px; margin: 0 auto;">
            Verifica l'ortografia, cerca per sigla (es. GCS, Wells, eGFR, APACHE) o esplora le categorie dalla barra laterale.
          </p>
        </div>
      `;
      return;
    }

    // CASO 3: Render delle card dei calcolatori
    inCurrentScope.forEach((calc, idx) => {
      const card = document.createElement('div');
      card.className = `calc-card ${calc.isReady ? 'active-ready' : 'coming-soon'}`;
      // Ritardo sfalsato per animazione fluida a cascata
      card.style.animationDelay = `${Math.min(idx * 0.02, 0.35)}s`;

      const macroClass = `badge-${calc.macroId}`;

      card.innerHTML = `
        <div>
          <div class="calc-card-header">
            <span class="category-badge ${macroClass}">${calc.macroName.split('&')[0].trim()}</span>
            <span class="status-badge ready">✓ Disponibile</span>
          </div>
          <h2 class="calc-title">${calc.title}</h2>
          <p class="calc-desc">${calc.description}</p>
        </div>
        <div class="calc-footer">
          <span class="subarea-tag" title="${calc.subName}">${calc.subName}</span>
          <a href="${calc.path}" class="btn-open">Apri Calcolatore →</a>
        </div>
      `;

      // Cliccando su qualunque punto della card si accede al calcolatore
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Se non ha cliccato esplicitamente sul tag o pulsante, naviga comunque
        if (e.target.tagName.toLowerCase() !== 'a') {
          window.location.href = calc.path;
        }
      });

      calculatorsGrid.appendChild(card);
    });
  }

  // Aggiornamento coordinato di tutti i componenti UI
  function updateUI() {
    renderSidebar();
    renderSubareaPills();
    renderCalculators();
  }

  // Event Listener per la ricerca in tempo reale
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderCalculators();
  });

  // Tasto Cancella Ricerca (X)
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      searchInput.focus();
      renderCalculators();
    });
  }

  // Gestione Modale Note Legali, Autore e Disclaimer
  const legalModalOverlay = document.getElementById('legalModalOverlay');
  const sidebarLegalBtn = document.getElementById('sidebarLegalBtn');
  const topNavLegalBtn = document.getElementById('topNavLegalBtn');
  const closeLegalModalBtn = document.getElementById('closeLegalModalBtn');
  const confirmLegalModalBtn = document.getElementById('confirmLegalModalBtn');

  function openLegalModal() {
    if (legalModalOverlay) {
      legalModalOverlay.style.display = 'flex';
    }
  }

  function closeLegalModal() {
    if (legalModalOverlay) {
      legalModalOverlay.style.display = 'none';
    }
  }

  if (sidebarLegalBtn) sidebarLegalBtn.addEventListener('click', openLegalModal);
  if (topNavLegalBtn) topNavLegalBtn.addEventListener('click', openLegalModal);
  if (closeLegalModalBtn) closeLegalModalBtn.addEventListener('click', closeLegalModal);
  if (confirmLegalModalBtn) confirmLegalModalBtn.addEventListener('click', closeLegalModal);

  // Chiusura cliccando all'esterno della card
  if (legalModalOverlay) {
    legalModalOverlay.addEventListener('click', (e) => {
      if (e.target === legalModalOverlay) {
        closeLegalModal();
      }
    });
  }

  // Tasto Escape per pulire la ricerca o chiudere il modale
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (legalModalOverlay && legalModalOverlay.style.display === 'flex') {
        closeLegalModal();
        return;
      }
      if (searchTerm) {
        searchInput.value = '';
        searchTerm = '';
        renderCalculators();
      }
    }
  });

  // Inizializzazione della dashboard
  updateUI();
});
