import { noteNumberFromKey, transposeUp, transposeDown, changeLayout } from './KeyMapping.js';
import AudioHandler from './AudioHandler.js';

function incrementStatistics(data) {
  let statistics = JSON.parse(localStorage.getItem('statistics'));
  if(typeof statistics !== 'object' || statistics === null) statistics = {};

  for(const [key, value] of Object.entries(data)) {
    if(typeof statistics[key] !== 'object') statistics[key] = {};
    if(typeof statistics[key][value] !== 'number') statistics[key][value] = 0;
    statistics[key][value] += 1;
  }
  localStorage.setItem('statistics', JSON.stringify(statistics));
}

const pressedKeys = {};

function noteKeyGotPressed(keyCode) {
  const noteNumber = noteNumberFromKey(keyCode);
  AudioHandler.startNote(keyCode);
  incrementStatistics({
    volume: volumeSlider.value,
    noteNumber: noteNumber
  });
}

function noteKeyGotReleased(keyCode) {
  const noteNumber = noteNumberFromKey(keyCode);
  AudioHandler.stopNote(keyCode);
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
    AudioHandler.setVolume(nextVolume);
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
    AudioHandler.changeTimbre();
  }
  
  const noteNumber = noteNumberFromKey(e.code);
  if(!Number.isInteger(noteNumber)) return;

  if(pressedKeys[e.code] !== true) {
    pressedKeys[e.code] = true;
    noteKeyGotPressed(e.code);
  }
}

document.addEventListener('keydown', onKeyDown);

document.addEventListener('keyup', e => {
  const noteNumber = noteNumberFromKey(e.code);
  if(!Number.isInteger(noteNumber)) return;

  if(pressedKeys[e.code] !== false) {
    pressedKeys[e.code] = false;
    noteKeyGotReleased(e.code);
  }
});

volumeSlider.addEventListener('input', () => {
  AudioHandler.setVolume(volumeSlider.value);
});

const layoutSelect = document.getElementById('layoutSelect');

layoutSelect.addEventListener('change', () => {
  changeLayout(layoutSelect.value);
});
