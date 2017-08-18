'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var testDelOld = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _101DaysAgo, _99DaysAgo, left;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _101DaysAgo = (0, _momentTimezone2.default)().subtract(101, 'days').toDate();
            _99DaysAgo = (0, _momentTimezone2.default)().subtract(99, 'days').toDate();

            console.log(_101DaysAgo);
            (0, _log.log)('request', { url: "http://deleteme.com/1" }, _101DaysAgo);
            (0, _log.log)('request', { url: "http://keepme.com/2" }, _99DaysAgo);
            _context.next = 7;
            return (0, _delay2.default)(1000);

          case 7:
            (0, _log.config)({ deleteOldDays: { request: 100 } });
            _context.next = 10;
            return (0, _delay2.default)(5000);

          case 10:
            _context.next = 12;
            return (0, _log.query)('request', _101DaysAgo, new Date());

          case 12:
            left = _context.sent;

            console.log(left);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function testDelOld() {
    return _ref.apply(this, arguments);
  };
}();

var _timestring = require('timestring');

var _timestring2 = _interopRequireDefault(_timestring);

var _log = require('../log');

var _delay = require('delay');

var _delay2 = _interopRequireDefault(_delay);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _log.config)({ path: 'datalog' });

testDelOld().catch(console.error);