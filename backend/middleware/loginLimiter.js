const rateLimit= require("express-rate-limit");
const { logEvents }= require("./logger");

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	limit: 5, // Limit each IP to 5 requests per `window` (here, per minute).
    message: {
        message: "Too many attempts, pause for some times"
    },
    handler: (req, res, next, options)=>{
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,"errLog.log");
        res.status(options.statusCode).send(options.message);
    },
	standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

module.exports= limiter;