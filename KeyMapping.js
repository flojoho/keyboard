const intervalBetweenRows = 5;

let offset = parseInt(localStorage.getItem('offset') || '0');
const defaultOffset = -18;

const keyboardRows = [
  [undefined, "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
  [undefined, "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", undefined],
  [undefined, "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash", undefined],
  ["ShiftLeft", "IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight", undefined, undefined]
];

const defaultMapping = {};

if(true) { // new experimental left hand key mapping
  keyboardRows.reverse().forEach((row, rowNum) => {
    row.forEach((keyCode, index) => {
      if(!keyCode) return;
      defaultMapping[keyCode] = rowNum * 5 - index - 10;
    });
  });
} else {
  keyboardRows.reverse().forEach((row, rowNum) => {
    row.forEach((keyCode, index) => {
      if(!keyCode) return;
      defaultMapping[keyCode] = rowNum * intervalBetweenRows + index + defaultOffset;
    });
  });
}

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