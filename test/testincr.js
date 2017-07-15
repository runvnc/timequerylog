'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var test = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var n, m;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _log.incr)('test2');

          case 2:
            n = _context.sent;

            console.log(n);
            _context.next = 6;
            return (0, _log.incr)('test2');

          case 6:
            n = _context.sent;

            console.log(n);
            _context.next = 10;
            return (0, _log.incr)('test3', Date.now());

          case 10:
            m = _context.sent;

            console.log(m);
            _context.next = 14;
            return (0, _log.incr)('test3');

          case 14:
            m = _context.sent;

            console.log(m);

          case 16:
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

var _delay = require('delay');

var _delay2 = _interopRequireDefault(_delay);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _log.config)({ path: 'datalog' });

test().catch(console.error);