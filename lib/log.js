/*!
 * Log.js
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

 /**
 * Functions to support Log rotation
 */
function getNextDate(dt) {
  var nxt = new Date();
  nxt.setDate(dt.getDate()+1);
  return nxt;
}

function calculateTimeToRotate(rotationTime) {
  var milliSeconds;
  if (rotationTime) {
    var now = new Date;
    var rotateAt = new Date;
    if (now.getHours() >= rotationTime) {
	  rotateAt = getNextDate(now);
    }
    rotateAt.setHours(rotationTime);
	rotateAt.setMinutes(0);
	rotateAt.setSeconds(0);
    milliSeconds = rotateAt.getTime()-now.getTime();
  }
  return milliSeconds;
}

/**
 * Module dependencies.
 */
var EventEmitter = require('events').EventEmitter;

/**
 * Initialize a `Logger` with the given log `level` defaulting
 * to __DEBUG__ and `stream` defaulting to _stdout_.
 * 
 * Initialize the `rotate` flag with the given value, defaulting to `false` meaning it will NOT emit `rotate` event.
 * 
 * @param {Number} level 
 * @param {Object} stream 
 * @api public
 */

var Log = exports = module.exports = function Log(level, stream, userPrefs){

  if ('string' == typeof level) level = exports[level.toUpperCase()];
  this.level = level || exports.DEBUG;
  this.stream = stream || process.stdout;
  if (this.stream.readable) this.read();
  
  this.rotate = false;
  if(userPrefs) {
    this.rotate = userPrefs.rotate || false;
    this.rotationTime = userPrefs.rotationTime || 0;
    this.timeToRotate = calculateTimeToRotate(this.rotationTime);
	
    if (this.rotate == true)
      this.initRotation(this.timeToRotate);
  }
};

/**
 * System is unusable.
 * 
 * @type Number
 */

exports.EMERGENCY = 0;

/**
 * Action must be taken immediately.
 * 
 * @type Number 
 */

exports.ALERT = 1;

/**
 * Critical condition.
 *
 * @type Number
 */

exports.CRITICAL = 2;

/**
 * Error condition.
 * 
 * @type Number
 */

exports.ERROR = 3;

/**
 * Warning condition.
 * 
 * @type Number
 */

exports.WARNING = 4;

/**
 * Normal but significant condition.
 * 
 * @type Number
 */

exports.NOTICE = 5;

/**
 * Purely informational message.
 * 
 * @type Number
 */

exports.INFO = 6;

/**
 * Application debug messages.
 * 
 * @type Number
 */

exports.DEBUG = 7;

/**
 * prototype.
 */ 

Log.prototype = {
  /**
   * Initiates Log rotation timer. Emits `rotate` event after waiting till specified time.
   */
  initRotation: function(waitTime) {
    var self = this;
    setTimeout(function(){
      self.emit('rotate', new Date);
    }, waitTime);
  },

  /**
   * Start emitting "line" events.
   *
   * @api public
   */
  
  read: function(){
    var buf = ''
      , self = this
      , stream = this.stream;

    stream.setEncoding('ascii');
    stream.on('data', function(chunk){
      buf += chunk;
      if ('\n' != buf[buf.length - 1]) return;
      buf.split('\n').map(function(line){
        if (!line.length) return;
        try {
          var captures = line.match(/^\[([^\]]+)\] (\w+) (.*)/);
          var obj = {
              date: new Date(captures[1])
            , level: exports[captures[2]]
            , levelString: captures[2]
            , msg: captures[3] 
          };
          self.emit('line', obj);
        } catch (err) {
          // Ignore
        }
      });
      buf = '';
    });

    stream.on('end', function(){
      self.emit('end');
    });
  },
  
  /**
   * Log output message.
   * @param  {String} levelStr
   * @param  {Array} args
   * @api private
   */
  log: function(levelStr, args) {
    if (exports[levelStr] <= this.level) {
      var i = 1;
      var msg = args[0].replace(/%s/g, function(){
        return args[i++];
      });
      var logTime = new Date;
	  try {
        this.stream.write(
            '[' + logTime.toLocaleString() + ']'
          + ' ' + levelStr
          + ' ' + msg
          + '\n'
        );
      } catch(err) {
        console.log(err);
      }
    }
  },

  /**
   * Log emergency `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  emergency: function(msg){
    this.log('EMERGENCY', arguments);
  },

  /**
   * Log alert `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  alert: function(msg){
    this.log('ALERT', arguments);
  },

  /**
   * Log critical `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  critical: function(msg){
    this.log('CRITICAL', arguments);
  },

  /**
   * Log error `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  error: function(msg){
    this.log('ERROR', arguments);
  },

  /**
   * Log warning `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  warning: function(msg){
    this.log('WARNING', arguments);
  },

  /**
   * Log notice `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  notice: function(msg){
    this.log('NOTICE', arguments);
  },

  /**
   * Log info `msg`.
   *
   * @param  {String} msg
   * @api public
   */ 

  info: function(msg){
    this.log('INFO', arguments);
  },

  /**
   * Log debug `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  debug: function(msg){
    this.log('DEBUG', arguments);
  }
};

/**
 * Inherit from `EventEmitter`.
 */

Log.prototype.__proto__ = EventEmitter.prototype;