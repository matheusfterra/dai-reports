/**
 * Chatwoot Dashboard App Auth
 * Implementa o mesmo mecanismo do useChatwoot hook (React)
 * Envia fetch-info ao parent e aguarda appContext.
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
 * @param {Function} onAuth - chamado com { accessToken, accountId, chatwootUrl, darkMode } ao autenticar
 * @param {Function} onTimeout - chamado após 8s sem resposta (acesso direto, não em iframe)
 */
function initChatwootAuth(onAuth, onTimeout) {
  let authenticated = false;
  let timeoutId = null;

  function handleMessage(event) {
    if (!isAllowedOrigin(event.origin)) return;

    try {
      const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      if (message.event === 'appContext' && message.data) {
        const { userAccessToken, agentBotAccessToken, accountId, chatwootUrl, darkMode } = message.data;
        const accessToken = userAccessToken || agentBotAccessToken;

        if (!accessToken || !accountId || !chatwootUrl) return;

        clearTimeout(timeoutId);
        authenticated = true;
        applyTheme(darkMode === true);

        window.__chatwootAuth = { accessToken, accountId, chatwootUrl, darkMode: darkMode === true };
        window.removeEventListener('message', handleMessage);

        onAuth(window.__chatwootAuth);
      }
    } catch {
      // ignore non-JSON
    }
  }

  window.addEventListener('message', handleMessage);
  window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');

  // Timeout: se não receber auth em 8s, provavelmente acesso direto
  timeoutId = setTimeout(() => {
    if (!authenticated) {
      window.removeEventListener('message', handleMessage);
      if (onTimeout) onTimeout();
    }
  }, 8000);
}

window.initChatwootAuth = initChatwootAuth;
