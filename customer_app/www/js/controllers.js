angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope,$rootScope,$state,userService,$ionicLoading) {

	$scope.alerts = [];

	$scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  	};
  
  $scope.signIn = function(user) {

   	

    console.log('Sign-In', user);

     $scope.loading = $ionicLoading.show({
       content: 'Signing In',
       showBackdrop: true
     });


    userService.login(user).then(function(retdata){
    		
			$rootScope.user = retdata.data;
    		$state.go('tab.dash');
    		$ionicLoading.hide();

	},function(error){
		
		console.log("Error in Login" + JSON.stringify(error));
	
		$scope.alerts.push({ type: 'danger', msg: error.statusText });
		$ionicLoading.hide();

	});
			
  };
  
})

.controller('RegistrationCtrl', function($scope, $state,userService) {


  
$scope.register = function(user) {

	user.type = "customer";
	user.rating = 0;
	user.rating_count = 0;
	user.likes = 0;
	user.category = "none";

    console.log('Register', user);

    userService.register(user).then(function(retdata){

			console.log(retdata)
    		$state.go('signin');

	});
    
		
  
 };
  
})

.controller('DashCtrl', function($scope,$rootScope,$ionicLoading,$state,$compile,uiGmapGoogleMapApi,$ionicPopover,customerService) {

	$scope.markers = [];
	$scope.markercount = 0;	
	$scope.category = 'none';
	console.log($rootScope.user);
	

	var events = {
          

          places_changed: function (searchBox) {
          		console.log(searchBox)
          		var places = searchBox.getPlaces();
          		console.log(places);



          		var latitude = places[0].geometry.location.k, longitude = places[0].geometry.location.D;
													            			
			          

			            						var updateusergeodata = new Object();
												updateusergeodata.user_id = $rootScope.user._id;
												updateusergeodata.latitude = latitude
												updateusergeodata.longitude  = longitude;



												$scope.longitude = longitude;
												$scope.latitude = latitude;

												
												

												$scope.$apply(function () {
													$scope.map.refresh(latitude,longitude);
										           	$scope.markers[0].latitude = latitude;
													$scope.markers[0].longitude = longitude;
													console.log($scope.markers[0])
										        });


		

												customerService.user_update_geo(updateusergeodata).then(function(retdata){

													console.log("Updated users geo coordinates" + JSON.stringify(retdata));
										    
												});


    }}
    
   $scope.searchbox = { template:'searchbox.tpl.html', events:events, parentdiv : 'searchbarcontrol' };



   $ionicPopover.fromTemplateUrl('contractor_categories.html', {
    	scope: $scope,
  	}).then(function(popover) {
    	$scope.popover = popover;
  	});

  	$scope.openPopover = function($event) {
    	$scope.popover.show($event);

  	};

	$scope.closePopover = function() {
	    $scope.popover.hide();
	};
	  //Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
	    $scope.popover.remove();
	});
	  // Execute action on hide popover
	$scope.$on('popover.hidden', function() {
	    // Execute action
	});
	  // Execute action on remove popover
	$scope.$on('popover.removed', function() {
	    // Execute action
	});

	$scope.set_category = function($event,category) {
    	console.log($event);
    	$scope.category = category;
	};

	$scope.$watch("category", function(newValue, oldValue) {
	
		if (newValue != oldValue) {

			var temp  = $scope.markers.splice(0,$scope.markers.length);
			$scope.markers = temp;
			console.log("The temporaty marker place for you is :" + JSON.stringify(temp));
	    	$scope.popover.hide();



	    										var geonear = new Object();
												geonear.radius = 1000;
												geonear.latitude = $scope.latitude;
												geonear.longitude  = $scope.longitude;

										

												customerService.get_near_users(geonear).then(function(retdata){

													//console.log("The following users were found close by: " + JSON.stringify(retdata));
												

													for (i in retdata.data){

													//	if (retdata.data[i].dis != 0){

															var oneuser  = retdata.data[i].obj;
															addmarker(oneuser.pos[1],oneuser.pos[0],oneuser._id,oneuser.name,'img/contractor_available.png');

													//	}
														

													}
										    
												});



	    }
  	});



	// $scope.loading = $ionicLoading.show({
 //      content: 'Getting current location...',
 //      showBackdrop: false
 //    });


	function addselfmarker()
	{


			
		navigator.geolocation.getCurrentPosition(function(pos) {
		console.log(pos);
			   
			$scope.longitude = pos.coords.longitude;
			$scope.latitude = pos.coords.latitude;

			$scope.map.refresh( pos.coords.latitude,pos.coords.longitude);
			addmarker(pos.coords.latitude,pos.coords.longitude,$rootScope.user._id,"Job Location",'img/self.png');


			var updateusergeodata = new Object();
			updateusergeodata.user_id = $rootScope.user._id;
			updateusergeodata.latitude = pos.coords.latitude;
			updateusergeodata.longitude  = pos.coords.longitude;

			customerService.user_update_geo(updateusergeodata).then(function(retdata){

				console.log("Updated users geo coordinates" + JSON.stringify(retdata));
			//	$ionicLoading.hide();
	    
			});

		},function(error) {
		    alert('Unable to get location: ' + error.message);
		});

	}

	


	function addmarker(latitude,longitude,user_id,title,icon){

			//console.log("Adding Marker:" + $scope.markers)
			$scope.markers.push({id:$scope.markercount,latitude:latitude ,longitude:longitude,user_id:user_id,title:title,options:{animation:1, title : title, labelContent : title, labelClass : "markerlabelfont" }, icon:icon,click:function(mapModel, eventName, originalEventArgs){

				console.log(mapModel.model.user_id);
		
				//$state.go('tab.contractor-details');
				if (mapModel.model.user_id != $rootScope.user._id){

					$state.go('tab.contractordetails', {user_id:mapModel.model.user_id});

				}
				// else {

				// 	alert("This is your current position");
				// }
				

			}});
			$scope.markercount++;
	}





  	uiGmapGoogleMapApi.then(function(maps) {

  			$scope.loading = $ionicLoading.show({
			       content: 'Loading Map',
			       template: 'Loading...',
			       showBackdrop: true
			 });



		  	var newstyle =[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
			
			$scope.map = {
					    center: {
					        latitude: -26.1057480,
					        longitude: 27.8945170
					    },
					    zoom: 15,
					    options : {styles : newstyle},
					    control:{},
					    refresh: function (lat,long) {
					    	console.log("Refreshing location on map");
					    	$scope.map.control.refresh({latitude:lat, longitude:long});
			            },
			            events : { 
			            			click: function (mapModel, eventName, originalEventArgs) {

			            						console.log(originalEventArgs);
 	                  				          	var e = originalEventArgs[0];
										        var latitude = e.latLng.lat(), longitude = e.latLng.lng();
													            			
			          

			            						var updateusergeodata = new Object();
												updateusergeodata.user_id = $rootScope.user._id;
												updateusergeodata.latitude = latitude
												updateusergeodata.longitude  = longitude;


												$scope.longitude = longitude;
												$scope.latitude = latitude;

												
												

												$scope.$apply(function () {
												//	$scope.map.refresh(latitude,longitude);
										           	$scope.markers[0].latitude = latitude;
													$scope.markers[0].longitude = longitude;
													console.log($scope.markers[0])
										        });


		

												customerService.user_update_geo(updateusergeodata).then(function(retdata){

													console.log("Updated users geo coordinates" + JSON.stringify(retdata));
										    
												});

	
											
												
			            				    			
               						}


			            }
				};
				
			

	}).then(function(){


	addselfmarker();
												
	$ionicLoading.hide();
	});



})

