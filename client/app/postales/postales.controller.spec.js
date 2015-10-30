'use strict';

describe('Controller: PostalesCtrl', function () {

  // load the controller's module
  beforeEach(module('subexpuestaV2App'));

  var PostalesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostalesCtrl = $controller('PostalesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
