'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryRecent = exports.query = exports.whichFiles = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var whichFiles = exports.whichFiles = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(type, start, end) {
    var _this = this;

    var startDate, endDate, st, en, dirs, newDirs, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret;

    return _regenerator2.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            startDate = (0, _moment2.default)(start).utcOffset(0).startOf('day').valueOf();
            endDate = (0, _moment2.default)(end).utcOffset(0).endOf('day').valueOf();
            st = (0, _moment2.default)(start).utcOffset(0).startOf('hour').valueOf();
            en = (0, _moment2.default)(end).valueOf();
            dirs = [];
            _context2.prev = 5;
            _context2.next = 8;
            return _fs2.default.readdir(cfg.path + '/' + type + '_GMT');

          case 8:
            dirs = _context2.sent;
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](5);
            console.error('timequerylog error reading dirlist: ' + _context2.t0.message + ' cfg.path is ' + cfg.path);return _context2.abrupt('return', []);

          case 15:

            dirs = dirs.sort(byDate);

            newDirs = dirs.filter(function (d) {
              var val = (0, _moment2.default)(d + ' +0000', 'YYYY-MM-DD Z').valueOf();
              return val >= startDate && val <= endDate;
            });

            if (!(newDirs.length === 0)) {
              _context2.next = 20;
              break;
            }

            console.error('No logs found in date/time range: all dirs found=' + (0, _stringify2.default)(dirs) + ' st=' + startDate + ' en=' + endDate + ' matching dirs=' + (0, _stringify2.default)(newDirs));
            return _context2.abrupt('return', []);

          case 20:
            ;
            dirs = newDirs;
            result = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 26;
            _loop = _regenerator2.default.mark(function _loop() {
              var dir, files, paths;
              return _regenerator2.default.wrap(function _loop$(_context) {
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
                      console.error('Error filtering log files:' + _context.t0.message);return _context.abrupt('return', {
                        v: []
                      });

                    case 15:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _loop, _this, [[1, 11]]);
            });
            _iterator = (0, _getIterator3.default)(dirs);

          case 29:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 37;
              break;
            }

            return _context2.delegateYield(_loop(), 't1', 31);

          case 31:
            _ret = _context2.t1;

            if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
              _context2.next = 34;
              break;
            }

            return _context2.abrupt('return', _ret.v);

          case 34:
            _iteratorNormalCompletion = true;
            _context2.next = 29;
            break;

          case 37:
            _context2.next = 43;
            break;

          case 39:
            _context2.prev = 39;
            _context2.t2 = _context2['catch'](26);
            _didIteratorError = true;
            _iteratorError = _context2.t2;

          case 43:
            _context2.prev = 43;
            _context2.prev = 44;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 46:
            _context2.prev = 46;

            if (!_didIteratorError) {
              _context2.next = 49;
              break;
            }

            throw _iteratorError;

          case 49:
            return _context2.finish(46);

          case 50:
            return _context2.finish(43);

          case 51:
            return _context2.abrupt('return', result);

          case 52:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee, this, [[5, 11], [26, 39, 43, 51], [44,, 46, 50]]);
  }));

  return function whichFiles(_x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var filterFile = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(fname, start, end, matchFunction) {
    var data;
    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return new _promise2.default(function (res) {
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
    return _ref2.apply(this, arguments);
  };
}();

var query = exports.query = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(type, start, end) {
    var matchFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d) {
      return true;
    };

    var files, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, fname;

    return _regenerator2.default.wrap(function _callee3$(_context4) {
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
            _iterator2 = (0, _getIterator3.default)(files);

          case 9:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context4.next = 20;
              break;
            }

            fname = _step2.value;
            _context4.t0 = Array.prototype.push;
            _context4.t1 = results;
            _context4.next = 15;
            return filterFile(fname, start, end, matchFunction);

          case 15:
            _context4.t2 = _context4.sent;

            _context4.t0.apply.call(_context4.t0, _context4.t1, _context4.t2);

          case 17:
            _iteratorNormalCompletion2 = true;
            _context4.next = 9;
            break;

          case 20:
            _context4.next = 26;
            break;

          case 22:
            _context4.prev = 22;
            _context4.t3 = _context4['catch'](7);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t3;

          case 26:
            _context4.prev = 26;
            _context4.prev = 27;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 29:
            _context4.prev = 29;

            if (!_didIteratorError2) {
              _context4.next = 32;
              break;
            }

            throw _iteratorError2;

          case 32:
            return _context4.finish(29);

          case 33:
            return _context4.finish(26);

          case 34:
            return _context4.abrupt('return', results);

          case 35:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee3, this, [[7, 22, 26, 34], [27,, 29, 33]]);
  }));

  return function query(_x10, _x11, _x12, _x13) {
    return _ref3.apply(this, arguments);
  };
}();

var queryRecent = exports.queryRecent = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(type) {
    var end, start, results;
    return _regenerator2.default.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            end = new Date();
            start = (0, _moment2.default)(end).subtract(30, 'minutes').toDate();
            _context5.next = 4;
            return query(type, start, end);

          case 4:
            results = _context5.sent;
            return _context5.abrupt('return', results);

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee4, this);
  }));

  return function queryRecent(_x15) {
    return _ref4.apply(this, arguments);
  };
}();

exports.config = config;
exports.whichFile = whichFile;
exports.log = log;

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

var started = false;
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

q.on('timeout', function () {
  console.error('queue timed out');
  started = false;
});

function log(type, obj) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();

  q.push(function (cb) {
    dolog(type, obj, time, cb);
  });
  if (!started) {
    started = true;
    q.start(function (e) {
      started = false;
      if (e) console.error('Error running queue: ', e);
    });
  }
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
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();
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

function fmt(dt) {
  return (0, _moment2.default)(dt).format('YYYY-MM-DD hh:mm:ss A');
}