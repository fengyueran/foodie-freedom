const { ipcRenderer } = require('electron'); //eslint-disable-line

function handleLogin(phoneNum, password) {
  ipcRenderer.send('LOGIN', phoneNum, password);
}

module.exports = handleLogin;
