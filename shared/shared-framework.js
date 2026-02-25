/* Shared Framework - Common UI and Auth functionality */

// Initialize site from config
function initializeSiteFramework() {
  // Apply clan-specific colors to CSS variables
  applyTheme();
  
  // Set up navigation
  buildNavigation();
  
  // Set up auth
  setupAuth();
  
  // Set up hamburger menu
  setupHamburgerMenu();
}

// Apply theme colors from SITE_CONFIG
function applyTheme() {
  if (!window.SITE_CONFIG) return;
  
  const root = document.documentElement;
  
  if (SITE_CONFIG.primaryColor) {
    root.style.setProperty('--primary-color', SITE_CONFIG.primaryColor);
  }
  if (SITE_CONFIG.secondaryColor) {
    root.style.setProperty('--secondary-color', SITE_CONFIG.secondaryColor);
  }
  
  // Apply to specific elements
  const style = document.createElement('style');
  const css = `
    :root {
      --primary-color: ${SITE_CONFIG.primaryColor || '#ffb300'};
      --secondary-color: ${SITE_CONFIG.secondaryColor || '#232526'};
    }
    .nav-brand, h1, h3, label, .tab.active, .tab:hover, .stat-card h3, 
    .stat-card .value, .btn, th, th.sortable:hover, .tab-btn.active {
      color: var(--primary-color);
    }
    .tab-btn.active {
      border-bottom-color: var(--primary-color);
    }
    .btn {
      background: var(--primary-color);
      color: var(--secondary-color);
    }
    .btn:hover {
      filter: brightness(1.1);
    }
    input:focus, select:focus, textarea:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(255,179,0,0.15);
    }
    .tab-btn:hover {
      color: var(--primary-color);
    }
    .hamburger span {
      background: var(--primary-color);
    }
  `;
  style.textContent = css;
  document.head.appendChild(style);
}

// Build navigation from SITE_CONFIG
function buildNavigation() {
  if (!window.SITE_CONFIG) return;
  
  const navBrand = document.getElementById('navBrand');
  const navTabs = document.getElementById('navTabs');
  
  if (!navBrand || !navTabs) return;
  
  // Set clan name
  navBrand.innerHTML = `<img src="${SITE_CONFIG.favicon}" alt="" style="height: 32px; width: 32px; vertical-align: middle; margin-right: 8px;"> ${SITE_CONFIG.clanName}`;
  
  // Build tab buttons
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  const pages = SITE_CONFIG.pages || [
    { name: 'Dashboard', file: 'dashboard.html', icon: 'chests.png' },
    { name: 'Events', file: 'events.html', icon: 'events.png' },
    { name: 'Members', file: 'members.html', icon: 'members.png' },
    { name: 'Troops', file: 'troops.html', icon: 'troops.png' },
    { name: 'Progress', file: 'progress.html', icon: 'progress.png' }
  ];
  
  navTabs.innerHTML = pages.map(page => `
    <a href="${page.file}" class="tab-btn ${page.file === currentPage ? 'active' : ''}" title="${page.name}">
      <img src="${page.icon}" alt="${page.name}" class="tab-icon desktop-only">
      <span class="tab-label mobile-only">${page.name}</span>
    </a>
  `).join('');
}

