const fs = require('fs');
const path = require('path');

function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

const genTransactionId = function () {
  return Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
};

const cleanUpPath = function (debug, transactionId, baseDir, files) {
  try {
    // process.env.ANSIBLE_HOST_KEY_CHECKING = '';
    process.env.ANSIBLE_LOAD_CALLBACK_PLUGINS = false;
    process.env.ANSIBLE_STDOUT_CALLBACK = 'default';
    if (fs.existsSync(baseDir)) {
      if (files != null) {
        files.forEach((file) => {
          const filePath = path.join(baseDir, file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            if (debug) {
              console.error(`${file} does not exist`);
            }
          }
        });
      }
      fs.rmdirSync(baseDir, { recursive: true });
    } else {
      if (debug) {
        console.error(`${baseDir} does not exist`);
      }
    }
    if (debug) {
      console.log(`${transactionId == null ? '' : transactionId} Cleanup done`);
    }
  } catch (cleaningError) {
    if (debug) {
      console.log('Cleaning up gone wrong: ', cleaningError);
    }
  }
};

// invoke like so: randPassword(5,3,2);
function randPassword(letters, numbers, either) {
  const chars = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', // letters
    '0123456789', // numbers
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // either
  ];

  return [letters, numbers, either]
    .map(function (len, i) {
      return Array(len)
        .fill(chars[i])
        .map(function (x) {
          return x[Math.floor(Math.random() * x.length)];
        })
        .join('');
    })
    .concat()
    .join('')
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');
}

module.exports = {
  sleep,
  genTransactionId,
  cleanUpPath,
  randPassword,
};
