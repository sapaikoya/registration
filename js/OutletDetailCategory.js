starter_controllers
    .controller('OutletDetailCategoryCtrl', function($scope, $stateParams, Finder, NavBar, $rootScope, ErrorService, $location) {
        $rootScope.categories = Finder.get($rootScope.Outlets, $stateParams);
        $scope.category       = Finder.get($rootScope.Outlets,{'outletId':$stateParams.outletId,'categoryId':$stateParams.categoryId});
        $scope.outletId       = $stateParams.outletId;
        $scope.outlet         = Finder.get($rootScope.Outlets, {'outletId':$stateParams.outletId});
           console.log('eee')
        //-------------- validate -------------------------------
        function validate() {
            var categoryPhotos = _.filter($scope.category.photos, function(photo){
                return !!photo.src;
            });

            if(categoryPhotos.length > 0) {
                ErrorService.remove($stateParams.outletId, $scope.category.id, 'photoscat');
                $scope.category.error = 0;
            }

            $rootScope.$broadcast('onErrorCount');
        }


        function watchField(newValue, oldValue){
            if(!_.isEqual(newValue, oldValue)){
                $scope.category.modified = 1;
                var TT = _.find($rootScope.Outlets,function(el){ return el.id == $stateParams.outletId});
                TT.modified = 1;
                validate();
            }
        }

        $scope.$watch('category.photos', function(newValue, oldValue) {
            watchField(newValue, oldValue)
        },true);

        NavBar.backUrlState = ($(window).width() < 770)?'tab.outlet-detail':'tab.outlets';
        //NavBar.backUrlState = 'tab.outlet-detail';
        $rootScope.$emit('NavBarBack',{v:true});
    })
