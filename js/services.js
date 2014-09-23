angular.module('starter.services', [])

/**
 * A simple example service that returns some data.       */

.factory('NavBar', ['$stateParams', function($stateParams) {

    return {
        backUrlState:false

    }
}])
