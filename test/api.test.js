var supertest = require('supertest'),
    mongoose = require('mongoose'),
    Activity = require('../models/activity'),
    User = require('../models/user'),
    con = require('../connection'),
    expect = require('chai').expect;

var testConnect = con.setCon();


var app = require('../app');

var agent = supertest.agent(app);

var userSignup = {
    'email': 'mpjwall@gmail.com',
    'password': 'secret',
    'firstname': 'Mick',
    'lastname': 'Wall'
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

before(function(done) {
    mongoose.connection.on('open', done)
});

after(function(done) {
    Activity.remove({}, function(err) {
        console.log('collection removed')
    });

    User.remove({}, function(err) {
        console.log('collection removed')
    });

    done();
});


describe('testing api', function() {

    it('renders api index', function(done) {
        supertest(app).get('/api')
            .expect(200, done);
    });

    it('protects api if not authorised', function(done) {
        supertest(app).get('/api/activities')
            .expect(/please authenticate/, done);
    });

    it('login rejects unknown user', function(done) {

        agent.post('/api/login')
            .type('form')
            .send(notUser)
            .expect(/fail/, done);

    });

    it('registers successfully', function(done) {
        agent.post('/api/signup')
            .type('form')
            .send(userSignup)
            .expect(/success/, done);
    });

    it('can add new activity once logged in', function(done) {
        agent.post('/api/activity')
            .type('form')
            .send(newActivity)
            .expect(/new activity saved/, done);
    });

    it('renders can access activities once logged in', function(done) {
        agent.get('/api/activities')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(/distance/,done);
    });



});