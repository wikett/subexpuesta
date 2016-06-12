'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var avisadorCtrlStub = {
  index: 'avisadorCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var avisadorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './avisador.controller': avisadorCtrlStub
});

describe('Avisador API Router:', function() {

  it('should return an express router instance', function() {
    avisadorIndex.should.equal(routerStub);
  });

  describe('GET /api/avisadors', function() {

    it('should route to avisador.controller.index', function() {
      routerStub.get
        .withArgs('/', 'avisadorCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
