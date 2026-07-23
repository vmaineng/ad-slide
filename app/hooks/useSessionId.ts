import { useSyncExternalStore } from "react";

// Generated once per page load, cached at module scope so every call
// during this client session returns the same value.
let cachedSessionId: string | null = null;

function getSnapshot(): string {
  if (cachedSessionId === null) {
    cachedSessionId = Math.random().toString(36).slice(2);
  }
  return cachedSessionId;
}

// Server render always sees "" — this is what keeps the server-rendered
// HTML and the client's first render in sync, avoiding a hydration
// mismatch. React then re-renders with the real client snapshot right
// after hydration, without needing an effect + setState.
function getServerSnapshot(): string {
  return "";
}

// The session ID never changes after it's generated, so there's nothing
// to subscribe to — this is required by useSyncExternalStore's API but
// is effectively a no-op here.
function subscribe(): () => void {
  return () => {};
}

export function useSessionId(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}