  
  var host = 'https://stark-dusk-4951.herokuapp.com';
  //var host = 'http://localhost:8080';
  angular.module('starter.services',[])



  
  .factory('userService', function($http) {
  
  
                 return {
                   
                     login: function(formdata) {
                        
                        var promise = $http.post(host+'/softlogin',formdata).
                        success(function(data, status, headers, config) {
                           return(data); 
                        }).
                        error(function(err, status, headers, config) {
                           return(err);
                        });
                       
                        return promise;
                     },
                     register: function(formdata) {

                        var promise = $http.post(host+'/softregister',formdata).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     user_info: function(formdata) {
                        
                        var promise = $http.get(host+'/user').
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     
                     
                   
                   
                 }
  })
  .factory('contractorService', function($http) {
  
  
                 return {
                   
                     users: function() {
                        
                        var promise = $http.get(host+'/users').
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     user: function(user_id) {
                        
                        var promise = $http.get(host+'/users/'+user_id).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     increase_likes: function(user_id) {
                        
                        var promise = $http.get(host+'/likes/increase/'+user_id).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     increase_rating_count: function(user_id) {
                        
                        var promise = $http.get(host+'/ratingcount/increase/'+user_id).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     increase_rating_value: function(user_id,value) {
                        
                        var promise = $http.get(host+'/rating/increase/'+user_id+"/"+value).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     update_available: function(user_id,value) {
                        
                        var promise = $http.get(host+'/available/'+user_id+"/"+value).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     user_update_geo: function(formdata) {
                        
                        var promise = $http.post(host+'/updateusersgeo',formdata).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     get_near_users: function(formdata) {
                        
                        var promise = $http.post(host+'/nearusers',formdata).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },

                     create_job: function(formdata) {
                        
                        var promise = $http.post(host+'/job',formdata).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },


                     find_job_by_requesting_user: function(user_id) {
                        
                        var promise = $http.get(host+'/job/requesting_user/'+ user_id).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },

                      find_job_by_requested_contractor: function(user_id) {
                        
                        var promise = $http.get(host+'/job/requested_contractor/'+ user_id).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },
                     find_job_by_contractor_and_user: function(user_id,contractor_id) {
                        
                        var promise = $http.get(host+'/job/'+ user_id + '/' + contractor_id).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },

                      job: function(job_id) {
                        
                        var promise = $http.get(host+'/job/'+ job_id).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     },

                     update_job: function(job_id,formdata) {
                        
                        var promise = $http.post(host+'/job/update/'+ job_id,formdata).
                        success(function(data, status, headers, config) {
                          return(data); 
                        }).
                        error(function(err, status, headers, config) {
                          return(err);
                        });
                       
                        return promise;
                     }



                     
         
                     
                   
                   
                 }
  });

  