import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
    port: number;
    debugLogging: boolean;
    dbsslconn: boolean;
    jwtSecret: string;
    bearerToken: string;
    databaseUrl: string;
    dbEntitiesPath: string[];
    cronJobExpression: string;
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
    port: +(process.env.PORT || 3306),
    debugLogging: isDevMode,
    dbsslconn: !isDevMode,
    bearerToken: process.env.BEARER_TOKEN,
    jwtSecret: process.env.JWT_SECRET || "thisisasecret",
    databaseUrl:
        process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/apidb",
    dbEntitiesPath: [
        ...(isDevMode ? ["src/entity/**/*.ts"] : ["dist/entity/**/*.js"]),
    ],
    cronJobExpression: "0 * * * *",
};

export { config };
