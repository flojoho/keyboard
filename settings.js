
const defaultSettings = {
  volume: 50,
  transposeOffset: 0,
  timbre: 'square'
}

let settings;

const loadSettings = () => {
  const savedSettings = localStorage.getItem('settings');
  settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}
loadSettings();

const saveSettings = () => {
  localStorage.setItem('settings', JSON.stringify(settings));
}

const get = (key) => {
  if(typeof defaultSettings[key] === 'undefined') throw new Error('Setting does not exist!');
  if(typeof settings[key] === 'undefined') return defaultSettings[key];
  return settings[key];
}

const set = (key, value) => {
  if(typeof defaultSettings[key] === 'undefined') throw new Error('Setting does not exist!');
  settings[key] = value;
  saveSettings();
}

export default { get, set };

