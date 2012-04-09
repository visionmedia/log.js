var fs = require('fs');
var Log = require('log');
var logger;

function formatDate(dt) {
	var month = dt.getMonth() + 1;
	month = (month < 10) ? ('0'+month) : month;
	var date = dt.getDate();
	date = (date < 10) ? ('0'+date) : date;
	var strDate = dt.getFullYear() + '-' + month + '-' + date;	//yyyy-MM-dd
	return strDate;
}

function initializeLog(logFileName) {
	var stream = fs.createWriteStream(logFileName, {flags: 'a+', mode:0777});
	logger = new Log('debug', stream, {rotate:true, rotationTime:20});
	logger.on('rotate', function (rotateTime) {
		logger.info('Time to Rotate the log file: ' + rotateTime);
		strDate = formatDate(rotateTime);
		console.log(strDate);
		stream.destroy();
		
		stream.on('close', function(){
			fs.rename(logFileName, logFileName+'.'+strDate, function(){
				console.log('Re-initializing logger.');
				initializeLog(logFileName);
			});
		});
		stream.on('error', function(err){
			console.log('Error: ' + err);
		});
	});
}

initializeLog('/var/log/node/node.log');

logger.debug('Counting Stars on this bright sunny day!');
var i = 1;
setInterval(function() {
	console.log('Star: ' + i);
	logger.debug('Star: ' + i);
	i++;
}, 2000);
