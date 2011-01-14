var assert = require('assert'),
fs = require('fs'),
Log = require('../lib/log'),
Stream = require('stream').Stream,
util = require('util');

var WriteStream = function() {
  this.data = '';
};
util.inherits(WriteStream, Stream);
WriteStream.prototype.write = function(data) {
  this.data += data;
};

var ReadStream = function(data) {
  var self = this;
  self.readable = true;
  process.nextTick(function() {
    data.split('').forEach(function(c) {
      self.emit('data', c);
    });
    self.emit('end');
  });
};
util.inherits(ReadStream, Stream);
ReadStream.prototype.setEncoding = function() {
};

module.exports = {
  'test default date format ': function(beforeExit) {
    var write_stream = new WriteStream(),
    write_log = new Log(Log.DEBUG, write_stream);
    write_log.notice('foo');

    var read_stream = new ReadStream(write_stream.data),
    read_log = new Log('debug', read_stream),
    lines = [];

    read_log.on('line', function(line){
      lines.push(line);
    });
    
    beforeExit(function() {
      assert.equal(1, lines.length);
      assert.equal(true, lines[0].date.getTime() > 0);
    });
  },
  'test custom date format': function(beforeExit) {
    var write_stream = new WriteStream(),
    custom_date = { write: function(d) { return 42; }, read: function(s) { return new Date(parseInt(s, 10)); } },
    write_log = new Log(Log.DEBUG, write_stream, custom_date);
    write_log.notice('foo');

    var read_stream = new ReadStream(write_stream.data),
    read_log = new Log('debug', read_stream, custom_date),
    lines = [];
    read_log.on('line', function(line){
      lines.push(line);
    });

    beforeExit(function() {
      assert.equal(1, lines.length);
      assert.equal(42, lines[0].date.getTime());
    });
  }
};  
  