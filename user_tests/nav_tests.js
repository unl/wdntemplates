var startTime, stopTime, uniqueID;
var counter = 0;
var types = ['flag','mega'];
var userType = 'Other';
var urlParams = {};

timer = function() {
	return {
		start : function(){
			startTime = new Date().getTime();
			console.log(startTime);
		},
		
		difference : function(){
			time = (stopTime - startTime)/1000;
			return time;
		},
		
		stop : function(testType, testID){
			stopTime = new Date().getTime();
			console.log(stopTime);
			ui.testComplete(testType, testID, startTime, stopTime, timer.difference(), counter);
		}
	};
}();

store = function() {
	return {
		setup: function(){
			
		},
		
		save : function(testType, testID, startTime, endTime, difference, testOrder){
			WDN.post('dump.php', {'testType' : testType, 'testID' : testID , 'userID' : uniqueID, 'startTime' : startTime, 'endTime' : endTime, 'testOrder' : testOrder, 'userType' : userType}, function(data){
				WDN.log(data);
			});
		}
	};
}();

ui = function() {
	
	var variations = [1,2,3,4,5,6,7,8,9,10];
	
	var variationsSeen = [];
	
	return {
		
		initialize : function(){
			if (ui.isTester()){
				uniqueID = 0;
			} else {
				uniqueID = new Date().getTime();
			}
			WDN.jQuery('#testing button').hide();
			WDN.jQuery('#uniqueID').append(uniqueID);
			dropDown = WDN.jQuery('#userType');
			selectBox = WDN.jQuery('.selectBox');
			
			dropDown.hide();
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
			
			firstType = ui.random(types);
			if (firstType == 'flag'){
				secondType = 'mega';
			} else {
				secondType = 'flag';
			}
			WDN.jQuery('#userType li').click(function(){
				userType = WDN.jQuery(this).attr('id');
				WDN.jQuery('#qualifiers').remove();
				ui.updateStatus('Excellent, thanks! Now, let\'s begin');
				ui.toggleType(firstType);
			});
		},
		
		isTester : function() {
			//Based on QS parameter, we can determine if this is a tester. (?testthetest=true)
			var results = new RegExp('[\\?&]testthetest=([^&#]*)').exec(window.location.href);
			WDN.log(results);
			if (!results) {return false;}
			if (results[1] == 'true'){
				return true;
			} else {
				return false;
			}
		},
		
		type : function(){
			return(WDN.jQuery('#navigation').attr('class'));
		},
		
		setup : function(){
			WDN.jQuery('.test').hide();
			WDN.jQuery('#exercise').empty();
			WDN.log(variationsSeen);
			do {
				currentRandom = ui.random(variations);
				i = WDN.jQuery.inArray(currentRandom, variationsSeen);
			}
			while (i > -1); 
			//console.log(currentRandom);
			variationsSeen.push(currentRandom);
			counter++;
			//console.log(counter);
			ui.startTest(currentRandom); //Now we have a random number never used.
		},
		
		chooseTest : function(){
			WDN.log(counter);
			if (counter == 5){ //we need to switch to the other type
				WDN.log('changing to other navgition type '+counter);
				ui.toggleType(secondType);
			} else {
				if (counter < 10){
					ui.setup();
				} else {
					ui.endTests();
				}
			}
		},
		
		toggleType : function(newType) {
			//variationsSeen.length = 0;
			WDN.jQuery("#navigation").removeAttr('class').addClass(newType);
			WDN.log('navigation type toggled');
			ui.setup();
		},
		
		changeTypeTest : function(){ //resets
			
		},
		
		random : function(theArray){
			thisVariation = theArray[Math.floor(Math.random()*theArray.length)];
			return thisVariation;
		},
		
		startTest : function(id){ //determine which section to run and setup the test
			WDN.jQuery('#navigation').empty().load(
				'navigation/'+id+'.html',
				function(){
					ui.update(id);
				}
			);
		},
		
		update : function(id) {
			WDN.initializePlugin('navigation');
			WDN.log('ui.update id= '+id);
			if (id != 5 && id !=10){ //test 5,10 are multisteps, so we need a bit more logic.
				data = WDN.jQuery('#test1');
				data.show().find('h3 > span').text(counter); //showing the individual test
				WDN.jQuery('#test1 li span').text(WDN.jQuery('#navigation a.'+ui.type()).eq(0).text());
				WDN.jQuery('#navigation a.'+ui.type()).eq(0).click(function(){
					timer.stop(ui.type(),id);
					return false;
				});
			} else {
				data = WDN.jQuery('#test2');
				data.show().find('h3 > span').text(counter); //showing the individual test
				WDN.log('Setup the two step test');
				WDN.jQuery('#test2 li span').eq(0).text(WDN.jQuery('#navigation a.'+ui.type()).eq(1).text());
				WDN.jQuery('#test2 li span').eq(1).text(WDN.jQuery('#navigation a.'+ui.type()).eq(0).text());
				stepOneComplete = false;
				WDN.jQuery('#navigation a.'+ui.type()).eq(1).click(function(){
					stepOneComplete = true;
					WDN.jQuery("#exercise ol li").eq(0).css({'text-decoration' : 'line-through', 'opacity' : '0.5'});
					return false;
				});
				WDN.jQuery('#navigation a.'+ui.type()).eq(0).click(function(){
					if(stepOneComplete){
						timer.stop(ui.type(),id);
					}
					return false;
				});
			}
			WDN.jQuery('#testing button').show();
			data.clone().appendTo('#exercise');
			WDN.jQuery('#exercise .test').removeAttr('id');
			WDN.jQuery('#testing').show(); //show everything
		},
		
		testComplete : function(testType, testID, startTime, endTime, difference, testOrder) {
			ui.updateStatus('Great job! Here\'s your next exercise. <span>'+ timer.difference() + '</span>');
			ui.chooseTest();
			store.save(testType, testID, startTime, endTime, difference, testOrder);
		},
		
		updateStatus : function(msg){
			WDN.jQuery('#testing .status').html(msg);
		},
		
		endTests : function(){
			ui.updateStatus('Thanks for your help making unl.edu awesome! <span>'+ timer.difference() + '</span>');
			WDN.jQuery('#testing .begin, #testing .test').hide();
			WDN.jQuery('#testing').show();
			WDN.jQuery('#testing .final').show();
		}
	};
}();

window.onload = function(){
	firstType = ui.random(types);
	if (firstType == 'flag'){
		secondType = 'mega';
	} else {
		secondType = 'flag';
	}
	ui.initialize();
	//ui.toggleType(firstType);
	WDN.jQuery('document').ready(function(){
		//invalidate all the links on the page so our user doesn't navigate away.
		WDN.jQuery('a').attr({'href' : '#'});
		WDN.jQuery('button.begin').click(function(){
			WDN.jQuery('#testing').hide();
			timer.start();
			return false;
		});
		WDN.jQuery('#hideTesting').click(function(){
			WDN.jQuery('#testing').hide();
			return false;
		});
		WDN.jQuery('#showTesting').click(function(){
			WDN.jQuery('#testing').show();
			return false;
		});
	});
};