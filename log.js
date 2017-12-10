'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setIncr = exports.incr = exports.queryMultiArray = exports.getTypes = exports.latest = exports.queryRecent = exports.query = exports.whichFiles = exports.drainQueue = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var deleteOldFiles = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, type, olderThan, end, start, files, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, file;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (cfg.deleteOldDays) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return');

          case 2:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 5;
            _iterator = Object.entries(cfg.deleteOldDays)[Symbol.iterator]();

          case 7:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 43;
              break;
            }

            _step$value = (0, _slicedToArray3.default)(_step.value, 2), type = _step$value[0], olderThan = _step$value[1];
            end = (0, _momentTimezone2.default)().subtract(olderThan, 'days');
            start = new Date('1980-01-01');
            _context.next = 13;
            return whichFiles(type, start, end);

          case 13:
            files = _context.sent;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 17;
            _iterator2 = files[Symbol.iterator]();

          case 19:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 26;
              break;
            }

            file = _step2.value;
            _context.next = 23;
            return (0, _fsPromise.remove)(file);

          case 23:
            _iteratorNormalCompletion2 = true;
            _context.next = 19;
            break;

          case 26:
            _context.next = 32;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context['catch'](17);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 32:
            _context.prev = 32;
            _context.prev = 33;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 35:
            _context.prev = 35;

            if (!_didIteratorError2) {
              _context.next = 38;
              break;
            }

            throw _iteratorError2;

          case 38:
            return _context.finish(35);

          case 39:
            return _context.finish(32);

          case 40:
            _iteratorNormalCompletion = true;
            _context.next = 7;
            break;

          case 43:
            _context.next = 49;
            break;

          case 45:
            _context.prev = 45;
            _context.t1 = _context['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 49:
            _context.prev = 49;
            _context.prev = 50;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 52:
            _context.prev = 52;

            if (!_didIteratorError) {
              _context.next = 55;
              break;
            }

            throw _iteratorError;

          case 55:
            return _context.finish(52);

          case 56:
            return _context.finish(49);

          case 57:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 45, 49, 57], [17, 28, 32, 40], [33,, 35, 39], [50,, 52, 56]]);
  }));

  return function deleteOldFiles() {
    return _ref.apply(this, arguments);
  };
}();

var drainQueue = exports.drainQueue = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var len, i;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            len = 100;

          case 1:
            len = queueLength();
            _context2.next = 4;
            return (0, _delay2.default)(10);

          case 4:
            if (len > 0) {
              _context2.next = 1;
              break;
            }

          case 5:
            i = 0;

          case 6:
            if (!(i < 30)) {
              _context2.next = 12;
              break;
            }

            _context2.next = 9;
            return (0, _delay2.default)(1);

          case 9:
            i++;
            _context2.next = 6;
            break;

          case 12:
            _context2.next = 14;
            return (0, _delay2.default)(10);

          case 14:
            resetQueue();

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function drainQueue() {
    return _ref2.apply(this, arguments);
  };
}();

var getWriteStreamExt = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(fname) {
    var exists, fexists, encodeStream, fileStream;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!streams[fname]) {
              _context4.next = 3;
              break;
            }

            lastAccessTime[fname] = new Date();
            return _context4.abrupt('return', streams[fname]);

          case 3:
            _context4.next = 5;
            return (0, _pathExists2.default)((0, _path.dirname)(fname));

          case 5:
            exists = _context4.sent;

            if (!exists) (0, _mkdirp.sync)((0, _path.dirname)(fname));

            _context4.next = 9;
            return (0, _pathExists2.default)(fname);

          case 9:
            fexists = _context4.sent;
            encodeStream = null;
            fileStream = (0, _fs3.createWriteStream)(fname, { flags: 'a' });

            lastWriteTime[fname] = new Date();

            _context4.t0 = (0, _path.extname)(fname);
            _context4.next = _context4.t0 === '.msp' ? 16 : 18;
            break;

          case 16:
            encodeStream = msgpack.createEncodeStream();
            return _context4.abrupt('break', 20);

          case 18:
            encodeStream = (0, _JSONStream.stringify)(false);
            if (fexists) {
              fileStream.write('\n');
            }

          case 20:
            encodeStream.pipe(fileStream);
            streams[fname] = encodeStream;
            lastAccessTime[fname] = new Date();
            return _context4.abrupt('return', encodeStream);

          case 24:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getWriteStreamExt(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var snappyCompress = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(type, f) {
    var buffer, compressed;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            if (!(f.indexOf('.snappy') > 0)) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt('return', false);

          case 3:
            if (!compressing[f]) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt('return', false);

          case 5:
            compressing[f] = true;
            _context5.next = 8;
            return readFilePromise(f);

          case 8:
            buffer = _context5.sent;
            _context5.next = 11;
            return snappyCompressPromise(buffer);

          case 11:
            compressed = _context5.sent;
            _context5.next = 14;
            return writeFilePromise(f + '.snappy', compressed);

          case 14:
            _context5.next = 16;
            return unlinkPromise(f);

          case 16:
            _context5.next = 23;
            break;

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5['catch'](0);

            console.error('Error in snappy compress:', _context5.t0);
            compressing[f] = false;
            return _context5.abrupt('return', true);

          case 23:
            compressing[f] = false;
            return _context5.abrupt('return', true);

          case 25:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 18]]);
  }));

  return function snappyCompress(_x3, _x4) {
    return _ref5.apply(this, arguments);
  };
}();

