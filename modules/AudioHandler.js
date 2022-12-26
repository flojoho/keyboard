import settings from './settings.js';
import { noteNumberFromKey, transposeUp, transposeDown } from './KeyMapping.js';

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

export class Note {
  #noteNumber
  #oscillatorNode
  
  constructor(noteNumber) {
    this.#noteNumber = noteNumber;
  }

  start() {
    ensureContext();
    this.#addOscillator();
  }

  stop() {
    ensureContext();
    this.#removeOscillator();
  }

  #addOscillator() {
    const frequency = frequencyFromNoteNumber(this.#noteNumber);
    const oscillatorType = timbreSelect.value;
    
    const note = {};
    this.#oscillatorNode = context.createOscillator();
    this.#oscillatorNode.frequency.setValueAtTime(frequency, context.currentTime);
    this.#oscillatorNode.type = oscillatorType;

    const gainNode = context.createGain();
    gainNode.gain.value = gainBalanceFactors[oscillatorType];

    this.#oscillatorNode.connect(gainNode);
    gainNode.connect(volumeNode);

    this.#oscillatorNode.start();
    gainNode.gain.setTargetAtTime(0, context.currentTime, 1.5);
  }

  #removeOscillator() {
    this.#oscillatorNode.stop();
  }
}

export default { stopAllNotes, setVolume, changeTimbre, Note };
