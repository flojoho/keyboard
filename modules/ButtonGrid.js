import NoteButton, { diameter } from './NoteButton.js';

const buttonGridContainer = document.getElementById('buttonGridContainer');

const spacing = 5;

const render = () => {
  const divWidth = buttonGridContainer.offsetWidth;
  const divHeight = buttonGridContainer.offsetHeight;

  const buttonsPerRow = Math.floor(divWidth / (diameter + spacing));
  const buttonsPerColumn = Math.floor(divHeight / (diameter + spacing));
  
  const marginX = (divWidth - (buttonsPerRow * (diameter + spacing))) / 2;
  const marginY = (divHeight - (buttonsPerColumn * (diameter + spacing))) / 2;

  buttonGridContainer.textContent = '';

  for (let countY = 0; countY < buttonsPerColumn; countY++) {
    for(let countX = 0; countX < buttonsPerRow; countX++) {
      const x = marginX + countX * (diameter + spacing);
      const y = marginY + countY * (diameter + spacing);

      const noteNumber = (Math.floor(buttonsPerColumn / 2)) - countY - 5 * (countX - Math.floor(buttonsPerRow / 2))
      const noteButton = new NoteButton(noteNumber, x, y);

      noteButton.appendTo(buttonGridContainer);
    }
  }
}

export default { render };