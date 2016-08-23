'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var j = _request2.default.jar();
var req = _request2.default.defaults({ jar: j });

var DEFAULTS = {
  host: 'http://127.0.0.1:8080/',
  username: 'admin',
  password: 'swordfish'
};

var getDefer = function getDefer() {
  var deferred = {};
  deferred.promise = new _promise2.default(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

var init = function init(options, form) {
  var opt = (0, _assign2.default)({}, DEFAULTS, options);
  var credentials = {
    z_username: opt.username,
    z_password: opt.password,
    z_csrf_protection: 'off'
  };
  var deferred = getDefer();
  req.get({ url: opt.host, jar: j, rejectUnauthorized: false }, function () {
    req.post({
      url: opt.host + 'z_security_check',
      form: credentials,
      jar: j,
      rejectUnauthorized: false
    }, function (err) {
      if (err) {
        throw err;
      }
      req.post({
        url: opt.host + 'reports/events/list',
        form: form,
        jar: j,
        rejectUnauthorized: false
      }, function (errr, res) {
        if (errr) {
          deferred.reject(errr);
        }
        try {
          // console.log(res.body);
          var obj = JSON.parse(res.body);
          deferred.resolve(obj);
        } catch (e) {
          deferred.reject(e);
        }
      });
    });
  });
  return deferred.promise;
};

module.exports = init;