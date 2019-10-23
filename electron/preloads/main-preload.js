const handleLogin = require('../utils/handleLogin');
const onLogin = require('../utils/onLogin');
const onEnroll = require('../utils/onEnroll');
const handleEnroll = require('../utils/handleEnroll');
const enroll = require('../auto-enroll/enroll');
const handleDistanceReceived = require('../utils/handleDistanceReceived');

Object.defineProperty(window, 'Electron', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: Object.freeze({
    handleLogin,
    onLogin,
    enroll,
    onEnroll,
    handleEnroll,
    handleDistanceReceived
  })
});
