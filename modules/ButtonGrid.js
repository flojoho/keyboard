import NoteButton, { getDiameter } from './NoteButton.js';

const buttonGridContainer = document.getElementById('buttonGridContainer');

const render = () => {
  const divWidth = buttonGridContainer.offsetWidth;
  const divHeight = buttonGridContainer.offsetHeight;

  const diameter = getDiameter();

  const buttonsPerRow = Math.floor(divWidth / diameter);
  const buttonsPerColumn = Math.floor(divHeight / diameter);
  
  const marginX = (divWidth - (buttonsPerRow * diameter)) / 2;
  const marginY = (divHeight - (buttonsPerColumn * diameter)) / 2;

  buttonGridContainer.textContent = '';

  for (let countY = 0; countY < buttonsPerColumn; countY++) {
    for(let countX = 0; countX < buttonsPerRow; countX++) {
      const x = marginX + countX * diameter;
      const y = marginY + countY * diameter;

      const noteNumber = countX - (Math.floor(buttonsPerRow / 2)) - 5 * (countY - Math.floor(buttonsPerColumn / 2));
      const noteButton = new NoteButton(noteNumber, x, y);

      noteButton.appendTo(buttonGridContainer);
    }
  }
}

export default { render };