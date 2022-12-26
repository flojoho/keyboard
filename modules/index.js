import { noteNumberFromKey, transposeUp, transposeDown } from './KeyMapping.js';
import AudioHandler, { Note } from './AudioHandler.js';
import ButtonGrid from './ButtonGrid.js';

ButtonGrid.render();
addEventListener('resize', ButtonGrid.render);

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
const notes = {};

function noteKeyGotPressed(keyCode) {
  const noteNumber = noteNumberFromKey(keyCode);
  const note = new Note(noteNumber);
  notes[keyCode] = note;
  note.start()
  incrementStatistics({
    volume: volumeSlider.value,
    noteNumber: noteNumber
  });
}

function noteKeyGotReleased(keyCode) {
  const noteNumber = noteNumberFromKey(keyCode);
  notes[keyCode].stop();
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