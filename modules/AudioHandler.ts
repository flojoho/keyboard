import settings from './settings.js';

const gainBalanceFactors = {
  square: 1,
  sawtooth: 1.5,
  triangle: 2.5,
  sine: 2
}

const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
const timbreSelect = document.getElementById('timbreSelect') as HTMLSelectElement;

timbreSelect.value = settings.get('timbre');

timbreSelect.addEventListener('change', () => settings.set('timbre', timbreSelect.value));

const initialVolume = settings.get('volume');
if(!isNaN(initialVolume)) {
  volumeSlider.value = initialVolume;
}

const maxGain = 0.2;
const volume = initialVolume;
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

const setVolume = (percentage: number) => {
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
  settings.set('timbre', timbreSelect.value);
}

const frequencyFromNoteNumber = (noteNumber: number) => {
  return 440 * 2**(noteNumber / 12);
}

export class Note {
  #noteNumber;
  #oscillator;
  fadeDuration = 0.005;
  gainNode;
  oscillatorType = timbreSelect.value;
  
  constructor(noteNumber: number) {
    this.#noteNumber = noteNumber;
  }

  start() {
    ensureContext();
    this.gainNode = context.createGain();
    this.#addOscillator();
  }

  stop() {
    ensureContext();
    this.#removeOscillator();
  }

  changePitch(offset: number) {
    const now = context.currentTime;
    const frequency = frequencyFromNoteNumber(this.#noteNumber + offset);
    this.#oscillator.frequency.setValueAtTime(frequency, now);
  }

  #addOscillator() {
    const frequency = frequencyFromNoteNumber(this.#noteNumber);
    
    const note = {};
    this.#oscillator = context.createOscillator();
    this.#oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    this.#oscillator.type = this.oscillatorType;

    this.#oscillator.connect(this.gainNode);
    this.gainNode.connect(volumeNode);

    this.#oscillator.start();

    const now = context.currentTime;
    this.gainNode.gain.setValueAtTime(0, now);
    this.gainNode.gain.linearRampToValueAtTime(gainBalanceFactors[this.oscillatorType], now + this.fadeDuration);
  }

  #removeOscillator() {
    const now = context.currentTime;
    this.gainNode.gain.setValueAtTime(gainBalanceFactors[this.oscillatorType], now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + this.fadeDuration);
    this.#oscillator.stop(now + this.fadeDuration);
  }
}

export default { stopAllNotes, setVolume, changeTimbre, Note };
