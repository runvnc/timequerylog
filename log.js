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

            console.log('trying to compress type', type, ' file', f);

            if (!(f.indexOf('.snappy') > 0)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt('return');

          case 4:
            if (!compressing[f]) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return');

          case 6:
            compressing[f] = true;
            _context2.next = 9;
            return readFilePromise(f);

          case 9:
            buffer = _context2.sent;

            console.log('buffer is..', buffer);
            _context2.next = 13;
            return snappyCompressPromise(buffer);

          case 13:
            compressed = _context2.sent;

            console.log('writing compressed.');
            _context2.next = 17;
            return writeFilePromise(f + '.snappy', compressed);

          case 17:
            _context2.next = 19;
            return unlinkPromise(f);

          case 19:
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2['catch'](0);

            console.error('Error in snappy compress:', _context2.t0);
            compressing[f] = false;

          case 25:
            compressing[f] = false;

          case 26:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 21]]);
  }));

  return function snappyCompress(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var compressOld = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref4) {
    var type = _ref4.type,
        time = _ref4.time;
    var end, start, files;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            console.log('compressOld called type = ', type, 'time = ', time);
            end = (0, _momentTimezone2.default)(time).tz('UCT').subtract(1, 'hours').toDate();
            ;
            start = new Date('1979-01-01');

            console.log('start =', start.toUTCString(), 'end =', end.toUTCString());
            if (oldestSnappy[type]) start = oldestSnappy[type];
            _context3.next = 9;
            return whichFiles(type, start, end);

          case 9:
            files = _context3.sent;

            console.log('calling snapp compress on files ', files);
            Promise.all(files.map(function (f) {
              return snappyCompress(type, f);
            }));
            oldestSnappy[type] = end;
            console.log('waiting..');
            _context3.next = 16;
            return (0, _delay2.default)(300);

          case 16:
            console.log('returning from compressOld');
            _context3.next = 24;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3['catch'](0);

            console.log('blah');
            console.error(_context3.t0);
            throw new Error('timequerylog problem compressing old files: ' + _context3.t0.message);

          case 24:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 19]]);
  }));

  return function compressOld(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var whichFiles = exports.whichFiles = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(type, start, end) {
    var _this = this;

    var startDate, endDate, st, en, dirs, newDirs, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret2;

    return _regenerator2.default.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log('q');
            startDate = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('day').valueOf();
            endDate = (0, _momentTimezone2.default)(end).utcOffset(0).endOf('day').valueOf();
            st = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('hour').valueOf();
            en = (0, _momentTimezone2.default)(end).valueOf();
            dirs = [];
            _context5.prev = 6;
            _context5.next = 9;
            return _fs2.default.readdir(cfg.path + '/' + type + '_GMT');

          case 9:
            dirs = _context5.sent;
            _context5.next = 16;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5['catch'](6);
            console.error('timequerylog error reading dirlist: ' + _context5.t0.message + ' cfg.path is ' + cfg.path);return _context5.abrupt('return', []);

          case 16:

            dirs = dirs.sort(byDate);
            console.log(dirs);
            newDirs = dirs.filter(function (d) {
              var val = (0, _momentTimezone2.default)(d + ' +0000', 'YYYY-MM-DD Z').valueOf();
              return val >= startDate && val <= endDate;
            });

            if (!(newDirs.length === 0)) {
              _context5.next = 22;
              break;
            }

            console.error('No logs found in date/time range: all dirs found=' + JSON.stringify(dirs) + ' st=' + startDate + ' en=' + endDate + ' matching dirs=' + JSON.stringify(newDirs));
            return _context5.abrupt('return', []);

          case 22:
            ;
            dirs = newDirs;
            result = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 28;
            _loop = _regenerator2.default.mark(function _loop() {
              var dir, files, paths;
              return _regenerator2.default.wrap(function _loop$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      dir = _step.value;
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

                      console.log(paths);
                      Array.prototype.push.apply(result, paths);
                      _context4.next = 16;
                      break;

                    case 12:
                      _context4.prev = 12;
                      _context4.t0 = _context4['catch'](1);
                      console.error('Error filtering log files:' + _context4.t0.message);return _context4.abrupt('return', {
                        v: []
                      });

                    case 16:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _loop, _this, [[1, 12]]);
            });
            _iterator = dirs[Symbol.iterator]();

          case 31:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context5.next = 39;
              break;
            }

            return _context5.delegateYield(_loop(), 't1', 33);

          case 33:
            _ret2 = _context5.t1;

            if (!((typeof _ret2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret2)) === "object")) {
              _context5.next = 36;
              break;
            }

            return _context5.abrupt('return', _ret2.v);

          case 36:
            _iteratorNormalCompletion = true;
            _context5.next = 31;
            break;

          case 39:
            _context5.next = 45;
            break;

          case 41:
            _context5.prev = 41;
            _context5.t2 = _context5['catch'](28);
            _didIteratorError = true;
            _iteratorError = _context5.t2;

          case 45:
            _context5.prev = 45;
            _context5.prev = 46;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 48:
            _context5.prev = 48;

            if (!_didIteratorError) {
              _context5.next = 51;
              break;
            }

            throw _iteratorError;

          case 51:
            return _context5.finish(48);

          case 52:
            return _context5.finish(45);

          case 53:
            result = result.filter(function (fname) {
              return !((0, _path.extname)(fname) != '.snappy' && result.includes(fname + '.snappy'));
            });
            return _context5.abrupt('return', result);

          case 55:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee4, this, [[6, 12], [28, 41, 45, 53], [46,, 48, 52]]);
  }));

  return function whichFiles(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

var getReadStreamExt = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(fname) {
    var ext, input, hourLogs, uncompressed, ret;
    return _regenerator2.default.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            ext = (0, _path.extname)(fname), input = null;

            if (!(ext.indexOf('.snappy') >= 0)) {
              _context6.next = 15;
              break;
            }

            _context6.next = 4;
            return readFilePromise(fname);

          case 4:
            hourLogs = _context6.sent;
            _context6.next = 7;
            return snappyUncompressPromise(hourLogs);

          case 7:
            uncompressed = _context6.sent;

            input = new _streamBuffers.ReadableStreamBuffer({ frequency: 1, chunkSize: 128000 });
            input.put(uncompressed);
            input.stop();
            fname = fname.replace('.snappy', '');
            ext = (0, _path.extname)(fname);
            _context6.next = 17;
            break;

          case 15:
            console.log('ext is ', ext);
            input = (0, _fs3.createReadStream)(fname);

          case 17:
            ret = null;
            _context6.t0 = ext;
            _context6.next = _context6.t0 === '.msp' ? 21 : 25;
            break;

          case 21:
            ret = _msgpackLite2.default.createDecodeStream();
            input.pipe(ret);
            return _context6.abrupt('return', ret);

          case 25:
            ret = (0, _JSONStream.parse)();
            input.pipe(ret);
            return _context6.abrupt('return', ret);

          case 28:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getReadStreamExt(_x10) {
    return _ref6.apply(this, arguments);
  };
}();

var filterFile = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(fname, start, end, matchFunction) {
    var _this2 = this;

    var data;
    return _regenerator2.default.wrap(function _callee8$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log('n');
            _context9.next = 3;
            return new Promise(function () {
              var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(res) {
                return _regenerator2.default.wrap(function _callee7$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.prev = 0;
                        return _context8.delegateYield(_regenerator2.default.mark(function _callee6() {
                          var results, stream;
                          return _regenerator2.default.wrap(function _callee6$(_context7) {
                            while (1) {
                              switch (_context7.prev = _context7.next) {
                                case 0:
                                  results = [];

                                  console.log('a');
                                  _context7.next = 4;
                                  return getReadStreamExt(fname);

                                case 4:
                                  stream = _context7.sent;

                                  console.log('b');
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

                                case 8:
                                case 'end':
                                  return _context7.stop();
                              }
                            }
                          }, _callee6, _this2);
                        })(), 't0', 2);

                      case 2:
                        _context8.next = 8;
                        break;

                      case 4:
                        _context8.prev = 4;
                        _context8.t1 = _context8['catch'](0);

                        console.error('Error in filterFile:');
                        console.error((0, _util.inspect)(_context8.t1));

                      case 8:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee7, _this2, [[0, 4]]);
              }));

              return function (_x15) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 3:
            data = _context9.sent;
            return _context9.abrupt('return', data);

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee8, this);
  }));

  return function filterFile(_x11, _x12, _x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

var query = exports.query = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(type, start, end) {
    var matchFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d) {
      return true;
    };

    var files, results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, fname;

    return _regenerator2.default.wrap(function _callee9$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return whichFiles(type, start, end);

          case 2:
            files = _context10.sent;
            results = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context10.prev = 7;
            _iterator2 = files[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context10.next = 20;
              break;
            }

            fname = _step2.value;
            _context10.t0 = Array.prototype.push;
            _context10.t1 = results;
            _context10.next = 15;
            return filterFile(fname, start, end, matchFunction);

          case 15:
            _context10.t2 = _context10.sent;

            _context10.t0.apply.call(_context10.t0, _context10.t1, _context10.t2);

          case 17:
            _iteratorNormalCompletion2 = true;
            _context10.next = 9;
            break;

          case 20:
            _context10.next = 26;
            break;

          case 22:
            _context10.prev = 22;
            _context10.t3 = _context10['catch'](7);
            _didIteratorError2 = true;
            _iteratorError2 = _context10.t3;

          case 26:
            _context10.prev = 26;
            _context10.prev = 27;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 29:
            _context10.prev = 29;

            if (!_didIteratorError2) {
              _context10.next = 32;
              break;
            }

            throw _iteratorError2;

          case 32:
            return _context10.finish(29);

          case 33:
            return _context10.finish(26);

          case 34:
            return _context10.abrupt('return', results);

          case 35:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee9, this, [[7, 22, 26, 34], [27,, 29, 33]]);
  }));

  return function query(_x16, _x17, _x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();

var queryRecent = exports.queryRecent = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(type) {
    var end, start, results;
    return _regenerator2.default.wrap(function _callee10$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            end = new Date();
            start = (0, _momentTimezone2.default)(end).subtract(30, 'minutes').toDate();
            _context11.next = 4;
            return query(type, start, end);

          case 4:
            results = _context11.sent;
            return _context11.abrupt('return', results);

          case 6:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee10, this);
  }));

  return function queryRecent(_x21) {
    return _ref10.apply(this, arguments);
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

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFilePromise = (0, _pify2.default)(_fs3.readFile);
var writeFilePromise = (0, _pify2.default)(_fs3.writeFile);
var unlinkPromise = (0, _pify2.default)(_fs3.unlink);
var snappyCompressPromise = (0, _pify2.default)(_snappy2.default.compress);
var snappyUncompressPromise = (0, _pify2.default)(_snappy2.default.uncompress);

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
          console.log('calling now or again');
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

function fmt(dt) {
  return (0, _momentTimezone2.default)(dt).format('YYYY-MM-DD hh:mm:ss A');
}

var QueryStream = function (_Readable) {
  (0, _inherits3.default)(QueryStream, _Readable);

  function QueryStream(options) {
    var _this4 = this;

    (0, _classCallCheck3.default)(this, QueryStream);

    options.objectMode = true;

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (QueryStream.__proto__ || Object.getPrototypeOf(QueryStream)).call(this, options));

    _this3.init = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11() {
      return _regenerator2.default.wrap(function _callee11$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              console.log('INITIALIXING');
              console.log('A');
              _context12.next = 4;
              return whichFiles(_this3.type, _this3.start, _this3.end);

            case 4:
              _this3.files = _context12.sent;

              console.log('B');
              console.log('this.files is', _this3.files);
              _this3.fileNum = 0;
              _this3.rowNum = 0;
              _this3.data = [];
              _this3.initFinished = true;

            case 11:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee11, _this4);
    }));

    _this3.loadFile = function () {
      var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(f) {
        var result;
        return _regenerator2.default.wrap(function _callee12$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                console.log(_this3.files);

                if (_this3.files) {
                  _context13.next = 4;
                  break;
                }

                _context13.next = 4;
                return _this3.init();

              case 4:
                if (!(_this3.data && _this3.rowNum < _this3.data.length)) {
                  _context13.next = 6;
                  break;
                }

                return _context13.abrupt('return', _this3.data);

              case 6:
                if (!(_this3.files && _this3.fileNum >= _this3.files.length)) {
                  _context13.next = 8;
                  break;
                }

                return _context13.abrupt('return', null);

              case 8:
                if (_this3.data) {
                  _this3.rowNum = 0;
                }
                result = null;
                _context13.prev = 10;
                _context13.next = 13;
                return filterFile(_this3.files[_this3.fileNum++], _this3.start, _this3.end, _this3.match);

              case 13:
                result = _context13.sent;
                _context13.next = 19;
                break;

              case 16:
                _context13.prev = 16;
                _context13.t0 = _context13['catch'](10);

                console.error('filterfile err in loadfile', _context13.t0);

              case 19:
                _this3.data = result;
                return _context13.abrupt('return', result);

              case 21:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee12, _this4, [[10, 16]]);
      }));

      return function (_x22) {
        return _ref12.apply(this, arguments);
      };
    }();

    _this3.nextRow = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13() {
      var row;
      return _regenerator2.default.wrap(function _callee13$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              if (_this3.data) {
                _context14.next = 2;
                break;
              }

              return _context14.abrupt('return', null);

            case 2:
              if (!(_this3.rowNum >= _this3.data.length)) {
                _context14.next = 8;
                break;
              }

              _context14.next = 5;
              return _this3.loadFile();

            case 5:
              _this3.data = _context14.sent;

              if (_this3.data) {
                _context14.next = 8;
                break;
              }

              return _context14.abrupt('return', null);

            case 8:
              row = _this3.data[_this3.rowNum];

              _this3.rowNum++;
              return _context14.abrupt('return', row);

            case 11:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee13, _this4);
    }));

    _this3._read = function () {
      console.log('read');
      _this3.reading = new Promise(function () {
        var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(res) {
          var canPush;
          return _regenerator2.default.wrap(function _callee14$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  if (!_this3.reading) {
                    _context15.next = 3;
                    break;
                  }

                  _context15.next = 3;
                  return _this3.reading;

                case 3:
                  console.log('actually reading');
                  canPush = true;

                case 5:
                  _context15.prev = 5;
                  _context15.next = 8;
                  return _this3.loadFile();

                case 8:
                  _this3.data = _context15.sent;
                  _context15.next = 14;
                  break;

                case 11:
                  _context15.prev = 11;
                  _context15.t0 = _context15['catch'](5);
                  console.trace(_context15.t0);

                case 14:
                  ;
                  _context15.next = 17;
                  return _this3.nextRow();

                case 17:
                  _this3.row = _context15.sent;

                  if (_this3.row) {
                    if (_this3.timeMS) _this3.row.time = _this3.row.time.getTime();
                    if (_this3.map) _this3.row = _this3.map(_this3.row);
                  }
                  canPush = _this3.push(_this3.row);

                case 20:
                  if (_this3.row && canPush) {
                    _context15.next = 5;
                    break;
                  }

                case 21:
                case 'end':
                  return _context15.stop();
              }
            }
          }, _callee14, _this4, [[5, 11]]);
        }));

        return function (_x23) {
          return _ref14.apply(this, arguments);
        };
      }()).catch(console.error);
    };

    Object.assign(_this3, options);
    _this3.initFinished = false;
    _this3.fileNum = 0;
    return _this3;
  }

  return QueryStream;
}(_stream.Readable);

function queryOpts(options) {
  console.log('received query');
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
    console.log('returning quer stream');
    return qs;
  }
}