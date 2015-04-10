'use strict';

describe('Controller: MejoraCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var MejoraCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MejoraCtrl = $controller('MejoraCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
