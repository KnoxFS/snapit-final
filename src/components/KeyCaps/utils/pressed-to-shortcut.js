import isMac from './is-mac';

const IS_MAC = isMac();

const pressedToShortcut = (event) => {
  const res = [];
  if (event.metaKey) {
    res.push('Cmd');
  }
  if (event.ctrlKey) {
    res.push('Ctrl');
  }
  if (event.altKey) {
    if (IS_MAC) {
      res.push('Option');
    } else {
      res.push('Alt');
    }
  }
  if (event.shiftKey) {
    res.push('Shift');
  }
  if (event.code === 'CapsLock') {
    res.push('CapsLock');
  }
  if (event.code === 'Backspace') {
    res.push('Delete');
  }
  if (event.code === 'Space') {
    res.push('Space');
  }
  if (event.code === 'Escape') {
    res.push('Esc');
  }
  if (event.code === 'ArrowLeft') {
    res.push('←');
  }
  if (event.code === 'ArrowRight') {
    res.push('→');
  }
  if (event.code === 'ArrowUp') {
    res.push('↑');
  }
  if (event.code === 'ArrowDown') {
    res.push('↓');
  }

  const willIgnore = Boolean(event.key && event.code?.startsWith(event.key));
  if (!willIgnore && event.key?.trim()) {
    res.push(event.key);
  }
  return res;
};

export default pressedToShortcut;
