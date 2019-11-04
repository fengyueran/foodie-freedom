const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { app } = require('electron');
const log = require('electron-log');
const { LOGIN_URL, DA_ZONG_URL } = require('./config');

async function login(page, phoneNum, password, isPasswordLogin = false) {
  try {
    console.log('Start login...');
    console.log('phoneNum', phoneNum);
    console.log('password', password);
    await page.goto(LOGIN_URL);
    const frames = await page.frames();
    const loginIframe = frames[1];
    await loginIframe.click('.bottom-password-login'); // 账号登录
    if (isPasswordLogin) {
      await loginIframe.click('#tab-account'); // 手机密码登录
      await loginIframe.type('#account-textbox', phoneNum); // 手机号
      await loginIframe.type('#password-textbox', password); // 验证码
      // await page.screenshot({ path: `${__dirname}/snapshot/login.png` });
    } else {
      await loginIframe.type('#mobile-number-textbox', phoneNum); // 手机号
      await loginIframe.type('#number-textbox', password); // 验证码
      await loginIframe.click('#login-button-mobile'); // 点击登录
      // await page.screenshot({ path: `${__dirname}/snapshot/login.png` });
    }

    await page.waitForNavigation({ timeout: 10000 });
    console.log('Login Success!');
  } catch (e) {
    console.log('Login error:', e.message);
    throw new Error('登录失败');
  }
}

const saveCookie = cookie => {
  const userDir = app.getPath('userData');
  return new Promise((resolve, rejecct) => {
    fs.writeFile(
      `${userDir}/DA_ZONG_COOKIE.json`,
      JSON.stringify(cookie, null, '  '),
      err => {
        if (err) {
          console.error('Save cookie error:', err);
          rejecct(err);
        }
        console.log('Save cookie success:', cookie);
        resolve();
      }
    );
  });
};

function getChromiumExecPath() {
  let executablePath;
  if (process.env.NODE_ENV === 'development') {
    executablePath = path.join(
      process.cwd(),
      'chromium',
      'mac-706915/Chromium.app/Contents/MacOS/Chromium'
    );
  } else {
    const appPath = app.getAppPath();
    const unpackedPath = appPath.replace('app.asar', '/');
    log.info('process.platform', process.platform);
    if (process.platform === 'darwin') {
      executablePath = path.join(
        unpackedPath,
        'chromium',
        'mac-706915/Chromium.app/Contents/MacOS/Chromium'
      );
    } else {
      executablePath = path.join(
        unpackedPath,
        'chromium',
        'win-706915/chrome.exe'
      );
    }
  }

  return executablePath;
}

async function handleLogin(phoneNum, password, isPasswordLogin) {
  try {
    const executablePath = getChromiumExecPath();
    log.info('executablePath', executablePath);
    const browser = await puppeteer.launch({
      executablePath
    });
    const page = await browser.newPage();
    await login(page, phoneNum, password, isPasswordLogin);
    const cookieObj = await page.cookies(DA_ZONG_URL);
    await saveCookie(cookieObj);
  } catch (e) {
    log.error('login error', e.message);
    throw new Error('登录失败');
  }
}

module.exports = handleLogin;