.controller('JobsCtrl', function($scope, $rootScope,$stateParams, customerService,$ionicPopup) {

	console.log("Loaded Jobs Controller")
  	customerService.find_job_by_requesting_user($rootScope.user._id).then(function(retdata){

  		$scope.jobs = retdata.data;
  		
  		console.log($scope.jobs);
	});	
 
})
.controller('JobsDetailsCtrl', function($scope, $rootScope,$stateParams, customerService,$ionicPopup) {

	console.log("Loaded Job Details Controller")


	customerService.job($stateParams.job_id).then(function(retdata){

  		$scope.job = retdata.data[0];
  		
  		console.log($scope.job);
	});	

	$scope.cancel = function() {

		var update_obj = {}
		update_obj.status = 'cancelled';
		$scope.job.status = 'cancelled';
		customerService.update_job($stateParams.job_id,update_obj).then(function(retdata){

	  	  	
			var alertPopup = $ionicPopup.alert({
				title: 'Contractor Job Cancelled',
				template: 'You cancelled the job!'
			});		

	  		console.log(retdata);
		});	
	    
	};

	$scope.contractor_arrived = function() {

		var update_obj = {}
		update_obj.status = 'contractor arrived';
		$scope.job.status = 'contractor arrived';
		customerService.update_job($stateParams.job_id,update_obj).then(function(retdata){

	  	  	
			var alertPopup = $ionicPopup.alert({
				title: 'Contractor Arrived',
				template: 'Thanks, you acknowledged that the contractor arrived'
			});		

	  		console.log(retdata);
		});	
	    
	};

	$scope.job_completed = function() {

		var update_obj = {}
		update_obj.status = 'completed';
		$scope.job.status = 'completed';
		customerService.update_job($stateParams.job_id,update_obj).then(function(retdata){

	  	  	
			var alertPopup = $ionicPopup.alert({
				title: 'Job Completed',
				template: 'Thanks, you acknowledged that the job was completed'
			});		

	  		console.log(retdata);
		});	
	    
	};


  	$scope.rate = 0;
	$scope.max = 5;
	$scope.isReadonly = false;

	$scope.hoveringOver = function(value) {
	    $scope.rate = value;
	    $scope.percent = 100 * (value / $scope.max);
	};



	$scope.rate_contractor = function() {
	 	
	 	alert($scope.rate);

	 	customerService.increase_rating_count($scope.job.requested_contractor._id).then(function(retdata){

	  	  		console.log("Updated contractor rating count:" + JSON.stringify(retdata));
		});	

	 	customerService.increase_rating_value($scope.job.requested_contractor._id,$scope.rate).then(function(retdata){

	  	  		console.log("Updated contractor rating value:" + JSON.stringify(retdata));
		});	

		var update_obj = {}
		update_obj.status = 'completed and rated';
		$scope.job.status = 'completed and rated';
		customerService.update_job($stateParams.job_id,update_obj).then(function(retdata){

	  	  	
			var alertPopup = $ionicPopup.alert({
				title: 'Job Completed and Rated',
				template: 'Thanks, you rated the contractor after the complted job.'
			});		

	  		console.log(retdata);
		});	





	};

  	
 
})

