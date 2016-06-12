'use strict';

describe('Controller: RetosCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var RetosCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RetosCtrl = $controller('RetosCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
