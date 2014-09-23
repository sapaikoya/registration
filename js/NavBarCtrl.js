starter_controllers

    .controller('NavBarCtrl', function($scope, $state, $stateParams, NavBar, $rootScope, GetData, PhotoStorage, ErrorService ) {


        if(!(localStorage.getItem('User') === null)) {

            $rootScope.User     = JSON.parse(localStorage.getItem('User'));
            $rootScope.Outlets  = JSON.parse(localStorage.getItem('Outlets'));
            $rootScope.Messages = JSON.parse(localStorage.getItem('Messages'));

            $rootScope.error = [];
            $rootScope.$broadcast('sinchronShow')
            $rootScope.$broadcast('onOutlets')

        }else{
            $state.go('login')
        }


        $rootScope.$on('NavBarBack',function(p,o){
            $scope.back = o.v;
        });

        $scope.goBack = function() {
            console.log(NavBar.backUrlState)
            console.log($stateParams)
            $state.go(NavBar.backUrlState, $stateParams)
        }

        $rootScope.$on('onErrorCount',function(){
            $scope.countError = ErrorService.count();
        })

        $scope.goErrorList = function() {
            $state.go('syncerror');
            GetData.post(SYNC_SERVER +  '/agent/reports/address',{token: $rootScope.User.token, data: JSON.stringify($rootScope.Outlets)});
        }


        //$scope.sinchronShow = 1;
        $scope.$on('sinchronShow',function(){
            $scope.sinchronShow = 1;
        })
        $scope.$on('sinchronHide',function(){
            $scope.sinchronShow = 0;
        })

        $rootScope.sinchronizing = 0;//icon style 'ion-loop';

        $scope.synchronize = function(){
            synchronizeData();
            GetData.post(SYNC_SERVER +  '/agent/reports/address', {token: $rootScope.User.token, data: JSON.stringify($rootScope.Outlets)});

        }

        $scope.$on('onSync',function(){
            synchronizeData();
        });

        function synchronizeData(){
            $rootScope.sinchronizing = 1;  //icon style 'ion-looping';
            PhotoStorage.synchronize();

            var modifiedOutlets = _.filter($rootScope.Outlets,function(el){ return el.modified == 1});
            _.each(modifiedOutlets,function(modEl){
                modEl.categories = _.filter(modEl.categories,function(el){ return el.modified == 1});

                _.each(modEl.categories,function(modItem){
                    modItem.items = _.filter(modItem.items,function(el){ return el.modified == 1})
                })
            })

            GetData.post(SYNC_SERVER + '/agent/reports/synchronize',{token: $rootScope.User.token, data: JSON.stringify(modifiedOutlets), messages:JSON.stringify($rootScope.Messages), user: JSON.stringify($rootScope.User)})
                .then(function(data){
                    if(data == 'ok'){
                        GetData.post(SYNC_SERVER + '/agent/reports/roadmap',{token: $rootScope.User.token})
                            .then(function(data){
                                if(angular.isDefined(data[0].id)){
                                    $rootScope.Outlets = data;
                                    localStorage.setItem('Outlets',JSON.stringify(data));
                                    $rootScope.$broadcast('onOutlets');
                                    $rootScope.sinchronizing = 0;
                                    $state.go('tab.outlets')
                                }
                            });
                        GetData.get(SYNC_SERVER +  '/agent/messages',{token: $rootScope.User.token})
                            .then(function(data){
                                $rootScope.Messages = data;
                                localStorage.setItem('Messages',JSON.stringify(data));
                                $rootScope.$broadcast('onMessages');

                            });
                        GetData.get(SYNC_SERVER + '/agent/sessions/user',{token: $rootScope.User.token})
                            .then(function(data){
                                $rootScope.User = data.user;
                                localStorage.setItem('User',JSON.stringify(data.user));
                                $rootScope.$broadcast('onUser');
                            });

                    } else {
                        //console.log('hh')
                      //  NavBar.message = "Can't connect to server";
                    }
                },
                function(){
                    $rootScope.sinchronizing = 0;
                    $rootScope.messageConnect = "Нет подключения к Интернету";
                }
            )


        }
    });