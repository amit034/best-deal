 
var _ = require('underscore-node');
var Q = require('q');
var http = require('request');
var qs = require('qs');  
var ru = { '888' : [] , 'euro':[] , 'hill':[]};
var pl = { '888' : [] , 'euro':[] , 'hill':[]};
init();


exports.getCoupons= function(request) {
 
  var deferred = Q.defer();	
  
  if (request && request.keywords && request.keywords.length >=0  ){
	  console.log(request.keywords.join(" "));
	  deferred.resolve(getCouponsForCountry(request.keywords,request.country));
  }else{
	  deferred.reject("missing params") ;
  }
  
  return deferred.promise;
}

function init(){
	
	ru['888'].push(createCouponResult(null,'https://mmwebhandler.888.com/C/33974?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33974?sr=1110880&anid=')); //888
	ru['888'].push(createCouponResult(null,'https://mmwebhandler.888.com/C/33915?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33915?sr=1110880&anid=')); //888
	ru['888'].push(createCouponResult(null,'https://mmwebhandler.888.com/C/33802?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33802?sr=1110880&anid=')); //888
	
	pl['888'].push(createCouponResult( null,'https://mmwebhandler.888.com/C/33772?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33772?sr=1110880&anid=')); //888
	
	pl.euro.push(createCouponResult( null,'http://online.casinotropez.com/promoRedirect?key=ej0yMTg4MjE1OTEzJmw9MCZwPTEwMjY0ODg%3D==','http://online.casinotropez.com/promoLoadDisplay?key=ej0yMTg4MjE1OTEzJmw9MCZwPTEwMjY0ODg%3D==')); //euro	
	pl.euro.push(createCouponResult( null,'http://online.europacasino.com/promoRedirect?key=ej0yMTkwMzk3ODY3Jmw9MCZwPTEwMjY0ODg%3D==','http://online.europacasino.com/promoLoadDisplay?key=ej0yMTkwMzk3ODY3Jmw9MCZwPTEwMjY0ODg%3D==')); //euro
	pl.euro.push(createCouponResult(null,'http://online.titancasino.com/promoRedirect?key=ej0yMTg4NTQ2MTY1Jmw9MCZwPTEwMjY0ODg%3D==','http://online.titancasino.com/promoLoadDisplay?key=ej0yMTg4NTQ2MTY1Jmw9MCZwPTEwMjY0ODg%3D==')); //euro
	
	ru.euro.push(createCouponResult( null,'http://online.koko-ko.com/promoRedirect?key=ej0yMTg3ODg1Mjg1Jmw9MCZwPTEwMjY0ODg%3D==','http://online.koko-ko.com/promoLoadDisplay?key=ej0yMTg3ODg1Mjg1Jmw9MCZwPTEwMjY0ODg%3D=='));
	ru.euro.push(createCouponResult(null,'http://online.mik123.com/promoRedirect?key=ej0yMTkwNDAxMzM0Jmw9MCZwPTEwMjY0ODg%3D==','http://online.mik123.com/promoLoadDisplay?key=ej0yMTkwNDAxMzM0Jmw9MCZwPTEwMjY0ODg%3D=='));
	ru.euro.push(createCouponResult(null,'http://online.mig100.com/promoRedirect?key=ej0yMTg4MjE5Mzk2Jmw9MCZwPTEwMjY0ODg%3D==','http://online.mig100.com/promoLoadDisplay?key=ej0yMTg4MjE5Mzk2Jmw9MCZwPTEwMjY0ODg%3D=='));
	
	pl.hill.push(createCouponResult(null,'http://ads.eurogrand.com/redirect.aspx?pid=185051021&bid=1487412813&lpid=1487412397','http://netrefer-a.akamaihd.net/williamhill/EuroGrand_2015_new_250x250_PL_Euro.gif'));
	
	ru.hill.push(createCouponResult( null,'http://ads.eurogrand.com/redirect.aspx?pid=185051021&bid=1478809783&lpid=13519011','http://netrefer-a.akamaihd.net/williamhill/EuroGrand_2015_new_250x250_RU.gif'));
	
	}

function getCouponsForCountry(keywords,country){
	
	var banners = [];
	switch(country){
		
		case 'pl' : 
				banners.push(pl['888'][Math.floor(Math.random()* pl['888'].length)]);
				banners.push(pl.euro[Math.floor(Math.random()* pl.euro.length)]);
				banners.push(pl.hill[Math.floor(Math.random()* pl.hill.length)]);
				break;
		case 'ru' :				
				banners.push(ru['888'][Math.floor(Math.random()* ru['888'].length)]);
				banners.push(ru.euro[Math.floor(Math.random()* ru.euro.length)]);
				banners.push(ru.hill[Math.floor(Math.random()* ru.hill.length)]);
				break;		
		default:
				break;

	}
		
	return _.shuffle(banners);
}

function createCouponResult(script,link,image){
	
	return {
		script: script,
		link : link , 
		image  :{'src' : image , height: '250' , 'width' : '250' }
		
	}
}
