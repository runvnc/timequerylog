'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = undefined;
exports.config = config;
exports.whichFile = whichFile;
exports.log = log;
exports.whichFiles = whichFiles;

require('babel-core');

require('babel-polyfill');

var _util = require('util');

var _JSONStream = require('JSONStream');

var _fs = require('fs');

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
    if (now - lastAccessTime[file].getTime() > 20000) {
      streams[file].close();
      delete streams[file];
      delete lastAccessTime[file];
    }
  }
}, 15000);

function config(cfg) {
  cfg = cfg;
}

function whichFile(type, datetime) {
  var gmt = (0, _moment2.default)(datetime).utcOffset(0);
  return cfg.path + '/' + type + '_GMT/' + gmt.format('YY-MM-DD/hhA');
}

function log(type, obj) {
  var time = arguments.length <= 2 || arguments[2] === undefined ? new Date() : arguments[2];

  q.push(function (cb) {
    dolog(type, obj, time, cb);
  });
  q.start(function (e) {
    console.error('Error running queue: ', e);
  });
}

function getWriteStream(fname, cb) {
  console.log(fname);
  if (streams[fname]) {
    lastAccessTime[fname] = new Date();
    return cb(streams[fname]);
  }
  console.log('not found streams is', (0, _util.inspect)(streams));
  (0, _pathExists2.default)((0, _path.dirname)(fname), function (exists) {
    if (!exists) (0, _mkdirp.sync)((0, _path.dirname)(fname));
    var fileStream = (0, _fs.createWriteStream)(fname);
    var jsonStream = (0, _JSONStream.stringify)();
    jsonStream.pipe(fileStream);
    streams[fname] = jsonStream;
    lastAccessTime[fname] = new Date();
    return cb(jsonStream);
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

function whichFiles(type, start, end) {
  var endMS = (0, _moment2.default)(end).valueOf;
  var st = (0, _moment2.default)(start);
  var result = [];
  for (var offset = 0; st.add(offset, 'm').valueOf() <= endMS; offset += 30) {
    var fname = whichFile(st.add(offset, 'm').toDate());
    if (!(fname in result)) result.push(fname);
  }
  return result;
}

var query = exports.query = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, start, end, matchFunction) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function query(_x3, _x4, _x5, _x6) {
    return ref.apply(this, arguments);
  };
})();