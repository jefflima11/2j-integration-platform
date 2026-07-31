import fs from 'fs';

const packageJson = JSON.parse(
    fs.readFileSync("./package.json", "utf8")
);

const version = packageJson.version;

const config = `
    export default {
        environment: "Produção",
        folder: "prd",
        port: 4010,
        service: "api-2j-prd",
        version: "${version}"
    };
`;

fs.writeFileSync("./src/config/build-config.js", config);

let iss = fs.readFileSync("./installers/prd/2j-system-api-prd.iss", "utf8");

iss = iss.replace(
  /#define MyAppVersion ".*"/,
  `#define MyAppVersion "${version}"`
);

fs.writeFileSync("./installers/prd/2j-system-api-prd.iss", iss);

console.log(`Configuração prd criada (${version})`);