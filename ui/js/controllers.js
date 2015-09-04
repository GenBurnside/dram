var app = angular.module('dramControllers', []);

app.controller('HomeController', ['$rootScope',
  function($rootScope) {

  }]);

app.controller('NavController', ['$rootScope', '$location',
  function($rootScope, $location) {
    if ($rootScope.user == null) {
      $rootScope.home = "#/";
    }
  }]);

app.controller('RegisterController', ['$rootScope', '$scope', '$location', 'authService',
  function($rootScope, $scope, $location, authService) {
    $scope.create = function(user) {
      authService.register(user).
        success(function(response, status, headers) {
          var user = getUser(response, headers);
          $rootScope.user = user;
          $rootScope.authenticated = true;
          $rootScope.home = "#/welcome";
          $location.path('/welcome');
        }).
        error(function(response) {
          console.log(response);

          $scope.errors = {};

          if (response.errors.email) {
            $scope.errors.password = "This e-mail address has already been registerd"
          }

          if (response.errors.password) {
            $scope.errors.password = "Passwords must be at least 8 characters"
          }

          if (response.errors.password_confirmation) {
            $scope.errors.passwordMatch = "Passwords do not match"
          }
        });
    };
  }]);

app.controller('LoginController', ['$rootScope', '$scope', '$location', 'authService',
  function($rootScope, $scope, $location, authService) {
    $scope.signIn = function(credentials) {
      authService.signIn(credentials).
        success(function(response, status, headers) {
          var user = getUser(response, headers);
          $rootScope.user = user;
          $rootScope.authenticated = true;
          $rootScope.home = "#/welcome";
          $location.path('/welcome');
        }).
        error(function(response) {
          console.log(response);

          if (response.errors && response.errors.length > 0) {
            $scope.error = response.errors[0];
          }
        });
    };
  }]);

app.controller('BrandsController', ['$rootScope', '$scope', 'brandService',
  function($rootScope, $scope, brandService) {
    brandService.getList().
      success(function(data) {
        $scope.brands = data;
      }).
      error(function(error) {
        console.log(error);
      });
  }]);

app.controller('BrandDetailController', ['$rootScope', '$scope', '$routeParams', 'brandService', 'variantService',
  function($rootScope, $scope, $routeParams, brandService, variantService) {
    brandService.get($routeParams.id).
      success(function(data) {
        $scope.brand = data;
      }).
      error(function(error) {
        console.log(error);
      });

    variantService.getList($routeParams.id).
      success(function(data) {
        $scope.variants = data;
      }).
      error(function(error) {
        console.log(error);
      });
  }]);

app.controller('WelcomeController', ['$rootScope', '$scope', '$location', 'userService', 'bottleService',
  function($rootScope, $scope, $location, userService, bottleService) {
    if ($rootScope.user == null) {
      $location.path('/');
    }

    userService.getActivity($scope.dateRange).
      success(function(data) {
        $scope.activity = data;
      }).
      error(function(error) {
        console.log(error);
      });

    userService.getActivity($scope.dateRange).
      success(function(data) {
        var fa = data;
        var last = data.length - 1;
        fa.splice(last, 1);
        var today = new Date().toISOString();

        fa.push({ date: today, description: 'placeholder for now... copying user activity' });
        $scope.friendActivity = fa;
        console.log($scope.friendActivity);
      }).
      error(function(error) {
        console.log(error);
      });

    bottleService.getList().
      success(function(data) {
        $scope.bottles = data;
      }).
      error(function(error) {
        console.log(error);
      });

    $scope.activityLink = function(data) {
      switch (data.activity_type) {
        case "bottle":
          return "#/bottles/" + data.detail_id;
        case "taste":
          return "#/tastes/" + data.detail_id;
        default:
          return "#/welcome";
      }
    };
  }]);

app.controller('TastesController', ['$rootScope', '$scope', 'tasteService',
  function($rootScope, $scope, tasteService) {
    tasteService.getList().
      success(function(data) {
        $scope.tastes = data;
      }).
      error(function(error) {
        console.log(error);
      });
  }]);

app.controller('BottleDetailController', ['$rootScope', '$scope', '$location', '$routeParams', 'bottleService',
  function($rootScope, $scope, $location, $routeParams, bottleService) {
    //if ($rootScope.user == null) {
    //  $location.path('/');
    //}

    bottleService.get($routeParams.id).
      success(function(data) {
        $scope.bottle = data;
      }).
      error(function(error) {
        console.log(error);
      });
  }]);

function getUser(response, headers) {
  var user = {
    //properties for UI
    username: response.data.username,
    name: response.data.name,
    email: response.data.email,

    //properties for auth requests
    accessToken: headers("access-token"),
    client: headers("client"),
    expiry: headers("expiry"),
    tokenType: headers("token-Type"),
    uid: headers("uid")
  }

  return user;
}
