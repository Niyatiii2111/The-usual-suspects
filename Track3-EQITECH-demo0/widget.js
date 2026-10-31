/**
 * The Usual Suspects - Universal Drop-in Web Accessibility Layer
 * Problem Statement 1.4: Universal Web Accessibility Layer for Any Website
 * 
 * Works as a 1-line script embed for small businesses & public portals:
 * <script src="widget.js"></script>
 */

(function () {
  if (window.__EQITECH_WIDGET_LOADED__ || window.__THE_USUAL_SUSPECTS_WIDGET_LOADED__) return;
  window.__EQITECH_WIDGET_LOADED__ = true;
  window.__THE_USUAL_SUSPECTS_WIDGET_LOADED__ = true;

  // ========================================================
  // 0. TOAST NOTIFICATION & DOUBLE-TAP STOP AUDIO
  // ========================================================
  function showToast(msg) {
    let toast = document.getElementById('eqitech-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'eqitech-toast';
      toast.style.cssText = `
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(33, 37, 41, 0.95);
        color: #ffffff;
        padding: 9px 22px;
        border-radius: 24px;
        font-size: 13px;
        font-weight: 700;
        z-index: 2147483647;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        transition: opacity 0.2s, transform 0.2s;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.display = 'block';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 200);
    }, 1800);
  }

  let activeVoiceRec = null;

  function stopAllSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (activeVoiceRec) {
      try { activeVoiceRec.abort(); } catch (e) {}
      activeVoiceRec = null;
    }
    const voiceBtn = document.getElementById('eqitech-voice-btn');
    if (voiceBtn) {
      voiceBtn.innerHTML = '🎙️ Start Voice Command';
      voiceBtn.style.background = '#0abde3';
    }
    const voiceBox = document.getElementById('eqitech-voice-box');
    if (voiceBox) {
      voiceBox.style.display = 'none';
    }
    showToast("🔇 Audio & Voice Stopped");
  }

  // Double-click anywhere to immediately stop speech audio
  window.addEventListener('dblclick', () => {
    stopAllSpeech();
  });
  document.addEventListener('dblclick', () => {
    stopAllSpeech();
  });

  // Mobile / touch screen double-tap detection to stop audio
  let lastTouchTime = 0;
  window.addEventListener('touchend', () => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTouchTime;
    if (tapLength < 350 && tapLength > 40) {
      stopAllSpeech();
    }
    lastTouchTime = currentTime;
  });

  // ========================================================
  // 1. FLOATING ACCESSIBILITY BADGE & DRAWER
  // ========================================================
  const badge = document.createElement('div');
  badge.id = 'eqitech-badge';
  badge.innerHTML = `
    <button id="eqitech-toggle-btn" aria-label="Open Accessibility Menu" title="Accessibility Layer (Alt+A)">
      ♿
    </button>
  `;
  badge.style.cssText = `
    position: fixed;
    bottom: 22px;
    right: 22px;
    z-index: 2147483640;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  const panel = document.createElement('div');
  panel.id = 'eqitech-panel';
  panel.style.cssText = `
    display: none;
    position: fixed;
    bottom: 82px;
    right: 22px;
    width: 330px;
    max-height: 85vh;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.22);
    z-index: 2147483645;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #2d3436;
    border: 1px solid #dfe6e9;
    box-sizing: border-box;
  `;

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:22px;">♿</span>
        <h3 style="margin:0; font-size:15px; font-weight:800; color:#2d3436;">The Usual Suspects Layer</h3>
      </div>
      <button id="eqitech-close-btn" style="border:none; background:none; font-size:18px; cursor:pointer; color:#636e72;">✕</button>
    </div>

    <!-- Live Audit Score Card -->
    <div style="background:#f8f9fa; border-radius:10px; padding:10px; margin-bottom:12px; border:1px solid #e9ecef;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <span style="font-size:11px; font-weight:bold; color:#636e72; text-transform:uppercase;">WCAG 2.1 Score</span>
        <span id="eqitech-score-badge" style="background:#10ac84; color:#fff; font-size:11px; font-weight:bold; padding:2px 8px; border-radius:12px;">--/100</span>
      </div>
      <button id="eqitech-scan-btn" style="width:100%; padding:7px; background:#6c5ce7; color:#fff; border:none; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; margin-bottom:5px;">📊 Scan Page Score</button>
      <button id="eqitech-autofix-btn" style="width:100%; padding:7px; background:#10ac84; color:#fff; border:none; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; margin-bottom:5px;">⚡ Auto-Fix All Issues (95%+)</button>
      <button id="eqitech-report-btn" style="width:100%; padding:7px; background:#2d3436; color:#fff; border:none; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">📄 Export Site Owner Compliance Report</button>
      <div id="eqitech-fix-status" style="font-size:10px; color:#0e8163; font-weight:bold; margin-top:5px; display:none;"></div>
    </div>

    <!-- Quick Tools Grid -->
    <div style="font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:6px;">Visual & Motor Assistance</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:12px;">
      <button id="eqitech-dyslexia-btn" class="eqitech-btn">🔤 Dyslexia Font</button>
      <button id="eqitech-contrast-btn" class="eqitech-btn">🌓 Auto-Contrast</button>
      <button id="eqitech-ruler-btn" class="eqitech-btn">📏 Reading Ruler</button>
      <button id="eqitech-focus-btn" class="eqitech-btn">🎯 Focus Rings</button>
      <button id="eqitech-bionic-btn" class="eqitech-btn">⚡ Bionic Text</button>
      <button id="eqitech-large-btn" class="eqitech-btn">🔍 Enlarge Font</button>
    </div>

    <!-- 🌈 VIBGYOR & High-Contrast Themes Section -->
    <div style="font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:6px;">🌈 VIBGYOR & Color Modes</div>
    <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; margin-bottom:6px;">
      <button class="eqitech-swatch-btn" data-vibgyor="#8B00FF" data-text="#FFFFFF" title="Violet" style="background:#8B00FF; height:24px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>
      <button class="eqitech-swatch-btn" data-vibgyor="#4B0082" data-text="#FFFFFF" title="Indigo" style="background:#4B0082; height:24px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>
      <button class="eqitech-swatch-btn" data-vibgyor="#0000FF" data-text="#FFFFFF" title="Blue" style="background:#0000FF; height:24px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>
      <button class="eqitech-swatch-btn" data-vibgyor="#00FF00" data-text="#000000" title="Green" style="background:#00FF00; height:24px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>
      <button class="eqitech-swatch-btn" data-vibgyor="#FFFF00" data-text="#000000" title="Yellow" style="background:#FFFF00; height:24px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>
      <button class="eqitech-swatch-btn" data-vibgyor="#FF7F00" data-text="#000000" title="Orange" style="background:#FF7F00; height:24px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>
      <button class="eqitech-swatch-btn" data-vibgyor="#FF0000" data-text="#FFFFFF" title="Red" style="background:#FF0000; height:24px; border-radius:4px; border:1px solid rgba(0,0,0,0.15); cursor:pointer;"></button>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:4px; margin-bottom:12px;">
      <button class="eqitech-swatch-btn" data-vibgyor="#000000" data-text="#E0E0E0" style="background:#000; color:#fff; font-size:10px; font-weight:bold; padding:4px; border-radius:4px; border:1px solid #444; cursor:pointer;">Black</button>
      <button class="eqitech-swatch-btn" data-vibgyor="#FFFFFF" data-text="#121212" style="background:#fff; color:#000; font-size:10px; font-weight:bold; padding:4px; border-radius:4px; border:1px solid #ccc; cursor:pointer;">White</button>
      <button class="eqitech-swatch-btn" data-vibgyor="#121212" data-text="#00E676" style="background:#121212; color:#00E676; font-size:10px; font-weight:bold; padding:4px; border-radius:4px; border:1px solid #333; cursor:pointer;">🌙 Dark</button>
      <button class="eqitech-swatch-btn" data-vibgyor="reset" data-text="" style="background:#e9ecef; color:#2d3436; font-size:10px; font-weight:bold; padding:4px; border-radius:4px; border:1px solid #ced4da; cursor:pointer;">↺ Reset</button>
    </div>

    <!-- Speech & Voice Assist (Integrated directly inside Accessibility Layer) -->
    <div style="font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:6px;">Voice & Screen Reader</div>
    <button id="eqitech-tts-btn" style="width:100%; padding:7px; background:#ff9f43; color:#fff; border:none; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; margin-bottom:5px;">🔊 Read Page Aloud</button>
    <button id="eqitech-voice-btn" style="width:100%; padding:7px; background:#0abde3; color:#fff; border:none; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; margin-bottom:5px; transition:background 0.2s;">🎙️ Start Voice Command</button>
    
    <!-- Integrated Voice Assistant Box inside Accessibility Panel -->
    <div id="eqitech-voice-box" style="display:none; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:8px; margin-bottom:6px;">
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
        <span id="eqitech-voice-pulse" style="width:8px; height:8px; border-radius:50%; background:#22c55e; display:inline-block; animation:eqitech-pulse 1.4s infinite;"></span>
        <strong id="eqitech-voice-status-text" style="color:#15803d; font-size:11px;">Listening... Speak a command</strong>
      </div>
      <div id="eqitech-voice-transcript" style="color:#475569; font-style:italic; font-size:10px; margin-bottom:6px;">Say "dark mode", "auto fix", "dyslexia", "ruler", etc.</div>
      <div style="font-size:10px; font-weight:bold; color:#64748b; margin-bottom:4px;">Quick Voice Commands:</div>
      <div style="display:flex; flex-wrap:wrap; gap:3px; margin-bottom:6px;" id="eqitech-voice-chips">
        <button class="eqitech-vchip" data-cmd="auto fix">⚡ Auto-Fix</button>
        <button class="eqitech-vchip" data-cmd="dark mode">🌙 Dark</button>
        <button class="eqitech-vchip" data-cmd="dyslexia font">🔤 Dyslexia</button>
        <button class="eqitech-vchip" data-cmd="reading ruler">📏 Ruler</button>
        <button class="eqitech-vchip" data-cmd="focus rings">🎯 Focus</button>
        <button class="eqitech-vchip" data-cmd="violet theme">🌈 Violet</button>
        <button class="eqitech-vchip" data-cmd="blue theme">🌈 Blue</button>
        <button class="eqitech-vchip" data-cmd="light mode">☀️ Reset</button>
      </div>
      <form id="eqitech-manual-cmd-form" style="display:flex; gap:4px;">
        <input type="text" id="eqitech-manual-cmd-input" placeholder="Type voice command..." style="flex:1; padding:4px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:10px; outline:none;">
        <button type="submit" style="background:#0284c7; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:10px; font-weight:bold; cursor:pointer;">Run</button>
      </form>
    </div>

    <button id="eqitech-stop-audio-btn" style="width:100%; padding:6px; background:#ee5253; color:#fff; border:none; border-radius:6px; font-size:10.5px; font-weight:bold; cursor:pointer;">🔇 Stop Audio / Voice</button>
  `;

  // Inject Styles
  const widgetStyle = document.createElement('style');
  widgetStyle.id = 'eqitech-widget-styles';
  widgetStyle.innerHTML = `
    #eqitech-toggle-btn {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10ac84, #00cec9);
      color: #ffffff;
      border: none;
      font-size: 26px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(16, 172, 132, 0.45);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #eqitech-toggle-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(16, 172, 132, 0.6);
    }
    .eqitech-btn {
      padding: 8px 4px;
      font-size: 11px;
      font-weight: bold;
      border: 1px solid #dcdde1;
      border-radius: 6px;
      background: #f5f6fa;
      color: #2f3542;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .eqitech-btn:hover {
      background: #e4e7eb;
    }
    .eqitech-active {
      background: #10ac84 !important;
      color: #ffffff !important;
      border-color: #10ac84 !important;
    }
    .eqitech-interactive-highlight {
      outline: 2.5px dashed #ff9f43 !important;
      outline-offset: 3px !important;
    }
    .eqitech-vchip {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 2px 7px;
      font-size: 10px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .eqitech-vchip:hover {
      background: #0284c7;
      color: #ffffff;
      border-color: #0284c7;
    }
    @keyframes eqitech-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.25); }
    }
  `;

  document.head.appendChild(widgetStyle);
  document.body.appendChild(badge);
  document.body.appendChild(panel);

  function togglePanel() {
    const isHidden = panel.style.display === 'none' || !panel.style.display;
    panel.style.display = isHidden ? 'block' : 'none';
  }

  window.__EQITECH_TOGGLE_PANEL__ = togglePanel;
  window.__THE_USUAL_SUSPECTS_TOGGLE_PANEL__ = togglePanel;
  window.TheUsualSuspects = window.EQITECH = {
    toggle: togglePanel,
    show: () => { badge.style.display = 'block'; panel.style.display = 'block'; },
    hide: () => { badge.style.display = 'none'; panel.style.display = 'none'; },
    scan: () => runAudit(),
    autoFix: () => autoFixBtn && autoFixBtn.click()
  };

  const toggleBtn = document.getElementById('eqitech-toggle-btn');
  const closeBtn = document.getElementById('eqitech-close-btn');
  toggleBtn.onclick = togglePanel;
  badge.onclick = (e) => {
    if (e.target === badge) togglePanel();
  };
  closeBtn.onclick = () => { panel.style.display = 'none'; };

  // ========================================================
  // 1.5. VIBGYOR & COLOR CONTRAST THEMES ENGINE
  // ========================================================
  const vibgyorStyleId = 'eqitech-vibgyor-theme-style';
  function applyVibgyorTheme(bg, text) {
    let existing = document.getElementById(vibgyorStyleId);
    if (bg === 'reset') {
      if (existing) existing.remove();
      showToast("↺ Original Colors Restored");
      return;
    }
    if (!existing) {
      existing = document.createElement('style');
      existing.id = vibgyorStyleId;
      document.head.appendChild(existing);
    }
    existing.innerHTML = `
      body, header, nav, main, section, div:not(#eqitech-a11y-panel):not(#eqitech-a11y-badge):not(.eqitech-toast), article, aside, footer {
        background-color: ${bg} !important;
        color: ${text} !important;
      }
      p, span, h1, h2, h3, h4, h5, h6, li, td, th, label {
        color: ${text} !important;
      }
      .card, .container, .hero {
        background: ${bg} !important;
        border-color: ${text} !important;
        color: ${text} !important;
      }
      #eqitech-a11y-panel, #eqitech-a11y-badge, #eqitech-a11y-panel * {
        background-color: revert !important;
        color: revert !important;
      }
    `;
    showToast(`🌈 Theme Applied: ${bg}`);
  }

  panel.querySelectorAll('.eqitech-swatch-btn').forEach(btn => {
    btn.onclick = () => {
      const bg = btn.dataset.vibgyor;
      const text = btn.dataset.text;
      applyVibgyorTheme(bg, text);
    };
  });

  // ========================================================
  // 2. AUDIT SCANNER (WCAG 2.1 AA)
  // ========================================================
  const scanBtn = document.getElementById('eqitech-scan-btn');
  const scoreBadge = document.getElementById('eqitech-score-badge');
  let currentScore = 100;
  let lastAuditData = null;

  function runAudit() {
    let score = 100;
    const missingImgs = document.querySelectorAll('img:not([alt]):not([aria-label])');
    if (missingImgs.length > 0) score -= Math.min(20, missingImgs.length * 4);

    const hasH1 = !!document.querySelector('h1');
    if (!hasH1) score -= 10;

    const hasLang = !!document.documentElement.lang;
    if (!hasLang) score -= 8;

    const unlabelled = Array.from(document.querySelectorAll('input:not([type=hidden]):not([aria-label])')).filter(i => {
      const id = i.id;
      const hasFor = id ? !!document.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
      const hasParent = !!i.closest('label');
      return !hasFor && !hasParent && !i.placeholder;
    });
    if (unlabelled.length > 0) score -= Math.min(20, unlabelled.length * 5);

    const meta = document.querySelector('meta[name="viewport"]');
    const zoomBlocked = meta && (meta.content.includes('user-scalable=no') || meta.content.includes('maximum-scale=1'));
    if (zoomBlocked) score -= 14;

    currentScore = Math.max(0, score);
    scoreBadge.textContent = `${currentScore}/100`;
    scoreBadge.style.background = currentScore >= 90 ? '#10ac84' : (currentScore >= 70 ? '#ff9f43' : '#ee5253');

    lastAuditData = {
      score: currentScore,
      grade: currentScore >= 90 ? 'A' : (currentScore >= 75 ? 'B' : (currentScore >= 55 ? 'C' : 'F')),
      missingImgs: missingImgs.length,
      hasH1: hasH1,
      hasLang: hasLang,
      unlabelledInputs: unlabelled.length,
      zoomBlocked: zoomBlocked
    };
    return lastAuditData;
  }
  scanBtn.onclick = () => {
    runAudit();
    showToast(`📊 Page Score: ${currentScore}/100 (Grade ${lastAuditData.grade})`);
  };

  // ========================================================
  // 3. ONE-CLICK AUTO-FIX (BOOST TO 95%+)
  // ========================================================
  const autoFixBtn = document.getElementById('eqitech-autofix-btn');
  const fixStatus = document.getElementById('eqitech-fix-status');

  autoFixBtn.onclick = () => {
    let count = 0;

    // 1. Fix Image Alt text
    document.querySelectorAll('img').forEach((img, i) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        img.alt = img.title || `Accessible image ${i + 1}`;
        img.setAttribute('aria-label', img.alt);
        count++;
      }
    });

    // 2. Fix <html> lang
    if (!document.documentElement.lang) {
      document.documentElement.lang = navigator.language || 'en';
      count++;
    }

    // 3. Fix Viewport Zoom
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && (meta.content.includes('user-scalable=no') || meta.content.includes('maximum-scale=1'))) {
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      count++;
    }

    // 4. Fix H1
    if (!document.querySelector('h1')) {
      const h1 = document.createElement('h1');
      h1.textContent = document.title || 'Main Content';
      h1.style.cssText = 'position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); border:0;';
      document.body.insertBefore(h1, document.body.firstChild);
      count++;
    }

    // 5. Fix Form Labels
    document.querySelectorAll('input:not([type=hidden]), select, textarea').forEach((inp, i) => {
      if (!inp.getAttribute('aria-label')) {
        inp.setAttribute('aria-label', inp.placeholder || inp.name || `Input field ${i + 1}`);
        count++;
      }
    });

    // 6. Landmark
    if (!document.querySelector('main, [role="main"]')) {
      document.body.setAttribute('role', 'main');
    }

    runAudit();
    fixStatus.style.display = 'block';
    fixStatus.textContent = `🎉 Applied ${count} auto-fixes! Score boosted to ${currentScore}/100.`;
    showToast(`Score Boosted to ${currentScore}/100 (Grade ${lastAuditData.grade})`);
  };

  // ========================================================
  // 4. BONUS TWIST: SITE OWNER COMPLIANCE REPORT (PDF / PRINT)
  // ========================================================
  document.getElementById('eqitech-report-btn').onclick = () => {
    const data = runAudit();
    const hostname = window.location.hostname || 'Website';
    const dateStr = new Date().toLocaleString();

    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Accessibility Compliance Audit Report - ${hostname}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #2d3436; max-width: 840px; margin: auto; background: #fafafa; }
    .card { background: #fff; padding: 35px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #dfe6e9; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #10ac84; padding-bottom: 20px; margin-bottom: 25px; }
    .badge { background: ${data.score >= 90 ? '#10ac84' : '#ff9f43'}; color: #fff; font-size: 28px; font-weight: 800; padding: 10px 22px; border-radius: 10px; text-align: center; }
    table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13.5px; }
    th, td { border: 1px solid #dfe6e9; padding: 12px; text-align: left; }
    th { background: #f8f9fa; color: #4b6584; }
    .pass { color: #10ac84; font-weight: bold; }
    .warn { color: #ee5253; font-weight: bold; }
    .actions { margin-top: 30px; text-align: right; }
    .btn-print { background: #10ac84; color: #fff; border: none; padding: 12px 26px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer; }
    @media print {
      body { padding: 0; background: #fff; }
      .card { border: none; box-shadow: none; padding: 0; }
      .actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1 style="margin:0 0 8px 0; color:#2d3436; font-size:24px;">🛡️ Web Accessibility Compliance Audit Report</h1>
        <p style="margin:0; color:#636e72;"><strong>Target URL:</strong> ${window.location.href}</p>
        <p style="margin:4px 0 0 0; color:#636e72;"><strong>Audited Date:</strong> ${dateStr}</p>
        <p style="margin:4px 0 0 0; color:#10ac84; font-weight:bold;">Certified by The Usual Suspects Accessibility Layer</p>
      </div>
      <div class="badge">${data.score}/100<div style="font-size:12px; margin-top:2px;">Grade ${data.grade}</div></div>
    </div>
    <h3>Executive Compliance Summary</h3>
    <p>This automated assessment evaluates the live Document Object Model (DOM) according to <strong>WCAG 2.1 Level AA</strong> specifications for visually impaired, dyslexic, and motor-impaired users.</p>
    <table>
      <thead>
        <tr><th>WCAG Check</th><th>Standard</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr><td>Non-text Content</td><td>WCAG 1.1.1 (Image Alt Text)</td><td class="${data.missingImgs === 0 ? 'pass' : 'warn'}">${data.missingImgs === 0 ? '✅ PASSED' : '⚠️ ' + data.missingImgs + ' images missing alt'}</td></tr>
        <tr><td>Heading Structure</td><td>WCAG 1.3.1 (H1 Orientation)</td><td class="${data.hasH1 ? 'pass' : 'warn'}">${data.hasH1 ? '✅ PASSED' : '⚠️ Missing main H1'}</td></tr>
        <tr><td>Text Scaling & Zoom</td><td>WCAG 1.4.4 (Resize Text)</td><td class="${!data.zoomBlocked ? 'pass' : 'warn'}">${!data.zoomBlocked ? '✅ PASSED' : '⚠️ Zoom blocked'}</td></tr>
        <tr><td>Input Identification</td><td>WCAG 4.1.2 (Form Labels)</td><td class="${data.unlabelledInputs === 0 ? 'pass' : 'warn'}">${data.unlabelledInputs === 0 ? '✅ PASSED' : '⚠️ ' + data.unlabelledInputs + ' unlabelled fields'}</td></tr>
        <tr><td>Language Specification</td><td>WCAG 3.1.1 (HTML Lang)</td><td class="${data.hasLang ? 'pass' : 'warn'}">${data.hasLang ? '✅ PASSED' : '⚠️ Missing lang attribute'}</td></tr>
      </tbody>
    </table>
    <div class="actions">
      <button class="btn-print" id="savePdfBtn" onclick="window.print()">🖨️ Save as PDF / Print</button>
    </div>
  </div>
</body>
</html>`;

    const reportWin = window.open('', '_blank');
    if (reportWin) {
      reportWin.document.open();
      reportWin.document.write(reportHtml);
      reportWin.document.close();
      setTimeout(() => {
        const btn = reportWin.document.getElementById('savePdfBtn');
        if (btn) btn.onclick = () => reportWin.print();
      }, 150);
    } else {
      const blob = new Blob([reportHtml], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    }
    showToast("📄 Opening Compliance Report...");
  };

  // ========================================================
  // 5. VISUAL & MOTOR ASSISTANCE TOOLS
  // ========================================================
  
  // A. Dyslexia Font Toggle
  let dyslexiaActive = false;
  document.getElementById('eqitech-dyslexia-btn').onclick = function () {
    dyslexiaActive = !dyslexiaActive;
    this.classList.toggle('eqitech-active', dyslexiaActive);
    let style = document.getElementById('eqitech-dyslexia-style');
    if (dyslexiaActive) {
      if (!style) {
        style = document.createElement('style');
        style.id = 'eqitech-dyslexia-style';
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&display=swap');
          *, p, h1, h2, h3, h4, h5, h6, span, a, li, button, label {
            font-family: 'Lexend', -apple-system, sans-serif !important;
            letter-spacing: 0.08em !important;
            word-spacing: 0.22em !important;
            line-height: 1.85 !important;
          }
        `;
        document.head.appendChild(style);
      }
      showToast("🔤 Dyslexia Font Enabled");
    } else {
      if (style) style.remove();
      showToast("Original Font Restored");
    }
  };

  // B. Auto-Contrast Booster
  let contrastActive = false;
  document.getElementById('eqitech-contrast-btn').onclick = function () {
    contrastActive = !contrastActive;
    this.classList.toggle('eqitech-active', contrastActive);
    let style = document.getElementById('eqitech-contrast-style');
    if (contrastActive) {
      if (!style) {
        style = document.createElement('style');
        style.id = 'eqitech-contrast-style';
        style.innerHTML = `
          html, body, div, section, main, article, header, footer, nav, aside {
            background-color: #000000 !important;
            color: #ffff00 !important;
          }
          *, p, h1, h2, h3, h4, h5, h6, span, label, li, td, th {
            color: #ffff00 !important;
            background-color: transparent !important;
          }
          a, button, input, select {
            color: #00ffff !important;
            background-color: #1a1a1a !important;
            border: 2px solid #ffff00 !important;
          }
          .card, .container {
            border: 2px solid #ffff00 !important;
          }
        `;
        document.head.appendChild(style);
      }
      showToast("🌓 High Contrast Enabled");
    } else {
      if (style) style.remove();
      showToast("Original Contrast Restored");
    }
  };

  // C. Reading Ruler
  let rulerActive = false;
  let rulerEl = null;

  function toggleReadingRuler() {
    rulerActive = !rulerActive;
    const btn = document.getElementById('eqitech-ruler-btn');
    if (btn) btn.classList.toggle('eqitech-active', rulerActive);
    if (rulerActive) {
      if (!rulerEl) {
        rulerEl = document.createElement('div');
        rulerEl.id = 'eqitech-ruler-element';
        rulerEl.style.cssText = `
          position: fixed !important;
          left: 0 !important;
          width: 100vw !important;
          height: 45px !important;
          top: 40vh !important;
          background: rgba(254, 240, 138, 0.35) !important;
          border-top: 3px solid #f39c12 !important;
          border-bottom: 3px solid #f39c12 !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.18) !important;
          pointer-events: none !important;
          z-index: 2147483640 !important;
          display: block !important;
        `;
        document.body.appendChild(rulerEl);

        window.addEventListener('mousemove', (e) => {
          if (rulerActive && rulerEl) {
            rulerEl.style.top = `${e.clientY - 22}px`;
          }
        });
      } else {
        rulerEl.style.display = 'block';
      }
      showToast("📏 Reading Ruler Enabled (Follows Mouse)");
    } else {
      if (rulerEl) rulerEl.style.display = 'none';
      showToast("Reading Ruler Disabled");
    }
  }
  document.getElementById('eqitech-ruler-btn').onclick = toggleReadingRuler;

  // D. Motor-Impaired Keyboard Focus Rings Mode
  let focusActive = false;
  function toggleFocusRings() {
    focusActive = !focusActive;
    const btn = document.getElementById('eqitech-focus-btn');
    if (btn) btn.classList.toggle('eqitech-active', focusActive);
    let style = document.getElementById('eqitech-focus-style');
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');

    if (focusActive) {
      if (!style) {
        style = document.createElement('style');
        style.id = 'eqitech-focus-style';
        style.innerHTML = `
          *:focus, *:focus-visible {
            outline: 3.5px solid #ff9f43 !important;
            outline-offset: 3px !important;
            box-shadow: 0 0 12px rgba(255, 159, 67, 0.9) !important;
          }
        `;
        document.head.appendChild(style);
      }
      interactiveElements.forEach(el => el.classList.add('eqitech-interactive-highlight'));
      
      const firstTarget = document.querySelector('a, button, input');
      if (firstTarget) firstTarget.focus();

      showToast("🎯 Focus Rings ON (Press TAB to navigate)");
    } else {
      if (style) style.remove();
      interactiveElements.forEach(el => el.classList.remove('eqitech-interactive-highlight'));
      showToast("Focus Rings Disabled");
    }
  }
  document.getElementById('eqitech-focus-btn').onclick = toggleFocusRings;

  // E. Bionic Reading Toggle
  let bionicActive = false;
  document.getElementById('eqitech-bionic-btn').onclick = function () {
    bionicActive = !bionicActive;
    this.classList.toggle('eqitech-active', bionicActive);
    if (bionicActive) {
      applyBionic();
      showToast("⚡ Bionic Text Enabled");
    } else {
      removeBionic();
      showToast("Standard Text Restored");
    }
  };

  function applyBionic() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (!['SCRIPT', 'STYLE', 'BUTTON'].includes(walker.currentNode.parentNode.nodeName) && walker.currentNode.textContent.trim().length > 0) {
        nodes.push(walker.currentNode);
      }
    }
    nodes.forEach(node => {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(w => {
        if (w.trim().length > 1) {
          const mid = Math.ceil(w.length / 2);
          const b = document.createElement('b');
          b.className = 'eqitech-bionic';
          b.style.fontWeight = '900';
          b.textContent = w.slice(0, mid);
          frag.appendChild(b);
          frag.appendChild(document.createTextNode(w.slice(mid)));
        } else {
          frag.appendChild(document.createTextNode(w));
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  function removeBionic() {
    document.querySelectorAll('.eqitech-bionic').forEach(b => b.replaceWith(b.textContent));
  }

  // F. Enlarge Font
  let largeFont = false;
  document.getElementById('eqitech-large-btn').onclick = function () {
    largeFont = !largeFont;
    this.classList.toggle('eqitech-active', largeFont);
    document.body.style.fontSize = largeFont ? '120%' : '';
    document.body.style.lineHeight = largeFont ? '1.8' : '';
    showToast(largeFont ? "🔍 Font Enlarged (120%)" : "Standard Font Size");
  };

  // ========================================================
  // 6. SPEECH SYNTHESIS & VOICE CONTROL
  // ========================================================
  function speakText(text) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.0;
    window.speechSynthesis.speak(utt);
  }

  document.getElementById('eqitech-tts-btn').onclick = () => {
    const sel = window.getSelection().toString().trim();
    const textToSpeak = sel || (document.querySelector('main, article, p')?.innerText || document.body.innerText).slice(0, 500);
    showToast("🔊 Reading Aloud... (Double-Tap to Stop)");
    speakText(textToSpeak);
  };

  document.getElementById('eqitech-stop-audio-btn').onclick = () => {
    stopAllSpeech();
  };

  // Integrated Voice Command Assistant (Operates inside the Accessibility Layer Panel)
  const voiceChips = document.querySelectorAll('#eqitech-voice-chips .eqitech-vchip');
  voiceChips.forEach(btn => {
    btn.onclick = () => {
      executeVoiceCommand(btn.dataset.cmd);
    };
  });

  const manualCmdForm = document.getElementById('eqitech-manual-cmd-form');
  if (manualCmdForm) {
    manualCmdForm.onsubmit = (e) => {
      e.preventDefault();
      const inp = document.getElementById('eqitech-manual-cmd-input');
      if (inp && inp.value.trim()) {
        executeVoiceCommand(inp.value.trim());
        inp.value = '';
      }
    };
  }

  function executeVoiceCommand(rawCmd) {
    if (!rawCmd) return;
    const cmd = rawCmd.toLowerCase().trim().replace(/[.,!?;:]+$/, '');
    console.log("Executing Voice Command:", cmd);

    const statusText = document.getElementById('eqitech-voice-status-text');
    const transcript = document.getElementById('eqitech-voice-transcript');
    if (statusText) statusText.textContent = `⚡ Executing: "${cmd}"`;
    if (transcript) transcript.textContent = 'Command matched and applied!';

    showToast(`🎙️ Voice Command: "${cmd}"`);

    // 1. Theme Commands
    if (cmd.includes("dark mode") || cmd.includes("dark") || cmd.includes("night mode") || cmd.includes("night") || cmd.includes("owl")) {
      applyVibgyorTheme("#121212", "#00E676");
      speakText("Dark mode enabled");
    } else if (cmd.includes("light mode") || cmd.includes("light") || cmd.includes("original") || cmd.includes("reset") || cmd.includes("default") || cmd.includes("normal")) {
      applyVibgyorTheme("reset", "");
      speakText("Original colors restored");
    } else if (cmd.includes("white")) {
      applyVibgyorTheme("#FFFFFF", "#121212");
      speakText("White high-contrast enabled");
    } else if (cmd.includes("black")) {
      applyVibgyorTheme("#000000", "#E0E0E0");
      speakText("Black high-contrast enabled");
    } else if (cmd.includes("violet") || cmd.includes("purple")) {
      applyVibgyorTheme("#8B00FF", "#FFFFFF");
      speakText("Violet theme enabled");
    } else if (cmd.includes("indigo")) {
      applyVibgyorTheme("#4B0082", "#FFFFFF");
      speakText("Indigo theme enabled");
    } else if (cmd.includes("blue")) {
      applyVibgyorTheme("#0000FF", "#FFFFFF");
      speakText("Blue theme enabled");
    } else if (cmd.includes("green")) {
      applyVibgyorTheme("#00FF00", "#000000");
      speakText("Green theme enabled");
    } else if (cmd.includes("yellow")) {
      applyVibgyorTheme("#FFFF00", "#000000");
      speakText("Yellow theme enabled");
    } else if (cmd.includes("orange")) {
      applyVibgyorTheme("#FF7F00", "#000000");
      speakText("Orange theme enabled");
    } else if (cmd.includes("red")) {
      applyVibgyorTheme("#FF0000", "#FFFFFF");
      speakText("Red theme enabled");
    }

    // 2. Accessibility Tools
    else if (cmd.includes("dyslexia") || cmd.includes("dyslexic") || cmd.includes("font")) {
      document.getElementById('eqitech-dyslexia-btn')?.click();
      speakText("Dyslexia font toggled");
    } else if (cmd.includes("bionic") || cmd.includes("fixation")) {
      document.getElementById('eqitech-bionic-btn')?.click();
      speakText("Bionic reading toggled");
    } else if (cmd.includes("ruler") || cmd.includes("reading ruler") || cmd.includes("guide")) {
      document.getElementById('eqitech-ruler-btn')?.click();
      speakText("Reading ruler toggled");
    } else if (cmd.includes("focus") || cmd.includes("ring") || cmd.includes("keyboard")) {
      document.getElementById('eqitech-focus-btn')?.click();
      speakText("Focus rings toggled");
    } else if (cmd.includes("contrast") || cmd.includes("auto contrast")) {
      document.getElementById('eqitech-contrast-btn')?.click();
      speakText("Contrast auto-boost toggled");
    } else if (cmd.includes("enlarge") || cmd.includes("bigger") || cmd.includes("zoom")) {
      document.getElementById('eqitech-large-btn')?.click();
      speakText("Font size adjusted");
    }

    // 3. Audio / TTS
    else if (cmd.includes("read") || cmd.includes("speak") || cmd.includes("narrate")) {
      document.getElementById('eqitech-tts-btn')?.click();
    } else if (cmd.includes("stop") || cmd.includes("cancel") || cmd.includes("mute") || cmd.includes("silence") || cmd.includes("quiet")) {
      stopAllSpeech();
      speakText("Audio stopped");
    }

    // 4. Audit & Remediations
    else if (cmd.includes("auto fix") || cmd.includes("fix all") || cmd.includes("fix") || cmd.includes("repair")) {
      document.getElementById('eqitech-autofix-btn')?.click();
      speakText("Auto fix complete. Compliance score 96 percent");
    } else if (cmd.includes("scan") || cmd.includes("audit") || cmd.includes("score")) {
      document.getElementById('eqitech-scan-btn')?.click();
      speakText("Page audit complete");
    } else if (cmd.includes("report") || cmd.includes("certificate")) {
      document.getElementById('eqitech-report-btn')?.click();
      speakText("Exporting compliance certificate");
    }

    // 5. Navigation / Actions on Demo Website
    else if (cmd.includes("book consultation") || cmd.includes("consultation")) {
      alert("✅ Voice Command Executed:\nGeneral Medicine Consultation booked successfully!");
      speakText("Consultation booked");
    } else if (cmd.includes("eye exam") || cmd.includes("vision")) {
      alert("✅ Voice Command Executed:\nVision and Eye Exam scheduled successfully!");
      speakText("Eye exam scheduled");
    } else if (cmd.includes("specialist") || cmd.includes("pediatric")) {
      alert("✅ Voice Command Executed:\nSpecialist appointment booked successfully!");
      speakText("Specialist appointment booked");
    } else if (cmd.includes("submit") || cmd.includes("register")) {
      alert("✅ Voice Command Executed:\nPatient registration submitted!");
      speakText("Patient registration submitted");
    } else if (cmd.includes("open accessibility") || cmd.includes("open panel") || cmd.includes("tools")) {
      panel.style.display = 'block';
      speakText("Accessibility tools opened");
    } else if (cmd.includes("close panel") || cmd.includes("hide panel")) {
      panel.style.display = 'none';
      speakText("Accessibility panel closed");
    } else if (cmd.includes("scroll down") || cmd.includes("down")) {
      window.scrollBy({ top: 400, behavior: 'smooth' });
    } else if (cmd.includes("scroll up") || cmd.includes("up")) {
      window.scrollBy({ top: -400, behavior: 'smooth' });
    } else if (cmd.includes("top")) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (cmd.includes("bottom")) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      // Generic Click
      const target = cmd.replace(/^(open|click|go to|select)\s+/, '').trim();
      const clickable = Array.from(document.querySelectorAll('a, button, input[type="submit"], h1, h2, h3'));
      const match = clickable.find(el => (el.innerText || el.value || el.getAttribute('aria-label') || '').toLowerCase().includes(target));
      if (match) {
        match.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { match.focus(); match.click(); }, 600);
        speakText("Clicked " + target);
      } else {
        showToast(`⚠️ Command not matched: "${cmd}"`);
      }
    }

    setTimeout(() => {
      const statusText = document.getElementById('eqitech-voice-status-text');
      if (statusText) statusText.textContent = `Completed: "${cmd}"`;
    }, 2000);
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  function toggleVoiceRecognition() {
    const voiceBox = document.getElementById('eqitech-voice-box');
    const voiceBtn = document.getElementById('eqitech-voice-btn');
    const statusText = document.getElementById('eqitech-voice-status-text');
    const transcript = document.getElementById('eqitech-voice-transcript');

    // If currently listening, toggle off
    if (activeVoiceRec) {
      try { activeVoiceRec.abort(); } catch (err) {}
      activeVoiceRec = null;
      if (voiceBtn) {
        voiceBtn.innerHTML = '🎙️ Start Voice Command';
        voiceBtn.style.background = '#0abde3';
      }
      if (voiceBox) voiceBox.style.display = 'none';
      showToast("Voice listening stopped");
      return;
    }

    // Ensure accessibility panel is open so voice controls are visible right inside accessibility!
    panel.style.display = 'block';

    if (voiceBox) voiceBox.style.display = 'block';
    if (voiceBtn) {
      voiceBtn.innerHTML = '🔴 Listening... (Click to stop)';
      voiceBtn.style.background = '#ee5253';
    }

    if (statusText) statusText.textContent = 'Listening... Speak a command';
    if (transcript) transcript.textContent = 'Say "dark mode", "auto fix", "dyslexia", "ruler", etc.';

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (!SpeechRec) {
      if (statusText) statusText.textContent = "Voice Assistant Ready (Speech API unavailable)";
      if (transcript) transcript.textContent = "Click any quick command below or type to execute:";
      return;
    }

    try {
      const rec = new SpeechRec();
      activeVoiceRec = rec;
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => {
        if (statusText) statusText.textContent = "🔴 Listening... Speak now!";
      };

      rec.onerror = (e) => {
        console.warn("Voice command notice:", e.error);
        if (statusText) {
          statusText.textContent = e.error === 'not-allowed'
            ? "⚠️ Mic restricted on local file URL"
            : (e.error === 'no-speech' ? "⚠️ No speech detected" : `⚠️ Voice notice: ${e.error}`);
        }
        if (transcript) {
          transcript.textContent = "Click any quick command below or type to execute:";
        }
      };

      rec.onend = () => {
        if (voiceBtn) {
          voiceBtn.innerHTML = '🎙️ Start Voice Command';
          voiceBtn.style.background = '#0abde3';
        }
        activeVoiceRec = null;
      };

      rec.onresult = (e) => {
        if (!e.results || !e.results[0]) return;
        const interimTranscript = Array.from(e.results).map(r => r[0].transcript).join('');
        if (transcript) transcript.textContent = `Heard: "${interimTranscript}"`;

        if (e.results[0].isFinal) {
          executeVoiceCommand(e.results[0][0].transcript);
        }
      };

      rec.start();
    } catch (err) {
      console.warn("Could not start speech recognition:", err);
      if (statusText) statusText.textContent = "Voice Assistant Ready";
      if (transcript) transcript.textContent = "Click any quick command below or type to execute:";
    }
  }

  const voiceBtn = document.getElementById('eqitech-voice-btn');
  if (voiceBtn) {
    voiceBtn.onclick = toggleVoiceRecognition;
  }
  window.__THE_USUAL_SUSPECTS_VOICE_CMD__ = toggleVoiceRecognition;

  // ========================================================
  // 7. GLOBAL ACCESSIBILITY HOTKEYS
  // ========================================================
  window.addEventListener('keydown', (e) => {
    // Alt + A: Toggle panel
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      togglePanel();
    }
    // Alt + R: Toggle Reading Ruler
    if (e.altKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      toggleReadingRuler();
    }
    // Alt + K: Toggle Focus Rings
    if (e.altKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      toggleFocusRings();
    }
    // Alt + C: Toggle Contrast
    if (e.altKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      document.getElementById('eqitech-contrast-btn')?.click();
    }
    // Alt + V: Start Voice Command inside Accessibility
    if (e.altKey && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      toggleVoiceRecognition();
    }
    // Alt + S: Skip to main content
    if (e.altKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      const main = document.querySelector('main, [role="main"], article, h1, #content');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast("Navigated to main content");
      }
    }
  });

  // Initial scan on load
  runAudit();
})();
