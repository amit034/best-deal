var express = require('express');
var seatGeek = require('./seatGeek');
var app = express();
var url = require('url');

var oneDay = 86400000;


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
app.use(express.static(__dirname + '/public', { maxAge: oneDay })); 

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
		result.events = [];
		result.performers = [];
		result.events.concat(data.events) ;
		result.performers.concat([data.performer]);
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

app.listen(3000,"0.0.0.0");

console.log("Server running at http://127.0.0.1:3000/");
