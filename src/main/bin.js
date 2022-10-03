#!/usr/bin/env node

const colorette = require("colorette");
const { cyan } = colorette;
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const basename = path.basename(process.cwd());
const pkg = JSON.parse(fs.existsSync("package.json") && fs.readFileSync("package.json"));

const filters = {
    repository: (value) => value && {
        type: "git",
        url: `git+https://github.com/${value.replace("github:", "")}.git`,
    },
    bugs: (url) => url && { url },
    keywords: (s) => s && s.split(/\s+/),
};

const defaults = {
    name: (s) => s || basename,
    keywords: (s) => s && s.join(" "),
    repository: (s) => s && `${new URL(s.url).pathname.replace("/", "").replace(".git", "")}`,
    bugs: (s) => s && s.url,
};

const input = async (name, message, def) => (await inquirer.prompt({
    type: "input",
    name,
    message: message + ":",
    filter: filters[name],
    default: (defaults[name] && defaults[name](pkg[name])) || pkg[name] || def,
}))[name];

async function run() {
    const pkgName = defaults.name(pkg.name);

    const newPkg = {
        ...pkg,
        name: await input("name", "package name"),
        version: await input("version", "version", "0.0.0"),
        description: await input("description", "description"),
        main: await input("main", "entry point", "index.js"),
        keywords: await input("keywords", "keywords"),
        author: await input("author", "author", "Luis Float <contact@luisfloat.com> (https://luisfloat.com)"),
        license: await input("license", "license", "UNLICENSED"),
        repository: await input("repository", "repository", `luisfloat/${pkgName}`),
        homepage: await input("homepage", "homepage", `https://github.com/luisfloat/${pkgName}#readme`),
        bugs: await input("bugs", "bugs", `https://github.com/luisfloat/${pkgName}/issues`),
    };

    const json = JSON.stringify(newPkg, null, 2);
    console.log(cyan(`${json}`));

    const confirm = await inquirer.prompt({
        type: "confirm",
        default: true,
        name: "confirm",
        message: "Everything ok?",
    });

    if(confirm.value) {
        fs.writeFileSync("package.json", json);
    }
}

run();