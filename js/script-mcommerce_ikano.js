(function(){
/*
	Added initStore & pdpa
	11-04-2019
*/
	var executables = [
		{fn: initStore, jquery: false, pages: ['/']},
		{fn: replaceHeaderFooter, jquery: false, pages: ['/mcommerce/shoppingcart', '/webapp/wcs/stores/servlet', '/login/create/', '/login/reset/']}
	];
	setTimeout(function(){
		init(executables);
	}, 1);

	function init(execs){
		execs = execs.reverse();
		for (var i = execs.length - 1; i >= 0; i--) {
			var exec = execs[i];
			for (var j = exec.pages.length - 1; j >= 0; j--) {
				initFn(exec.fn, exec.jquery, exec.pages[j]);
			}
		}
	}
	function initFn(callback, jquery, url){
		if(isPage(url))
			if(jquery)
				jQuery(document).ready(function($){callback();});
			else
				callback();
	}
	function isPage(page){
		var url = location.href,
			is_page = (url.indexOf(page) !== -1);
		return is_page;
	}

	// Store Detection
	function initStore(){
		window.localdev = window.localdev || {};
		var attrs = {
				countries: {
					kw: 'Kuwait'
				},
				offset: {
					'kw': '+2'
				},
				attr: [
					{country: 'my', store_id: 31, lang: 'en', lang_id: 40, regex: "(\/my\/en\/)|(\/en_MY\/)|(en_MY)|(langId=-40)"},
					{country: 'my', store_id: 31, lang: 'ms', lang_id: 39, regex: "(\/my\/ms\/)|(\/ms_MY\/)|(ms_MY)|(langId=-39)"},
					{country: 'kw', store_id: 37, lang: 'en', lang_id: 47, regex: "(\/kw\/en\/)|(\/kw_EN\/)|(th_TH)|(langId=-47)"},
					{country: 'kw', store_id: 37, lang: 'ar', lang_id: 47, regex: "(\/kw\/ar\/)|(\/kw_ar\/)|(th_TH)|(langId=-47)"}
				]
			},
			url = window.location.href;
		for (var i = attrs.attr.length - 1; i >= 0; i--) {
			var s = attrs.attr[i],
				regex = s.regex;
			if(url.match(regex) !== null){
				window.localdev['storeCountry'] = s.country,
				window.localdev['storeLang'] = s.lang,
				window.localdev['storeId'] = s.store_id,
				window.localdev['langId'] = '-'+ s.lang_id,
				window.localdev['storeTZ'] = attrs.offset[s.country],
				window.localdev['storeCountryLong'] = attrs.countries[s.country],
				window.localdev['storePath'] = '/'+ s.country +'/'+ s.lang,
				window.localdev['storeHreflang'] = s.lang +'-'+ s.country
				break;
			}
		}
	}

	function replaceHeaderFooter(){
		var path = "https://www.ikea.com"+ localdev.storePath +"/header-footer/",
			style = makeHttpObject();
			style.open("GET", path+ "style-fragment-recursive.html", true);
			style.send(null);

		style.onreadystatechange = function() {
			if(style.readyState === 4){
				document.querySelector('body').insertAdjacentHTML('afterbegin', style.responseText);

				var header = makeHttpObject();
					header.open("GET", path+ "header-fragment-recursive.html", true);
					header.send(null);
				header.onreadystatechange = function() {
					if(header.readyState === 4)
						document.querySelector('body').insertAdjacentHTML('afterbegin', header.responseText);
				};

				var footer = makeHttpObject();
					footer.open("GET", path+ "footer-fragment-recursive.html", true);
					footer.send(null);
				footer.onreadystatechange = function() {
					if(footer.readyState === 4){
						document.querySelector('body').insertAdjacentHTML('beforeend', footer.responseText);
						var cookieInfoShown = getCookie("cookieInfoShown");
						jQuery(".js-cookie-info__panel").promise().done(function(){
							if(cookieInfoShown === 'true')
								document.querySelector(".js-cookie-info__panel").classList.remove("cookie-info__panel--show");
						});
					}
				};

				setTimeout(function(){
					var script = makeHttpObject();
						script.open("GET", path+ "script-fragment-recursive.html", true);
						script.send(null);
					script.onreadystatechange = function() {
						if(script.readyState === 4){
							var scripts = jQuery(script.responseText);
							for (var i = 0; i < scripts.length; i++) {
								if(scripts[i]['id'] !== "iplugins-implementation-tag" && (scripts[i]['src'] !== undefined && scripts[i]['src'] !== "https://code.jquery.com/jquery-3.3.1.min.js" && scripts[i]['src'].indexOf("analytics/scripts/ga-main.js") === -1))
									jQuery('head').append(jQuery(scripts[i]));
							}
						}
					};
				}, 100);
				
				// overwrite Remove All Item action
				setTimeout(function(){
					var removeButton = $("#removeAllConfirmButton").click(function(e) {
						e.preventDefault();
						$("#removeAllConfirmButton").addClass("ui-disabled");
						$(".ikea-shoppinglist-remove-all").addClass("ui-disabled");
						$.mobile.loading("show", {
							text: "foo",
							textVisible: true,
							theme: "a",
							html: ""
						});
						window.location = location.protocol + "//" + document.location.host + "/webapp/wcs/stores/servlet/OrderItemDelete?orderItemId=*&URL=mOrderItemDisplayView&langId="+ window.localdev.langId +"&storeId="+ window.localdev.storeId +""
					});
				}, 500);
			}
		};
	}

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}


	function makeHttpObject() {
		try {return new XMLHttpRequest();}
		catch (error) {}
		try {return new ActiveXObject("Msxml2.XMLHTTP");}
		catch (error) {}
		try {return new ActiveXObject("Microsoft.XMLHTTP");}
		catch (error) {}
		throw new Error("Could not create HTTP request object.");
	}
})();
