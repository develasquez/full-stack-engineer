import state, { setState } from '../../store.js';

export function init() {
  const triggerBtn = document.getElementById('btn-trigger-crash');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', handleTriggerCrash);
  }
}

async function handleTriggerCrash() {
  setState({
    chaosState: {
      status: "TRIGGERING_CRASH",
      lastIncident: new Date().toISOString(),
      inFlight: true,
      podReplicasDetected: 1
    }
  });

  try {
    const res = await fetch('/api/v1/chaos/crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Simulación de fallo en vivo en Workshop D1 GCP' })
    });

    const data = await res.json().catch(() => null);

    setState({
      chaosState: {
        status: "POD_CRASHED",
        lastIncident: new Date().toLocaleTimeString(),
        inFlight: false,
        message: data ? data.message : "El Pod de backend ha recibido la señal de muerte. GKE reiniciará el contenedor."
      }
    });
  } catch (err) {
    // Si la conexión se corta inmediatamente debido a process.exit(1), es el comportamiento esperado!
    setState({
      chaosState: {
        status: "POD_TERMINATED",
        lastIncident: new Date().toLocaleTimeString(),
        inFlight: false,
        message: "Conexión terminada por el servidor (Exit Code 1). GKE Kubelet ha detectado la caída y está regenerando el Pod."
      }
    });
  }
}
