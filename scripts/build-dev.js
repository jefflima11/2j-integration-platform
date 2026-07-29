import fs from 'fs';

const config = `
    export default {
        environment: "Desenvolvimento",
        port: 4020,
        service: "api-2j-dev",
        version: "3.0.5"
    };
`;

fs.writeFileSync("./src/config/build-config.js", config);

console.log("Configuração DEV criada.");