.controller('ContractorDetailsCtrl', function($scope, $rootScope,$stateParams, customerService,$ionicPopup,$filter,$state) {
	

	$scope.jobexists = "searching";

	customerService.find_job_by_contractor_and_user($rootScope.user._id,$stateParams.user_id).then(function(retdata){

  	console.log("All Jobs length" + retdata.data.length)
  	console.log(retdata.data)

  	var completed_jobs = _.filter(retdata.data, function(record){ return record.status  == 'completed' || record.status  == 'completed and rated' || record.status  == 'cancelled'; });
  	console.log("completed jobs" + completed_jobs.length)

	  	if(retdata.data.length > 0){

	  		console.log("Jobs exist");

	  		if (completed_jobs.length == retdata.data.length){

	  			$scope.jobexists = false;

	  		}
	  		else $scope.jobexists = true;

	  	}

	  	else $scope.jobexists = false;

	});	


	$scope.mytime = new Date();
  	$scope.hstep = 1;
  	$scope.mstep = 15;
  	$scope.ismeridian = true;

  	$scope.data = { date :  $filter("date")(Date.now(), 'yyyy-MM-dd'), time : "" };

  	$scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  	};




	$scope.hoveringOver = function(value) {
	    $scope.overStar = value;
	    $scope.percent = 100 * (value / $scope.max);
	};


		$scope.rate = 0;
		$scope.max = 5;
		$scope.isReadonly = true;
	


  	console.log("Loaded Contractor Details Controller")
  	customerService.user($stateParams.user_id).then(function(retdata){

  		$scope.contractor = retdata.data;
  		console.log($scope.contractor);


	  	$scope.rate = $scope.contractor.rating/$scope.contractor.rating_count;


	});	

	$scope.thumbsup = function() {

		customerService.increase_likes($stateParams.user_id).then(function(retdata){

  			$scope.contractor.likes++;
  			console.log(retdata);

		});	
	};
		


	$scope.bookcontractor = function() {

		var mydate = $scope.data.date;
		var mytime = $scope.data.time;

		if (mydate == "" || mytime == "" ){


			var alertPopup = $ionicPopup.alert({
				title: 'Incorrect time or date',
				template: 'The date or time you have chosen appears to be invalid'
			});

			return;

		}

		
	    var job = new Object();
	    job.requesting_user = $rootScope.user._id;
	    job.requested_contractor = $stateParams.user_id;
	    job.status = 'pending';
	    job.time = mytime;
	    job.date = mydate;

	    customerService.create_job(job).then(function(retdata){

  		console.log(retdata);

  					

   														var alertPopup = $ionicPopup.alert({
	     													title: 'Contractor Booking Request',
	     													template: 'Thanks, your contractor booking request has been forwarded'
   														});

	   													alertPopup.then(function(res) {
	   														$state.go('tab.dash');
	     													console.log('Thank you for not eating my delicious ice cream cone');
	   													});
 												



		});	
	   

	};										
})

.controller('AccountCtrl', function($scope) {


});
