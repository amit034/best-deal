 
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
		break;
		case 'ru' :
		break;
		
		default:
				banners.push(createCouponResult(keywords , null,'http://online.koko-ko.com/promoRedirect?key=ej0yMTg3ODg1Mjg1Jmw9MCZwPTEwMjY0ODg%3D==','http://online.koko-ko.com/promoLoadDisplay?key=ej0yMTg3ODg1Mjg1Jmw9MCZwPTEwMjY0ODg%3D=='));
				banners.push(createCouponResult(keywords , null,'https://mmwebhandler.888.com/C/33974?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33974?sr=1110880&anid='));
							break;
	}
	
	return banners;
}

function createCouponResult(keywords , script,link,image){
	
	return {
		script: script,
		link : link , 
		image  :image , 
		keywords : keywords
	}
}
