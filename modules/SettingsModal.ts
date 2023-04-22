import { setDiameter, setSpacing } from "./NoteButton.js";
import ButtonGrid from './ButtonGrid.js';
import settings from './settings.js';

const modal = document.getElementById('modal') as HTMLDivElement;
const settingsButton = document.getElementById('settings-button') as HTMLButtonElement;
const closeButton = document.getElementById('close-button') as HTMLButtonElement;
const buttonSizeSlider = document.getElementById('button-size-slider') as HTMLInputElement;
const spacingSizeSlider = document.getElementById('spacing-size-slider') as HTMLInputElement;

buttonSizeSlider.value = settings.get('buttonSize');
spacingSizeSlider.value = settings.get('spacingSize');

const toggleModal = () => {
  modal.classList.toggle('hidden');
}

settingsButton.addEventListener('click', toggleModal);
closeButton.addEventListener('click', toggleModal);

buttonSizeSlider

buttonSizeSlider.addEventListener('input', () => {
  const buttonSize = Number.parseFloat(buttonSizeSlider.value);
  setDiameter(buttonSize);
  ButtonGrid.render();
  settings.set('buttonSize', buttonSize);
});

spacingSizeSlider.addEventListener('input', () => {
  const spacingSize = Number.parseFloat(spacingSizeSlider.value);
  setSpacing(spacingSize);
  ButtonGrid.render();
  settings.set('spacingSize', spacingSize);
});