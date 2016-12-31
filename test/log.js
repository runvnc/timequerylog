'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var test = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /*  log('req',{blah:100});
              log('req',{url:'http://google.com'});
            
              log('req',{cat:100}, new Date('2015-05-01T23:50:59.392Z'));
              log('req',{cat:100}, new Date('2015-05-01T23:51:53.312Z'));
              log('req',{dog:1000});
              log('req',{dog:1000});
              log('req',{dog:1000});
            */
            (0, _log.log)('event', { category: 'science', action: 'new' }, new Date('2015-05-01 00:00:00 GMT'));
            _context.next = 3;
            return (0, _delay2.default)(1000);

          case 3:
            (0, _log.log)('event', { category: 'general', action: 'edit', day: null });
            (0, _log.log)('event', { category: 'general', action: 'update' });

            /*
              console.log('Running query');
              let rows = await query('req', moment("1995-12-25").toDate(), new Date(), d=>d.url);
              console.log('rows returned');
              console.log(inspect(rows));
              rows = await queryRecent('req',);
              console.log('queryRecent result:');
              console.log(inspect(rows));
            */
            /*  const matched = queryOpts({type:'req', start: moment('1995-12-25').toDate(),
                                         end: new Date(), match: d => d.dog||d.cat});
              console.log('queryOpts:');
              matched.on('data', console.log);
            */
            //  let i = 0;
            /*  const csvStream = queryOpts({type:'event',
                                           start: moment('1995-12-25').toDate()});
              csvStream.on('data', console.log); */

            //  const csvStream = queryOpts({type:'event', csv: true, timeMS: true,
            //                               start: moment('1995-12-25').toDate(),
            //                               map: (r)=>{r.row = i++;return r}});
            //csvStream.pipe(process.stdout);

          case 5:
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

(0, _log.config)({ path: process.cwd() + '/datalog', noRepeat: { req: true },
  ext: 'msp' });

test().catch(console.error);