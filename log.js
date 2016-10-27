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

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var whichFiles = exports.whichFiles = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(type, start, end) {
    var _this = this;

    var startDate, endDate, st, en, dirs, newDirs, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret2;

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

            console.error('No logs found in date/time range: all dirs found=' + JSON.stringify(dirs) + ' st=' + startDate + ' en=' + endDate + ' matching dirs=' + JSON.stringify(newDirs));
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
            _iterator = dirs[Symbol.iterator]();

          case 29:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 37;
              break;
            }

            return _context2.delegateYield(_loop(), 't1', 31);

          case 31:
            _ret2 = _context2.t1;

            if (!((typeof _ret2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret2)) === "object")) {
              _context2.next = 34;
              break;
            }

            return _context2.abrupt('return', _ret2.v);

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
                console.error('Error in filterFile:');
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
            _iterator2 = files[Symbol.iterator]();

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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _queue = require('queue');

var _queue2 = _interopRequireDefault(_queue);

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _lodash = require('lodash.clonedeep');

var _lodash2 = _interopRequireDefault(_lodash);

var _stream = require('stream');

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

function config(conf) {
  Object.assign(cfg, conf);
}

function whichFile(type, datetime) {
  var gmt = (0, _moment2.default)(datetime).utcOffset(0);
  return cfg.path + '/' + type + '_GMT/' + gmt.format('YYYY-MM-DD/hhA');
}

q.on('timeout', function (next) {
  console.error('queue timed out');
  next();
});

var lastData = {};

function noRepeat(type) {
  return false;
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

  try {
    (function () {
      var fname = whichFile(type, time);
      var toWrite = { time: time, type: type };
      for (var key in obj) {
        toWrite[key] = obj[key];
      }getWriteStream(fname, function (stream) {
        stream.write(toWrite);
        cb();
      });
    })();
  } catch (e) {
    console.error(e);
  }
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

var QueryStream = function (_Readable) {
  (0, _inherits3.default)(QueryStream, _Readable);

  function QueryStream(options) {
    var _this3 = this;

    (0, _classCallCheck3.default)(this, QueryStream);

    options.objectMode = true;

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (QueryStream.__proto__ || Object.getPrototypeOf(QueryStream)).call(this, options));

    _this2.init = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
      return _regenerator2.default.wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return whichFiles(_this2.type, _this2.start, _this2.end);

            case 2:
              _this2.files = _context6.sent;

              _this2.fileNum = 0;
              _this2.rowNum = 0;
              _this2.data = [];
              _this2.initFinished = true;

            case 7:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee5, _this3);
    }));

    _this2.loadFile = function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(f) {
        var result;
        return _regenerator2.default.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (_this2.files) {
                  _context7.next = 3;
                  break;
                }

                _context7.next = 3;
                return _this2.init();

              case 3:
                if (!(_this2.data && _this2.rowNum < _this2.data.length)) {
                  _context7.next = 5;
                  break;
                }

                return _context7.abrupt('return', _this2.data);

              case 5:
                if (!(_this2.files && _this2.fileNum >= _this2.files.length)) {
                  _context7.next = 7;
                  break;
                }

                return _context7.abrupt('return', null);

              case 7:
                if (_this2.data) {
                  _this2.rowNum = 0;
                }
                _context7.next = 10;
                return filterFile(_this2.files[_this2.fileNum++], _this2.start, _this2.end, _this2.match);

              case 10:
                result = _context7.sent;

                _this2.data = result;
                return _context7.abrupt('return', result);

              case 13:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee6, _this3);
      }));

      return function (_x16) {
        return _ref6.apply(this, arguments);
      };
    }();

    _this2.nextRow = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
      var row;
      return _regenerator2.default.wrap(function _callee7$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (_this2.data) {
                _context8.next = 2;
                break;
              }

              return _context8.abrupt('return', null);

            case 2:
              if (!(_this2.rowNum >= _this2.data.length)) {
                _context8.next = 8;
                break;
              }

              _context8.next = 5;
              return _this2.loadFile();

            case 5:
              _this2.data = _context8.sent;

              if (_this2.data) {
                _context8.next = 8;
                break;
              }

              return _context8.abrupt('return', null);

            case 8:
              row = _this2.data[_this2.rowNum];

              _this2.rowNum++;
              return _context8.abrupt('return', row);

            case 11:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee7, _this3);
    }));

    _this2._read = function () {
      new Promise(function () {
        var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(res) {
          var canPush;
          return _regenerator2.default.wrap(function _callee8$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  canPush = true;

                case 1:
                  _context9.prev = 1;
                  _context9.next = 4;
                  return _this2.loadFile();

                case 4:
                  _this2.data = _context9.sent;
                  _context9.next = 10;
                  break;

                case 7:
                  _context9.prev = 7;
                  _context9.t0 = _context9['catch'](1);
                  console.trace(_context9.t0);

                case 10:
                  ;
                  _context9.next = 13;
                  return _this2.nextRow();

                case 13:
                  _this2.row = _context9.sent;

                  if (_this2.timeMS) _this2.row.time = _this2.row.time.getTime();
                  if (_this2.map) _this2.row = _this2.map(_this2.row);
                  canPush = _this2.push(_this2.row);

                case 17:
                  if (_this2.row && canPush) {
                    _context9.next = 1;
                    break;
                  }

                case 18:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee8, _this3, [[1, 7]]);
        }));

        return function (_x17) {
          return _ref8.apply(this, arguments);
        };
      }()).catch(console.error);
    };

    Object.assign(_this2, options);
    _this2.initFinished = false;
    _this2.init().catch(console.error);
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
  if (!start) options.start = (0, _moment2.default)(end).subtract(30, 'minutes').toDate();

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