'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var retoCtrlStub = {
  index: 'retoCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var retoIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './reto.controller': retoCtrlStub
});

describe('Reto API Router:', function() {

  it('should return an express router instance', function() {
    retoIndex.should.equal(routerStub);
  });

  describe('GET /api/retos', function() {

    it('should route to reto.controller.index', function() {
      routerStub.get
        .withArgs('/', 'retoCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
