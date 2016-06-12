'use strict';

describe('Controller: AvisadorCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var AvisadorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AvisadorCtrl = $controller('AvisadorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
