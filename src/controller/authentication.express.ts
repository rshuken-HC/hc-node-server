function getToken(): string | undefined {
    return process.env.BEARER_TOKEN;
}

function genToken() {
    const token = require("crypto").randomBytes(64).toString("hex");
    process.env.BEARER_TOKEN = token;
    console.log(
        `The new authentication token is: ${token}.
        Please share this with Harbor and add it to the env file.`
    );
}

export { getToken, genToken };
