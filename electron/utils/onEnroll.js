const { ipcRenderer } = require('electron'); //eslint-disable-line

function onEnroll(handler) {
  ipcRenderer.on('ENROLL_FINISH', handler);
}

module.exports = onEnroll;
