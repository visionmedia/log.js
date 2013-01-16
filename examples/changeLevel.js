
/**
 * Module dependencies.
 */

var Log = require('../lib/log')
  , log = new Log();

var loop = 0;

function LogStuffOnLevels(){
  loop++;
  log.debug('a debug message %s',loop);
  log.info('a info message %s',loop);
  log.notice('a notice message %s',loop);
  log.warning('a warning message %s',loop);
  log.error('a error message %s',loop);
  log.critical('a critical message %s',loop);
  log.alert('a alert message %s',loop);
  log.emergency('a emergency message  %s',loop);
}

for(var i=0;i<8;i++){
  log.setLevel(i);
  LogStuffOnLevels();
}
