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

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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

function byDate(a, b) {
  var dt = function dt(d) {
    return (0, _moment2.default)(d, 'YYYY-MM-DD');
  };
  if (dt(a).valueOf() < dt(b).valueOf()) return -1;
  if (dt(a).valueOf() > dt(b).valueOf()) return 1;
  return 0;
}

function byTime(a, b) {
  var dt = function dt(d) {
    return (0, _moment2.default)('2015-12-01 ' + d, 'YYYY-MM-DD hhA');
  };
  if (dt(a).valueOf() < dt(b).valueOf()) return -1;
  if (dt(a).valueOf() > dt(b).valueOf()) return 1;
  return 0;
}

var whichFiles = exports.whichFiles = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, start, end) {
    var _this = this;

    var st, en, dirs, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            st = (0, _moment2.default)(start).valueOf();
            en = (0, _moment2.default)(end).valueOf();
            dirs = [];
            _context2.prev = 3;
            _context2.next = 6;
            return _fs2.default.readdir(cfg.path + '/' + type + '_GMT');

          case 6:
            dirs = _context2.sent;
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](3);
            return _context2.abrupt('return', []);

          case 12:

            dirs = dirs.sort(byDate);
            dirs = dirs.filter(function (d) {
              return (0, _moment2.default)(d + ' +0000', 'YYYY-MM-DD Z').valueOf() >= st;
            });

            if (!(dirs.length === 0)) {
              _context2.next = 16;
              break;
            }

            return _context2.abrupt('return', []);

          case 16:
            result = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 20;
            _loop = regeneratorRuntime.mark(function _loop() {
              var dir, files, paths;
              return regeneratorRuntime.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      dir = _step.value;
                      _context.prev = 1;
                      _context.next = 4;
                      return _fs2.default.readdir(cfg.path + '/' + type + '_GMT/' + dir);

                    case 4:
                      files = _context.sent;

                      files = files.sort(byTime);
                      files = files.filter(function (file) {
                        var timeMS = (0, _moment2.default)(dir + ' ' + file + ' +0000', 'YYYY-MM-DD hhA Z').valueOf();
                        return timeMS >= st && timeMS <= en;
                      });
                      paths = files.map(function (f) {
                        return cfg.path + '/' + type + '_GMT/' + dir + '/' + f;
                      });

                      Array.prototype.push.apply(result, paths);
                      _context.next = 15;
                      break;

                    case 11:
                      _context.prev = 11;
                      _context.t0 = _context['catch'](1);
                      console.error(_context.t0);return _context.abrupt('return', {
                        v: []
                      });

                    case 15:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _loop, _this, [[1, 11]]);
            });
            _iterator = dirs[Symbol.iterator]();

          case 23:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 31;
              break;
            }

            return _context2.delegateYield(_loop(), 't1', 25);

          case 25:
            _ret = _context2.t1;

            if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
              _context2.next = 28;
              break;
            }

            return _context2.abrupt('return', _ret.v);

          case 28:
            _iteratorNormalCompletion = true;
            _context2.next = 23;
            break;

          case 31:
            _context2.next = 37;
            break;

          case 33:
            _context2.prev = 33;
            _context2.t2 = _context2['catch'](20);
            _didIteratorError = true;
            _iteratorError = _context2.t2;

          case 37:
            _context2.prev = 37;
            _context2.prev = 38;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 40:
            _context2.prev = 40;

            if (!_didIteratorError) {
              _context2.next = 43;
              break;
            }

            throw _iteratorError;

          case 43:
            return _context2.finish(40);

          case 44:
            return _context2.finish(37);

          case 45:
            return _context2.abrupt('return', result);

          case 46:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, this, [[3, 9], [20, 33, 37, 45], [38,, 40, 44]]);
  }));

  return function whichFiles(_x3, _x4, _x5) {
    return ref.apply(this, arguments);
  };
})();

var filterFile = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(fname, start, end, matchFunction) {
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return new Promise(function (res) {
              try {
                (function () {
                  var results = [];
                  var file = (0, _fs3.createReadStream)(fname);
                  var stream = (0, _JSONStream.parse)();
                  file.pipe(stream);
                  stream.pipe((0, _eventStream.mapSync)(function (data) {
                    data.time = new Date(data.time);
                    if (data.time >= start && data.time <= end && matchFunction(data)) {
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

          case 2:
            data = _context3.sent;
            return _context3.abrupt('return', data);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, this);
  }));

  return function filterFile(_x6, _x7, _x8, _x9) {
    return ref.apply(this, arguments);
  };
})();

var query = exports.query = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(type, start, end, matchFunction) {
    var files, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, fname;

    return regeneratorRuntime.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return whichFiles(type, start, end);

          case 2:
            files = _context4.sent;
            results = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context4.prev = 7;
            _iterator2 = files[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context4.next = 19;
              break;
            }

            fname = _step2.value;
            _context4.t0 = results;
            _context4.next = 14;
            return filterFile(fname, start, end, matchFunction);

          case 14:
            _context4.t1 = _context4.sent;

            _context4.t0.push.call(_context4.t0, _context4.t1);

          case 16:
            _iteratorNormalCompletion2 = true;
            _context4.next = 9;
            break;

          case 19:
            _context4.next = 25;
            break;

          case 21:
            _context4.prev = 21;
            _context4.t2 = _context4['catch'](7);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t2;

          case 25:
            _context4.prev = 25;
            _context4.prev = 26;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 28:
            _context4.prev = 28;

            if (!_didIteratorError2) {
              _context4.next = 31;
              break;
            }

            throw _iteratorError2;

          case 31:
            return _context4.finish(28);

          case 32:
            return _context4.finish(25);

          case 33:
            return _context4.abrupt('return', results);

          case 34:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee3, this, [[7, 21, 25, 33], [26,, 28, 32]]);
  }));

  return function query(_x10, _x11, _x12, _x13) {
    return ref.apply(this, arguments);
  };
})();