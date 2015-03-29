/// <reference path="IProductVisual.ts"/>
/// <reference path="IProductLogic.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            var Product = (function () {
                function Product(productName, logic, visual) {
                    this.logic = null;
                    this.name = productName;
                    this.logic = logic;
                    this.visual = visual;
                }
                /**
                 * Classifies the relevancy of the Product to the current page. Values between -1 and 1.
                 * @param context - current context.
                 * @param scraper - scraper component with which to access page contents.
                 */
                Product.prototype.classify = function (context) {
                    return this.logic.classify(context);
                };
                return Product;
            })();
            Products.Product = Product;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
