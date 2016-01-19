'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = exports.whichFiles = undefined;
exports.config = config;
exports.whichFile = whichFile;
exports.log = log;

require('babel-core');

require('babel-polyfill');

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _JSONStream = require('JSONStream');

var _fs3 = require('fs');

var _eventStream = require('event-stream');

var _path = require('path');

var _mkdirp = require('mkdirp');

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _queue = require('queue');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var cfg = { path: process.cwd() };
var streams = {};
var lastAccessTime = {};
var q = (0, _queue2.default)({ concurrency: 1 });

setInterval(function () {
  for (var file in lastAccessTime) {
    var now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 31000) {
      streams[file].end();
      delete streams[file];
      delete lastAccessTime[file];
    }
  }
}, 15000);

process.on('beforeExit', function () {
  for (var file in streams) {
    streams[file].end();
  }
});

function config(cfg) {
  cfg = cfg;
}

function whichFile(type, datetime) {
  var gmt = (0, _moment2.default)(datetime).utcOffset(0);
  return cfg.path + '/' + type + '_GMT/' + gmt.format('YYYY-MM-DD/hhA');
}

function log(type, obj) {
  var time = arguments.length <= 2 || arguments[2] === undefined ? new Date() : arguments[2];

  q.push(function (cb) {
    dolog(type, obj, time, cb);
  });
  q.start(function (e) {
    if (e) console.error('Error running queue: ', e);
  });
}

function getWriteStream(fname, cb) {
  if (streams[fname]) {
    lastAccessTime[fname] = new Date();
    return cb(streams[fname]);
  }
  (0, _pathExists2.default)((0, _path.dirname)(fname)).then(function (exists) {
    if (!exists) (0, _mkdirp.sync)((0, _path.dirname)(fname));

    (0, _pathExists2.default)(fname).then(function (fexists) {
      var finish = function finish(continueJSON) {
        var fileStream = (0, _fs3.createWriteStream)(fname, { flags: 'a' });
        var jsonStream = null;
        jsonStream = (0, _JSONStream.stringify)(false);
        if (continueJSON) {
          fileStream.write('\n');
        }
        jsonStream.pipe(fileStream);
        streams[fname] = jsonStream;
        lastAccessTime[fname] = new Date();
        return cb(jsonStream);
      };

      if (fexists) {
        finish(true);
      } else {
        finish(false);
      }
    });
  });
}

function dolog(type, obj) {
  var time = arguments.length <= 2 || arguments[2] === undefined ? new Date() : arguments[2];
  var cb = arguments[3];

  var fname = whichFile(type, time);
  var toWrite = { time: time, type: type };
  for (var key in obj) {
    toWrite[key] = obj[key];
  }getWriteStream(fname, function (stream) {
    stream.write(toWrite);
    cb();
  });
}

var whichFiles = exports.whichFiles = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, start, end) {
    var st, dirs, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // read all dirs in type_GMT
            // sort by date
            // check if date is between start and end
            // if so
            // read all files in type_GMT/dt
            // sort by time
            // for each
            // check if date is between start and end
            // if so
            // add to results
            st = (0, _moment2.default)(start).valueOf();
            dirs = [];
            _context.prev = 2;
            _context.next = 5;
            return _fs2.default.readdir(cfg.path + '/' + type + '_GMT');

          case 5:
            dirs = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](2);
            return _context.abrupt('return', []);

          case 11:
            dirs = dirs.sort(function (a, b) {
              var dt = function dt(d) {
                return (0, _moment2.default)(d, 'YYYY-MM-DD');
              };
              if (dt(a).valueOf() < dt(b).valueOf()) return -1;
              if (dt(a).valueOf() > dt(b).valueOf()) return 1;
              return 0;
            });
            dirs = dirs.filter(function (d) {
              return (0, _moment2.default)(d, 'YYYY-MM-DD').valueOf() >= st;
            });

            if (!(dirs.length === 0)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', []);

          case 15:
            console.log('dirs is ', dirs);
            result = [];
            //if (!(result.indexOf(fname)>=0)) result.push(fname);
            //console.log('whichfiles returning ', result);

            return _context.abrupt('return', result);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 8]]);
  }));

  return function whichFiles(_x3, _x4, _x5) {
    return ref.apply(this, arguments);
  };
})();

var filterFile = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(fname, matchFunction) {
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('filter file fname = ', fname);
            _context2.next = 3;
            return new Promise(function (res) {
              try {
                (function () {
                  var results = [];
                  var file = (0, _fs3.createReadStream)(fname);
                  var stream = (0, _JSONStream.parse)();
                  stream.pipe(es.mapSync(function (data) {
                    if (data.start >= start && data.end <= end && matchFunction(data)) {
                      results.push(data);
                      return data;
                    }
                  }));
                  stream.on('end', function () {
                    res(results);
                  });
                })();
              } catch (e) {
                console.error((0, _util.inspect)(e));
              }
            });

          case 3:
            data = _context2.sent;
            return _context2.abrupt('return', data);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function filterFile(_x6, _x7) {
    return ref.apply(this, arguments);
  };
})();

var query = exports.query = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(type, start, end, matchFunction) {
    var files, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fname;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return whichFiles(type, start, end);

          case 2:
            files = _context3.sent;
            results = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 7;
            _iterator = files[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context3.next = 19;
              break;
            }

            fname = _step.value;
            _context3.t0 = results;
            _context3.next = 14;
            return filterFile(fname, matchFunction);

          case 14:
            _context3.t1 = _context3.sent;

            _context3.t0.push.call(_context3.t0, _context3.t1);

          case 16:
            _iteratorNormalCompletion = true;
            _context3.next = 9;
            break;

          case 19:
            _context3.next = 25;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t2 = _context3['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context3.t2;

          case 25:
            _context3.prev = 25;
            _context3.prev = 26;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 28:
            _context3.prev = 28;

            if (!_didIteratorError) {
              _context3.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return _context3.finish(28);

          case 32:
            return _context3.finish(25);

          case 33:
            return _context3.abrupt('return', results);

          case 34:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[7, 21, 25, 33], [26,, 28, 32]]);
  }));

  return function query(_x8, _x9, _x10, _x11) {
    return ref.apply(this, arguments);
  };
})();

// query it
// try to
// find order ids that are missing
// in pnl report
// show recent requests
// color-coded