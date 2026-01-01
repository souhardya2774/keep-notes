const express= require("express");
const router= express.Router();
const passport= require("passport");

const Limiter= require("../middleware/loginLimiter");
const authController= require("../controllers/authControllers");
const { logger } = require("../middleware/logger");

router.route("/google")
    .get(Limiter,passport.authenticate('google', { scope: ['profile'] }));

router.route("/google/callback")
    .get(logger,passport.authenticate("google",{
        successRedirect: "http://localhost:5173",
        failureRedirect: "/login/failed"
    }));

router.route("/login/failed")
    .post(authController.loginFailed);

router.route("/check")
    .get(authController.checkLogin);

router.route("/logout")
    .get(authController.logout);

// Debug endpoint to test session
router.route("/session-test")
    .get((req, res) => {
        console.log('=== SESSION DEBUG ===');
        console.log('Session ID:', req.sessionID);
        console.log('Session:', req.session);
        console.log('User:', req.user);
        console.log('Session cookie:', req.sessionCookie);
        console.log('Cookies:', req.cookies);
        console.log('===================');
        
        res.json({
            sessionID: req.sessionID,
            hasSession: !!req.session,
            hasUser: !!req.user,
            user: req.user,
            session: req.session,
            cookies: req.cookies
        });
    });

// Test session creation endpoint
router.route("/create-session")
    .get((req, res) => {
        console.log('Creating test session...');
        req.session.testValue = 'session_created';
        console.log('Session after setting test value:', req.session);
        
        res.json({
            message: 'Session created',
            session: req.session,
            sessionID: req.sessionID
        });
    });

module.exports= router;