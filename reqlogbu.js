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

var _JSONStream = require('JSONStream');

var _fs = require('mz/fs');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var cfg = { path: process.cwd() };
var streams = {};
var lastAccessTime = {};

setInterval(function () {
  for (var file in lastAccessTime) {
    var now = new Date().getTime();
    if (now - lastAccessTime.getTime() > 20000) {
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
  return cfg.path + '/' + type_GMT + '/' + (0, _moment2.default)(datetime).format('YY-MM-DD/hhA');
}

function log(type, obj) {
  var time = arguments.length <= 2 || arguments[2] === undefined ? new Date() : arguments[2];

  queue.push(function (cb) {
    dolog({ type: type, obj: obj, time: time }, cb);
  });
}

function getWriteStream(fname, cb) {
  if (streams[fname]) {
    lastAccessTime[fname] = new Date();
    return streams[fname];
  }
  var fileStream = createWriteStream(fname);
  var jsonStream = (0, _JSONStream.stringify)();
  jsonStream.pipe(fileStream);
  streams[fname] = jsonStream;
  lastAccessTime[fname] = new Date();
  return jsonStream;
}

function dolog(type, obj) {
  var time = arguments.length <= 2 || arguments[2] === undefined ? new Date() : arguments[2];
  var cb = arguments[3];

  var fname = whichFile(type, time);
  var toWrite = { time: time, type: type };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;
      toWrite[key] = obj[key];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  getWriteStream(fname, function (stream) {
    stream.write(toWrite);
    cb();
  });
}

/*
function dolog(type, obj, time = new Date(), cb) {
  let fname = whichFile(type, time);
  let found = await exists(fname);
  let str = JSON.stringify(obj);
  if (!found) {
    await appendFile(fname, `[${str}']'`);
    return;   
  }
  let status = await stat(fname);
  console.log(status);  
}
*/

function whichFiles(type, start, end) {}

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