var compressOld = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(_ref7) {
    var type = _ref7.type,
        time = _ref7.time;

    var end, start, files, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, file, didIt;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!compressing[type]) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt('return');

          case 2:
            if (!(Date.now() - lastCompress < 1000)) {
              _context6.next = 4;
              break;
            }

            return _context6.abrupt('return');

          case 4:
            _context6.prev = 4;

            compressing[type] = true;
            lastCompress = Date.now();
            end = (0, _momentTimezone2.default)(time).tz('UCT').subtract(1, 'hours').toDate();
            ;
            start = new Date('1979-01-01');

            if (oldestSnappy[type]) start = oldestSnappy[type];
            _context6.next = 13;
            return whichFiles(type, start, end);

          case 13:
            files = _context6.sent;

            files = files.filter(function (fname) {
              return !fname.includes('.snappy');
            });
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context6.prev = 18;
            for (_iterator3 = files[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              file = _step3.value;
              didIt = snappyCompress(type, file);

              if (didIt) oldestSnappy[type] = (0, _momentTimezone2.default)(end).subtract(2, 'hours');
            }
            //await delay(500);
            _context6.next = 26;
            break;

          case 22:
            _context6.prev = 22;
            _context6.t0 = _context6['catch'](18);
            _didIteratorError3 = true;
            _iteratorError3 = _context6.t0;

          case 26:
            _context6.prev = 26;
            _context6.prev = 27;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 29:
            _context6.prev = 29;

            if (!_didIteratorError3) {
              _context6.next = 32;
              break;
            }

            throw _iteratorError3;

          case 32:
            return _context6.finish(29);

          case 33:
            return _context6.finish(26);

          case 34:
            compressing[type] = false;
            _context6.next = 42;
            break;

          case 37:
            _context6.prev = 37;
            _context6.t1 = _context6['catch'](4);

            console.error(_context6.t1);
            compressing[type] = false;
            throw new Error('timequerylog problem compressing old files: ' + _context6.t1.message);

          case 42:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[4, 37], [18, 22, 26, 34], [27,, 29, 33]]);
  }));

  return function compressOld(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

var whichFiles = exports.whichFiles = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(type, start, end) {
    var _this = this;

    var startDate, endDate, st, en, dirs, newDirs, result, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _loop, _iterator4, _step4, _ret;

    return _regenerator2.default.wrap(function _callee7$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            startDate = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('day').valueOf();
            endDate = (0, _momentTimezone2.default)(end).utcOffset(0).endOf('day').valueOf();
            st = (0, _momentTimezone2.default)(start).utcOffset(0).startOf('hour').valueOf();
            en = (0, _momentTimezone2.default)(end).valueOf();
            dirs = [];
            _context8.prev = 5;
            _context8.next = 8;
            return _fs2.default.readdir(cfg.path + '/' + type + '_GMT');

          case 8:
            dirs = _context8.sent;
            _context8.next = 15;
            break;

          case 11:
            _context8.prev = 11;
            _context8.t0 = _context8['catch'](5);
            console.error('timequerylog error reading dirlist: ' + _context8.t0.message + ' cfg.path is ' + cfg.path);return _context8.abrupt('return', []);

          case 15:

            dirs = dirs.sort(byDate);
            newDirs = dirs.filter(function (d) {
              var val = (0, _momentTimezone2.default)(d + ' +0000', 'YYYY-MM-DD Z').valueOf();
              return val >= startDate && val <= endDate;
            });

            if (!(newDirs.length === 0)) {
              _context8.next = 20;
              break;
            }

            console.error('No logs found in date/time range: all dirs found=' + JSON.stringify(dirs) + ' st=' + startDate + ' en=' + endDate + ' matching dirs=' + JSON.stringify(newDirs));
            return _context8.abrupt('return', []);

          case 20:
            ;
            dirs = newDirs;
            result = [];
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context8.prev = 26;
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
              var dir, files, paths;
              return _regenerator2.default.wrap(function _loop$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      dir = _step4.value;
                      _context7.prev = 1;
                      _context7.next = 4;
                      return _fs2.default.readdir(cfg.path + '/' + type + '_GMT/' + dir);

                    case 4:
                      files = _context7.sent;

                      files = files.sort(byTime);
                      files = files.filter(function (file) {
                        var timeMS = (0, _momentTimezone2.default)(dir + ' ' + file + ' +0000', 'YYYY-MM-DD hhA Z').valueOf();
                        return timeMS >= st && timeMS <= en;
                      });
                      paths = files.map(function (f) {
                        return cfg.path + '/' + type + '_GMT/' + dir + '/' + f;
                      });

                      Array.prototype.push.apply(result, paths);
                      _context7.next = 15;
                      break;

                    case 11:
                      _context7.prev = 11;
                      _context7.t0 = _context7['catch'](1);
                      console.error('Error filtering log files:' + _context7.t0.message);return _context7.abrupt('return', {
                        v: []
                      });

                    case 15:
                    case 'end':
                      return _context7.stop();
                  }
                }
              }, _loop, _this, [[1, 11]]);
            });
            _iterator4 = dirs[Symbol.iterator]();

          case 29:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context8.next = 37;
              break;
            }

            return _context8.delegateYield(_loop(), 't1', 31);

          case 31:
            _ret = _context8.t1;

            if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
              _context8.next = 34;
              break;
            }

            return _context8.abrupt('return', _ret.v);

          case 34:
            _iteratorNormalCompletion4 = true;
            _context8.next = 29;
            break;

          case 37:
            _context8.next = 43;
            break;

          case 39:
            _context8.prev = 39;
            _context8.t2 = _context8['catch'](26);
            _didIteratorError4 = true;
            _iteratorError4 = _context8.t2;

          case 43:
            _context8.prev = 43;
            _context8.prev = 44;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 46:
            _context8.prev = 46;

            if (!_didIteratorError4) {
              _context8.next = 49;
              break;
            }

            throw _iteratorError4;

          case 49:
            return _context8.finish(46);

          case 50:
            return _context8.finish(43);

          case 51:
            result = result.filter(function (fname) {
              return !((0, _path.extname)(fname) != '.snappy' && result.includes(fname + '.snappy'));
            });
            return _context8.abrupt('return', result);

          case 53:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee7, this, [[5, 11], [26, 39, 43, 51], [44,, 46, 50]]);
  }));

  return function whichFiles(_x7, _x8, _x9) {
    return _ref8.apply(this, arguments);
  };
}();

