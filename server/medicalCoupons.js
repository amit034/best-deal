 
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
				banners.push(createCouponResult(keywords , null,'http://mis-spinecenter.org','http://54.173.130.250/Partials/images/medical/mis-spinecenter.jpg'));
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il','http://54.173.130.250/Partials/images/medical/onco-surgery.png'));
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il/pop-images/Amsalem_Medical_Oncology.html','http://54.173.130.250/Partials/images/medical/onco-surgery2.png'));

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
