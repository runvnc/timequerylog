'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.latest = exports.queryRecent = exports.query = exports.whichFiles = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var getWriteStreamExt = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(fname) {
    var exists, fexists, encodeStream, fileStream;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!streams[fname]) {
              _context2.next = 3;
              break;
            }

            lastAccessTime[fname] = new Date();
            return _context2.abrupt('return', streams[fname]);

          case 3:
            _context2.next = 5;
            return (0, _pathExists2.default)((0, _path.dirname)(fname));

          case 5:
            exists = _context2.sent;

            if (!exists) (0, _mkdirp.sync)((0, _path.dirname)(fname));

            _context2.next = 9;
            return (0, _pathExists2.default)(fname);

          case 9:
            fexists = _context2.sent;
            encodeStream = null;
            fileStream = (0, _fs3.createWriteStream)(fname, { flags: 'a' });

            lastWriteTime[fname] = new Date();

            _context2.t0 = (0, _path.extname)(fname);
            _context2.next = _context2.t0 === '.msp' ? 16 : 18;
            break;

          case 16:
            encodeStream = _msgpackLite2.default.createEncodeStream();
            return _context2.abrupt('break', 20);

          case 18:
            encodeStream = (0, _JSONStream.stringify)(false);
            if (fexists) {
              fileStream.write('\n');
            }

          case 20:
            encodeStream.pipe(fileStream);
            streams[fname] = encodeStream;
            lastAccessTime[fname] = new Date();
            return _context2.abrupt('return', encodeStream);

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getWriteStreamExt(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var snappyCompress = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(type, f) {
    var buffer, compressed;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!(f.indexOf('.snappy') > 0)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt('return', false);

          case 3:
            if (!compressing[f]) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt('return', false);

          case 5:
            compressing[f] = true;
            _context3.next = 8;
            return readFilePromise(f);

          case 8:
            buffer = _context3.sent;
            _context3.next = 11;
            return snappyCompressPromise(buffer);

          case 11:
            compressed = _context3.sent;
            _context3.next = 14;
            return writeFilePromise(f + '.snappy', compressed);

          case 14:
            _context3.next = 16;
            return unlinkPromise(f);

          case 16:
            _context3.next = 23;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3['catch'](0);

            console.error('Error in snappy compress:', _context3.t0);
            compressing[f] = false;
            return _context3.abrupt('return', true);

          case 23:
            compressing[f] = false;
            return _context3.abrupt('return', true);

          case 25:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 18]]);
  }));

  return function snappyCompress(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var compressOld = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(_ref5) {
    var type = _ref5.type,
        time = _ref5.time;

    var end, start, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, didIt;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!compressing[type]) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt('return');

          case 2:
            if (!(Date.now() - lastCompress < 1000)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt('return');

          case 4:
            _context4.prev = 4;

            compressing[type] = true;
            lastCompress = Date.now();
            end = (0, _momentTimezone2.default)(time).tz('UCT').subtract(1, 'hours').toDate();
            ;
            start = new Date('1979-01-01');

            if (oldestSnappy[type]) start = oldestSnappy[type];
            _context4.next = 13;
            return whichFiles(type, start, end);

          case 13:
            files = _context4.sent;

            files = files.filter(function (fname) {
              return !fname.includes('.snappy');
            });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 18;
            for (_iterator = files[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              file = _step.value;
              didIt = snappyCompress(type, file);

              if (didIt) oldestSnappy[type] = (0, _momentTimezone2.default)(end).subtract(2, 'hours');
            }
            //await delay(500);
            _context4.next = 26;
            break;

          case 22:
            _context4.prev = 22;
            _context4.t0 = _context4['catch'](18);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 26:
            _context4.prev = 26;
            _context4.prev = 27;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 29:
            _context4.prev = 29;

            if (!_didIteratorError) {
              _context4.next = 32;
              break;
            }

            throw _iteratorError;

          case 32:
            return _context4.finish(29);

          case 33:
            return _context4.finish(26);

          case 34:
            compressing[type] = false;
            _context4.next = 42;
            break;

          case 37:
            _context4.prev = 37;
            _context4.t1 = _context4['catch'](4);

            console.error(_context4.t1);
            compressing[type] = false;
            throw new Error('timequerylog problem compressing old files: ' + _context4.t1.message);

          case 42:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[4, 37], [18, 22, 26, 34], [27,, 29, 33]]);
  }));

  return function compressOld(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

var whichFiles = exports.whichFiles = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(type, start, end) {
    var _this = this;

    var startDate, endDate, st, en, dirs, newDirs, result, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, _ret2;

    return _regenerator2.default.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            startDate = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('day').valueOf();
            endDate = (0, _momentTimezone2.default)(end).utcOffset(0).endOf('day').valueOf();
            st = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('hour').valueOf();
            en = (0, _momentTimezone2.default)(end).valueOf();
            dirs = [];
            _context6.prev = 5;
            _context6.next = 8;
            return _fs2.default.readdir(cfg.path + '/' + type + '_GMT');

          case 8:
            dirs = _context6.sent;
            _context6.next = 15;
            break;

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6['catch'](5);
            console.error('timequerylog error reading dirlist: ' + _context6.t0.message + ' cfg.path is ' + cfg.path);return _context6.abrupt('return', []);

          case 15:

            dirs = dirs.sort(byDate);
            newDirs = dirs.filter(function (d) {
              var val = (0, _momentTimezone2.default)(d + ' +0000', 'YYYY-MM-DD Z').valueOf();
              return val >= startDate && val <= endDate;
            });

            if (!(newDirs.length === 0)) {
              _context6.next = 20;
              break;
            }

            console.error('No logs found in date/time range: all dirs found=' + JSON.stringify(dirs) + ' st=' + startDate + ' en=' + endDate + ' matching dirs=' + JSON.stringify(newDirs));
            return _context6.abrupt('return', []);

          case 20:
            ;
            dirs = newDirs;
            result = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context6.prev = 26;
            _loop = _regenerator2.default.mark(function _loop() {
              var dir, files, paths;
              return _regenerator2.default.wrap(function _loop$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      dir = _step2.value;
                      _context5.prev = 1;
                      _context5.next = 4;
                      return _fs2.default.readdir(cfg.path + '/' + type + '_GMT/' + dir);

                    case 4:
                      files = _context5.sent;

                      files = files.sort(byTime);
                      files = files.filter(function (file) {
                        var timeMS = (0, _momentTimezone2.default)(dir + ' ' + file + ' +0000', 'YYYY-MM-DD hhA Z').valueOf();
                        return timeMS >= st && timeMS <= en;
                      });
                      paths = files.map(function (f) {
                        return cfg.path + '/' + type + '_GMT/' + dir + '/' + f;
                      });

                      Array.prototype.push.apply(result, paths);
                      _context5.next = 15;
                      break;

                    case 11:
                      _context5.prev = 11;
                      _context5.t0 = _context5['catch'](1);
                      console.error('Error filtering log files:' + _context5.t0.message);return _context5.abrupt('return', {
                        v: []
                      });

                    case 15:
                    case 'end':
                      return _context5.stop();
                  }
                }
              }, _loop, _this, [[1, 11]]);
            });
            _iterator2 = dirs[Symbol.iterator]();

          case 29:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context6.next = 37;
              break;
            }

            return _context6.delegateYield(_loop(), 't1', 31);

          case 31:
            _ret2 = _context6.t1;

            if (!((typeof _ret2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret2)) === "object")) {
              _context6.next = 34;
              break;
            }

            return _context6.abrupt('return', _ret2.v);

          case 34:
            _iteratorNormalCompletion2 = true;
            _context6.next = 29;
            break;

          case 37:
            _context6.next = 43;
            break;

          case 39:
            _context6.prev = 39;
            _context6.t2 = _context6['catch'](26);
            _didIteratorError2 = true;
            _iteratorError2 = _context6.t2;

          case 43:
            _context6.prev = 43;
            _context6.prev = 44;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 46:
            _context6.prev = 46;

            if (!_didIteratorError2) {
              _context6.next = 49;
              break;
            }

            throw _iteratorError2;

          case 49:
            return _context6.finish(46);

          case 50:
            return _context6.finish(43);

          case 51:
            result = result.filter(function (fname) {
              return !((0, _path.extname)(fname) != '.snappy' && result.includes(fname + '.snappy'));
            });
            return _context6.abrupt('return', result);

          case 53:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee5, this, [[5, 11], [26, 39, 43, 51], [44,, 46, 50]]);
  }));

  return function whichFiles(_x7, _x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}();

