

angular.module('starter', ['ionic', 'starter.controllers'])



.config(function($stateProvider, $urlRouterProvider, $compileProvider) {


  $stateProvider



      .state('user', {
          url: '/',
          templateUrl: 'templates/user.html',
          controller: 'UserCtrl'
      })
      .state('user-edit', {
          url: '^/user/:userId',
          templateUrl: 'templates/user-edit.html',
          controller: 'UserEditCtrl'
      })
      .state('login', {
          url: '/login',
          templateUrl: 'templates/m_authorize.html',
          controller: 'AuthorizeCtrl'
      })




  $urlRouterProvider.otherwise('/');

});

