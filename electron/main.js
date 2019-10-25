/* eslint-disable import/no-extraneous-dependencies */
// Modules to control application life and create native browser window
const electron = require('electron');
const path = require('path');

const { app, BrowserWindow, ipcMain } = electron;
const handleLogin = require('./auto-enroll/login');
const enroll = require('./auto-enroll/enroll');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().size; // eslint-disable-line
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preloads', 'main-preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:1989');
  } else {
    mainWindow.loadURL(
      `file://${path.join(app.getAppPath(), 'build', 'index.html')}`
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('LOGIN', async (event, phoneNum, password) => {
  try {
    await handleLogin(phoneNum, password);
    const isLoginSuccess = true;
    event.sender.send('LOGIN_FINISH', isLoginSuccess);
  } catch (e) {
    console.log('Login Error:', e);
    const isLoginSuccess = false;
    event.sender.send('LOGIN_FINISH', isLoginSuccess);
  }
});

ipcMain.on('ENROLL', async event => {
  try {
    const handleEnrollSuccess = data => {
      event.sender.send('ENROLL_FINISH', data);
    };
    await enroll(handleEnrollSuccess);
  } catch (e) {
    console.log(e);
    event.sender.send('ENROLL_FINISH', { code: 503, msg: e.message });
  }
});
