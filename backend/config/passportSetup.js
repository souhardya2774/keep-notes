const passport= require("passport");
const googleStrategy= require("passport-google-oauth20").Strategy;
const User= require("../models/User");
const asyncHandler= require("express-async-handler");

passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},asyncHandler(
    async (accessToken, refreshToken, profile, cb)=>{
        console.log("Till du",profile.id);
        let user;
        try {
            user= await User.findOne({profileId: profile.id}).select("-labels -notes").lean().exec();
        } catch (err) {
            return cb(err,null);
        }
        if(!user){
            try {
                user= await User.create({
                    profileId: profile.id
                });
            } catch (err) {
                return cb(err,null);
            }
        }
    
        console.log(user);
    
        return cb(null,{
            id: user._id
        });
    }
))
);

passport.serializeUser((user,done)=>{
    console.log("User serialize",user);
    done(null,user);
});

passport.deserializeUser((user,done)=>{
    console.log("User deserialize",user);
    done(null,user);
});