/**
 * Chatwoot Dashboard App Auth
 * Implementa o mesmo mecanismo do useChatwoot hook (React)
 * Envia fetch-info ao parent e aguarda appContext.
 *
 * Suporta duas APIs:
 *   1. Callback API (nova): initChatwootAuth(onAuth, onTimeout)
 *   2. Options object API (legada): initChatwootAuth({ gateLoading, gateDirect, gateApp, onReady })
 */

const ALLOWED_ORIGINS = [
  'https://chat.digital-ai.tech',
  'https://chatmanager.digital-ai.tech',
];

window.__chatwootAuth = null;

function isAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.includes(origin);
}

function applyTheme(darkMode) {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Inicializa a autenticação Chatwoot.
 *
 * @param {Function|Object} onAuthOrOptions
 *   - Function: chamado com { accessToken, accountId, chatwootUrl, darkMode } ao autenticar
 *   - Object: { gateLoading, gateDirect, gateApp, client, report, onReady }
 * @param {Function} [onTimeout] - chamado após 8s sem resposta (acesso direto, não em iframe)
 *   Ignorado se onAuthOrOptions for um objeto (a API de objeto gerencia o DOM automaticamente)
 */
function initChatwootAuth(onAuthOrOptions, onTimeout) {
  let onAuth, onTimeout_fn;

  if (typeof onAuthOrOptions === 'function') {
    // Nova API: initChatwootAuth(onAuth, onTimeout)
    onAuth = onAuthOrOptions;
    onTimeout_fn = onTimeout;
  } else if (onAuthOrOptions && typeof onAuthOrOptions === 'object') {
    // API legada: initChatwootAuth({ gateLoading, gateDirect, gateApp, onReady })
    const opts = onAuthOrOptions;

    onAuth = function(auth) {
      var loadingEl = opts.gateLoading && document.getElementById(opts.gateLoading);
      var appEl     = opts.gateApp    && document.getElementById(opts.gateApp);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (appEl) {
        appEl.classList.add('visible');
        // Força reflow síncrono: garante que canvas.offsetWidth > 0
        // antes do duplo rAF em iframes cross-origin (Chatwoot).
        void appEl.offsetHeight;
      }
      // Duplo rAF: aguarda browser pintar o #app antes de inicializar Chart.js
      if (typeof opts.onReady === 'function') {
        requestAnimationFrame(function() {
          requestAnimationFrame(function() { opts.onReady(auth); });
        });
      }
    };

    onTimeout_fn = function() {
      var loadingEl = opts.gateLoading && document.getElementById(opts.gateLoading);
      var directEl  = opts.gateDirect  && document.getElementById(opts.gateDirect);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (directEl)  directEl.classList.remove('hidden');
    };
  }

  var authenticated = false;
  var timeoutId = null;

  function handleMessage(event) {
    if (!isAllowedOrigin(event.origin)) return;

    try {
      var message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      if (message.event === 'appContext' && message.data) {
        var data = message.data;
        var accessToken = data.userAccessToken || data.agentBotAccessToken;

        if (!accessToken || !data.accountId || !data.chatwootUrl) return;

        clearTimeout(timeoutId);
        authenticated = true;
        applyTheme(data.darkMode === true);

        window.__chatwootAuth = {
          accessToken:  accessToken,
          accountId:    data.accountId,
          chatwootUrl:  data.chatwootUrl,
          darkMode:     data.darkMode === true,
        };
        window.removeEventListener('message', handleMessage);

        if (typeof onAuth === 'function') onAuth(window.__chatwootAuth);
      }
    } catch (e) {
      // ignore parsing errors
    }
  }

  window.addEventListener('message', handleMessage);
  window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');

  // Timeout: se não receber auth em 8s, provavelmente acesso direto
  timeoutId = setTimeout(function() {
    if (!authenticated) {
      window.removeEventListener('message', handleMessage);
      if (typeof onTimeout_fn === 'function') onTimeout_fn();
    }
  }, 8000);
}

window.initChatwootAuth = initChatwootAuth;

/**
 * Verifica permissão do usuário autenticado via n8n webhook (CORS-safe).
 * Fail-closed: qualquer erro → callback(false, null).
 * @param {Object} auth - objeto retornado por initChatwootAuth
 * @param {string[]} allowedEmails - lista de emails autorizados (case-insensitive)
 * @param {Function} callback - chamado com (authorized: boolean, email: string|null)
 */
function checkChatwootPermission(auth, allowedEmails, callback) {
  fetch('https://chat-kanban.digital-ai.tech/proxy/chat-cors/api/v1/profile', {
    headers: { 'api_access_token': auth.accessToken },
  })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      var email = (data.email || '').toLowerCase();
      var normalized = allowedEmails.map(function(e) { return e.toLowerCase(); });
      callback(normalized.includes(email), email || null);
    })
    .catch(function() {
      callback(false, null);
    });
}

window.checkChatwootPermission = checkChatwootPermission;
