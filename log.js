'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryRecent = exports.query = exports.whichFiles = undefined;

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
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(fname) {
    var exists, fexists, encodeStream, fileStream;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!streams[fname]) {
              _context.next = 3;
              break;
            }

            lastAccessTime[fname] = new Date();
            return _context.abrupt('return', streams[fname]);

          case 3:
            _context.next = 5;
            return (0, _pathExists2.default)((0, _path.dirname)(fname));

          case 5:
            exists = _context.sent;

            if (!exists) (0, _mkdirp.sync)((0, _path.dirname)(fname));

            _context.next = 9;
            return (0, _pathExists2.default)(fname);

          case 9:
            fexists = _context.sent;
            encodeStream = null;
            fileStream = (0, _fs3.createWriteStream)(fname, { flags: 'a' });
            _context.t0 = (0, _path.extname)(fname);
            _context.next = _context.t0 === '.msp' ? 15 : 17;
            break;

          case 15:
            encodeStream = _msgpackLite2.default.createEncodeStream();
            return _context.abrupt('break', 19);

          case 17:
            encodeStream = (0, _JSONStream.stringify)(false);
            if (fexists) {
              fileStream.write('\n');
            }

          case 19:
            encodeStream.pipe(fileStream);
            streams[fname] = encodeStream;
            lastAccessTime[fname] = new Date();
            return _context.abrupt('return', encodeStream);

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getWriteStreamExt(_x2) {
    return _ref.apply(this, arguments);
  };
}();

