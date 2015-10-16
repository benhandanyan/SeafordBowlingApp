// script.js
    // create the module and name it scotchApp
    var bapp = angular.module('bowling', ['ui.router']);

  // configure our routes
	bapp.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('form', {
					url: '/ballform',
					templateUrl: "/ballform.html",
					controller: "inputController",
					onEnter: ['$state', 'auth', function($state, auth){
					    if(!auth.isLoggedIn()){
					      $state.go('login');
					    }
  					}]
				})
				.state('login', {
					url: '/login',
					templateUrl: "/login.html",
					controller: "AuthCtrl",
					onEnter: ['$state', 'auth', function($state, auth){
					    if(auth.isLoggedIn()){
					      $state.go('form');
					    }
  					}]
				})
				.state('search', {
					url: '/search',
					templateUrl: "/searchresults.html",
					controller: "searchCtrl",
					onEnter: ['$state', 'auth', function($state, auth){
					    if(!auth.isLoggedIn()){
					      $state.go('login');
					    }
  					}],
					resolve : {
						postPromise: ["factory", function(factory){
							return factory.fetchAll();
						}]
					}
				})
				.state('ball', {
					url: '/info/{id}',
					templateUrl: '/ball.html',
					controller: "queryController",
					resolve: {
						post: ['$stateParams', 'factory', function($stateParams, factory) {
							return factory.fetchOne($stateParams.id);
						}]
					},
					onEnter: ['$state', 'auth', function($state, auth){
					    if(!auth.isLoggedIn()){
					      $state.go('login');
					    }
  					}]
				})
				$urlRouterProvider.otherwise('login');
		}
		
	]);
	
bapp.service('searchService', function(){
	var name = '';
	return {
		getText: function() {
			return name;
		},
		setText: function(value) {
			name = value;
		}
	}
});

bapp.factory('factory', ["$http", function($http){

  var object = {
    factory : [],
    fetchHolder: [],
    //Now we call the API as it was laid out in the server file.

    createInfo : function(newInfo) {
        return $http.post('/info', newInfo).success(function(data){
            object.factory.push(data);
        });
    },

    fetchOne : function(id) {
        return $http.get("/info/"+id).success(function(data){  angular.copy(data, object.fetchHolder); });
    },

    fetchAll : function() {
    	return $http.get("/info").success(function(data){
    		angular.copy(data, object.factory);
    	});
    } 
    
    
  };

  return object;

}]);