var filterFile = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(fname, start, end, matchFunction) {
    var data;
    return _regenerator2.default.wrap(function _callee6$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return new Promise(function (res) {
              try {
                (function () {
                  var results = [];
                  var n = 0;
                  getReadStreamExt(fname, function (data) {
                    if (data.length) res(matchRows({ data: data, start: start, end: end, matchFunction: matchFunction }));else {
                      data.pipe((0, _eventStream.mapSync)(function (row) {
                        row.time = new Date(row.time);
                        if (row.time >= start && row.time <= end && matchFunction(row)) {
                          results.push(row);
                          return row;
                        }
                      }));
                      data.on('end', function () {
                        res(results);
                      });
                    }
                  });
                })();
              } catch (e) {
                console.error('Error in filterFile:');
                console.error((0, _util.inspect)(e));
              }
            });

          case 2:
            data = _context7.sent;
            return _context7.abrupt('return', data);

          case 4:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee6, this);
  }));

  return function filterFile(_x10, _x11, _x12, _x13) {
    return _ref8.apply(this, arguments);
  };
}();

var query = exports.query = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(type, start, end) {
    var matchFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d) {
      return true;
    };

    var files, results, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, fname;

    return _regenerator2.default.wrap(function _callee7$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return whichFiles(type, start, end);

          case 2:
            files = _context8.sent;
            results = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context8.prev = 7;
            _iterator3 = files[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context8.next = 20;
              break;
            }

            fname = _step3.value;
            _context8.t0 = Array.prototype.push;
            _context8.t1 = results;
            _context8.next = 15;
            return filterFile(fname, start, end, matchFunction);

          case 15:
            _context8.t2 = _context8.sent;

            _context8.t0.apply.call(_context8.t0, _context8.t1, _context8.t2);

          case 17:
            _iteratorNormalCompletion3 = true;
            _context8.next = 9;
            break;

          case 20:
            _context8.next = 26;
            break;

          case 22:
            _context8.prev = 22;
            _context8.t3 = _context8['catch'](7);
            _didIteratorError3 = true;
            _iteratorError3 = _context8.t3;

          case 26:
            _context8.prev = 26;
            _context8.prev = 27;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 29:
            _context8.prev = 29;

            if (!_didIteratorError3) {
              _context8.next = 32;
              break;
            }

            throw _iteratorError3;

          case 32:
            return _context8.finish(29);

          case 33:
            return _context8.finish(26);

          case 34:
            return _context8.abrupt('return', results);

          case 35:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee7, this, [[7, 22, 26, 34], [27,, 29, 33]]);
  }));

  return function query(_x14, _x15, _x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}();

