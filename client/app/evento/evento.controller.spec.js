'use strict';

describe('Controller: EventoCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var EventoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventoCtrl = $controller('EventoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
