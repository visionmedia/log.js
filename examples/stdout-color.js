
/**
 * Module dependencies.
 */

var Log = require('../lib/log')
  , log = new Log('notice').colorful();

log.debug('a debug message');
log.info('a info message');
log.notice('a notice message');
log.warning('a warning message');

/**
 * Setup our own colors
 */
log.colorful({
    ERROR : "\033[0;37m",
    CRITICAL : "\033[1;36m"
});

log.error('a error message');
log.critical('a critical message');
log.alert('a alert message');

/**
 * Turn colors off
 */
log.colorful(false);
log.emergency('a emergency %s', 'message');
log.emergency('a really %s emergency %s', 'bad', 'message');
