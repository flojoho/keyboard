import { Note } from '../AudioHandler.js';
import settings from '../settings.js';
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
        this.xTouchStart = 0;
        this.noteNumber = noteNumber;
        this.x = x;
        const circle = document.createElement('div');
        circle.classList.add('note-button-circle');
        circle.style.backgroundColor = `hsl(${noteNumber / 12 * 360}, 100%, 50%)`;
        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        this.div = document.createElement('div');
        this.div.appendChild(circle);
        this.div.classList.add('note-button');
        this.div.style.width = `${diameter + spacing}px`;
        this.div.style.height = `${diameter + spacing}px`;
        this.div.style.left = `${x}px`;
        this.div.style.top = `${y}px`;
        this.div.addEventListener('touchstart', e => {
            e.preventDefault();
            if (this.note)
                return;
            this.xTouchStart = e.targetTouches[0].clientX;
            this.note = new Note(this.noteNumber);
            this.note.start();
            this.enableHighlight();
        });
        this.div.addEventListener('touchmove', e => {
            var _a;
            e.preventDefault();
            const xMouse = e.targetTouches[0].clientX;
            const pitchChange = (xMouse - this.xTouchStart) / (diameter + spacing);
            (_a = this.note) === null || _a === void 0 ? void 0 : _a.changePitch(pitchChange);
            this.div.style.left = `${this.x + (xMouse - this.xTouchStart)}px`;
        });
        this.div.addEventListener('touchend', e => {
            var _a;
            e.preventDefault();
            (_a = this.note) === null || _a === void 0 ? void 0 : _a.stop();
            this.note = undefined;
            this.disableHighlight();
            this.div.style.left = `${this.x}px`;
        });
    }
    appendTo(parent) {
        parent.appendChild(this.div);
    }
    enableHighlight() {
        this.div.classList.add('note-button-active');
        this.div.style.zIndex = '1';
    }
    disableHighlight() {
        this.div.classList.remove('note-button-active');
        this.div.style.zIndex = 'auto';
    }
}
export default NoteButton;
