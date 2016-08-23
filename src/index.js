import request from 'request';

const j = request.jar();
const req = request.defaults({jar: j});

const DEFAULTS = {
  host: 'http://127.0.0.1:8080/',
  username: 'admin',
  password: 'swordfish'
};

const getDefer = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

const init = (options, form) => {
  const opt = Object.assign({}, DEFAULTS, options);
  const credentials = {
    z_username: opt.username,
    z_password: opt.password,
    z_csrf_protection: 'off'
  };
  const deferred = getDefer();
  req.get({url: opt.host, jar: j, rejectUnauthorized: false}, () => {
    req.post({
      url: `${opt.host}z_security_check`,
      form: credentials,
      jar: j,
      rejectUnauthorized: false
    }, (err) => {
      if (err) {
        throw err;
      }
      req.post({
        url: `${opt.host}reports/events/list`,
        form,
        jar: j,
        rejectUnauthorized: false
      }, (errr, res) => {
        if (errr) {
          deferred.reject(errr);
        }
        try {
          // console.log(res.body);
          const obj = JSON.parse(res.body);
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
