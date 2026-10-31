// --- 0. EXTENSION COMPANION IDENTIFIER ---
try {
  document.documentElement.dataset.theUsualSuspectsExtension = "active";
  document.documentElement.dataset.eqitechExtension = "active";
  document.documentElement.setAttribute('data-extension-version', '2.1');
  window.dispatchEvent(new CustomEvent('the-usual-suspects-extension-ready', { detail: { version: '2.1' } }));
  window.dispatchEvent(new CustomEvent('eqitech-extension-ready', { detail: { version: '2.1' } }));
} catch (e) { }

// --- 1. FEATURE: SELECT TEXT TO SPEAK (AUDIO) ---
let floatingAudioBtn = null;

function createFloatingButton() {
  if (floatingAudioBtn) return;
  floatingAudioBtn = document.createElement('button');
  floatingAudioBtn.innerText = '🔊 Read';
  floatingAudioBtn.style.position = 'absolute';
  floatingAudioBtn.style.zIndex = '999999';
  floatingAudioBtn.style.backgroundColor = '#ff9f43';
  floatingAudioBtn.style.color = '#fff';
  floatingAudioBtn.style.border = 'none';
  floatingAudioBtn.style.padding = '6px 10px';
  floatingAudioBtn.style.borderRadius = '20px';
  floatingAudioBtn.style.cursor = 'pointer';
  floatingAudioBtn.style.fontSize = '12px';
  floatingAudioBtn.style.fontWeight = 'bold';
  floatingAudioBtn.style.boxShadow = '0px 2px 8px rgba(0,0,0,0.3)';
  floatingAudioBtn.style.display = 'none';

  floatingAudioBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      speakText(selectedText);
    }
  });

  document.body.appendChild(floatingAudioBtn);
}

document.addEventListener('mouseup', (e) => {
  createFloatingButton();
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText.length > 0 && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).getBoundingClientRect();
    const topOffset = (range.top < 45)
      ? (window.scrollY + range.bottom + 6)
      : (window.scrollY + range.top - 35);
    const leftOffset = Math.max(10, window.scrollX + range.left);

    floatingAudioBtn.style.top = `${topOffset}px`;
    floatingAudioBtn.style.left = `${leftOffset}px`;
    floatingAudioBtn.style.display = 'block';
  } else {
    if (floatingAudioBtn) floatingAudioBtn.style.display = 'none';
  }
});

