'use strict';

describe('Controller: SobremiCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var SobremiCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SobremiCtrl = $controller('SobremiCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
