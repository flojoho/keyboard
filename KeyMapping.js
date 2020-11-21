const intervalBetweenRows = 5;

let offset = parseInt(localStorage.getItem('offset') || '0');
const defaultOffset = -18;

const keyboardRows = [
  ["IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
  ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash"],
  ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
];

const defaultMapping = {};
keyboardRows.forEach((row, rowNum) => {
  row.forEach((keyCode, index) => {
    defaultMapping[keyCode] = rowNum * intervalBetweenRows + index + defaultOffset;
  });
});

export const transposeUp = () => {
  offset += 1;
  localStorage.setItem('offset', offset);
};

export const transposeDown = () => {
  offset -= 1;
  localStorage.setItem('offset', offset);
};

export const noteNumberFromKey = keyCode => {
  if(!typeof keyCode === 'string') throw new Error('keyCode must be a string');

  const noteNumber = defaultMapping[keyCode];
  if(!Number.isInteger(noteNumber)) return null;
  return noteNumber + offset;
}