 
var _ = require('underscore-node');
var Q = require('q');
var http = require('request');
var qs = require('qs');  

exports.getCoupons= function(request) {
 
  var deferred = Q.defer();	
  
  if (request && request.keywords && request.keywords.length >1  ){
	  console.log(request.keywords.join(" "));
	  deferred.resolve(getCouponsForCountry(request.keywords,request.country));
  }else{
	  deferred.reject("missing params") ;
  }
  
  return deferred.promise;
}

function getCouponsForCountry(keywords,country){
	var banners = [];
	switch(country){
		
		case 'pl' : 
				banners.push(createCouponResult(keywords , null,'https://mmwebhandler.888.com/C/33772?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33772?sr=1110880&anid=')); //888
				banners.push(createCouponResult(keywords , null,'http://online.casinotropez.com/promoRedirect?key=ej0yMTg4MjE1OTEzJmw9MCZwPTEwMjY0ODg%3D==','http://online.casinotropez.com/promoLoadDisplay?key=ej0yMTg4MjE1OTEzJmw9MCZwPTEwMjY0ODg%3D==')); //euro
				banners.push(createCouponResult(keywords , null,'http://ads.eurogrand.com/redirect.aspx?pid=185051021&bid=1487412813&lpid=1487412397','http://netrefer-a.akamaihd.net/williamhill/EuroGrand_2015_new_250x250_PL_Euro.gif'));
				break;
		case 'ru' :
				banners.push(createCouponResult(keywords , null,'http://online.koko-ko.com/promoRedirect?key=ej0yMTg3ODg1Mjg1Jmw9MCZwPTEwMjY0ODg%3D==','http://online.koko-ko.com/promoLoadDisplay?key=ej0yMTg3ODg1Mjg1Jmw9MCZwPTEwMjY0ODg%3D=='));
				banners.push(createCouponResult(keywords , null,'https://mmwebhandler.888.com/C/33974?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33974?sr=1110880&anid='));		
				banners.push(createCouponResult(keywords , null,'http://ads.eurogrand.com/redirect.aspx?pid=185051021&bid=1478809783&lpid=13519011','http://netrefer-a.akamaihd.net/williamhill/EuroGrand_2015_new_250x250_RU.gif'));
				break;
		break;
		
		default:
				break;

	}
		
	return banners;
}

function createCouponResult(keywords , script,link,image){
	
	return {
		script: script,
		link : link , 
		image  :{'src' : image , height: '250' , 'width' : '250' }, 
		keywords : keywords
	}
}