function speakText(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

function showExtensionToast(msg) {
  let toast = document.getElementById('a11y-floating-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'a11y-floating-toast';
    toast.style.cssText = `
      position: fixed !important;
      top: 24px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: rgba(33, 37, 41, 0.95) !important;
      color: #ffffff !important;
      padding: 9px 20px !important;
      border-radius: 24px !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      z-index: 2147483647 !important;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
      pointer-events: none !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      transition: opacity 0.25s !important;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.display = 'block';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 250);
  }, 1800);
}

function stopAudioAnywhere() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    showExtensionToast("🔇 Audio Stopped (Double Tap)");
  }
}

// Double click anywhere to stop audio immediately
document.addEventListener('dblclick', () => {
  stopAudioAnywhere();
});

// Mobile/touch double-tap anywhere to stop audio
let lastTouchMs = 0;
document.addEventListener('touchend', () => {
  const now = Date.now();
  if (now - lastTouchMs < 350 && now - lastTouchMs > 40) {
    stopAudioAnywhere();
  }
  lastTouchMs = now;
});

// --- 2. FEATURE: VOICE COMMANDS (SPEECH RECOGNITION) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeContentVoiceRec = null;

function startVoiceRecognition() {
  if (!SpeechRecognition) {
    showExtensionToast("⚠️ Speech Recognition is not supported in this browser.");
    alert("Speech Recognition is not supported in this browser.\nPlease use Google Chrome or Microsoft Edge.");
    return;
  }

  if (activeContentVoiceRec) {
    try { activeContentVoiceRec.abort(); } catch (e) { }
    activeContentVoiceRec = null;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  showExtensionToast("🎙️ Listening... (Say 'ruler', 'focus', 'contrast', 'read', or 'click [name]')");

  const recognition = new SpeechRecognition();
  activeContentVoiceRec = recognition;
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    if (!event.results || !event.results[0]) return;
    const command = event.results[0][0].transcript.toLowerCase().trim();
    console.log("Voice Command Received:", command);
    showExtensionToast(`🎙️ Heard: "${command}"`);
    executeVoiceCommand(command);
  };

  recognition.onerror = (err) => {
    console.warn("Speech Recognition Error:", err.error);
    activeContentVoiceRec = null;
    if (err.error === 'not-allowed') {
      showExtensionToast("⚠️ Microphone access denied in browser.");
    } else if (err.error === 'no-speech') {
      showExtensionToast("⚠️ No speech detected. Click again and speak.");
    } else {
      showExtensionToast(`⚠️ Voice error: ${err.error}`);
    }
  };

  recognition.onend = () => {
    activeContentVoiceRec = null;
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn("Voice recognition start error:", err);
    activeContentVoiceRec = null;
  }
}

function executeVoiceCommand(command) {
  if (command.includes("ruler") || command.includes("reading ruler")) {
    toggleReadingRuler();
  } else if (command.includes("focus") || command.includes("ring")) {
    toggleKeyboardNavMode();
  } else if (command.includes("contrast")) {
    fixPageContrast();
  } else if (command.includes("read") || command.includes("speak")) {
    const sel = window.getSelection().toString().trim();
    const text = sel || (document.querySelector('main, article, p')?.innerText || document.body.innerText).slice(0, 500);
    speakText(text);
  } else if (command.includes("stop") || command.includes("mute") || command.includes("quiet")) {
    stopAudioAnywhere();
  } else if (command.includes("scroll down")) {
    window.scrollBy({ top: 400, behavior: 'smooth' });
    showExtensionToast("📜 Scrolled Down");
  } else if (command.includes("scroll up")) {
    window.scrollBy({ top: -400, behavior: 'smooth' });
    showExtensionToast("📜 Scrolled Up");
  } else if (command.includes("top")) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showExtensionToast("⬆️ Top of Page");
  } else if (command.includes("bottom")) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    showExtensionToast("⬇️ Bottom of Page");
  } else {
    const targetQuery = command.replace(/^(open|click|go to|select)\s+/, '').trim();
    const elements = document.querySelectorAll('a, button, input[type="submit"], input[type="button"], h1, h2, h3');
    let matchedElement = null;

    for (let el of elements) {
      const elText = (el.innerText || el.value || el.getAttribute('aria-label') || '').toLowerCase().trim();
      if (elText && elText.includes(targetQuery)) {
        matchedElement = el;
        break;
      }
    }

    if (matchedElement) {
      showExtensionToast(`🖱️ Opening ${targetQuery}`);
      matchedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        matchedElement.focus();
        matchedElement.click();
      }, 800);
    } else {
      showExtensionToast(`⚠️ Could not find "${targetQuery}"`);
    }
  }
}

// --- 3. FEATURE: READING RULER (ADHD & DYSLEXIA FOCUS GUIDE) ---
// Why: Prevents eye wandering and jumping between lines when reading paragraphs
let readingRulerEl = null;
let readingRulerActive = false;

function toggleReadingRuler() {
  readingRulerActive = !readingRulerActive;
  if (readingRulerActive) {
    if (!readingRulerEl) {
      readingRulerEl = document.createElement('div');
      readingRulerEl.id = 'a11y-reading-ruler';
      readingRulerEl.style.cssText = `
        position: fixed !important;
        left: 0 !important;
        width: 100vw !important;
        height: 42px !important;
        top: 40vh !important;
        background: rgba(254, 240, 138, 0.35) !important;
        border-top: 3px solid #f39c12 !important;
        border-bottom: 3px solid #f39c12 !important;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.18) !important;
        pointer-events: none !important;
        z-index: 2147483640 !important;
        display: block !important;
        transition: top 0.04s ease-out !important;
      `;
      document.body.appendChild(readingRulerEl);

      window.addEventListener('mousemove', (e) => {
        if (readingRulerActive && readingRulerEl) {
          readingRulerEl.style.top = `${e.clientY - 21}px`;
        }
      });
    } else {
      readingRulerEl.style.top = '40vh';
      readingRulerEl.style.display = 'block';
    }
    showExtensionToast(" Reading Ruler Enabled");
  } else {
    if (readingRulerEl) readingRulerEl.style.display = 'none';
    showExtensionToast("Reading Ruler Disabled");
  }
}

// --- 4. FEATURE: MOTOR-IMPAIRED KEYBOARD NAVIGATION MODE ---
let keyboardNavActive = false;

function toggleKeyboardNavMode() {
  keyboardNavActive = !keyboardNavActive;
  const STYLE_ID = 'a11y-keyboard-nav-style';
  let existing = document.getElementById(STYLE_ID);
  const interactive = document.querySelectorAll('a, button, input, select, textarea');

  if (existing) {
    existing.remove();
    const skipLink = document.getElementById('a11y-skip-link');
    if (skipLink) skipLink.remove();
    interactive.forEach(el => {
      el.style.removeProperty('outline');
      el.style.removeProperty('outline-offset');
    });
    showExtensionToast("Focus rings disabled");
    return;
  }

  // Inject high-visibility focus ring
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.innerHTML = `
    *:focus, *:focus-visible {
      outline: 3.5px solid #ff9f43 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 12px rgba(255, 159, 67, 0.9) !important;
    }
  `;
  document.head.appendChild(style);

  // Immediately outline interactive elements so user sees the change
  interactive.forEach(el => {
    el.style.setProperty('outline', '2.5px dashed #ff9f43', 'important');
    el.style.setProperty('outline-offset', '2px', 'important');
  });

  // Add Skip to Content link for motor-impaired keyboard navigation
  if (!document.getElementById('a11y-skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'a11y-skip-link';
    skipLink.href = '#';
    skipLink.innerText = '⏭️ Skip to Main Content (Press Enter)';
    skipLink.style.cssText = `
      position: fixed !important;
      top: 10px !important;
      left: 10px !important;
      z-index: 10000000 !important;
      background: #10ac84 !important;
      color: #ffffff !important;
      padding: 10px 16px !important;
      font-weight: bold !important;
      border-radius: 6px !important;
      text-decoration: none !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    `;
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.querySelector('main, [role="main"], article, h1, #content, .content');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showExtensionToast("Navigated to main content");
      }
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    skipLink.focus();
  }

  showExtensionToast(" Focus Rings ON (Press TAB to navigate)");
}

// --- 5. FEATURE: AUTOMATIC CONTRAST AUTO-REPAIR (WCAG 1.4.3) ---
let contrastBoostActive = false;
function fixPageContrast() {
  contrastBoostActive = !contrastBoostActive;
  const STYLE_ID = 'a11y-high-contrast-boost-style';
  let existing = document.getElementById(STYLE_ID);

  if (existing) {
    existing.remove();
    showExtensionToast("Original Contrast Restored");
    return 0;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
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
  showExtensionToast(" High Contrast Enabled");
  return document.querySelectorAll('p, span, h1, h2, h3, a, button').length;
}

function getEffectiveBgColor(el) {
  let cur = el;
  while (cur && cur !== document) {
    const bg = window.getComputedStyle(cur).backgroundColor;
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      return bg;
    }
    cur = cur.parentElement;
  }
  return 'rgb(255, 255, 255)';
}

function parseRgb(colorStr) {
  const match = colorStr.match(/\d+/g);
  if (match && match.length >= 3) {
    return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
  }
  return [0, 0, 0];
}

function getLuminance(colorStr) {
  const [r, g, b] = parseRgb(colorStr).map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function calculateContrastRatio(c1, c2) {
  const l1 = getLuminance(c1);
  const l2 = getLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// --- 6. FEATURE: GLOBAL ACCESSIBILITY HOTKEYS ---
window.addEventListener('keydown', (e) => {
  // Alt + A: Read selected text or active element
  if (e.altKey && (e.key === 'a' || e.key === 'A')) {
    e.preventDefault();
    const sel = window.getSelection().toString().trim();
    if (sel) {
      speakText(sel);
    } else {
      const activeText = document.activeElement ? (document.activeElement.innerText || document.activeElement.getAttribute('aria-label') || document.title) : document.title;
      speakText(`Active item: ${activeText}`);
    }
  }

  // Alt + R: Toggle Reading Ruler
  if (e.altKey && (e.key === 'r' || e.key === 'R')) {
    e.preventDefault();
    toggleReadingRuler();
  }

  // Alt + K: Toggle High-Visibility Keyboard Navigation
  if (e.altKey && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    toggleKeyboardNavMode();
  }

  // Alt + C: Auto-Boost Contrast
  if (e.altKey && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
    fixPageContrast();
  }

  // Alt + V: Start Voice Recognition
  if (e.altKey && (e.key === 'v' || e.key === 'V')) {
    e.preventDefault();
    startVoiceRecognition();
  }
});

// --- 7. LISTEN FOR MESSAGES FROM POPUP ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_VOICE_COMMAND") {
    startVoiceRecognition();
  } else if (request.action === "STOP_AUDIO") {
    window.speechSynthesis.cancel();
  } else if (request.action === "TOGGLE_READING_RULER") {
    toggleReadingRuler();
    sendResponse({ active: readingRulerActive });
  } else if (request.action === "TOGGLE_KEYBOARD_NAV") {
    toggleKeyboardNavMode();
    sendResponse({ active: keyboardNavActive });
  } else if (request.action === "FIX_CONTRAST") {
    const fixed = fixPageContrast();
    sendResponse({ fixedCount: fixed });
  }
});

// ========================================================
// 8. FEATURE: ACCESSIBLE AUDIO IMAGE EXPLAINER FOR BLIND USERS
// Whenever a picture is clicked, opened, or focused, audio explanation starts automatically
// ========================================================
function getImageDescription(img) {
  if (img.dataset.description && img.dataset.description.trim()) {
    return img.dataset.description.trim();
  }
  if (img.alt && img.alt.trim() && img.alt.trim().length > 3) {
    return img.alt.trim();
  }
  if (img.getAttribute('aria-label') && img.getAttribute('aria-label').trim()) {
    return img.getAttribute('aria-label').trim();
  }
  if (img.title && img.title.trim()) {
    return img.title.trim();
  }
  const figcaption = img.closest('figure')?.querySelector('figcaption');
  if (figcaption && figcaption.innerText.trim()) {
    return figcaption.innerText.trim();
  }
  const parentCard = img.closest('.card, article, section, div');
  const heading = parentCard?.querySelector('h1, h2, h3, h4')?.innerText?.trim();
  if (heading) {
    return `Visual depiction illustrating ${heading}`;
  }
  if (img.src) {
    try {
      const url = new URL(img.src);
      const name = url.pathname.split('/').pop().split('.')[0].replace(/[-_]+/g, ' ').trim();
      if (name && name.length > 2 && !/^\d+$/.test(name)) {
        return `Image showing ${name}`;
      }
    } catch (e) { }
  }
  return "Photograph illustrating website content";
}

let imageExplainerModal = null;

function openImageAudioExplainer(img) {
  const desc = getImageDescription(img);
  const src = img.src || '';

  if (!imageExplainerModal) {
    imageExplainerModal = document.createElement('div');
    imageExplainerModal.id = 'a11y-image-explainer-modal';
    imageExplainerModal.style.cssText = `
      position: fixed !important;
      inset: 0 !important;
      background: rgba(15, 23, 42, 0.90) !important;
      z-index: 2147483646 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 20px !important;
      box-sizing: border-box !important;
      backdrop-filter: blur(5px) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    `;
    document.body.appendChild(imageExplainerModal);
  }

  imageExplainerModal.innerHTML = `
    <div style="max-width: 620px; width: 100%; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 2.5px solid #10ac84;">
      <div style="background: #0f172a; color: #ffffff; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🖼️ 🔊</span>
          <div>
            <strong style="font-size: 13.5px; color: #38bdf8; display: block;">Audio Image Explainer</strong>
            <span style="font-size: 11px; color: #94a3b8;">Assistive Narration for Blind & Visually Impaired</span>
          </div>
        </div>
        <button id="a11y-close-img-modal" aria-label="Close image description" style="background: #334155; border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 15px; font-weight: bold;">✕</button>
      </div>

      <div style="background: #000000; text-align: center; padding: 14px; max-height: 44vh; display: flex; align-items: center; justify-content: center;">
        <img src="${src}" alt="${desc}" style="max-height: 40vh; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.6);">
      </div>

      <div style="padding: 18px 22px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="display: inline-block; width: 10px; height: 10px; background: #10ac84; border-radius: 50%; box-shadow: 0 0 8px #10ac84;"></span>
          <span style="font-size: 11px; font-weight: 800; color: #10ac84; text-transform: uppercase; letter-spacing: 0.5px;">Speaking Image Description</span>
        </div>
        <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin: 0 0 12px 0; line-height: 1.55;">${desc}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11.5px; color: #64748b; flex-wrap: wrap; gap: 8px;">
          <span>💡 <strong>Double-click anywhere</strong> to stop audio immediately.</span>
          <button id="a11y-replay-audio-btn" style="background: #0284c7; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 12px;">🔊 Replay Audio</button>
        </div>
      </div>
    </div>
  `;

  imageExplainerModal.style.display = 'flex';

  function closeModal() {
    if (imageExplainerModal) imageExplainerModal.style.display = 'none';
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  const closeBtn = imageExplainerModal.querySelector('#a11y-close-img-modal');
  if (closeBtn) closeBtn.onclick = closeModal;

  imageExplainerModal.onclick = (e) => {
    if (e.target === imageExplainerModal) closeModal();
  };

  const playNarration = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const narrationText = `Image explanation. ${desc}. Double-click anywhere to stop audio.`;
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      showExtensionToast(`🔊 Describing: "${desc.slice(0, 40)}..."`);
    }
  };

  const replayBtn = imageExplainerModal.querySelector('#a11y-replay-audio-btn');
  if (replayBtn) replayBtn.onclick = playNarration;

  playNarration();
}

function setupImageExplainerListeners() {
  document.querySelectorAll('img').forEach(img => {
    if (img.dataset.a11yExplainerBound === 'true') return;
    img.dataset.a11yExplainerBound = 'true';

    if (!img.getAttribute('role')) img.setAttribute('role', 'button');
    if (!img.getAttribute('tabindex')) img.setAttribute('tabindex', '0');
    img.style.cursor = 'pointer';

    const desc = getImageDescription(img);
    if (!img.getAttribute('aria-label')) {
      img.setAttribute('aria-label', `${desc}. Click or press Enter to listen to audio description`);
    }

    img.addEventListener('click', () => {
      openImageAudioExplainer(img);
    });

    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openImageAudioExplainer(img);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupImageExplainerListeners);
} else {
  setupImageExplainerListeners();
}
const imgObserver = new MutationObserver(() => setupImageExplainerListeners());
imgObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageExplainerModal && imageExplainerModal.style.display !== 'none') {
    imageExplainerModal.style.display = 'none';
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
});
