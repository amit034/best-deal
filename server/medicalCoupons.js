 
var _ = require('underscore-node');
var Q = require('q');
var http = require('request');
var qs = require('qs');  

exports.getCoupons= function(request) {
 
  var deferred = Q.defer();	
  
  if (request && request.keywords  ){
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
		
		case 'il' : 
		break;
		case 'ru' :
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il/pop-images/index.html?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/onco-surgery3.jpg'));
				banners.push(createCouponResult(keywords , null,'http://mis-spinecenter.org/?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/mis-spinecenter.jpg'));
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il/?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/onco-surgery.jpg'));
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il/pop-images/Amsalem_Medical_Oncology.html?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/onco-surgery2.jpg'));
				break;
		
		default:
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il/pop-images/index.html?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/onco-surgery3.jpg'));
				banners.push(createCouponResult(keywords , null,'http://mis-spinecenter.org/?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/mis-spinecenter.jpg'));
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il/?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/onco-surgery.jpg'));
				banners.push(createCouponResult(keywords , null,'http://onco-surgery.org.il/pop-images/Amsalem_Medical_Oncology.html?utm_source=popup&utm_medium=banner&utm_campaign=pop-up-banner','http://mirai-client-assets.s3.amazonaws.com/public/Partials/images/medical/onco-surgery2.jpg'));
				break;	
	}
	
	return banners;
}

function createCouponResult(keywords , script,link,image){
	
	return {
		script: script,
		link : link , 
		image  :{'src' : image , height: '125' , 'width' : '250' }, 
		keywords : keywords
	}
}
