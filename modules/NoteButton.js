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
var _NoteButton_div, _NoteButton_noteNumber, _NoteButton_x, _NoteButton_xTouchStart, _NoteButton_note;
import { Note } from './AudioHandler.js';
import settings from './settings.js';
let diameter = settings.get('buttonSize');
let spacing = settings.get('spacingSize');
export const getDiameter = () => {
    return diameter;
};
export const setDiameter = (num) => {
    diameter = num;
};
export const getSpacing = () => {
    return spacing;
};
export const setSpacing = (num) => {
    spacing = num;
};
class NoteButton {
    constructor(noteNumber, x, y) {
        _NoteButton_div.set(this, void 0);
        _NoteButton_noteNumber.set(this, void 0);
        _NoteButton_x.set(this, void 0);
        _NoteButton_xTouchStart.set(this, void 0);
        _NoteButton_note.set(this, void 0);
        __classPrivateFieldSet(this, _NoteButton_noteNumber, noteNumber, "f");
        __classPrivateFieldSet(this, _NoteButton_x, x, "f");
        const circle = document.createElement('div');
        circle.classList.add('note-button');
        circle.style.backgroundColor = `hsl(${noteNumber / 12 * 360}, 100%, 50%)`;
        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        __classPrivateFieldSet(this, _NoteButton_div, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _NoteButton_div, "f").appendChild(circle);
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.position = `absolute`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.display = `flex`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.justifyContent = `center`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.alignItems = `center`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.width = `${diameter + spacing}px`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.height = `${diameter + spacing}px`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.left = `${x}px`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").style.top = `${y}px`;
        __classPrivateFieldGet(this, _NoteButton_div, "f").addEventListener('touchstart', e => {
            e.preventDefault();
            if (__classPrivateFieldGet(this, _NoteButton_note, "f"))
                return;
            __classPrivateFieldSet(this, _NoteButton_xTouchStart, e.targetTouches[0].clientX, "f");
            __classPrivateFieldSet(this, _NoteButton_note, new Note(__classPrivateFieldGet(this, _NoteButton_noteNumber, "f")), "f");
            __classPrivateFieldGet(this, _NoteButton_note, "f").start();
            __classPrivateFieldGet(this, _NoteButton_div, "f").classList.add('note-button-active');
        });
        __classPrivateFieldGet(this, _NoteButton_div, "f").addEventListener('touchmove', e => {
            e.preventDefault();
            const xMouse = e.targetTouches[0].clientX;
            const pitchChange = (xMouse - __classPrivateFieldGet(this, _NoteButton_xTouchStart, "f")) / (diameter + spacing);
            __classPrivateFieldGet(this, _NoteButton_note, "f").changePitch(pitchChange);
            __classPrivateFieldGet(this, _NoteButton_div, "f").style.left = `${__classPrivateFieldGet(this, _NoteButton_x, "f") + (xMouse - __classPrivateFieldGet(this, _NoteButton_xTouchStart, "f"))}px`;
        });
        __classPrivateFieldGet(this, _NoteButton_div, "f").addEventListener('touchend', e => {
            e.preventDefault();
            __classPrivateFieldGet(this, _NoteButton_note, "f").stop();
            __classPrivateFieldSet(this, _NoteButton_note, undefined, "f");
            __classPrivateFieldGet(this, _NoteButton_div, "f").classList.remove('note-button-active');
            __classPrivateFieldGet(this, _NoteButton_div, "f").style.left = `${__classPrivateFieldGet(this, _NoteButton_x, "f")}px`;
        });
    }
    appendTo(parent) {
        parent.appendChild(__classPrivateFieldGet(this, _NoteButton_div, "f"));
    }
}
_NoteButton_div = new WeakMap(), _NoteButton_noteNumber = new WeakMap(), _NoteButton_x = new WeakMap(), _NoteButton_xTouchStart = new WeakMap(), _NoteButton_note = new WeakMap();
export default NoteButton;
