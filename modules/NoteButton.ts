import { Note } from './AudioHandler.js';
import settings from './settings.js';

let diameter = settings.get('buttonSize');
let spacing = settings.get('spacingSize');

export const getDiameter = () => {
  return diameter;
}
export const setDiameter = (num: number) => {
  diameter = num;
}
export const getSpacing = () => {
  return spacing;
}
export const setSpacing = (num: number) => {
  spacing = num;
}

class NoteButton {
  #div
  #noteNumber
  #x
  #xTouchStart: number
  #note
  
  constructor(noteNumber: number, x: number, y: number) {
    this.#noteNumber = noteNumber;
    this.#x = x;

    const circle = document.createElement('div');
    circle.classList.add('note-button');
    circle.style.backgroundColor = `hsl(${ noteNumber / 12 * 360 }, 100%, 50%)`;
    circle.style.width = `${ diameter }px`;
    circle.style.height = `${ diameter }px`;

    this.#div = document.createElement('div');
    this.#div.appendChild(circle);
    this.#div.style.position = `absolute`;
    this.#div.style.display = `flex`;
    this.#div.style.justifyContent = `center`;
    this.#div.style.alignItems = `center`;
    this.#div.style.width = `${ diameter + spacing }px`;
    this.#div.style.height = `${ diameter + spacing }px`;
    this.#div.style.left = `${ x }px`;
    this.#div.style.top = `${ y }px`;

    this.#div.addEventListener('touchstart', e => {
      e.preventDefault();
      if(this.#note) return;

      this.#xTouchStart = e.targetTouches[0].clientX;
      
      this.#note = new Note(this.#noteNumber);
      this.#note.start();

      this.#div.classList.add('note-button-active');
    });

    this.#div.addEventListener('touchmove', e => {
      e.preventDefault();

      const xMouse = e.targetTouches[0].clientX

      const pitchChange = (xMouse - this.#xTouchStart) / (diameter + spacing);
      this.#note.changePitch(pitchChange);

      this.#div.style.left = `${ this.#x + (xMouse - this.#xTouchStart) }px`;
    });

    this.#div.addEventListener('touchend', e => {
      e.preventDefault();
      
      this.#note.stop();
      this.#note = undefined;

      this.#div.classList.remove('note-button-active');

      this.#div.style.left = `${ this.#x }px`;
    });
  }

  appendTo(parent) {
    parent.appendChild(this.#div);
  }
}

export default NoteButton;
