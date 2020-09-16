const intervalBetweenRows = 5;

let transposeNum = 0;
const defaultOffset = -18;

const keyboardRows = [
  ["IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
  ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash"],
  ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
];

const keyMapping = {};
keyboardRows.forEach((row, rowNum) => {
  row.forEach((keyCode, index) => {
    keyMapping[keyCode] = rowNum * intervalBetweenRows + index + defaultOffset;
  });
});

export const setTranspose = () => {
  transposeNum += 1;
  console.log(transposeNum);
};

export default keyMapping;