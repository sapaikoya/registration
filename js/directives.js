angular.module('starter.directives', [])


  .directive('horizontalSlider', function ($ionicGesture) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/d_horizontalSlider.html',
            scope:{
                photos: '=photo'
            },

           controller: function ($scope,$rootScope, $element){

               function rolling(){

                   var left = 0, window_width = $(window).width(),
                       current_active_foto =_.filter($scope.photos,function(el){ return el.show == 1}).length,
                       width_lenta = function(){ return window_width/4*(current_active_foto == $scope.photos.length?$scope.photos.length:current_active_foto+1)},
                       x = 0, max_x;

                   var handleDrag = function(e) {
                       x = Math.round(e.gesture.deltaX);


                       if((left+x) > 0){
                           x = 0;
                           left = 0;
                       }

                       max_x = (width_lenta() > window_width)?width_lenta() - window_width:0;

                       if(Math.abs(left+x) > max_x){
                           left = -max_x;
                           x =0;
                       }

                       $element.css({
                           '-webkit-transform': 'translate3d(' + (left + x) + 'px, 0, 0)'
                       });

                       if ($element.hasClass('slider-bounce')) {
                           $element.removeClass('slider-bounce');
                       }

                   };
                   var handleEndDrag = function(e){
                       left = left + x;
                   }

                   var releaseFn = function(e) {
                       var pattern = new RegExp('translate3d\\((-?[0-9]*)px, 0, 0\\)'),
                           pattern2 = new RegExp('(-?[0-9]*)px');

                       var transformMatches = pattern.exec($element.css('-webkit-transform')),
                           widthMatches = pattern2.exec($element.css('width'));
                       left = Math.round(transformMatches[1]);

                       if(widthMatches) {
                           var width = widthMatches[1];
                           if(left < (320 - width)) left = 320 - width;
                           if(left > 0) left = 0;
                           $element.addClass('slider-bounce');
                           $element.css({
                               '-webkit-transform': 'translate3d(' + left + 'px, 0, 0)'
                           });
                       }
                   };

                   var releaseGesture = $ionicGesture.on('release', releaseFn, $element);
                   var dragGesture = $ionicGesture.on('drag', handleDrag, $element);
                   $ionicGesture.on('dragend', handleEndDrag, $element);
                   $scope.$on('$destroy', function() {
                       $ionicGesture.off(dragGesture, 'drag', handleDrag);
                   });

               }
               rolling();
               function rebuildSlider(){

                   _.each($scope.photos,function(el){

                       if(el.src){
                           el.show = 1;
                       }else {
                           el.show = 0;
                       }

                       localStorage.setItem('Outlets',JSON.stringify($rootScope.Outlets));
                   });
                   rolling();
               }

               rebuildSlider();
               $rootScope.$on('onTakePhoto', rebuildSlider);
               $rootScope.$on('onDeletePhoto', rebuildSlider)

            }
        }
    })

  .directive('ngCounter', function() {
    return  {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            number: '=number'
        },
        templateUrl: 'templates/d_counter.html',
        controller: function($scope){

             $scope.changeNum = function(add) {
                 if(add){
                     $scope.number *= 1;
                     $scope.number += 1;
                 }else {
                     if($scope.number > 0) $scope.number -= 1;
                 }
            }
        }
    }
  })



    .directive('ngTakefoto', function(PhoneCamera, PhotoStorage) {
        return  {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope:{
                photo: '=photo',
                typeicon: '@typeicon'
            },
            templateUrl: 'templates/d_takefoto.html',
            controller: function($scope,$rootScope){

                $scope.takePhoto = function(){

                    if(navigator.camera) { // Работаем внутри эмулятора
                        PhoneCamera.getPicture().then(function(imageURI) {
                            $scope.lastPhoto = imageURI;
                            $scope.photo.src = imageURI;
                            PhotoStorage.store($scope.photo);
                            $rootScope.$broadcast('onTakePhoto');

                        }, function(err) {
                            console.log(err);
                        }, {
                            destinationType : Camera.DestinationType.FILE_URI,
                            quality: 75,
                            targetWidth: 320,
                            targetHeight: 320,
                            saveToPhotoAlbum: true
                        });
                    } else {  // Работаем внутри браузера
                        $scope.lastPhoto = 'img/promo/2.jpg';
                        $scope.photo.src = 'img/promo/2.jpg';
                        $rootScope.$broadcast('onTakePhoto');

                    }

                }

                $scope.deletePhoto = function(){
                    $scope.lastPhoto = '';
                    $scope.photo.src = '';
                    $scope.show = 0;
                    PhotoStorage.store('');
                    $rootScope.$broadcast('onDeletePhoto');
                }

            }
        }
    })
   ;