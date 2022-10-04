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

const prompt = (message, def) => ({ message, def });

const pkgName = defaults.name(pkg.name);

const prompts = {
    name: prompt("package name"),
    version: prompt("version", "0.0.0"),
    description: prompt("description"),
    main: prompt("entry point", "index.js"),
    keywords: prompt("keywords"),
    author: prompt("author", "Luis Float <contact@luisfloat.com> (https://luisfloat.com)"),
    license: prompt("license", "UNLICENSED"),
    repository: prompt("repository", `luisfloat/${pkgName}`),
    homepage: prompt("homepage", `https://github.com/luisfloat/${pkgName}#readme`),
    bugs: prompt("bugs", `https://github.com/luisfloat/${pkgName}/issues`),
};

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