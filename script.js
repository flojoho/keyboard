function init() {

  const maxGain = 0.1;

  const oscillators = {};
  const noteNumberFromKeyCode = {}; //is not being used at the moment

  const audioCtx = new AudioContext();

  const volume = audioCtx.createGain();
  volume.gain.value = maxGain;
  volume.connect(audioCtx.destination);

  const volumeSlider = document.getElementById('volumeSlider');

  const layout = 0;
  let keyCodes;
  if(layout === 0){
    //right to left:
    keyCodes = [190, 192, 186, 221, 188, 76, 80, 219, 77, 75, 79, 48, 78, 74, 73, 57, 66, 72, 85, 56, 86, 71, 90, 55, 67, 70, 84, 54, 88, 68, 82, 53, 89, 83, 69, 52, 226, 65, 87, 51]
  } else if (layout === 1) {
    //left to right:
    keyCodes = [49, 81, 65, 89, 50, 87, 83, 88, 51, 69, 68, 67, 52, 82, 70, 86, 53, 84, 71, 66, 54, 90, 72, 78, 55, 85, 74, 77, 56, 73, 75, 188, 57, 79, 76, 190, 48, 80, 192, 189, 219, 186, 222];
  } else if (layout === 2) {
    //left hand / right hand
   keyCodes = [16, 226, 89, 88, 67, 86, 20, 65, 83, 68, 70, 71, 81, 87, 69, 82, 84, 90, 50, 51, 52, 53, 54, 55, 66, 78, 77, 188, 190, 189, 72, 74, 75, 76, 192, 222, 85, 73, 79, 80, 186, 187, 56, 57, 48, 219, 221, 8,]
  }
  keyCodes.forEach((cur, index) => {
    addOscillator(cur, index - 24); //minus 24 because otherwise the lowest note is 440Hz; todo: prettier solution for this
  });

  function changeVolume(percentage){ //todo: should i use a number between 0 and 1 instead of percentages?
    volume.gain.value = percentage / 100 * maxGain;
  }

  if(localStorage.getItem('keyboard') !== null){ //todo: improve this isset-function
    const localData = localStorage.getItem('keyboard');
    volumeSlider.value = localData;
    changeVolume(localData);
  }




  function frequencyFromNoteNumber(noteNumber){
    return 440 * 2**(noteNumber / 12);
  }

  function addOscillator(keyCode, noteNumber){
    oscillators[keyCode] = audioCtx.createOscillator();
    oscillators[keyCode].frequency.setValueAtTime(frequencyFromNoteNumber(noteNumber), audioCtx.currentTime);
    oscillators[keyCode].type = "square";
    oscillators[keyCode].start();
  }





  const keyPressed = [];

  function keyGotPressed(keyCode){
    
    //if(noteNumberFromKeyCode[keyCode] !== undefined)
    
    //startNote(noteNumberFromKeyCode[e.keyCode]);
    oscillators[keyCode].connect(volume);
  }

  function keyGotReleased(keyCode){
    
    
    //stopNote(noteNumberFromKeyCode[e.keyCode]);
    oscillators[keyCode].disconnect(volume);
  }

  function keyDown(e){
    
    audioCtx.resume(); //very ugly way of doing it
    
    if(keyPressed[e.keyCode] !== true){
      keyPressed[e.keyCode] = true;
      
      keyGotPressed(e.keyCode);
    }
  }

  function keyUp(e){
    if(keyPressed[e.keyCode] !== false){
      keyPressed[e.keyCode] = false;
      
      keyGotReleased(e.keyCode);
    }
  }

  //**************************** EVENT HANDLING ************************
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  volumeSlider.addEventListener('input', function() {
    changeVolume(volumeSlider.value);
    localStorage.setItem('keyboard', volumeSlider.value);
  });
  
}

document.addEventListener('click', init);
