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
    '<button class="nav-toggle" aria-label="メニュー" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '<div class="nav-links">' + linksHtml + '</div>';

  var toggle = nav.querySelector('.nav-toggle');
  toggle.addEventListener('click', function() {
    var isOpen = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
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
