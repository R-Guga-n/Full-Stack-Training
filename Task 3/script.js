// Config / defaults
const STORAGE_KEY = 'userPreferences';
const DEFAULTS = {
    theme: 'light', // 'light' or 'dark' (required)
    fontSize: 16, // px (number)
    color: '#1e90ff' // hex color
};
const FONT_MIN = 12;
const FONT_MAX = 24;

// Elements
const form = document.getElementById('prefsForm');
const themeInputs = form.elements['theme'];
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const colorInput = document.getElementById('primaryColor');
const errorsDiv = document.getElementById('errors');
const resetBtn = document.getElementById('resetBtn');
const previewText = document.getElementById('previewText');

// Apply preferences to DOM (class changes + style changes)
function applyPreferences(pref) {
    // Theme: set body class
    document.body.classList.remove('light', 'dark');
    if (pref.theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.add('light');

    // Primary color as CSS variable
    document.documentElement.style.setProperty('--primary-color', pref.color);

    // Font size as CSS variable
    document.documentElement.style.setProperty('--base-font-size', `${pref.fontSize}px`);

    // Update preview and form controls if needed
    fontSizeValue.textContent = pref.fontSize;
    fontSizeInput.value = pref.fontSize;
    colorInput.value = pref.color;
    // set radio checked
    for (const r of themeInputs) {
        r.checked = (r.value === pref.theme);
    }
}

// Validate preferences; returns array of error strings
function validatePreferences(pref) {
    const errs = [];
    if (!pref.theme || (pref.theme !== 'light' && pref.theme !== 'dark')) {
        errs.push('Please select a theme (Light or Dark).');
    }
    if (typeof pref.fontSize !== 'number' || Number.isNaN(pref.fontSize)) {
        errs.push('Font size must be a number.');
    } else if (pref.fontSize < FONT_MIN || pref.fontSize > FONT_MAX) {
        errs.push(`Font size must be between ${FONT_MIN} and ${FONT_MAX} px.`);
    }
    // color: simple hex format check
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(pref.color)) {
        errs.push('Primary color must be a valid hex color.');
    }
    return errs;
}

// Save preferences to localStorage
function savePreferences(pref) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
}

// Load preferences from localStorage or return defaults
function loadPreferences() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {...DEFAULTS };
        const parsed = JSON.parse(raw);
        // Defensive merging with defaults
        return {
            theme: parsed.theme || DEFAULTS.theme,
            fontSize: (typeof parsed.fontSize === 'number') ? parsed.fontSize : DEFAULTS.fontSize,
            color: parsed.color || DEFAULTS.color
        };
    } catch (e) {
        console.error('Failed to load preferences, using defaults - script.js:80', e);
        return {...DEFAULTS };
    }
}

// Build preferences object from form controls
function readFormPreferences() {
    const theme = (new FormData(form)).get('theme'); // string or null
    const fontSize = Number(fontSizeInput.value);
    const color = colorInput.value;
    return { theme, fontSize, color };
}

// Show errors
function showErrors(errs) {
    if (!errs || errs.length === 0) {
        errorsDiv.textContent = '';
        return;
    }
    errorsDiv.innerHTML = errs.map(e => `<div>${e}</div>`).join('');
}

// Submit handler
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const pref = readFormPreferences();
    const errs = validatePreferences(pref);
    if (errs.length) {
        showErrors(errs);
        return;
    }
    // Apply + persist
    applyPreferences(pref);
    savePreferences(pref);
    showErrors(['Preferences saved.']); // short feedback
    setTimeout(() => { if (errorsDiv.textContent === 'Preferences saved.') errorsDiv.textContent = ''; }, 1600);
});

// Reset to defaults
resetBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    const pref = {...DEFAULTS };
    applyPreferences(pref);
    showErrors(['Reset to defaults.']);
    setTimeout(() => { if (errorsDiv.textContent === 'Reset to defaults.') errorsDiv.textContent = ''; }, 1600);
});

// Live preview for font size and color while adjusting
fontSizeInput.addEventListener('input', () => {
    const val = Number(fontSizeInput.value);
    fontSizeValue.textContent = val;
    document.documentElement.style.setProperty('--base-font-size', `${val}px`);
});

colorInput.addEventListener('input', () => {
    document.documentElement.style.setProperty('--primary-color', colorInput.value);
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    const pref = loadPreferences();
    applyPreferences(pref);
});