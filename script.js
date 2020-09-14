function afterFirstUserAction() {

  const maxGain = 0.1;

  const oscillators = {};

  const audioCtx = new AudioContext();

  const volume = audioCtx.createGain();
  volume.gain.value = maxGain;
  volume.connect(audioCtx.destination);

  const volumeSlider = document.getElementById('volumeSlider');

  const intervalBetweenRows = 5;
  const keyboardRows = [
    ["IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
    ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash"],
    ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
    ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
  ];
  keyboardRows.forEach((row, rowNum) => {
    row.forEach((keyCode, index) => {
      addOscillator(keyCode, rowNum*intervalBetweenRows + index - 18);
    });
  });

  function changeVolume(percentage) { //todo: should i use a number between 0 and 1 instead of percentages?
    volume.gain.value = percentage / 100 * maxGain;
    localStorage.setItem('keyboard', percentage);
  }

  if(localStorage.getItem('keyboard')) { //todo: improve this isset-function
    const localData = localStorage.getItem('keyboard');
    volumeSlider.value = localData;
    changeVolume(localData);
  }

  function frequencyFromNoteNumber(noteNumber) {
    return 440 * 2**(noteNumber / 12);
  }

  function addOscillator(keyCode, noteNumber) {
    oscillators[keyCode] = audioCtx.createOscillator();
    oscillators[keyCode].frequency.setValueAtTime(frequencyFromNoteNumber(noteNumber), audioCtx.currentTime);
    oscillators[keyCode].type = "square";
    oscillators[keyCode].start();
  }


  const keyPressed = [];

  function keyGotPressed(keyCode) {
    //if(noteNumberFromKeyCode[keyCode] !== undefined)
    
    //startNote(noteNumberFromKeyCode[e.keyCode]);
    if(oscillators[keyCode]) oscillators[keyCode].connect(volume);
  }

  function keyGotReleased(keyCode) {
    //stopNote(noteNumberFromKeyCode[e.keyCode]);
    if(oscillators[keyCode]) oscillators[keyCode].disconnect(volume);
  }

  //**************************** EVENT HANDLING ************************
  document.addEventListener('keydown', e => {
    if(['ArrowUp', 'ArrowDown'].includes(e.code)) {
      const prevVolume = volumeSlider.value;
      let nextVolume;
      if (e.code === 'ArrowUp') {
        nextVolume = parseInt(prevVolume) + 10;
      } else if (e.code === 'ArrowDown') {
        nextVolume = prevVolume - 10;
      }
      
      if(nextVolume > 100) nextVolume = 100;
      if(nextVolume < 0) nextVolume = 0;
      
      volumeSlider.value = nextVolume;
      changeVolume(nextVolume);
      return;
    }
    if(['ArrowLeft', 'ArrowRight'].includes(e.code)) {
      return;
    }

    audioCtx.resume(); //very ugly way of doing it
    
    if(keyPressed[e.code] !== true) {
      keyPressed[e.code] = true;
      keyGotPressed(e.code);
    }
  });

  document.addEventListener('keyup', e => {
    if(keyPressed[e.code] !== false){
      keyPressed[e.code] = false;
      
      keyGotReleased(e.code);
    }
  });

  volumeSlider.addEventListener('input', () => {
    changeVolume(volumeSlider.value);
  });
  
  document.removeEventListener('keydown', afterFirstUserAction);
}

document.addEventListener('keydown', afterFirstUserAction);
