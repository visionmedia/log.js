
/**
 * Module dependencies.
 */

var Log = require('../lib/log');
var fs = require('fs');
var stream = fs.createWriteStream(__dirname + '/file.log', { flags: 'a' });

var logConfig = {
    level: 'debug',
    name: 'ngServer',
    fileStream: stream,
    consoleLogging: true,
    colorConsoleLogging: true,
    logMessagePattern: '[%d{ISO8601}] [%p] %c - %m{1}'
};

//var log = new Log('debug', stream);
var log = new Log(logConfig);

log.debug('a debug message');
log.info('a info message');
log.notice('a notice message');
log.warning('a warning message');
log.error('a error message');
log.critical('a critical message');
log.alert('a alert message');
log.emergency('a emergency message');