var snappyCompress = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(type, f) {
    var buffer, compressed;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!(f.indexOf('.snappy') > 0)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt('return', false);

          case 3:
            if (!compressing[f]) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt('return', false);

          case 5:
            compressing[f] = true;
            _context2.next = 8;
            return readFilePromise(f);

          case 8:
            buffer = _context2.sent;
            _context2.next = 11;
            return snappyCompressPromise(buffer);

          case 11:
            compressed = _context2.sent;
            _context2.next = 14;
            return writeFilePromise(f + '.snappy', compressed);

          case 14:
            _context2.next = 16;
            return unlinkPromise(f);

          case 16:
            _context2.next = 23;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2['catch'](0);

            console.error('Error in snappy compress:', _context2.t0);
            compressing[f] = false;
            return _context2.abrupt('return', true);

          case 23:
            compressing[f] = false;
            return _context2.abrupt('return', true);

          case 25:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 18]]);
  }));

  return function snappyCompress(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var compressOld = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref4) {
    var type = _ref4.type,
        time = _ref4.time;

    var end, start, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, didIt;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            end = (0, _momentTimezone2.default)(time).tz('UCT').subtract(1, 'hours').toDate();
            ;
            start = new Date('1979-01-01');

            if (oldestSnappy[type]) start = oldestSnappy[type];
            _context3.next = 7;
            return whichFiles(type, start, end);

          case 7:
            files = _context3.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 11;

            for (_iterator = files[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              file = _step.value;
              didIt = snappyCompress(type, file);

              if (didIt) oldestSnappy[type] = (0, _momentTimezone2.default)(end).subtract(2, 'hours');
            }
            _context3.next = 19;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3['catch'](11);
            _didIteratorError = true;
            _iteratorError = _context3.t0;

          case 19:
            _context3.prev = 19;
            _context3.prev = 20;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 22:
            _context3.prev = 22;

            if (!_didIteratorError) {
              _context3.next = 25;
              break;
            }

            throw _iteratorError;

          case 25:
            return _context3.finish(22);

          case 26:
            return _context3.finish(19);

          case 27:
            _context3.next = 29;
            return (0, _delay2.default)(500);

          case 29:
            _context3.next = 35;
            break;

          case 31:
            _context3.prev = 31;
            _context3.t1 = _context3['catch'](0);

            console.error(_context3.t1);
            throw new Error('timequerylog problem compressing old files: ' + _context3.t1.message);

          case 35:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 31], [11, 15, 19, 27], [20,, 22, 26]]);
  }));

  return function compressOld(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var whichFiles = exports.whichFiles = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(type, start, end) {
    var _this = this;

    var startDate, endDate, st, en, dirs, newDirs, result, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, _ret2;

    return _regenerator2.default.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            startDate = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('day').valueOf();
            endDate = (0, _momentTimezone2.default)(end).utcOffset(0).endOf('day').valueOf();
            st = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('hour').valueOf();
            en = (0, _momentTimezone2.default)(end).valueOf();
            dirs = [];
            _context5.prev = 5;
            _context5.next = 8;
            return _fs2.default.readdir(cfg.path + '/' + type + '_GMT');

          case 8:
            dirs = _context5.sent;
            _context5.next = 15;
            break;

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5['catch'](5);
            console.error('timequerylog error reading dirlist: ' + _context5.t0.message + ' cfg.path is ' + cfg.path);return _context5.abrupt('return', []);

          case 15:

            dirs = dirs.sort(byDate);
            newDirs = dirs.filter(function (d) {
              var val = (0, _momentTimezone2.default)(d + ' +0000', 'YYYY-MM-DD Z').valueOf();
              return val >= startDate && val <= endDate;
            });

            if (!(newDirs.length === 0)) {
              _context5.next = 20;
              break;
            }

            console.error('No logs found in date/time range: all dirs found=' + JSON.stringify(dirs) + ' st=' + startDate + ' en=' + endDate + ' matching dirs=' + JSON.stringify(newDirs));
            return _context5.abrupt('return', []);

          case 20:
            ;
            dirs = newDirs;
            result = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context5.prev = 26;
            _loop = _regenerator2.default.mark(function _loop() {
              var dir, files, paths;
              return _regenerator2.default.wrap(function _loop$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      dir = _step2.value;
                      _context4.prev = 1;
                      _context4.next = 4;
                      return _fs2.default.readdir(cfg.path + '/' + type + '_GMT/' + dir);

                    case 4:
                      files = _context4.sent;

                      files = files.sort(byTime);
                      files = files.filter(function (file) {
                        var timeMS = (0, _momentTimezone2.default)(dir + ' ' + file + ' +0000', 'YYYY-MM-DD hhA Z').valueOf();
                        return timeMS >= st && timeMS <= en;
                      });
                      paths = files.map(function (f) {
                        return cfg.path + '/' + type + '_GMT/' + dir + '/' + f;
                      });

                      Array.prototype.push.apply(result, paths);
                      _context4.next = 15;
                      break;

                    case 11:
                      _context4.prev = 11;
                      _context4.t0 = _context4['catch'](1);
                      console.error('Error filtering log files:' + _context4.t0.message);return _context4.abrupt('return', {
                        v: []
                      });

                    case 15:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _loop, _this, [[1, 11]]);
            });
            _iterator2 = dirs[Symbol.iterator]();

          case 29:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context5.next = 37;
              break;
            }

            return _context5.delegateYield(_loop(), 't1', 31);

          case 31:
            _ret2 = _context5.t1;

            if (!((typeof _ret2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret2)) === "object")) {
              _context5.next = 34;
              break;
            }

            return _context5.abrupt('return', _ret2.v);

          case 34:
            _iteratorNormalCompletion2 = true;
            _context5.next = 29;
            break;

          case 37:
            _context5.next = 43;
            break;

          case 39:
            _context5.prev = 39;
            _context5.t2 = _context5['catch'](26);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t2;

          case 43:
            _context5.prev = 43;
            _context5.prev = 44;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 46:
            _context5.prev = 46;

            if (!_didIteratorError2) {
              _context5.next = 49;
              break;
            }

            throw _iteratorError2;

          case 49:
            return _context5.finish(46);

          case 50:
            return _context5.finish(43);

          case 51:
            result = result.filter(function (fname) {
              return !((0, _path.extname)(fname) != '.snappy' && result.includes(fname + '.snappy'));
            });
            return _context5.abrupt('return', result);

          case 53:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee4, this, [[5, 11], [26, 39, 43, 51], [44,, 46, 50]]);
  }));

  return function whichFiles(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

var filterFile = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(fname, start, end, matchFunction) {
    var data;
    return _regenerator2.default.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return new Promise(function (res) {
              try {
                (function () {
                  var results = [];
                  getReadStreamExt(fname, function (stream) {
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
                  });
                })();
              } catch (e) {
                console.error('Error in filterFile:');
                console.error((0, _util.inspect)(e));
              }
            });

          case 2:
            data = _context6.sent;
            return _context6.abrupt('return', data);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee5, this);
  }));

  return function filterFile(_x10, _x11, _x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();

var query = exports.query = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(type, start, end) {
    var matchFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d) {
      return true;
    };

    var files, results, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, fname;

    return _regenerator2.default.wrap(function _callee6$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return whichFiles(type, start, end);

          case 2:
            files = _context7.sent;
            results = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context7.prev = 7;
            _iterator3 = files[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context7.next = 20;
              break;
            }

            fname = _step3.value;
            _context7.t0 = Array.prototype.push;
            _context7.t1 = results;
            _context7.next = 15;
            return filterFile(fname, start, end, matchFunction);

          case 15:
            _context7.t2 = _context7.sent;

            _context7.t0.apply.call(_context7.t0, _context7.t1, _context7.t2);

          case 17:
            _iteratorNormalCompletion3 = true;
            _context7.next = 9;
            break;

          case 20:
            _context7.next = 26;
            break;

          case 22:
            _context7.prev = 22;
            _context7.t3 = _context7['catch'](7);
            _didIteratorError3 = true;
            _iteratorError3 = _context7.t3;

          case 26:
            _context7.prev = 26;
            _context7.prev = 27;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 29:
            _context7.prev = 29;

            if (!_didIteratorError3) {
              _context7.next = 32;
              break;
            }

            throw _iteratorError3;

          case 32:
            return _context7.finish(29);

          case 33:
            return _context7.finish(26);

          case 34:
            return _context7.abrupt('return', results);

          case 35:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee6, this, [[7, 22, 26, 34], [27,, 29, 33]]);
  }));

  return function query(_x14, _x15, _x16, _x17) {
    return _ref7.apply(this, arguments);
  };
}();

