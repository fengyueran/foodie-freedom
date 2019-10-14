const { ipcRenderer } = require('electron'); //eslint-disable-line

function onLogin(handler) {
  ipcRenderer.on('LOGIN_FINISH', handler);
}

module.exports = onLogin;