bapp.factory('auth', ['$http', '$window', '$state', function($http, $window, $state){
   var auth = {
  saveToken : function (token){
  $window.localStorage['bowling-token'] = token;
},

getToken : function (){
  return $window.localStorage['bowling-token'];
},
isLoggedIn : function(){
  var token = auth.getToken();
  if(token){
    var payload = JSON.parse($window.atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
},
currentUser : function(){
  if(auth.isLoggedIn()){
    var token = auth.getToken();
    var payload = JSON.parse($window.atob(token.split('.')[1]));

    return payload.username;
  }
},
logIn : function(user){
  return $http.post('/login', user).success(function(data){
    auth.saveToken(data.token);
  });
},
logOut : function(){
  $window.localStorage.removeItem('bowling-token');
  $state.go("login");
}
};
  return auth;
}])

bapp.controller(
	"inputController",
	["$scope", '$state', "factory", "searchService", "auth", function($scope, $state, factory, searchService, auth){
		$scope.logOut = auth.logOut;
		$scope.isLoggedIn = auth.isLoggedIn;
  		$scope.currentUser = auth.currentUser;
		$scope.search = function() {
			searchService.setText($scope.searchtext);
			$state.go('search');
		}
		$scope.submit = function(){
			if($scope.name && $scope.name != "" && $scope.date && $scope.date != "" && $scope.address && $scope.address != "" && $scope.city && $scope.city != "" 
			&& $scope.state && $scope.state != "" && $scope.zip && $scope.zip != "" && $scope.phone && $scope.phone != "" && $scope.cell && $scope.cell != "" 
			&& $scope.email && $scope.email != "" && $scope.hand && $scope.hand != "" && $scope.conv && $scope.conv != "" && $scope.ft && $scope.ft != "" && $scope.ball && $scope.ball != ""
			&& $scope.wgt && $scope.wgt != "" && $scope.pin && $scope.pin != "" && $scope.layout && $scope.layout != "" && $scope.surface && $scope.surface != "" 
			&& $scope.bhposition && $scope.bhposition != "" && $scope.size && $scope.size != "" && $scope.depth && $scope.depth != "" && $scope.paph && $scope.paph != "" && $scope.papud && $scope.papud != "" 
			&& $scope.papclt && $scope.papclt != "" && $scope.thumb && $scope.thumb != "" && $scope.fingers && $scope.fingers != "" && $scope.price && $scope.price != "" 
			&& $scope.completed && $scope.completed != ""){
				if($scope.a1 && $scope.a1 != "" && $scope.a2 && $scope.a2 != "" && $scope.a3 && $scope.a3 != "" && $scope.a4 && $scope.a4 != "" && $scope.a5 && $scope.a5 != "" && $scope.a6 && $scope.a6 != "" ){
					if($scope.f1 && $scope.f1 != "" && $scope.f2 && $scope.f2 != "" && $scope.f3 && $scope.f3 != "" && $scope.f4 && $scope.f4 != "" && $scope.f5 && $scope.f5 != "" && $scope.f6 && $scope.f6 != "" && $scope.f7 && $scope.f7 != "" && $scope.f8 && $scope.f8 != "" && $scope.f9 && $scope.f9 != "" ){
						if($scope.d1 && $scope.d1 != "" && $scope.d2 && $scope.d2 != "" && $scope.ft1 && $scope.ft1 != "" && $scope.ft2 && $scope.ft2 != "" && $scope.ft3 && $scope.ft3 != ""){
							factory.createInfo({
								Name: $scope.name,
								DateCreated : $scope.date,
								Address : $scope.address,
								City : $scope.city,
								State : $scope.state,
								Zip : $scope.zip,
								Phone : $scope.phone,
								Cell : $scope.cell,
								Email : $scope.email,
								Hand : $scope.hand,
								Conv : $scope.conv,
								FT : $scope.ft,
								Ball : $scope.ball,
								Weight: $scope.wgt,
								Pin : $scope.pin,
								Layout : $scope.layout,
								Surface : $scope.surface,
								BHPosition : $scope.bhposition,
								Size : $scope.size,
								Depth : $scope.depth,
								Paph : $scope.paph,
								Papud : $scope.papud,
								Papclt : $scope.papclt,
								Thumb : $scope.thumb,
								Fingers : $scope.fingers,
								Price: $scope.price,
								CompletedBy: $scope.completed,
								Notes: $scope.notes,
								A1: $scope.a1,
								A2: $scope.a2,
								A3: $scope.a3,
								A4: $scope.a4,
								A5: $scope.a5,
								A6: $scope.a6,
								CTC1: $scope.ctc1,
								FS1: $scope.fs1,
								CTC2: $scope.ctc2,
								FS2: $scope.fs2,
								F1: $scope.f1,
								F2: $scope.f2,
								F3: $scope.f3,
								F4: $scope.f4,
								F5: $scope.f5,
								F6: $scope.f6,
								F7: $scope.f7,
								F8: $scope.f8,
								F9: $scope.f9,
								D1: $scope.d1,
								D2: $scope.d2,
								FT1: $scope.ft1,
								FT2: $scope.ft2,
								FT3: $scope.ft3
							});
							alert("Form successfully completed!");
							$state.go('search');
												
						}
						else{
							alert("Please complete form");
						}
					}
					else{
						alert("Please complete form");
					}
				}
				else{
					alert("Please complete form");
				}	
			}
			else{
				alert("Please complete form");
			}
		}
	}
	]);
	
bapp.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('form');
    });
  };
}])


