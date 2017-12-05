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

    return typeof(post_processing) === 'function' ? p.then(post_processing) : p;
  }

  // make it uncallable
  return undefined;
}

module.exports = {
  requestPayment: generatePromise.bind(null, 'requestPayment', null),
  getUserInfo: generatePromise.bind(null, 'getUserInfo', null),
  getStorage: generatePromise.bind(null, 'getStorage', null),
  checkSession: generatePromise.bind(null, 'checkSession', null, {}), // no need to put any params
  request: generatePromise.bind(null, 'request', function(res) {
    if (res.errMsg !== "request:ok" && res.statusCode >= 400) {
      var error = new Error('request failed');
      error.response = res;
      return Promise.reject(error);
    }

    return Promise.resolve(res);
  }),
  login: generatePromise.bind(null, 'login', function(res) {
    if (!res.code) {
      console.log("no code found in login response, error message - " + res.errMsg);
      return Promise.reject(res);
    }
    return Promise.resolve(res);
  }, {}) // no need to put any params
};
