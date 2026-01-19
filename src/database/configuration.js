let dbConfig = null;

export function setDbConfig(config) {
    dbConfig = config;
    console.log(dbConfig);
};

export function getDbConfig() {
    return dbConfig;
}