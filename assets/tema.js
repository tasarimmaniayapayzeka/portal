// ═══ PORTAL TEMA SEÇİCİ — marka bazlı (gece / gündüz / sade) ═══
// Her marka kendi tercihini saklar: tm_tema_{marka}
// Marka JSON'ında "tema": { "varsayilan": "acik" } varsa ilk açılışta o uygulanır.
(function () {
  var MARKA = (window.PORTAL && window.PORTAL.marka) || (location.pathname.split('/').filter(Boolean)[0] || 'genel');
  var ANAHTAR = 'tm_tema_' + MARKA;
  var TEMALAR = [
    { id: 'gece', ikon: '🌙', ad: 'Gece modu' },
    { id: 'acik', ikon: '☀️', ad: 'Gündüz modu' },
    { id: 'sade', ikon: '📖', ad: 'Sade okuma modu' }
  ];

  function uygula(id) {
    if (id === 'gece') document.documentElement.removeAttribute('data-tema');
    else document.documentElement.setAttribute('data-tema', id);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', id === 'acik' ? '#f6f8fc' : id === 'sade' ? '#f7f5f0' : '#05070d');
  }

  var secili = null;
  try { secili = localStorage.getItem(ANAHTAR); } catch (e) { }
  if (!secili) {
    // marka varsayılanı (kabuk tarafından verilir) → yoksa sistem tercihi
    secili = (window.PORTAL && window.PORTAL.tema) ||
      ((window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'acik' : 'gece');
  }
  uygula(secili);

  function butonlar(kutu) {
    TEMALAR.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = t.ikon;
      b.title = t.ad;
      b.setAttribute('aria-label', t.ad);
      if (t.id === secili) b.classList.add('on');
      b.addEventListener('click', function () {
        secili = t.id;
        uygula(secili);
        try { localStorage.setItem(ANAHTAR, secili); } catch (e) { }
        [].forEach.call(kutu.children, function (x) { x.classList.toggle('on', x === b); });
      });
      kutu.appendChild(b);
    });
  }

  function kur() {
    if (document.querySelector('.tema-sec')) return;
    var kutu = document.createElement('span');
    kutu.className = 'tema-sec';
    kutu.setAttribute('role', 'group');
    kutu.setAttribute('aria-label', 'Görünüm modu');
    butonlar(kutu);

    var nav = document.querySelector('.topnav');
    if (nav) {
      nav.appendChild(kutu);           // sunum ekranı: menüye ekle
    } else {
      // PIN giriş ekranı: sağ üste sabitle
      kutu.style.cssText = 'position:fixed;top:16px;right:16px;z-index:100';
      document.body.appendChild(kutu);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
  else kur();
})();