var queryRecent = exports.queryRecent = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(type) {
    var end, start, results;
    return _regenerator2.default.wrap(function _callee7$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            end = new Date();
            start = (0, _momentTimezone2.default)(end).subtract(30, 'minutes').toDate();
            _context8.next = 4;
            return query(type, start, end);

          case 4:
            results = _context8.sent;
            return _context8.abrupt('return', results);

          case 6:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee7, this);
  }));

  return function queryRecent(_x19) {
    return _ref8.apply(this, arguments);
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

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFilePromise = (0, _pify2.default)(_fs3.readFile);
var writeFilePromise = (0, _pify2.default)(_fs3.writeFile);
var unlinkPromise = (0, _pify2.default)(_fs3.unlink);

var started = false;
var cfg = { path: process.cwd(), ext: 'jsonl' };
var streams = {};
var lastAccessTime = {};
var q = (0, _queue2.default)({ concurrency: 1 });

setInterval(function () {
  for (var file in lastAccessTime) {
    var now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 900) {
      streams[file].end();
      delete streams[file];
      delete lastAccessTime[file];
    }
  }
}, 1000); //15000

function shutdown() {
  for (var file in streams) {
    try {
      streams[file].end();
    } catch (e) {}
  }
}

process.on('beforeExit', shutdown);
process.on('exit', shutdown);
process.on('SIGINT', function () {
  shutdown();process.exit();
});

function config(conf) {
  Object.assign(cfg, conf);
}

