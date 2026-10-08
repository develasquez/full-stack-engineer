import state, { setState } from '../../store.js';

let pollInterval = null;

export function init() {
  const btnTrigger = document.getElementById('btn-trigger-chaos');
  if (btnTrigger) {
    btnTrigger.addEventListener('click', handleTriggerChaos);
  }
}

async function handleTriggerChaos() {
  if (state.chaosState.isCrashing) return;

  setState({
    backendStatus: 'chaos_crashed',
    chaosState: {
      isCrashing: true,
      lastCrashAt: new Date().toISOString(),
      pollCount: 0,
      recoveryStatus: 'waiting_kubelet'
    },
    notification: {
      type: 'warning',
      message: 'Fallo forzado inducido: backend terminando proceso. Monitoreando auto-recuperación de Pod...'
    }
  });

  try {
    await fetch('/api/v1/chaos/crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Inyección manual de caos desde el Frontend SPA' })
    });
  } catch (err) {
    console.log('[CHAOS] El backend cerró conexión como se esperaba debido al process.exit(1):', err.message);
  }

  // Start polling to detect pod auto-recovery
  startRecoveryPolling();
}

function startRecoveryPolling() {
  if (pollInterval) clearInterval(pollInterval);

  let attempts = 0;
  pollInterval = setInterval(async () => {
    attempts++;
    setState({
      chaosState: {
        ...state.chaosState,
        pollCount: attempts
      }
    });

    try {
      const response = await fetch('/api/v1/products', { cache: 'no-store' });
      if (response.ok) {
        // Backend has recovered!
        clearInterval(pollInterval);
        pollInterval = null;

        const data = await response.json();
        const productsList = data.products || data || [];

        setState({
          backendStatus: 'online',
          products: productsList,
          chaosState: {
            isCrashing: false,
            lastCrashAt: state.chaosState.lastCrashAt,
            pollCount: attempts,
            recoveryStatus: 'recovered'
          },
          notification: {
            type: 'success',
            message: `🎉 ¡Pod recreado y operativo! GKE Kubelet restableció el microservicio tras ${attempts} sondeos.`
          }
        });
      }
    } catch {
      // Still down, wait for next cycle
    }
  }, 1500);
}
