/*!
 * Log.js
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 * Small changes to add layout and colors by Edmond Meinfelder
 */

/**
 * Module dependencies.
 */
var EventEmitter = require('events').EventEmitter;
var colors = require('colors');

/**
 * Color settings for console logging.
 */
var lvlColors = {
    EMERGENCY: 'red',
    ALERT: 'red',
    CRITICAL: 'red',
    ERROR: 'red',
    WARNING: 'yellow',
    NOTICE: 'cyan',
    INFO: 'green',
    DEBUG: 'blue',
};

/**
 * Effects for the console based on logging facility.
 */
var lvlEffects = {
    EMERGENCY: 'inverse',
    ALERT: 'bold',
    CRITICAL: 'underline',
    ERROR: false,
    WARNING: false,
    NOTICE: false,
    INFO: false,
    DEBUG: 'bold',
};

/**
 * Initialize a `Loggeer` with the given log `level` defaulting
 * to __DEBUG__ and `stream` defaulting to _stdout_.
 * @param {Number} level 
 * @param {Object} stream 
 * @public
 */
var Log = exports = module.exports = function Log(level, stream){
    if (typeof level === 'object') {
        var cfg = level;
        this.setOptions(cfg);
    } else {
        this.setOptions( { level: level, fileStream: stream } );
    }
};

/**
 * Numeric values for the logging facilities.
 * @type Number
 */
exports.EMERGENCY = 0;
exports.ALERT     = 1;
exports.CRITICAL  = 2;
exports.ERROR     = 3;
exports.WARNING   = 4;
exports.NOTICE    = 5;
exports.INFO      = 6;
exports.DEBUG     = 7;

/**
 * Prototype for the Log object.
 */ 
Log.prototype = {

    /**
     * @private
     * An easy way to set the Log object options.
     */
    setOptions : function (cfg) {
        if ('string' == typeof cfg.level)
            this.level = exports[cfg.level.toUpperCase()];
        else if ('number' === typeof cfg.level)
            this.level = cfg.level;
        else
            this.level = exports.DEBUG;

        if (typeof cfg.name === 'string')
            this.facilityName = cfg.name;
        else
            this.facilityName = 'Unnamed';

        this.stream = cfg.fileStream || false;
        this.console = (cfg.consoleLogging === true ? process.stdout : false);
        this.color = (cfg.colorConsoleLogging === true ? true : false);

        if (typeof cfg.debugLvlConsoleFx === 'object')
            lvlEffects = cfg.debugLvlConsoleFx;

        if (typeof cfg.debugLvlColors === 'object')
            lvlColors = cfg.debugLvlColors;

        if (typeof cfg.logMsgPattern === 'string')
            this.logMessagePattern = cfg.logMsgPattern;
        else
            this.logMessagePattern = '[%d{ISO8601}] [%p] %c - %m{1}';

        if (cfg.fileStream.readable)
            this.read();
    },
    
    /**
     * Start emitting "line" events.
     * @public
     */
    read: function(){
        var buf = '';
        var self = this;
        var stream = this.stream;

        stream.setEncoding('utf8');
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
                    Self.emit('line', obj);
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
     * @param    {String} levelStr
     * @param    {Array} args
     * @api private
     */
    log: function(levelStr, args) {
        if (exports[levelStr] <= this.level) {
            var i = 1;
            var msg = args[0].replace(/%s/g, function(){
                return args[i++];
            });

            var event = {
                categoryName: this.facilityName,
                startTime: new Date(),
                data: msg,
                level: levelStr
            };

            var layouts = require('./layouts');
            var makeMsg = layouts.patternLayout('[%d{ISO8601}] [%p] %c - %m{1}');
            var msgWithHeader = makeMsg(event) + '\n';

            if (this.console) {
                var consoleMsg;
                if (this.color)
                    consoleMsg = msgWithHeader[lvlColors[levelStr]];
                else
                    consoleMsg = msgWithHeader;
                if (this.color && lvlEffects[levelStr])
                    consoleMsg = consoleMsg[lvlEffects[levelStr]];
                this.console.write(consoleMsg);
            }

            if (this.stream !== false)
                this.stream.write(msgWithHeader);
        }
    },

    /**
     * Log emergency `msg`.
     * @param    {String} msg
     * @public
     */
    emergency: function(msg){
        this.log('EMERGENCY', arguments);
    },

    /**
     * Log alert `msg`.
     * @param    {String} msg
     * @public
     */
    alert: function(msg){
        this.log('ALERT', arguments);
    },

    /**
     * Log critical `msg`.
     * @param    {String} msg
     * @public
     */
    critical: function(msg){
        this.log('CRITICAL', arguments);
    },

    /**
     * Log error `msg`.
     * @param    {String} msg
     * @public
     */
    error: function(msg){
        this.log('ERROR', arguments);
    },

    /**
     * Log warning `msg`.
     * @param    {String} msg
     * @public
     */
    warning: function(msg){
        this.log('WARNING', arguments);
    },

    /**
     * Log notice `msg`.
     * @param    {String} msg
     * @public
     */
    notice: function(msg){
        this.log('NOTICE', arguments);
    },

    /**
     * Log info `msg`.
     * @param    {String} msg
     * @public
     */ 
    info: function(msg){
        this.log('INFO', arguments);
    },

    /**
     * Log debug `msg`.
     * @param    {String} msg
     * @public
     */
    debug: function(msg){
        this.log('DEBUG', arguments);
    }
};

/**
 * Inherit from `EventEmitter`.
 */
Log.prototype.__proto__ = EventEmitter.prototype;
