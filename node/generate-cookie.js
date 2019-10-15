const fs = require('fs');

const formateCookie = cookie => {
  const keyValues = cookie.split(';');
  const cookieBase = {
    domain: '.dianping.com',
    path: '/',
    httpOnly: false,
    secure: false
  };
  const formatedCookie = keyValues.map(str => {
    const [name, value] = str.trim().split('=');
    return { ...cookieBase, name, value };
  });
  formatedCookie.unshift({ ...cookieBase, name: 'dper', value: '' });
  console.log(formatedCookie);
  return formatedCookie;
};

const generateCookie = () => {
  const cookie = process.argv[2];
  if (cookie) {
    const formatedCookie = formateCookie(cookie);
    fs.writeFile(
      `${__dirname}/cookie.json`,
      JSON.stringify(formatedCookie, null, '  '),
      err => {
        if (err) {
          console.error(err);
        }
      }
    );
  } else {
    console.error('Please enter cookie');
  }
};

generateCookie();
