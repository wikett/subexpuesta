'use strict';

describe('Service: mejora', function () {

  // load the service's module
  beforeEach(module('subexpuestaV2App'));

  // instantiate service
  var mejora;
  beforeEach(inject(function (_mejora_) {
    mejora = _mejora_;
  }));

  it('should do something', function () {
    expect(!!mejora).toBe(true);
  });

});
