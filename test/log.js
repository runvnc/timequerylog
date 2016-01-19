'use strict';

require('babel-core');

var _log = require('../log');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var test = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var _this = this;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _log.log)('req', { blah: 100 });
            (0, _log.log)('req', { url: 'http://google.com' });
            setTimeout(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
              var st, en, rows;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      console.log('Running query');
                      st = (0, _moment2.default)("1995-12-25").toDate();
                      en = new Date();
                      _context.prev = 3;
                      _context.next = 6;
                      return (0, _log.query)('req', st, en, function (d) {
                        return d.url;
                      });

                    case 6:
                      rows = _context.sent;

                      console.log('rows returned');
                      console.log((0, _util.inspect)(rows));
                      _context.next = 14;
                      break;

                    case 11:
                      _context.prev = 11;
                      _context.t0 = _context['catch'](3);

                      console.error(_context.t0);

                    case 14:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this, [[3, 11]]);
            })), 1000);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function test() {
    return ref.apply(this, arguments);
  };
})();

test().then(function (f) {
  return console.log('done');
}).catch(function (e) {
  return console.error(e);
});