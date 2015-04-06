 
var _ = require('underscore-node');
var Q = require('q');
var http = require('request');
var qs = require('qs');  

exports.getCoupons= function(request) {
 
  var deferred = Q.defer();	
  
  if (request && request.keywords && request.keywords.length >1  ){
	  console.log(request.keywords.join(" "));
	  deferred.resolve(getCouponsForCountry(request.country));
  }else{
	  deferred.reject("missing params") ;
  }
  
  return deferred.promise;
}

function getCouponsForCountry(country){
	var banners = [];
	switch(country){
		
		case 'pl' : 
		break;
		case 'ru' :
		break;
		
		default:
				banners.push(createCouponResult(null,'https://mmwebhandler.888.com/C/33974?sr=1110880&anid=&isDirect=false','https://mmwebhandler.888.com/I/33974?sr=1110880&anid='));
				break;
	}
	
	return banners;
}

function createCouponResult(script,link,image){
	
	return {
		script: script,
		link : link , 
		image  :image
	}
}