var queryRecent = exports.queryRecent = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(type) {
    var end, start, results;
    return _regenerator2.default.wrap(function _callee8$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            end = new Date();
            start = (0, _momentTimezone2.default)(end).subtract(30, 'minutes').toDate();
            _context9.next = 4;
            return query(type, start, end);

          case 4:
            results = _context9.sent;
            return _context9.abrupt('return', results);

          case 6:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee8, this);
  }));

  return function queryRecent(_x19) {
    return _ref10.apply(this, arguments);
  };
}();

var latest = exports.latest = function () {
  var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(type) {
    var start, end, files, match, data, last;
    return _regenerator2.default.wrap(function _callee15$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            start = new Date('01-01-1980');

            if (lastUpdateTime[type]) start = lastUpdateTime[type];
            end = Date.now();
            _context16.next = 5;
            return whichFiles(type, start, end);

          case 5:
            files = _context16.sent;

            if (!(!files || files && files.length == 0)) {
              _context16.next = 8;
              break;
            }

            return _context16.abrupt('return');

          case 8:
            match = function match(r) {
              return true;
            };

            _context16.next = 11;
            return filterFile(files[files.length - 1], start, end, match);

          case 11:
            data = _context16.sent;
            last = null;

            if (data) last = data[data.length - 1];

            if (!last) {
              _context16.next = 18;
              break;
            }

            delete last.time;
            delete last.type;
            return _context16.abrupt('return', last);

          case 18:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee15, this);
  }));

  return function latest(_x22) {
    return _ref17.apply(this, arguments);
  };
}();

exports.config = config;
exports.whichFile = whichFile;
exports.log = log;
exports.queryOpts = queryOpts;

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

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _queue = require('queue');

