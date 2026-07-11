// Safe localStorage wrapper. Never throws — some browsers (private mode,
// disabled storage, quota) make localStorage read/write raise. All callers
// degrade gracefully to an in-memory fallback for the current page view.

const memory = new Map();
let storageWorks = null;

function probe() {
  if (storageWorks !== null) return storageWorks;
  try {
    const k = "__tc_probe__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    storageWorks = true;
  } catch (err) {
    storageWorks = false;
  }
  return storageWorks;
}

export function readJSON(key, fallback) {
  try {
    const raw = probe() ? window.localStorage.getItem(key) : memory.get(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    // Corrupt value or unavailable storage — reset to a known-good state.
    return fallback;
  }
}

export function writeJSON(key, value) {
  const raw = JSON.stringify(value);
  try {
    if (probe()) window.localStorage.setItem(key, raw);
    else memory.set(key, raw);
  } catch (err) {
    memory.set(key, raw);
  }
}

export function remove(key) {
  try {
    if (probe()) window.localStorage.removeItem(key);
    memory.delete(key);
  } catch (err) {
    memory.delete(key);
  }
}