var filterFile = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(fname, start, end, matchFunction) {
    var data;
    return _regenerator2.default.wrap(function _callee8$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return new Promise(function (res) {
              try {
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
              } catch (e) {
                console.error('Error in filterFile:');
                console.error((0, _util.inspect)(e));
              }
            });

          case 2:
            data = _context9.sent;
            return _context9.abrupt('return', data);

          case 4:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee8, this);
  }));

  return function filterFile(_x10, _x11, _x12, _x13) {
    return _ref10.apply(this, arguments);
  };
}();

var query = exports.query = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(type, start, end) {
    var matchFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (d) {
      return true;
    };

    var files, results, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, fname, filtered, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, item;

    return _regenerator2.default.wrap(function _callee9$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return whichFiles(type, start, end);

          case 2:
            files = _context10.sent;
            results = [];
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context10.prev = 7;
            _iterator5 = files[Symbol.iterator]();

          case 9:
            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
              _context10.next = 43;
              break;
            }

            fname = _step5.value;
            _context10.prev = 11;
            _context10.next = 14;
            return filterFile(fname, start, end, matchFunction);

          case 14:
            filtered = _context10.sent;
            _iteratorNormalCompletion6 = true;
            _didIteratorError6 = false;
            _iteratorError6 = undefined;
            _context10.prev = 18;

            for (_iterator6 = filtered[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              item = _step6.value;

              results.push(item);
            }
            _context10.next = 26;
            break;

          case 22:
            _context10.prev = 22;
            _context10.t0 = _context10['catch'](18);
            _didIteratorError6 = true;
            _iteratorError6 = _context10.t0;

          case 26:
            _context10.prev = 26;
            _context10.prev = 27;

            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }

          case 29:
            _context10.prev = 29;

            if (!_didIteratorError6) {
              _context10.next = 32;
              break;
            }

            throw _iteratorError6;

          case 32:
            return _context10.finish(29);

          case 33:
            return _context10.finish(26);

          case 34:
            _context10.next = 40;
            break;

          case 36:
            _context10.prev = 36;
            _context10.t1 = _context10['catch'](11);

            console.trace(_context10.t1);
            throw _context10.t1;

          case 40:
            _iteratorNormalCompletion5 = true;
            _context10.next = 9;
            break;

          case 43:
            _context10.next = 49;
            break;

          case 45:
            _context10.prev = 45;
            _context10.t2 = _context10['catch'](7);
            _didIteratorError5 = true;
            _iteratorError5 = _context10.t2;

          case 49:
            _context10.prev = 49;
            _context10.prev = 50;

            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }

          case 52:
            _context10.prev = 52;

            if (!_didIteratorError5) {
              _context10.next = 55;
              break;
            }

            throw _iteratorError5;

          case 55:
            return _context10.finish(52);

          case 56:
            return _context10.finish(49);

          case 57:
            return _context10.abrupt('return', results);

          case 58:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee9, this, [[7, 45, 49, 57], [11, 36], [18, 22, 26, 34], [27,, 29, 33], [50,, 52, 56]]);
  }));

  return function query(_x14, _x15, _x16) {
    return _ref11.apply(this, arguments);
  };
}();

