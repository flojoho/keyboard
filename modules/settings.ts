
const defaultSettings = [
  {
    name: 'volume',
    defaultValue: 50
  },
  {
    name: 'transposeOffset',
    defaultValue: 0
  },
  {
    name: 'timbre',
    defaultValue: 'square'
  },
  {
    name: 'buttonSize',
    defaultValue: 85
  },
  {
    name: 'spacingSize',
    defaultValue: 5
  }
]

const defaultJSON = {};
defaultSettings.forEach(setting => {
  const { name, defaultValue } = setting;
  defaultJSON[name] = defaultValue;
});

const savedSettings = localStorage.getItem('settings');
let settings = savedSettings ? JSON.parse(savedSettings) : defaultJSON;

const get = (key: string) => {
  const defaultSetting = defaultSettings.find(setting => setting.name === key);
  if(typeof defaultSetting === 'undefined') throw new Error('Setting not found');
  if(typeof settings[key] === 'undefined') return defaultSetting.defaultValue;

  return settings[key];
}

const set = (key: string, value) => {
  const defaultSetting = defaultSettings.find(setting => setting.name === key);
  if(typeof defaultSetting === 'undefined') throw new Error('Setting not found');
  if(typeof value !== typeof defaultSetting.defaultValue) throw new Error('Wrong value type');

  settings[key] = value;
  localStorage.setItem('settings', JSON.stringify(settings));
}

export default { get, set };
