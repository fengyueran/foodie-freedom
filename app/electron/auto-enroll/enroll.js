const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const { app, ipcMain } = require('electron');
const { DA_ZONG_URL, LOGIN_URL, MEALS_URL } = require('./config');

const autoLogin = async (page, phone = '13141234125', vertifyCode) => {
  try {
    await page.goto(LOGIN_URL);
    const frames = await page.frames();
    const loginIframe = frames[1];
    await loginIframe.click('.bottom-password-login'); // 账号登录
    await loginIframe.type('#mobile-number-textbox', phone); // 手机号
    await loginIframe.type('#number-textbox', vertifyCode); // 验证码
    await loginIframe.click('#login-button-mobile'); // 点击登录
    await page.waitForNavigation();
    await page.screenshot({ path: `${__dirname}/snapshot/login.png` });
    console.log('Login Success!');
  } catch (e) {
    console.log('Login error', e);
    throw new Error('登录失败');
  }
};

const hasEle = async (page, selector) => {
  try {
    // 确认报名按钮
    await page.waitForSelector(selector, { timeout: 10000 });
    return true;
  } catch (err) {
    return false;
  }
};

// 选择分店
const chooseBranch = async page => {
  try {
    await page.evaluate(() => {
      const select = document.querySelector(`.J_branch`);
      if (select) {
        select.selectedIndex = 2;
      }
    });
    return true;
  } catch (err) {
    return false;
  }
};

const enrollWithClick = async page => {
  try {
    const enrollBtn = await hasEle(page, '[title="我要报名"]'); // 我要报名按钮
    if (enrollBtn) {
      await page.click('[title="我要报名"]');
      const hasConfirmBtn = await hasEle(page, '[title="确定"]'); // 确认报名按钮
      if (hasConfirmBtn) {
        await chooseBranch(page);
        await page.screenshot({ path: `${__dirname}/snapshot/restaurant.png` });
        await page.click('[title="确定"]');
        await page.screenshot({ path: `${__dirname}/snapshot/restaurant.png` });
        // const data = await page.content();
        // console.log("data", data);
      }
    }
  } catch (e) {
    console.error('enroll error:', e.message);
  }
};

const saveCookie = cookie => {
  fs.writeFile(
    `${__dirname}/cookie.json`,
    JSON.stringify(cookie, null, '  '),
    err => {
      if (err) {
        console.error(err);
      }
    }
  );
};

const getPageList = async page => {
  try {
    const { data } = await axios.post(
      'http://m.dianping.com/activity/static/pc/ajaxList',
      {
        cityId: '2',
        mode: '',
        page,
        type: 1 // 美食
      }
    );

    return data.data;
  } catch (e) {
    return null;
  }
};

const fetchMealList = () =>
  new Promise(resolve => {
    let mealList = [];
    const getMealList = async page => {
      const data = await getPageList(page);
      if (data) {
        const { hasNext, detail } = data;
        mealList = [...detail, ...mealList];
        if (hasNext) {
          getMealList(++page);
        } else {
          resolve(mealList);
        }
      }
    };
    getMealList(0);
  });

const getBranches = async offlineActivityId => {
  try {
    const { data } = await axios({
      url: `${DA_ZONG_URL}/event/${offlineActivityId}`,
      method: 'get'
    });
    const $ = cheerio.load(data);
    const links = [];
    $('.activity-list a').each((index, element) => {
      const el = $(element);
      const link = el.attr('href');
      const title = el.attr('title');
      links.push({ link, title });
    });

    const validLinks = links.filter(
      ({ link }) => link && link.includes('shop')
    );
    const branches = validLinks.map(({ link, title }) => {
      const id = link.replace(/.*\/shop\/(.*)/, `$1`);
      return { id, title };
    });
    return branches;
  } catch (e) {
    console.log('Get branches error', e);
    return null;
  }
};

const getNearestBranch = (branches, cb) =>
  new Promise(resolve => {
    cb({ code: 130, branches });
    const handleDistanceReceived = (event, branchId) => {
      ipcMain.removeListener('DISTANCE_RECEIVED', handleDistanceReceived);
      if (branchId) {
        resolve(branchId);
      } else {
        resolve(branches[0].id);
      }
    };

    ipcMain.on('DISTANCE_RECEIVED', handleDistanceReceived);
  });

const submit = async (offlineActivityId, cookie, cb) => {
  try {
    const enroll = branchId =>
      axios({
        url: 'http://s.dianping.com/ajax/json/activity/offline/saveApplyInfo',
        method: 'post',
        data: {
          offlineActivityId,
          branchId,
          comboId: 1,
          marryStatus: 0,
          usePassCard: 0,
          isShareSina: false,
          isShareQQ: false
        },
        transformRequest: [
          data => {
            let ret = '';
            Object.keys(data).forEach(key => {
              ret += `${encodeURIComponent(key)}=${encodeURIComponent(
                data[key]
              )}&`;
            });
            return ret;
          }
        ],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: cookie
        }
      });
    const { data } = await enroll();

    const {
      msg: { html }
    } = data;
    if (html === '请选择分店') {
      const branches = await getBranches(offlineActivityId);
      if (branches) {
        const branchId = await getNearestBranch(branches, cb);
        const res = await enroll(branchId);
        return res.data;
      }
    }
    return data;
  } catch (e) {
    console.error(e.message);
    return { code: 0, msg: e.message };
  }
};

const findUserInfo = cookie => {
  const info = {};
  cookie.forEach(({ name, value }) => {
    if (name === 'uamo' || name === 'dper' || name === 'loginTime') {
      info[name] = value;
    }
  });
  if (!info.loginTime) {
    info.loginTime = 0;
  }
  return info;
};

const getCookie = async () => {
  try {
    const userDir = app.getPath('userData');
    console.log('userDir', userDir);
    const cookieObj = JSON.parse(
      fs.readFileSync(`${userDir}/DA_ZONG_COOKIE.json`)
    );
    const { dper } = findUserInfo(cookieObj);
    const cookie = `dper=${dper}`;
    return cookie;
  } catch (e) {
    console.log('获取cookie失败', e.message);
    throw new Error('获取cookie失败');
  }
};

const enroll = async cb => {
  try {
    console.log('Start get cookie...');
    const cookie = await getCookie();
    console.log('Get cookie success!\n');

    console.log('Start get meal list...');
    const mealList = await fetchMealList();
    console.log('Get meal list success!\n');
    cb({ code: 100, count: mealList.length });

    console.log('Start enroll...');
    let finishCount = 0;
    for (let i = 0; i < mealList.length; i++) {
      const { offlineActivityId, activityTitle } = mealList[i];
      const res = await submit(offlineActivityId, cookie, cb); // eslint-disable-line
      const {
        code,
        msg: { html }
      } = res;
      // console.log(res);
      cb({ code: 120, finishCount: ++finishCount });
      if (code === 200) {
        console.log('报名成功:', activityTitle);
        cb({ code, title: activityTitle, msg: '报名成功' });
      } else if (html === '请先登录') {
        throw new Error('请先登录');
      } else if (code === 500 && !html.includes('已经报过名了')) {
        cb({ code, title: activityTitle, msg: html });
      }
    }
    cb({ code: 520 });
    console.log('Enroll finish!');
  } catch (e) {
    console.log('e', e.message);
    throw e;
  }
};

module.exports = enroll;
