'use strict';

describe('Service: localizaciones', function () {

  // load the service's module
  beforeEach(module('subexpuestaV2App'));

  // instantiate service
  var localizaciones;
  beforeEach(inject(function (_localizaciones_) {
    localizaciones = _localizaciones_;
  }));

  it('should do something', function () {
    expect(!!localizaciones).toBe(true);
  });

});
