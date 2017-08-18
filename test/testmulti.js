'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var test = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var types, req, args, results;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Current high-res time:", (0, _log.hrms)());

            _context.next = 3;
            return (0, _log.getTypes)('*');

          case 3:
            types = _context.sent;

            console.log(types);
            _context.next = 7;
            return (0, _log.getTypes)('r*');

          case 7:
            req = _context.sent;

            console.log(req);

            (0, _log.log)('testhr', { n: 'tom', hrtime: (0, _log.hrms)() });
            (0, _log.log)('testhr', { n: 'bob', hrtime: (0, _log.hrms)() });
            _context.next = 13;
            return (0, _delay2.default)(10);

          case 13:
            args = { typeGlob: '*', start: new Date('1980-01-01'),
              end: Date.now() };
            _context.next = 16;
            return (0, _log.queryMultiArray)(args);

          case 16:
            results = _context.sent;

            console.log(results);

            _context.next = 20;
            return (0, _delay2.default)(1000);

          case 20:
            console.log('active requests:', process._getActiveRequests());
            console.log('active handles:', process._getActiveHandles());

          case 22:
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _log.config)({ path: 'datalog' });

test().catch(console.error);