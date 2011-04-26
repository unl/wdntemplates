WDN.directory_autoComplete = function() {
	return {
		keymatch : false,
		
		initialize : function() {
			WDN.loadJS('/wdn/templates_3.0/scripts/plugins/ui/jQuery.ui.js', function(){
				WDN.loadCSS('/wdn/templates_3.0/css/content/autocomplete.css');
				WDN.jQuery('input.wdn_directory_autoComplete').attr("autocomplete", "off");
				WDN.jQuery('input.wdn_directory_autoComplete').autocomplete({
					delay: 555,
					minLength: 3,
					source: function(request, response) {
						WDN.get('http://directory.unl.edu/service.php?q='+request.term+'&format=json', false,
			    			function(data) {
								if (!(data instanceof Object)) {
									data = WDN.jQuery.parseJSON(data);
								}
			    				var rows = new Array();
			    				var i = 0;
			    				for(var e=0; e<data.length; e++){
		    						if (data[e].displayName){		    							
									rows[i] = {
			    								label : '<span class="fn">'+data[e].displayName[0]+'</span>',
			    								value : data[e].displayName[0],
			    								key : data[e]
			    						};
		    							i++;
		    						}
			    					if(rows.length == 10){
			    						break;
			    					}
							    };
			    				response(rows);
						    });
			    	},
					select: function(e, ui) {
						WDN.directory_autoComplete.callback(ui.item.key);
					}
				});
			});
		},
		
		callback : function(data) {
			alert('You need your own callback! However, I\'ll send you the uid: ' + data);
		}
	};
}();

