const handleLogin = require('../utils/handleLogin');
const onLogin = require('../utils/onLogin');
const enroll = require('../auto-enroll/enroll');

Object.defineProperty(window, 'Electron', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: Object.freeze({
    handleLogin,
    onLogin,
    enroll
  })
});