var queryRecent = exports.queryRecent = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(type) {
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

  return function queryRecent(_x18) {
    return _ref12.apply(this, arguments);
  };
}();

var latest = exports.latest = function () {
  var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(type) {
    var start, end, files, match, data, last;
    return _regenerator2.default.wrap(function _callee17$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            start = new Date('01-01-1980');

            if (lastUpdateTime[type]) start = lastUpdateTime[type];
            end = Date.now();
            _context18.next = 5;
            return whichFiles(type, start, end);

          case 5:
            files = _context18.sent;

            if (!(!files || files && files.length == 0)) {
              _context18.next = 8;
              break;
            }

            return _context18.abrupt('return');

          case 8:
            match = function match(r) {
              return true;
            };

            _context18.next = 11;
            return filterFile(files[files.length - 1], start, end, match);

          case 11:
            data = _context18.sent;
            last = null;

            if (data) last = data[data.length - 1];

            if (!last) {
              _context18.next = 18;
              break;
            }

            delete last.time;
            delete last.type;
            return _context18.abrupt('return', last);

          case 18:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee17, this);
  }));

  return function latest(_x21) {
    return _ref19.apply(this, arguments);
  };
}();

var getTypes = exports.getTypes = function () {
  var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(globPat) {
    var matchDirs;
    return _regenerator2.default.wrap(function _callee18$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            matchDirs = [];
            _context19.prev = 1;
            _context19.next = 4;
            return glob_(cfg.path + '/' + globPat + '_GMT');

          case 4:
            matchDirs = _context19.sent;
            _context19.next = 10;
            break;

          case 7:
            _context19.prev = 7;
            _context19.t0 = _context19['catch'](1);
            throw new Error('timequerylog error globbing for ' + _glob2.default);

          case 10:
            return _context19.abrupt('return', matchDirs.map(function (dir) {
              dir = dir.replace(cfg.path, '');
              return dir.substr(1, dir.length - 5);
            }));

          case 11:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee18, this, [[1, 7]]);
  }));

  return function getTypes(_x22) {
    return _ref20.apply(this, arguments);
  };
}();

