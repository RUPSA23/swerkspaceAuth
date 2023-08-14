class Settings {
    static _appProtocol = process.env.APP_PROTOCOL || "http";
    static _appUrl = process.env.APP_URL || "localhost";
    static _appPort = process.env.APP_PORT || "8000";
    
    static _dbProtocol = process.env.DB_PROTOCOL || "mongodb";
    static _dbHost = process.env.DB_HOST || "localhost";
    static _dbPort = process.env.DB_PORT && process.env.DB_PORT !== "" ? process.env.DB_PORT : null;
    static _dbUser = process.env.DB_USER && process.env.DB_USER !== "" ? process.env.DB_USER : null;
    static _dbPassword = process.env.DB_PASSWORD && process.env.DB_PASSWORD !== "" ? process.env.DB_PASSWORD : null;
    static _dbName = process.env.DB_NAME || "SwerkspaceAuth";

    static _accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
}

module.exports = Settings;