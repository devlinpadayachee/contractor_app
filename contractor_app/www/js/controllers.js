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

$scope.user = {}
$scope.user.category = 'plumber';

  
$scope.register = function(user) {

	user.type = "contractor";
	user.rating = 0;
	user.rating_count = 0;
	user.likes = 0;
	


	console.log('Register', user);

    userService.register(user).then(function(retdata){

			console.log(retdata)
    		$state.go('signin');

	});
    
		
  
 };
  
})

.controller('DashCtrl', function($scope,$rootScope,$ionicLoading,$state,$compile,uiGmapGoogleMapApi,$ionicPopover,$ionicPopup,contractorService) {


	navigator.geolocation.getCurrentPosition(function(pos) {
	console.log(pos);
		   
		$scope.longitude = pos.coords.longitude;
		$scope.latitude = pos.coords.latitude;


		var updateusergeodata = new Object();
		updateusergeodata.user_id = $rootScope.user._id;
		updateusergeodata.latitude = pos.coords.latitude;
		updateusergeodata.longitude  = pos.coords.longitude;

		contractorService.user_update_geo(updateusergeodata).then(function(retdata){

			console.log("Updated users geo coordinates" + JSON.stringify(retdata));
		//	$ionicLoading.hide();
    
		});

	},function(error) {
	    alert('Unable to get location: ' + error.message);
	});

	contractorService.find_job_by_requested_contractor($rootScope.user._id).then(function(retdata){

  		$scope.jobs = retdata.data;
  		
  		console.log($scope.jobs);
	});	



})

.controller('JobsDetailsCtrl', function($scope, $rootScope,$stateParams, contractorService,$ionicPopup) {

	console.log("Loaded Job Details Controller")


	contractorService.job($stateParams.job_id).then(function(retdata){

  		$scope.job = retdata.data[0];
  		
  		console.log($scope.job);
	});	


	$scope.cancel = function() {

		var update_obj = {}
		update_obj.status = 'cancelled';
		$scope.job.status = 'cancelled';
		contractorService.update_job($stateParams.job_id,update_obj).then(function(retdata){

	  	  	
			var alertPopup = $ionicPopup.alert({
				title: 'Contractor Job Cancelled',
				template: 'You cancelled the job!'
			});		

	  		console.log(retdata);
		});	
	    
	};

	$scope.acceptjob = function() {

		var update_obj = {}
		update_obj.status = 'accepted';
		$scope.job.status = 'accepted';
		contractorService.update_job($stateParams.job_id,update_obj).then(function(retdata){

	  	  	
			var alertPopup = $ionicPopup.alert({
				title: 'Job Accepted',
				template: 'Thanks, you accepted the job'
			});		

	  		console.log(retdata);
		});	
	    
	};


	$scope.declinejob = function() {

		var update_obj = {}
		update_obj.status = 'declined';
		$scope.job.status = 'declined';
		contractorService.update_job($stateParams.job_id,update_obj).then(function(retdata){

	  	  	
			var alertPopup = $ionicPopup.alert({
				title: 'Job Declined',
				template: 'Thanks, you declined the job'
			});		

	  		console.log(retdata);
		});	
	    
	};
  	
  	
 
})



.controller('AccountCtrl', function($scope,$rootScope,$ionicPopup,contractorService) {

	

  $scope.pushNotificationChange = function() {
    console.log('Push Notification Change', $scope.pushNotification.checked);

    	contractorService.update_available($rootScope.user._id,$scope.pushNotification.checked).then(function(retdata){

	  		console.log(retdata);
		});	

  };
  
  $scope.pushNotification = { checked: $rootScope.user.available };



});