var queryMultiArray = exports.queryMultiArray = function () {
  var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(_ref22) {
    var typeGlob = _ref22.typeGlob,
        start = _ref22.start,
        end = _ref22.end,
        match = _ref22.match;

    var types, all, calls, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, type, results, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, result;

    return _regenerator2.default.wrap(function _callee19$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            if (!match) match = function match(d) {
              return true;
            };
            if (!end) end = new Date();
            if (!start) start = (0, _momentTimezone2.default)(end).subtract(30, 'minutes').toDate();
            _context20.next = 5;
            return getTypes(typeGlob);

          case 5:
            types = _context20.sent;
            all = [], calls = [];
            _iteratorNormalCompletion7 = true;
            _didIteratorError7 = false;
            _iteratorError7 = undefined;
            _context20.prev = 10;

            for (_iterator7 = types[Symbol.iterator](); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              type = _step7.value;

              calls.push(query(type, start, end, match));
            }
            _context20.next = 18;
            break;

          case 14:
            _context20.prev = 14;
            _context20.t0 = _context20['catch'](10);
            _didIteratorError7 = true;
            _iteratorError7 = _context20.t0;

          case 18:
            _context20.prev = 18;
            _context20.prev = 19;

            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }

          case 21:
            _context20.prev = 21;

            if (!_didIteratorError7) {
              _context20.next = 24;
              break;
            }

            throw _iteratorError7;

          case 24:
            return _context20.finish(21);

          case 25:
            return _context20.finish(18);

          case 26:
            _context20.next = 28;
            return Promise.all(calls);

          case 28:
            results = _context20.sent;
            _iteratorNormalCompletion8 = true;
            _didIteratorError8 = false;
            _iteratorError8 = undefined;
            _context20.prev = 32;

            for (_iterator8 = results[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              result = _step8.value;

              all = all.concat(result);
            }_context20.next = 40;
            break;

          case 36:
            _context20.prev = 36;
            _context20.t1 = _context20['catch'](32);
            _didIteratorError8 = true;
            _iteratorError8 = _context20.t1;

          case 40:
            _context20.prev = 40;
            _context20.prev = 41;

            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }

          case 43:
            _context20.prev = 43;

            if (!_didIteratorError8) {
              _context20.next = 46;
              break;
            }

            throw _iteratorError8;

          case 46:
            return _context20.finish(43);

          case 47:
            return _context20.finish(40);

          case 48:
            all.sort(byJSDate);
            return _context20.abrupt('return', all);

          case 50:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee19, this, [[10, 14, 18, 26], [19,, 21, 25], [32, 36, 40, 48], [41,, 43, 47]]);
  }));

  return function queryMultiArray(_x23) {
    return _ref21.apply(this, arguments);
  };
}();

var incr = exports.incr = function () {
  var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(key) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var load = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var fname, exists, curr;
    return _regenerator2.default.wrap(function _callee20$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            fname = cfg.path + '/' + key + '_INCR';

            if (!incrs[key]) {
              _context21.next = 9;
              break;
            }

            incrs[key];
            if (!load) incrs[key]++;
            _context21.next = 6;
            return writeFilePromise(fname, incrs[key]);

          case 6:
            return _context21.abrupt('return', incrs[key]);

          case 9:
            _context21.next = 11;
            return (0, _pathExists2.default)(fname);

          case 11:
            exists = _context21.sent;

            if (exists) {
              _context21.next = 19;
              break;
            }

            incrs[key] = init * 1;
            _context21.next = 16;
            return writeFilePromise(fname, init + "");

          case 16:
            return _context21.abrupt('return', incrs[key]);

          case 19:
            _context21.next = 21;
            return readFilePromise(fname);

          case 21:
            _context21.t0 = _context21.sent;
            curr = 1 * _context21.t0;

            if (!load) curr += 1;
            incrs[key] = curr;
            _context21.next = 27;
            return writeFilePromise(fname, curr + "");

          case 27:
            return _context21.abrupt('return', curr);

          case 28:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee20, this);
  }));

  return function incr(_x24) {
    return _ref23.apply(this, arguments);
  };
}();

