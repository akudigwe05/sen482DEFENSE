// ============================================================
//  Theme Toggle — shared logic, same pattern as calculator
// ============================================================

'use strict';

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

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function () {
    var savedTheme = localStorage.getItem('theme');
    var btn = document.getElementById('theme-toggle');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if (btn) { btn.innerHTML = '☀️'; btn.title = 'Switch to light mode'; }
    }
  });

  window.toggleTheme = toggleTheme;
}
