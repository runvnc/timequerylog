'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var test = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var rows, matched;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _log.log)('req', { blah: 100 });
            (0, _log.log)('req', { url: 'http://google.com' });

            (0, _log.log)('req', { cat: 100, time: new Date('2015-05-01T23:50:59.392Z') });
            (0, _log.log)('req', { cat: 100, time: new Date('2015-05-01T23:51:53.312Z') });
            (0, _log.log)('req', { dog: 1000 });
            (0, _log.log)('req', { dog: 1000 });
            (0, _log.log)('req', { dog: 1000 });

            _context.next = 9;
            return (0, _delay2.default)(300);

          case 9:

            console.log('Running query');
            _context.next = 12;
            return (0, _log.query)('req', (0, _moment2.default)("1995-12-25").toDate(), new Date(), function (d) {
              return d.url;
            });

          case 12:
            rows = _context.sent;

            console.log('rows returned');
            console.log((0, _util.inspect)(rows));
            _context.next = 17;
            return (0, _log.queryRecent)('req');

          case 17:
            rows = _context.sent;

            console.log('queryRecent result:');
            console.log((0, _util.inspect)(rows));

            matched = (0, _log.queryOpts)({ type: 'req', start: (0, _moment2.default)('1995-12-25').toDate(),
              end: new Date(), match: function match(d) {
                return d.dog > 100 || d.cat;
              } });

            console.log('queryOpts:');
            console.log(matched);
            matched.on('data', console.log);

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function test() {
    return _ref.apply(this, arguments);
  };
}();

var _log = require('../log');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('util');

var _delay = require('delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _log.config)({ path: process.cwd(), noRepeat: true });

test().catch(console.error);