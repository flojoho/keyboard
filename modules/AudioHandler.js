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

class Note {
  constructor() {

  }

  start() {

  }

  stop() {
    
  }
}

class AudioHandler {
  static #notes = {};
  static #maxGain = 0.2;
  static #volume = typeof initialVolume === 'string' ? Number.parseFloat(initialVolume) : 50;

  static startNote(keyCode) {
    this.#ensureContext();
    this.#addOscillator(keyCode);
  }

  static stopNote(keyCode) {
    this.#ensureContext();
    this.#removeOscillator(keyCode);
  }

  static stopAllNotes() {
    this.#ensureContext();
  }
  
  static setVolume(percentage) {
    this.#ensureContext();
    // TODO: should i use a number between 0 and 1 instead of percentages?
    this.volumeNode.gain.value = percentage / 100 * this.#maxGain;
    settings.set('volume', percentage);
  }

  static changeTimbre() {
    if(timbreSelect.selectedIndex === timbreSelect.length - 1) {
      timbreSelect.selectedIndex = 0;
    } else {
      timbreSelect.selectedIndex++;
    }
    settings.set('timbre', timbreSelect.value)
  }

  static #ensureContext() {
    if(!this.context) {
      this.context = new AudioContext();

      this.volumeNode = this.context.createGain();
      this.volumeNode.gain.value = this.#volume/100 * this.#maxGain;
      this.volumeNode.connect(this.context.destination);
    }
  }

  static #frequencyFromNoteNumber(noteNumber) {
    return 440 * 2**(noteNumber / 12);
  }

  static #addOscillator(keyCode) {
    const noteNumber = noteNumberFromKey(keyCode);
    const frequency = this.#frequencyFromNoteNumber(noteNumber);
    const oscillatorType = timbreSelect.value;
    
    const note = {};
    note.oscillatorNode = this.context.createOscillator();
    note.oscillatorNode.frequency.setValueAtTime(frequency, this.context.currentTime);
    note.oscillatorNode.type = oscillatorType;
  
    note.gainNode = this.context.createGain();
    note.gainNode.gain.value = gainBalanceFactors[oscillatorType];
  
    note.oscillatorNode.connect(note.gainNode);
    note.gainNode.connect(this.volumeNode);
  
    note.oscillatorNode.start();
    note.gainNode.gain.setTargetAtTime(0, this.context.currentTime, 1.5);
  
    this.#notes[keyCode] = note;
  }
  
  static #removeOscillator(keyCode) {
    this.#notes[keyCode].oscillatorNode.stop();
  }
}

export default AudioHandler;
