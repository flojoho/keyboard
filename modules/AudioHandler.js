var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Note_instances, _Note_noteNumber, _Note_oscillator, _Note_addOscillator, _Note_removeOscillator;
import settings from './settings.js';
const gainBalanceFactors = {
    square: 1,
    sawtooth: 1.5,
    triangle: 2.5,
    sine: 2
};
const volumeSlider = document.getElementById('volumeSlider');
const timbreSelect = document.getElementById('timbreSelect');
timbreSelect.value = settings.get('timbre');
timbreSelect.addEventListener('change', () => settings.set('timbre', timbreSelect.value));
const initialVolume = settings.get('volume');
if (!isNaN(initialVolume)) {
    volumeSlider.value = initialVolume;
}
const maxGain = 0.2;
const volume = typeof initialVolume === 'string' ? Number.parseFloat(initialVolume) : 50;
let context;
let volumeNode;
const ensureContext = () => {
    if (!context) {
        context = new AudioContext();
        volumeNode = context.createGain();
        volumeNode.gain.value = volume / 100 * maxGain;
        volumeNode.connect(context.destination);
    }
};
const stopAllNotes = () => {
    ensureContext();
};
const setVolume = (percentage) => {
    ensureContext();
    // TODO: should i use a number between 0 and 1 instead of percentages?
    volumeNode.gain.value = percentage / 100 * maxGain;
    settings.set('volume', percentage);
};
const changeTimbre = () => {
    if (timbreSelect.selectedIndex === timbreSelect.length - 1) {
        timbreSelect.selectedIndex = 0;
    }
    else {
        timbreSelect.selectedIndex++;
    }
    settings.set('timbre', timbreSelect.value);
};
const frequencyFromNoteNumber = (noteNumber) => {
    return 440 * 2 ** (noteNumber / 12);
};
export class Note {
    constructor(noteNumber) {
        _Note_instances.add(this);
        _Note_noteNumber.set(this, void 0);
        _Note_oscillator.set(this, void 0);
        __classPrivateFieldSet(this, _Note_noteNumber, noteNumber, "f");
    }
    start() {
        ensureContext();
        __classPrivateFieldGet(this, _Note_instances, "m", _Note_addOscillator).call(this);
    }
    stop() {
        ensureContext();
        __classPrivateFieldGet(this, _Note_instances, "m", _Note_removeOscillator).call(this);
    }
    changePitch(offset) {
        const now = context.currentTime;
        const frequency = frequencyFromNoteNumber(__classPrivateFieldGet(this, _Note_noteNumber, "f") + offset);
        __classPrivateFieldGet(this, _Note_oscillator, "f").frequency.setValueAtTime(frequency, now);
    }
}
_Note_noteNumber = new WeakMap(), _Note_oscillator = new WeakMap(), _Note_instances = new WeakSet(), _Note_addOscillator = function _Note_addOscillator() {
    const frequency = frequencyFromNoteNumber(__classPrivateFieldGet(this, _Note_noteNumber, "f"));
    const oscillatorType = timbreSelect.value;
    const note = {};
    __classPrivateFieldSet(this, _Note_oscillator, context.createOscillator(), "f");
    __classPrivateFieldGet(this, _Note_oscillator, "f").frequency.setValueAtTime(frequency, context.currentTime);
    __classPrivateFieldGet(this, _Note_oscillator, "f").type = oscillatorType;
    const gainNode = context.createGain();
    gainNode.gain.value = gainBalanceFactors[oscillatorType];
    __classPrivateFieldGet(this, _Note_oscillator, "f").connect(gainNode);
    gainNode.connect(volumeNode);
    __classPrivateFieldGet(this, _Note_oscillator, "f").start();
    // gainNode.gain.setTargetAtTime(0, context.currentTime, 2);
}, _Note_removeOscillator = function _Note_removeOscillator() {
    __classPrivateFieldGet(this, _Note_oscillator, "f").stop();
};
export default { stopAllNotes, setVolume, changeTimbre, Note };
