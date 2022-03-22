# Getting Started



- Install dependencies
```
yarn install

```
- Run the project directly in TS
```
yarn run watch-server
```

# Testing api authroization
Use postman and in the Authroization tab select the Type of Bearer Token. The test Bearer token is: 123
# To test the unprotected path us this address with no auth or with auth, it won't matter.
```
localhost:3000/
```
The expected message will read: 
"Hello World! This route is unprotected"

# To test the protected happy path use this address
```
locahost:3000/auth
```
The expected message will read: 
"Hello World! This route is PROTECTED!"

# To test the protected unhappy path, use this address but put the wrong token in the auth
```
locahost:3000/auth
```
The expected message will read: 
"Include bearer token to authenticate"

# Testing Docker
cd into the directory and type "docker-compose up"

# Unit Testing
cd into the direcotry and type "yarn test"

# Entities are setup to not sync with the database, the folders are ready for migrations
To test they db sync in side of ormconfig.json change: "synchronize": false, to 'true'