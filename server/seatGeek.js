 
var _ = require('underscore-node');
var dateFormat = require('dateformat');
var Q = require('q');
var http = require('request');
var qs = require('qs');  
var trivialWords = ["tickets", "concerts","sports","arts", "theater", "family" ,"events", "more","official","site","nba","nhl","nfl","mbl","broadway" , "find"]
exports.getTickets = function(request) {
 
  var deferred = Q.defer();	
  
  if (request && request.keywords  ){
	  console.log(request.keywords.join(" "));
	  getEvents(_.difference (request.keywords, trivialWords),deferred);
  }else{
	  deferred.reject("missing params") ;
  }
  
  return deferred.promise;
}


function getEvents(keywords,def){
	
	var deferred = def || Q.defer();	
	
	if (keywords.length < 1 || _.difference(keywords, trivialWords).length < 1){
		deferred.resolve({});
	}else{
	   var keywordsStr = keywords.join("+");
	    
	   var q = '?' + qs.stringify({q: keywordsStr});
		http.get('http://api.seatgeek.com/2/events' + q + '&sort=datetime_utc.asc', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var geekResult = JSON.parse(body);
			
			if (geekResult && geekResult.events && geekResult.events.length >0){
				var performersArray = _.reduce(geekResult.events, function(performers, event){ 
						return _.uniq(performers.concat(event.performers));
						}, []);
				var performers = _.max(performersArray, function(performers){ 
					return wordCount(performers.name ,keywords); }
				);
				var performer = geekperformersToPerformer(performers);
				performer.keywords =  keywords.join(" ") ;
				console.log(performer.keywords);
				var result={};
				result.events = geekEventsToEvents(geekResult.events,keywords.join(" "));
				result.performer = performer;
				deferred.resolve(result) ;
				
			}else{
				keywords.pop();
				getEvents(keywords,deferred);
			}
			
		}else{
			deferred.reject(error) ;
		}
  
		});
	}
	
}

function geekEventsToEvents(events,keywordsStr){
	var arr = [];
	
	_.each(events,function(event){
		arr.push(geekEventToEvent(event,keywordsStr));
	});
	
	return arr; 
}

function geekEventToEvent(event,keywordsStr){
	
	return {
		title : event.venue ? event.title + " at " + event.venue.name : event.title,
		url : event.url + '?aid=11188',
		image: event.performers? event.performers[0].image : null,
		date: event.datetime_local? dateFormat(new Date(event.datetime_local),"ddd dd mmm yyyy HH:MM") : null,
		score: event.score,
		prices : {
					listing : event.stats.listing_count ,
					avg : event.stats.average_price,
					lowest : event.stats.lowest_price,
					highest : event.stats.highest_price
				  }	,
		keywords : keywordsStr
	}

}
function geekperformersToPerformer(performers){
	return {
		title : performers.name,
		url : performers.url + '?aid=11188',
		image: performers.image,
		score: performers.score	
	}

}

function wordCount(name,keywords){
	var parts = name.toLowerCase().split(" ");
	var count =   _.reduce(keywords, function(count, word){
				return count += _.contains(parts,word.toLowerCase());
			},0);
	if (count== parts.length){
		return count * 50;
	}else{
		return count;
	}
}