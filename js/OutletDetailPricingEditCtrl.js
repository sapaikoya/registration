starter_controllers

    .controller('OutletDetailPricingEditCtrl', function($scope, $state, $stateParams, Finder, NavBar, $rootScope, ErrorService, $location) {

        $scope.item      = Finder.get($rootScope.Outlets,$stateParams);
        $scope.category  = Finder.get($rootScope.Outlets,{'outletId':$stateParams.outletId,'categoryId':$stateParams.categoryId});
        $scope.deviation = $scope.category.deviation;

        function needPhoto() {
            if(!$scope.item.price || $scope.item.price == 0) {
                return false;
            }

            // validate field price
            var max_price = $scope.item.adv_price + $scope.item.adv_price * $scope.deviation / 100;
            var min_price = $scope.item.adv_price - $scope.item.adv_price * $scope.deviation / 100;

            return ($scope.item.price > max_price || $scope.item.price < min_price);

        }
        
         //-------------- validate -------------------------------
        function validate(){

            $scope.item.needPhoto = needPhoto();

            if ($scope.item.needPhoto && !$scope.item.photos[0].src.length){
                ErrorService.add({
                    marker:'photos',
                    outletId:$stateParams.outletId,
                    parentId:$scope.item.id,
                    id: $scope.item.id,
                    url:$location.$$url,
                    nameItem: $scope.item.section +' - '+ $scope.item.family +' - '+ $scope.item.model,
                    name:'Загрузите фото'
                });
                $scope.item.error = 1;
            } else {
                ErrorService.remove($stateParams.outletId,$scope.item.id, 'photos');
                $scope.item.error = 0;
            }

            if ($scope.item.price || $scope.item.price != 0){
                var categoryPhotos = _.filter($scope.category.photos, function(photo){
                    return !!photo.src;
                });

                if(categoryPhotos.length == 0) {
                    ErrorService.add({
                        marker:'photoscat',
                        outletId:$stateParams.outletId,
                        id: $scope.category.id,
                        url:$location.$$url.split('pricing')[0]+'pricing',
                        nameItem: $scope.category.title,
                        name:'Нет фотографии категории'
                    });
                    $scope.category.error = 1;
                } else {
                    ErrorService.remove($stateParams.outletId, $scope.category.id, 'photoscat');
                    $scope.category.error = 0;
                }
            }
            $rootScope.$broadcast('onErrorCount');
        }

        function watchField(newValue, oldValue){
            if(!_.isEqual(newValue, oldValue)){
                $scope.item.modified = 1;
                var TT = _.find($rootScope.Outlets,function(el){ return el.id == $stateParams.outletId});
                TT.modified = 1;
                _.find(TT.categories,function(el){ return el.id == $stateParams.categoryId}).modified = 1;
                validate();
            }
        }
        $scope.$watch('item', function(newValue, oldValue) {
            watchField(newValue, oldValue)
        },true);
        $scope.$watch('photos', function(newValue, oldValue) {
            watchField(newValue, oldValue)
        },true);
        //--------------end validate -------------------------------

        NavBar.backUrlState = 'goodtab.outlet-detail-category';
        $rootScope.$emit('NavBarBack',{v:true, categoryId: $scope.item.categoryId});
    });