import { Note } from './AudioHandler.js';

export const diameter = 70;

// offsetX
// alpha?
// colour

class NoteButton {
  #div
  #noteNumber
  #x
  #y
  #note
  
  constructor(noteNumber, x, y) {
    this.#noteNumber = noteNumber;
    this.#x = x;
    this.#y = y;

    this.#div = document.createElement('div');
    this.#div.classList.add('note-button');
    this.#div.style.width = `${ diameter }px`;
    this.#div.style.height = `${ diameter }px`;
    this.#div.style.left = `${ x }px`;
    this.#div.style.top = `${ y }px`;

    this.#div.addEventListener('touchstart', e => {
      e.preventDefault();
      
      this.#note = new Note(this.#noteNumber);
      this.#note.start();

      this.#div.classList.add('note-button-active');
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
