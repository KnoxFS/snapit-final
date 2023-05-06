export default function isMac() {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgentData?.platform.toUpperCase().indexOf('MAC') >= 0;
  }
  return false;
}
