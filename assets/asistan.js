// ═══ PORTAL ASİSTANI — kural tabanlı rehber bot (statik + PHP uyumlu) ═══
// Sekme linkleri kabuk tarafından window.NAV ile verilir: {genel:'...', detay:'...', ...}
(function () {
  var NAV = window.NAV || {};
  var WA = 'https://wa.me/905547916545';
  var MARKA = (window.PORTAL && window.PORTAL.marka) || 'smilegroup';

  var CEVAPLAR = [
    { k: /bütçe|butce|fiyat|maliyet|ücret|ucret|kaç para|kac para|senaryo/i,
      c: 'Üç bütçe senaryosu hazır: MİNİMUM (~€12,5K+₺225K), ÖNERİLEN ★ (~€31K+₺630K) ve AGRESİF (~€67K+₺1.150K) — 6 aylık toplamlar. Teklif sekmesinde bileşenleri kendin seçip canlı toplamı görebilirsin.',
      l: [['🧮 Teklif hesaplayıcı', 'teklif'], ['💰 Bütçe detayı', 'detay']] },
    { k: /takip|durum|ilerleme|ne zaman|hangi aşama|hangi asama|takvim|plan(?!lama)/i,
      c: 'Proje Takip Merkezi\'nde her kilometre taşının durumu, tarihi ve sorumlusu rozetli olarak duruyor — 2 iş şu an sizin aksiyonunuzda görünüyor.',
      l: [['📡 Takip Merkezi', 'takip']] },
    { k: /onay|karar|revizyon|kabul|imza/i,
      c: 'Kararlar sekmesinde 3 bekleyen karar var: strateji onayı, bütçe senaryosu seçimi ve yetki belgesi durumu. Her butona basınca hazır WhatsApp mesajı açılır — tek dokunuş yeter.',
      l: [['✅ Karar Defteri', 'kararlar']] },
    { k: /görsel|gorsel|logo|dosya|indir|arşiv|arsiv|varlık|varlik|feed|story/i,
      c: 'Kampanya görselleri ve marka dosyaları Varlık Kütüphanesi\'nde — önizlemeler indirilebilir, 3 dilli tam setler tek tıkla istenir.',
      l: [['📦 Varlık Kütüphanesi', 'varliklar']] },
    { k: /youtube|instagram|video|içerik|icerik|sosyal|reels|podcast|çekim|cekim/i,
      c: 'Sosyal & YouTube sekmesinde 2 kanal mimarisi + ay ay 8+8 çekim listeleri (hikâyeleriyle) hazır. Ağustos listesi ilk çekim gününde kayda girecek.',
      l: [['🎬 Sosyal & YouTube', 'sosyal']] },
    { k: /kampanya|pazar|almanya|ingiltere|fransa|avrupa|rakip|strateji|yol harita/i,
      c: 'Pazar pazar kampanya planı Detay Strateji\'de: Almanya/İngiltere/Fransa/Avrupa + yurt içi, rakip boşluklarıyla birlikte. Kuşbakışı için Genel Bakış\'a da göz at.',
      l: [['🌍 Detay Strateji', 'detay'], ['🧭 Genel Bakış', 'genel']] },
    { k: /karne|skor|sağlık|saglik|qbr|değerlendir|degerlendir|çeyrek|ceyrek/i,
      c: 'Marka Sağlık Karnesi 6 boyutta başlangıç skorunu ve Ocak hedeflerini gösteriyor; çeyrek değerlendirme (QBR) takvimi de orada.',
      l: [['📊 Karne', 'karne']] },
    { k: /pin|şifre|sifre|giriş|giris|kod/i,
      c: 'Bu portal PIN korumalıdır; PIN size WhatsApp ile iletildi. Yeni ekip üyesi için erişim isterseniz bir mesaj yeter.',
      l: [] },
    { k: /merhaba|selam|slm|günaydın|gunaydin|iyi akşam|iyi aksam|nasılsın|nasilsin/i,
      c: 'Merhaba! 👋 Ben portal asistanınız. Bütçe, takvim, onaylar, dosyalar… ne ararsanız doğru sekmeye götürürüm. Aşağıdaki hızlı sorulardan da seçebilirsiniz.',
      l: [] },
    { k: /teşekkür|tesekkur|sağol|sagol|süper|super|harika/i,
      c: 'Rica ederim! 🙌 Başka bir sorunuz olursa buradayım.', l: [] },
    { k: /insan|yetkili|whatsapp|telefon|ara|ulaş|ulas|görüş|gorus/i,
      c: 'Sizi hemen ekibe bağlayayım — WhatsApp hattımız 7/24 açık.', wa: 'SMILE GROUP portalindan yaziyorum: ' , l: [] }
  ];

  function stil(el, s) { for (var k in s) el.style[k] = s[k]; return el; }
  function el(t, s, html) { var e = document.createElement(t); if (s) stil(e, s); if (html != null) e.innerHTML = html; return e; }

  // ── Balon ──
  var balon = el('button', { position: 'fixed', right: '18px', bottom: '18px', zIndex: 9990, width: '56px', height: '56px',
    borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#22d3ee', color: '#03242c', fontSize: '24px',
    boxShadow: '0 0 28px rgba(34,211,238,.45)', transition: 'transform .15s' }, '💬');
  balon.setAttribute('aria-label', 'Portal asistanı');
  balon.onmouseenter = function () { balon.style.transform = 'scale(1.08)'; };
  balon.onmouseleave = function () { balon.style.transform = ''; };

  // ── Panel ──
  var panel = el('div', { position: 'fixed', right: '18px', bottom: '84px', zIndex: 9991, width: 'min(360px, calc(100vw - 36px))',
    maxHeight: '70vh', display: 'none', flexDirection: 'column', background: '#0d1424', border: '1px solid rgba(34,211,238,.35)',
    borderRadius: '18px', overflow: 'hidden', boxShadow: '0 18px 50px rgba(0,0,0,.55)', fontFamily: 'Inter, sans-serif' });

  panel.appendChild(el('div', { padding: '14px 18px', background: '#111a2d', borderBottom: '1px solid rgba(120,200,255,.1)',
    fontWeight: '700', color: '#e9f2fb', fontSize: '14px' },
    '<span style="color:#22d3ee">✦</span> Portal Asistanı <span style="float:right;font-size:11px;color:#6b7f9c;font-weight:400">7/24 rehber</span>'));

  var akis = el('div', { padding: '14px', overflowY: 'auto', flex: '1', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' });
  panel.appendChild(akis);

  var cips = el('div', { padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' });
  panel.appendChild(cips);

  var form = el('form', { display: 'flex', gap: '8px', padding: '12px 14px', borderTop: '1px solid rgba(120,200,255,.1)' });
  var giris = el('input', { flex: '1', padding: '10px 14px', borderRadius: '999px', border: '1px solid rgba(120,200,255,.15)',
    background: '#080c16', color: '#e9f2fb', fontSize: '13px', outline: 'none' });
  giris.placeholder = 'Sorunuzu yazın…';
  var gonderBtn = el('button', { padding: '10px 16px', borderRadius: '999px', border: 'none', background: '#22d3ee',
    color: '#03242c', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }, '➤');
  form.appendChild(giris); form.appendChild(gonderBtn);
  panel.appendChild(form);

  function mesaj(kimden, html) {
    var m = el('div', kimden === 'ben'
      ? { alignSelf: 'flex-end', background: '#22d3ee', color: '#03242c', padding: '9px 13px', borderRadius: '14px 14px 4px 14px', fontSize: '13px', maxWidth: '85%' }
      : { alignSelf: 'flex-start', background: '#111a2d', color: '#c9d8ea', padding: '10px 13px', borderRadius: '14px 14px 14px 4px', fontSize: '13px', maxWidth: '90%', lineHeight: '1.5', border: '1px solid rgba(120,200,255,.08)' }, html);
    akis.appendChild(m); akis.scrollTop = akis.scrollHeight; return m;
  }

  function linkButonlari(liste, waMetin) {
    if (waMetin) {
      var wa = el('a', { display: 'inline-block', margin: '4px 4px 0 0', padding: '8px 14px', borderRadius: '999px',
        background: '#22d3ee', color: '#03242c', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }, '📱 WhatsApp\'a bağlan');
      wa.href = WA + '?text=' + encodeURIComponent(waMetin); wa.target = '_blank'; wa.rel = 'noopener';
      var kap = el('div', { alignSelf: 'flex-start' }); kap.appendChild(wa); akis.appendChild(kap);
    }
    (liste || []).forEach(function (l) {
      if (!NAV[l[1]]) return;
      var a = el('a', { display: 'inline-block', margin: '4px 4px 0 0', padding: '8px 14px', borderRadius: '999px',
        border: '1px solid rgba(34,211,238,.4)', color: '#22d3ee', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }, l[0] + ' →');
      a.href = NAV[l[1]];
      var kap = el('div', { alignSelf: 'flex-start' }); kap.appendChild(a); akis.appendChild(kap);
    });
    akis.scrollTop = akis.scrollHeight;
  }

  function yanitla(soru) {
    var yaziyor = mesaj('bot', '<span style="opacity:.5">yazıyor…</span>');
    setTimeout(function () {
      var bulundu = null;
      for (var i = 0; i < CEVAPLAR.length; i++) if (CEVAPLAR[i].k.test(soru)) { bulundu = CEVAPLAR[i]; break; }
      if (bulundu) {
        yaziyor.innerHTML = bulundu.c;
        linkButonlari(bulundu.l, bulundu.wa ? bulundu.wa : null);
      } else {
        yaziyor.innerHTML = 'Bu sorunun cevabı bende hazır değil — ama ekip WhatsApp\'ta; sorunuzu aynen iletebilirim. 👇';
        linkButonlari([], 'SMILE GROUP portal sorusu: ' + soru);
      }
    }, 550);
  }

  // ── Soru kaydı: satış sinyali analitiği (PHP'de rapora düşer; statikte sessizce yerelde birikir) ──
  function soruKaydet(s) {
    try {
      var anahtar = 'portal_sorular_' + MARKA;
      var liste = JSON.parse(localStorage.getItem(anahtar) || '[]');
      liste.push({ t: new Date().toISOString().slice(0, 16), s: s.slice(0, 140) });
      localStorage.setItem(anahtar, JSON.stringify(liste.slice(-50)));
    } catch (e) { }
    try {
      navigator.sendBeacon('/track.php', new Blob([JSON.stringify({
        m: MARKA, k: (window.PORTAL && window.PORTAL.kisi) || '', s: 'asistan',
        ev: [{ b: 'soru: ' + s.slice(0, 70), t: 1 }]
      })], { type: 'application/json' }));
    } catch (e) { }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = giris.value.trim(); if (!s) return;
    mesaj('ben', s.replace(/</g, '&lt;')); giris.value = '';
    soruKaydet(s);
    yanitla(s);
  });

  [['💰 Bütçe senaryoları', 'bütçe'], ['📡 Bu hafta ne yapılıyor?', 'takip durum'], ['✅ Nasıl onay veririm?', 'onay'], ['👤 İnsana bağlan', 'whatsapp']].forEach(function (c) {
    var b = el('button', { padding: '7px 12px', borderRadius: '999px', border: '1px solid rgba(120,200,255,.15)',
      background: 'transparent', color: '#90a4c0', fontSize: '11.5px', cursor: 'pointer' }, c[0]);
    b.type = 'button';
    b.onclick = function () { mesaj('ben', c[0]); yanitla(c[1]); };
    cips.appendChild(b);
  });

  var acik = false;
  balon.onclick = function () {
    acik = !acik;
    panel.style.display = acik ? 'flex' : 'none';
    balon.innerHTML = acik ? '✕' : '💬';
    if (acik && !akis.children.length) {
      mesaj('bot', 'Merhaba! 👋 Ben <b>Portal Asistanı</b>. Bütçe, takvim, onaylar, dosyalar… sorun, doğru sekmeye götüreyim.');
    }
  };

  document.body.appendChild(balon);
  document.body.appendChild(panel);
})();