var setIncr = exports.setIncr = function () {
  var _ref24 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(key, val) {
    var fname;
    return _regenerator2.default.wrap(function _callee21$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            fname = cfg.path + '/' + key + '_INCR';

            incrs[key] = val - 1;
            _context22.next = 4;
            return writeFilePromise(fname, incrs[key]);

          case 4:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee21, this);
  }));

  return function setIncr(_x27, _x28) {
    return _ref24.apply(this, arguments);
  };
}();

exports.resetQueue = resetQueue;
exports.queueLength = queueLength;
exports.readyToExit = readyToExit;
exports.config = config;
exports.whichFile = whichFile;
exports.log = log;
exports.queryOpts = queryOpts;
exports.hrms = hrms;
exports.incrNow = incrNow;

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _JSONStream = require('JSONStream');

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

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

var _timestring = require('timestring');

var _timestring2 = _interopRequireDefault(_timestring);

var _fsPromise = require('fs-promise');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var glob_ = (0, _pify2.default)(_glob2.default);

var opts = { max: 50000000,
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

var checkDelete = function checkDelete(cb) {
  deleteOldFiles().catch(console.error);
  if (cb) cb();
};

checkDelete();

var lastCheckDelCall = 'never';

var chkaccess = function chkaccess(cb) {
  for (var file in lastAccessTime) {
    var now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 900 && now - lastWriteTime[file].getTime() > 1000) {
      streams[file].end();
      delete streams[file];
      delete lastAccessTime[file];
      lastWriteTime[file] = new Date();
    }
  }
  if (cb) cb();
};

function closeStreams() {
  for (var file in streams) {
    try {
      streams[file].end();
    } catch (e) {}
  }
}

function exitIfNoListeners() {
  console.log("timequerylog: SIGINT: trying to clean up fast.");
  if (process.listeners('SIGINT').length == 1) process.exit();
}

var _resExit = null;
var resolveCanExit = function resolveCanExit(resolveExit) {
  _resExit = resolveExit;return _resExit;
};
var _readyToExit = new Promise(resolveCanExit);

function resetQueue() {
  q = (0, _queue2.default)({ concurrency: 1 });
  started = false;
}

function queueLength() {
  return q.length;
}

function readyToExit() {
  return _readyToExit;
}

var cleanup = function cleanup(code, signal) {
  if (q.length > 0) {
    console.log("timequerylog: queue length:", q.length);
    q.on('end', function () {
      console.log("timequerylog: closing streams");
      closeStreams();
      _resExit();
      exitIfNoListeners();
    });
  } else {
    closeStreams();
    _resExit();
    exitIfNoListeners();
  }
};

q.on('end', function () {
  setTimeout(function () {
    (0, _nowOrAgain.nowOrAgain)(chkaccess, 'G');
    if (lastCheckDelCall == 'never') {
      lastCheckDelCall = Date.now();
      (0, _nowOrAgain.nowOrAgain)(checkDelete, 'G');
    } else if (Date.now() - lastCheckDelCall > 60 * 1000 * 60 * 20) {
      lastCheckDelCall = Date.now();
      (0, _nowOrAgain.nowOrAgain)(checkDelete, 'G');
    }
  }, 1500);
});

//onExit(cleanup);
process.on('SIGINT', cleanup);

function config(conf) {
  Object.assign(cfg, conf);
  checkDelete();
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

process.on('tql', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
  var _out$pop, type, currentState, time, cstr, newLogging;

  return _regenerator2.default.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return currentLogging;

        case 2:
          c++;
          _out$pop = out.pop(), type = _out$pop.type, currentState = _out$pop.currentState, time = _out$pop.time;
          cstr = c.toString();
          newLogging = dologPromise(type, currentState, time);

          currentLogging = newLogging;
          _context3.next = 9;
          return newLogging;

        case 9:
          completed++;

        case 10:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee3, undefined);
})));

//setInterval( () => {
//  if (q && q.length == 0) {
//    resetQueue();
//  }
//}, 100);

