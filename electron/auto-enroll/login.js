const fs = require('fs');
const puppeteer = require('puppeteer');
const { ipcRenderer } = require('electron'); //eslint-disable-line
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
      // await page.screenshot({ path: `${__dirname}/snapshot/login11.png` });
    } else {
      await loginIframe.type('#mobile-number-textbox', phoneNum); // 手机号
      await loginIframe.type('#number-textbox', password); // 验证码
      await loginIframe.click('#login-button-mobile'); // 点击登录
    }

    await page.waitForNavigation();
    console.log('Login Success!');
  } catch (e) {
    console.log('Login error:', e.message);
    throw new Error('登录失败');
  }
}

const saveCookie = cookie =>
  new Promise((resolve, rejecct) => {
    fs.writeFile(
      `${__dirname}/cookie.json`,
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

async function handleLogin(phoneNum, password, isPasswordLogin = true) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await login(page, phoneNum, password, isPasswordLogin);
    const cookieObj = await page.cookies(DA_ZONG_URL);
    cookieObj.push({ name: 'loginTime', value: Date.now() });
    await saveCookie(cookieObj);
  } catch (e) {
    throw new Error('登录失败');
  }
}

module.exports = handleLogin;
