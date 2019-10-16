const { ipcRenderer } = require('electron'); //eslint-disable-line

function handleEnroll() {
  ipcRenderer.send('ENROLL');
}

module.exports = handleEnroll;
