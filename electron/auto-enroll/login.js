const fs = require('fs');
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

    await page.waitForNavigation();
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
  return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

async function handleLogin(phoneNum, password, isPasswordLogin) {
  try {
    const executablePath = getChromiumExecPath();
    log.info('executablePath', executablePath);
    const browser = await puppeteer.launch({
      executablePath
    });
    log.info('000000000');
    const page = await browser.newPage();
    log.info('11111111');
    await login(page, phoneNum, password, isPasswordLogin);
    log.info('22222222');
    const cookieObj = await page.cookies(DA_ZONG_URL);
    log.info('333333');
    await saveCookie(cookieObj);
    log.info('44444444');
  } catch (e) {
    log.error('login error', e.message);
    throw new Error('登录失败');
  }
}

module.exports = handleLogin;
