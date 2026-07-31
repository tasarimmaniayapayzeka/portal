// ═══ PORTAL KAPISI (istemci-tarafı, Pages sürümü) ═══
// Not: Gerçek sunucu koruması alan adındaki PHP sürümünde. Bu kapı caydırıcı katmandır.
(function () {
  var MARKA = 'smilegroup';
  var HASH = 'a8e8300d94b085dd82528964c2a18810a35b2026be4453b400a2bed3593cec4b'; // SHA-256(PIN)
  if (sessionStorage.getItem('tmp_' + MARKA) === HASH) return;

  document.addEventListener('DOMContentLoaded', function () {
    document.body.style.overflow = 'hidden';
    var o = document.createElement('div');
    o.id = 'tmpGate';
    o.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#05070d;display:grid;place-items:center;padding:20px';
    o.innerHTML = '<form id="tmpF" style="max-width:400px;width:100%;text-align:center;background:#0d1424;border:1px solid rgba(120,200,255,.12);border-radius:18px;padding:36px 28px">'
      + '<img src="../assets/logo-beyaz.png" alt="tasarımmania" style="height:40px;width:auto;display:block;margin:0 auto 4px" />'
      + '<div style="font-size:13px;color:#6b7f9c;margin-bottom:22px">özel sunum portalı</div>'
      + '<h1 style="font-size:24px;color:#e9f2fb;margin:0 0 6px">Smile Group</h1>'
      + '<p style="font-size:13px;color:#90a4c0;margin:0 0 22px">Avrupa Sağlık Turizmi · Dijital Marka Stratejisi</p>'
      + '<input id="tmpP" type="password" inputmode="numeric" placeholder="PIN kodunuz" autocomplete="one-time-code" style="width:100%;box-sizing:border-box;padding:13px 16px;border-radius:12px;border:1px solid rgba(120,200,255,.12);background:#080c16;color:#e9f2fb;font-size:18px;text-align:center;letter-spacing:.35em;outline:none" />'
      + '<div id="tmpH" style="color:#f87171;font-size:12.5px;margin-top:10px;display:none">PIN hatalı — tekrar deneyin.</div>'
      + '<button type="submit" style="width:100%;margin-top:16px;padding:13px 22px;border-radius:999px;border:none;cursor:pointer;background:#22d3ee;color:#03242c;font-weight:700;font-size:14px;font-family:Inter,sans-serif;box-shadow:0 0 24px rgba(34,211,238,.35)">Sunumu Aç</button>'
      + '<p style="font-size:11.5px;color:#6b7f9c;margin-top:18px">PIN size WhatsApp ile iletildi · <a href="https://wa.me/905547916545" style="color:#22d3ee">Sorun mu var? Yazın</a></p>'
      + '</form>';
    document.body.appendChild(o);
    document.getElementById('tmpP').focus();

    document.getElementById('tmpF').addEventListener('submit', function (e) {
      e.preventDefault();
      var pin = document.getElementById('tmpP').value.trim();
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin)).then(function (buf) {
        var hex = Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        if (hex === HASH) {
          sessionStorage.setItem('tmp_' + MARKA, HASH);
          o.remove();
          document.body.style.overflow = '';
        } else {
          document.getElementById('tmpH').style.display = 'block';
          document.getElementById('tmpP').value = '';
          document.getElementById('tmpP').focus();
        }
      });
    });
  });
})();
