#!/usr/bin/env node

const colorette = require("colorette");
const { cyan } = colorette;
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const basename = path.basename(process.cwd());
const pkg = JSON.parse(fs.existsSync("package.json") && fs.readFileSync("package.json"));

const pkgName = pkg.name || basename;

const prompts = {
    name: {
        message: "package name",
        default: (s) => s || basename,
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
        message: "repository",
        def: `luisfloat/${pkgName}`,
        default: (s) => s && `${new URL(s.url).pathname.replace("/", "").replace(".git", "")}`,
        filter: (value) => value && {
            type: "git",
            url: `git+https://github.com/${value.replace("github:", "")}.git`,
        },
    },
    homepage: {
        message: "homepage",
        def: `https://github.com/luisfloat/${pkgName}#readme`,
    },
    bugs: {
        message: "bugs",
        def: `https://github.com/luisfloat/${pkgName}/issues`,
        default: (s) => s && s.url,
        filter: (url) => url && { url },
    },
};

const input = async (name, message, def) => (await inquirer.prompt({
    type: "input",
    name,
    message: message + ":",
    filter: prompts[name].filter,
    default: (prompts[name].default && prompts[name].default(pkg[name])) || pkg[name] || def,
}))[name];

async function run() {
    const newPkg = pkg;
    
    for(let k in prompts) {
        const p = prompts[k];
        newPkg[k] = await input(k, p.message, p.def);
    }
    
    const json = JSON.stringify(newPkg, null, 2);
    console.log(cyan(`${json}`));

    const confirm = await inquirer.prompt({
        type: "confirm",
        default: true,
        name: "confirm",
        message: "Is this OK?",
    });

    if(confirm.value) {
        fs.writeFileSync("package.json", json);
        return;
    }

    console.log("Aborted.");
}

run();