bapp.controller('searchCtrl', [
'$scope',
'factory',
'auth',
'searchService',
'$state',
function($scope, factory, auth, searchService, $state){
	$scope.records = factory.factory;
	if(searchService.getText() != '' && searchService.getText() != null){
			$scope.name = searchService.getText().toLowerCase();

	}
	else
		$scope.name = searchService.getText();

	$scope.nameFilter = function(item) {
		var regex = new RegExp($scope.name + ".*");
		if($scope.name != '' && $scope.name) {
			return regex.test(item.Name.toLowerCase());
		} else {
			return true;
		}
	}
	$scope.search = function() {
		searchService.setText($scope.searchtext);
		$state.go($state.current, {}, {reload: true}); 
	}
}])

bapp.controller('queryController', [
'$scope',
'factory',
'searchService',
'$state',
function($scope, factory, searchService, $state){
	$scope.search = function() {
			searchService.setText($scope.searchtext);
			$state.go('search');
		}
	$scope.name = factory.fetchHolder[0].Name;
	$scope.date = factory.fetchHolder[0].DateCreated;
	$scope.address = factory.fetchHolder[0].Address;
	$scope.city = factory.fetchHolder[0].City;
	$scope.state = factory.fetchHolder[0].State;
	$scope.zip = factory.fetchHolder[0].Zip;
	$scope.phone = factory.fetchHolder[0].Phone;
	$scope.cell = factory.fetchHolder[0].Cell;
	$scope.email = factory.fetchHolder[0].Email;
	$scope.hand = factory.fetchHolder[0].Hand;
	$scope.conv = factory.fetchHolder[0].Conv;
	$scope.ft = factory.fetchHolder[0].FT;
	$scope.ball = factory.fetchHolder[0].Ball;
	$scope.wgt = factory.fetchHolder[0].Weight;
	$scope.pin = factory.fetchHolder[0].Pin;
	$scope.layout = factory.fetchHolder[0].Layout;
	$scope.surface = factory.fetchHolder[0].Surface;
	$scope.bhposition = factory.fetchHolder[0].BHPosition;
	$scope.size = factory.fetchHolder[0].Size;
	$scope.depth = factory.fetchHolder[0].Depth;
	$scope.paph = factory.fetchHolder[0].Paph;						
	$scope.papud = factory.fetchHolder[0].Papud;
	$scope.papclt = factory.fetchHolder[0].Papclt;
	$scope.thumb = factory.fetchHolder[0].Thumb;
	$scope.fingers = factory.fetchHolder[0].Fingers;
	$scope.price = factory.fetchHolder[0].Price;
	$scope.completed = factory.fetchHolder[0].CompletedBy;
	$scope.notes = factory.fetchHolder[0].Notes;
	$scope.a1 = factory.fetchHolder[0].A1;
	$scope.a2 = factory.fetchHolder[0].A2;
	$scope.a3 = factory.fetchHolder[0].A3;
	$scope.a4 = factory.fetchHolder[0].A4;
	$scope.a5 = factory.fetchHolder[0].A5;
	$scope.a6 = factory.fetchHolder[0].A6;
	$scope.checkboxModel = {
       value1 : false,
       value2 : false,
       value3 : false,
       value4 : false
     };
	$scope.checkboxModel.value1 = factory.fetchHolder[0].CTC1;
	$scope.checkboxModel.value2 = factory.fetchHolder[0].FS1;
	$scope.checkboxModel.value3= factory.fetchHolder[0].CTC2;
	$scope.checkboxModel.value4= factory.fetchHolder[0].FS2;
	$scope.f1 = factory.fetchHolder[0].F1;
	$scope.f2 = factory.fetchHolder[0].F2;
	$scope.f3 = factory.fetchHolder[0].F3;
	$scope.f4 = factory.fetchHolder[0].F4;
	$scope.f5 = factory.fetchHolder[0].F5;
	$scope.f6 = factory.fetchHolder[0].F6;
	$scope.f7 = factory.fetchHolder[0].F7;
	$scope.f8 = factory.fetchHolder[0].F8;
	$scope.f9 = factory.fetchHolder[0].F9;

	$scope.d1 = factory.fetchHolder[0].D1;
	$scope.d2 = factory.fetchHolder[0].D2;
	$scope.ft1 = factory.fetchHolder[0].FT1;
	$scope.ft2 = factory.fetchHolder[0].FT2;
	$scope.ft3 = factory.fetchHolder[0].FT3;
}
])

    
    
