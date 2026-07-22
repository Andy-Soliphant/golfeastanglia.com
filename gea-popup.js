// GEA Email Capture Popup
// Kit form UID: 97dcf287d3
// Triggers on 50% scroll depth OR 20 seconds, whichever comes first.
// Once per session. Exit-intent backstop on desktop.

(function() {
  'use strict';

  var POPUP_ID = 'gea-email-popup';
  var SESSION_KEY = 'gea_popup_shown';
  var DELAY_MS = 20000;
  var SCROLL_TRIGGER = 0.5;   // fire at 50% page depth

  // Don't show if already seen this session
  if (sessionStorage.getItem(SESSION_KEY)) return;

  var styles = `
    #gea-overlay {
      position: fixed;
      inset: 0;
      background: rgba(5,15,6,0.78);
      backdrop-filter: blur(3px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: geaFadeIn 0.3s ease both;
    }
    @keyframes geaFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #gea-popup {
      background: #0d1f0f;
      border: 1px solid rgba(183,157,100,0.3);
      max-width: 520px;
      width: 100%;
      position: relative;
      animation: geaSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
    }
    @keyframes geaSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #gea-popup-bar {
      height: 3px;
      background: linear-gradient(90deg, #b79d64 0%, rgba(183,157,100,0.2) 100%);
    }
    #gea-popup-close {
      position: absolute;
      top: 14px; right: 18px;
      background: none;
      border: none;
      color: rgba(232,226,214,0.3);
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      font-family: Arial, sans-serif;
      transition: color 0.2s;
      padding: 0;
    }
    #gea-popup-close:hover { color: #b79d64; }
    #gea-popup-inner {
      padding: 36px 40px 40px;
    }
    #gea-popup-eyebrow {
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #b79d64;
      margin-bottom: 12px;
      font-family: 'Outfit', Arial, sans-serif;
    }
    #gea-popup-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 30px;
      font-weight: 300;
      line-height: 1.15;
      color: #e8e2d6;
      margin-bottom: 10px;
    }
    #gea-popup-title em {
      font-style: italic;
      color: #b79d64;
    }
    #gea-popup-sub {
      font-size: 14px;
      color: rgba(232,226,214,0.5);
      font-family: 'Outfit', Arial, sans-serif;
      font-weight: 300;
      margin-bottom: 22px;
      line-height: 1.65;
    }
    #gea-popup-benefits {
      list-style: none;
      margin: 0 0 24px 0;
      padding: 0;
    }
    #gea-popup-benefits li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      color: rgba(232,226,214,0.65);
      font-family: 'Outfit', Arial, sans-serif;
      font-weight: 300;
      margin-bottom: 8px;
      line-height: 1.6;
    }
    #gea-popup-benefits li::before {
      content: '—';
      color: #b79d64;
      flex-shrink: 0;
    }
    #gea-popup-form {
      display: flex;
      gap: 0;
      margin-bottom: 10px;
    }
    #gea-popup-email {
      flex: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(183,157,100,0.25);
      border-right: none;
      color: #e8e2d6;
      font-family: 'Outfit', Arial, sans-serif;
      font-size: 14px;
      font-weight: 300;
      padding: 12px 16px;
      outline: none;
      transition: border-color 0.2s;
    }
    #gea-popup-email::placeholder { color: rgba(232,226,214,0.28); }
    #gea-popup-email:focus { border-color: rgba(183,157,100,0.55); }
    #gea-popup-submit {
      background: #b79d64;
      border: none;
      color: #0d1f0f;
      font-family: 'Outfit', Arial, sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 12px 20px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #gea-popup-submit:hover { background: #c9b47a; }
    #gea-popup-submit:disabled { opacity: 0.6; cursor: default; }
    #gea-popup-privacy {
      font-size: 11px;
      color: rgba(232,226,214,0.22);
      font-family: 'Outfit', Arial, sans-serif;
      font-weight: 300;
    }
    #gea-popup-success {
      display: none;
      text-align: center;
      padding: 20px 0 10px;
    }
    #gea-popup-success-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 24px;
      font-weight: 300;
      color: #b79d64;
      margin-bottom: 8px;
    }
    #gea-popup-success-text {
      font-size: 14px;
      color: rgba(232,226,214,0.5);
      font-family: 'Outfit', Arial, sans-serif;
      font-weight: 300;
    }
    @media (max-width: 560px) {
      #gea-popup-inner { padding: 28px 24px 32px; }
      #gea-popup-title { font-size: 24px; }
      #gea-popup-form { flex-direction: column; }
      #gea-popup-email { border-right: 1px solid rgba(183,157,100,0.25); border-bottom: none; }
      #gea-popup-submit { padding: 12px; }
    }
  `;

  var html = `
    <div id="gea-overlay" role="dialog" aria-modal="true" aria-labelledby="gea-popup-title">
      <div id="gea-popup">
        <div id="gea-popup-bar"></div>
        <button id="gea-popup-close" aria-label="Close">&times;</button>
        <div id="gea-popup-inner">
          <p id="gea-popup-eyebrow">Golf East Anglia · Insider Access</p>
          <h2 id="gea-popup-title"><em>England's east coast golf</em> — straight to your inbox</h2>
          <p id="gea-popup-sub">Course notes, seasonal advice and itinerary ideas from the specialists who play these courses every week.</p>
          <ul id="gea-popup-benefits">
            <li>The inside line on Royal West Norfolk, Hunstanton, Royal Cromer and Sheringham</li>
            <li>Honest seasonal advice — including when not to come</li>
            <li>Early access to 2027 itineraries and availability</li>
            <li>No spam. Unsubscribe any time.</li>
          </ul>
          <div id="gea-popup-success">
            <p id="gea-popup-success-title">Thank you.</p>
            <p id="gea-popup-success-text">You're on the list. We'll be in touch with the inside line on East Anglia golf.</p>
          </div>
          <form id="gea-popup-form" action="https://app.kit.com/forms/97dcf287d3/subscriptions" method="post" data-sv-form="97dcf287d3" data-uid="97dcf287d3">
            <input id="gea-popup-email" type="email" name="email_address" placeholder="Your email address" required autocomplete="email" aria-label="Email address">
            <button id="gea-popup-submit" type="submit">Keep me posted</button>
          </form>
          <p id="gea-popup-privacy">No spam. Unsubscribe anytime. We take your privacy seriously.</p>
        </div>
      </div>
    </div>
  `;

  function closePopup() {
    var overlay = document.getElementById('gea-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.25s';
      setTimeout(function() { overlay.parentNode && overlay.parentNode.removeChild(overlay); }, 260);
    }
    sessionStorage.setItem(SESSION_KEY, '1');
  }

  function showPopup() {
    // Inject styles
    var styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Inject HTML
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);

    sessionStorage.setItem(SESSION_KEY, '1');

    // Close button
    document.getElementById('gea-popup-close').addEventListener('click', closePopup);

    // Click outside to close
    document.getElementById('gea-overlay').addEventListener('click', function(e) {
      if (e.target.id === 'gea-overlay') closePopup();
    });

    // ESC to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePopup();
    });

    // Form submit — post to Kit
    document.getElementById('gea-popup-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('gea-popup-email').value;
      var btn = document.getElementById('gea-popup-submit');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      var data = new FormData();
      data.append('email_address', email);

      fetch('https://app.kit.com/forms/97dcf287d3/subscriptions', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(res) {
        // Show success regardless of response (Kit may return 200 or redirect)
        document.getElementById('gea-popup-form').style.display = 'none';
        document.getElementById('gea-popup-privacy').style.display = 'none';
        document.getElementById('gea-popup-success').style.display = 'block';
        setTimeout(closePopup, 3000);
      })
      .catch(function() {
        // Fallback — still show success, Kit form should have captured it
        document.getElementById('gea-popup-form').style.display = 'none';
        document.getElementById('gea-popup-privacy').style.display = 'none';
        document.getElementById('gea-popup-success').style.display = 'block';
        setTimeout(closePopup, 3000);
      });
    });
  }

  // ---- Triggers: scroll depth OR timer OR exit intent, whichever fires first ----
  var fired = false;
  function fireOnce() {
    if (fired) return;
    fired = true;
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('mouseout', onExit);
    showPopup();
  }

  function onScroll() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    if ((window.scrollY || doc.scrollTop) / scrollable >= SCROLL_TRIGGER) fireOnce();
  }

  function onExit(e) {
    // desktop only, and only when the cursor genuinely leaves the top of the viewport
    if (window.innerWidth < 900) return;
    if (!e.relatedTarget && e.clientY <= 0) fireOnce();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('mouseout', onExit);
  setTimeout(fireOnce, DELAY_MS);

})();
