const fs = require("fs");

const readPkg = () => JSON.parse(fs.existsSync("package.json") && fs.readFileSync("package.json"));

const writePkg = (json) => fs.writeFileSync("package.json", json);

module.exports = {
    readPkg,
    writePkg,
};