/**
 * Created by Russell on 5/11/2014.
 */
angular.module('app').controller('ssNavCtrl', function($scope, $location) {

    $scope.currentForm = $location.path();

    $scope.nav = function(requestType) {
        $location.path(requestType);
    };

});