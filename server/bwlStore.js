
var Q = require('q');
var blackWhiteBlooms = {};
var bloom = require('bloomfilter');
exports.getBlackWhiteList = function(vertiacl,def){
	var deferred = def || Q.defer();
	if (blackWhiteBlooms[vertiacl]){
		 deferred.resolve(blackWhiteBlooms[vertiacl]);
		 return ;
		 
	}
	
	blackWhiteBlooms[vertiacl] = {};
	var whitePath  = "store/bwl/wl/" + vertiacl + ".csv";
	var blackPath  = "store/bwl/bl/" + vertiacl + ".csv";
	var promises = [];
	promises.push(loadDomains(whitePath));
	promises.push(loadDomains(blackPath));
	Q.all(promises).then(function(results){		 
		 blackWhiteBlooms[vertiacl].white = [].slice.call(results[0].buckets);
		 blackWhiteBlooms[vertiacl].black = [].slice.call(results[1].buckets);
		 deferred.resolve(blackWhiteBlooms[vertiacl]);
	}).catch(function (e) {
		 deferred.resolve(blackWhiteBlooms[vertiacl]);
	});
	
	return deferred.promise;
}

exports.getGamblingBlackList = function(def){
	var deferred = def || Q.defer();
	if (gamblingBl){
		 deferred.resolve(gamblingBl);
		 return ;
		 
	}
	
	gamblingBl = [];
	loadData('gamblingBl',gamblingBl).then(function(data){
		 gamblingBl = data;
		 deferred.resolve(gamblingBl);
	}).catch(function (e) {
		deferred.resolve(gamblingBl);
	});
	
	return deferred.promise;
}
function loadDomains(path){
	var deferred = Q.defer();
	var bloomFilter = new bloom.BloomFilter(
			  32 * 256, // number of bits to allocate.
			  10        // number of hash functions.
	);
	var csv = require("fast-csv");
	var fs = require('fs');
	fs.exists(path, function(exists) {
		  if (exists) {
			csv.fromPath(path)
				 .on("data", function(data){
					 bloomFilter.add(data[0]);
				 })
				 .on("end", function(){
					 deferred.resolve(bloomFilter);
				 })
		  } else {
			 deferred.resolve(bloomFilter);
		  }
	});

	return deferred.promise;
}
