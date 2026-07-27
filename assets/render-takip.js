// ═══ CANLI VERİ RENDERER — takip/karar verilerini JSON'dan çizer (PHP + statik ortak) ═══
// Veri yolu kabuktan gelir: window.VERI ('/assets/veri/' veya '../assets/veri/')
(function () {
  // NAV/VERI kabuğun gövde sonunda tanımlanır — bu yüzden kullanım anında (fetch sonrası) okunur
  function NAVAL() { return window.NAV || {}; }
  var MARKA = (window.PORTAL && window.PORTAL.marka) || (document.currentScript && document.currentScript.src.indexOf('..') === -1 ? 'smilegroup' : 'smilegroup');

  var ROZET = {
    tamam:   { e: '✅ TAMAM',          s: 'pill p-ok' },
    devam:   { e: '🔵 DEVAM',          s: 'pill p-cyan' },
    marka:   { e: '⏳ MARKA AKSİYONU', s: 'pill p-warn' },
    sirada:  { e: '⏳ SIRADA',         s: 'pill', ekstra: 'background:#1a2438;color:var(--muted)' },
    gecikti: { e: '🔴 GECİKTİ',        s: 'pill p-bad' }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/</g, '&lt;'); }

  function basla() {
    var NAV = NAVAL();
    var marka = (window.PORTAL && window.PORTAL.marka) || MARKA;
    var yol = (window.VERI || '/assets/veri/') + marka + '-takip.json';
    fetch(yol).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (v) {

    // ── Hero istatistikleri (otomatik hesap) ──
    var hs = document.getElementById('ts-hero');
    if (hs && v.taslar) {
      var tamam = v.taslar.filter(function (t) { return t.durum === 'tamam'; }).length;
      var marka = v.taslar.filter(function (t) { return t.durum === 'marka'; }).length;
      hs.innerHTML =
        '<div class="stat"><b>%' + (v.faz && v.faz.tamamlanma != null ? v.faz.tamamlanma : Math.round(tamam / v.taslar.length * 100)) + '</b><span>' + esc(v.faz ? v.faz.ad : 'Faz') + ' tamamlanma</span></div>' +
        '<div class="stat"><b>' + tamam + '/' + v.taslar.length + '</b><span>kilometre taşı tamamlandı</span></div>' +
        '<div class="stat"><b>' + marka + '</b><span>Smile Group\'un aksiyonunda bekleyen iş</span></div>' +
        '<div class="stat"><b>' + esc(v.guncelleme).split(' ').slice(0, 2).join(' ') + '</b><span>son güncelleme</span></div>';
    }

    // ── Kilometre taşları ──
    var tk = document.getElementById('ts-taslar');
    if (tk && v.taslar) {
      tk.innerHTML = v.taslar.map(function (t, i) {
        var r = ROZET[t.durum] || ROZET.sirada;
        var link = (t.link && NAV[t.link]) ? ' <a href="' + NAV[t.link] + '" style="color:var(--cyan)">' + esc(t.linkMetin || 'İlgili sekme') + ' →</a>' : '';
        var detay = (t.detay || link) ? '<div style="font-size:12px;color:var(--muted-2)">' + esc(t.detay) + link + '</div>' : '';
        var altCizgi = i < v.taslar.length - 1 ? 'border-bottom:1px solid var(--line-soft);' : '';
        return '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;' + altCizgi + '">' +
          '<span class="' + r.s + '"' + (r.ekstra ? ' style="' + r.ekstra + '"' : '') + '>' + r.e + '</span>' +
          '<div style="flex:1"><b>' + esc(t.baslik) + '</b>' + detay + '</div>' +
          '<span style="font-size:12px;color:var(--muted-2);white-space:nowrap">' + esc(t.tarih) + ' · ' + esc(t.sorumlu) + '</span></div>';
      }).join('');
    }

    // ── Aktivite akışı ──
    var ak = document.getElementById('ts-aktivite');
    if (ak && v.aktivite) {
      ak.innerHTML = v.aktivite.map(function (a) {
        return '<li><b>' + esc(a.tarih) + '</b> — ' + esc(a.olay) + '</li>';
      }).join('');
    }

    // ── KPI tablosu ──
    var kp = document.getElementById('ts-kpi');
    if (kp && v.kpi) {
      kp.innerHTML = '<tr><th>Metrik</th><th>Bugün</th><th>Ocak 2027 hedefi</th><th>Durum</th></tr>' +
        v.kpi.map(function (k) {
          return '<tr><td>' + esc(k.metrik) + '</td><td>' + esc(k.bugun) + '</td><td><b>' + esc(k.hedef) + '</b></td>' +
            '<td><span class="pill" style="background:#1a2438;color:var(--muted)">' + esc(k.durum) + '</span></td></tr>';
        }).join('');
    }

    // ── Karar geçmişi ──
    var kg = document.getElementById('ts-kararlar');
    if (kg && v.kararGecmisi) {
      kg.innerHTML = '<tr><th>Tarih</th><th>Karar</th><th>Veren</th><th>Kanal</th></tr>' +
        v.kararGecmisi.map(function (k) {
          return '<tr><td>' + esc(k.tarih) + '</td><td><b>' + esc(k.karar) + '</b></td><td>' + esc(k.veren) + '</td><td>' + esc(k.kanal) + '</td></tr>';
        }).join('') +
        '<tr><td colspan="4" style="color:var(--muted-2);font-size:12px">Verdiğiniz her karar buraya tarih + karar veren kişiyle işlenir. Kurumsal hafızanız bu tabloda birikir.</td></tr>';
    }
    }).catch(function () {
      var tk = document.getElementById('ts-taslar');
      if (tk) tk.innerHTML = '<div style="padding:20px;color:var(--muted-2)">Canlı veri şu an yüklenemedi — <a href="https://wa.me/905547916545" style="color:var(--cyan)">WhatsApp\'tan güncel durumu sorabilirsiniz</a>.</div>';
    });
  }
  // Kabuk script'leri gövde sonunda: DOM hazır olunca başlat ki NAV/VERI tanımlı olsun
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla);
  else setTimeout(basla, 0);
})();
