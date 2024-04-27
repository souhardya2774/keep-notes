const { format }= require("date-fns");
const { v4:uuid }= require("uuid");
const fsW= require("fs");
const fs= require("fs/promises");

const path= require("path");

const logEvents=async (message, logFileName)=>{
    const dateTime= `${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`;
    const logItem= `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if(!fsW.existsSync(path.join(__dirname,"..","logs"))){
            await fs.mkdir(path.join(__dirname,"..","logs"));
        }
        await fs.appendFile(path.join(__dirname,"..","logs",logFileName),logItem);
    } catch (error) {
        console.log(error);
    }
};

const logger= (req,res,next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,"reqLog.log");
    next();
};

module.exports= {
    logEvents,
    logger
};