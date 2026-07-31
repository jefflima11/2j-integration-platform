import fs from 'fs';

const packageJson = JSON.parse(
    fs.readFileSync("./package.json", "utf8")
);

const version = packageJson.version;

const config = `
    export default {
        environment: "Desenvolvimento",
        folder: "dev",
        port: 4020,
        service: "api-2j-dev",
        version: "${version}"
    };
`;

fs.writeFileSync("./src/config/build-config.js", config);

let iss = fs.readFileSync("./installers/dev/2j-system-api-dev.iss", "utf8");

iss = iss.replace(
  /#define MyAppVersion ".*"/,
  `#define MyAppVersion "${version}"`
);

fs.writeFileSync("./installers/dev/2j-system-api-dev.iss", iss);

console.log(`Configuração DEV criada (${version})`);