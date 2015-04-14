var newrelic = require('newrelic');
var express = require('express');
var seatGeek = require('./seatGeek');
var gamblingCoupons = require('./gamblingCoupons');

var medicalCoupons = require('./medicalCoupons');
var bwlStore = require('./bwlStore');
var app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var locale = require("locale");
var analytics = require("./analytics");


// This line is from the Node.js HTTPS documentation.
var options = {
  //key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
 // cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};

var supported = new locale.Locales(["ru","en", "en_US"]);
var oneDay = 86400000;
var bloom = require('bloomfilter');

var allowCrossDomain = function(req, res, next) {
    console.log(req.url);
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
	
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);
app.use(app.router);
app.use(locale(supported));
app.use(express.static(__dirname + '/public', { maxAge: oneDay })); 
app.get('/country', function (req, res,next) {
	var locales = new locale.Locales(req.headers["accept-language"]);
	
	  var result = {};
	  result.country =  locales.best(supported);
	  res.send(
			JSON.stringify(result)
	  )
});


app.get('/notify', function (req, res,next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
//	newrelic.recordCustomEvent(eventType, attributes)
});




app.get('/bwl', function (req, res,next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var vertical = query['vertical'];
	if(vertical){
		getBwl(vertical).then(function (data) {
			res.send(JSON.stringify(data));
		})
		.catch(function (e) {
			console.log(e);
			res.status(500, {
            error: e
			});
		});;
	}
});

app.get('/bwl/bl', function (req, res,next) {

	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var vertical = query['vertical'];
	if(vertical){
		getBl(vertical).then(function (data) {
			var bloomFilter = new bloom.BloomFilter(
			  32 * 256, // number of bits to allocate.
			  10        // number of hash functions.
			 );
			 for (var i=0;i<= data.length;i++){
				 bloomFilter.add(data[i]);
			 }	
			res.send(JSON.stringify([].slice.call(bloomFilter.buckets)));
		})
		.catch(function (e) {
			console.log(e);
			res.status(500, {
            error: e
			});
		});;
	}
});
app.get('/medical', function (req, res,next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	for(param in query){
		if(!query[param]){
			var str = new Buffer(param, 'base64').toString('ascii');
			query.data = JSON.parse(str);
		}
	}
	
	if (query.data && query.data.kwc ){
		var medicalRequest = {};
		medicalRequest.keywords = [];
		medicalRequest.country = query.c;
		for (var i= 0; i<query.data.kwc.length && i<10; i++){
			medicalRequest.keywords.push(query.data.kwc[i].w);
		}
		
		medicalCoupons.getCoupons(medicalRequest).then(function (data) {
        res.setHeader('Content-Type', 'text/plain');
		var result = {};
		result.coupons = data || [];
				
		result.source ='medicalApi';
		
		res.end(JSON.stringify(result));
		})
		.catch(function (e) {
			console.log(e);
			res.status(500, {
            error: e
			});
		});
	}else{
		res.status(400, {
            error: "missing query words"
			});
	}
});
app.get('/gambling', function (req, res,next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	for(param in query){
		if(!query[param]){
			var str = new Buffer(param, 'base64').toString('ascii');
			query.data = JSON.parse(str);
		}
	}
	
	if (query.data && query.data.kwc && query.data.kwc.length > 0){
		var gamblingRequest = {};
		gamblingRequest.keywords = [];
		gamblingRequest.country = query.c;
		for (var i= 0; i<query.data.kwc.length && i<10; i++){
			gamblingRequest.keywords.push(query.data.kwc[i].w);
		}
		
		gamblingCoupons.getCoupons(gamblingRequest).then(function (data) {
        res.setHeader('Content-Type', 'text/plain');
		var result = {};
		result.coupons = data || [];
				
		result.source ='gamblingApi';
		
		res.end(JSON.stringify(result));
		})
		.catch(function (e) {
			console.log(e);
			res.status(500, {
            error: e
			});
		});
	}else{
		res.status(400, {
            error: "missing query words"
			});
	}
});
app.get('/tickets', function (req, res,next) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	for(param in query){
		if(!query[param]){
			var str = new Buffer(param, 'base64').toString('ascii');
			query.data = JSON.parse(str);
		}

	}
	
	if (query.data && query.data.kwc && query.data.kwc.length > 0){
		var geekRequest = {};
		geekRequest.keywords = [];
		for (var i= 0; i<query.data.kwc.length && i<10; i++){
			geekRequest.keywords.push(query.data.kwc[i].w);
		}
		
		seatGeek.getTickets(geekRequest).then(function (data) {
        res.setHeader('Content-Type', 'text/plain');
		var result = {};
		result.events = data.events || [];
		result.performers = data.performer ? [data.performer] : [];
		result.source ='ticketsApi';
		
		res.end(JSON.stringify(result));
		})
		.catch(function (e) {
			console.log(e);
			res.status(500, {
            error: e
			});
		});
	}else{
		res.status(400, {
            error: "missing query words"
			});
	}
	
})

function getWl(vertical){
	var Q = require('q');
	var deferred = Q.defer();	
	
	switch (vertical){		
		case 'gambling': 
			 dataStore.getGamblingWhiteList(deferred);
			 break;	
		default:
			 deferred.resolve([]);
	}
	
	return deferred.promise;
	
	
}

function getBwl(vertical){
	var Q = require('q');
	var deferred = Q.defer();	
	
	switch (vertical){		
		case 'tickets': 
			 bwlStore.getBlackWhiteList('tickets',deferred);
			 break;	
		case 'gambling': 
			 bwlStore.getBlackWhiteList('gambling',deferred);
			 break;	
		case 'medical': 
			 bwlStore.getBlackWhiteList('medical',deferred);
			 break;	
		default:
			 deferred.resolve({'white': [],'black' :[]});
	}
	
	return deferred.promise;
	
	
}
var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
//httpsServer.listen(443);


console.log("Server running at http://127.0.0.1:3000/");
