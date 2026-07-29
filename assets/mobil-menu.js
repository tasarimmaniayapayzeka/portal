// ═══ MOBİL MENÜ — ☰ butonu (yalnız ≤820px'de görünür) ═══
// Üst çubuğa bir buton ekler; body.menu-acik sınıfını açıp kapatır.
// Panelin tüm görünümü style.css'teki @media(max-width:820px) bloğunda.
(function () {
  function kur() {
    var bar = document.querySelector('.topbar');
    var nav = document.querySelector('.topnav');
    if (!bar || !nav || bar.querySelector('.menu-btn')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Menü');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    var kapali = btn.innerHTML;
    var acik = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

    function ayarla(ac) {
      document.body.classList.toggle('menu-acik', ac);
      btn.innerHTML = ac ? acik : kapali;
      btn.setAttribute('aria-expanded', ac ? 'true' : 'false');
    }

    btn.addEventListener('click', function () {
      ayarla(!document.body.classList.contains('menu-acik'));
    });

    // panelden bir sayfaya gidilince menü kapansın
    nav.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (a && a.getAttribute('href')) ayarla(false);
    });

    // Esc ile kapat, geniş ekrana dönülünce sıfırla
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') ayarla(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) ayarla(false);
    });

    bar.appendChild(btn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();
})();
