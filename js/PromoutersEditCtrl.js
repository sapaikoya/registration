starter_controllers

    .controller('PromoutersEditCtrl', function($scope,  $state, $stateParams, NavBar, $rootScope, Finder, ErrorService, $location){
        $scope.promoterId = $stateParams.promoterId;

        $scope.category = Finder.get($rootScope.Outlets,{'outletId':$stateParams.outletId, 'categoryId': $stateParams.categoryId});
        $scope.promoter = Finder.get($rootScope.Outlets,$stateParams)

        NavBar.backUrlState = 'goodtab.promouters';
        $rootScope.$emit('NavBarBack',{v:true});

        //-------------- validate -------------------------------
        function validate(){

            if ($scope.promoter.count > 0 && $scope.promoter.photos[0].src == '') {
                ErrorService.add({
                    marker:'photo',
                    outletId:$stateParams.outletId,
                    id:$scope.promoter.id,
                    url:$location.$$url,
                    nameItem: $scope.category.title +' - '+ $scope.promoter.product_name ,
                    name:'Нет фотографии промо-зон'
                });
            }else{
                ErrorService.remove($stateParams.outletId,$scope.promoter.id,'photo');
            }
            $rootScope.$broadcast('onErrorCount');
        }


        function watchField(newValue, oldValue){
            if(!_.isEqual(newValue, oldValue)){
                //   $scope.item.modified = 1;
                var TT = _.find($rootScope.Outlets,function(el){ return el.id == $stateParams.outletId});
                TT.modified = 1;
                _.find(TT.categories,function(el){ return el.id == $stateParams.categoryId}).modified = 1;
                validate();
            }
        }

        $scope.$watch('promoter', function(newValue, oldValue) {
            watchField(newValue, oldValue)
        },true);
    /*    $scope.$watch('photos', function(newValue, oldValue) {
            console.log('watch photos')
            watchField(newValue, oldValue)
        },true);*/
        //--------------end validate -------------------------------


        /*
         $scope.addPromoter = function(){

         if(angular.isDefined($scope.promoter.brand_current.id)) {
         $scope.promoter.brand_id = $scope.promoter.brand_current.id;

         $scope.category.promoters.push($scope.promoter);
         $state.go(NavBar.backUrlState)
         }
         }   */
    });

