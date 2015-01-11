var express = require('express');
var router = express.Router();
var Activity = require('../models/activity');


var isAuthenticated = function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    req.flash('message', 'you must be logged in')
    res.redirect('/login');
}

module.exports = function(passport) {

    /* GET index page. */
    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('pages/index', {
            title: 'PaceMaker',
            pageName: 'home',
            message: req.flash('message')
        });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /* GET Registration Page */
    router.get('/signup', function(req, res) {
        res.render('pages/register', {
        	title: 'PaceMaker',
            pageName: 'signup',
            message: req.flash('message')
        });
    });

    router.get('/login', function(req, res) {
        res.render('pages/login', {
        	title: 'PaceMaker',
            pageName: 'login',
            message: req.flash('message')
        });
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    /* GET dashboard Page */
    router.get('/dashboard', isAuthenticated, function(req, res) {
        var activities;
        Activity.find({user: req.user },function(err, activity) {
            if (err) return next(err);
            activities = activity;
            res.render('pages/dashboard', {
            title: 'PaceMaker',
            pageName: 'dashboard',
            user: req.user,
            activities: activities
        });
        });
    });

    /* get activities page*/

    router.get('/activity', isAuthenticated, function(req, res) {
        res.render('pages/activity', {
            title: 'PaceMaker',
            pageName: 'activity',
            user: req.user
        });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

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

            res.redirect('/dashboard');
        });
    });

    return router;
}