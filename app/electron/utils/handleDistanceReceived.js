const { ipcRenderer } = require('electron'); //eslint-disable-line

function handleDistanceReceived(distance) {
  ipcRenderer.send('DISTANCE_RECEIVED', distance);
}

module.exports = handleDistanceReceived;
