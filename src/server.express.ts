import express, { Express } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import winston from "winston";
import { createConnection } from "typeorm";
import "reflect-metadata";
import morgan from "morgan";
import http from "http";
import { logger } from "./logging/logger";
import { config } from "./bin/config";
import { cron } from "./cron/cron";
import { unprotectedRoute } from "./routes/unprotectedRoute.express";
import { protectedRoute } from "./routes/protectedRoute.express";
import { getToken } from "./controller/authentication.express";
import bearerToken from "express-bearer-token";

const app: Express = express();

/** Logging */
app.use(morgan("dev"));

/** Parse the request */
app.use(express.urlencoded({ extended: false }));

/** Takes care of JSON data */
app.use(express.json());


// Helmet provides important security headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "cdnjs.cloudflare.com",
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "cdnjs.cloudflare.com",
                "fonts.googleapis.com",
            ],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            imgSrc: [
                "'self'",
                "data:",
                "online.swagger.io",
                "validator.swagger.io",
            ],
        },
    })
);

// Enable cors with default options
app.use(cors());

// Logger middleware -> use winston as logger (logging.ts with config)
app.use(logger(winston));

// Unprotected Routes.
app.use("/", unprotectedRoute);

/** Bearer token for api request */
app.use(bearerToken());

app.use((req, res, next) => {
//if no auth token
// @ts-ignore no token type on req
if (!req.token) {
    res.statusMessage =
        "An Authentication token is required for this request.";
    res.status(401);
}
//@ts-ignore: no token type on req
const bearertoken = req.token;

//check auth token
if (bearertoken !== getToken()) {
    console.error(
        "The Authentication Token is incorrect or invalid.",
        bearertoken
    );
    res.statusMessage = "Authentication Token Unauthorized.";
    res.sendStatus(401);
} else {
    next();
}
});

// JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
// These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
app.use("/protected", protectedRoute);

// Register cron job to do any action needed
cron.start();

/** Error handling */
app.use((req, res, next) => {
    const error = new Error("not found");
    return res.status(404).json({
        message: error.message,
    });
});

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.SERVER_PORT;
httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
);


app.listen(config.port, () => {
console.log(`Server running on port ${config.port}`);
});
