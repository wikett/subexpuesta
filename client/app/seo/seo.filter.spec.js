'use strict';

describe('Filter: seo', function () {

  // load the filter's module
  beforeEach(module('subexpuestaV2App'));

  // initialize a new instance of the filter before each test
  var seo;
  beforeEach(inject(function ($filter) {
    seo = $filter('seo');
  }));

  it('should return the input prefixed with "seo filter:"', function () {
    var text = 'angularjs';
    expect(seo(text)).toBe('seo filter: ' + text);
  });

});
