import Koa from "koa";
import jwt from "koa-jwt";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import winston from "winston";
import { createConnection, ConnectionOptions } from "typeorm";
import "reflect-metadata";
import { logger } from "./logging/logger";
import { config } from "./bin/config";
import { unprotectedRouter } from "./routes/unprotectedRoutes";
import { protectedRouter, testProtectedRouter } from "./routes/protectedRoutes";
import { cron } from "./cron/cron";
import { getToken } from "./controller/authentication.express";
import { bearerToken } from "koa-bearer-token";

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection()
    .then(async () => {
        const app = new Koa();

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

        // Enable bodyParser with default options
        app.use(bodyParser());

        // these routes are unprotected
        app.use(unprotectedRouter.routes()).use(
            unprotectedRouter.allowedMethods()
        );

        // swagger-json and swagger-html endpoints
        // not working at the moment, but will invesitgate
        // app.use(
        //     jwt({ secret: "thisshouldwork" })
        //     //.unless({ path: [/^\/swagger-/] })
        // );

        /** Bearer token for api request */
        app.use(bearerToken());

        app.use((ctx, next) => {
            const bearertoken = ctx.request.token;
            if (bearertoken !== getToken()) {
                const err = new Error("Include bearer token to authenticate");
                throw err;
            }
            console.log("Bearer Token Authorized");
            next();
        });

        // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
        // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
        app.use(testProtectedRouter.routes());
        //app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

        // Register cron job to do any action needed
        cron.start();

        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    })
    .catch((error: string) => console.log("TypeORM connection error: ", error));
