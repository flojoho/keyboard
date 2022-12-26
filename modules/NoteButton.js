import { Note } from './AudioHandler.js';
import { spacing } from './ButtonGrid.js';

export const diameter = 80;

// offsetX
// alpha?
// colour

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

      this.#yTouchStart = e.changedTouches[0].clientY;
      
      this.#note = new Note(this.#noteNumber);
      this.#note.start();

      this.#div.classList.add('note-button-active');
    });

    this.#div.addEventListener('touchmove', e => {
      e.preventDefault();

      const pitchChange = (this.#yTouchStart - e.changedTouches[0].clientY) / (diameter + spacing)
      this.#note.changePitch(pitchChange);
    });

    this.#div.addEventListener('touchend', e => {
      e.preventDefault();
      
      this.#note.stop();
      this.#note = undefined;

      this.#div.classList.remove('note-button-active');
    });
  }

  appendTo(parent) {
    parent.appendChild(this.#div);
  }
}

export default NoteButton;