function whichFile(type, datetime) {
  var ext = '.jsonl';
  if (cfg.ext) ext = '.' + cfg.ext;
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

function log(type, obj) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();

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

var compressing = {};

var oldestSnappy = {};

function dolog(type, obj) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();
  var cb = arguments[3];

  try {
    (function () {
      var fname = whichFile(type, time);
      var toWrite = { time: time, type: type };
      for (var key in obj) {
        toWrite[key] = obj[key];
      }getWriteStreamExt(fname).then(function (stream) {
        stream.write(toWrite);
        if (cfg.snappy) {
          (0, _nowOrAgain.nowOrAgainPromise)(type, compressOld, { type: type, time: time }).catch(console.error);
        }
        cb(null);
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

function getReadStreamExt(fname, cb) {
  var ext = (0, _path.extname)(fname),
      input = null;
  if (ext.indexOf('.snappy') >= 0) {
    _fs2.default.stat(fname, function (er2, stat) {
      var buf = new Buffer(stat.size);
      _fs2.default.open(fname, 'r', function (er, fd) {
        _fs2.default.read(fd, buf, 0, stat.size, 0, function (e, bytes, buf2) {
          _snappy2.default.uncompress(buf2, function (err, uncompressed) {
            input = new _streamBuffers.ReadableStreamBuffer({ frequency: 1, chunkSize: 32000 });
            input.put(uncompressed);
            input.stop();
            fname = fname.replace('.snappy', '');
            ext = (0, _path.extname)(fname);
            cb(finishGetReadStreamExt(ext, input));
          });
        });
      });
    });
  } else {
    input = (0, _fs3.createReadStream)(fname);
    cb(finishGetReadStreamExt(ext, input));
  }
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

    _this2.init = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8() {
      return _regenerator2.default.wrap(function _callee8$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return whichFiles(_this2.type, _this2.start, _this2.end);

            case 2:
              _this2.files = _context9.sent;

              _this2.fileNum = 0;
              _this2.rowNum = 0;
              _this2.data = [];
              _this2.initFinished = true;

            case 7:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee8, _this3);
    }));

    _this2.loadFile = function () {
      var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(f) {
        var result;
        return _regenerator2.default.wrap(function _callee9$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (_this2.files) {
                  _context10.next = 3;
                  break;
                }

                _context10.next = 3;
                return _this2.init();

              case 3:
                if (!(_this2.data && _this2.rowNum < _this2.data.length)) {
                  _context10.next = 5;
                  break;
                }

                return _context10.abrupt('return', _this2.data);

              case 5:
                if (!(_this2.files && _this2.fileNum >= _this2.files.length)) {
                  _context10.next = 7;
                  break;
                }

                return _context10.abrupt('return', null);

              case 7:
                if (_this2.data) {
                  _this2.rowNum = 0;
                }
                result = null;
                _context10.prev = 9;
                _context10.next = 12;
                return filterFile(_this2.files[_this2.fileNum++], _this2.start, _this2.end, _this2.match);

              case 12:
                result = _context10.sent;
                _context10.next = 18;
                break;

              case 15:
                _context10.prev = 15;
                _context10.t0 = _context10['catch'](9);

                console.error('filterfile err in loadfile', _context10.t0);

              case 18:
                _this2.data = result;
                return _context10.abrupt('return', result);

              case 20:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee9, _this3, [[9, 15]]);
      }));

      return function (_x20) {
        return _ref10.apply(this, arguments);
      };
    }();

    _this2.nextRow = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
      var row;
      return _regenerator2.default.wrap(function _callee10$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;

              if (_this2.data) {
                _context11.next = 3;
                break;
              }

              return _context11.abrupt('return', null);

            case 3:
              if (!(_this2.rowNum >= _this2.data.length)) {
                _context11.next = 9;
                break;
              }

              _context11.next = 6;
              return _this2.loadFile();

            case 6:
              _this2.data = _context11.sent;

              if (_this2.data) {
                _context11.next = 9;
                break;
              }

              return _context11.abrupt('return', null);

            case 9:
              row = _this2.data[_this2.rowNum];

              _this2.rowNum++;
              return _context11.abrupt('return', row);

            case 14:
              _context11.prev = 14;
              _context11.t0 = _context11['catch'](0);

              console.error('nextRow issue', _context11.t0);

            case 17:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee10, _this3, [[0, 14]]);
    }));

    _this2._read = function () {
      var id = (0, _uuid.v4)();
      _this2.reading = new Promise(function () {
        var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(res) {
          var canPush, i;
          return _regenerator2.default.wrap(function _callee11$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  if (!_this2.reading) {
                    _context12.next = 4;
                    break;
                  }

                  return _context12.abrupt('return', true);

                case 4:
                  //console.log(id, this.type, Date.now(),'!!!! done waiting for this.reading');
                  canPush = true;
                  i = 0;

                case 6:
                  _context12.prev = 6;
                  _context12.next = 9;
                  return _this2.loadFile();

                case 9:
                  _this2.data = _context12.sent;
                  _context12.next = 15;
                  break;

                case 12:
                  _context12.prev = 12;
                  _context12.t0 = _context12['catch'](6);
                  console.trace(_context12.t0);

                case 15:
                  ;
                  //console.log(id, this.type,'waiting for this.nextrow');
                  _context12.next = 18;
                  return _this2.nextRow();

                case 18:
                  _this2.row = _context12.sent;

                  //console.log(id, this.type,'got row ');
                  if (_this2.row) {
                    //console.log(id, 'ok row');
                    if (_this2.timeMS) _this2.row.time = _this2.row.time.getTime();
                    if (_this2.map) _this2.row = _this2.map(_this2.row);
                  } else {
                    //console.log(id, this.type, 'no row');
                  }
                  canPush = _this2.push(_this2.row);

                case 21:
                  if (_this2.row && canPush) {
                    _context12.next = 6;
                    break;
                  }

                case 22:
                  return _context12.abrupt('return', true);

                case 23:
                case 'end':
                  return _context12.stop();
              }
            }
          }, _callee11, _this3, [[6, 12]]);
        }));

        return function (_x21) {
          return _ref12.apply(this, arguments);
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