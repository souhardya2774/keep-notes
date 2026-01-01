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
        console.log("=== GOOGLE STRATEGY CALLBACK ===");
        console.log("Google Profile ID:", profile.id);
        console.log("Profile:", profile);
        
        let user;
        try {
            user= await User.findOne({profileId: profile.id}).select("-labels -notes").lean().exec();
            console.log("Found user:", user);
        } catch (err) {
            console.error("Error finding user:", err);
            return cb(err,null);
        }
        
        if(!user){
            console.log("Creating new user for profile:", profile.id);
            try {
                user= await User.create({
                    profileId: profile.id,
                    displayName: profile.displayName,
                });
                console.log("Created user:", user);
            } catch (err) {
                console.error("Error creating user:", err);
                return cb(err,null);
            }
        }
    
        console.log("Final user object:", user);
        console.log("Serializing with ID:", user._id);
        console.log("=== END GOOGLE STRATEGY ===");
    
        return cb(null,{
            id: user._id
        });
    }
))
);

passport.serializeUser((user,done)=>{
    console.log("=== PASSPORT SERIALIZE ===");
    console.log("User object to serialize:", user);
    console.log("Serializing user ID:", user.id);
    done(null, user.id); // Only store the user ID
});

passport.deserializeUser(async (id, done)=>{
    console.log("=== PASSPORT DESERIALIZE ===");
    console.log("Deserializing user ID:", id);
    try {
        const user = await User.findById(id).select("-labels -notes").exec();
        console.log("Deserialized user:", user);
        done(null, user);
    } catch (err) {
        console.error("Error deserializing user:", err);
        done(err, null);
    }
});