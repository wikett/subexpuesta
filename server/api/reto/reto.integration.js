'use strict';

var app = require('../..');
import request from 'supertest';

describe('Reto API:', function() {

  describe('GET /api/retos', function() {
    var retos;

    beforeEach(function(done) {
      request(app)
        .get('/api/retos')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          retos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      retos.should.be.instanceOf(Array);
    });

  });

});
