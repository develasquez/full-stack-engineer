const state = {
  appName: "Retail Cloud Platform 2026",
  theme: "oceanic-slate",
  gcpProject: "retail-enterprise-2026",
  selectedStoreId: "TIENDA-CENTRAL-01",
  backendStatus: "online", // "online" | "connecting" | "offline" | "chaos_crashed"
  products: [],
  isLoading: false,
  notification: null, // { type: 'success' | 'error' | 'warning' | 'info', message: string }
  chaosState: {
    isCrashing: false,
    lastCrashAt: null,
    pollCount: 0,
    recoveryStatus: null
  }
};

const subscribers = [];

export function subscribe(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Subscriber must be a function.');
  }
  subscribers.push(callback);
}

export function setState(newState) {
  Object.assign(state, newState);
  console.log("📢 [STORE] STATE CHANGE PUBLISHED:", newState);
  subscribers.forEach(callback => callback());
}

export default state;
