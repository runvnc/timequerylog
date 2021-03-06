'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var test = function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var rows, matched, i, csvStream, lastEvent;
                return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                                switch (_context.prev = _context.next) {
                                        case 0:
                                                (0, _log.log)('req', { blah: 100 });
                                                (0, _log.log)('req', { url: 'http://google.com' });

                                                (0, _log.log)('req', { cat: 100 }, new Date('2015-05-01T23:50:59.392Z'));
                                                (0, _log.log)('req', { cat: 100 }, new Date('2015-05-01T23:51:53.312Z'));
                                                (0, _log.log)('req', { dog: 1000 });
                                                (0, _log.log)('req', { dog: 1000 });
                                                (0, _log.log)('req', { dog: 1000 });

                                                (0, _log.log)('event', { category: 'science', action: 'new' }, new Date('2015-05-01 00:00:00 GMT'));
                                                _context.next = 10;
                                                return (0, _delay2.default)(1000);

                                        case 10:
                                                (0, _log.log)('event', { category: 'general', action: 'edit', day: null });
                                                (0, _log.log)('event', { category: 'general', action: 'update' });

                                                console.log('Running query');
                                                _context.next = 15;
                                                return (0, _log.query)('req', (0, _moment2.default)("1995-12-25").toDate(), new Date(), function (d) {
                                                        return d.url;
                                                });

                                        case 15:
                                                rows = _context.sent;

                                                console.log('rows returned');
                                                console.log((0, _util.inspect)(rows));
                                                _context.next = 20;
                                                return (0, _log.queryRecent)('req');

                                        case 20:
                                                rows = _context.sent;

                                                console.log('queryRecent result:');
                                                console.log((0, _util.inspect)(rows));

                                                matched = (0, _log.queryOpts)({ type: 'req', start: (0, _moment2.default)('1995-12-25').toDate(),
                                                        end: new Date(), match: function match(d) {
                                                                return d.dog || d.cat;
                                                        } });

                                                console.log('queryOpts:');
                                                matched.on('data', console.log);

                                                i = 0;
                                                csvStream = (0, _log.queryOpts)({ type: 'event', csv: true, timeMS: true,
                                                        start: (0, _moment2.default)('1995-12-25').toDate(),
                                                        map: function map(r) {
                                                                r.row = i++;return r;
                                                        } });

                                                csvStream.pipe(process.stdout);

                                                _context.next = 31;
                                                return (0, _log.latest)('event');

                                        case 31:
                                                lastEvent = _context.sent;

                                                console.log('last event', lastEvent);
                                                (0, _assert2.default)(lastEvent.action = 'update');

                                        case 34:
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

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _delay = require('delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _log.config)({ path: process.cwd() + '/datalog',
        snappy: 1 });

test().catch(console.error);