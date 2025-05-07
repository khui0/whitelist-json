export function isMac(): boolean {
  try {
    return navigator.userAgent.indexOf("Mac OS X") != -1;
  } catch {
    return false;
  }
}

export const controlKey = (e: KeyboardEvent) => (isMac() ? e.ctrlKey : e.metaKey);
export const commandKey = (e: KeyboardEvent) => (isMac() ? e.metaKey : e.ctrlKey);
