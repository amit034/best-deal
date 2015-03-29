/// <reference path="../Context/LVContext"/>
/// <reference path="../Context/VisualContext"/>
/// <reference path="../Common/Promise"/>
/// <reference path="../Data/DataResult"/>
/// <reference path="Product"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            (function (VisualRealEstate) {
                VisualRealEstate[VisualRealEstate["LEFT_PANEL"] = 0] = "LEFT_PANEL";
                VisualRealEstate[VisualRealEstate["RIGHT_PANEL"] = 1] = "RIGHT_PANEL";
                VisualRealEstate[VisualRealEstate["TOP_PANEL"] = 2] = "TOP_PANEL";
                VisualRealEstate[VisualRealEstate["BOTTOM_PANEL"] = 3] = "BOTTOM_PANEL";
                VisualRealEstate[VisualRealEstate["MAIN_TABLE"] = 4] = "MAIN_TABLE";
                VisualRealEstate[VisualRealEstate["MAIN_IMAGE"] = 5] = "MAIN_IMAGE";
                VisualRealEstate[VisualRealEstate["IMAGE_RIGHT"] = 6] = "IMAGE_RIGHT";
                VisualRealEstate[VisualRealEstate["IMAGE_INNER"] = 7] = "IMAGE_INNER";
                VisualRealEstate[VisualRealEstate["APPNEXUS_SPECIAL"] = 8] = "APPNEXUS_SPECIAL";
                VisualRealEstate[VisualRealEstate["BANNER_SQUERE"] = 9] = "BANNER_SQUERE";
                VisualRealEstate[VisualRealEstate["SEARCH_BAR"] = 10] = "SEARCH_BAR";
            })(Products.VisualRealEstate || (Products.VisualRealEstate = {}));
            var VisualRealEstate = Products.VisualRealEstate;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
