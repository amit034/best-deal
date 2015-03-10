/**
 * Created by arotbard on 10-Mar-15.
 */
myApp.controller("DealsController", function ($scope, keyWordFinderService) {
    keyWordFinderService.getKeyWords(function (model) {

        $scope.keyWord = model.keyWord;
        $scope.$apply()
    });
});