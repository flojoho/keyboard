

const buttonGridContainer = document.getElementById('buttonGridContainer');

// buttonGridContainer.addEventListener('touchstart', () => console.log(123));
// document.getElementsByTagName('footer')[0].addEventListener('touchend', () => console.log(123));

export const render = () => {
  const buttonDiameter = 70;
  const spacing = 5;

  const divWidth = buttonGridContainer.offsetWidth;
  const divHeight = buttonGridContainer.offsetHeight;

  const buttonsPerRow = Math.floor(divWidth / (buttonDiameter + spacing));
  const buttonsPerColumn = Math.floor(divHeight / (buttonDiameter + spacing));
  
  const marginX = (divWidth - (buttonsPerRow * (buttonDiameter + spacing))) / 2
  const marginY = (divHeight - (buttonsPerColumn * (buttonDiameter + spacing))) / 2

  for (let countY = 0; countY < buttonsPerColumn; countY++) {
    for(let countX = 0; countX < buttonsPerRow; countX++) {
      const noteButton = document.createElement('div');
      noteButton.classList.add('note-button');

      noteButton.style.width = `${ buttonDiameter }px`;
      noteButton.style.height = `${ buttonDiameter }px`;
      noteButton.style.left = `${ marginX + countX * (buttonDiameter + spacing) }px`;
      noteButton.style.top = `${ marginY + countY * (buttonDiameter + spacing) }px`;

      buttonGridContainer.appendChild(noteButton);
    }
  }
}
