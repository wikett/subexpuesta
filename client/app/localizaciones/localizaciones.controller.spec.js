'use strict';

describe('Controller: LocalizacionesCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var LocalizacionesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LocalizacionesCtrl = $controller('LocalizacionesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
