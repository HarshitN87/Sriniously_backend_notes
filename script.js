/**
 * THE GRAND BACKEND DIGITAL CHRONICLES: INTERACTIVE ENGINE
 * Curated with symmetrical devotion and absolute structural alignment.
 */

(function () {
  // 1. Immediately apply stored theme to prevent Flash of Unstyled Content (FOUC)
  const savedTheme = localStorage.getItem('wes-anderson-theme') || 'budapest';
  const savedNight = localStorage.getItem('wes-anderson-night') === 'true';

  document.documentElement.className = `theme-${savedTheme}`;
  if (savedNight) {
    document.documentElement.classList.add('dark');
  }

  // Define themes configuration with dynamic filament glow colors
  const THEMES = [
    { id: 'budapest', name: 'Budapest Hotel', color: '#e0a69f', glowColor: '#e0a69f', label: 'The Grand Budapest' },
    { id: 'aquatic', name: 'Zissou Aquatic', color: '#457b9d', glowColor: '#e76f51', label: 'The Life Aquatic' },
    { id: 'tenenbaum', name: 'Tenenbaum House', color: '#c8923a', glowColor: '#c8923a', label: 'The Royal Tenenbaums' },
    { id: 'moonrise', name: 'Ivanhoe Scout', color: '#6e8568', glowColor: '#d5a440', label: 'Moonrise Kingdom' },
    { id: 'darjeeling', name: 'Darjeeling Express', color: '#b53d35', glowColor: '#b53d35', label: 'Darjeeling Limited' }
  ];

  // Set the initial glow color
  const initialTheme = THEMES.find(t => t.id === savedTheme);
  if (initialTheme) {
    document.documentElement.style.setProperty('--bulb-glow-color', initialTheme.glowColor);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 2. Initialize Features
    injectCuratorConsole();
    injectReadingProgress();
    initializeCatalogSearch();
    setupKeyboardShortcuts();
    highlightActiveElements();
  });

  /**
   * Dynamically constructs and injects the elegant floating Curator's Console
   */
  function injectCuratorConsole() {
    // Prevent duplicate injection
    if (document.getElementById('curator-console')) return;

    const consoleDiv = document.createElement('div');
    consoleDiv.id = 'curator-console';
    consoleDiv.className = 'curator-console-container';
    
    // Symmetrical cabinet structure markup
    let swatchesMarkup = THEMES.map(theme => `
      <button 
        class="console-swatch theme-swatch-${theme.id}" 
        data-theme="${theme.id}" 
        title="${theme.name}" 
        style="--swatch-color: ${theme.color}"
        aria-label="Switch to ${theme.name} palette"
      ></button>
    `).join('');

    consoleDiv.innerHTML = `
      <div class="console-drawer-handle" id="console-handle">
        <span class="console-handle-brass"></span>
        <span class="console-handle-label">THE CURATOR'S CONSOLE</span>
      </div>
      <div class="console-cabinet-body">
        <span class="console-screw top-left"></span>
        <span class="console-screw top-right"></span>
        <span class="console-screw bottom-left"></span>
        <span class="console-screw bottom-right"></span>
        
        <div class="console-section">
          <div class="console-section-label">AESTHETIC DIRECTOR</div>
          <div class="console-swatches-grid">
            ${swatchesMarkup}
          </div>
          <div class="console-theme-name" id="console-theme-name">
            ${THEMES.find(t => t.id === savedTheme).label}
          </div>
        </div>
        <div class="console-divider"></div>
        <div class="console-section console-row-align">
          <span class="console-section-label">NIGHT SCENE</span>
          <div class="console-switch-bulb-group">
            <button class="console-toggle-switch ${savedNight ? 'active' : ''}" id="night-scene-toggle" aria-label="Toggle Night Mode">
              <span class="toggle-lever"></span>
            </button>
            <div class="console-indicator-bulb" id="console-bulb" title="System Status Light">
              <span class="bulb-filament"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(consoleDiv);

    // Event listeners
    const handle = consoleDiv.querySelector('#console-handle');
    handle.addEventListener('click', () => {
      consoleDiv.classList.toggle('open');
    });

    // Theme swatches listeners
    const swatches = consoleDiv.querySelectorAll('.console-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        const themeId = e.target.getAttribute('data-theme');
        changeTheme(themeId);
      });
    });

    // Night toggle listener
    const nightToggle = consoleDiv.querySelector('#night-scene-toggle');
    nightToggle.addEventListener('click', () => {
      toggleNightScene();
    });
  }

  /**
   * Handles theme switching logic with localStorage storage and console updates
   */
  function changeTheme(themeId) {
    // Remove other theme classes
    THEMES.forEach(theme => {
      document.documentElement.classList.remove(`theme-${theme.id}`);
    });
    
    // Add selected theme class
    document.documentElement.classList.add(`theme-${themeId}`);
    localStorage.setItem('wes-anderson-theme', themeId);

    // Update active theme glow color
    const themeObj = THEMES.find(t => t.id === themeId);
    if (themeObj) {
      document.documentElement.style.setProperty('--bulb-glow-color', themeObj.glowColor);
    }

    // Update Console label text
    const label = document.getElementById('console-theme-name');
    if (label) {
      label.textContent = themeObj ? themeObj.label : themeId;
    }

    // Highlight active swatch
    highlightActiveElements();
  }

  /**
   * Toggles night mode
   */
  function toggleNightScene() {
    const isNight = document.documentElement.classList.toggle('dark');
    localStorage.setItem('wes-anderson-night', isNight);

    const toggle = document.getElementById('night-scene-toggle');
    if (toggle) {
      toggle.classList.toggle('active', isNight);
    }
  }

  /**
   * Highlights active swatches in the console
   */
  function highlightActiveElements() {
    const activeTheme = localStorage.getItem('wes-anderson-theme') || 'budapest';
    const swatches = document.querySelectorAll('.console-swatch');
    
    swatches.forEach(swatch => {
      const themeId = swatch.getAttribute('data-theme');
      if (themeId === activeTheme) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }

  /**
   * Dynamic reading progress bar
   */
  function injectReadingProgress() {
    // Only inject on chapter pages (indicated by presence of a chapter header and main prose)
    if (!document.querySelector('.chapter-header') || !document.querySelector('main')) return;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    progressContainer.innerHTML = `<div class="reading-progress-bar" id="reading-progress"></div>`;
    
    document.body.appendChild(progressContainer);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progressPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      const progressBar = document.getElementById('reading-progress');
      if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
      }
    });
  }

  /**
   * Live archive search for index.html card catalog
   */
  function initializeCatalogSearch() {
    const grid = document.querySelector('.toc-grid');
    if (!grid) return; // Only run on catalog page

    // Create custom search input block programmatically
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'catalog-search-wrapper';
    searchWrapper.innerHTML = `
      <span class="search-ornament">❖</span>
      <input type="text" id="catalog-search" placeholder="SEARCH THE ARCHIVES..." autocomplete="off">
      <span class="search-ornament">❖</span>
    `;

    // Insert search bar right before the grid
    grid.parentNode.insertBefore(searchWrapper, grid);

    const searchInput = document.getElementById('catalog-search');
    const cards = document.querySelectorAll('.toc-card');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      cards.forEach(card => {
        const title = card.querySelector('.toc-card-title').textContent.toLowerCase();
        const desc = card.querySelector('.toc-card-desc').textContent.toLowerCase();
        const tags = card.querySelector('.toc-card-tag').textContent.toLowerCase();
        const num = card.querySelector('.toc-card-num').textContent.toLowerCase();

        if (
          title.includes(query) || 
          desc.includes(query) || 
          tags.includes(query) ||
          num.includes(query)
        ) {
          card.classList.remove('hidden-card');
          card.style.display = '';
          // Trigger slight reflow for animation entry
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.classList.add('hidden-card');
          card.style.opacity = '0';
          // Hide after transition completes
          setTimeout(() => {
            if (card.classList.contains('hidden-card')) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  }

  /**
   * Retro hotkeys for quick controls
   */
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Avoid firing hotkeys when user is searching or typing in any input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // 'T' key cycles through the five curated themes
      if (e.key.toLowerCase() === 't') {
        const activeTheme = localStorage.getItem('wes-anderson-theme') || 'budapest';
        const currentIndex = THEMES.findIndex(t => t.id === activeTheme);
        const nextIndex = (currentIndex + 1) % THEMES.length;
        changeTheme(THEMES[nextIndex].id);
      }

      // 'N' key toggles the night scene dark mode
      if (e.key.toLowerCase() === 'n') {
        toggleNightScene();
      }
    });
  }
})();
