import AudioHandler from './AudioHandler.js';

export const diameter = 70;

// offsetX
// alpha?
// colour

class NoteButton {
  #div
  #noteNumber
  #x
  #y
  
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

    this.#div.addEventListener('touchstart', () => {
      console.log(this.#x, this.#y)
    });

    this.#div.addEventListener('touchend', () => {
      console.log(this.#x, this.#y)
    });
  }

  appendTo(parent) {
    parent.appendChild(this.#div);
  }
}

export default NoteButton;
