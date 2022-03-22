import { SwaggerRouter } from "koa-swagger-decorator";
import { user, general } from "../controller";

const protectedRouter = new SwaggerRouter();
const testProtectedRouter = new SwaggerRouter();
// test routes are
testProtectedRouter.get("/auth", general.helloProtectedWorld);

// USER ROUTES
protectedRouter.get("/users", user.getUsers);
protectedRouter.get("/users/:id", user.getUser);
protectedRouter.post("/users", user.createUser);
protectedRouter.put("/users/:id", user.updateUser);
protectedRouter.delete("/users/:id", user.deleteUser);
protectedRouter.delete("/testusers", user.deleteTestUsers);

// Swagger endpoint
protectedRouter.swagger({
    title: "node-typescript-koa-rest",
    description:
        "API REST using NodeJS and KOA framework, typescript. TypeORM for SQL with class-validators. Middlewares JWT, CORS, Winston Logger.",
    version: "1.8.0",
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(__dirname);

export { protectedRouter, testProtectedRouter };
