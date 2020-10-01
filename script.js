import { noteNumberFromKey, transposeUp, transposeDown } from './KeyMapping.js';

function afterFirstUserAction() {

  const maxGain = 0.5;

  const oscillators = {};

  const audioCtx = new AudioContext();

  const volume = audioCtx.createGain();
  volume.gain.value = maxGain;
  volume.connect(audioCtx.destination);

  const volumeSlider = document.getElementById('volumeSlider');

  // for(const [keyCode, noteNumber] of Object.entries(keyMapping)) {
  //   addOscillator(keyCode, noteNumber);
  // }

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
    oscillators[keyCode].connect(volume);
    oscillators[keyCode].start();
  }

  function removeOscillator(keyCode) {
    oscillators[keyCode].disconnect(volume);
    oscillators[keyCode] = null;
  }


  const keyPressed = [];

  function keyGotPressed(keyCode) {
    const noteNumber = noteNumberFromKey(keyCode);
    addOscillator(keyCode, noteNumber);
  }

  function keyGotReleased(keyCode) {
    const noteNumber = noteNumberFromKey(keyCode);
    removeOscillator(keyCode, noteNumberFromKey(keyCode));
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
      if(e.code === 'ArrowLeft') {
        transposeDown();
      }
      if(e.code === 'ArrowRight') {
        transposeUp();
      }
      return;
    }
    
    const noteNumber = noteNumberFromKey(e.code);
    if(!Number.isInteger(noteNumber)) return;

    if(keyPressed[e.code] !== true) {
      keyPressed[e.code] = true;
      keyGotPressed(e.code);
    }
  });

  document.addEventListener('keyup', e => {
    const noteNumber = noteNumberFromKey(e.code);
    if(!Number.isInteger(noteNumber)) return;

    if(keyPressed[e.code] !== false) {
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
