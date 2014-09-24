angular.module('starter.controllers', [])

    .controller('NavBarCtrl', function($scope, $state, $location, $rootScope ) {
        $rootScope.$on("$locationChangeStart", function(){
            $scope.noLogin = $location.$$url == '/login' ? 0 : 1;
        })
        $scope.goBack = function(){
            $state.go('user');
        }
        $rootScope.Users = [
            {id:0,name:'Natali Surname', mail:'sdfgh@dfghj.ru', password:'0987654'},
            {id:1,name:'Natali2 Surname', mail:'root@yandex.ru', password:'0strchg'},
            {id:2,name:'Natali3 Surname', mail:'zoom@mail.ru', password:'0dghn4'}
        ]
    })

    .controller('AuthorizeCtrl', function($scope, $state, $rootScope ) {
        $scope.nuser = {};
        $scope.showerror = 0;
        $scope.addUser = function(){
            $scope.nuser.id = $rootScope.Users.length;
            $rootScope.Users.push($scope.nuser);
            $state.go('user');
        }
    })

    .controller('UserCtrl', function($scope, $state, $rootScope ) {

    })

    .controller('UserEditCtrl', function($scope, $stateParams, $state, $rootScope ) {
        $scope.user = _.find($rootScope.Users,function(el){return el.id == $stateParams.userId})
        $scope.save = function(){
            $state.go('user');
        }
    })
;

