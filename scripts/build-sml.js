import fs from 'fs';

const config = `
    export default {
        environment: "Simulação",
        port: 4030,
        service: "api-2j-sml",
        version: "3.0.5"
    };
`;

fs.writeFileSync("./src/config/build-config.js", config);

console.log("Configuração SML criada.");