angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$cookieStore', '$cookies', '$location', '$http', '$window', 'socket', 'game', 'AvatarService', function ($scope, Global, $cookieStore, $cookies, $location, $http, $window, socket, game, AvatarService) {

    $scope.scrollTo = function (id) {
      // Scroll
    $('html,body').animate({
        scrollTop: $(`#${id}`).offset().top}, 'slow');
    }

    $scope.seekConsent = () => {
      return swal({
        title: "Can we show your identity as a donor?",
        input: "select",
        inputOptions: ["Yes", "No"],
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (parseInt(value, 10) > -1) {
              resolve()
            } else {
              reject('Please give your consent')
            }
          })
        },
        showCancelButton: true,
        confirmButtonColor: '#009688',
        cancelButtonColor: '#D0021B',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Proceed to Donate'
      })
        .then((consentResponse) => {
          if (consentResponse === '0') {
            $window.localStorage.setItem('donorConsent', true);
          }
          $window.open("https://www.crowdrise.com/donate/project/cfhio/cards4humanity?widget=true&redirect_to=http%3A%2F%2Fmatterhorn-cfh-staging.herokuapp.com%2F%23!%2F&stylesheet=&amounts=", "_self");
        })
        .catch(() => { })
    }
    $scope.checkAuth = () => {
      if ($cookies.token) {
        $window.localStorage.setItem('token', $cookies.token);
      }
    };

    $scope.checkAuth();

    $scope.global = Global;
    $scope.formData = {};

    $scope.playAsGuest = () => {
      game.joinGame();
      $location.path('/app');
    }

    $scope.goHome = () => {
      $location.path('/');
    }

    $scope.showError = () => {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    }
    $scope.signIn = () => {
      $http.post('api/auth/login', JSON.stringify($scope.formData))
        .success((data) => {
          if (data.success === true) {
            $window.localStorage.setItem('userId', data.id);
            $window.localStorage.setItem('token', data.token);
            $window.location.href = '/';
          } else {
            $scope.showMessage = data.message;
          }
        })
        .error(() => {
          $scope.showMessage = "Oops! Invalid email and/or password";
        });
    }


    $scope.signOut = () => {
      $http.get('/logout')
        .success(() => {
          $window.location.href = '/';
        })
      angular.forEach($cookies, function (v, k) {
        $cookieStore.remove(k);
      });
      $window.localStorage.removeItem("token");
      $window.location.href = '/';
    }

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });
  }]);
