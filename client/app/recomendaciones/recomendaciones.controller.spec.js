'use strict';

describe('Controller: RecomendacionesCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var RecomendacionesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecomendacionesCtrl = $controller('RecomendacionesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