var _queue2 = _interopRequireDefault(_queue);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _msgpackLite = require('msgpack-lite');

var _msgpackLite2 = _interopRequireDefault(_msgpackLite);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _snappy = require('snappy');

var _snappy2 = _interopRequireDefault(_snappy);

var _delay = require('delay');

var _delay2 = _interopRequireDefault(_delay);

var _streamBuffers = require('stream-buffers');

var _nowOrAgain = require('now-or-again');

var _uuid = require('uuid');

var _timed = require('timed');

var _timed2 = _interopRequireDefault(_timed);

var _signalExit = require('signal-exit');

var _signalExit2 = _interopRequireDefault(_signalExit);

var _streamCollect = require('stream-collect');

var _streamCollect2 = _interopRequireDefault(_streamCollect);

var _string_decoder = require('string_decoder');

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var opts = { max: 500000000,
  length: function length(n, key) {
    return n.length;
  },
  dispose: function dispose(key, n) {
    true;
  },
  maxAge: 1000 * 60 * 60 };
var cache = (0, _lruCache2.default)();

var snappyCompressPromise = (0, _pify2.default)(_snappy2.default.compress);
var readFilePromise = (0, _pify2.default)(_fs3.readFile);
var writeFilePromise = (0, _pify2.default)(_fs3.writeFile);
var unlinkPromise = (0, _pify2.default)(_fs3.unlink);
var dologPromise = (0, _pify2.default)(dolog);

var started = false;
var cfg = { path: process.cwd(), ext: 'jsonl' };
var streams = {};
var lastAccessTime = {};
var lastWriteTime = {};
var lastUpdateTime = {};
var q = (0, _queue2.default)({ concurrency: 1 });

setInterval(function () {
  for (var file in lastAccessTime) {
    var now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 900 && now - lastWriteTime[file].getTime() > 15000) {
      console.log('ending and deleting stream', file);
      streams[file].end();
      delete streams[file];
      delete lastAccessTime[file];
      lastWriteTime[file] = new Date();
    }
  }
}, 1000); //15000

function closeStreams() {
  for (var file in streams) {
    try {
      console.log('calling end on stream for file', file);
      streams[file].end();
    } catch (e) {}
  }
  console.log('closed');
}

var cleanup = function cleanup(code, signal) {
  if (q.length > 0) q.on('end', function () {
    closeStreams();
    process.exit();
  });else {
    closeStreams();
    process.exit();
  }
};

//onExit(cleanup);
process.on('SIGINT', cleanup);

function config(conf) {
  Object.assign(cfg, conf);
}

function whichFile(type, datetime) {
  var ext = '.jsonl';
  if (cfg.ext) ext = '.' + cfg.ext;
  //console.log('type =',type,'ext =',ext);
  var gmt = (0, _momentTimezone2.default)(datetime).utcOffset(0);
  return cfg.path + '/' + type + '_GMT/' + gmt.format('YYYY-MM-DD/hhA') + ext;
}

q.on('timeout', function (next) {
  console.error('queue timed out');
  next();
});

var lastData = {};

function getConfig(type, opt, default_) {
  if (!cfg.hasOwnProperty(opt)) return default_;
  if (!((0, _typeof3.default)(cfg[opt]) == 'object')) return cfg[opt];
  // use glob/minimatch to match cfg[opt]
  if (cfg.noRepeat.hasOwnProperty(type) && cfg.noRepeat[type] === true) return true;
  return false;
}

function noRepeat(type) {
  if (!cfg.hasOwnProperty('noRepeat')) return false;
  if (cfg.noRepeat === true) return true;
  if (cfg.noRepeat.hasOwnProperty(type) && cfg.noRepeat[type] === true) return true;
  return false;
}

var c = 0;
var completed = 0;
var out = [];
var currentLogging = null;
var memlog = [];

process.on('tql', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  var _out$pop, type, currentState, time, cstr, newLogging;

  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return currentLogging;

        case 2:
          c++;
          _out$pop = out.pop(), type = _out$pop.type, currentState = _out$pop.currentState, time = _out$pop.time;
          cstr = c.toString();
          newLogging = dologPromise(type, currentState, time);

          currentLogging = newLogging;
          _context.next = 9;
          return newLogging;

        case 9:
          completed++;

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));

