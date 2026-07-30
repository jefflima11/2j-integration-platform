import fs from 'fs';

const packageJson = JSON.parse(
    fs.readFileSync("./package.json", "utf8")
);

const version = packageJson.version;

const config = `
    export default {
        environment: "Simulação",
        port: 4030,
        service: "api-2j-sml",
        version: "${version}"
    };
`;

fs.writeFileSync("./src/config/build-config.js", config);

let iss = fs.readFileSync("./installers/sml/2j-system-api-sml.iss", "utf8");

iss = iss.replace(
    /#define MyAppVersion ".*"/,
    `#define MyAppVersion "${version}"`
);

fs.writeFileSync("./installers/sml/2j-system-api-sml.iss", iss);

console.log(`Configuração sml criada (${version})`);