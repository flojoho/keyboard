import settings from './settings.js';
import { noteNumberFromKey, transposeUp, transposeDown, changeLayout } from './KeyMapping.js';

const gainBalanceFactors = {
  square: 1,
  sawtooth: 1.5,
  triangle: 2.5,
  sine: 2
}

const volumeSlider = document.getElementById('volumeSlider');
const timbreSelect = document.getElementById('timbreSelect');

timbreSelect.value = settings.get('timbre');

const initialVolume = settings.get('volume');
if(!isNaN(initialVolume)) {
  volumeSlider.value = initialVolume;
}







const notes = {}
const maxGain = 0.2;
const volume = typeof initialVolume === 'string' ? Number.parseFloat(initialVolume) : 50;
let context;
let volumeNode;

const ensureContext = () => {
  if(!context) {
    context = new AudioContext();

    volumeNode = context.createGain();
    volumeNode.gain.value = volume/100 * maxGain;
    volumeNode.connect(context.destination);
  }
}

const startNote = (keyCode) => {
  ensureContext();
  addOscillator(keyCode);
}

const stopNote = keyCode => {
  ensureContext();
  removeOscillator(keyCode);
}

const stopAllNotes = () => {
  ensureContext();
}

const setVolume = percentage => {
  ensureContext();
  // TODO: should i use a number between 0 and 1 instead of percentages?
  volumeNode.gain.value = percentage / 100 * maxGain;
  settings.set('volume', percentage);
}

const changeTimbre = () => {
  if(timbreSelect.selectedIndex === timbreSelect.length - 1) {
    timbreSelect.selectedIndex = 0;
  } else {
    timbreSelect.selectedIndex++;
  }
  settings.set('timbre', timbreSelect.value)
}

const frequencyFromNoteNumber = noteNumber => {
  return 440 * 2**(noteNumber / 12);
}

const addOscillator = keyCode => {
  const noteNumber = noteNumberFromKey(keyCode);
  const frequency = frequencyFromNoteNumber(noteNumber);
  const oscillatorType = timbreSelect.value;
  
  const note = {};
  note.oscillatorNode = context.createOscillator();
  note.oscillatorNode.frequency.setValueAtTime(frequency, context.currentTime);
  note.oscillatorNode.type = oscillatorType;

  note.gainNode = context.createGain();
  note.gainNode.gain.value = gainBalanceFactors[oscillatorType];

  note.oscillatorNode.connect(note.gainNode);
  note.gainNode.connect(volumeNode);

  note.oscillatorNode.start();
  note.gainNode.gain.setTargetAtTime(0, context.currentTime, 1.5);

  notes[keyCode] = note;
}

const removeOscillator = keyCode => {
  notes[keyCode].oscillatorNode.stop();
}

class Note {
  constructor(noteNumber) {

  }

  start() {

  }

  stop() {
    
  }
}

export default { startNote, stopNote, stopAllNotes, setVolume, changeTimbre, Note };