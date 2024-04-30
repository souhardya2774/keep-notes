require("dotenv").config();
const express= require("express");
const path= require("path");
const cookieSession= require("cookie-session");
const cors= require("cors");
const mongoose= require("mongoose");
const passport= require("passport");

const app= express();

const PORT= process.env.PORT || 8080;

const errorHandler= require("./middleware/errorHandler");
const corsOptions= require("./config/corsOptions");
const connectDB= require("./config/dbConnection");
const { logEvents }= require("./middleware/logger");
const passportSetup= require("./config/passportSetup");

connectDB();

app.set("trust proxy", 1); 
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY_1],
    maxAge: 7*24*60*60*1000,
    sameSite: "none"
}));
app.use(passport.initialize());
app.use(passport.session());


// app.use("/",require(path.join(__dirname,"routes","root")));
app.use("/auth",require("./routes/authRoutes"));
app.use("/notes",require("./routes/noteRoutes"));
app.use("/labels",require("./routes/labelRoutes"));


app.all("*",(req,res)=>{
    res.status(404);
    res.json({
        "message": "404 Not Found!"
    });
});

app.use(errorHandler);

mongoose.connection.once("open",()=>{
    console.log("Connected to MongoDB");
    app.listen(PORT,()=>{
        console.log(`Server listening to ${PORT}`);
    });
});

mongoose.connection.on("error",err=>{
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErr.log");
});