import { noteNumberFromKey, transposeUp, transposeDown, changeLayout } from './KeyMapping.js';

const volumeSlider = document.getElementById('volumeSlider');
const timbreSelect = document.getElementById('timbreSelect');
const layoutSelect = document.getElementById('layoutSelect');

function afterFirstUserAction(firstKeyEvent) {

  const maxGain = 0.2;

  const notes = {};

  console.log('localStorage.getItem(statistics):', JSON.parse(localStorage.getItem('statistics')));

  const audioCtx = new AudioContext();

  const volumeNode = audioCtx.createGain();
  volumeNode.gain.value = maxGain;
  volumeNode.connect(audioCtx.destination);

  function saveStatistics(data) {
    let statistics = JSON.parse(localStorage.getItem('statistics'));
    if(typeof statistics !== 'object' || statistics === null) statistics = {};

    for(const [key, value] of Object.entries(data)) {
      if(typeof statistics[key] !== 'object') statistics[key] = {};
      if(typeof statistics[key][value] !== 'number') statistics[key][value] = 0;
      statistics[key][value] += 1;
    }
    localStorage.setItem('statistics', JSON.stringify(statistics));
  }

  function changeVolume(percentage) { //todo: should i use a number between 0 and 1 instead of percentages?
    volumeNode.gain.value = percentage / 100 * maxGain;
    localStorage.setItem('volume', percentage);
  }

  if(localStorage.getItem('volume')) { //todo: improve this isset-function
    const volume = localStorage.getItem('volume');
    volumeSlider.value = volume;
    changeVolume(volume);
  }

  function frequencyFromNoteNumber(noteNumber) {
    return 440 * 2**(noteNumber / 12);
  }

  const gainBalanceFactors = {
    square: 1,
    sawtooth: 1.5,
    triangle: 2.5,
    sine: 2
  }
  function addOscillator(keyCode, noteNumber) {
    const oscillatorType = timbreSelect.value;
    
    const note = {};
    note.oscillatorNode = audioCtx.createOscillator();
    note.oscillatorNode.frequency.setValueAtTime(frequencyFromNoteNumber(noteNumber), audioCtx.currentTime);
    note.oscillatorNode.type = oscillatorType;

    note.gainNode = audioCtx.createGain();
    note.gainNode.gain.value = gainBalanceFactors[oscillatorType];

    note.oscillatorNode.connect(note.gainNode);
    note.gainNode.connect(volumeNode);

    note.oscillatorNode.start();
    note.gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 1.5);

    notes[keyCode] = note;
  }

  function removeOscillator(keyCode) {
    notes[keyCode].oscillatorNode.stop();
  }


  const keyPressed = {};

  function keyGotPressed(keyCode) {
    const noteNumber = noteNumberFromKey(keyCode);
    addOscillator(keyCode, noteNumber);
    saveStatistics({
      volume: volumeSlider.value,
      noteNumber: noteNumber
    });
  }

  function keyGotReleased(keyCode) {
    const noteNumber = noteNumberFromKey(keyCode);
    removeOscillator(keyCode, noteNumber);
  }

  function changeTimbre() {
    if(timbreSelect.selectedIndex === timbreSelect.length - 1) {
      timbreSelect.selectedIndex = 0;
      return;
    }
    timbreSelect.selectedIndex++;
  }

  //**************************** EVENT HANDLING ************************
  const onKeyDown = e => {
    if(['ArrowUp', 'ArrowDown'].includes(e.code)) {
      const prevVolume = volumeSlider.value;
      let nextVolume;
      if (e.code === 'ArrowUp') {
        nextVolume = parseInt(prevVolume) + 5;
      } else if (e.code === 'ArrowDown') {
        nextVolume = prevVolume - 5;
      }
      
      if(nextVolume > 100) nextVolume = 100;
      if(nextVolume < 0) nextVolume = 0;
      
      volumeSlider.value = nextVolume;
      changeVolume(nextVolume);
      return;
    }
    
    if(['ArrowLeft', 'ArrowRight'].includes(e.code)) {
      if(e.code === 'ArrowLeft') {
        transposeUp();
      }
      if(e.code === 'ArrowRight') {
        transposeDown();
      }
      return;
    }

    if(e.code === 'Space') {
      changeTimbre();
    }
    
    const noteNumber = noteNumberFromKey(e.code);
    if(!Number.isInteger(noteNumber)) return;

    if(keyPressed[e.code] !== true) {
      keyPressed[e.code] = true;
      keyGotPressed(e.code);
    }
  }

  document.addEventListener('keydown', onKeyDown);

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
  
  onKeyDown(firstKeyEvent);
  document.removeEventListener('keydown', afterFirstUserAction);
}

document.addEventListener('keydown', afterFirstUserAction);

layoutSelect.addEventListener('change', () => {
  changeLayout(layoutSelect.value);
});