var supertest = require('supertest'),
    expect = require('chai').expect;

var app = require('../app');

describe('when user not logged in', function() {

    it('renders index page successfully', function(done) {
        supertest(app).get('/')
            .expect(200, done);
    });

    it('renders login page successfully', function(done) {
        supertest(app).get('/login')
            .expect(200, done);
    });

    it('renders signup page successfully', function(done) {
        supertest(app).get('/signup')
            .expect(200, done);
    });

    it('redirects for dashboard if not authenticated', function(done) {
        supertest(app).get('/dashboard')
            .end(function(err, res) {
                expect(res.header['location']).to.include('/login');
                done();
            });
    });

    it('redirects for activity if not authenticated', function(done) {
        supertest(app).get('/activity')
            .expect(302, done);
    });

    it('returns 404 for unknown page', function(done) {
        supertest(app).get('/somemissingpage')
            .expect(404, done);
    });

});