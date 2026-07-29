import fs from 'fs';

const config = `
    export default {
        environment: "Produção",
        port: 4010,
        service: "api-2j-prd",
        version: "3.0.5"
    };
`;

fs.writeFileSync("./src/config/build-config.js", config);

console.log("Configuração PRD criada.");