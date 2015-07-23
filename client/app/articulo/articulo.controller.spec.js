'use strict';

describe('Controller: ArticuloCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var ArticuloCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArticuloCtrl = $controller('ArticuloCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
