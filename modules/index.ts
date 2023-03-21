import { noteNumberFromKey, transposeUp, transposeDown } from './KeyMapping.js';
import AudioHandler, { Note } from './AudioHandler.js';
import './SettingsModal.js';
import ButtonGrid from './ButtonGrid.js';

ButtonGrid.render();
addEventListener('resize', ButtonGrid.render);

const volumeSlider = document.getElementById('volumeSlider');

type statistics = {
  volume: number,
  noteNumber: number
}

function incrementStatistics(data: statistics) {
  let statistics = JSON.parse(localStorage.getItem('statistics') || '{}');

  for(const [key, value] of Object.entries(data)) {
    if(typeof statistics[key] !== 'object') statistics[key] = {};
    if(typeof statistics[key][value] !== 'number') statistics[key][value] = 0;
    statistics[key][value] += 1;
  }
  localStorage.setItem('statistics', JSON.stringify(statistics));
}

type pressedKeysDictionary = {
  [Key: string]: boolean
}
const pressedKeys: pressedKeysDictionary = {};

type noteDictionary = {
  [Key: string]: Note
}
const notes: noteDictionary = {};

function noteKeyGotPressed(keyCode: string) {
  const noteNumber = noteNumberFromKey(keyCode);
  const note = new Note(noteNumber);
  notes[keyCode] = note;
  note.start()
  incrementStatistics({
    volume: volumeSlider.value,
    noteNumber: noteNumber
  });
}

function noteKeyGotReleased(keyCode: string) {
  const noteNumber = noteNumberFromKey(keyCode);
  notes[keyCode].stop();
}

//**************************** EVENT HANDLING ************************
const onKeyDown = e => {
  if(['ArrowUp', 'ArrowDown'].includes(e.code)) {
    const prevVolume = volumeSlider.value;
    let nextVolume: number;
    if (e.code === 'ArrowUp') {
      nextVolume = Number.parseFloat(prevVolume) + 5;
    } else {
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
  AudioHandler.setVolume(Number.parseFloat(volumeSlider.value));
});
