/* いのころもち.com — Shared Components */

/* Navigation */
function createNav(activePage) {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  
  // Read base path from body data attribute
  var base = document.body.dataset.base || '';
  
  var pages = [
    { href: base + 'kawaraban.html', label: 'プロダクト', active: 'product' },
    { href: base + 'music.html', label: '作曲活動', active: 'music' },
    { href: base + 'history.html', label: '歴史学探索', active: 'history' },
    { href: base + 'about.html', label: 'About', active: 'about' },
  ];
  
  var linksHtml = pages.map(function(p) {
    var cls = activePage === p.active ? ' class="active-' + p.active + '"' : '';
    return '<a href="' + p.href + '"' + cls + '>' + p.label + '</a>';
  }).join('');

  nav.innerHTML = 
    '<a href="' + base + 'index.html" class="nav-logo">いのころもち.com</a>' +
    '<div class="nav-links">' + linksHtml + '</div>';
}

/* Footer */
function createFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  
  footer.innerHTML = 
    '<span class="footer-copy">© ' + new Date().getFullYear() + ' いのころもち.com</span>' +
    '<div class="footer-links">' +
      '<a href="#">X / Twitter</a>' +
      '<a href="#">GitHub</a>' +
      '<a href="#">YouTube</a>' +
    '</div>';
}

/* Init */
document.addEventListener('DOMContentLoaded', function() {
  const activePage = document.body.dataset.page || '';
  createNav(activePage);
  createFooter();
});