function log(type, obj) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();

  //if (cfg.ignore && cfg.ignore == true) return;

  lastUpdateTime[type] = time;
  if (!obj.hasOwnProperty('time')) obj.time = time;else time = obj.time;
  if (noRepeat(type)) {
    var copyTime = null;
    copyTime = new Date(obj.time.getTime());
    delete obj['time'];
    if (lastData.hasOwnProperty(type) && (0, _deepEqual2.default)(lastData[type], obj)) {
      //obj.time = copyTime;      
      return;
    }
    lastData[type] = (0, _lodash2.default)(obj);
    obj.time = copyTime;
  }
  //if (cfg.memory && cfg.memory == true) {
  //  memlog.push(obj);
  //  return;
  //}
  var currentState = (0, _jsonStringifySafe2.default)(obj);
  delete obj['time'];
  //const currentState = JSON.stringify(obj);
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
  } catch (e) {
    console.error(e);
    cb(null, null);
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
      ret = msgpack.createDecodeStream();
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

function matchRows(_ref9) {
  var data = _ref9.data,
      start = _ref9.start,
      end = _ref9.end,
      matchFunction = _ref9.matchFunction;

  var results = [];
  for (var i = 0; i < data.length; i++) {
    var r = data[i];
    r.time = new Date(r.time);
    if (r.time >= start && r.time <= end && matchFunction(r)) results.push(r);
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

    _this2.init = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
      return _regenerator2.default.wrap(function _callee11$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return whichFiles(_this2.type, _this2.start, _this2.end);

            case 2:
              _this2.files = _context12.sent;

              _this2.fileNum = 0;
              _this2.rowNum = 0;
              _this2.data = null;
              _this2.fileData = [];
              _this2.initFinished = true;

            case 8:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee11, _this3);
    }));
    _this2.checkPreload = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
      var preloads, xx, _loop2, n;

      return _regenerator2.default.wrap(function _callee13$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              return _context14.abrupt('return');

            case 3:
              preloads = [];
              xx = 0;

              _loop2 = function _loop2(n) {
                preloads.push((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
                  return _regenerator2.default.wrap(function _callee12$(_context13) {
                    while (1) {
                      switch (_context13.prev = _context13.next) {
                        case 0:
                          xx++;
                          _context13.t0 = _this2.fileData;
                          _context13.next = 4;
                          return filterFile(_this2.files[n], _this2.start, _this2.end, _this2.match);

                        case 4:
                          _context13.t1 = _context13.sent;

                          _context13.t0.push.call(_context13.t0, _context13.t1);

                        case 6:
                        case 'end':
                          return _context13.stop();
                      }
                    }
                  }, _callee12, _this3);
                }))());
              };

              for (n = _this2.fileNum; n < _this2.files.length && n < _this2.fileNum + 3; n++) {
                _loop2(n);
              }

              if (!(preloads.length == 0)) {
                _context14.next = 10;
                break;
              }

              _context14.next = 12;
              break;

            case 10:
              _context14.next = 12;
              return Promise.all(preloads);

            case 12:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee13, _this3);
    }));

    _this2.loadFile = function () {
      var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(f) {
        var result, st;
        return _regenerator2.default.wrap(function _callee14$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (_this2.files) {
                  _context15.next = 3;
                  break;
                }

                _context15.next = 3;
                return _this2.init();

              case 3:
                if (!(_this2.data && _this2.rowNum < _this2.data.length)) {
                  _context15.next = 5;
                  break;
                }

                return _context15.abrupt('return', _this2.data);

              case 5:
                if (!(_this2.files && _this2.fileNum >= _this2.files.length)) {
                  _context15.next = 7;
                  break;
                }

                return _context15.abrupt('return', null);

              case 7:
                if (_this2.data) {
                  _this2.rowNum = 0;
                }
                result = null;
                _context15.prev = 9;
                st = Date.now();

                if (!(_this2.fileData.length > _this2.fileNum)) {
                  _context15.next = 20;
                  break;
                }

                _this2.data = _this2.fileData[_this2.fileNum++];

                if (!(_this2.data.length === 0)) {
                  _context15.next = 17;
                  break;
                }

                _context15.next = 16;
                return _this2.loadFile();

              case 16:
                return _context15.abrupt('return', _context15.sent);

              case 17:
                return _context15.abrupt('return', _this2.data);

              case 20:
                _context15.next = 22;
                return filterFile(_this2.files[_this2.fileNum++], _this2.start, _this2.end, _this2.match);

              case 22:
                result = _context15.sent;

                if (!(_this2.fileData.length == 0)) {
                  _context15.next = 26;
                  break;
                }

                _context15.next = 26;
                return _this2.checkPreload();

              case 26:
                if (!(result.length === 0)) {
                  _context15.next = 30;
                  break;
                }

                _context15.next = 29;
                return _this2.loadFile();

              case 29:
                return _context15.abrupt('return', _context15.sent);

              case 30:
                _context15.next = 35;
                break;

              case 32:
                _context15.prev = 32;
                _context15.t0 = _context15['catch'](9);

                console.error('filterfile err in loadfile', _context15.t0);

              case 35:
                _this2.data = result;
                return _context15.abrupt('return', result);

              case 37:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee14, _this3, [[9, 32]]);
      }));

      return function (_x19) {
        return _ref16.apply(this, arguments);
      };
    }();

    _this2.nextRow = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
      var row;
      return _regenerator2.default.wrap(function _callee15$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.prev = 0;

              if (_this2.data) {
                _context16.next = 3;
                break;
              }

              return _context16.abrupt('return', null);

            case 3:
              if (!(_this2.rowNum >= _this2.data.length)) {
                _context16.next = 9;
                break;
              }

              _context16.next = 6;
              return _this2.loadFile();

            case 6:
              _this2.data = _context16.sent;

              if (_this2.data) {
                _context16.next = 9;
                break;
              }

              return _context16.abrupt('return', null);

            case 9:
              row = _this2.data[_this2.rowNum];

              _this2.rowNum++;
              return _context16.abrupt('return', row);

            case 14:
              _context16.prev = 14;
              _context16.t0 = _context16['catch'](0);

              console.error('nextRow issue', _context16.t0);

            case 17:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee15, _this3, [[0, 14]]);
    }));

    _this2._read = function () {
      var id = (0, _uuid.v4)();
      _this2.reading = new Promise(function () {
        var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(res) {
          var canPush, i;
          return _regenerator2.default.wrap(function _callee16$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  if (!_this2.reading) {
                    _context17.next = 4;
                    break;
                  }

                  return _context17.abrupt('return', true);

                case 4:
                  canPush = true;
                  i = 0;

                case 6:
                  _context17.prev = 6;

                  if (_this2.data) {
                    _context17.next = 16;
                    break;
                  }

                  _context17.next = 10;
                  return _this2.loadFile();

                case 10:
                  _this2.data = _context17.sent;
                  _context17.next = 13;
                  return _this2.nextRow();

                case 13:
                  _this2.row = _context17.sent;
                  _context17.next = 17;
                  break;

                case 16:
                  _this2.row = _this2.data[_this2.rowNum++];

                case 17:
                  _context17.next = 22;
                  break;

                case 19:
                  _context17.prev = 19;
                  _context17.t0 = _context17['catch'](6);
                  console.trace(_context17.t0);

                case 22:
                  ;
                  if (_this2.row === undefined) _this2.row = null;
                  if (!(_this2.row === null)) {
                    if (_this2.timeMS && _this2.row.time.getTime) _this2.row.time = _this2.row.time.getTime();
                    if (_this2.map) _this2.row = _this2.map(_this2.row);
                  } else {}
                  canPush = _this2.push(_this2.row);

                  if (!(_this2.data && _this2.rowNum == _this2.data.length)) {
                    _context17.next = 30;
                    break;
                  }

                  _context17.next = 29;
                  return _this2.loadFile();

                case 29:
                  _this2.data = _context17.sent;

                case 30:
                  if (_this2.row && canPush) {
                    _context17.next = 6;
                    break;
                  }

                case 31:
                  return _context17.abrupt('return', true);

                case 32:
                case 'end':
                  return _context17.stop();
              }
            }
          }, _callee16, _this3, [[6, 19]]);
        }));

        return function (_x20) {
          return _ref18.apply(this, arguments);
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

function hrms() {
  return (0, _performanceNow2.default)() * 1000;
}

function byJSDate(a, b) {
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  if (a.hrtime && b.hrtime) {
    if (a.hrtime < b.hrtime) return -1;
    if (a.hrtime > b.hrtime) return 1;
    return 0;
  }
  return 0;
}

var incrs = {};

function incrNow(key) {
  var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (incrs.hasOwnProperty(key)) {
    var result = incrs[key] + 1;

    incr(key, init).catch(function (e) {
      throw new Error("incrNow error: " + key + " " + e.message);
    });
    return result;
  } else {
    throw new Error("incrNow error: not loaded. Call incr first. " + key);
  }
}