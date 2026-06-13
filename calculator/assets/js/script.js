// ============================================================
//  VUNA Calculator — Osadolor Benedict Osegie
//  Unique feature: Keyboard Support
// ============================================================

'use strict';

// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
var currentExpression = '';

// ------------------------------------------------------------------
// Display helpers
// ------------------------------------------------------------------
function updateResult() {
  document.getElementById('result').value = currentExpression || '0';
}

function flashDisplay() {
  var el = document.getElementById('result');
  el.classList.add('flash');
  setTimeout(function () { el.classList.remove('flash'); }, 80);
}

// ------------------------------------------------------------------
// Core calculator functions
// ------------------------------------------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function clearResult() {
  currentExpression = '';
  updateResult();
}

function operatorToResult(value) {
  currentExpression += value;
  updateResult();
}

/**
 * calculateExpression — pure function, testable without a browser.
 * Takes an expression string, returns a number or the string "Error".
 */
function calculateExpression(expression) {
  if (!expression || expression.trim() === '') return 'Error';
  try {
    // Only allow safe numeric/operator characters
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) return 'Error';
    /* eslint-disable no-eval */
    var result = eval(expression);
    /* eslint-enable no-eval */
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return 'Error';
    }
    // Round to 10 decimal places to avoid floating-point noise
    return parseFloat(result.toFixed(10));
  } catch (e) {
    return 'Error';
  }
}

function calculateResult() {
  if (!currentExpression) return;
  var result = calculateExpression(currentExpression);
  currentExpression = String(result);
  updateResult();
}

/**
 * percentage — converts the current expression's evaluated result
 * into its percentage value (divides by 100).
 * e.g. "50+10" -> evaluates to 60 -> becomes "0.6"
 */
function percentage() {
  if (!currentExpression) return;
  var result = calculateExpression(currentExpression);
  if (result === 'Error') {
    currentExpression = 'Error';
  } else {
    currentExpression = String(parseFloat((result / 100).toFixed(10)));
  }
  updateResult();
}

// ------------------------------------------------------------------
// Unique Feature: Keyboard Support
// ------------------------------------------------------------------

/**
 * mapKeyToAction — pure function, testable without a browser.
 * Returns an action descriptor object for a given KeyboardEvent.key,
 * or null if the key should be ignored.
 *
 * Return shape: { type: 'append'|'operator'|'clear'|'backspace'|'calculate'|'percentage', value?: string }
 */
function mapKeyToAction(key) {
  if (key >= '0' && key <= '9') return { type: 'append', value: key };
  if (key === '.') return { type: 'append', value: '.' };
  if (key === '+') return { type: 'operator', value: '+' };
  if (key === '-') return { type: 'operator', value: '-' };
  if (key === '*') return { type: 'operator', value: '*' };
  if (key === '/') return { type: 'operator', value: '/' };
  if (key === 'Enter' || key === '=') return { type: 'calculate' };
  if (key === 'Backspace') return { type: 'backspace' };
  if (key === 'Escape' || key === 'Delete') return { type: 'clear' };
  if (key === '%') return { type: 'percentage' };
  return null;
}

/**
 * handleKeyboardInput — wired to document keydown.
 * Dispatches to the right calculator function and gives visual feedback.
 */
function handleKeyboardInput(event) {
  var action = mapKeyToAction(event.key);
  if (!action) return;

  // Prevent browser default (e.g. '/' opening quick-find in Firefox)
  event.preventDefault();

  flashDisplay();
  highlightKeyboardButton(event.key);

  switch (action.type) {
    case 'append':     appendToResult(action.value);   break;
    case 'operator':   operatorToResult(action.value); break;
    case 'calculate':  calculateResult();              break;
    case 'backspace':  backspace();                    break;
    case 'clear':      clearResult();                  break;
    case 'percentage': percentage();                   break;
  }
}

/**
 * highlightKeyboardButton — briefly adds .pressed class to the matching
 * on-screen button so the user sees which key was triggered.
 */
function highlightKeyboardButton(key) {
  var map = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '.': '.', '+': '+', '-': '−', '*': '×', '/': '÷',
    'Enter': '=', '=': '=', 'Backspace': '⌫',
    'Escape': 'AC', 'Delete': 'AC', '%': '%',
  };
  var label = map[key];
  if (!label) return;

  var buttons = document.querySelectorAll('.btn-grid .btn');
  buttons.forEach(function (btn) {
    if (btn.textContent.trim() === label) {
      btn.classList.add('pressed');
      setTimeout(function () { btn.classList.remove('pressed'); }, 150);
    }
  });
}

// ------------------------------------------------------------------
// Theme Toggle
// ------------------------------------------------------------------
function toggleTheme() {
  var body = document.body;
  var btn = document.getElementById('theme-toggle');
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    btn.innerHTML = '☀️';
    btn.title = 'Switch to light mode';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.innerHTML = '🌙';
    btn.title = 'Switch to dark mode';
    localStorage.setItem('theme', 'light');
  }
}

// ------------------------------------------------------------------
// Initialisation — browser only (guard prevents crash during Jest)
// ------------------------------------------------------------------
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function () {
    // Restore saved theme
    var savedTheme = localStorage.getItem('theme');
    var btn = document.getElementById('theme-toggle');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if (btn) { btn.innerHTML = '☀️'; btn.title = 'Switch to light mode'; }
    }

    // Attach keyboard listener
    document.addEventListener('keydown', handleKeyboardInput);

    // Show keyboard hint
    var hint = document.getElementById('kb-hint');
    if (hint) {
      hint.classList.add('active');
      document.getElementById('kb-hint-text').textContent =
        'Keyboard active — type numbers, operators, Enter to calculate, % for percentage, Esc to clear';
    }
  });
}

// ------------------------------------------------------------------
// Browser globals — functions called from HTML onclick attributes.
// Assigning to window tells ESLint they are intentionally "used".
// ------------------------------------------------------------------
if (typeof window !== 'undefined') {
  window.appendToResult = appendToResult;
  window.backspace = backspace;
  window.clearResult = clearResult;
  window.operatorToResult = operatorToResult;
  window.calculateResult = calculateResult;
  window.percentage = percentage;
  window.toggleTheme = toggleTheme;
}

// ------------------------------------------------------------------
// Exports — used by Jest (Node.js has no window/document)
// ------------------------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateExpression, mapKeyToAction, percentage };
}
