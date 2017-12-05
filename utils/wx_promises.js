var Promise = require('../vendor/bluebird.js');

/**
 * 微信异步API用bluebird promises封装
 * Author: Simon Liang (simon@divby0.io)
 */

/**
 * 万金油创建微信promise方法
 * all-encompassing way of promisifying wx object
 */
function generatePromise(method_name, post_processing, options) {
  if (wx && typeof(wx[method_name]) === 'function') {
    var p = new Promise(function(resolve, reject) {
      //TODO: we are merely proxying through the options, no checking of options fields as of yet. Any suggestions?

      Object.assign(options, {
        success: function(response) {
          resolve(response);
        },
        fail: function(error) {
          reject(error);
        }
      });

      wx[method_name](options);
    });

    return typeof(post_processing) === 'function' ? p.then(post_processing.bind(null, resolve, reject)) : p;
  }

  // make it uncallable
  return undefined;
}

module.exports = {
  requestPayment: generatePromise.bind(null, 'requestPayment', null),
  getUserInfo: generatePromise.bind(null, 'getUserInfo', null),
  getStorage: generatePromise.bind(null, 'getStorage', null),
  checkSession: generatePromise.bind(null, 'checkSession', null, {}), // no need to put any params
  request: generatePromise.bind(null, 'request', function(resolve, reject, res) {
    if (res.errMsg !== "request:ok" && res.statusCode >= 400) {
      return reject(res);
    }

    resolve(res);
  }),
  login: generatePromise.bind(null, 'login', function(resolve, reject, res) {
    if (!res.code) {
      console.log("no code found in login response, error message - " + res.errMsg);
      return reject(res);
    }
    resolve(res);
  }, {}) // no need to put any params
};