function log(type, obj) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();

  //if (cfg.ignore && cfg.ignore == true) return;
  lastUpdateTime[type] = time;
  obj.time = time;
  if (noRepeat(type)) {
    var copyTime = null;
    copyTime = new Date(obj.time.getTime());
    delete obj['time'];
    if (lastData.hasOwnProperty(type) && (0, _deepEqual2.default)(lastData[type], obj)) {
      obj.time = copyTime;
      return;
    }
    lastData[type] = (0, _lodash2.default)(obj);
    obj.time = copyTime;
  }
  //if (cfg.memory && cfg.memory == true) {
  //  memlog.push(obj);
  //  return;
  //}

  var currentState = JSON.stringify(obj);
  q.push(function (cb) {
    dolog(type, currentState, time, cb);
  });
  //out.push({type, currentState, time});
  //process.emit('tql');
  if (!started) {
    started = true;
    q.start(function (e) {
      started = false;
      if (e) console.error('Error running queue: ', e);
    });
  }
}

var compressing = {};

var oldestSnappy = {};
var lastCompress = 0;

function dolog(type, obj) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();
  var cb = arguments[3];

  try {
    (function () {
      obj = JSON.parse(obj);
      var fname = whichFile(type, time);
      var toWrite = { time: time, type: type };
      for (var key in obj) {
        toWrite[key] = obj[key];
      }getWriteStreamExt(fname).then(function (stream) {
        stream.write(toWrite);
        if (cfg.snappy) {
          compressOld({ type: type, time: time }).then(cb);
        } else {
          cb(null, null);
        }
      });
    })();
  } catch (e) {
    console.error(e);
  }
}

function byDate(a, b) {
  var dt = function dt(d) {
    return (0, _momentTimezone2.default)(d, 'YYYY-MM-DD');
  };
  if (dt(a).valueOf() < dt(b).valueOf()) return -1;
  if (dt(a).valueOf() > dt(b).valueOf()) return 1;
  return 0;
}

function byTime(a, b) {
  var dt = function dt(d) {
    return (0, _momentTimezone2.default)('2015-12-01 ' + d, 'YYYY-MM-DD hhA');
  };
  if (dt(a).valueOf() < dt(b).valueOf()) return -1;
  if (dt(a).valueOf() > dt(b).valueOf()) return 1;
  return 0;
}

function finishGetReadStreamExt(ext, input) {
  var ret = null;
  switch (ext) {
    case '.msp':
      ret = _msgpackLite2.default.createDecodeStream();
      input.pipe(ret);
      return ret;
      break;
    default:
      ret = (0, _JSONStream.parse)();
      input.pipe(ret);
      return ret;
  }
}

function checkCache(fname, cb) {
  var cached = cache.get(fname);
  if (cached) {
    cb(cached);
    return;
  }
  _fs2.default.stat(fname, function (er2, stat) {
    var buf = new Buffer(stat.size);
    _fs2.default.open(fname, 'r', function (er, fd) {
      _fs2.default.read(fd, buf, 0, stat.size, 0, function (e, bytes, buf2) {
        _snappy2.default.uncompress(buf2, function (err, uncompressed) {
          cache.set(fname, uncompressed);
          cb(uncompressed);
        });
      });
    });
  });
}

var utf8Decoder = new _string_decoder.StringDecoder('utf8');

function jsonlToArray(buffer) {
  var jsonl = utf8Decoder.end(buffer);
  var lines = jsonl.split("\n");
  var arr = [];
  for (var n = 0; n < lines.length; n++) {
    arr.push(JSON.parse(lines[n]));
  }return arr;
}

function getReadStreamExt(fname, cb) {
  var ext = (0, _path.extname)(fname),
      input = null;
  if (ext.indexOf('.snappy') >= 0) {
    checkCache(fname, function (uncompressed) {
      cb(jsonlToArray(uncompressed));
      //input = new ReadableStreamBuffer({frequency:1,chunkSize:16000});
      //input.put(uncompressed);
      //input.stop();
      //fname = fname.replace('.snappy','');
      //ext = extname(fname);
      //cb(finishGetReadStreamExt(ext, input));
    });
  } else {
    input = (0, _fs3.createReadStream)(fname);
    cb(finishGetReadStreamExt(ext, input));
  }
}

function matchRows(_ref7) {
  var data = _ref7.data,
      start = _ref7.start,
      end = _ref7.end,
      matchFunction = _ref7.matchFunction;

  var results = [];
  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    r.time = new Date(r.time);
    results.push(r);
    //if (r.time >= start && r.time <= end &&
    //   matchFunction(r))
    //  results.push(r);
  }
  return results;
}

