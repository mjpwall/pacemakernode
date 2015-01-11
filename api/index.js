var express = require('express');
var router = express.Router();
var Activity = require('../models/activity');


var isAuthenticated = function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    res.json({
            message: 'please authenticate to use api'
        });
}

module.exports = function(passport) {

    /* GET api index page. */
    router.get('/', function(req, res) {
        res.json({
            message: 'please authenticate to use api'
        });

    });

    /* Handle Login POST */

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/api/login/success',
        failureRedirect: '/api/login/fail',
        failureFlash: true
    }));
 

    router.get('/login/success', function(req, res) {
        res.json({
            user: req.user
        });

    });

    router.get('/login/fail', function(req, res) {
        res.status(401).send({
            message: req.flash('message')
        });

    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/api/reg/success',
        failureRedirect: '/api/reg/fail',
        failureFlash: true
    }));

    router.get('/reg/success', function(req, res) {
        res.json({
            user: req.user
        });

    });

    router.get('/reg/fail', function(req, res) {
        res.status(401).send({
            message: req.flash('message')
        });

    });

     /* create activiyty */

    router.post('/activity', isAuthenticated, function(req, res) {
        // create a new instance of the Activity model
        var activity = new Activity();

        // set the activity information (comes from the request)

        activity.type = req.body.type;
        activity.location = req.body.location;
        activity.distance = req.body.distance;
        activity.user = req.user;

        // save the activity and check for errors
        activity.save(function(err) {
            if (err) res.send(err);
            res.json({
                message: 'new activity saved'
            })
        });
    });

    /* GET activities */
    router.get('/activities', isAuthenticated, function(req, res) {
        Activity.find({
            user: req.user
        }, function(err, activity) {
            
            if (err) return next(err);
            res.json({
                'activities' : activity,
                user : req.user
            });
        });
    });


    return router;
}