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
    { href: base + 'history.html', label: '住吉考', active: 'history' },
    { href: base + 'friends.html', label: 'なかまたち', active: 'friends' },
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
  
  var base = document.body.dataset.base || '';
  footer.innerHTML =
    '<div class="footer-about klee">ニュース・音楽・郷土史を届ける、いのころもちのポートレートサイト</div>' +
    '<span class="footer-copy">© ' + new Date().getFullYear() + ' いのころもち.com</span>' +
    '<div class="footer-links">' +
      '<a href="' + base + 'privacy.html">プライバシーポリシー</a>' +
      '<a href="' + base + 'contact.html">お問い合わせ</a>' +
      '<span class="footer-sep">|</span>' +
      '<a href="https://x.com/inocoro_com" target="_blank" rel="noopener noreferrer">X / Twitter</a>' +
      '<a href="https://github.com/TsuyoshiOchiba/inocoromochi-portfolio" target="_blank" rel="noopener noreferrer">GitHub</a>' +
      '<a href="https://www.youtube.com/@tsuyoshiochiba1009" target="_blank" rel="noopener noreferrer">YouTube</a>' +
    '</div>';
}

/* JSON-LD (WebSite + Organization) */
function injectJsonLd() {
  var ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'いのころもち.com',
        'url': 'https://inocoromochi.com/',
        'description': 'ニュース配信「かわらばん」・オリジナル楽曲の作曲活動・大阪住吉の郷土史「住吉考」を届ける、いのころもちのポートレートサイト。'
      },
      {
        '@type': 'Organization',
        'name': 'いのころもち.com',
        'url': 'https://inocoromochi.com/',
        'logo': 'https://inocoromochi.com/assets/images/ogp-brand.png',
        'contactPoint': {
          '@type': 'ContactPoint',
          'url': 'https://inocoromochi.com/contact.html',
          'contactType': 'customer support'
        },
        'sameAs': [
          'https://x.com/inocoro_com',
          'https://www.youtube.com/@tsuyoshiochiba1009',
          'https://github.com/TsuyoshiOchiba/inocoromochi-portfolio'
        ]
      }
    ]
  };
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

/* Init */
document.addEventListener('DOMContentLoaded', function() {
  const activePage = document.body.dataset.page || '';
  createNav(activePage);
  createFooter();
  injectJsonLd();
});
