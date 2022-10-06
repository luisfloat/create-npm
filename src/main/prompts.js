const path = require("path");
const { readPkg } = require("./pkg.js");

const basename = path.basename(process.cwd());
const pkg = readPkg();
const pkgName = pkg.name || basename;

const prompts = {
    name: {
        message: "package name",
        def: pkgName,
    },
    version: {
        message: "version",
        def: "0.0.0",
    },
    description: {
        message: "description",
    },
    keywords: {
        message: "keywords",
        default: (s) => s && s.join(" "),
        filter: (s) => s && s.split(/\s+/),
    },
    main: {
        message: "entry point",
        def: "index.js",
    },
    author: {
        message: "author",
        def: "Luis Float <contact@luisfloat.com> (https://luisfloat.com)",
    },
    license: {
        message: "license",
        def: "UNLICENSED",
    },
    repository: {
        message: "github repository",
        def: `luisfloat/${pkgName}`,
        default: (s) => s && `${new URL(s.url).pathname.replace("/", "").replace(".git", "")}`,
        filter: (value) => value && {
            type: "git",
            url: `git+https://github.com/${value.replace("github:", "")}.git`,
        },
    },
    homepage: {
        message: "homepage url",
        def: `https://github.com/luisfloat/${pkgName}#readme`,
    },
    bugs: {
        message: "bugs url",
        def: `https://github.com/luisfloat/${pkgName}/issues`,
        default: (s) => s && s.url,
        filter: (url) => url && { url },
    },
};

module.exports = prompts;