var supertest = require('supertest'),
    mongoose = require('mongoose'),
    Activity = require('../models/activity'),
    User = require('../models/user'),
    expect = require('chai').expect;


var app = require('../app');

var agent = supertest.agent(app);

var userSignup = {
    'email': 'mjpwall@gmail.com',
    'password': 'secret',
    'firstname': 'Mick',
    'lastname': 'Wall'
};

var userLogIn = {
    'email': 'mjpwall@gmail.com',
    'password': 'secret'
};

var existingUser = {
    'email': 'mjpwall@gmail.com',
    'password': 'anothersecret'
};

var notUser = {
    'email': 'me@me.com',
    'password': 'anothersecret'
};

var newActivity = {
    "location": "waterford",
    "type": "walk",
    "distance": "5k"
};

describe('testing session data', function() {

    it('registers successfully', function(done) {
        agent.post('/signup')
            .type('form')
            .send(userSignup)
            .end(function(err, res) {
                expect(res.header['location']).to.include('/dashboard');
                done();
            });
    });

    it('can access activity page once logged in', function(done) {
        agent.get('/activity')
            .expect(200, done);
    });

    it('can access dashboard page once logged in', function(done) {
        agent.get('/dashboard')
            .expect(200, done);
    });

    it('can add new activity once logged in', function(done) {
        agent.post('/activity')
            .type('form')
            .send(newActivity)
            .end(function(err, res) {
                expect(res.header['location']).to.include('/dashboard');
                done();
            });
    });

    it('user is logged out', function(done) {
        agent.get('/signout')
            .expect(302, done);
    });

    it('cannot access protected routes when signed out', function(done) {
        agent.get('/dashboard')
            .end(function(err, res) {
                expect(res.header['location']).to.include('/login');
                done();
            });
    });

    it('cannot sign up with existing user', function(done) {
        agent.post('/signup')
            .type('form')
            .send(existingUser)
            .end(function(err, res) {
                expect(res.header['location']).to.include('/signup');
                done();
            });
    });

    it('login rejects unknown user', function(done) {

        agent.post('/login')
            .type('form')
            .send(notUser)
            .end(function(err, res) {
                expect(res.header['location']).to.include('/login');
                done();
            });

    });

    it('login rejects unknown password', function(done) {

        agent.post('/login')
            .type('form')
            .send(existingUser)
            .end(function(err, res) {
                expect(res.header['location']).to.include('/login');
                done();
            });

    });


    it('logs in successfully - redirects to dashboard', function(done) {

        agent.post('/login')
            .type('form')
            .send(userLogIn)
            .end(function(err, res) {
                expect(res.header['location']).to.include('/dashboard');
                done();
            });

    });

});