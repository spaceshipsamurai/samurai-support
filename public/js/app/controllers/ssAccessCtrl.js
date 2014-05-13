/**
 * Created by Russell on 5/11/2014.
 */
angular.module('app').controller('ssAccessCtrl', function($scope, $location, $http) {

    $scope.serviceName = "Forums";

    $scope.submit = function() {

        console.log('submitting');
        $http.post('/issue', {
            project:'support',
            summary: $scope.summary,
            description: $scope.description,
            specialFields:[{
                name: 'subsystem',
                value: $scope.serviceName
            }, {
                name: 'Forum - Character Name',
                value: $scope.characterName,
                type: 'string'
            }, {
                name: 'API Key ID',
                value: $scope.keyId,
                type: 'string'
            }, {
                name: 'API Verification Code',
                value: $scope.vcode,
                type: 'string'
            }]
        }).success(function (data) {
            $location.path('/complete');
        }).error(function(error) {
            console.log(error);
        });

    };

});