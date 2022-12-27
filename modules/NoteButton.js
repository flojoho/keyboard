import { Note } from './AudioHandler.js';
import { spacing } from './ButtonGrid.js';

export const diameter = 80;

class NoteButton {
  #div
  #noteNumber
  #y
  #yTouchStart
  #note
  
  constructor(noteNumber, x, y) {
    this.#noteNumber = noteNumber;
    this.#y = y;

    this.#div = document.createElement('div');
    this.#div.classList.add('note-button');
    this.#div.style.width = `${ diameter }px`;
    this.#div.style.height = `${ diameter }px`;
    this.#div.style.backgroundColor = `hsl(${ noteNumber / 12 * 360 }, 100%, 50%)`;
    this.#div.style.left = `${ x }px`;
    this.#div.style.top = `${ y }px`;

    this.#div.addEventListener('touchstart', e => {
      e.preventDefault();
      if(this.#note) return;

      this.#yTouchStart = e.targetTouches[0].clientY;
      
      this.#note = new Note(this.#noteNumber);
      this.#note.start();

      this.#div.classList.add('note-button-active');
    });

    this.#div.addEventListener('touchmove', e => {
      e.preventDefault();

      const yMouse = e.targetTouches[0].clientY

      const pitchChange = (this.#yTouchStart - yMouse) / (diameter + spacing);
      this.#note.changePitch(pitchChange);

      this.#div.style.top = `${ this.#y + (yMouse - this.#yTouchStart) }px`;
    });

    this.#div.addEventListener('touchend', e => {
      e.preventDefault();
      
      this.#note.stop();
      this.#note = undefined;

      this.#div.classList.remove('note-button-active');

      this.#div.style.top = `${ this.#y }px`;
    });
  }

  appendTo(parent) {
    parent.appendChild(this.#div);
  }
}

export default NoteButton;
