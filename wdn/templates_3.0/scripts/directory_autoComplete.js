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
						WDN.jQuery.ajax({
							delay: 555,
			    			url: 'http://ucommmeranda.unl.edu/workspace/UNL_Peoplefinder/www/service.php?q='+request.term+'&format=json',
			    			dataType: "json",
			    			success: function(data) {
			    				var rows = new Array();
			    				for(var e=0; e<data.length; e++){
		    						if (data[e].displayName){
		    							rows[e] = {
			    								label : '<span class="fn">'+data[e].displayName[0]+'</span>',
			    								value : data[e].displayName[0],
			    								key : data
			    						};
		    						}
			    					if(rows.length == 10){
			    						break;
			    					}
							    };
			    				response(rows);
						    }
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