// Set up Google Auth
function setupAuth() {
  const BACKEND_VERIFY_URL = window.GAS_WEB_APP_URL;
  const AUTH_KEY = SITE_CONFIG.clanAbbr + '_google_auth';
  const AUTH_EMAIL_KEY = SITE_CONFIG.clanAbbr + '_google_email';
  
  function setReadOnlyMode(enabled) {
    if (enabled) {
      document.documentElement.classList.add('read-only-mode');
      if (document.body) document.body.classList.add('read-only-mode');
    } else {
      document.documentElement.classList.remove('read-only-mode');
      if (document.body) document.body.classList.remove('read-only-mode');
    }
  }

  function updateSignedInBadge(email) {
    const badge = document.getElementById('signedInUserBadge');
    const logoutBtn = document.getElementById('logoutBtn');
    const signInBtn = document.getElementById('signInManageBtn');
    if (!badge) return;
    if (email) {
      badge.innerHTML = email;
      badge.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      if (signInBtn) signInBtn.style.display = 'none';
    } else {
      badge.textContent = '';
      badge.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (signInBtn) signInBtn.style.display = 'inline-block';
    }
  }

  function handleLogout() {
    try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
    try { localStorage.removeItem(AUTH_EMAIL_KEY); } catch (e) {}
    setReadOnlyMode(true);
    updateSignedInBadge(null);
    setTimeout(() => { window.location.reload(); }, 200);
  }

  function showGoogleLogin() {
    const loginDiv = document.createElement('div');
    loginDiv.id = 'login-overlay';
    loginDiv.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
    loginDiv.innerHTML = `
      <div style="background:#232526;padding:32px 24px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.5);display:flex;flex-direction:column;align-items:center;gap:16px;min-width:300px;border:1px solid #444;">
        <h2 style="margin-bottom:8px;">Sign in to Manage</h2>
        <p style="font-size:14px;color:#e0e0e0;text-align:center;margin:0 0 8px 0;">Use your Google account to access management features</p>
        <div id="g_id_onload" data-client_id="${SITE_CONFIG.googleClientId}" data-callback="onGoogleSignIn" data-auto_prompt="false" data-ux_mode="popup"></div>
        <div id="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="signin" data-shape="rectangular" data-logo_alignment="left"></div>
        <div style="width:100%;height:1px;background:#444;margin:8px 0;"></div>
        <button id="guest-btn" style="width:100%;margin-top:8px;padding:12px 20px;border:1px solid #444;background:#232526;color:#ffb300;font-size:15px;font-weight:600;border-radius:6px;cursor:pointer;">Continue as Guest (Read-Only)</button>
        <div id="login-error" style="color:#ff5252;font-size:13px;display:none;"></div>
      </div>
    `;
    document.body.appendChild(loginDiv);
    setTimeout(() => {
      const guestBtn = document.getElementById('guest-btn');
      if (guestBtn) {
        guestBtn.onclick = function() {
          document.getElementById('login-overlay').remove();
          setReadOnlyMode(true);
          try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
          try { localStorage.removeItem(AUTH_EMAIL_KEY); } catch (e) {}
          updateSignedInBadge(null);
        };
      }
      if (window.google && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.initialize({
            client_id: SITE_CONFIG.googleClientId,
            callback: onGoogleSignIn,
            auto_select: false,
            ux_mode: 'popup'
          });
          google.accounts.id.renderButton(document.getElementById('g_id_signin'), 
            { type: 'standard', size: 'large', theme: 'outline', text: 'signin', shape: 'rectangular', logo_alignment: 'left' });
        } catch (e) { console.error('Error rendering Google Sign-In button:', e); }
      }
    }, 100);
  }

  window.onGoogleSignIn = async function(response) {
    const idToken = response.credential;
    try {
      const cfWorkerUrl = window.CLOUDFLARE_WORKER_URL || window.GAS_WEB_APP_URL;
      let tokenRes = await fetch(cfWorkerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      let tokenData = await tokenRes.json();
      if (!tokenData.success || !tokenData.token_verified) {
        throw new Error(tokenData.error || 'Token verification failed');
      }
      const email = tokenData.email;
      const res = await fetch(BACKEND_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verifyUserPermission', email, clan: SITE_CONFIG.clanAbbr })
      });
      const data = await res.json();
      if (data.isAllowedEditor) {
        try { localStorage.setItem(AUTH_KEY, idToken); } catch (e) {}
        try { localStorage.setItem(AUTH_EMAIL_KEY, email); } catch (e) {}
        setReadOnlyMode(false);
        updateSignedInBadge(email);
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'none';
      } else {
        setReadOnlyMode(true);
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = 'Your account does not have editor access';
        }
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      const errorDiv = document.getElementById('login-error');
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Sign-in failed: ' + error.message;
      }
    }
  };

  window.handleLogout = handleLogout;

  window.addEventListener('DOMContentLoaded', () => {
    const token = (() => { try { return localStorage.getItem(AUTH_KEY); } catch (e) { return null; } })();
    const email = (() => { try { return localStorage.getItem(AUTH_EMAIL_KEY); } catch (e) { return null; } })();
    if (token && email) {
      setReadOnlyMode(false);
      updateSignedInBadge(email);
    } else {
      setReadOnlyMode(true);
      updateSignedInBadge(null);
      let nav = document.querySelector('.tab-nav-container');
      if (nav && !document.getElementById('signInManageBtn')) {
        const btn = document.createElement('button');
        btn.id = 'signInManageBtn';
        btn.textContent = '🔑 Sign in to Manage';
        btn.style = 'margin-left:16px;padding:8px 18px;background:#1a73e8;color:#fff;border:none;border-radius:5px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.2s;';
        btn.onclick = showGoogleLogin;
        nav.appendChild(btn);
      }
    }
  });
}

// Set up hamburger menu
function setupHamburgerMenu() {
  document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('navHamburger');
    const navTabs = document.getElementById('navTabs');
    if (hamburger && navTabs) {
      hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navTabs.classList.toggle('open');
      });
    }
    document.addEventListener('click', function(e) {
      if (navTabs && navTabs.classList.contains('open') && !navTabs.contains(e.target) && !hamburger.contains(e.target)) {
        navTabs.classList.remove('open');
      }
    });
  });
}

// Initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSiteFramework);
} else {
  initializeSiteFramework();
}
