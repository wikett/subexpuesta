'use strict';

var app = require('../..');
import request from 'supertest';

describe('Avisador API:', function() {

  describe('GET /api/avisadors', function() {
    var avisadors;

    beforeEach(function(done) {
      request(app)
        .get('/api/avisadors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          avisadors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      avisadors.should.be.instanceOf(Array);
    });

  });

});
