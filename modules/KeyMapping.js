import settings from './settings.js';

const intervalBetweenRows = 5;

const keyboardRows = [
  [undefined, "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
  [undefined, "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", undefined],
  [undefined, "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash", undefined],
  ["ShiftLeft", "IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight", undefined, undefined]
];

const rightHandMapping = {};
keyboardRows.reverse().forEach((row, rowNum) => {
  row.forEach((keyCode, index) => {
    if(!keyCode) return;
    rightHandMapping[keyCode] = rowNum * intervalBetweenRows + index - 25;
  });
});

const leftHandMapping = {};
keyboardRows.forEach((row, rowNum) => {
  row.forEach((keyCode, index) => {
    if(!keyCode) return;
    leftHandMapping[keyCode] = rowNum * 5 - index - 10;
  });
});

const keyboardLayouts = {
  righthand: rightHandMapping,
  lefthand: leftHandMapping
};

let activeMapping = keyboardLayouts['righthand'];

export const transposeUp = () => {
  const transposeOffset = settings.get('transposeOffset');
  settings.set('transposeOffset', transposeOffset + 1);
};

export const transposeDown = () => {
  const transposeOffset = settings.get('transposeOffset');
  settings.set('transposeOffset', transposeOffset - 1);
};

export const noteNumberFromKey = keyCode => {
  if(!typeof keyCode === 'string') throw new Error('keyCode must be a string');

  const noteNumber = activeMapping[keyCode];
  if(!Number.isInteger(noteNumber)) return null;
  return noteNumber + settings.get('transposeOffset');
}

export const changeLayout = name => {
  if(!typeof name === 'string') throw new Error('name must be a string');
  activeMapping = keyboardLayouts[name] || keyboardLayouts['righthand'];
}
