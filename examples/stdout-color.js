
/**
 * Module dependencies.
 */

var Log = require('../lib/log')
  , log = new Log('trace').colorful();

/**
 * Default log.
 */
log.trace( 'Below is default logs.');
log.debug('a debug message');
log.info('a info message');
log.notice('a notice message');
log.warning('a warning message');
log.error('a error message');
log.critical('a critical message');
log.alert('a alert message');
log.emergency('a emergency %s', 'message');

/**
 * Setup our own colors
 */
log.colorful({
    ERROR : "\033[0;37m",
    CRITICAL : "\033[1;36m"
});

log.trace( 'Below is color-customed logs.');
log.debug('a debug message');
log.info('a info message');
log.notice('a notice message');
log.warning('a warning message');
log.error('a error message');
log.critical('a critical message');
log.alert('a alert message');
log.emergency('a emergency %s', 'message');

/**
 * Turn off color.
 */
log.colorful( false );
log.trace( 'Below is color-offed logs.');
log.debug('a debug message');
log.info('a info message');
log.notice('a notice message');
log.warning('a warning message');
log.error('a error message');
log.critical('a critical message');
log.alert('a alert message');
log.emergency('a emergency %s', 'message');

/**
 * Customize levels and colors
 */
log.customLevels({
    COMMAND: "\x1b[0;35m",
    DATA: "\x1b[0;33m",
    RESULT: "\x1b[0;36m"
}).colorful( true).setLevel( 'result' );

log.command( 'a command message' );
log.data( 'a data message' );
log.result( 'a result message' );

