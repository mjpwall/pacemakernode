

var conUrl = 'mongodb://pacemaker:pacemaker97813117@ds029911.mongolab.com:29911/pacemaker';

exports.setCon = function(){
	conUrl = 'mongodb://pacetest:testmw97813117@ds029901.mongolab.com:29901/pacetest';
}

exports.getCon = function(){
	return conUrl;
}