function fmt(dt) {
  return (0, _momentTimezone2.default)(dt).format('YYYY-MM-DD hh:mm:ss A');
}

var QueryStream = function (_Readable) {
  (0, _inherits3.default)(QueryStream, _Readable);

  function QueryStream(options) {
    var _this3 = this;

    (0, _classCallCheck3.default)(this, QueryStream);

    options.objectMode = true;

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (QueryStream.__proto__ || Object.getPrototypeOf(QueryStream)).call(this, options));

    _this2.init = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
      return _regenerator2.default.wrap(function _callee9$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return whichFiles(_this2.type, _this2.start, _this2.end);

            case 2:
              _this2.files = _context10.sent;

              _this2.fileNum = 0;
              _this2.rowNum = 0;
              _this2.data = null;
              _this2.fileData = [];
              _this2.initFinished = true;

            case 8:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee9, _this3);
    }));
    _this2.checkPreload = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
      var preloads, xx, _loop2, n;

      return _regenerator2.default.wrap(function _callee11$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              return _context12.abrupt('return');

            case 3:
              preloads = [];
              xx = 0;

              _loop2 = function _loop2(n) {
                preloads.push((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
                  return _regenerator2.default.wrap(function _callee10$(_context11) {
                    while (1) {
                      switch (_context11.prev = _context11.next) {
                        case 0:
                          xx++;
                          _context11.t0 = _this2.fileData;
                          _context11.next = 4;
                          return filterFile(_this2.files[n], _this2.start, _this2.end, _this2.match);

                        case 4:
                          _context11.t1 = _context11.sent;

                          _context11.t0.push.call(_context11.t0, _context11.t1);

                        case 6:
                        case 'end':
                          return _context11.stop();
                      }
                    }
                  }, _callee10, _this3);
                }))());
              };

              for (n = _this2.fileNum; n < _this2.files.length && n < _this2.fileNum + 3; n++) {
                _loop2(n);
              }

              if (!(preloads.length == 0)) {
                _context12.next = 11;
                break;
              }

              console.log('no preloads.', { fileNum: _this2.fileNum, files: _this2.files.length });
              _context12.next = 13;
              break;

            case 11:
              _context12.next = 13;
              return Promise.all(preloads);

            case 13:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee11, _this3);
    }));

    _this2.loadFile = function () {
      var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(f) {
        var result, st;
        return _regenerator2.default.wrap(function _callee12$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (_this2.files) {
                  _context13.next = 3;
                  break;
                }

                _context13.next = 3;
                return _this2.init();

              case 3:
                if (!(_this2.data && _this2.rowNum < _this2.data.length)) {
                  _context13.next = 5;
                  break;
                }

                return _context13.abrupt('return', _this2.data);

              case 5:
                if (!(_this2.files && _this2.fileNum >= _this2.files.length)) {
                  _context13.next = 7;
                  break;
                }

                return _context13.abrupt('return', null);

              case 7:
                if (_this2.data) {
                  _this2.rowNum = 0;
                }
                result = null;
                _context13.prev = 9;
                st = Date.now();

                if (!(_this2.fileData.length > _this2.fileNum)) {
                  _context13.next = 20;
                  break;
                }

                _this2.data = _this2.fileData[_this2.fileNum++];

                if (!(_this2.data.length === 0)) {
                  _context13.next = 17;
                  break;
                }

                _context13.next = 16;
                return _this2.loadFile();

              case 16:
                return _context13.abrupt('return', _context13.sent);

              case 17:
                return _context13.abrupt('return', _this2.data);

              case 20:
                _context13.next = 22;
                return filterFile(_this2.files[_this2.fileNum++], _this2.start, _this2.end, _this2.match);

              case 22:
                result = _context13.sent;

                if (!(_this2.fileData.length == 0)) {
                  _context13.next = 26;
                  break;
                }

                _context13.next = 26;
                return _this2.checkPreload();

              case 26:
                if (!(result.length === 0)) {
                  _context13.next = 30;
                  break;
                }

                _context13.next = 29;
                return _this2.loadFile();

              case 29:
                return _context13.abrupt('return', _context13.sent);

              case 30:
                _context13.next = 35;
                break;

              case 32:
                _context13.prev = 32;
                _context13.t0 = _context13['catch'](9);

                console.error('filterfile err in loadfile', _context13.t0);

              case 35:
                _this2.data = result;
                return _context13.abrupt('return', result);

              case 37:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee12, _this3, [[9, 32]]);
      }));

      return function (_x20) {
        return _ref14.apply(this, arguments);
      };
    }();

    _this2.nextRow = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13() {
      var row;
      return _regenerator2.default.wrap(function _callee13$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.prev = 0;

              if (_this2.data) {
                _context14.next = 3;
                break;
              }

              return _context14.abrupt('return', null);

            case 3:
              if (!(_this2.rowNum >= _this2.data.length)) {
                _context14.next = 9;
                break;
              }

              _context14.next = 6;
              return _this2.loadFile();

            case 6:
              _this2.data = _context14.sent;

              if (_this2.data) {
                _context14.next = 9;
                break;
              }

              return _context14.abrupt('return', null);

            case 9:
              row = _this2.data[_this2.rowNum];

              _this2.rowNum++;
              return _context14.abrupt('return', row);

            case 14:
              _context14.prev = 14;
              _context14.t0 = _context14['catch'](0);

              console.error('nextRow issue', _context14.t0);

            case 17:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee13, _this3, [[0, 14]]);
    }));

    _this2._read = function () {
      var id = (0, _uuid.v4)();
      _this2.reading = new Promise(function () {
        var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(res) {
          var canPush, i;
          return _regenerator2.default.wrap(function _callee14$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  if (!_this2.reading) {
                    _context15.next = 4;
                    break;
                  }

                  return _context15.abrupt('return', true);

                case 4:
                  canPush = true;
                  i = 0;

                case 6:
                  _context15.prev = 6;

                  if (_this2.data) {
                    _context15.next = 16;
                    break;
                  }

                  _context15.next = 10;
                  return _this2.loadFile();

                case 10:
                  _this2.data = _context15.sent;
                  _context15.next = 13;
                  return _this2.nextRow();

                case 13:
                  _this2.row = _context15.sent;
                  _context15.next = 17;
                  break;

                case 16:
                  _this2.row = _this2.data[_this2.rowNum++];

                case 17:
                  _context15.next = 22;
                  break;

                case 19:
                  _context15.prev = 19;
                  _context15.t0 = _context15['catch'](6);
                  console.trace(_context15.t0);

                case 22:
                  ;
                  _context15.next = 25;
                  return _this2.nextRow();

                case 25:
                  _this2.row = _context15.sent;

                  if (_this2.row === undefined) _this2.row = null;
                  if (!(_this2.row === null)) {
                    if (_this2.timeMS && _this2.row.time.getTime) _this2.row.time = _this2.row.time.getTime();
                    if (_this2.map) _this2.row = _this2.map(_this2.row);
                  } else {}
                  canPush = _this2.push(_this2.row);

                  if (!(_this2.data && _this2.rowNum == _this2.data.length)) {
                    _context15.next = 33;
                    break;
                  }

                  _context15.next = 32;
                  return _this2.loadFile();

                case 32:
                  _this2.data = _context15.sent;

                case 33:
                  if (_this2.row && canPush) {
                    _context15.next = 6;
                    break;
                  }

                case 34:
                  return _context15.abrupt('return', true);

                case 35:
                case 'end':
                  return _context15.stop();
              }
            }
          }, _callee14, _this3, [[6, 19]]);
        }));

        return function (_x21) {
          return _ref16.apply(this, arguments);
        };
      }()).catch(console.error);
    };

    Object.assign(_this2, options);
    _this2.initFinished = false;
    _this2.fileNum = 0;
    return _this2;
  }

  return QueryStream;
}(_stream.Readable);

function queryOpts(options) {
  var type = options.type,
      start = options.start,
      end = options.end,
      match = options.match;

  if (!match) options.match = function (d) {
    return true;
  };
  if (!end) options.end = new Date();
  if (!start) options.start = (0, _momentTimezone2.default)(end).subtract(30, 'minutes').toDate();

  var qs = new QueryStream(options);

  if (options.csv) {
    var csvWriter = require('csv-write-stream');
    var obj2csv = csvWriter();
    qs.pipe(obj2csv);
    return obj2csv;
  } else {
    return qs;
  }
}