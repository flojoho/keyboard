import { setDiameter } from "./NoteButton.js";
import ButtonGrid from './ButtonGrid.js';

const modal = document.getElementById('modal');
const settingsButton = document.getElementById('settings-button');
const closeButton = document.getElementById('close-button');
const buttonSizeSlider = document.getElementById('button-size-slider');

const toggleModal = () => {
  modal.classList.toggle('hidden');
}

settingsButton.addEventListener('click', toggleModal);
closeButton.addEventListener('click', toggleModal);

buttonSizeSlider

buttonSizeSlider.addEventListener('input', () => {
  setDiameter(buttonSizeSlider.value);
  ButtonGrid.render();
});